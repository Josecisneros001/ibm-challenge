import React, { Component } from 'react';
import './Profile.css';

class Profile extends Component { 
    constructor(props){
        super(props);
        this.profileData=this.props.profileData;
    }

    render() {
        return(
            <div className = "profile-contanier">
            </div>
        );
    }
}
export default Profile;
