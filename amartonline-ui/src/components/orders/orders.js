import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../config';
import { Button, ListGroup, ListGroupItem, Glyphicon, Col, Row, Grid } from 'react-bootstrap';

class Orders extends Component {
  render() {
    return (
      <Grid fluid={true}>
        <Row>
          <Col md={10} mdOffset={1}>
            <h1>My Orders:</h1>
            <ListGroup></ListGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Orders;
