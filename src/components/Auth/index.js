const { checkUserIsAuth } = require('../../helpers/http/restResponse');
const { setAuthCookie, unsetAuthCookie } = require('./helpers/cookie');
const AuthService = require('./service');

function getRequestAdditionalData(req) {
  return {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  };
}

async function getUserAccessAndRefreshTokens(user, req) {
  const accessToken = await AuthService.createAccessTokenForUser(user);
  const refreshToken = await AuthService.createRefreshTokenForUser(
    user,
    getRequestAdditionalData(req),
  );
  return {
    accessToken,
    refreshToken,
  };
}

async function registerUsingCredentials(req, res) {
  const user = await AuthService.createUser(req.body);

  setAuthCookie(res);

  res.status(201).json({
    userId: user.id,
    ...(await getUserAccessAndRefreshTokens(user, req)),
  });
}

async function loginUsingCredentials(req, res) {
  const { nickname, password } = req.body;
  const user = await AuthService.getUserByCredentials(nickname, password);
  checkUserIsAuth(user, 'Invalid credentials pair.');

  setAuthCookie(res);

  res.status(200).json({
    userId: user.id,
    ...(await getUserAccessAndRefreshTokens(user, req)),
  });
}

async function getNewAccessAndRefreshToken(req, res) {
  const { userId, oldRefreshToken } = req.body;
  const user = await AuthService.getUserUsingRefreshToken(userId, oldRefreshToken);
  checkUserIsAuth(user, 'Can\'t find provided refresh token.');

  res.status(200).json({
    userId: user.id,
    ...(await getUserAccessAndRefreshTokens(user, req)),
  });
}

async function removeRefreshToken(req, res) {
  const { userId, oldRefreshToken } = req.body;
  const user = await AuthService.getUserUsingRefreshToken(userId, oldRefreshToken);
  checkUserIsAuth(user, 'Can\'t find provided refresh token.');

  unsetAuthCookie(res);

  res.status(204).end();
}

async function removeAllRefreshTokens(req, res) {
  const { nickname, password } = req.body;
  const user = await AuthService.getUserByCredentials(nickname, password);
  checkUserIsAuth(user, 'Invalid credentials pair.');

  await AuthService.removeAllRefreshTokensForUser(user);

  unsetAuthCookie(res);

  res.status(204).end();
}

module.exports = {
  registerUsingCredentials,
  loginUsingCredentials,
  getNewAccessAndRefreshToken,
  removeRefreshToken,
  removeAllRefreshTokens,
};
