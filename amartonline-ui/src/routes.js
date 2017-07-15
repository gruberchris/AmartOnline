import React from 'react';
import { Route, BrowserRouter} from 'react-router-dom';
import App from './components/app/app';
import Home from './components/home/home';
import Checkout from './components/checkout/checkout';
import Callback from './components/callback/callback';
import UserProfile from './components/userProfile/userProfile';
import Auth from './auth/auth';
import history from './history';

const auth = new Auth();

export const getRoutes = () => {
  return (
    <BrowserRouter history={history}>
      <div>
        <Route render={(props) => <App auth={auth} {...props}/>} />
        <Route exact path="/" render={(props) => <Home {...props}/>} />
        <Route exact path="/checkout" render={(props) => <Checkout {...props}/>} />
        <Route exact path="/profile" render={(props) => <UserProfile {...props}/>} />
        <Route path="/callback" render={(props) => {
          Auth.onAuthCallback(props);
          return <Callback {...props} />
        }} />
      </div>
    </BrowserRouter>
  )
};
