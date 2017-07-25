import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../config';
import { Button, ListGroup, ListGroupItem, Glyphicon, Col, Row, Grid } from 'react-bootstrap';
import history from '../../history';

class ShoppingCart extends Component {
  constructor(props) {
    super(props);
    this.axios = axios;
    this.state = {
      cartItems:[]
    };
  }

  render() {
    this.props.auth.requireAuth();

    if(!this.props.auth.isAuthenticated()) {
      return null;
    }

    const cartItemsList = this.getCartItemsList();

    return (
      <Grid fluid={true}>
        <Row>
          <Col md={10} mdOffset={1}>
            <h1>Shopping Cart:</h1>
            <ListGroup>{cartItemsList}</ListGroup>
          </Col>
        </Row>
        <Row>
          <Col md={10} mdOffset={1}>
            <div><Button onClick={this.saveOrder.bind(this)} bsStyle="primary" bsSize="large">Place Order</Button>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

  componentWillMount() {
    this.getBasketItems();
  }

  getBasketItems() {
    const userId = this.props.auth.authToken.userId;

    if(!userId) {
      throw new Error('Unauthorized or no access token retrieved.');
    }

    this.axios.get(`${Config.Api.basketApiUrl}/api/basket/${userId}`, { headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}`}}).then((response) => {
      this.setState({cartItems: response.data.items});
    }).catch((error) => {
      console.error(error);
    });
  }

  getCartItemsList() {
    if(this.state.cartItems.length > 0) {
      const tempButtonContainer = {
        display: "inline-block",
        verticalAlign: "middle"
      };

      const cartItemsList = this.state.cartItems.map((item) =>
        <ListGroupItem key={item.itemId.toString()}>
          <div style={tempButtonContainer}><h4><strong>{item.description}</strong></h4><span>{item.quantityOrdered}</span><span><strong>${item.pricePerUnit}</strong></span></div>
        </ListGroupItem>
      );

      return cartItemsList;
    }

    return null;
  }

  saveOrder() {
    // TODO: Save Order

    // No point as updated cart state happens after redirect back to home
    //this.state.cartItems.forEach((item) => {
    //  this.props.onRemoveCartItem();
    //});

    // TODO: Empty user basket from API

    this.setState({cartItems: []});

    history.replace('/');
  }
}

export default ShoppingCart;
