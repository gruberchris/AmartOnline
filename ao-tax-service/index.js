const express  = require('express');
const path = require('path');

const app = express();

const allowCrossDomain = (request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
};

app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname)));

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
