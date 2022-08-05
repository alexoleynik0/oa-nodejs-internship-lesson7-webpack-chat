const { checkResourceIsFound } = require('../../helpers/http/restResponse');
const RoomService = require('./service');
const UserService = require('../User/service');

async function create(req, res) {
  const { userId } = req.body;
  const user = await req.getAuthUser();
  const users = await UserService.findByIds([user.id, userId]);

  const room = await RoomService.create(user, users);

  res.status(201).json({
    data: room.id,
  });
}

async function findAll(req, res) {
  const user = await req.getAuthUser();
  await RoomService.findAllForUser(user);

  res.status(200).json({
    data: user.rooms,
  });
}

async function findById(req, res) {
  const { roomId } = req.params;
  const user = await req.getAuthUser();
  await RoomService.findByIdForUser(user, roomId);
  checkResourceIsFound(user.rooms[0]);

  res.status(200).json({
    data: user.rooms[0],
  });
}

module.exports = {
  create,
  findAll,
  findById,
};
