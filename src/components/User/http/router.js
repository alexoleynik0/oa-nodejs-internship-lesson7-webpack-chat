const { Router } = require('express');
const { validateQuery } = require('../../../middleware/validationHandler');
const asyncErrorCatcher = require('../../../middleware/errorHandlers/asyncErrorCatcher');
const UserHttpRequests = require('.');
const UserValidations = require('../validations');

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route serving list of users.
 * @name /v1/users/me
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {...callback} middleware - Express middleware.
 */
router.get(
  '/me',
  asyncErrorCatcher(UserHttpRequests.getMe),
);

/**
 * Route serving list of users.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {...callback} middleware - Express middleware.
 */
router.get(
  '/',
  validateQuery(UserValidations.findAll),
  asyncErrorCatcher(UserHttpRequests.findAll),
);

module.exports = router;
