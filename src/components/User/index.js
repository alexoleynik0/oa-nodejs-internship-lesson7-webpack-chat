const { checkUserIsAuth } = require('../../helpers/http/restResponse');
const UserService = require('./service');

async function getMe(req, res) {
  const user = await UserService.findById(req.authUserPayload.id);
  checkUserIsAuth(user);

  res.status(200).json({
    data: user,
  });
}

async function findAll(req, res) {
  const { query } = req.query;
  const limit = 10;
  const users = await UserService.findByQuery(query, limit);

  res.status(200).json({
    data: users,
  });
}

module.exports = {
  getMe,
  findAll,
};
