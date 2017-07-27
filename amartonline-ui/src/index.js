import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app/app';
import history from './history';
import registerServiceWorker from './registerServiceWorker';
import { Config } from "./config";
import Auth from './auth/auth';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const auth = new Auth();

ReactDOM.render((
  <BrowserRouter history={history}>
    <App config={Config} auth={auth} />
  </BrowserRouter>
), document.getElementById('root'));

registerServiceWorker();
