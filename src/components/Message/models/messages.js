const { Schema } = require('mongoose');
const mongooseConnection = require('../../../config/connection');
const modifyMongooseSchema = require('../../../helpers/db/modifyMongooseSchema');

const COLLECTION_NAME = 'messages';
const MODEL_NAME = 'MessageModel';

const schema = new Schema(
  {
    text: {
      type: String,
      trim: true,
      required: true,
    },

    // TODO: work on readByUsers / isReadByAll

    // relations
    user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    room: { type: Schema.Types.ObjectId, ref: 'RoomModel' },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
    versionKey: false,
  },
);

modifyMongooseSchema(schema);

module.exports = mongooseConnection.model(MODEL_NAME, schema);
