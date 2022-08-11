const { checkResourceIsFound } = require('../../helpers/http/restResponse');
const { socketEmitToRoom } = require('../../config/webSockets');
const RoomService = require('./service');
const UserService = require('../User/service');

async function create(creator, userId) {
  const users = await UserService.findByIds([creator.id, userId]);

  let room = await RoomService.findByUsers(users); // NOTE: check if it exists

  if (room === null) { // NOTE: if it's really new Room - create
    room = await RoomService.create(creator, users);

    socketEmitToRoom(room.users.map((u) => u.id.toString()), 'room:create', room);
  }

  return room;
}

async function findAll(user) {
  return RoomService.findAllForUser(user);
}

async function findById(user, roomId) {
  const room = await RoomService.findByIdForUser(user, roomId);
  checkResourceIsFound(room);

  return room;
}

const RoomComponent = {
  create,
  findAll,
  findById,
};

module.exports = RoomComponent;
