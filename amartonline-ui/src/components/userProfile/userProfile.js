import React, { Component } from 'react';
import { Image, Col, Row, Grid } from 'react-bootstrap';

class UserProfile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid fluid={true}>
        <Row>
          <Col md={10} mdOffset={1}>
            <h1>User Profile</h1>
          </Col>
        </Row>
        <Row>
          <Col md={10} mdOffset={1}>
            <Image src={this.props.auth.authToken.pictureUrl} thumbnail />
            <div>
              {this.props.auth.authToken.name}
            </div>
            <div>
              {this.props.auth.authToken.nickname}
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default UserProfile;
