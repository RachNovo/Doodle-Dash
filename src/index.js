"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_ts_1 = require("./app.ts");
var config_1 = require("config");
var verifyConfigValues = function () {
    console.log('Checking for ACCESS_TOKEN and ACCOUNT_ID...');
    var isAccessTokenSet = config_1.default.get('ACCESS_TOKEN') !== 'ACCESS_TOKEN';
    var isAccountIdSet = config_1.default.get('ACCOUNT_ID') !== 'ACCOUNT_ID';
    if (isAccessTokenSet && isAccountIdSet) {
        console.log('Looks like you have configured an ACCESS_TOKEN and ACCOUNT_ID :)');
        return true;
    }
    else {
        console.log('Please retrieve your ACCESS_TOKEN and ACCOUNT_ID from FaceBook\'s Graph API Tool and add them to a config file');
        return false;
    }
};
if (verifyConfigValues())
    (0, app_ts_1.default)();
