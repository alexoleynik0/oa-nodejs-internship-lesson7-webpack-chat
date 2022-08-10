const { Server: SocketIoServer } = require('socket.io');
const SocketComponent = require('../components/Socket');

let io;

const socketConnection = (httpServer) => {
  io = new SocketIoServer(httpServer);

  io.on('connection', SocketComponent.connection);
};

const socketEmitToAll = (key, message) => { io.emit(key, message); };

const socketEmitToRoom = (roomName, key, message) => { io.to(roomName).emit(key, message); };

module.exports = {
  socketConnection,
  socketEmitToAll,
  socketEmitToRoom,
};
