const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');
const BasketModel = require('./models/basketModel');
const { Config } = require('./config');

mongoose.Promise = global.Promise;

const config = Config;
config.Auth.domain = process.env.AO_AUTH_DOMAIN || config.Auth.domain;
config.Auth.audience = process.env.AO_AUTH_AUDIENCE || config.Auth.audience;
config.Mongo.host = process.env.AO_MONGO_HOST || config.Mongo.host;

console.log(`Auth0 domain set to ${config.Auth.domain}`);
console.log(`Auth0 audience set to ${config.Auth.audience}`);
console.log(`Mongo host set to ${config.Mongo.host}`);

const app = express();

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

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoUrl = `mongodb://${config.Mongo.host}:27017/AmartOnline`;

mongoose.connect(mongoUrl, { useMongoClient: true });

let db = mongoose.connection;

db.on('error', (error) => {
  console.log(`Error while attempting to connect to mogodb server: ${mongoUrl}. The error message is: ${error}`);
});

db.once('open', () => {
  console.log(`Successfully connected to mongodb server: ${mongoUrl}`);
});

app.get('/api/basket', authCheck, jwtAuthz(['readall:basket']), (req, res) => {
  BasketModel.find((error, baskets) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(baskets);
    }
  });
});

app.get('/api/basket/:userId', authCheck, jwtAuthz(['read:basket']), (req, res) => {
  let userId = req.params.userId;

  BasketModel.findOne({userId: userId}, (error, basket) => {
    if(error) {
      res.status(500).send(error);
    } else {
      if (basket) {
        res.send(basket);
      } else {
        res.status(404).send('No such basket found.');
      }
    }
  });
});

app.post('/api/basket', authCheck, jwtAuthz(['create:basket']), (req, res) => {
  BasketModel.createBasket(req.body, (error, basket) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(basket);
    }
  });
});

app.put('/api/basket/:userId', authCheck, jwtAuthz(['edit:basket']), (req, res) => {
  let basket = req.body;

  BasketModel.findOneAndUpdate({userId: basket.userId}, basket, null, (error, doc) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(doc);
    }
  });
});

app.delete('/api/basket/:userId', authCheck, jwtAuthz(['delete:basket']), (req, res) => {
  let userId = req.params.userId;

  BasketModel.findOneAndRemove({userId: userId}, (error) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.sendStatus(204);
    }
  });
});

const port = process.env.PORT || 5001;

app.listen(port);

console.log(`Amart Online basket service listening on port ${port}`);
