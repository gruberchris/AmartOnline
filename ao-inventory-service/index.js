const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/api/inventory', (req, res) => {
    res.send('TODO');
});

app.get('/api/inventory/:inventory_id', (req, res) => {
    res.status(404).send('No inventory available for this item');
});

app.put('/api/inventory/:inventory_id', (req, res) => {

});

app.post('/api/inventory/:inventory_id', (req, res) => {

});

app.delete('/api/inventory/:inventory_id', (req, res) => {

});

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Amart Online inventory service listening on port ${port}`);
