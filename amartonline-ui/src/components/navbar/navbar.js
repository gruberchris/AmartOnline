import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class Navbar extends Component {
  constructor(props) {
    super();
    this.auth = props.auth;
  }

  login() {
    this.auth.login();
  }

  render() {
    return (
      <Navbar collapseOnSelect inverse className="navbar-fixed-top">
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
          <NavItem>

          </NavItem>
        </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Navbar;
