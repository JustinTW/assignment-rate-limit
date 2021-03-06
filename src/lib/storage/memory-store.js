const defaults = require('defaults');

function MemoryStore(options) {
  options = defaults(options, { limit: 60, interval: 60 });
  const { interval } = options;

  let availableToken = {};
  this.defineCommand = (name, configs) => {
    return true;
  };
  this.consumeToken = (key, limit, i, now, cb) => {
    // force err when limit is -1 for unittest
    if (limit === -1) {
      return cb('Fake Error');
    }
    if (availableToken[key]) {
      availableToken[key] -= 1;
    } else {
      availableToken[key] = limit - 1;
    }
    if (availableToken[key] <= 0) {
      availableToken[key] = -1;
    }
    return cb(null, availableToken[key]);
  };

  // export an API to allow availableToken all IPs to be reset
  this.reset = function() {
    const now = Math.floor(Date.now() / 1000);
    availableToken = {};
  };

  // simply reset ALL availableToken every interval
  const resetAll = setInterval(this.reset, interval);
  if (resetAll.unref) {
    resetAll.unref();
  }
}

module.exports = MemoryStore;
