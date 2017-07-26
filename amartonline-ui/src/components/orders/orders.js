import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../config';
import { Panel, Col, Row, Grid, Table } from 'react-bootstrap';

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
              <div>
                {this.state.orders.forEach((order) => {
                  <Panel header={order.orderId}>
                    <Table responsive>
                      <thead><tr><th></th><th>Quantity</th><th>Price</th></tr></thead>
                      <tbody>
                        {order.orderItems.forEach((orderItem) => {
                          <tr>
                            <td>{orderItem.description}</td>
                          </tr>
                        })}
                      </tbody>
                    </Table>
                  </Panel>
                })}
              </div>
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
}

export default Orders;
