const RoomComponent = require('..');

async function create(req, res) {
  const { userId } = req.body;
  const creator = await req.getAuthUser();

  const room = await RoomComponent.create(creator, userId);

  res.status(201).json({
    data: room.id,
  });
}

async function findAll(req, res) {
  const user = await req.getAuthUser();

  const rooms = await RoomComponent.findAll(user);

  res.status(200).json({
    data: rooms,
  });
}

async function findById(req, res) {
  const { roomId } = req.params;
  const user = await req.getAuthUser();

  const room = await RoomComponent.findById(user, roomId);

  res.status(200).json({
    data: room,
  });
}

const RoomHttpRequests = {
  create,
  findAll,
  findById,
};

module.exports = RoomHttpRequests;
