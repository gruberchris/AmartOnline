import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../config';
import { Button, ListGroup, ListGroupItem, Glyphicon, Col, Row, Grid } from 'react-bootstrap';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.axios = axios;
    this.state = {
      orders:[]
    }
  }

  render() {
    return (
      <Grid fluid={true}>
        <Row>
          <Col md={10} mdOffset={1}>
            <h1>Order History</h1>
            {this.state.orders.length > 0 &&
              <ListGroup>
                {this.state.orders.map((order) => {
                  this.showOrder(order);
                  this.showOrderItems(order.orderItems);
                })}
              </ListGroup>
            }
            {this.state.orders.length === 0 &&
              <p>You have no orders.</p>
            }
          </Col>
        </Row>
      </Grid>
    );
  }

  componentWillMount() {
    this.getOrders();
  }

  getOrders() {
    const authToken = this.props.auth.authToken;

    this.axios.get(`${Config.Api.orderApiUrl}/api/order/user/${authToken.userId}`, { headers: { Authorization: `Bearer ${authToken.accessToken}`}}).then((response) => {
      this.setState({orders: response.data});
    }).catch((error) => {
      console.error(error);
    });
  }

  showOrder(order) {
    const tempButtonContainer = {
      display: "inline-block",
      verticalAlign: "middle"
    };

    return (
      <ListGroupItem key={order._id.toString()}>
        <div style={tempButtonContainer}><h4><strong>{order.itemQuantity}</strong></h4><span>${order.subtotal}</span><span><strong>${order.tax}</strong></span><span><strong>${order.total}</strong></span></div>
      </ListGroupItem>
    )
  }

  showOrderItems(orderItems) {
    const tempButtonContainer = {
      display: "inline-block",
      verticalAlign: "middle",
      marginLeft: "50px"
    };

    return (
      <ListGroupItem key={orderItems.itemId}>
        <div style={tempButtonContainer}>
          <span><strong>{orderItems.description}</strong></span>
          <span><strong>{orderItems.quantity}</strong></span>
          <span><strong>${orderItems.price}</strong></span>
          <span><strong>${orderItems.tax}</strong></span>
        </div>
      </ListGroupItem>
    )
  }
}

export default Orders;
