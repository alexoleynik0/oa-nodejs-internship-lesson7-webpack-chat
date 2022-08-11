const { Router } = require('express');
const { validateBody } = require('../../../middleware/validationHandler');
const asyncErrorCatcher = require('../../../middleware/errorHandlers/asyncErrorCatcher');
const AuthHttpRequests = require('.');
const AuthValidations = require('../validations');
const rateLimiterMiddleware = require('../../../middleware/rateLimiterMiddleware');

/**
 * Express router to mount auth related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * @name /v1/auth/register
 */
router.post(
  '/register',
  rateLimiterMiddleware('auth/register', { points: 1, duration: 2 }), // allow 1 request per 2 seconds
  validateBody(AuthValidations.create),
  validateBody(AuthValidations.createAsync),
  asyncErrorCatcher(AuthHttpRequests.registerUsingCredentials),
);

/**
 * @name /v1/auth/login
 */
router.post(
  '/login',
  rateLimiterMiddleware('auth/login', { points: 1, duration: 2 }), // allow 1 request per 2 seconds
  validateBody(AuthValidations.create),
  asyncErrorCatcher(AuthHttpRequests.loginUsingCredentials),
);

/**
 * @name /v1/auth/token
 */
router.post(
  '/token',
  validateBody(AuthValidations.refreshToken),
  asyncErrorCatcher(AuthHttpRequests.getNewAccessAndRefreshToken),
);

/**
 * @name /v1/auth/logout
 */
router.post(
  '/logout',
  validateBody(AuthValidations.refreshToken),
  asyncErrorCatcher(AuthHttpRequests.removeRefreshToken),
);

/**
 * @name /v1/auth/logout-everywhere
 */
router.post(
  '/logout-everywhere',
  validateBody(AuthValidations.create),
  asyncErrorCatcher(AuthHttpRequests.removeAllRefreshTokens),
);

module.exports = router;
