const http = require('http');
require('./dotenv');
const { socketConnection } = require('../config/webSockets');
const events = require('./events');
const server = require('./server');

const port = server.get('port');

const httpServer = http.createServer(server);

socketConnection(httpServer);

events.bindServer(
  httpServer.listen(port),
);
