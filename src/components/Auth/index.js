const { checkUserIsAuth } = require('../../helpers/http/restResponse');
const AuthService = require('./service');

async function getUserAccessAndRefreshTokens(user, refreshTokenAdditionalData) {
  const accessToken = await AuthService.createAccessTokenForUser(user);
  const refreshToken = await AuthService.createRefreshTokenForUser(
    user,
    refreshTokenAdditionalData,
  );
  return {
    accessToken,
    refreshToken,
  };
}

async function registerUsingCredentials(createData, refreshTokenAdditionalData) {
  const user = await AuthService.createUser(createData);
  const { accessToken, refreshToken } = await getUserAccessAndRefreshTokens(
    user,
    refreshTokenAdditionalData,
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
}

async function loginUsingCredentials(nickname, password, refreshTokenAdditionalData) {
  const user = await AuthService.getUserByCredentials(nickname, password);
  checkUserIsAuth(user, 'Invalid credentials pair.');

  const { accessToken, refreshToken } = await getUserAccessAndRefreshTokens(
    user,
    refreshTokenAdditionalData,
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
}

async function getNewAccessAndRefreshToken(userId, oldRefreshToken, refreshTokenAdditionalData) {
  const user = await AuthService.getUserUsingRefreshToken(userId, oldRefreshToken);
  checkUserIsAuth(user, 'Can\'t find provided refresh token.');

  const { accessToken, refreshToken } = await getUserAccessAndRefreshTokens(
    user,
    refreshTokenAdditionalData,
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
}

async function removeRefreshToken(userId, oldRefreshToken) {
  const user = await AuthService.getUserUsingRefreshToken(userId, oldRefreshToken);
  checkUserIsAuth(user, 'Can\'t find provided refresh token.');
}

async function removeAllRefreshTokens(nickname, password) {
  const user = await AuthService.getUserByCredentials(nickname, password);
  checkUserIsAuth(user, 'Invalid credentials pair.');

  AuthService.removeAllRefreshTokensForUser(user);
}

const AuthComponent = {
  registerUsingCredentials,
  loginUsingCredentials,
  getNewAccessAndRefreshToken,
  removeRefreshToken,
  removeAllRefreshTokens,
};

module.exports = AuthComponent;
