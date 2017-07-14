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
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    history.replace('/home');
  }

  isAuthenticated() {
    const expires = JSON.parse(localStorage.getItem('expires_at'));

    return new Date().getTime() < expires;
  }

  setSession(authResult) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    history.replace('/home');
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
        history.replace('/home');
      } else if(error) {
        history.replace('/home');
        console.error(error);
      }
    });
  }
}
