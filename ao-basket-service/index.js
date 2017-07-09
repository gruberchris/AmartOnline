const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/api/basket/:basket_id', (req, res) => {

});

app.put('/api/basket/:basket_id', (req, res) => {

});

app.post('/api/basket/:basket_id', (req, res) => {

});

app.delete('/api/basket/:basket_id', (req, res) => {

});

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Amart Online basket service listening on port ${port}`);
