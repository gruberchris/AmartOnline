const axios = require('axios');

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
        // TODO: && new Date().getTime() < (this.expiresIn - 10)
        //console.log(`Still have a auth token in memory that has not expired: ${this.accessToken}`);
        return resolve(this.accessToken);
      }

      const requestBody = this.clientCredentialsRequestBody;

      axios.post(`https://${this.domain}/oauth/token`, requestBody).then((response) => {
        this.accessToken = response.data.access_token;
        this.expiresIn = response.data.expires_in;
        //console.log(response.data);
        //console.log(`Access Token Received: ${this.accessToken}`);
        //console.log(`Access Token Expires: ${this.expiresIn}`);
        return resolve(response.data.access_token);
      }).catch((error) => {
        return reject(error);
      });
    });
  }
}

module.exports = NicHelper;
