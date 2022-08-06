const { checkResourceIsFound } = require('../../helpers/http/restResponse');
const RoomService = require('./service');
const UserService = require('../User/service');
const { socketEmitToRoom } = require('../../helpers/socket-io');

async function create(req, res) {
  const { userId } = req.body;
  const user = await req.getAuthUser();
  const users = await UserService.findByIds([user.id, userId]);

  let room = await RoomService.findByUsers(users); // NOTE: check if it exists

  if (room === null) { // NOTE: if it's realy new Room - create
    room = await RoomService.create(user, users);

    socketEmitToRoom(room.users.map((u) => u.id.toString()), 'room:create', room);
  }

  res.status(201).json({
    data: room.id,
  });
}

async function findAll(req, res) {
  const user = await req.getAuthUser();

  const rooms = await RoomService.findAllForUser(user);

  res.status(200).json({
    data: rooms,
  });
}

async function findById(req, res) {
  const { roomId } = req.params;
  const user = await req.getAuthUser();

  const room = await RoomService.findByIdForUser(user, roomId);
  checkResourceIsFound(room);

  res.status(200).json({
    data: room,
  });
}

module.exports = {
  create,
  findAll,
  findById,
};
