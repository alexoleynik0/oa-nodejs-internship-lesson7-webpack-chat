const logger = require('../../../helpers/logger');
const ResponseError = require('../../../error/ResponseError');

const socketAsyncErrorCatcher = (action) => async (...args) => {
  let callback = args[args.length - 1];
  if (callback instanceof Function !== true) {
    callback = undefined;
  }
  try {
    const response = await action(...args);
    if (callback !== undefined) {
      callback(null, response);
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      if (callback !== undefined) {
        callback(error);
      }
    } else {
      const fakeError = {
        name: error.name,
        massage: error.message,
        statusCode: 500,
      };
      if (callback !== undefined) {
        callback(fakeError);
      }
      // NOTE: if not an acknowledgement - log error
      // TODO: add traceID (user.id)
      logger.error(error);
    }
  }
};

module.exports = socketAsyncErrorCatcher;
