const { Router } = require('express');
const { validateBody, validateParams } = require('../../middleware/validationHandler');
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
 * @name /v1/rooms
 */
router.get(
  '/',
  asyncErrorCatcher(RoomComponent.findAll),
);

/**
 * @name /v1/rooms
 */
router.post(
  '/',
  validateBody(RoomValidations.create),
  asyncErrorCatcher(RoomComponent.create),
);

/**
 * @name /v1/rooms/:roomId
 */
router.get(
  '/:roomId',
  validateParams(RoomValidations.findById),
  asyncErrorCatcher(RoomComponent.findById),
);

module.exports = router;
