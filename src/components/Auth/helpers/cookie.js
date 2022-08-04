const MAX_AGE = 1000 * 60 * 60 * 24 * 4; // 4d
const VALUE = '1';

const setAuthCookie = (res) => {
  const options = {
    maxAge: MAX_AGE,
    httpOnly: true,
    signed: true,
  };
  res.cookie(`${process.env.APP_NAME}.isAuthFrontend`, VALUE, options);
};

const unsetAuthCookie = (res) => {
  const options = {
    httpOnly: true,
    signed: true,
  };
  res.clearCookie(`${process.env.APP_NAME}.isAuthFrontend`, options);
};

const isAuthCookieSet = (req) => req.signedCookies[`${process.env.APP_NAME}.isAuthFrontend`] === VALUE;

module.exports = {
  setAuthCookie,
  unsetAuthCookie,
  isAuthCookieSet,
};
