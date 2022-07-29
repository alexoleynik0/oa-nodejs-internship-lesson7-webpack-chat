const ResponseError = require('./ResponseError');

/**
 * @exports
 * @extends ResponseError
 */
class ResourceNotFoundError extends ResponseError {
  statusCode = 404;

  /**
   * @constructor
   * @param {object} message
   */
  constructor(message) {
    super();
    this.message = message;
    this.name = 'E_RESOURCE_NOT_FOUND';
  }
}

module.exports = ResourceNotFoundError;
