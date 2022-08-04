const path = require('path');
const { Router, static: expressStatic } = require('express');
const AuthRouter = require('../components/Auth/router');
const FrontendRouter = require('../components/Frontend/router');
const isAuthUser = require('../middleware/isAuthUser');
const RouteNotFoundError = require('../error/RouteNotFoundError');
const UserRouter = require('../components/User/router');

const prepareApi = (app) => {
  // set trust proxy to be able to get user's IP address (for rate-limiter etc)
  app.set('trust proxy', true);
};

const prepareFrontend = (app) => {
  // set view engine and views dir
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'ejs');

  // default values passes to render
  // eslint-disable-next-line no-param-reassign
  app.locals = {
    ...app.locals,
    views_path: `${app.get('views')}/`,
    title: process.env.APP_NAME,
    appName: process.env.APP_NAME,
    styles: '',
    scripts: '',
    apiBaseUrl: '/api/v1',
  };
};

module.exports = {
  api(app) {
    prepareApi(app);

    const router = Router();

    router.use('/auth', AuthRouter);

    router.use('/users', isAuthUser, UserRouter);

    router.use(() => {
      throw new RouteNotFoundError();
    });

    app.use('/api/v1', router);
  },

  frontend(app) {
    prepareFrontend(app);

    app.use('/', FrontendRouter);
  },

  static(app) {
    app.use('/static', expressStatic(path.join(__dirname, '../..', 'public')));
    app.use(
      '/static/css/normalize.css',
      expressStatic(
        path.join(__dirname, '../..', 'node_modules/normalize.css/normalize.css'),
      ),
    );
  },
};
