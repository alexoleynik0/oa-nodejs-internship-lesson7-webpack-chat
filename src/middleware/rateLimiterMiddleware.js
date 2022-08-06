const { RateLimiterMemory } = require('rate-limiter-flexible');
const TooManyRequests = require('../error/TooManyRequests');

// NOTE: use not memory based limiter if you run clustered server
const rateLimiters = {};

const getRateLimiter = (routeName, options) => {
  if (rateLimiters[routeName] === undefined) {
    rateLimiters[routeName] = new RateLimiterMemory(options);
  }
  return rateLimiters[routeName];
};

const rateLimiterMiddleware = (routeName, options) => (req, res, next) => {
  // NOTE: dif limiters for dif routes, req.ip is used
  getRateLimiter(routeName, options).consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      next(new TooManyRequests());
    });
};

module.exports = rateLimiterMiddleware;
