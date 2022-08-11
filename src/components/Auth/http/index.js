const { setAuthCookie, unsetAuthCookie } = require('../helpers/cookie');
const AuthComponent = require('..');

function getAdditionalDataForRefreshToken(req) {
  return {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  };
}

async function registerUsingCredentials(req, res) {
  const {
    user,
    accessToken,
    refreshToken,
  } = await AuthComponent.registerUsingCredentials(
    req.body,
    getAdditionalDataForRefreshToken(req),
  );

  setAuthCookie(res);

  res.status(201).json({
    userId: user.id,
    accessToken,
    refreshToken,
  });
}

async function loginUsingCredentials(req, res) {
  const { nickname, password } = req.body;

  const {
    user,
    accessToken,
    refreshToken,
  } = await AuthComponent.loginUsingCredentials(
    nickname,
    password,
    getAdditionalDataForRefreshToken(req),
  );

  setAuthCookie(res);

  res.status(200).json({
    userId: user.id,
    accessToken,
    refreshToken,
  });
}

async function getNewAccessAndRefreshToken(req, res) {
  const { userId, oldRefreshToken } = req.body;

  const {
    user,
    accessToken,
    refreshToken,
  } = await AuthComponent.getNewAccessAndRefreshToken(
    userId,
    oldRefreshToken,
    getAdditionalDataForRefreshToken(req),
  );

  setAuthCookie(res);

  res.status(200).json({
    userId: user.id,
    accessToken,
    refreshToken,
  });
}

async function removeRefreshToken(req, res) {
  const { userId, oldRefreshToken } = req.body;

  await AuthComponent.removeRefreshToken(userId, oldRefreshToken);

  unsetAuthCookie(res);

  res.status(204).end();
}

async function removeAllRefreshTokens(req, res) {
  const { nickname, password } = req.body;

  await AuthComponent.removeAllRefreshTokens(nickname, password);

  unsetAuthCookie(res);

  res.status(204).end();
}

const AuthHttpRequests = {
  registerUsingCredentials,
  loginUsingCredentials,
  getNewAccessAndRefreshToken,
  removeRefreshToken,
  removeAllRefreshTokens,
};

module.exports = AuthHttpRequests;
