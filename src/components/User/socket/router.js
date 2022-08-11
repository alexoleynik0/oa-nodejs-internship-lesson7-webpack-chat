const socketAsyncErrorCatcher = require('../../Socket/helpers/socketAsyncErrorCatcher');
const SocketRouter = require('../../Socket/helpers/SocketRouter');
const UserSocketRequests = require('.');

const socketRouter = new SocketRouter();

socketRouter.add(
  'users:get-me',
  socketAsyncErrorCatcher(UserSocketRequests.getMe),
);

socketRouter.add(
  'users:find-all',
  socketAsyncErrorCatcher(UserSocketRequests.findAll),
);

module.exports = socketRouter;
