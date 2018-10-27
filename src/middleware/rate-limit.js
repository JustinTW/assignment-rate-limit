const defaults = require('defaults');

const RateLimit = options => {
  options = defaults(options, { limit: 60, interval: 6 });
  const rateLimit = (req, res, next) => {
    res.setHeader('X-RateLimit-Limit', options.limit);
    res.setHeader('X-RateLimit-Remaining', options.limit - 1);
    // res.status(429);
    next();
  };
  return rateLimit;
};

module.exports = RateLimit;
