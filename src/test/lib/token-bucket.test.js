/* eslint-env mocha */

const express = require('express');
const assert = require('assert');
const request = require('supertest');
const TokenBucket = require('../../lib/token-bucket.js');
const MemoryStore = require('../../lib/token-bucket/memory-store');

describe('token-bucket library', () => {
  it('should reduce one token', function() {
    const tokenBucket = new TokenBucket({
      store: new MemoryStore({ limit: 3 })
    });
    tokenBucket.consume('127.0.0.1', (err, res) => {
      assert.equal(res, 1);
    });
  });

  it('should cause err when limit is -1', function() {
    const settings = { limit: -1, interval: 100 };
    const tokenBucket = new TokenBucket({
      ...settings,
      store: new MemoryStore({ limit: -1 })
    });
    tokenBucket.consume('127.0.0.1', (err, res) => {
      assert.equal(err);
    });
  });
});
