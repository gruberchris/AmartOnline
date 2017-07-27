import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Header from '../header/header';
import Home from '../home/home';
import Orders from '../orders/orders';
import ShoppingCart from '../shoppingCart/shoppingCart';
import Callback from '../callback/callback';
import UserProfile from '../userProfile/userProfile';

class App extends Component {
  constructor(props) {
    super(props);

    this.axios = axios;
    this.state = {
      cartItemCount: 0
    };
  }

  render() {
    return (
      <Grid fluid={true}>
        <Header ref="header" cartItemCount={this.state.cartItemCount} {...this.props} />
        <Switch>
          <Route exact path="/" render={(props) => <Home config={this.props.config} auth={this.props.auth} onAddCartItem={() => {this.refs.header.incrementCartItemCount();}} {...props}/>} />
          <Route path="/callback" render={(props) => {
            this.props.auth.onAuthCallback(props);
            return <Callback {...props} />;
          }} />
          <Route exact path="/cart" render={(props) => <ShoppingCart config={this.props.config} auth={this.props.auth} onRemoveCartItem={() => {this.refs.header.decrementCartItemCount();}} {...props}/>} />
          <Route exact path="/orders" render={(props) => <Orders config={this.props.config} auth={this.props.auth} {...props}/>} />
          <Route exact path="/profile" render={(props) => <UserProfile config={this.props.config} auth={this.props.auth} {...props}/>} />
        </Switch>
      </Grid>
    );
  }

  componentWillMount() {
    this.getUserBasketOrCreate();
  }

  getUserBasketOrCreate() {
    const auth = this.props.auth;

    if(!this.state.shoppingCart && auth.isAuthenticated()) {
      const userId = auth.authToken.userId;

      this.axios.get(`${this.props.config.Api.basketApiUrl}/api/basket/${userId}`, { headers: { Authorization: `Bearer ${auth.getAccessToken()}`}}).then((response) => {
        const existingBasket = response.data;

        let cartItemCount = 0;

        existingBasket.items.forEach((basketItem) => {
          cartItemCount += basketItem.quantity;
        });

        this.setState({cartItemCount: cartItemCount});

        for(let count = 0; count < cartItemCount; count++) {
          this.refs.header.incrementCartItemCount();
        }
      }).catch((error) => {
        if(error.response.status === 404) {
          this.axios.post(`${this.props.config.Api.basketApiUrl}/api/basket`, { userId: userId, items: []}, { headers: { Authorization: `Bearer ${auth.getAccessToken()}`}}).then((postResponse) => {
            this.setState({cartItemCount: 0});
          }).catch((error) => {
            console.error(error);
          });
        } else {
          console.error(error);
        }
      });
    }
  }
}

export default App;
