import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../config';
import { Button, ListGroup, ListGroupItem, Glyphicon, Col, Row, Grid } from 'react-bootstrap';

class ShoppingCart extends Component {
  constructor(props) {
    super(props);
    this.axios = axios;
    this.state = {
      cartItems:[]
    }
  }

  render() {
    const cartItemsList = this.getCartItemsList();

    return (
      <Grid fluid={true}>
        <Row>
          <Col md={10} mdOffset={1}>
            <h1>Shopping Cart:</h1>
            <ListGroup>{cartItemsList}</ListGroup>
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

    this.axios.get(`${Config.Api.basketApiUrl}/api/basket/${userId}`).then((response) => {
      this.setState({cartItems: response.data});
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

      const tempButtonContainer2 = {
        display: "inline-block",
        verticalAlign: "middle",
        marginLeft: "50px"
      };

      const cartItemsList = this.state.cartItems.map((item) =>
        <ListGroupItem key={item.itemId.toString()}>
          <div style={tempButtonContainer}><h4><strong>{item.description}</strong></h4><span>{item.quantity}</span><span><strong>${item.price}</strong></span></div>
        </ListGroupItem>
      );

      return cartItemsList;
    }

    return null;
  }
}

export default ShoppingCart;
