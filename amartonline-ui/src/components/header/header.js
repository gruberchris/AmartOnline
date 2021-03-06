import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Image, Button, Glyphicon, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { NavLink } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      cartItemCount: 0
    };
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

  get userName() {
    return this.props.auth.authToken.name;
  }

  get userPicture() {
    return this.props.auth.authToken.pictureUrl;
  }

  get userNickName() {
    return this.props.auth.authToken.nickname;
  }

  incrementCartItemCount() {
    const oldValue = this.state.cartItemCount;
    this.setState({cartItemCount: oldValue + 1});
  }

  decrementCartItemCount() {
    const oldValue = this.state.cartItemCount;

    if(oldValue > 0) {
      this.setState({cartItemCount: oldValue - 1});
    }
  }

  setCartItemCount(cartItemCount) {
    this.setState({cartItemCount: cartItemCount});
  }

  render() {
    const isAuthenticated  = this.props.auth.isAuthenticated();

    const profileImageStyle = {
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
        <Nav pullRight>
          {!isAuthenticated && (<NavItem onClick={this.login}>Sign In or Register</NavItem>)}
          {isAuthenticated && (
          <NavDropdown id="navUserDropdown" title={<span>Hello, {this.userName}<Image style={profileImageStyle} src={this.userPicture} className="navbar-profile-image" alt="" rounded /></span>}>
            <LinkContainer to="/profile"><MenuItem>Profile</MenuItem></LinkContainer>
            <LinkContainer to="/orders"><MenuItem>Orders</MenuItem></LinkContainer>
            <MenuItem divider />
            <MenuItem onClick={this.logout}>Logout</MenuItem>
          </NavDropdown>)}
          {(isAuthenticated && this.state.cartItemCount > 0) && (
            <LinkContainer to="/cart"><NavItem><Button bsStyle="primary"><Glyphicon glyph="shopping-cart"/><Badge>{this.state.cartItemCount}</Badge></Button></NavItem></LinkContainer>
          )}
          {(isAuthenticated && this.state.cartItemCount === 0) && (
            <NavItem><Button bsStyle="primary" disabled={true}><Glyphicon glyph="shopping-cart"/><Badge>{this.state.cartItemCount}</Badge></Button></NavItem>
          )}
        </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
