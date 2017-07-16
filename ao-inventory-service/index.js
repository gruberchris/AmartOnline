const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const InventoryItemModel = require('./models/inventoryItemModel');

const app = express();

const allowCrossDomain = (request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
};

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const mongoHostName = process.env.MONGO_HOST_NAME || 'nas';
const mongoUrl = `mongodb://${mongoHostName}:27017/AmartOnline`;

mongoose.connect(mongoUrl);

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
