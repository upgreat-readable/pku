import winston, { format } from 'winston';

import { logFormat, logPersistenceFile } from './config';

const printf = format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`);
let consoleFormat = format.combine(format.json(), format.timestamp(), format.uncolorize());
let fileFormat = consoleFormat;

if (logFormat === 'pretty') {
    consoleFormat = format.combine(format.timestamp(), format.splat(), format.colorize(), format.simple(), printf);
    fileFormat = format.combine(format.simple(), format.timestamp(), printf, format.uncolorize());
}

const persistenceFormat = format.combine(format.timestamp(), format.json());

export const CommandLocalLogger = winston.createLogger({
    level: 'verbose',
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({ filename: 'logs/command.log', format: fileFormat }),
    ],
});

export const CommandLogger = winston.createLogger({
    level: 'verbose',
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({ filename: 'logs/command.log', format: fileFormat }),
        new winston.transports.File({ filename: `logs/${logPersistenceFile}`, format: persistenceFormat }),
    ],
});

export const IPCServerLogger = winston.createLogger({
    level: 'verbose',
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({ filename: 'logs/ipc-server.log', format: fileFormat }),
        new winston.transports.File({ filename: `logs/${logPersistenceFile}`, format: persistenceFormat }),
    ],
});

export const IPCClientLogger = winston.createLogger({
    level: 'verbose',
    transports: [
        new winston.transports.File({ filename: 'logs/ipc-client.log', format: fileFormat }),
        new winston.transports.File({ filename: `logs/${logPersistenceFile}`, format: persistenceFormat }),
    ],
});

export default winston.createLogger({
    level: 'verbose',
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({ filename: 'logs/combined.log', format: fileFormat }),
        new winston.transports.File({ filename: `logs/${logPersistenceFile}`, format: persistenceFormat }),
    ],
});
