const socketAsyncErrorCatcher = require('../../Socket/helpers/socketAsyncErrorCatcher');
const SocketRouter = require('../../Socket/helpers/SocketRouter');
const RoomSocketRequests = require('.');

const socketRouter = new SocketRouter();

socketRouter.add(
  'rooms:find-all',
  socketAsyncErrorCatcher(RoomSocketRequests.findAll),
);

socketRouter.add(
  'rooms:create',
  socketAsyncErrorCatcher(RoomSocketRequests.create),
);

socketRouter.add(
  'rooms:find-by-id',
  socketAsyncErrorCatcher(RoomSocketRequests.findById),
);

module.exports = socketRouter;
