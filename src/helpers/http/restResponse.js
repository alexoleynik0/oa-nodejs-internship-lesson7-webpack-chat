const AuthError = require('../../error/AuthError');
const ResourceNotFoundError = require('../../error/ResourceNotFoundError');

function checkResourceIsFound(resource, errorMessage) {
  if (resource === null || resource === undefined) {
    throw new ResourceNotFoundError(errorMessage);
  }
}

function checkUserIsAuth(user, errorMessage) {
  if (user === null) {
    throw new AuthError(errorMessage);
  }
}

module.exports = {
  checkResourceIsFound,
  checkUserIsAuth,
};
