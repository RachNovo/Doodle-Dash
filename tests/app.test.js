import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fetchData from '../app.js';
use(sinonChai);

/*
Tests:
-API
  -should call api and get back data fetchData
  -test how frequently it calls the api
  -test frequency change if headers say its over 80%
  -error handling
    -expired token
    -malformed token
    -missing token
    -over limit, make sure it retests after a set time
  -what happens if the access token is missing or invalid?
  -edge cases?
*/

describe('API Tests', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  });
  describe('calling the API', () => {
    const fbAPIMock = sinon.fake.resolves({ data: 'sampleData' });
    // var clock = sinon.useFakeTimers({ toFake: ["setTimeout"] });
    // const timeoutSpy = sandbox.spy(setTimeout);
    it ('should call the API', () => {
      fetchData();
      expect(fbAPIMock.calledOnce).to.be.true;
    });
    it.only('should call every 2 seconds while UNDER 80% of rate limit', () => {
      fetchData();
      expect(setTimeout).should.have.been.calledWith(2000);
    });
    it ('should call every 100 seconds while OVER 80% rate limit', () => {
      expect(true).to.be.false;
    });
  });
  describe('fetchData should handle API errors', () => {
    it('unspecified error', () => {
      expect(true).to.be.false;
    });
    it('expired access token', () => {
      expect(true).to.be.false;
    });
    it('malformed access token', () => {
      expect(true).to.be.false;
    });
    it('missing access token', () => {
      expect(true).to.be.false;
    });
    it('rate limit exceeded', () => {
      expect(true).to.be.false;
    });
  });
})