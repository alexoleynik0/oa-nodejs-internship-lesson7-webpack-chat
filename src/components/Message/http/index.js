const MessageComponent = require('..');

async function create(req, res) {
  const { roomId, text } = req.body;
  const user = await req.getAuthUser();

  const message = await MessageComponent.create(user, roomId, text);

  res.status(201).json({
    data: message.id,
  });
}

async function findAllByRoomId(req, res) {
  const { roomId } = req.params;
  const user = await req.getAuthUser();

  const messages = await MessageComponent.findAllByRoomId(user, roomId);

  res.status(200).json({
    data: messages,
  });
}

const MessageHttpRequests = {
  create,
  findAllByRoomId,
};

module.exports = MessageHttpRequests;
