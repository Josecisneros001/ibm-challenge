import React, { Component } from 'react';
import { Col, Row} from 'react-bootstrap';
import './PatientsInformation.css';


class PatientsInformation extends Component {
    constructor(props) {
        super(props);
        this.patient = this.props.patient;
    }

    render() {
        return (
            <>
                <Row className='dataRow'>
                    <Col xs='6'>
                        <Row className='dataTitle m-0'>GENRE</Row>
                        <Row className='dataInfo m-0'>{this.patient.genre} </Row>
                    </Col>
                    <Col xs='6'>
                        <Row className='dataTitle m-0'>ABO</Row>
                        <Row className='dataInfo m-0'>{this.patient.bloodType} </Row>
                    </Col>
                    <Col xs='6'>
                        <Row className='dataTitle m-0'>ROOM</Row>
                        <Row className='dataInfo m-0'>{this.patient.room} </Row>
                    </Col>
                    <Col xs='6'>
                        <Row className='dataTitle m-0'>DOB</Row>
                        <Row className='dataInfo m-0'>{this.patient.dob} </Row>
                    </Col>
                </Row>
                <Row className='dataRow'>
                    <Col xs='12'>
                        <Row className='dataTitle m-0'>REG. REASON</Row>
                        <Row className='dataInfo m-0'>{this.patient.reason} </Row>
                    </Col>
                </Row>
            </>
        );
    }
}
export default PatientsInformation;
