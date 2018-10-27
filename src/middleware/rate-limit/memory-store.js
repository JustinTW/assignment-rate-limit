function MemoryStore() {
  /* eslint-disable-next-line */
  let token = {};
  /* eslint-disable-next-line */
  let ts = {};
  this.consume = (key, limit, window, cb) => {
    const now = Math.floor(Date.now() / 1000);

    // init records if record not exist
    if (!(key in token) || !(key in ts)) {
      token[key] = limit;
      ts[key] = now;
    }

    // refill token if ts is out of date
    if (now - window >= ts[key]) {
      token[key] = limit;
      ts[key] = now;
    }

    // consum token if token is enough
    if (token[key] > 0) {
      token[key] -= 1;
      ts[key] = now;
    } else {
      const retry = ts[key] + window;
      cb(retry);
    }

    cb(null, token[key], ts[key]);
  };

  this.dump = () => {
    const output = { token, ts };
    return output;
  };
}

module.exports = MemoryStore;
