/* eslint-env mocha */

const express = require('express');
const assert = require('assert');
const request = require('supertest');
const rateLimit = require('../../middleware/rate-limit.js');
const MemoryStore = require('../../lib/storage/memory-store');
const TokenBucket = require('../../lib/token-bucket');

describe('rate-limit middleware', () => {
  const createWebApp = middleware => {
    const app = express();
    app.all('/', middleware, (req, res) => {
      res.send('response!');
    });
    return app;
  };

  it('should set X-Ratelimit-Limit and X-Ratelimit-Remaining in response header', function(done) {
    const settings = { limit: 7, interval: 5 };
    const { limit, interval } = settings;
    const rateLimiter = rateLimit({
      ...settings,
      store: new MemoryStore()
    });

    const app = createWebApp(rateLimiter);
    const expectedLimit = limit;
    const expectRemaining = limit - 1;
    const req = request(app).get('/');
    req
      .expect('X-Ratelimit-Limit', expectedLimit.toString())
      .expect('X-Ratelimit-Remaining', expectRemaining.toString())
      .expect(200, /response!/)
      .end(done);
  });

  it('should set X-Ratelimit-Reset and Retry-After in response header', function(done) {
    const settings = { limit: 1, interval: 100 };
    const { limit, interval } = settings;
    const rateLimiter = rateLimit({
      ...settings,
      store: new MemoryStore()
    });
    const app = createWebApp(rateLimiter);

    request(app)
      .get('/')
      .then(() => {
        const req = request(app).get('/');
        const now = Math.floor(Date.now() / 1000);
        const expectRetryAfter = interval;
        const expectedRest = now + expectRetryAfter;
        req
          .expect('Retry-After', expectRetryAfter.toString())
          .expect('X-Ratelimit-Reset', expectedRest.toString())
          .expect(res => {
            if (res.status !== 429) throw new Error('Status code is not 429');
          })
          .end(done);
      });
  });

  it('should response content when next request is available', function(done) {
    const settings = { limit: 60, interval: 60 };
    const { limit, interval } = settings;
    const rateLimiter = rateLimit({
      ...settings,
      store: new MemoryStore()
    });
    const app = createWebApp(rateLimiter);

    request(app)
      .get('/')
      .then(
        setTimeout(() => {
          const expectedLimit = limit;
          const expectRemaining = limit - 1;
          request(app)
            .get('/')
            .expect('X-Ratelimit-Limit', expectedLimit.toString())
            .expect('X-Ratelimit-Remaining', expectRemaining.toString())
            .expect(200, /response!/)
            .end(done);
        }, 1000)
      );
  });

  it('should set correct Retry-After when token not available', function(done) {
    const settings = { limit: 2, interval: 1 };
    const { limit, interval } = settings;
    const rateLimiter = rateLimit({
      ...settings,
      store: new MemoryStore()
    });
    const app = createWebApp(rateLimiter);

    request(app)
      .get('/')
      .then(() => {
        request(app)
          .get('/')
          .then(() => {
            const now = Math.floor(Date.now() / 1000);
            const expectRetryAfter = interval;
            const expectedRest = now + expectRetryAfter;
            request(app)
              .get('/')
              .expect('Retry-After', expectRetryAfter.toString())
              .expect('X-Ratelimit-Reset', expectedRest.toString())
              .expect(res => {
                if (res.status !== 429) {
                  throw new Error('Status code is not 429');
                }
              })
              .end(done);
          });
      });
  });
});
