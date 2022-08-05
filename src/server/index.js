const http = require('http');
const { Server: SocketIoServer } = require('socket.io');
require('./dotenv');
const events = require('./events');
const server = require('./server');

const port = server.get('port');

const httpServer = http.createServer(server);

const io = new SocketIoServer(httpServer);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

events.bindServer(
  httpServer.listen(port),
);
