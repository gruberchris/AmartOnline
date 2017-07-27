import React, { Component } from 'react';
import axios from 'axios';
import { Col, Row, Grid } from 'react-bootstrap';
import OrderPanel from '../orderPanel/orderPanel';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.axios = axios;
    this.state = {
      orders:[]
    };
  }

  render() {
    return (
      <Grid fluid={true}>
        <Row>
          <Col md={10} mdOffset={1}>
            <h1>Order History</h1>
            {this.getOrderPanels()}
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

    this.axios.get(`${this.props.config.Api.orderApiUrl}/api/order/user/${authToken.userId}`, { headers: { Authorization: `Bearer ${authToken.accessToken}`}}).then((response) => {
      this.setState({orders: response.data});
    }).catch((error) => {
      console.error(error);
    });
  }

  getOrderPanels() {
    if(this.state.orders.length > 0) {
      return this.state.orders.map((order) =>
        <OrderPanel key={order.orderId} order={order} />
      );
    }

    return (
      <p>You have no orders.</p>
    );
  }
}

export default Orders;
