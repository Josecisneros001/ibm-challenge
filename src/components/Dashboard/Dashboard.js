import React, { Component } from 'react';
import './Dashboard.css';
import drProfile from '../../data/profile.json'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import { Row, Col, Card } from 'react-bootstrap';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.doctor = drProfile.profile[this.props.drid]; 
        
    }

    render() {
        return(
            <div className = "dashboard-contanier prof">
                <Jumbotron>
                    <Container>
                        <Row>
                            <Col className = "JumboTitle">
                                <h1>{'Bienvenido Dr. ' +  this.doctor.lastName}</h1>
                            </Col>
                        </Row>
                        <Row>
                            <p>
                                Bienvenido al sistema de monitoreo de pacientes del hospital. Si ingresa a la pestaña
                                de pacientes podrá filtrar a sus pacientes por nombre. Si hace click en la tarjeta de 
                                cada paciente podría observar a detalle la predicción de las radiografías y la
                                predicción correspondiente a su ritmo cardíaco. 
                            </p>
                        </Row>
                    </Container>
                </Jumbotron>
                <Col className='card-container'>
                    <Card className='card-content'>
                        <Card.Body>
                            <Card.Title className='cardTitle'>{'Dr. ' + this.doctor.firstName + ' ' + this.doctor.lastName}</Card.Title>
                            <Row className='dataRow'>
                                <Col xs='6'>
                                    <Row className='dataTitle m-0'>E-Mail Address</Row>
                                    <Row className='dataInfo m-0'>{this.doctor.email}</Row>
                                </Col>
                                <Col xs='6'>
                                    <Row className='dataTitle m-0'>Specialty</Row>
                                    <Row className='dataInfo m-0'>{this.doctor.specialty}</Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs='6'>
                                    <Row className="dataTitle m-0">Num of Patients</Row>
                                    <Row className="dataInfo m-0">num</Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </div>
        );
    }
}
export default Dashboard;
