const { Router } = require('express');
const AuthController = require('./auth.controller');
const ChatController = require('./chat.controller');
const isAuthFrontend = require('../../middleware/isAuthFrontend');

/**
 * Express router to mount auth related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * @name /
 */
router.get(
  '/',
  isAuthFrontend,
  ChatController.dialogsPage,
);

/**
 * @name /register
 */
router.get(
  '/register',
  AuthController.registerPage,
);

/**
 * @name /login
 */
router.get(
  '/login',
  AuthController.loginPage,
);

// route not found
router.use((_req, res) => {
  res.status(404);
  res.render('errors/404.ejs');
});

module.exports = router;
