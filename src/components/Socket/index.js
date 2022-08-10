const { checkUserIsAuth } = require('../../helpers/http/restResponse');
const jwtFacade = require('../Auth/helpers/jwt.facade');
const socketAsyncErrorCatcher = require('./helpers/socketAsyncErrorCatcher');
const UserService = require('../User/service');

// -- ACTIONS / CONTROLLERS --

const userOnline = (socket, user) => {
  const roomIds = user.rooms.map((roomId) => roomId.toString());
  UserService.updateLastActivityById(user.id);
  socket.to(roomIds).emit('user:online', user.id);
};

const userOffline = (socket) => async () => {
  checkUserIsAuth(socket.data.user);
  const user = await UserService.findById(socket.data.user.id);
  const roomIds = user.rooms.map((roomId) => roomId.toString());
  socket.to(roomIds).emit('user:offline', user.id);
};

const userJoinRooms = async (accessToken, socket) => {
  const payload = await jwtFacade.getPayloadFromJWT(accessToken);

  if (jwtFacade.isPayloadInvalid(payload, jwtFacade.tokenTypes.access)) {
    socket.emit('auth:access-token-expired');
    return;
  }

  const user = await UserService.findById(payload.user.id);

  const roomIds = user.rooms.map((roomId) => roomId.toString());

  // eslint-disable-next-line no-param-reassign
  socket.data.user = payload.user; // NOTE: why not?

  userOnline(socket, user);

  socket.join(user.id);
  socket.join(roomIds);
};

const userGetMe = (socket) => async () => {
  checkUserIsAuth(socket.data.user);
  const user = await UserService.findById(socket.data.user.id);
  checkUserIsAuth(user);

  return {
    data: user,
  };
};

// -- socket "ROUTER" --

async function connection(socket) {
  // default on connect
  const accessToken = socket.handshake.headers.authorization?.replace('Bearer ', '');
  socketAsyncErrorCatcher(userJoinRooms(accessToken, socket));

  // reserved
  socket.on('disconnect', socketAsyncErrorCatcher(userOffline(socket)));

  // auth
  socket.on('auth:reconnect', (accessToken2) => {
    userJoinRooms(accessToken2, socket);
  });

  // user
  socket.on('user:get-me', socketAsyncErrorCatcher(userGetMe(socket)));
}

module.exports = {
  connection,
};
