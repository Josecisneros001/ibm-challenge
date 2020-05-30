import React, { Component } from 'react';
import NavBar from "./components/NavBar/NavBar.js";
import Patients from "./components/Patients/Patients.js";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routesData from './data/routes.json';
import './App.css';

class App extends Component {

  render() {
    
    document.title = "IBMCHALLENGE";
    window.onbeforeunload = () => { window.scrollTo(0, 0); }
    
    return (
      <Router>
        <div className="app-container">

          <NavBar routes={ routesData.routes } />
          
          <Route
            exact path='/'
            component={ () => <Patients /> }
          />

        </div>
      </Router>
    );
    
  }
}
export default App;
