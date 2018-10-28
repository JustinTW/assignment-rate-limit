const defaults = require('defaults');
const MemoryStore = require('./rate-limit/memory-store');

const RateLimit = options => {
  options = defaults(options, {
    limit: 60,
    window: 60
  });
  options.store = options.store || new MemoryStore();
  const rateLimit = (req, res, next) => {
    const { limit, window } = options;

    options.store.consume(
      req.ip,
      limit,
      window,
      (retryAfter, availableTokens, lastRefillTimeStamp) => {
        const now = Math.floor(Date.now() / 1000);
        if (retryAfter) {
          res.setHeader('X-RateLimit-Reset', retryAfter + now);
          res.setHeader('Retry-After', retryAfter);
          const err = new Error('Too Many Requests');
          err.status = 429;
          return next(err);
        }
        const remaining = availableTokens;
        const requests = limit - remaining;
        req.rateLimit = {
          limit,
          window,
          remaining,
          requests,
          lastRefillTimeStamp
        };
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Window', window);
        res.setHeader('X-RateLimit-Remaining', remaining);
        return next();
      }
    );
  };
  return rateLimit;
};

module.exports = RateLimit;
