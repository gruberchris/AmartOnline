import React, { Component } from 'react';
import { Image, Col, Row, Grid, PageHeader, Panel } from 'react-bootstrap';

class UserProfile extends Component {
  render() {
    const profileInfoPanelStyles = {
      display: "inline-block",
      verticalAlign: "middle",
      marginLeft: "50px"
    };

    return (
      <Grid fluid={true}>
        <Row>
          <Col md={10} mdOffset={1}>
            <PageHeader>User Profile</PageHeader>
          </Col>
        </Row>
        <Row>
          <Col md={8} mdOffset={2}>
            <Image src={this.props.auth.authToken.pictureUrl} thumbnail responsive />
            <div style={profileInfoPanelStyles}>
              <Panel header="Name">{this.props.auth.authToken.name}</Panel>
              <Panel header="Nickname">{this.props.auth.authToken.nickname}</Panel>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default UserProfile;
