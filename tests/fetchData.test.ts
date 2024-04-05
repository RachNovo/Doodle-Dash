import fetchData from '../src/app.js';
import { mockAPICall, mockAPIErrors } from './mockResponses.ts';
import logger from '../src/logger/index.js';
import sanitize from '../src/util/sanitize.js';
import config from 'config';
import axios from 'axios';
import { expect, use } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
use(sinonChai);

describe('FetchData', () => {

  let sandbox: SinonSandbox;
  axios.get as sinon.SinonStub;
  global.setTimeout as unknown as sinon.SinonStub;
  logger.info as sinon.SinonStub;
  logger.warn as sinon.SinonStub;
  logger.error as sinon.SinonStub;
  config.get as sinon.SinonStub;

  let axiosStub: any;
  let setTimeoutStub: any;
  let infoLoggerStub: any;
  let warnLoggerStub: any;
  let errorLoggerStub: any;
  let configStub: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    axiosStub = sandbox.stub(axios, "get").returns(Promise.resolve(mockAPICall));
    setTimeoutStub = sandbox.stub(global, 'setTimeout');
    infoLoggerStub = sandbox.stub(logger, 'info');
    warnLoggerStub = sandbox.stub(logger, 'warn');
    errorLoggerStub = sandbox.stub(logger, 'error');
    configStub = sandbox.stub(config, 'get').returns('84923875');
  });

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
    setTimeoutStub.restore();
  });

  describe('calling the API', () => {

    it('should call the API and log data', async () => {
      await fetchData();
      expect(axiosStub.called).to.be.true;
      expect(infoLoggerStub.calledWith(`received data from FB API`, mockAPICall.data));
    });

    it('should call every 2 seconds while UNDER 80% of rate limit and log data', async () => {
      mockAPICall.headers['x-app-usage'] = '{"call_count":10}';
      const callsUsed = 10;
      await fetchData();
      expect(setTimeoutStub.calledWith(fetchData, 2000)).to.be.true;
      expect(infoLoggerStub.calledWith(`calls every 2 seconds, ${callsUsed}% of total calls used`))
    });

    it('should call every 100 seconds while OVER 80% rate limit and log data', async () => {
      mockAPICall.headers['x-app-usage'] = '{"call_count":85}';
      const callsUsed = 85;
      await fetchData();
      expect(setTimeoutStub.calledWith(fetchData, 100000)).to.be.true;
      expect(warnLoggerStub.calledWith(`${callsUsed}% of calls used! Calls reduced to every: 100 seconds`));
    });

  });

  describe('handling API errors', () => {

    for (let error in mockAPIErrors) {
      it(`should handle ${error} error and log data`, async () => {
        axiosStub.rejects({response:{headers:{'www-authenticate': mockAPIErrors[error]}}});
        await fetchData();
        expect(setTimeoutStub.calledWith(fetchData, 5000)).to.be.true;
        expect(errorLoggerStub.calledWith(`${error}, ${/\d\d/}% of total calls used`));
      });
    };

  });

  describe('sanitizing data', () => {

    it('should sanitize sensitive data', () => {
      const info = 'this is a secret access token: 84923875';
      expect(sanitize(info)).to.equal('this is a secret access token: ACCESS_TOKEN');
    });

  });

});
