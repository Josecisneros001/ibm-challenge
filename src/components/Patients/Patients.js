import React, { Component } from 'react';
import {Modal, Card, Col, Row, FormControl} from 'react-bootstrap';
import PatientsInformation from './PatientsInformation/PatientsInformation.js';
import PatientsModal from './PatientsModal/PatientsModal.js';
import patientsList from '../../data/patients.json';
import './Patients.css';


class Patients extends Component { 
    constructor(props){
        super(props);
        this.handleModalShow = this.handleModalShow.bind(this);
        this.doFilter = this.doFilter.bind(this);
        this.bringPatients = this.bringPatients.bind(this);
        
        this.state={
            patients:[],
            patient: {},
            filter: '',
            showModal: false,
        };
    }
    
    componentDidMount(){
        this.setState({ 
            patients: patientsList.patients,
        });
    }

    handleModalShow(show,patient){
        this.setState({
            showModal:show,
            patient:patient
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
                    <Card className='card-content' onClick={()=>{this.handleModalShow(true,patient)}}>
                        <Card.Body>
                            <Card.Title className='cardTitle'>{patient.name+' '+patient.lastName}</Card.Title>
                            <PatientsInformation patient={ patient } />
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
                <Modal
                    dialogClassName="modal-90w"
                    show={this.state.showModal}
                    onHide={() => this.handleModalShow(false)}
                    aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        { typeof this.state.patient == 'undefined' ? '' : 
                        this.state.patient.name+' '+this.state.patient.lastName }
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PatientsModal patient={this.state.patient} />
                    </Modal.Body>
                </Modal>
            </Row>
        );
    }
}
export default Patients;
