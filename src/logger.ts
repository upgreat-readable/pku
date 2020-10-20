import winston, { format } from 'winston';
import { logFormat } from './config';

let optionFormat = format.json();

if (logFormat === 'pretty') {
    optionFormat = format.combine(format.colorize(), format.simple());
}

export const IPCServerLogger = winston.createLogger({
    format: optionFormat,
    level: 'debug',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/ipc-server.log' }),
    ],
});

export const IPCClientLogger = winston.createLogger({
    format: optionFormat,
    level: 'debug',
    transports: [new winston.transports.File({ filename: 'logs/ipc-client.log' })],
});

export default winston.createLogger({
    format: optionFormat,
    level: 'debug',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/command.log' }),
    ],
});
