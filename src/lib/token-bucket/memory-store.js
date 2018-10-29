const util = require('util');
const fs = require('fs');
const path = require('path');
const defaults = require('defaults');
const redis = require('ioredis');

function MemoryStore(options) {
  options = defaults(options, { limit: 60, interval: 60 });
  const { interval } = options;

  let requestsCounter = {};
  this.defineCommand = (name, configs) => {
    return true;
  };
  this.consumeTokenBucket = (key, limit, i, now, cb) => {
    if (requestsCounter[key]) {
      requestsCounter[key] += 1;
    } else {
      requestsCounter[key] = 1;
    }
    if (requestsCounter[key] >= limit) {
      requestsCounter[key] = 0;
    }
    cb(null, requestsCounter[key]);
  };

  // export an API to allow requestsCounter all IPs to be reset
  this.reset = function() {
    const now = Math.floor(Date.now() / 1000);
    requestsCounter = {};
  };

  // simply reset ALL requestsCounter every interval
  const resetAll = setInterval(this.reset, interval);
  if (resetAll.unref) {
    resetAll.unref();
  }
}

module.exports = MemoryStore;
