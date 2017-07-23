const express  = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

let stateTaxRates = {};

stateTaxRates["IA"] = {state: "IA", rate: 5.0};
stateTaxRates["IL"] = {state: "IL", rate: 6.0};
stateTaxRates["MI"] = {state: "MI", rate: 3.0};
stateTaxRates["MN"] = {state: "MN", rate: 7.5};
stateTaxRates["WI"] = {state: "WI", rate: 4.25};

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

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Amart Online tax status service listening on port ${port}`);
