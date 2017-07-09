const express = require('express');
const path =  require('path');

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/api/item', (req, res) => {

});

app.get('/api/item/:item_id', (req, res) => {

});

app.put('/api/item/:item_id', (req, res) => {

});

app.post('/api/item/:item_id', (req, res) => {

});

app.delete('/api/item/:item_id', (req, res) => {

});

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Amart Online item service listening on port ${port}`);
