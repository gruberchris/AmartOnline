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
import Auth from '../../auth/auth';
import { Config } from "../../config";

const auth = new Auth();

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
        <Header auth={auth} ref="header" cartItemCount={this.state.cartItemCount} />
        <Switch>
          <Route exact path="/" render={(props) => <Home auth={auth} onAddCartItem={() => {this.refs.header.incrementCartItemCount();}} {...props}/>} />
          <Route path="/callback" render={(props) => {
            auth.onAuthCallback(props);
            return <Callback {...props} />
          }} />
          <Route exact path="/cart" render={(props) => <ShoppingCart auth={auth} onRemoveCartItem={() => {this.refs.header.decrementCartItemCount();}} {...props}/>} />
          <Route exact path="/orders" render={(props) => <Orders auth={auth} {...props}/>} />
          <Route exact path="/profile" render={(props) => <UserProfile auth={auth} {...props}/>} />
        </Switch>
      </Grid>
    );
  }

  componentWillMount() {
    this.getUserBasketOrCreate();
  }

  getUserBasketOrCreate() {
    if(!this.state.shoppingCart && auth.isAuthenticated()) {
      const userId = auth.authToken.userId;

      this.axios.get(`${Config.Api.basketApiUrl}/api/basket/${userId}`, { headers: { Authorization: `Bearer ${auth.getAccessToken()}`}}).then((response) => {
        const existingBasket = response.data;

        this.setState({cartItemCount: existingBasket.items.length});

        for(let count = 0; count < existingBasket.items.length; count++) {
          this.refs.header.incrementCartItemCount();
        }
      }).catch((error) => {
        if(error.response.status === 404) {
          this.axios.post(`${Config.Api.basketApiUrl}/api/basket`, { userId: userId, items: []}, { headers: { Authorization: `Bearer ${auth.getAccessToken()}`}}).then((postResponse) => {
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
