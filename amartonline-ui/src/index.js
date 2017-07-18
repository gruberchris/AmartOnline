import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter} from 'react-router-dom';
import App from './components/app/app';
import Home from './components/home/home';
import Checkout from './components/checkout/checkout';
import Callback from './components/callback/callback';
import UserProfile from './components/userProfile/userProfile';
import Auth from './auth/auth';
import history from './history';

import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const auth = new Auth();

ReactDOM.render((
  <BrowserRouter history={history}>
    <div>
      <Route render={(props) => <App auth={auth} {...props}/>} />
      <Route exact path="/" render={(props) => <Home {...props}/>} />
      <Route exact path="/checkout" render={(props) => <Checkout {...props}/>} />
      <Route exact path="/profile" render={(props) => <UserProfile {...props}/>} />
      <Route path="/callback" render={(props) => {
        auth.onAuthCallback(props);
        return <Callback {...props} />
      }} />
    </div>
  </BrowserRouter>
), document.getElementById('root'));

registerServiceWorker();
