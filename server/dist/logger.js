
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e76d54a3-8ebb-51cd-818f-60009cac455a")}catch(e){}}();
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import moment from 'moment';
const logDir = '/persistent/free-sleep-data/logs';
const logFile = path.join(logDir, 'free-sleep.log');
// Try to create directory, or fall back to console only
let fileTransport;
try {
    fs.mkdirSync(logDir, { recursive: true });
    // Test write access
    fs.accessSync(logDir, fs.constants.W_OK);
    fileTransport = new winston.transports.File({
        filename: logFile,
        maxsize: 7 * 1024 * 1024,
        maxFiles: 1,
        tailable: true,
    });
}
catch (error) {
    const errorMessage = error instanceof Error
        ? error.message
        : typeof error === 'string'
            ? error
            : 'Unknown error';
    const message = `Logger cannot write to ${logDir}, file logging disabled: ${errorMessage}`;
    console.warn(message);
}
const transports = [
    new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} | ${level.padStart(15)} | ${message}`;
        })),
    }),
];
if (fileTransport)
    transports.push(fileTransport);
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.timestamp({
        format: () => moment.utc().format('YYYY-MM-DD HH:mm:ss [UTC]'),
    }), winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} | ${level.padStart(8)} | ${message}`;
    })),
    transports,
});
export default logger;
//# sourceMappingURL=logger.js.map
//# debugId=e76d54a3-8ebb-51cd-818f-60009cac455a
