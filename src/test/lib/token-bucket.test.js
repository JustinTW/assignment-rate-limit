/* eslint-env mocha */

const assert = require('assert');
const TokenBucket = require('../../lib/token-bucket.js');
const MemoryStore = require('../../lib/token-bucket/memory-store');

describe('token-bucket library', () => {
  it('should reduce one token', function() {
    const settings = { limit: 3, interval: 100 };
    const tokenBucket = new TokenBucket({
      ...settings,
      store: new MemoryStore({ limit: settings.limit })
    });
    tokenBucket.consume('127.0.0.1', (err, res) => {
      assert.equal(res, 1);
    });
  });

  it('should cause err when limit is -1', function() {
    const settings = { limit: -1, interval: 100 };
    const tokenBucket = new TokenBucket({
      ...settings,
      store: new MemoryStore({ limit: settings.limit })
    });
    tokenBucket.consume('127.0.0.1', (err, res) => {
      assert.equal(err);
    });
  });
});
