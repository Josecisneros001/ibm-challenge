import React, { Component } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import ECG from './ECG/ECG.js';
import ECGData from '../../../data/ECG.json';
import Covid19 from './Covid19/Covid19.js';
import PatientsInformation from '../PatientsInformation/PatientsInformation.js';
import './PatientsModal.css';


class PatientsModal extends Component {
    constructor(props) {
        super(props);
        this.patient = this.props.patient;
        this.wmlToken = this.props.wmlToken;
        this.updatePatients = this.props.updatePatients;
    }

    getTag(){
        const class_ = ECGData[this.patient.ECGid][0];
        let text='';
        switch(class_){
            case 0:
                text='Normal';
            break;
            case 1:
                text='VEB';
            break;
            case 2:
                text='SVT';
            break;
            case 3:
                text='Fusion';
            break;
            case 4:
                text='Unknown';
            break;
            default:
            break;
        }
        return text;
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
                            <Card.Header className='mb-2'>
                                <Row>
                                    <Col xs='9'>
                                        ECG
                                    </Col>
                                    <Col xs='3'>
                                        <span className="badge badge-dark">{this.getTag()}</span>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <ECG patient={ this.patient } updatePatients={ this.updatePatients } wmlToken={ this.wmlToken } ECGData={ ECGData } />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs='12'>
                    <Card>
                        <Card.Body>
                            <Card.Header className='mb-2'>COVID-19 AND PNEUMONIA DETECTION</Card.Header>
                            <Covid19 patient={ this.patient } updatePatients={ this.updatePatients } />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}
export default PatientsModal;
