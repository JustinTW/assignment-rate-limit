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

    options.store.consume(req.ip, limit, window, (retry, token, ts) => {
      if (retry) {
        const now = Math.floor(Date.now() / 1000);
        const retryAfter = retry - now;
        res.setHeader('X-RateLimit-Reset', retry);
        res.setHeader('Retry-After', retryAfter);
        const err = new Error('Too Many Requests');
        err.status = 429;
        next(err);
      } else {
        const remaining = token;
        const requests = limit - remaining;
        req.rateLimit = {
          limit,
          window,
          remaining,
          requests,
          ts
        };
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', ts + window);
        next();
      }
    });
  };
  return rateLimit;
};

module.exports = RateLimit;
