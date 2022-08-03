const ResponseError = require('./ResponseError');

const DEFAULT_MESSAGE = 'Submitted form has invalid data.';

/**
 * @exports
 * @extends ResponseError
 */
class ValidationError extends ResponseError {
  statusCode = 422;

  /**
   * @constructor
   * @param {any} message
   */
  constructor(message = DEFAULT_MESSAGE) {
    super();
    this.message = message;
    this.name = 'E_MISSING_OR_INVALID_PARAMS';
  }
}

module.exports = ValidationError;
