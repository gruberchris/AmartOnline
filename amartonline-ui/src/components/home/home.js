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
      <li key={item.itemId.toString()}>{item.description}</li>
    );

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <ul>{itemsList}</ul>
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
