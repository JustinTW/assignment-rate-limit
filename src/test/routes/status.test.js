/* eslint-env mocha */

process.env.NODE_ENV = 'test';

const request = require('supertest');

const assert = require('assert');
const httpMocks = require('node-mocks-http');
const statusRouteHandler = require('../../routes/status');

describe('Status page', () => {
  it('should return status code: 200', () => {
    const mockRequest = httpMocks.createRequest({ method: 'GET', url: '/' });
    const mockResponse = httpMocks.createResponse();
    statusRouteHandler(mockRequest, mockResponse);
    const actualResponseStatusCode = mockResponse._getStatusCode();
    assert(actualResponseStatusCode === 200, 'status code is not 200');
  });
});
