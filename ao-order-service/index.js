const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const OrderModel = require('./models/orderModel');
const { Config } = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const mongoHostName = process.env.MONGO_HOST_NAME || 'localhost';
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
  OrderModel.createOrder(req.body, (error, order) => {
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

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Amart Online order service listening on port ${port}`);
