const { checkUserIsAuth } = require('../../../helpers/http/restResponse');
const { validateSocketData } = require('../../../middleware/validationHandler');
const RoomComponent = require('..');
const RoomValidations = require('../validations');

async function create(socket, createData) {
  checkUserIsAuth(socket.data.user);
  await validateSocketData(RoomValidations.create)(createData);

  const { userId } = createData;

  const creator = await socket.data.getAuthUser();

  const room = await RoomComponent.create(creator, userId);

  return {
    data: room.id,
  };
}

async function findAll(socket) {
  checkUserIsAuth(socket.data.user);

  const user = await socket.data.getAuthUser();

  const rooms = await RoomComponent.findAll(user);

  return {
    data: rooms,
  };
}

async function findById(socket, getData) {
  checkUserIsAuth(socket.data.user);
  await validateSocketData(RoomValidations.findById)(getData);

  const { roomId } = getData;

  const user = await socket.data.getAuthUser();

  const room = await RoomComponent.findById(user, roomId);

  return {
    data: room,
  };
}

const RoomSocketRequests = {
  create,
  findAll,
  findById,
};

module.exports = RoomSocketRequests;
