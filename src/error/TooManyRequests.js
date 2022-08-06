const ResponseError = require('./ResponseError');

const DEFAULT_MESSAGE = 'There were too many requests for this route.'
  + ' Please, calm down and try again in a second.';

/**
 * @exports
 * @extends ResponseError
 */
class TooManyRequests extends ResponseError {
  statusCode = 429;

  /**
   * @constructor
   * @param {any} message
   */
  constructor(message = DEFAULT_MESSAGE) {
    super();
    this.message = message;
    this.name = 'E_TOO_MANY_REQUESTS';
  }
}

module.exports = TooManyRequests;
