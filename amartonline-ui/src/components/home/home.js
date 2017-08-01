import React, { Component } from 'react';
import axios from 'axios';
import { Button, ListGroup, ListGroupItem, Glyphicon, Col, Row, Grid } from 'react-bootstrap';

class Home extends Component {
  constructor(props) {
    super(props);
    this.axios = axios;
    this.state = {
      inventory:[],
      isAuthenticated: this.props.auth.isAuthenticated(),
      userId: this.props.auth.authToken ? this.props.auth.authToken.userId : null
    };
  }

  render() {
    const itemsList = this.getInventoryItemsList();

    return (
      <Grid fluid={true}>
        <Row>
          <Col md={8} mdOffset={2}>
            <ListGroup>{itemsList}</ListGroup>
          </Col>
        </Row>
      </Grid>
    );
  }

  componentWillMount() {
    this.getItemsForSale();

    if(this.state.isAuthenticated) {
      this.getUserBasketOrCreate();
    }
  }

  getItemsForSale() {
    this.axios.get(`${this.props.config.Api.inventoryApiUrl}/api/inventory`).then((response) => {
      this.setState({ inventory: response.data });
    }).catch((error) => {
      console.error(error);
    });
  }

  addItemToShoppingCart(item) {
    const userId = this.state.userId;
    const quantityOrdering = 1;

    let basket = this.state.basket;
    let itemExistsInBasket = false;

    for(let counter = 0; counter < basket.items.length; counter++) {
      let basketItem = basket.items[counter];

      if(basketItem.itemId === item.itemId) {
        basketItem.quantity = basketItem.quantity + 1;
        itemExistsInBasket = true;
        break;
      }
    }

    if(!itemExistsInBasket) {
      let newOrderItem = { itemId: item.itemId, description: item.description, quantity: quantityOrdering, price: item.price };
      basket.items.push(newOrderItem);
    }

    this.setState({basket: basket});

    this.axios.put(`${this.props.config.Api.basketApiUrl}/api/basket/${userId}`, this.state.basket, { headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}`}}).then((postResponse) => {
      console.debug(`Saving item to basket api: ${JSON.stringify(item)}`);
      this.props.onAddCartItem();
    }).catch((error) => {
      console.error(error);
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
          <div style={tempButtonContainer2} className="pull-right">
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

  getUserBasketOrCreate() {
    const auth = this.props.auth;

    if(!this.state.basket && auth.isAuthenticated()) {
      this.axios.get(`${this.props.config.Api.basketApiUrl}/api/basket/${this.state.userId}`, { headers: { Authorization: `Bearer ${auth.getAccessToken()}`}})
        .then(this.onGetUserBasket.bind(this))
        .catch(this.onGetUserBasketError.bind(this));
    }
  }

  onGetUserBasket(response) {
    const existingBasket = response.data;

    let cartItemCount = 0;

    existingBasket.items.forEach((basketItem) => {
      cartItemCount += basketItem.quantity;
    });

    this.setState({basket: existingBasket});
    this.props.onSetCartItemCount(cartItemCount);

    console.debug(`Retrieved existing user basket: ${JSON.stringify(existingBasket)}`);
  }

  onGetUserBasketError(error) {
    if (error.response && error.response.status === 404) {
      this.axios.post(`${this.props.config.Api.basketApiUrl}/api/basket`, {
        userId: this.state.userId,
        items: []
      }, {headers: {Authorization: `Bearer ${this.props.auth.getAccessToken()}`}}).then((postResponse) => {
        this.setState({basket: postResponse.data});
        console.debug(`New basket created for userId ${this.state.userId} : ${JSON.stringify(postResponse.data)}`);
      }).catch((error) => {
        console.error(error);
      });
    } else {
      console.error(error);
    }
  }
}

export default Home;
