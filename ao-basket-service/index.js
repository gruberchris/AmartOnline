const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const BasketModel = require('./models/basketModel');

const app = express();

app.use(bodyParser.json());
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

app.get('/api/basket', (req, res) => {
  BasketModel.find((error, baskets) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(baskets);
    }
  });
});

app.get('/api/basket/:userId', (req, res) => {
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

app.post('/api/basket', (req, res) => {
  BasketModel.createBasket(req.body, (error, basket) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(basket);
    }
  });
});

app.put('/api/basket/:userId', (req, res) => {
  let basket = req.body;

  BasketModel.findOneAndUpdate({userId: basket.userId}, basket, null, (error, doc) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(doc);
    }
  });
});

app.delete('/api/basket/:userId', (req, res) => {
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
