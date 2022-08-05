const { Router } = require('express');
const { validateBody } = require('../../middleware/validationHandler');
const asyncErrorCatcher = require('../../middleware/errorHandlers/asyncErrorCatcher');
const RoomComponent = require('.');
const RoomValidations = require('./validations');

/**
 * Express router to mount auth related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * @name /v1/auth/rooms
 */
router.get(
  '/',
  asyncErrorCatcher(RoomComponent.findAll),
);

/**
 * @name /v1/auth/rooms
 */
router.post(
  '/',
  validateBody(RoomValidations.create),
  asyncErrorCatcher(RoomComponent.create),
);

module.exports = router;
