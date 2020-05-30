import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import LineChart from 'react-linechart';
import APIData from '../../../../data/API.json';
import './ECG.css';

const URL_BACKEND = process.env.REACT_APP_URL_BACKEND;

class ECG extends Component {
    constructor(props) {
        super(props);
        this.ECGData = this.props.ECGData;
        this.patient = this.props.patient;
        this.wmlToken = this.props.wmlToken;
        this.updatePatients = this.props.updatePatients;
        this.state = {
            points: [],
        }
    }

    componentDidMount() {
        let newPoints = [];
        for (let i = 1; i < 187; i++) {
            newPoints.push({ x: 0.008 * i, y: this.ECGData[this.patient.ECGid][i] })
        }
        
        this.setState({ points: newPoints });
    }

    doRequest() {
        const data = APIData.WATSON_ECG;
        const wmlToken = "Bearer " + this.wmlToken;
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
                    "values": [this.ECGData[this.patient.ECGid].slice(1)]
                }]
            })
        }).then((response) => {
            if(response.status === 200){
                console.log(response.status);
                return response.json();
            }else{
                throw new Error('Something went wrong, WATSON ECG');
            }
        }).then((responseData) => {
            this.saveResults(responseData["predictions"][0]["values"][0][1]);
        }).catch(function (err) {
            console.log(err);
        })
    }

    saveResults(probabilities){
        
        for(let i in probabilities){
            probabilities[i] = parseInt(probabilities[i]*10000)/100;
        }

        const reqBody = {
            "ECGresult":{
                "normal" : probabilities[0],
                "veb" :  probabilities[1],      
                "svt" :  probabilities[2],      
                "fusion" :  probabilities[3]  
            }
        };
        
        this.updatePatients('ECG',this.patient.index,reqBody.ECGresult);
        fetch(URL_BACKEND+'patient/' + this.patient.id, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(reqBody)
        }).then((response) => {
            if(response.status !== 202){
                throw new Error('Something went wrong');
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
                                    {this.patient.ECGresult.normal}%
                                </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col className='resultTitle' xs='6'>
                                    <span title='Ventricular Ectopic Beat' >VEB:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </Col>
                                <Col xs='6'>
                                    {this.patient.ECGresult.veb}%
                                </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col className='resultTitle' xs='6'>
                                    <span title='Supraventricular Tachycardia Beat' >SVT:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </Col>
                                <Col xs='6'>
                                    {this.patient.ECGresult.svt}%
                                </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col className='resultTitle' xs='6'>
                                <span title='Fusion Beat' >Fusion:&nbsp;&nbsp;</span>
                                </Col>
                                <Col xs='6'>
                                    {this.patient.ECGresult.fusion}%
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
