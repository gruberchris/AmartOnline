import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <div>
        {!isAuthenticated() && (<Button bsStyle="primary" className="btn-margin" onClick={this.login}>Log In</Button>)}
        {isAuthenticated() && (<Button bsStyle="primary" className="btn-margin" onClick={this.logout}>Log Out</Button>)}
      </div>
    )
  }
}

export default UserLogin;
