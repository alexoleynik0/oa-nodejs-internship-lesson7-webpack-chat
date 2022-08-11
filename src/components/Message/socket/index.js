const { checkUserIsAuth } = require('../../../helpers/http/restResponse');
const { validateSocketData } = require('../../../middleware/validationHandler');
const MessageComponent = require('..');
const MessageValidations = require('../validations');

async function create(socket, createData) {
  checkUserIsAuth(socket.data.user);
  await validateSocketData(MessageValidations.create)(createData);

  const { roomId, text } = createData;
  const user = await socket.data.getAuthUser();

  const message = await MessageComponent.create(user, roomId, text);

  return {
    data: message.id,
  };
}

async function findAllByRoomId(socket, getData) {
  checkUserIsAuth(socket.data.user);
  await validateSocketData(MessageValidations.findAllByRoomId)(getData);

  const { roomId } = getData;
  const user = await socket.data.getAuthUser();

  const messages = await MessageComponent.findAllByRoomId(user, roomId);

  return {
    data: messages,
  };
}

const MessageSocketRequests = {
  create,
  findAllByRoomId,
};

module.exports = MessageSocketRequests;
