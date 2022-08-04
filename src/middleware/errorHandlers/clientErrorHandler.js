const AuthError = require('../../error/AuthError');
const ResponseError = require('../../error/ResponseError');

module.exports = (error, req, res, next) => {
  if (!req.xhr && error instanceof AuthError) {
    res.redirect('/login');

    return;
    // IDEA: process another errors for frontend (if intended)
  }

  if (error instanceof ResponseError) {
    res.status(error.statusCode).json({
      message: error.name,
      details: error.message,
    });

    return; // NOTE: no need to process those errors (yet?)
  }

  if (process.env.DEBUG === 'true') {
    // unhandled client error response with DEBUG flag
    res.status(500).json({
      message: error.name,
      details: error.message,
    });
  } else {
    // unhandled client error response without DEBUG flag
    res.status(500).json({
      message: 'Internal Server Error',
      details: 'Oops, something\'s broken... Please leave us short feedback so we can fix it faster.',
    });
  }

  next(error);
};
