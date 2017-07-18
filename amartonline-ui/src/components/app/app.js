import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import Header from '../header/header';
import Home from '../home/home';
// import Checkout from '../checkout/checkout';
import ShoppingCart from '../shoppingCart/shoppingCart';
import Callback from '../callback/callback';
import UserProfile from '../userProfile/userProfile';
import Auth from '../../auth/auth';

const auth = new Auth();

class App extends Component {
  render() {
    return (
      <Grid fluid={true}>
        <Header auth={auth} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/callback" render={(props) => {
            auth.onAuthCallback(props);
            return <Callback {...props} />
          }} />
          <Route exact path="/cart" component={ShoppingCart} />
          <Route exact path="/profile" component={UserProfile} />
        </Switch>
      </Grid>
    );
  }
}

export default App;
