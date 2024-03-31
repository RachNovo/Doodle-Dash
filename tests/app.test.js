import { expect, use } from 'chai';
import axios from 'axios';
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

const mockAPICall = {
  data: {
    id: '10163673108419768',
    name: 'Rachel Novoselac',
    last_name: 'Novoselac'
  },
  headers: { 'x-app-usage': '{"call_count":14}' }
}

describe('FetchData', () => {
  let sandbox,axiosStub,setTimeoutSpy;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    axiosStub = sandbox.stub(axios, "get").returns(mockAPICall);
    setTimeoutSpy = sinon.spy(global, 'setTimeout');
  })
  afterEach(() => {
    sinon.restore();
    sandbox.restore();
    setTimeoutSpy.restore();
  });
  describe('calling the API', () => {
    it('should call the API', () => {
      fetchData();
      expect(axiosStub.called).to.be.true;
    });
    it('should call every 2 seconds while UNDER 80% of rate limit', async () => {
      await fetchData();
      expect(setTimeoutSpy.calledWith(fetchData, 2000)).to.be.true;
    });
    it('should call every 100 seconds while OVER 80% rate limit', async () => {
      mockAPICall.headers['x-app-usage'] = '{"call_count":85}';
      await fetchData();
      expect(setTimeoutSpy.calledWith(fetchData, 100000)).to.be.true;
    });
  });
  describe('handling API errors', () => {
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