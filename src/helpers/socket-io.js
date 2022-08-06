const { Server: SocketIoServer } = require('socket.io');

let io;

const socketConnection = (httpServer) => {
  io = new SocketIoServer(httpServer);

  io.on('connection', (socket) => {
    // WARNING: not sure about this
    socket.join(socket.handshake.query.roomName);
  });
};

const socketEmitToAll = (key, message) => io.emit(key, message);

const socketEmitToRoom = (roomName, key, message) => io.to(roomName).emit(key, message);

module.exports = {
  socketConnection,
  socketEmitToAll,
  socketEmitToRoom,
};
