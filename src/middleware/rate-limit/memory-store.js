function MemoryStore() {
  /* eslint-disable-next-line */
  let availableTokens = {};
  /* eslint-disable-next-line */
  let lastRefillTimeStamp = {};
  /* eslint-disable-next-line */
  let requests = {};
  /* eslint-disable-next-line */
  let firstRequestTimeStamp = {};
  this.consume = (key, limit, window, cb) => {
    const now = Math.floor(Date.now() / 1000);
    const refillCountPerSecond = limit / window;
    // init records if record not exist
    if (!(key in availableTokens) || !(key in lastRefillTimeStamp)) {
      availableTokens[key] = limit;
      lastRefillTimeStamp[key] = now;
      requests[key] = 0;
      firstRequestTimeStamp[key] = now;
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

      if (now - firstRequestTimeStamp[key] >= window) {
        requests[key] = 0;
        firstRequestTimeStamp[key] = now;
      }
      if (requests[key] >= limit) {
        requests[key] = 0;
        firstRequestTimeStamp[key] = now;
      }
    }

    // consum availableTokens if availableTokens is enough
    if (availableTokens[key] > 0) {
      availableTokens[key] -= 1;
      lastRefillTimeStamp[key] = now;
      requests[key] += 1;
    } else {
      let retryAfter;
      if (refillCountPerSecond >= 1) {
        retryAfter =
          Math.floor(limit / refillCountPerSecond) -
          (now - lastRefillTimeStamp[key]);
      } else {
        retryAfter =
          (Math.floor(1 / refillCountPerSecond) -
            (now - lastRefillTimeStamp[key])) *
          limit;
      }
      requests[key] = 0;
      firstRequestTimeStamp[key] = now;
      return cb(Math.max(retryAfter, 1));
    }

    return cb(
      null,
      availableTokens[key],
      lastRefillTimeStamp[key],
      requests[key]
    );
  };
}

module.exports = MemoryStore;
