const util = require('util');
const fs = require('fs');
const path = require('path');
const defaults = require('defaults');
const redis = require('ioredis');

const luaScript = fs.readFileSync(
  path.join(__dirname, './storage/redis-store.lua'),
  'utf8'
);

function TokenBucket(options) {
  options = defaults(options, { limit: 60, interval: 60 });
  options.store = options.store || redis.createClient({ host: 'redis' });

  const { limit, interval, store } = options;
  store.defineCommand('consumeTokenBucket', {
    numberOfKeys: 1,
    lua: luaScript
  });

  this.consume = (key, cb) => {
    return new Promise((resolve, reject) => {
      store.consumeTokenBucket(
        key,
        limit,
        interval * 1000,
        Date.now(),
        (err, res) => {
          if (err) {
            reject(err);
            if (cb) {
              cb(err, 0);
            }
            return;
          }
          resolve(res);
          if (cb) {
            cb(null, res);
          }
        }
      );
    });
  };
}

module.exports = TokenBucket;
