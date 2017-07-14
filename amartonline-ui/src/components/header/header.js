import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import UserLogin from '../userLogin/userLogin';

class Header extends Component {
  constructor(props) {
    super(props);
    this.auth = props.auth;
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
            <UserLogin auth={this.auth} />
          </NavItem>
        </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
