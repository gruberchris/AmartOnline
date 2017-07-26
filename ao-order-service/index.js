const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const OrderModel = require('./models/orderModel');
const { Config } = require('./config');

const app = express();
const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${Config.Auth.domain}/.well-known/jwks.json`
  }),
  audience: Config.Auth.audience,
  issuer: `https://${Config.Auth.domain}/`,
  algorithms: ['RS256']
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authCheck);
app.use(cors());

const mongoHostName = process.env.MONGO_HOST_NAME || 'ao-mongo';
const mongoUrl = `mongodb://${mongoHostName}:27017/AmartOnline`;

mongoose.connect(mongoUrl);

let db = mongoose.connection;

db.on('error', (error) => {
  console.log(`Error while attempting to connect to mogodb server: ${mongoUrl}. The error message is: ${error}`);
});

db.once('open', () => {
  console.log(`Successfully connected to mongodb server: ${mongoUrl}`);
});

app.get('/api/order', (req, res) => {
  OrderModel.find((error, orders) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(orders);
    }
  });
});

app.get('/api/order/user/:userId', (req, res) => {
  let userId = req.params.userId;

  OrderModel.find({userId: userId}, (error, orders) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(orders);
    }
  });
});

app.get('/api/order/:orderId', (req, res) => {
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

app.post('/api/order', (req, res) => {
  let order = req.body;
  order.orderId = new Date().getTime();
  order.itemQuantity = order.orderItems.length;
  order.subtotal = 0;
  order.totalTax = 0;

  order.orderItems.forEach((item) => {
    order.subtotal += item.price;
  });

  // TODO: Call Tax API for taxrate

  order.total = order.subtotal + order.totalTax;

  OrderModel.createOrder(order, (error, order) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(order);
    }
  });
});

app.put('/api/order/:orderId', (req, res) => {
  let order = req.body;

  OrderModel.findOneAndUpdate({orderId: order.orderId}, order, null, (error, doc) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(doc);
    }
  });
});

app.delete('/api/order/:orderId', (req, res) => {
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
