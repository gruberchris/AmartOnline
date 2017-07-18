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
        <div style={tempButtonContainer2}><Button onClick={this.addItemToShoppingCart.bind(this, item)} bsStyle="primary" bsSize="large"><Glyphicon glyph="plus-sign"/>Add To Cart</Button></div>
      </ListGroupItem>
    );

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


    this.props.onAddCartItem();
    console.log(item.itemId);
  }
}

export default Home;
