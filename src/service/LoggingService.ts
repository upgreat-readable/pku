import winston, { LogEntry, Logger, LoggerOptions } from 'winston';

import SIClient, { SocketIoClient } from '../connections/SocketIoClient';

class LoggingService {
    client: SocketIoClient;

    constructor() {
        this.client = SIClient;
    }

    process(logger: Logger, info: LogEntry) {
        if (!('sessionId' in info && info.sessionId)) {
            logger.log(info);

            return;
        }

        const options: LoggerOptions = {};
        options.level = logger.level;
        options.transports = [];
        for (const transport of logger.transports) {
            if (transport instanceof winston.transports.File) {
                options.transports.push(
                    new winston.transports.File({ filename: `logs/sessions/${info.sessionId}/${transport.filename}`, format: transport.format })
                );
            } else {
                options.transports.push(new winston.transports.Console({ format: transport.format }));
            }
        }

        winston.createLogger(options).log(info);
    }
}

export default new LoggingService();
