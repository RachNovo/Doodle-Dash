import winston from 'winston';
import { consoleFormat } from 'winston-console-format';
const { combine, errors, timestamp, ms, splat, json, colorize, padLevels, prettyPrint } = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        errors({stack: true}),
        timestamp(),
        ms(),
        splat(),
        json(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                padLevels(),
                consoleFormat({
                    showMeta: true,
                    metaStrip: ["timestamp"],
                    inspectOptions: {
                      depth: Infinity,
                      colors: true,
                      maxArrayLength: Infinity,
                      breakLength: 120,
                      compact: Infinity,
                    }
                }),
            )
        }),
        new winston.transports.File({filename: 'app.log'})
    ]
});

export default logger;