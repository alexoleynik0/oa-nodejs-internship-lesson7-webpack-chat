const socketAsyncErrorCatcher = require('../../Socket/helpers/socketAsyncErrorCatcher');
const SocketRouter = require('../../Socket/helpers/SocketRouter');
const AuthSocketRequests = require('.');

const socketRouter = new SocketRouter();

socketRouter.add(
  'auth:reconnect',
  socketAsyncErrorCatcher(AuthSocketRequests.userJoinRooms),
);

socketRouter.add(
  'disconnect', // NOTE: without `auth:` prefix as it's socket's reserved event
  socketAsyncErrorCatcher(AuthSocketRequests.userOffline),
);

module.exports = socketRouter;
