const { Schema } = require('mongoose');
const mongooseConnection = require('../../../config/connection');
const modifyMongooseSchema = require('../../../helpers/db/modifyMongooseSchema');

const COLLECTION_NAME = 'rooms';
const MODEL_NAME = 'RoomModel';

const schema = new Schema(
  {
    lastMessageAt: {
      type: Date,
    },

    // relations
    creator: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    users: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'MessageModel' },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
    versionKey: false,
  },
);

modifyMongooseSchema(schema);

module.exports = mongooseConnection.model(MODEL_NAME, schema);
