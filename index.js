const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');

app.set('port', 3000);
app.use(bodyParser.json());
app.use(express.static('public'));
routes.configure(app);

const server = require('http').createServer(app);

server.listen(app.get('port'), function () {
  console.log(`Node app is running on port ${app.get('port')}`);
})
