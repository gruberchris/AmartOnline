const axios = require('axios');
const decode = require('jwt-decode');

class NicHelper {
  constructor(domain, clientId, clientSecret) {
    this.domain = domain;

    this.clientCredentialsRequestBody = {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    };
  }

  getAccessToken(audience) {
    this.clientCredentialsRequestBody.audience = audience;

    return new Promise((resolve, reject) => {
      if(this.accessToken) {
        const getTokenExpirationDate = (token) => {
          if(!token) {
            return null;
          }

          const decodedAccessToken = decode(token);
          let tokenExpirationDate = new Date(decodedAccessToken.exp * 1000);
          tokenExpirationDate.setSeconds(tokenExpirationDate.getSeconds() - 30);

          return tokenExpirationDate;
        };

        if(new Date().getTime() < getTokenExpirationDate(this.accessToken)) {
          console.log('Found a cached token that has not expired.');
          return resolve(this.accessToken);
        }

        console.log('Token expired. Getting a new access token.');
      }

      const requestBody = this.clientCredentialsRequestBody;

      axios.post(`https://${this.domain}/oauth/token`, requestBody).then((response) => {
        this.accessToken = response.data.access_token;
        this.expiresIn = response.data.expires_in;
        return resolve(response.data.access_token);
      }).catch((error) => {
        return reject(error);
      });
    });
  }
}

module.exports = NicHelper;
