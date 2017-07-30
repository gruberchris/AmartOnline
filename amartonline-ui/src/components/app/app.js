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
  }

  render() {
    return (
      <Grid fluid={true}>
        <Header ref="header" {...this.props} />
        <Switch>
          <Route exact path="/" render={(props) => <Home config={this.props.config} auth={this.props.auth} onSetCartItemCount={(itemCount) => this.refs.header.setCartItemCount(itemCount)} onAddCartItem={() => this.refs.header.incrementCartItemCount()} {...props}/>} />
          <Route path="/callback" render={(props) => {
            this.props.auth.onAuthCallback(props);
            return <Callback {...props} />;
          }} />
          <Route exact path="/cart" render={(props) => <ShoppingCart config={this.props.config} auth={this.props.auth} onRemoveCartItem={() => this.refs.header.decrementCartItemCount()} {...props}/>} />
          <Route exact path="/orders" render={(props) => <Orders config={this.props.config} auth={this.props.auth} {...props}/>} />
          <Route exact path="/profile" render={(props) => <UserProfile config={this.props.config} auth={this.props.auth} {...props}/>} />
        </Switch>
      </Grid>
    );
  }
}

export default App;
