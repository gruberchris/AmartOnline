const express  = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const { Config } = require('./config');

const config = Config;
config.Auth.domain = process.env.AO_AUTH_DOMAIN || config.Auth.domain;
config.Auth.audience = process.env.AO_AUTH_AUDIENCE || config.Auth.audience;

console.log(`Auth0 domain set to ${config.Auth.domain}`);
console.log(`Auth0 audience set to ${config.Auth.audience}`);

const app = express();

app.use(cors());

let stateTaxRates = {};

stateTaxRates["IA"] = {state: "IA", rate: 5.0};
stateTaxRates["IL"] = {state: "IL", rate: 6.0};
stateTaxRates["MI"] = {state: "MI", rate: 3.0};
stateTaxRates["MN"] = {state: "MN", rate: 7.5};
stateTaxRates["WI"] = {state: "WI", rate: 4.25};

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.Auth.domain}/.well-known/jwks.json`
  }),
  audience: Config.Auth.audience,
  issuer: `https://${config.Auth.domain}/`,
  algorithms: ['RS256']
});

app.use(authCheck);

app.get('/api/tax', (req, res) => {
  res.send(stateTaxRates);
});

app.get('/api/tax/:state', (req, res) => {
  let state = req.params.state.toUpperCase();

  let stateTaxModel = stateTaxRates[state];

  if(stateTaxModel) {
    res.send(stateTaxModel);
  } else {
    res.sendStatus(404);
  }
});

const port = process.env.PORT || 5003;

app.listen(port);

console.log(`Amart Online tax status service listening on port ${port}`);
