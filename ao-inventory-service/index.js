import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/api/inventory', (req, res) => {

});

app.get('/api/inventory/:inventory_id', (req, res) => {

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