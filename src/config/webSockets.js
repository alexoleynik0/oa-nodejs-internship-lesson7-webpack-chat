const { Server: SocketIoServer } = require('socket.io');

let io;

const socketConnection = (httpServer) => {
  io = new SocketIoServer(httpServer);

  // TODO: more this to imports (low priority?)
  // eslint-disable-next-line global-require
  io.on('connection', require('../components/Socket').connection);
};

const socketEmitToAll = (key, message) => { io.emit(key, message); };

const socketEmitToRoom = (roomName, key, message) => { io.to(roomName).emit(key, message); };

module.exports = {
  socketConnection,
  socketEmitToAll,
  socketEmitToRoom,
};
