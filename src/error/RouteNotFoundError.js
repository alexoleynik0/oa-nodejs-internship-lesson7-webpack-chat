const ResponseError = require('./ResponseError');

/**
 * @exports
 * @extends ResponseError
 */
class RouteNotFoundError extends ResponseError {
  statusCode = 404;

  /**
   * @constructor
   */
  constructor() {
    super();
    this.message = 'Route you\'re trying to use not found.';
    this.name = 'E_ROUTE_NOT_FOUND';
  }
}

module.exports = RouteNotFoundError;
