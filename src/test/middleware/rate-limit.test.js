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

  it('should set X-Ratelimit-Limit, X-Ratelimit-Remaining and X-Ratelimit-Reset in response header', function(done) {
    const limit = 7;
    const window = 5;
    const app = createWebApp(rateLimit({ limit, window }));

    const expectedLimit = limit;
    const expectRemaining = limit - 1;

    const req = request(app).get('/');

    const now = Math.floor(Date.now() / 1000);
    const expectedRest = (
      now + Math.max(Math.floor(limit / window), 1)
    ).toString();
    req
      .expect('X-Ratelimit-Limit', expectedLimit.toString())
      .expect('X-Ratelimit-Remaining', expectRemaining.toString())
      // .expect('X-Ratelimit-reset', expectedRest)
      .expect(200, /response!/)
      .end(done);
  });

  it('should set X-Ratelimit-Reset and Retry-After in response header', function(done) {
    const limit = 1;
    const window = 10;
    const app = createWebApp(rateLimit({ limit, window }));

    const mockRequest = request(app)
      .get('/')
      .then(() => {
        const req = request(app).get('/');
        const now = Math.floor(Date.now() / 1000);
        const expectRetryAfter = Math.max(Math.floor(limit / window), window);
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

  it('should response succes after refill token', function(done) {
    const limit = 60;
    const window = 60;
    const app = createWebApp(rateLimit({ limit, window }));

    const mockRequest = request(app)
      .get('/')
      .then(
        setTimeout(() => {
          const req = request(app).get('/');
          const expectedLimit = limit;
          const expectRemaining = limit - 2;
          req
            .expect('X-Ratelimit-Limit', expectedLimit.toString())
            .expect('X-Ratelimit-Remaining', expectRemaining.toString())
            .expect(200, /response!/)
            .end(done);
        }, 1000)
      );
  });

  it('should response correct Retry-After when leak token', function(done) {
    const limit = 2;
    const window = 1;
    const app = createWebApp(rateLimit({ limit, window }));

    const mockRequest = request(app)
      .get('/')
      .then(() => {
        request(app)
          .get('/')
          .then(() => {
            const req = request(app).get('/');
            const now = Math.floor(Date.now() / 1000);
            const expectRetryAfter = Math.min(
              Math.floor(limit / window),
              window
            );
            const expectedRest = now + expectRetryAfter;
            req
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
