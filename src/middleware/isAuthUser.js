const jwtFacade = require('../components/Auth/helpers/jwt.facade');
const AuthService = require('../components/Auth/service');
const AuthError = require('../error/AuthError');

module.exports = async (req, _res, next) => {
  const accessToken = req.headers.authorization?.replace('Bearer ', '');
  const payload = await jwtFacade.getPayloadFromJWT(accessToken);

  if (jwtFacade.isPayloadInvalid(payload, jwtFacade.tokenTypes.access)) {
    return next(new AuthError('You need to be logged in to use this route.'));
  }

  Object.defineProperty(req, 'getAuthUser', {
    async get() {
      if (req.authUser !== undefined) {
        req.authUser = await AuthService.getAuthUserById(payload.authUserId);
      }
      return Promise.resolve(req.authUser);
    },
  });

  return next();
};
