function MemoryStore() {
  /* eslint-disable-next-line */
  let availableTokens = {};
  /* eslint-disable-next-line */
  let lastRefillTimeStamp = {};
  this.consume = (key, limit, window, cb) => {
    const now = Math.floor(Date.now() / 1000);
    const refillCountPerSecond = limit / window;
    // init records if record not exist
    if (!(key in availableTokens) || !(key in lastRefillTimeStamp)) {
      availableTokens[key] = limit;
      lastRefillTimeStamp[key] = now;
    }

    // refill tokens
    if (now > lastRefillTimeStamp[key]) {
      const refillCount = Math.floor(
        refillCountPerSecond * (now - lastRefillTimeStamp[key])
      );
      if (refillCount >= 1) {
        availableTokens[key] = Math.min(
          limit,
          availableTokens[key] + refillCount
        );
        lastRefillTimeStamp[key] = now;
      }
    }

    // consum availableTokens if availableTokens is enough
    if (availableTokens[key] > 0) {
      availableTokens[key] -= 1;
      lastRefillTimeStamp[key] = now;
    } else {
      let retryAfter;
      if (refillCountPerSecond >= 1) {
        retryAfter = Math.floor(limit / refillCountPerSecond);
      } else {
        retryAfter = Math.floor(1 / refillCountPerSecond);
      }
      return cb(retryAfter);
    }

    return cb(null, availableTokens[key], lastRefillTimeStamp[key]);
  };
}

module.exports = MemoryStore;
