/* eslint-env mocha */

process.env.NODE_ENV = 'test';

const request = require('supertest');

const assert = require('assert');
const httpMocks = require('node-mocks-http');
const homeRouteHandler = require('../../routes');

describe('Home page', () => {
  it('should response status code: 200', () => {
    const mockRequest = httpMocks.createRequest({ method: 'GET', url: '/' });
    const mockResponse = httpMocks.createResponse();
    homeRouteHandler(mockRequest, mockResponse);
    const actualResponseStatusCode = mockResponse._getStatusCode();
    const expectedResponseStatusCode = 200;
    assert(
      actualResponseStatusCode === expectedResponseStatusCode,
      'Status code is not correct'
    );
  });
});
