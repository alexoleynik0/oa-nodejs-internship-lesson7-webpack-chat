const RoomService = require('./service');
const UserService = require('../User/service');

async function findAll(req, res) {
  const user = await req.getAuthUser();
  await RoomService.findForUser(user);

  res.status(200).json({
    data: user.rooms,
  });
}

async function create(req, res) {
  const { userId } = req.body;
  const user = await req.getAuthUser();
  const users = await UserService.findByIds([user.id, userId]);
  await RoomService.create(user, users);

  res.status(201).end();
}

module.exports = {
  findAll,
  create,
};
