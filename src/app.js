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
exports.fetchData = void 0;
var config_1 = require("config");
var axios_1 = require("axios");
var index_js_1 = require("./logger/index.js");
var sanitize_js_1 = require("./util/sanitize.js");
var ACCESS_TOKEN = config_1.default.get('ACCESS_TOKEN');
var params = new URLSearchParams({
    fields: 'id,name,last_name',
    access_token: ACCESS_TOKEN
});
var url = "https://graph.facebook.com/v19.0/me?".concat(params.toString());
var HIGH_PERCENTAGE_WARNING = 80;
var INITIAL_FREQUENCY = 2000;
var HIGH_PERCENTAGE_FREQUENCY = 100000;
var ERROR_RETRY_FREQUENCY = 5000;
var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, percentageOfCallsUsed, error_1, message, headers, authenticationError, percentageOfCallsUsed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                response = _a.sent();
                index_js_1.logger.info('received data from FB API', { data: response.data });
                percentageOfCallsUsed = JSON.parse(response.headers['x-app-usage']).call_count;
                if (percentageOfCallsUsed > HIGH_PERCENTAGE_WARNING) {
                    setTimeout(exports.fetchData, HIGH_PERCENTAGE_FREQUENCY);
                    index_js_1.logger.warn("".concat(percentageOfCallsUsed, "% of calls used! Calls reduced to every: 100 seconds"));
                }
                else {
                    setTimeout(exports.fetchData, INITIAL_FREQUENCY);
                    index_js_1.logger.info("calls every 2 seconds, ".concat(percentageOfCallsUsed, "% of total calls used"));
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                message = void 0;
                headers = error_1.response.headers;
                authenticationError = headers['www-authenticate'];
                if (authenticationError) {
                    if (headers['x-app-usage']) {
                        percentageOfCallsUsed = JSON.parse(headers['x-app-usage']).call_count;
                        message = "".concat(authenticationError, ", ").concat(percentageOfCallsUsed, "% of total calls used");
                    }
                    else {
                        message = authenticationError;
                    }
                }
                else {
                    message = error_1;
                }
                index_js_1.logger.error((0, sanitize_js_1.sanitize)(message));
                setTimeout(exports.fetchData, ERROR_RETRY_FREQUENCY);
                return [3 /*break*/, 3];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); };
exports.fetchData = fetchData;
