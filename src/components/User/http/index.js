const UserComponent = require('..');

async function getMe(req, res) {
  const user = await UserComponent.getMe(req.authUserPayload.id);

  res.status(200).json({
    data: user,
  });
}

async function findAll(req, res) {
  const { query } = req.query;
  const users = await UserComponent.findAll(query);

  res.status(200).json({
    data: users,
  });
}

const UserHttpRequests = {
  getMe,
  findAll,
};

module.exports = UserHttpRequests;
