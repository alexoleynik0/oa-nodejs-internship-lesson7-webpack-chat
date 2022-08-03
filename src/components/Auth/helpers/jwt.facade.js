const jwt = require('jsonwebtoken');

const tokenTypes = {
  access: 'access',
  refresh: 'refresh',
};

const jwtSecret = process.env.JWT_SECRET;

function getPayloadFromUser(user, tokenType) {
  return {
    user: {
      id: user.id,
      nickname: user.nickname,
      photoUrl: user.photoUrl,
    },
    tokenType,
  };
}

async function getJWT(payload, expiresIn = '') {
  return jwt.sign(payload, jwtSecret, { expiresIn });
}

async function getAuthAccessJWT(user) {
  return getJWT(
    getPayloadFromUser(user, tokenTypes.access),
    process.env.JWT_AUTH_TOKEN_EXPIRES_IN,
  );
}

async function getAuthRefreshJWT(user) {
  return getJWT(
    getPayloadFromUser(user, tokenTypes.refresh),
    process.env.JWT_AUTH_REFRESH_TOKEN_EXPIRES_IN,
  );
}

async function getPayloadFromJWT(tokenStr) {
  try {
    return jwt.verify(tokenStr, jwtSecret);
  } catch {
    return null;
  }
}

function isPayloadInvalid(payload, tokenType, userId = null) {
  return payload === null
    || payload.tokenType !== tokenType
    || payload.user === undefined
    || payload.user.id === undefined
    || (userId !== null && payload.user.id !== userId);
}

module.exports = {
  tokenTypes,
  getAuthAccessJWT,
  getAuthRefreshJWT,
  getPayloadFromJWT,
  isPayloadInvalid,
};
