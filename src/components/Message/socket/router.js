const socketAsyncErrorCatcher = require('../../Socket/helpers/socketAsyncErrorCatcher');
const SocketRouter = require('../../Socket/helpers/SocketRouter');
const MessageSocketRequests = require('.');

const socketRouter = new SocketRouter();

socketRouter.add(
  'messages:create',
  socketAsyncErrorCatcher(MessageSocketRequests.create),
);

socketRouter.add(
  'messages:find-all-by-room-id',
  socketAsyncErrorCatcher(MessageSocketRequests.findAllByRoomId),
);

module.exports = socketRouter;
