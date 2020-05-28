import React, { Component } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import APIData from '../../../../data/API.json';
import base64 from 'base-64';
import $ from 'jquery';
import './Covid19.css';


class Covid19 extends Component {
    constructor(props) {
        super(props);
        this.patient = this.props.patient;
        this.handleFile = this.handleFile.bind(this);
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
        formData.append('upload_preset', data.PRESET);
        formData.append("api_key", data.API_KEY);
        formData.append("api_secret", data.API_SECRET);
        formData.append("timestamp", (Date.now() / 1000) | 0);
    
        fetch(data.URL, {
            method: 'POST',
            body: formData
        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            console.log(responseData.url);
        }).catch(function (err) {
            console.log(err);
        });

        this.removeFile();
    }

    doImgAPICall() {
        const data = APIData.WATSON_IMG;
        const authorization = 'Basic ' + base64.encode('apiKey:' + data.API_KEY);

        fetch( data.URL , {
            method: 'POST',
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                "classifier_ids": data.CLASSIFIER,
                "url": this.patient.img,
                "threshold": data.THRESHOLD
            })
        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            console.log(responseData);
        }).catch(function (err) {
            console.log(err);
        })
    }

    render() {
        return (
            <Row className='justify-content-center'>
                <Col xs='12' sm='6' lg='5'>
                    <img src={this.patient.img} className='radio-img' />
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
                                custom
                                onChange={this.handleFile}
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
                                custom
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
                                custom
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
                                onClick={() => this.doImgAPICall()}
                                custom
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
                                    Normal:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </Col>
                                <Col xs='5'>
                                    {0.98}%
                            </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col className='resultTitle' xs='6'>
                                    Pneumonia:
                            </Col>
                                <Col xs='5'>
                                    {0.98}%
                            </Col>
                            </Row>
                            <Row className='justify-content-center'>
                                <Col className='resultTitle' xs='6'>
                                    Covid19:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </Col>
                                <Col xs='5'>
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
export default Covid19;
