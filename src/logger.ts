import winston, { format } from 'winston';
import * as Transport from 'winston-transport';

import { logFormat, logPersistenceFile, isDebug } from './config';

const timestampOption = { format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' };

const printf = format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`);
let consoleFormat = format.combine(format.json(), format.timestamp(timestampOption), format.uncolorize());
let fileFormat = consoleFormat;

const debugPrintf = format.printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`.replace(/\n/g, ' ');
});
const debugFormat = format.combine(format.simple(), format.timestamp(timestampOption), debugPrintf, format.uncolorize());

if (logFormat === 'pretty') {
    consoleFormat = format.combine(format.timestamp(timestampOption), format.splat(), format.colorize(), format.simple(), printf);
    fileFormat = format.combine(format.simple(), format.timestamp(timestampOption), printf, format.uncolorize());
}

const persistenceFormat = format.combine(format.timestamp(timestampOption), format.json());

const date = new Date().toISOString().substring(0, 10);

const isClientProcess = process.argv0 === 'node';
const prefix = isClientProcess ? 'client-' : 'server-';

const commandLocalLoggerTransports: Transport[] = [new winston.transports.Console({ format: consoleFormat })];
if (isClientProcess) {
    commandLocalLoggerTransports.push(new winston.transports.File({ filename: `logs/${date}/${prefix}command.log`, format: fileFormat }));
}
if (isDebug) {
    commandLocalLoggerTransports.push(new winston.transports.File({ filename: `logs/${prefix}various.log`, format: debugFormat }));
}

export const CommandLocalLogger = winston.createLogger({
    level: 'verbose',
    transports: commandLocalLoggerTransports,
});

const commandLoggerTransports: Transport[] = [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({ filename: `logs/${date}/${prefix}${logPersistenceFile}`, format: persistenceFormat, level: 'info' }),
];
if (isClientProcess) {
    commandLoggerTransports.push(new winston.transports.File({ filename: `logs/${date}/${prefix}command.log`, format: fileFormat }));
}
if (isDebug) {
    commandLoggerTransports.push(new winston.transports.File({ filename: `logs/${prefix}various.log`, format: debugFormat }));
}

export const CommandLogger = winston.createLogger({
    level: 'verbose',
    transports: commandLoggerTransports,
});

const IPCServerLoggerTransports = [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({ filename: `logs/${date}/${prefix}${logPersistenceFile}`, format: persistenceFormat, level: 'info' }),
];
if (!isClientProcess) {
    IPCServerLoggerTransports.push(new winston.transports.File({ filename: `logs/${date}/${prefix}ipc-server.log`, format: fileFormat }));
}
if (isDebug) {
    IPCServerLoggerTransports.push(new winston.transports.File({ filename: `logs/${prefix}various.log`, format: debugFormat }));
}

export const IPCServerLogger = winston.createLogger({
    level: 'verbose',
    transports: IPCServerLoggerTransports,
});

const IPCClientLoggerTransports = [
    new winston.transports.File({ filename: `logs/${date}/${prefix}${logPersistenceFile}`, format: persistenceFormat, level: 'info' }),
];
if (isClientProcess) {
    IPCClientLoggerTransports.push(new winston.transports.File({ filename: `logs/${date}/${prefix}ipc-client.log`, format: fileFormat }));
}
if (isDebug) {
    IPCClientLoggerTransports.push(new winston.transports.File({ filename: `logs/${prefix}various.log`, format: debugFormat }));
}

export const IPCClientLogger = winston.createLogger({
    level: 'verbose',
    transports: IPCClientLoggerTransports,
});

const defaultTransports = [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({ filename: `logs/${date}/${prefix}various.log`, format: fileFormat }),
    new winston.transports.File({ filename: `logs/${date}/${prefix}${logPersistenceFile}`, format: persistenceFormat, level: 'info' }),
];
if (isDebug) {
    defaultTransports.push(new winston.transports.File({ filename: `logs/${prefix}various.log`, format: debugFormat }));
}

export default winston.createLogger({
    level: 'verbose',
    transports: defaultTransports,
});
