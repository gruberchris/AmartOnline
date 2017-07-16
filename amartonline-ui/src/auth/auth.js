import auth0 from 'auth0-js';
import { Config } from '../config';
import history from '../history';

export default class Auth {
  auth0 = new auth0.WebAuth(Config.Auth);

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    localStorage.removeItem('AmartOnlineAuthToken');

    history.replace('/');
  }

  isAuthenticated() {
    const amartOnlineAuthToken = JSON.parse(localStorage.getItem('AmartOnlineAuthToken'));

    if(amartOnlineAuthToken) {
      return new Date().getTime() < amartOnlineAuthToken.expires;
    } else {
      return false;
    }
  }

  setSession(authResult) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

    const amartOnlineAuthToken = {
      accessToken: authResult.accessToken,
      identityToken: authResult.idToken,
      expires: expiresAt
    };

    localStorage.setItem('AmartOnlineAuthToken', JSON.stringify(amartOnlineAuthToken));

    // console.log(`JWT saved: AccessToken = ${authResult.accessToken} IdentityToken = ${authResult.idToken} JWT-Expires = ${expiresAt}`);

    history.replace('/');
  }

  onAuthCallback(nextState) {
    if(/access_token|id_token|error/.test(nextState.location.hash)) {
      this.handleAuthentication();
    }
  }

  handleAuthentication() {
    this.auth0.parseHash((error, authResult) => {
      if(authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/');
      } else if(error) {
        history.replace('/');
        console.error(error);
      }
    });
  }
}
