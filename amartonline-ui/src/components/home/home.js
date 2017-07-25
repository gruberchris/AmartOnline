import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../config';
import { Button, ListGroup, ListGroupItem, Glyphicon, Col, Row, Grid } from 'react-bootstrap';

class Home extends Component {
  constructor(props) {
    super(props);
    this.axios = axios;
    this.state = {
      inventory:[]
    }
  }

  render() {
    const itemsList = this.getInventoryItemsList();

    return (
      <Grid fluid={true}>
        <Row>
          <Col md={10} mdOffset={1}>
            <ListGroup>{itemsList}</ListGroup>
          </Col>
        </Row>
      </Grid>
    )
  }

  componentWillMount() {
    this.getItemsForSale();
  }

  getItemsForSale() {
    this.axios.get(`${Config.Api.inventoryApiUrl}/api/inventory`).then((response) => {
      this.setState({ inventory: response.data });
    }).catch((error) => {
      console.error(error);
    });
  }

  addItemToShoppingCart(item) {
    const userId = this.props.auth.authToken.userId;
    const quantityOrdering = 1;

    this.axios.get(`${Config.Api.basketApiUrl}/api/basket/${userId}`, { headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}`}}).then((response) => {
      const basket = response.data;

      // TODO: if item is already in cart, increment its quantity then update

      let newOrderItem = { itemId: item.itemId, description: item.description, quantity: quantityOrdering, price: item.price };

      console.log(JSON.stringify(newOrderItem));

      basket.items.push(newOrderItem);

      this.axios.put(`${Config.Api.basketApiUrl}/api/basket/${userId}`, basket, { headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}`}}).then((postResponse) => {
        this.props.onAddCartItem();
      }).catch((error) => {
        console.error(error);
      });
    });
  }

  getInventoryItemsList() {
    if(this.state.inventory.length > 0) {
      const tempButtonContainer = {
        display: "inline-block",
        verticalAlign: "middle"
      };

      const tempButtonContainer2 = {
        display: "inline-block",
        verticalAlign: "middle",
        marginLeft: "50px"
      };

      const itemsList = this.state.inventory.map((item) =>
        <ListGroupItem key={item.itemId.toString()}>
          <div style={tempButtonContainer}><h4><strong>{item.description}</strong></h4>Only {item.quantity} left on hand. This can be yours for the every day low price of only <strong>${item.price}</strong></div>
          <div style={tempButtonContainer2}>
            {this.props.auth.isAuthenticated() &&
            <Button onClick={this.addItemToShoppingCart.bind(this, item)} bsStyle="primary" bsSize="large"><Glyphicon glyph="plus-sign"/>Add To Cart</Button>
            }
          </div>
        </ListGroupItem>
      );

      return itemsList;
    }

    return null;
  }
}

export default Home;
