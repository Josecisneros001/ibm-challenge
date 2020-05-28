import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import LineChart from 'react-linechart';
import ECGData from '../../../../data/ECG.json';
import APIData from '../../../../data/API.json';
import base64 from 'base-64';
import './ECG.css';


class ECG extends Component {
    constructor(props) {
        super(props);
        this.patient = this.props.patient;
        this.state = {
            points: [],
        }
    }
    
    componentDidMount() {
        let newPoints = [];
        for (let i = 1; i < 187; i++) {
            newPoints.push({ x: 0.008 * i, y: ECGData[70][i] })
        }
        
        this.setState({ points: newPoints });
    }
    
    
    updateToken() {
        const data = APIData.WATSON_ECG.TOKEN;
        const authorization = 'Basic ' + base64.encode(data.USER+':'+data.PASSWORD);
        fetch( data.URL , {
            method: 'POST',
            headers: {
                'Authorization': authorization, 
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "apikey=" + data.API_KEY + "&grant_type=urn:ibm:params:oauth:grant-type:apikey"
        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            data.VALUE = responseData['access_token'];
            console.log(data.VALUE);
        }).catch(function (err) {
            console.log(err);
        })
    }

    doRequest() {
        const data = APIData.WATSON_ECG;
        const wmlToken = "Bearer " + data.TOKEN.VALUE;
        const mlInstanceId = data.INSTANCE;
        
        fetch(data.URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': wmlToken, 
                'Content-Type': 'application/json;charset=UTF-8',
                'ML-Instance-ID': mlInstanceId,
            },
            body: JSON.stringify({
                "input_data": [{
                    "fields": data.FIELDS,
                    "values": [ECGData[0].slice(1)]
                }]
            })
        }).then((response) => {
            if(response.status === 401){
                this.updateToken();
            }else{
                return response.json();
            }
        }).then((responseData) => {
            console.log(responseData);
        }).catch(function (err) {
            console.log(err);
        })
    }

    render() {
        const data = [
            {
                color: "steelblue",
                points: this.state.points,
            }
        ];
        return (
            <Row className='m-0'>
                <Col xs='12' md='12' className='lineChart-container'>
                    <LineChart
                        hidePoints={true}
                        hideXAxis={true}
                        hideYAxis={true}
                        width={275}
                        height={200}
                        data={data}
                    />
                </Col>
                <Col xs='12'>
                    <Row className='mt-0 justify-content-center'>
                        <Col xs ='8' lg='6'>
                            <Button 
                                variant='light'
                                className='width-btn btn-block'
                                onClick={ () => this.doRequest() } 
                                custom
                                >
                                RUN TEST
                            </Button>
                        </Col>
                    </Row>
                    <Row className='mt-4 resultsECGTable'>
                        <Col xs='12'>
                            <Row className='mb-2 resultsTitle justify-content-center'>
                                <Col sm='8'>
                                    RESULTS
                                </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col className='resultTitle' xs='6'>
                                    <span title='Normal Beat' >Normal:</span>
                                </Col>
                                <Col xs='6'>
                                    {0.98}%
                                </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col className='resultTitle' xs='6'>
                                    <span title='Ventricular Ectopic Beat' >VEB:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </Col>
                                <Col xs='6'>
                                    {0.98}%
                                </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col className='resultTitle' xs='6'>
                                    <span title='Supraventricular Tachycardia Beat' >SVT:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </Col>
                                <Col xs='6'>
                                    {0.98}%
                                </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col className='resultTitle' xs='6'>
                                <span title='Fusion Beat' >Fusion:&nbsp;&nbsp;</span>
                                </Col>
                                <Col xs='6'>
                                    {0.98}%
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}
export default ECG;
