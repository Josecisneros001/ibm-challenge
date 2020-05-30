import React, { Component } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import APIData from '../../../../data/API.json';
import placeholder from '../../../../images/placeholder-rectangle.png';
import base64 from 'base-64';
import $ from 'jquery';
import './Covid19.css';

const URL_BACKEND = process.env.REACT_APP_URL_BACKEND;

class Covid19 extends Component {
    constructor(props) {
        super(props);
        this.patient = this.props.patient;
        this.updatePatients = this.props.updatePatients;
        this.handleFile = this.handleFile.bind(this);
        this.saveResults = this.saveResults.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.state = {
            file: '',
        }
    }
    
    handleFile(e) {
        this.setState({ file: e.target.value.replace(/\\/g, '/').replace(/.*\//, '') });
    }


    removeFile(e) {
        $("#addFile").val('');
        this.setState({ file: '' });
    }

    uploadFile() {
        const data = APIData.CLOUDINARY;
        const formData = new FormData();
        formData.append('file', $("#addFile")[0].files[0]);
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
        formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
        formData.append("api_secret", process.env.REACT_APP_CLOUDINARY_API_SECRET);
        formData.append("timestamp", (Date.now() / 1000) | 0);
    
        fetch(data.URL, {
            method: 'POST',
            body: formData
        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            this.saveFile(responseData.url);
        }).catch(function (err) {
            console.log(err);
        });

        this.removeFile();
    }

    saveFile(url){
        const reqBody = {
            "xRayImg": url
        };
        
        this.updatePatients('xRayImg',this.patient.index,url);

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

    doImgAPICall() {
        const data = APIData.WATSON_IMG;
        const authorization = 'Basic ' + base64.encode('apikey:' + process.env.REACT_APP_WATSON_API);
        let bodyReq = new FormData();
        bodyReq.append('url', this.patient.xRayImg);
        bodyReq.append('classifier_ids', data.CLASSIFIER);
        bodyReq.append('threshold', 0);

        fetch( data.URL , {
            method: 'POST',
            headers: {
                'Authorization': authorization,
            },
            body: bodyReq
        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            this.saveResults(responseData["images"][0]["classifiers"][0]["classes"]);
        }).catch(function (err) {
            console.log(err);
        })
    }

    saveResults(classes){
        const reqBody = {
            "ImgResult":{
                "normal" : 0.0,
                "pneumonia" :  0.0,      
                "covid19" :  0.0,      
            }
        }; 
        console.log(classes);
        classes.forEach(element => {
            switch(element.class){
                case "COVID19":
                    reqBody["ImgResult"]["covid19"]=element.score;
                break;
                case "Viral Pneumonia":
                    reqBody["ImgResult"]["pneumonia"]=element.score;
                break;
                default:
                    reqBody["ImgResult"]["pneumonia"]=element.score;
                break;
            }
        });

        this.updatePatients('ImgResult',this.patient.index,reqBody.ImgResult);
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
        console.log(this.patient.xRayImg)
        return (
            <Row className='justify-content-center'>
                <Col xs='12' sm='6' lg='5'>
                    <img 
                        src={this.patient.xRayImg === '' || !this.patient.xRayImg ? placeholder : this.patient.xRayImg } 
                        className='radio-img' 
                        alt={this.patient.xRayImg === '' || !this.patient.xRayImg ? 'No File' : 'X-Ray Img' } 
                    />
                </Col>
                <Col xs='12' sm='6' className='mt-3'>
                    <Row className='mb-2 justify-content-center'>
                        <Col xs='12' md='10'>
                            <Form.File
                                className='file-input'
                                id='addFile'
                                accept='.png,.jpeg,jpg'
                                title={this.state.file === '' ? 'No File' : this.state.file}
                                label={this.state.file === '' ? 'Choose File' : this.state.file}
                                onChange={this.handleFile}
                                custom
                            />
                        </Col>
                    </Row>
                    <Row className='mt-2 justify-content-center'>
                        <Col xs='8' lg='6'>
                            <Button
                                variant='light'
                                className='width-btn'
                                disabled={this.state.file === ''}
                                onClick={this.removeFile}
                            >
                                CLEAR
                        </Button>
                        </Col>
                    </Row>
                    <Row className='mt-2 justify-content-center'>
                        <Col xs='8' lg='6'>
                            <Button
                                variant='light'
                                className='width-btn'
                                disabled={this.state.file === ''}
                                onClick={() => this.uploadFile()}
                            >
                                UPLOAD
                        </Button>
                        </Col>
                    </Row>
                    <Row className='mt-5 justify-content-center'>
                        <Col xs='8' lg='6'>
                            <Button
                                variant='light'
                                className='width-btn btn-block'
                                disabled={this.patient.xRayImg === ''}
                                onClick={() => this.doImgAPICall()}
                            >
                                GET RESULTS
                        </Button>
                        </Col>
                    </Row>
                    <Row className='mt-4 resultsTable'>
                        <Col xs='12'>
                            <Row className='mb-2 justify-content-center'>
                                <Col sm='6'>
                                    RESULTS
                            </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col className='resultTitle' xs='6'>
                                    Pneumonia:
                            </Col>
                                <Col xs='5'>
                                    {this.patient.ImgResult.pneumonia}%
                            </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col className='resultTitle' xs='6'>
                                    Covid19:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </Col>
                                <Col xs='5'>
                                    {this.patient.ImgResult.covid19}%
                            </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}
export default Covid19;
