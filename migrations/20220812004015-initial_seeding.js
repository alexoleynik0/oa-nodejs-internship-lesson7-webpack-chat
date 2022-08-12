const AuthService = require('../src/components/Auth/service');
const UserService = require('../src/components/User/service');
const RoomService = require('../src/components/Room/service');
const MessageService = require('../src/components/Message/service');

module.exports = {
  async up() {
    // create users
    const password = '1234';
    const usersToCreate = [
      { nickname: 'john', password },
      { nickname: 'lisa', password },
      { nickname: 'alex', password },
    ];

    const users = await Promise.all(usersToCreate.map(AuthService.createUser));

    // add "online" status for last one
    UserService.updateLastActivityById(users[users.length - 1].id);

    // create rooms
    const roomsToCreate = [
      [users[0], [users[0]]],
      [users[0], [users[0], users[1]]],
      [users[0], [users[0], users[2]]],
    ];

    const rooms = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const createData of roomsToCreate) {
      // eslint-disable-next-line no-await-in-loop
      rooms.push(await RoomService.create(...createData));
    }

    // create messages
    const messagesToCreate = [
      [users[0], rooms[0].id, 'Don\'t forget to commit changes..'],
      [users[0], rooms[1].id, 'hi. how are you?'],
      [users[1], rooms[1].id, 'whassup?'],
    ];

    await Promise.all(
      messagesToCreate.map((createData) => MessageService.create(...createData)),
    );
  },

  async down(db) {
    await db.collection('messages').deleteMany({});
    await db.collection('rooms').deleteMany({});
    await db.collection('users').deleteMany({});
  },
};
