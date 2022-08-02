const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const clientErrorHandler = require('../middleware/errorHandlers/clientErrorHandler');
const customHeaders = require('../middleware/customHeaders');

module.exports = {
  /**
   * @function
   * @description express middleware
   * @param {express.Application} app
   * @returns void
   */
  init(app) {
    app.use(bodyParser.urlencoded({
      extended: false,
    }));
    app.use(bodyParser.json());

    // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
    app.use(cookieParser());
    // returns the compression middleware
    app.use(compression());
    // helps you secure your Express apps by setting various HTTP headers
    app.use(helmet());
    // providing a Connect/Express middleware that can be used
    // to enable CORS with various options
    app.use(cors());

    app.use(customHeaders);
  },

  /**
   * @function
   * @description express middleware for errors
   * @param {express.Application} app
   * @returns void
   */
  errors(app) {
    // displays api friendly error for the clients
    app.use(clientErrorHandler);
  },
};
