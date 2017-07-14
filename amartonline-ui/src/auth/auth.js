import auth0 from 'auth0-js';
import config from '../config';

export default class Auth {
  auth0 = new auth0.WebAuth(config.auth);

  login() {
    this.auth0.authorize();
  }

  onAuthCallback(nextState) {
    if(/access_token|id_token|error/.test(nextState.location.hash)) {
      this.handleAuthentication();
    }
  }

  handleAuthentication() {

  }
}
