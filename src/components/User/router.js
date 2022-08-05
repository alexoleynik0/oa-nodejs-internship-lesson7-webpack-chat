const { Router } = require('express');
const { validateQuery } = require('../../middleware/validationHandler');
const asyncErrorCatcher = require('../../middleware/errorHandlers/asyncErrorCatcher');
const UserComponent = require('.');
const UserValidations = require('./validations');

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
  asyncErrorCatcher(UserComponent.getMe),
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
  asyncErrorCatcher(UserComponent.findAll),
);

module.exports = router;
