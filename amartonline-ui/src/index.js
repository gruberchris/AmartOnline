import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app/app';
import history from './history';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

ReactDOM.render((
  <BrowserRouter history={history}>
    <App />
  </BrowserRouter>
), document.getElementById('root'));

registerServiceWorker();
