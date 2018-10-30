const defaults = require('defaults');
const redis = require('ioredis');
const TokenBucket = require('../lib/token-bucket');

const RateLimit = options => {
  options = defaults(options, {
    limit: 60,
    interval: 60
  });
  options.store = options.store || redis.createClient({ host: 'redis' });
  const { limit, interval, store } = options;
  options.limiter =
    options.limiter ||
    new TokenBucket({
      limit,
      interval,
      store
    });

  const rateLimit = (req, res, next) => {
    const key = req.ip;
    options.limiter.consume(key, (err, remaining) => {
      const now = Math.floor(Date.now() / 1000);
      if (err) {
        return next(err);
      }

      if (remaining < 0) {
        res.setHeader('X-RateLimit-Reset', interval + now);
        res.setHeader('Retry-After', interval);
        const resp = new Error('Too Many Requests');
        resp.status = 429;
        return next(resp);
      }
      const count = limit - remaining;
      req.rateLimit = {
        limit,
        interval,
        remaining,
        key,
        count
      };
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Interval', interval);
      res.setHeader('X-RateLimit-Remaining', remaining);
      return next();
    });
  };
  return rateLimit;
};

module.exports = RateLimit;
