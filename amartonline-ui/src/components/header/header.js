import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Image, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { NavLink } from 'react-router-dom';

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

  get userProfile() {
    return this.props.auth.userProfile;
  }

  get cartItemCount() {
    return this.props.cart.items.length;
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    const tempProfileImageStyle = {
      maxHeight: '30px',
      width: 'auto',
      verticalAlign: 'middle',
      marginLeft: '7px'
    };

    return (
      <Navbar collapseOnSelect inverse className="navbar-default">
        <Navbar.Header>
          <Navbar.Brand>
            <NavLink to="/">AmartOnline</NavLink>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          {/*<Nav>
          <NavItem>Great Stuff</NavItem>
          <NavItem>Even Better Stuff!</NavItem>
          {isAuthenticated() && (<NavItem onClick={this.logout}>Sign Out</NavItem>)}
        </Nav>*/}
        <Nav pullRight>
          {!isAuthenticated() && (<NavItem onClick={this.login}>Sign In or Register</NavItem>)}
          {isAuthenticated() && (
          <NavDropdown id="navUserDropdown" title="Settings">
            <LinkContainer to="/profile"><MenuItem>Profile</MenuItem></LinkContainer>
            <MenuItem divider />
            <MenuItem onClick={this.logout}>Logout</MenuItem>
          </NavDropdown>)}
          {isAuthenticated() && (
            <LinkContainer to="/profile"><NavItem>Hello, {this.props.auth.authToken.name}<Image style={tempProfileImageStyle} src={this.props.auth.authToken.pictureUrl} className="navbar-profile-image" alt="" rounded /></NavItem></LinkContainer>
          )}
          {isAuthenticated() && (
            <LinkContainer to="/checkout"><NavItem><Button bsStyle="primary"><span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span><span className="badge">{this.cartItemCount}</span></Button></NavItem></LinkContainer>
          )}
        </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
