import React, { Component } from 'react';
import { Col, Row, FormControl, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import $ from 'jquery';
import './AddPatient.css';

const bloodTypes = [
    "O+",
    "O-",
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
];

const URL_BACKEND = process.env.REACT_APP_URL_BACKEND;

class AddPatient extends Component {
    constructor(props) {
        super(props);
        this.updatePatients= this.props.updatePatients;
        this.showModal= this.props.showFunc;
        this.handleChange = this.handleChange.bind(this);
        this.getDate = this.getDate.bind(this);
        this.savePatient = this.savePatient.bind(this);
        this.state ={
            dob: new Date(),
        }
    }
    
    handleChange(newDate){
        this.setState({dob:newDate})
    }

    getDate(){
        const yy = this.state.dob.getFullYear();
        let mm = this.state.dob.getMonth() + 1;
        let dd = this.state.dob.getDate();
        mm = (mm>9 ? '' : '0') + mm;
        dd = (dd>9 ? '' : '0') + dd;

        return yy+'-'+mm+'-'+dd;
    }

    savePatient(){
        let newPatient={
            "firstName": $("#firstName").val(),
            "lastName": $("#lastName").val(),
            "dob": this.getDate(),
            "reason": $("#reason").val(),
            "room": Number($("#room").val()),
            "update": Math.floor( Math.random()*100 ) + 1,
            "bloodType": $("#abo").val(),
            "genre": $("#genre").val(),
            "ECGresult":{
                "normal" : 0,
                "veb" : 0,      
                "svt" : 0,      
                "fusion" : 0  
            },
            "ECGid": Math.floor( Math.random()*120 ),
            "xRayImg":"",
            "ImgResult":{
                "normal": 0,
                "pneumonia":0,
                "covid19":0
            }
        };
        this.addPatient(newPatient);
        this.showModal(false);
    }

    addPatient(patient) {
        fetch(URL_BACKEND+'patient/new', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify(patient)
        }).then((response) => {
            if(response.status !== 201){
                throw new Error('Something went wrong');
            }else{
                return response.json();
            }
        }).then((responseData) => {
            console.log(responseData);
            patient['id']=responseData['id'];
            this.updatePatients('addPatient', -1, patient);
        }).catch(function (err) {
            console.log(err);
        })
    }

    
    render() {
        return (
            <Row className='addPatient justify-content-center'>
                <Col className='mb-3' xs='6'>
                    <Row className='dataTitleNew m-0'>First Name:</Row>
                    <Row className='dataInfoNew m-0'>
                        <FormControl
                            type='text'
                            id='firstName'
                            aria-label="search"
                            onChange={this.doFilter}
                        />    
                    </Row>
                </Col>
                <Col className='mb-3' xs='6'>
                    <Row className='dataTitleNew m-0'>Last Name:</Row>
                    <Row className='dataInfoNew m-0'>
                        <FormControl
                            type='text'
                            id='lastName'
                            onChange={this.doFilter}
                        />    
                    </Row>
                </Col>
                <Col className='mb-3' xs='6'>
                    <Row className='dataTitleNew m-0'>Genre:</Row>
                    <Row className='dataInfoNew m-0'>
                        <FormControl
                            as='select'
                            id='genre'
                            onChange={this.doFilter}
                        >
                            <option>MALE</option>
                            <option>FEMALE</option>
                        </FormControl>    
                    </Row>
                </Col>
                <Col className='mb-3' xs='6'>
                    <Row className='dataTitleNew m-0'>Blood Type:</Row>
                    <Row className='dataInfoNew m-0'>
                        <FormControl
                            as='select'
                            id='abo'
                            aria-label="search"
                            onChange={this.doFilter}
                        >
                            { bloodTypes.map((bloodType,index)=>{
                                return <option key={index} >{bloodType}</option>
                            }) }
                        </FormControl>    
                    </Row>
                </Col>
                <Col className='mb-3' xs='6'>
                    <Row className='dataTitleNew m-0'>Date of Birth:</Row>
                    <Row className='dataInfoNew m-0'>
                        <DatePicker 
                            id="dob" 
                            dateFormat='yyyy-MM-dd'
                            showMonthDropdown
                            showYearDropdown
                            selected={this.state.dob} 
                            onChange={this.handleChange} 
                        />
                    </Row>
                </Col>
                <Col className='mb-3' xs='6'>
                    <Row className='dataTitleNew m-0'>Room:</Row>
                    <Row className='dataInfoNew m-0'>
                        <FormControl
                            type='text'
                            id='room'
                            onChange={this.doFilter}
                        />    
                    </Row>
                </Col>
                <Col className='mb-3' xs='12'>
                    <Row className='dataTitleNew m-0'>Reason:</Row>
                    <Row className='dataInfoNew m-0'>
                        <FormControl
                            type='text'
                            id='reason'
                            onChange={this.doFilter}
                        />    
                    </Row>
                </Col>
                <Col className='mb-3' xs='6'>
                    <Row className='justify-content-center dataInfoNew m-0'>
                        <Button
                            className='submit-btn'
                            variant='light'
                            onClick={this.savePatient}
                        >
                            SAVE
                        </Button>    
                    </Row>
                </Col>
            </Row>
        );
    }
}
export default AddPatient;
