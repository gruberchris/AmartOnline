const express  = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/api/orderstatus/:order_id', (req, res) => {

});

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Amart Online order status service listening on port ${port}`);
