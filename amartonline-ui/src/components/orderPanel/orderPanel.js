import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

class OrderPanel extends Component {
  render() {
    const order = this.props.order;

    const orderItemRowList = this.getOrderItemRow(order.orderItems);

    return (
    <Panel header={order.orderId}>
      <Table responsive>
        <thead><tr><th></th><th>Quantity</th><th>Price</th></tr></thead>
        <tbody>
        {orderItemRowList}
        </tbody>
      </Table>
    </Panel>
    )
  }

  getOrderItemRow(orderItems) {
    const orderItemRowList = orderItems.map((orderItem) =>
      <tr key={orderItem._id}>
        <td>{orderItem.description}</td>
        <td>{orderItem.quantity}</td>
        <td>${orderItem.price}</td>
      </tr>
    );

    return orderItemRowList;
  }
}

export default OrderPanel;
