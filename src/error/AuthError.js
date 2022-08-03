const ResponseError = require('./ResponseError');

const DEFAULT_MESSAGE = 'Authentication failed.';

/**
 * @exports
 * @extends ResponseError
 */
class AuthError extends ResponseError {
  statusCode = 401;

  /**
   * @constructor
   * @param {any} message
   */
  constructor(message = DEFAULT_MESSAGE) {
    super();
    this.message = message;
    this.name = 'E_AUTH_ERROR';
  }
}

module.exports = AuthError;
