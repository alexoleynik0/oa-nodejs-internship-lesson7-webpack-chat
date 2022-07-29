const ResponseError = require('./ResponseError');

/**
 * @exports
 * @extends ResponseError
 */
class ValidationError extends ResponseError {
  statusCode = 422;

  /**
   * @constructor
   * @param {object} message
   */
  constructor(message) {
    super();
    this.message = message;
    this.name = 'E_MISSING_OR_INVALID_PARAMS';
  }
}

module.exports = ValidationError;
