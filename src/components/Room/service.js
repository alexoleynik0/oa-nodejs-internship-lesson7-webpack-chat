const RoomModel = require('./models/rooms');

async function create(creator, users) {
  const room = await RoomModel
    .create({
      creator,
      users,
    });

  users.forEach((user) => {
    user.rooms.push(room);
  });
  await Promise.all(
    users.map((user) => user.save()),
  );

  return room;
}

function findAllForUser(user) {
  return RoomModel
    .find({
      _id: { $in: user.rooms },
    })
    .select('creator updatedAt')
    .sort('-updatedAt')
    .populate([{
      path: 'users',
      match: { _id: { $ne: user.id } },
      select: 'nickname photoUrl',
    }, {
      path: 'lastMessage',
      select: 'text',
    }])
    .exec();
}

function findByUsers(users) {
  return RoomModel
    .findOne({ users })
    .select('_id')
    .exec();
}

function findByIdForUser(user, roomId) {
  return RoomModel
    .findOne({ _id: roomId, users: user })
    .select('creator updatedAt')
    .sort('-updatedAt')
    .populate([{
      path: 'users',
      match: { _id: { $ne: user.id } },
      select: 'nickname photoUrl',
    }, {
      path: 'messagesCount',
    }])
    .exec();
}

module.exports = {
  create,
  findAllForUser,
  findByUsers,
  findByIdForUser,
};
