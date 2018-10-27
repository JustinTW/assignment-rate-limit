/* eslint-env mocha */

process.env.NODE_ENV = 'test';

const request = require('supertest');

const assert = require('assert');
const httpMocks = require('node-mocks-http');
const homeRouteHandler = require('../../routes');

describe('Home page with rate limit', () => {
  const expectedResponseTitle = 'rate-limit-demo';
  it(`should render title: ${expectedResponseTitle} for index`, () => {
    const mockRequest = httpMocks.createRequest({ method: 'GET', url: '/' });
    const mockResponse = httpMocks.createResponse();
    homeRouteHandler(mockRequest, mockResponse);
    const actualResponseTitle = mockResponse._getRenderData().title;
    assert(
      actualResponseTitle === expectedResponseTitle,
      'title is not correct'
    );
  });
});
