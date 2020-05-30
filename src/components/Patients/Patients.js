import React, { Component } from 'react';
import {Modal, Card, Col, Row, FormControl} from 'react-bootstrap';
import PatientsInformation from './PatientsInformation/PatientsInformation.js';
import PatientsModal from './PatientsModal/PatientsModal.js';
import AddPatient from './AddPatient/AddPatient.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import APIData from '../../data/API.json';
import base64 from 'base-64';
import './Patients.css';

const URL_BACKEND = process.env.REACT_APP_URL_BACKEND;

class Patients extends Component { 
    constructor(props){
        super(props);
        this.updatePatients = this.updatePatients.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
        this.handleAddModalShow = this.handleAddModalShow.bind(this);
        this.doFilter = this.doFilter.bind(this);
        this.bringPatients = this.bringPatients.bind(this);
        
        this.state={
            wmlToken:'',
            patients:[],
            patient: {},
            filter: '',
            showModal: false,
            showAddModal: false,
        };
    }
    
    componentDidMount(){
        fetch(URL_BACKEND+'patient/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            }
        }).then((response) => {
            if(response.status !== 200){
                throw new Error('Something went wrong');
            }else{
                return response.json();
            }
        }).then((responseData) => {
            this.setState({ patients:responseData });
        }).catch(function (err) {
            console.log(err);
        });

        fetch(URL_BACKEND+'var/TOKEN', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            }
        }).then((response) => {
            if(response.status !== 200){
                throw new Error('Something went wrong');
            }else{
                return response.json();
            }
        }).then((responseData) => {
            if(this.getSecondsElapsed(new Date(responseData.updatedAt)) >= 3600){
                this.updateToken();
            }else{
                this.setState({wmlToken : responseData.value})
            }

        }).catch(function (err) {
            console.log(err);
        })

    }

    getSecondsElapsed(oldTime){
        var actualTime= new Date();
        console.log((actualTime-oldTime) / 1000);
        return (actualTime-oldTime) / 1000;
    }

    updateToken() {
        const api_key = process.env.REACT_APP_TOKEN_API;
        const data = APIData.WATSON_ECG.TOKEN;
        const authorization = 'Basic ' + base64.encode(data.USER+':'+data.PASSWORD);
        fetch( data.URL , {
            method: 'POST',
            headers: {
                'Authorization': authorization, 
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "apikey=" + api_key + "&grant_type=urn:ibm:params:oauth:grant-type:apikey"
        }).then((response) => {
            return response.json();
        }).then((responseData) => {
            this.setState({wmlToken:responseData['access_token']});
            this.saveToken(responseData['access_token']);
        }).catch(function (err) {
            console.log(err);
        })
    }

    saveToken(newToken){
        fetch(URL_BACKEND+'var/TOKEN', {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                value: newToken
            })
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


    handleModalShow(show,patient){
        this.setState({
            showModal:show,
            patient:patient
        });
    }

    handleAddModalShow(show){
        this.setState({
            showAddModal:show,
        });
    }

    doFilter(e){
        this.setState({ filter: e.target.value});
    }

    bringPatients(){
        if(typeof this.state.patients !== 'undefined' && this.state.patients.length > 0)
            return this.state.patients.map((patient,index)=>{
                patient['index']=index;
                const patientFullName=patient.firstName+' '+patient.lastName;
                if(patientFullName.toLowerCase().search(this.state.filter.toLowerCase()) !== -1)
                    return (
                        <Col className='card-container' key={index} xs='10' sm='6' md='4' lg='4' xl='3'>
                            <Card className='card-content' onClick={()=>{this.handleModalShow(true,patient)}}>
                                <Card.Body>
                                    <Card.Title className='cardTitle'>{patient.firstName+' '+patient.lastName}</Card.Title>
                                    <PatientsInformation patient={ patient } />
                                </Card.Body>
                                <Card.Footer>
                                    <small className='text-muted'>Last updated {patient.update} mins ago</small>
                                </Card.Footer>
                            </Card>
                        </Col>
                    )
                return null;
            });
    }

    updatePatients(action,index,params){
        let patients = this.state.patients;
        switch(action){
            case 'ECG':
                patients[index].ECGresult = params;
                this.setState({ patients:patients, patient: patients[index] });
            break;
            case 'xRayImg':
                patients[index].xRayImg = params;
                this.setState({ patients:patients, patient: patients[index] });
            break;
            case 'ImgResult':
                patients[index].ImgResult = params;
                this.setState({ patients:patients, patient: patients[index] });
            break;
            case 'addPatient':
                patients.push(params);
                this.setState({ patients:patients });
            break;
            default:
            break;
        }
    }

    render() {
        return(
            <Row className='patients-contanier'>
                <div className='patient-plus'>
                    <FontAwesomeIcon icon={faUserPlus} onClick={() => { this.handleAddModalShow(true); }} />
                </div>
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
                        this.state.patient.firstName+' '+this.state.patient.lastName }
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PatientsModal patient={this.state.patient} wmlToken={this.state.wmlToken} updatePatients={ this.updatePatients } />
                    </Modal.Body>
                </Modal>
                <Modal
                    dialogClassName="modal-90w"
                    show={this.state.showAddModal}
                    onHide={() => this.handleAddModalShow(false)}
                    aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        New Patient
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddPatient showFunc={this.handleAddModalShow} updatePatients={ this.updatePatients } />
                    </Modal.Body>
                </Modal>
            </Row>
        );
    }
}
export default Patients;
