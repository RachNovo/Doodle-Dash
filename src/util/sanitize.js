"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = void 0;
var config_1 = require("config");
var sanitize = function (info) {
    var infoString = JSON.stringify(info);
    var token = config_1.default.get('ACCESS_TOKEN');
    if (token && infoString.includes(token)) {
        return JSON.parse(infoString.replace(token, 'ACCESS_TOKEN'));
    }
    return info;
};
exports.sanitize = sanitize;
