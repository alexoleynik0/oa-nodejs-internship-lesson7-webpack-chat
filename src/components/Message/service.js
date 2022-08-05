const MessageModel = require('./models/messages');
const RoomModel = require('../Room/models/rooms');

async function create(roomId, user, text) {
  const message = await MessageModel
    .create({
      room: roomId,
      user,
      text,
    });

  RoomModel
    .updateOne({ _id: roomId }, {
      lastMessage: message,
      lastMessageAt: Date.now(),
    })
    .exec();

  return message;
}

function findAllByRoomId(roomId, limit) {
  return MessageModel
    .find({
      room: roomId,
    })
    .select('text user createdAt')
    .sort({ createdAt: 1 })
    .limit(limit)
    .exec();
}

module.exports = {
  create,
  findAllByRoomId,
};
