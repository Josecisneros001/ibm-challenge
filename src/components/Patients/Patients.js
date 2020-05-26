import React, { Component } from 'react';
import {Card, Col, Row, FormControl} from 'react-bootstrap';
import patientsList from '../../data/patients.json'
import './Patients.css';


class Patients extends Component { 
    constructor(props){
        super(props);
        
        this.doFilter = this.doFilter.bind(this);
        this.bringPatients = this.bringPatients.bind(this);
        
        this.state={
            patients:[],
            filter: '',
        };
    }
    
    componentDidMount(){
        this.setState({ 
            patients: patientsList.patients,
        });
    }

    doFilter(e){
        this.setState({ filter: e.target.value});
    }

    bringPatients(){
        return this.state.patients.map((patient)=>{
            const patientFullName=patient.name+' '+patient.lastName;
            if(patientFullName.toLowerCase().search(this.state.filter.toLowerCase()) === -1){
                return <></>;
            }
            return (
                <Col className='card-container' key={patient.id} xs='10' sm='6' md='4' lg='4' xl='3'>
                    <Card className='card-content'>
                        <Card.Body>
                            <Card.Title className='cardTitle'>{patient.name+' '+patient.lastName}</Card.Title>
                            <Row className='dataRow'>
                                <Col xs='6'>
                                    <Row className='dataTitle m-0'>GENRE</Row>
                                    <Row className='dataInfo m-0'>{patient.genre} </Row>
                                </Col>
                                <Col xs='6'>
                                    <Row className='dataTitle m-0'>ABO</Row>
                                    <Row className='dataInfo m-0'>{patient.bloodType} </Row>
                                </Col>
                                <Col xs='6'>
                                    <Row className='dataTitle m-0'>ROOM</Row>
                                    <Row className='dataInfo m-0'>{patient.room} </Row>
                                </Col>
                                <Col xs='6'>
                                    <Row className='dataTitle m-0'>DOB</Row>
                                    <Row className='dataInfo m-0'>{patient.dob} </Row>
                                </Col>
                            </Row>
                            <Row className='dataRow'>
                                <Col xs='12'>
                                    <Row className='dataTitle m-0'>REG. REASON</Row>
                                    <Row className='dataInfo m-0'>{patient.reason} </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <small className='text-muted'>Last updated {patient.update} mins ago</small>
                        </Card.Footer>
                    </Card>
                </Col>
            )
        });
    }

    render() {
        return(
            <Row className='patients-contanier'>
                <Col xs='10'>
                    <Row className='search-bar'>
                        <Col xs="10" sm="8" md="6">
                            <FormControl
                                type='text'
                                placeholder="Search by Name"
                                aria-label="search"
                                onChange={this.doFilter}
                            />
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        {this.bringPatients()}
                    </Row>
                </Col>
            </Row>
        );
    }
}
export default Patients;
