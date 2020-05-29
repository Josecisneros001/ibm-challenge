import React, { Component } from 'react';
import NavBar from "./components/NavBar/NavBar.js";
import Dashboard from "./components/Dashboard/Dashboard.js";
import Profile from "./components/Profile/Profile.js";
import Patients from "./components/Patients/Patients.js";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routesData from './data/routes.json';
import profileData from './data/profile.json';
import './App.css';

const actualProfileId = "dr1-id";

class App extends Component {
  
  componentDidMount() {
    
  }

  render() {
    document.title = "IBMCHALLENGE";
    
    window.onbeforeunload = () => { window.scrollTo(0, 0); }
    
    return (
      <Router>
        <div className="app-container">

          <NavBar routes={ routesData.routes } />
          
          <Route
            exact path='/'
            component={ () => <Dashboard Drid={actualProfileId} /> }
          />
          
          <Route
            exact path='/profile'
            component={ () => <Profile profileData={profileData.profile[actualProfileId]} /> }
          />

          <Route
            exact path='/patients'
            component={ () => <Patients /> }
          />

        </div>
      </Router>
    );
    
  }
}
export default App;
