const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const BasketModel = require('./models/basketModel');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

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

app.get('/api/basket/:basketId', (req, res) => {
  let basketId = req.params.basketId;

  BasketModel.findOne({basketId: basketId}, (error, basket) => {
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

app.put('/api/basket/:basketId', (req, res) => {
  let basket = req.body;

  BasketModel.findOneAndUpdate({basketId: basket.basketId}, basket, null, (error, doc) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.send(doc);
    }
  });
});

app.delete('/api/basket/:basketId', (req, res) => {
  let basketId = req.params.basketId;

  BasketModel.findOneAndRemove({basketId: basketId}, (error) => {
    if(error) {
      res.status(500).send(error);
    } else {
      res.sendStatus(204);
    }
  });
});

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Amart Online basket service listening on port ${port}`);
