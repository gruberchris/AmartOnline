import React, { Component } from 'react';
import axios from 'axios';
import { Config } from '../../config';

class Home extends Component {
  constructor(props) {
    super(props);
    this.axios = axios;
    this.state = {
      inventory:[]
    }
  }

  render() {
    const itemsList = this.state.inventory.map((item) =>
      <li className="list-group-item" key={item.itemId.toString()}>
        <h4>{item.description}</h4> Only {item.quantity} left on hand. This can be yours for the every day low price of only ${item.price}
      </li>
    );

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <ul className="list-group">{itemsList}</ul>
          </div>
        </div>
      </div>
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
}

export default Home;
