const express = require ('express');
const bodyParser = require('body-parser');
const {port} = require('./config.json');
const router = require('./routes/network');

let app = express();
app.use(bodyParser.json({ extended: false }));
app.use(router);
app.listen(port);

console.log(`Listening to http://localhost:${port}`);

//TODO: docker compose
//TODO: edit readme describing the asumptions
//TODO: split the router
//TODO: create a logging util
//TODO: create an error class??