export const Config = {
  Auth: {
    domain: '',
    clientID: '',
    redirectUri: 'http://localhost:3000/callback',
    audience: '',
    responseType: 'token id_token',
    scope: 'openid profile create:basket edit:basket read:basket create:order read:order read:inventory'
  },
  Api: {
    inventoryApiUrl: 'http://localhost:5000',
    basketApiUrl: 'http://localhost:5001',
    orderApiUrl: 'http://localhost:5002'
  }
};
