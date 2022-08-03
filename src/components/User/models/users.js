const { Schema } = require('mongoose');
const mongooseConnection = require('../../../config/connection');
const modifyMongooseSchema = require('../../../helpers/db/modifyMongooseSchema');

const COLLECTION_NAME = 'users';
const MODEL_NAME = 'UserModel';

const schema = new Schema(
  {
    nickname: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
    versionKey: false,
  },
);

modifyMongooseSchema(schema);

module.exports = mongooseConnection.model(MODEL_NAME, schema);
