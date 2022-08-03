/* eslint-disable no-underscore-dangle, no-param-reassign */

const modifyMongooseSchema = (schema) => {
  // set all schemas to not have _id and _v
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(_doc, ret) {
      delete ret._id;
      delete ret.passwordHash;
    },
  });
};

module.exports = modifyMongooseSchema;
