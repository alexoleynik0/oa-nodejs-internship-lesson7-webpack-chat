const { Schema } = require('mongoose');
const mongooseConnection = require('../../../config/mongooseConnection');
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

schema.virtual('messages', {
  ref: 'MessageModel',
  localField: '_id',
  foreignField: 'room',
});
schema.virtual('messagesCount', {
  ref: 'MessageModel',
  localField: '_id',
  foreignField: 'room',
  count: true, // * only get the number of docs
});

modifyMongooseSchema(schema);

module.exports = mongooseConnection.model(MODEL_NAME, schema);
