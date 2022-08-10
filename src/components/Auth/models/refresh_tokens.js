const { Schema } = require('mongoose');
const mongooseConnection = require('../../../config/mongooseConnection');
const modifyMongooseSchema = require('../../../helpers/db/modifyMongooseSchema');

const COLLECTION_NAME = 'refresh_tokens';
const MODEL_NAME = 'RefreshTokenModel';

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    createdAt: {
      type: Date,
      required: true,
      // NOTE: indexes should be recreated if this value changes
      expires: process.env.JWT_AUTH_REFRESH_TOKEN_EXPIRES_IN,
      default: Date.now,
    },
  },
  {
    collection: COLLECTION_NAME,
    versionKey: false,
  },
);

modifyMongooseSchema(schema);

module.exports = mongooseConnection.model(MODEL_NAME, schema);
