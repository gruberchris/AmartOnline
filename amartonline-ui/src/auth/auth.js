import auth0 from 'auth0-js';
import { Config } from '../config';
import history from '../history';
import decode from 'jwt-decode';

export default class Auth {
  auth0 = new auth0.WebAuth(Config.Auth);

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    localStorage.removeItem('AmartOnlineAuthToken');
    history.replace('/');
  }

  isAuthenticated() {
    const amartOnlineAuthToken = this.authToken;

    if(amartOnlineAuthToken) {
      return new Date().getTime() < amartOnlineAuthToken.expires;
    } else {
      return false;
    }
  }

  setSession(authResult) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

    const decodedIdentityToken = decode(authResult.idToken);

    const amartOnlineAuthToken = {
      accessToken: authResult.accessToken,
      identityToken: authResult.idToken,
      expires: expiresAt,
      name: decodedIdentityToken.name,
      pictureUrl: decodedIdentityToken.picture,
      nickname: decodedIdentityToken.nickname,
      userId: decodedIdentityToken.sub
    };

    localStorage.setItem('AmartOnlineAuthToken', JSON.stringify(amartOnlineAuthToken));
  }

  onAuthCallback(nextState) {
    if(/access_token|id_token|error/.test(nextState.location.hash)) {
      this.handleAuthentication();
    }
  }

  handleAuthentication() {
    this.auth0.parseHash(window.location.hash, (error, authResult) => {
      if(authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);

        /*
        this.getUserProfile((error, profile) => {
          console.log(`Error message while retrieving user profile is: ${JSON.parse(error)}`);
          console.log(`User profile is: ${profile}`);
        });
        */

        history.replace('/');
      } else if(error) {
        history.replace('/');
        console.error(error);
      }
    });
  }

  get authToken() {
    return JSON.parse(localStorage.getItem('AmartOnlineAuthToken'));
  }

  getAccessToken() {
    const authToken = this.authToken;

    if(!authToken || !authToken.accessToken) {
      throw new Error('Unauthorized or no access token retrieved.');
    }

    return authToken.accessToken;
  }

  getUserProfile(callback) {
    const accessToken = this.getAccessToken();

    console.log(accessToken);

    this.auth0.client.userInfo(accessToken, (error, profile) => {
      console.log(JSON.stringify(error));

      if(profile) {
        this.userProfile = profile;
        console.log(`Saved user profile: ${JSON.stringify(this.userProfile)}`);
      }

      callback(error, profile);
    });
  }

  requireAuth() {
    const isLoggedIn = this.isAuthenticated();
    if(!isLoggedIn) {
      history.replace('/');
    }
  }
}
