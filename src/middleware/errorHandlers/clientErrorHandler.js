const ResponseError = require('../../error/ResponseError');

module.exports = (error, _req, res, next) => {
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
