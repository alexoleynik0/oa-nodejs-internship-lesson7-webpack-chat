const ResponseError = require('./ResponseError');

const DEFAULT_MESSAGE = 'Route you\'re trying to use not found.';

/**
 * @exports
 * @extends ResponseError
 */
class RouteNotFoundError extends ResponseError {
  statusCode = 404;

  /**
   * @constructor
   * @param {any} message
   */
  constructor(message = DEFAULT_MESSAGE) {
    super();
    this.message = message;
    this.name = 'E_ROUTE_NOT_FOUND';
  }
}

module.exports = RouteNotFoundError;
