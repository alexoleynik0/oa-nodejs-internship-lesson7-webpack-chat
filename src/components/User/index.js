const { checkUserIsAuth } = require('../../helpers/http/restResponse');
const UserService = require('./service');

async function getMe(id) {
  const user = await UserService.findById(id);
  checkUserIsAuth(user);

  return user;
}

async function findAll(query) {
  const limit = 10;
  return UserService.findByQuery(query, limit);
}

const UserComponent = {
  getMe,
  findAll,
};

module.exports = UserComponent;
