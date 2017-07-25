import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../config';
import { Button, ListGroup, ListGroupItem, Glyphicon, Col, Row, Grid } from 'react-bootstrap';
import history from '../../history';

class ShoppingCart extends Component {
  constructor(props) {
    super(props);
    this.axios = axios;
    this.state = { basket:{ items: [] } };
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
        { this.state.basket.items.length > 0 &&
          <Row>
            <Col md={10} mdOffset={1}>
              <div>
                <Button onClick={this.saveOrder.bind(this)} bsStyle="primary" bsSize="large">Place Order</Button>
              </div>
            </Col>
          </Row>
        }
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
      this.setState({basket: response.data});
    }).catch((error) => {
      console.error(error);
    });
  }

  getCartItemsList() {
    if(this.state.basket.items.length > 0) {
      const tempButtonContainer = {
        display: "inline-block",
        verticalAlign: "middle"
      };

      const cartItemsList = this.state.basket.items.map((item) =>
        <ListGroupItem key={item.itemId.toString()}>
          <div style={tempButtonContainer}><h4><strong>{item.description}</strong></h4><span>{item.quantity}</span><span><strong>${item.price}</strong></span></div>
        </ListGroupItem>
      );

      return cartItemsList;
    }

    return null;
  }

  saveOrder() {
    const authToken = this.props.auth.authToken;

    let order = {
      userId: authToken.userId,
      customerEmail: authToken.name,
      orderItems: this.state.basket.items
    };

    this.axios.post(`${Config.Api.orderApiUrl}/api/order`, order, { headers: { Authorization: `Bearer ${authToken.accessToken}`}}).then((postResponse) => {
      let basket = this.state.basket;
      basket.items = [];
      this.setState({basket: this.state.basket});

      this.axios.put(`${Config.Api.basketApiUrl}/api/basket/${authToken.userId}`, this.state.basket , { headers: { Authorization: `Bearer ${authToken.accessToken}`}}).then((response) => {
        history.replace('/');
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });
  }
}

export default ShoppingCart;
