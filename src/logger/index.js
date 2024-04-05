"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var winston_console_format_1 = require("winston-console-format");
var _a = winston.format, combine = _a.combine, errors = _a.errors, timestamp = _a.timestamp, ms = _a.ms, splat = _a.splat, json = _a.json, colorize = _a.colorize, padLevels = _a.padLevels, prettyPrint = _a.prettyPrint;
var logger = winston.createLogger({
    level: 'debug',
    format: combine(errors({ stack: true }), timestamp(), ms(), splat(), json(), prettyPrint()),
    transports: [
        new winston.transports.File({ filename: 'src/logger/app.log' })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
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
exports.default = logger;
