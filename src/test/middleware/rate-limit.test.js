/* eslint-env mocha */

const express = require('express');
const assert = require('assert');
const request = require('supertest');
const rateLimit = require('../../middleware/rate-limit.js');

describe('rate-limit middleware', () => {
  const createWebApp = middleware => {
    const app = express();
    app.all('/', middleware, (req, res) => {
      res.send('response!');
    });
    return app;
  };

  it('should set x-ratelimit-limit and x-ratelimit-remaining in response header', function(done) {
    const limit = 7;
    const interval = 5;
    const app = createWebApp(rateLimit({ limit, interval }));

    const req = request(app).get('/');
    req
      .expect('x-ratelimit-limit', limit.toString())
      .expect('x-ratelimit-remaining', (limit - 1).toString())
      .expect(200, /response!/)
      .end(done);
  });
});
