import auth0 from 'auth0-js';
import config from '../config';

export default class Auth {
  auth0 = new auth0.WebAuth(config.auth);

  login() {
    this.auth0.authorize();
  }
}
