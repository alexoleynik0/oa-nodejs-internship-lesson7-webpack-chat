const AuthSocketRequests = require('../Auth/socket');
const AuthSocketRouter = require('../Auth/socket/router');
const MessageSocketRouter = require('../Message/socket/router');
const RoomSocketRouter = require('../Room/socket/router');
const UserSocketRouter = require('../User/socket/router');

// -- socket "ROUTER" --

async function connection(socket) {
  AuthSocketRequests.userJoinRooms(socket);

  // auth
  AuthSocketRouter.init(socket);

  // users
  UserSocketRouter.init(socket);

  // rooms
  RoomSocketRouter.init(socket);

  // messages
  MessageSocketRouter.init(socket);
}

module.exports = {
  connection,
};
