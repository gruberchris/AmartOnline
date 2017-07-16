import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class Header extends Component {
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
      <Navbar collapseOnSelect inverse className="navbar-default">
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/#">AmartOnline</a>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
        <Nav>
          <NavItem>Great Stuff</NavItem>
          <NavItem>Even Better Stuff!</NavItem>
        </Nav>
        <Nav pullRight>
          {!isAuthenticated() && (<NavItem onClick={this.login}>Sign In or Register</NavItem>)}
          {isAuthenticated() && (<NavItem onClick={this.logout}>Sign Out</NavItem>)}
        </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
