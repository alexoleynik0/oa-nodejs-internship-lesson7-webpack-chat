const http = require('http');
const { socketConnection } = require('../helpers/socket-io');
require('./dotenv');
const events = require('./events');
const server = require('./server');

const port = server.get('port');

const httpServer = http.createServer(server);

socketConnection(httpServer);

events.bindServer(
  httpServer.listen(port),
);
