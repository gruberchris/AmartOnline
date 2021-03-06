const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');
const OrderModel = require('./models/orderModel');
const NicHelper = require('./nicHelper');
const axios = require('axios');
const { Config } = require('./config');

mongoose.Promise = global.Promise;

const config = Config;
config.Auth.domain = process.env.AO_AUTH_DOMAIN || config.Auth.domain;
config.Auth.audience = process.env.AO_AUTH_AUDIENCE || config.Auth.audience;
config.Auth.clientId = process.env.AO_AUTH_CLIENTID || config.Auth.clientId;
config.Auth.clientSecret = process.env.AO_AUTH_CLIENTSECRET || config.Auth.clientSecret;
config.Auth.scope = process.env.AO_AUTH_SCOPE || config.Auth.scope;
config.Auth.taxApiUri = process.env.AO_AUTH_TAXAPIURI || config.Auth.taxApiUri;
config.Auth.inventoryApiUri = process.env.AO_AUTH_INVENTORYAPIURI || config.Auth.inventoryApiUri;
config.Mongo.host = process.env.AO_MONGO_HOST || config.Mongo.host;

console.log(`Auth0 domain set to ${config.Auth.domain}`);
console.log(`Auth0 audience set to ${config.Auth.audience}`);
console.log(`Auth0 client id set to ${config.Auth.clientId}`);
console.log(`Auth0 client secret set to ${config.Auth.clientSecret}`);
console.log(`Auth0 scope set to ${config.Auth.scope}`);
console.log(`Auth0 taxapiuri set to ${config.Auth.taxApiUri}`);
console.log(`Auth0 inventoryapiuri set to ${config.Auth.inventoryApiUri}`);
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

const nicHelper = new NicHelper(config.Auth.domain, config.Auth.clientId, config.Auth.clientSecret);

app.get('/api/order', authCheck, jwtAuthz(['readall:order']), (req, res) => {
  OrderModel.find((error, orders) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(orders);
    }
  });
});

app.get('/api/order/user/:userId', authCheck, jwtAuthz(['read:order']), (req, res) => {
  let userId = req.params.userId;

  OrderModel.find({userId: userId}, (error, orders) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(orders);
    }
  });
});

app.get('/api/order/:orderId', authCheck, jwtAuthz(['read:order']), (req, res) => {
  let orderId = req.params.orderId;

  OrderModel.findOne({orderId: orderId}, (error, order) => {
    if(error) {
      res.status(500).send(error);
    } else {
      if (order) {
        res.send(order);
      } else {
        res.status(404).send('No such order found.');
      }
    }
  });
});

app.post('/api/order', authCheck, jwtAuthz(['create:order']), (req, res) => {
  let order = req.body;
  order.orderId = new Date().getTime();
  order.itemQuantity = 0;
  order.subtotal = 0;
  order.totalTax = 0;

  const roundToCurrency = (currencyValue) => {
    return +currencyValue.toFixed(2);
  };

  order.orderItems.forEach((item) => {
    order.itemQuantity += item.quantity;
    order.subtotal += item.quantity * item.price;
  });

  order.subtotal = roundToCurrency(order.subtotal);

  nicHelper.getAccessToken(config.Auth.audience).then((accessToken) => {
    // TODO: Read this from user profile or identity token
    const tempTaxState = 'MN';

    axios.get(`${config.Auth.taxApiUri}/api/tax/${tempTaxState}`, { headers: { Authorization: `Bearer ${accessToken}`}}).then((taxResult) => {
      order.totalTax = order.subtotal * (taxResult.data.rate / 100);
      order.totalTax = roundToCurrency(order.totalTax);
      order.total = order.subtotal + order.totalTax;
      order.total = roundToCurrency(order.total);

      console.log(`Tax rate for ${taxResult.data.state} is ${taxResult.data.rate}%`);
      console.log(`Tax on a purchase of ${order.subtotal} is ${order.totalTax}`);

      OrderModel.createOrder(order, (error, order) => {
        if(error) {
          console.error(`Error attempting to save order to mongo database: ${error}`);
          res.status(500).send(error);
        } else {
          console.log(`Order ${order.orderId} created for ${order.customerEmail}.`);
          console.log(order);
          res.send(order);
        }
      });
    }).catch((error) => {
      console.error(`Error attempting to GET tax rate: ${error}`);
      res.status(500).send(error);
    });

  }).catch((error) => {
    console.error(`Error attempting retrieving auth token: ${error}`);
    res.status(500).send(error);
  });
});

app.put('/api/order/:orderId', authCheck, jwtAuthz(['edit:order']), (req, res) => {
  let order = req.body;

  OrderModel.findOneAndUpdate({orderId: order.orderId}, order, null, (error, doc) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(doc);
    }
  });
});

app.delete('/api/order/:orderId', authCheck, jwtAuthz(['delete:order']), (req, res) => {
  let orderId = req.params.orderId;

  OrderModel.findOneAndRemove({orderId: orderId}, (error) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.sendStatus(204);
    }
  });
});

const port = process.env.PORT || 5002;

app.listen(port);

console.log(`Amart Online order service listening on port ${port}`);
