const { checkUserIsAuth } = require('../../../helpers/http/restResponse');
const UserService = require('../../User/service');
const jwtFacade = require('../helpers/jwt.facade');

async function userOnline(socket, user) {
  const roomIds = user.rooms.map((roomId) => roomId.toString());

  UserService.updateLastActivityById(user.id);

  socket.to(roomIds).emit('user:online', user.id);
}

async function userOffline(socket) {
  checkUserIsAuth(socket.data.user);

  const user = await UserService.findById(socket.data.user.id);

  const roomIds = user.rooms.map((roomId) => roomId.toString());

  socket.to(roomIds).emit('user:offline', user.id);
}

async function userJoinRooms(socket, authData = {}) {
  const accessToken = authData.accessToken || socket.handshake.headers.authorization?.replace('Bearer ', '');

  const payload = await jwtFacade.getPayloadFromJWT(accessToken);

  if (jwtFacade.isPayloadInvalid(payload, jwtFacade.tokenTypes.access)) {
    socket.emit('auth:access-token-expired');
    return;
  }

  // TODO: check if there's no issues with this approach
  const getAuthUser = async () => UserService.findById(payload.user.id);

  const user = await getAuthUser();

  const roomIds = user.rooms.map((roomId) => roomId.toString());

  // eslint-disable-next-line no-param-reassign
  socket.data.user = payload.user; // NOTE: why not?
  // eslint-disable-next-line no-param-reassign
  socket.data.getAuthUser = getAuthUser;

  userOnline(socket, user);

  socket.join(user.id);
  socket.join(roomIds);
}

const AuthSocketRequests = {
  userOnline,
  userOffline,
  userJoinRooms,
};

module.exports = AuthSocketRequests;
