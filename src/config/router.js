const { Router, static: expressStatic } = require('express');
const path = require('path');
const AuthRouter = require('../components/Auth/router');
const RouteNotFoundError = require('../error/RouteNotFoundError');

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
  };
};

module.exports = {
  api(app) {
    prepareApi(app);

    const router = Router();

    router.use('/auth', AuthRouter);

    router.use(() => {
      throw new RouteNotFoundError();
    });

    app.use('/api/v1', router);
  },

  frontend(app) {
    prepareFrontend(app);

    const router = Router();

    router.get('/', (_req, res) => {
      res.render('pages/index.ejs');
    });
    router.get('/login', (_req, res) => {
      res.render('pages/login.ejs');
    });

    // route not found
    router.use((_req, res) => {
      res.status(404);
      res.render('errors/404.ejs');
    });

    app.use('/', router);
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
