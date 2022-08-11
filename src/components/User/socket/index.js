const { checkUserIsAuth } = require('../../../helpers/http/restResponse');
const UserComponent = require('..');
const { validateSocketData } = require('../../../middleware/validationHandler');
const UserValidations = require('../validations');

async function getMe(socket) {
  checkUserIsAuth(socket.data.user); // TODO: move to the router
  const user = await UserComponent.getMe(socket.data.user.id);

  return {
    data: user,
  };
}

async function findAll(_socket, reqData) {
  await validateSocketData(UserValidations.findAll)(reqData); // TODO: move to the router

  const users = await UserComponent.findAll(reqData.query);

  return {
    data: users,
  };
}

const UserSocketRequests = {
  getMe,
  findAll,
};

module.exports = UserSocketRequests;
