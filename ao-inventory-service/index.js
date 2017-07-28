const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const InventoryItemModel = require('./models/inventoryItemModel');
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
}).unless((request) => {
  // console.log(`Checking unless rules. Request path is: ${request.path} and method is ${request.method}`);
  if(request.path === '/api/inventory' && request.method === 'GET') {
    return true;
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authCheck);
app.use(cors());

const mongoUrl = `mongodb://${config.Mongo.host}:27017/AmartOnline`;

mongoose.connect(mongoUrl, { useMongoClient: true });

let db = mongoose.connection;

db.on('error', (error) => {
  console.log(`Error while attempting to connect to mogodb server: ${mongoUrl}. The error message is: ${error}`);
});

db.once('open', () => {
  console.log(`Successfully connected to mongodb server: ${mongoUrl}`);
});

app.get('/api/inventory', (req, res) => {
  InventoryItemModel.find((error, inventoryItems) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(inventoryItems);
    }
  });
});

app.get('/api/inventory/:itemId', (req, res) => {
  let itemId = req.params.itemId;

  InventoryItemModel.findOne({itemId: itemId}, (error, inventoryItem) => {
    if(error) {
      res.status(500).send(error);
    } else {
      if (inventoryItem) {
        res.send(inventoryItem);
      } else {
        res.status(404).send('No such inventory item found.');
      }
    }
  });
});

app.post('/api/inventory', (req, res) => {
  InventoryItemModel.createInventoryItem(req.body, (error, inventoryItem) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(inventoryItem);
    }
  });
});

app.put('/api/inventory/:itemId', (req, res) => {
  let inventoryItem = req.body;

  InventoryItemModel.findOneAndUpdate({itemId: inventoryItem.itemId}, inventoryItem, null, (error, doc) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(doc);
    }
  });
});

app.delete('/api/inventory/:itemId', (req, res) => {
  let itemId = req.params.itemId;

  InventoryItemModel.findOneAndRemove({itemId: itemId}, (error) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.sendStatus(204);
    }
  });
});

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Amart Online inventory service listening on port ${port}`);
