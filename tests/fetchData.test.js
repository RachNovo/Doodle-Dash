"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_js_1 = require("../src/app.js");
var mockResponses_js_1 = require("./mockResponses.js");
var index_js_1 = require("../src/logger/index.js");
var sanitize_js_1 = require("../src/util/sanitize.js");
var config_1 = require("config");
var axios_1 = require("axios");
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var sinon_chai_1 = require("sinon-chai");
(0, chai_1.use)(sinon_chai_1.default);
describe('FetchData', function () {
    var sandbox;
    axios_1.default.get;
    global.setTimeout;
    index_js_1.default.info;
    index_js_1.default.warn;
    index_js_1.default.error;
    config_1.default.get;
    var axiosStub;
    var setTimeoutStub;
    var infoLoggerStub;
    var warnLoggerStub;
    var errorLoggerStub;
    var configStub;
    beforeEach(function () {
        sandbox = sinon_1.default.createSandbox();
        axiosStub = sandbox.stub(axios_1.default, "get").returns(Promise.resolve(mockResponses_js_1.mockAPICall));
        setTimeoutStub = sandbox.stub(global, 'setTimeout');
        infoLoggerStub = sandbox.stub(index_js_1.default, 'info');
        warnLoggerStub = sandbox.stub(index_js_1.default, 'warn');
        errorLoggerStub = sandbox.stub(index_js_1.default, 'error');
        configStub = sandbox.stub(config_1.default, 'get').returns('84923875');
    });
    afterEach(function () {
        sinon_1.default.restore();
        sandbox.restore();
        setTimeoutStub.restore();
    });
    describe('calling the API', function () {
        it('should call the API and log data', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, app_js_1.default)()];
                    case 1:
                        _a.sent();
                        (0, chai_1.expect)(axiosStub.called).to.be.true;
                        (0, chai_1.expect)(infoLoggerStub.calledWith("received data from FB API", mockResponses_js_1.mockAPICall.data));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call every 2 seconds while UNDER 80% of rate limit and log data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var callsUsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponses_js_1.mockAPICall.headers['x-app-usage'] = '{"call_count":10}';
                        callsUsed = 10;
                        return [4 /*yield*/, (0, app_js_1.default)()];
                    case 1:
                        _a.sent();
                        (0, chai_1.expect)(setTimeoutStub.calledWith(app_js_1.default, 2000)).to.be.true;
                        (0, chai_1.expect)(infoLoggerStub.calledWith("calls every 2 seconds, ".concat(callsUsed, "% of total calls used")));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call every 100 seconds while OVER 80% rate limit and log data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var callsUsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponses_js_1.mockAPICall.headers['x-app-usage'] = '{"call_count":85}';
                        callsUsed = 85;
                        return [4 /*yield*/, (0, app_js_1.default)()];
                    case 1:
                        _a.sent();
                        (0, chai_1.expect)(setTimeoutStub.calledWith(app_js_1.default, 100000)).to.be.true;
                        (0, chai_1.expect)(warnLoggerStub.calledWith("".concat(callsUsed, "% of calls used! Calls reduced to every: 100 seconds")));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('handling API errors', function () {
        var _loop_1 = function (error) {
            it("should handle ".concat(error, " error and log data"), function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            axiosStub.rejects({ response: { headers: { 'www-authenticate': mockResponses_js_1.mockAPIErrors[error] } } });
                            return [4 /*yield*/, (0, app_js_1.default)()];
                        case 1:
                            _a.sent();
                            (0, chai_1.expect)(setTimeoutStub.calledWith(app_js_1.default, 5000)).to.be.true;
                            (0, chai_1.expect)(errorLoggerStub.calledWith("".concat(error, ", ").concat(/\d\d/, "% of total calls used")));
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        for (var error in mockResponses_js_1.mockAPIErrors) {
            _loop_1(error);
        }
        ;
    });
    describe('sanitizing data', function () {
        it('should sanitize sensitive data', function () {
            var info = 'this is a secret access token: 84923875';
            (0, chai_1.expect)((0, sanitize_js_1.default)(info)).to.equal('this is a secret access token: ACCESS_TOKEN');
        });
    });
});
