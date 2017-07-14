import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import App from './components/app/app';
import Home from './components/home/home';
import Callback from './components/callback/callback';
import Auth from './auth/auth';
import history from './history';

const auth = new Auth();

export const getRoutes = () => {
  return (
    <BrowserRouter history={history} component={App}>
      <div>
        <Route path="/" render={(props) => <App auth={auth} {...props} />} />
        <Route path="/home" render={(props) => <Home auth={auth} {...props} />} />
        <Route path="/callback" render={(props) => {
          Auth.onAuthCallback(props);
          return <Callback {...props} />
        }} />
      </div>
    </BrowserRouter>
  )
};
