/**
 * @exports
 * @extends Error
 */
class ResponseError extends Error {
  statusCode = 400;
}

module.exports = ResponseError;
