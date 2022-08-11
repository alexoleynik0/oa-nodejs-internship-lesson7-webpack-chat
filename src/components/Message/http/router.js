const { Router } = require('express');
const { validateBody, validateParams } = require('../../../middleware/validationHandler');
const asyncErrorCatcher = require('../../../middleware/errorHandlers/asyncErrorCatcher');
const MessageHttpRequests = require('.');
const MessageValidations = require('../validations');

/**
 * Express router to mount auth related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * @name /v1/messages
 */
router.post(
  '/',
  validateBody(MessageValidations.create),
  asyncErrorCatcher(MessageHttpRequests.create),
);

/**
 * @name /v1/messages/room/:roomId
 */
router.get(
  '/room/:roomId',
  validateParams(MessageValidations.findAllByRoomId),
  asyncErrorCatcher(MessageHttpRequests.findAllByRoomId),
);

module.exports = router;
