import React, { Component } from 'react';
import { Panel, Table } from 'react-bootstrap';

class OrderPanel extends Component {
  render() {
    const order = this.props.order;

    const orderItemRowList = this.getOrderItemRow(order.orderItems);

    const panelFooter = (
      <div>
        <span>Tax ${order.totalTax}</span>&nbsp;<span><strong>Total ${order.total}</strong></span>
      </div>
    );

    return (
    <Panel header={order.orderId} footer={panelFooter}>
      <Table responsive>
        <thead><tr><th></th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr></thead>
        <tbody>
        {orderItemRowList}
        </tbody>
      </Table>
    </Panel>
    );
  }

  getOrderItemRow(orderItems) {
    const orderItemRowList = orderItems.map((orderItem) =>
      <tr key={orderItem._id}>
        <td>{orderItem.description}</td>
        <td>{orderItem.quantity}</td>
        <td>${orderItem.price}</td>
        <td>${(orderItem.quantity * orderItem.price).toFixed(2)}</td>
      </tr>
    );

    return orderItemRowList;
  }
}

export default OrderPanel;
