const AuthError = require('../error/AuthError');
const jwtFacade = require('../components/Auth/helpers/jwt.facade');
const UserService = require('../components/User/service');

module.exports = async (req, _res, next) => {
  const accessToken = req.headers.authorization?.replace('Bearer ', '');
  const payload = await jwtFacade.getPayloadFromJWT(accessToken);

  if (jwtFacade.isPayloadInvalid(payload, jwtFacade.tokenTypes.access)) {
    return next(new AuthError('You need to be logged in to use this route.'));
  }

  req.authUserPayload = payload.user;
  req.getAuthUser = async () => {
    if (req.authUser === undefined) {
      req.authUser = await UserService.findById(req.authUserPayload.id);
    }
    return Promise.resolve(req.authUser);
  };

  return next();
};
