const express  = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/api/tax/:state', (req, res) => {

});

const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Amart Online tax status service listening on port ${port}`);
