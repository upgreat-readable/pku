import winston, { format } from 'winston';
import { logFormat } from './config';

const printf = format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`);
let consoleFormat = format.combine(format.json(), format.timestamp());
let fileFormat = consoleFormat;

if (logFormat === 'pretty') {
    consoleFormat = format.combine(format.colorize(), format.simple(), format.timestamp(), printf);
    fileFormat = format.combine(format.simple(), format.timestamp(), printf);
}

export const CommandLogger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({ filename: 'logs/command.log', format: fileFormat }),
    ],
});

export const IPCServerLogger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({ filename: 'logs/ipc-server.log', format: fileFormat }),
    ],
});

export const IPCClientLogger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.File({ filename: 'logs/ipc-client.log', format: fileFormat }),
    ],
});

export default winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({ filename: 'logs/combined.log', format: fileFormat }),
    ],
});
