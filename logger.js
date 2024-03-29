import winston from 'winston';
const { combine, timestamp, prettyPrint, errors } = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        errors({stack: true}),
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'app.log'})
    ]
});

export default logger;