import React, { Component } from 'react';
import NavBar from "./components/NavBar/NavBar.js";
import Dashboard from "./components/Dashboard/Dashboard.js";
import Profile from "./components/Profile/Profile.js";
import Covid19 from "./components/Covid19/Covid19.js";
import Patients from "./components/Patients/Patients.js";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import routesData from './data/routes.json';
import './App.css';

class App extends Component {
  componentDidMount() {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#insertion-point-jss'),
    );
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
            component={ () => <Dashboard /> }
          />
          
          <Route
            exact path='/profile'
            component={ () => <Profile /> }
          />

          <Route
            exact path='/covid19'
            component={ () => <Covid19 /> }
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
