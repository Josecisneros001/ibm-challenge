import React, { Component } from 'react';
import { Card, Col, Row, Form, Button } from 'react-bootstrap';
import ECG from './ECG/ECG.js';
import Covid19 from './Covid19/Covid19.js';
import PatientsInformation from '../PatientsInformation/PatientsInformation.js';
import $ from 'jquery';
import './PatientsModal.css';


class PatientsModal extends Component {
    constructor(props) {
        super(props);
        this.patient = this.props.patient;
    }
    
    render() {
        return (
            <Row className='patientsModal-contanier m-0'>
                <Col xs='12' sm='6' className='mb-3'>
                    <Card>
                        <Card.Body>
                            <Card.Header className='mb-2'>GENERAL INFORMATION</Card.Header>
                            <PatientsInformation patient={ this.patient } />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs='12' sm='6' className='mb-3'>
                    <Card>
                        <Card.Body>
                            <Card.Header className='mb-2'>ECG</Card.Header>
                            <ECG patient={ this.patient } />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs='12'>
                    <Card>
                        <Card.Body>
                            <Card.Header className='mb-2'>COVID-19 AND PNEUMONIA DETECTION</Card.Header>
                            <Covid19 patient={ this.patient } />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}
export default PatientsModal;
