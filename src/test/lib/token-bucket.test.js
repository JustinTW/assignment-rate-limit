/* eslint-env mocha */

const express = require('express');
const assert = require('assert');
const request = require('supertest');
const TokenBucket = require('../../lib/token-bucket.js');
const MemoryStore = require('../../lib/token-bucket/memory-store');

describe('token-bucket library', () => {
  it('should comsume token', function() {
    const tokenBucket = new TokenBucket({
      store: new MemoryStore({ limit: 3 })
    });

    tokenBucket.consume('127.0.0.1', (err, res) => {
      assert.equal(res, 1);
    });
  });
});
