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
  return user
    .populate({
      path: 'rooms',
      select: 'creator lastMessageAt',
      sort: '-lastMessageAt -updatedAt',
      populate: [{
        path: 'users',
        match: { _id: { $ne: user.id } },
        select: 'nickname photoUrl',
      }, {
        path: 'lastMessage',
        select: 'text',
      }],
    });
}

function findByIdForUser(user, roomId) {
  return user
    .populate({
      path: 'rooms',
      match: { _id: roomId },
      select: 'creator lastMessage',
      populate: [{
        path: 'users',
        match: { _id: { $ne: user.id } },
        select: 'nickname photoUrl',
      }, {
        path: 'messagesCount',
      }],
    });
}

module.exports = {
  create,
  findAllForUser,
  findByIdForUser,
};
