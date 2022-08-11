const { checkResourceIsFound } = require('../../helpers/http/restResponse');
const { socketEmitToRoom } = require('../../config/webSockets');
const MessageService = require('./service');
const RoomService = require('../Room/service');

async function create(user, roomId, text) {
  if (user.rooms.indexOf(roomId) === -1) { // TODO: move to validation
    checkResourceIsFound(null);
  }

  const message = await MessageService.create(user, roomId, text);

  const room = await RoomService.findById(roomId, 'users');
  socketEmitToRoom(room.users.map((u) => u.toString()), 'message:create', message);

  return message;
}

async function findAllByRoomId(user, roomId) {
  const limit = 1000;
  if (user.rooms.indexOf(roomId) === -1) {
    checkResourceIsFound(null);
  }

  return MessageService.findAllByRoomId(roomId, limit);
}

const MessageComponent = {
  create,
  findAllByRoomId,
};

module.exports = MessageComponent;
