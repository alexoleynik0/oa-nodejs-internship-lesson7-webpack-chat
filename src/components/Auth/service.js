const jwtFacade = require('./helpers/jwt.facade');
const UserModel = require('../User/models/users');
const RefreshTokenModel = require('./models/refresh_tokens');
const { getPasswordHash, isPasswordCorrect } = require('./helpers/password');

async function createUser(createData) {
  const passwordHash = await getPasswordHash(createData.password);
  return UserModel.create({
    ...createData,
    passwordHash,
  });
}

async function getUserByCredentials(nickname, password) {
  const user = await UserModel.findOne({ nickname }).select('+passwordHash').exec();
  if (
    user === null
    || await isPasswordCorrect(password, user.passwordHash) === false
  ) {
    return null;
  }
  return user;
}

async function createAccessTokenForUser(user) {
  return jwtFacade.getAuthAccessJWT(user);
}

async function createRefreshTokenForUser(user, refreshTokenAdditionalData) {
  const token = await jwtFacade.getAuthRefreshJWT(user);

  const refreshTokenData = {
    userId: user.id,
    token,
    ...refreshTokenAdditionalData,
  };
  await RefreshTokenModel.create(refreshTokenData);

  return token;
}

async function getUserUsingRefreshToken(userId, oldRefreshToken) {
  const payload = await jwtFacade.getPayloadFromJWT(oldRefreshToken);

  if (jwtFacade.isPayloadInvalid(payload, jwtFacade.tokenTypes.refresh, userId)) {
    return null;
  }

  // NOTE: refresh token is deleted here in this implementation
  const refreshToken = await RefreshTokenModel.findOneAndDelete({
    userId,
    token: oldRefreshToken,
  }).exec();

  if (refreshToken === null) {
    return null;
  }

  return UserModel.findById(refreshToken.userId).exec();
}

async function removeAllRefreshTokensForUser(user) {
  return RefreshTokenModel.deleteMany({
    userId: user.id,
  }).exec();
}

const AuthService = {
  createUser,
  getUserByCredentials,
  createAccessTokenForUser,
  createRefreshTokenForUser,
  getUserUsingRefreshToken,
  removeAllRefreshTokensForUser,
};

module.exports = AuthService;
