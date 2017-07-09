const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/api/order', (req, res) => {

});

app.get('/api/order/:order_id', (req, res) => {

});

app.put('/api/order/:order_id', (req, res) => {

});

app.post('/api/order/:order_id', (req, res) => {

});

app.delete('/api/order/:order_id', (req, res) => {

});

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Amart Online order service listening on port ${port}`);
