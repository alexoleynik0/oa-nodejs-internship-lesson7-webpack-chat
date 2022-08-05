const RoomModel = require('./models/rooms');
// const UserModel = require('../User/models/users');

function findForUser(user) {
  return user
    .populate({
      path: 'rooms',
      select: 'creator updatedAt',
      populate: {
        path: 'users',
        match: { _id: { $ne: user.id } },
        select: 'nickname photoUrl',
      },
    });
}

async function create(creator, users) {
  const room = await RoomModel.create({
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

module.exports = {
  findForUser,
  create,
};
