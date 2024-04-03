"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var winston_1 = require("winston");
var winston_console_format_1 = require("winston-console-format");
var _a = winston_1.default.format, combine = _a.combine, errors = _a.errors, timestamp = _a.timestamp, ms = _a.ms, splat = _a.splat, json = _a.json, colorize = _a.colorize, padLevels = _a.padLevels, prettyPrint = _a.prettyPrint;
exports.logger = winston_1.default.createLogger({
    level: 'debug',
    format: combine(errors({ stack: true }), timestamp(), ms(), splat(), json(), prettyPrint()),
    transports: [
        new winston_1.default.transports.File({ filename: 'logger/app.log' })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: combine(colorize({ all: true }), padLevels(), (0, winston_console_format_1.consoleFormat)({
            showMeta: true,
            metaStrip: ["timestamp"],
            inspectOptions: {
                depth: Infinity,
                colors: true,
                maxArrayLength: Infinity,
                breakLength: 120,
                compact: Infinity,
            }
        }))
    }));
}
;
