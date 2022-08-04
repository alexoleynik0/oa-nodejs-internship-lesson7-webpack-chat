const authCookieHelper = require('../components/Auth/helpers/cookie');
const AuthError = require('../error/AuthError');

module.exports = async (req, _res, next) => {
  if (!authCookieHelper.isAuthCookieSet(req)) {
    return next(new AuthError());
  }

  return next();
};
