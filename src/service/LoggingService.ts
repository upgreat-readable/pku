import winston, { LogEntry, Logger, LoggerOptions } from 'winston';

class LoggingService {
    public process(logger: Logger, info: LogEntry) {
        LoggingService.updateDateIfNeeded(logger);

        logger.log(info);
    }

    private static updateDateIfNeeded(logger: Logger) {
        const date = new Date().toISOString().substring(0, 10);
        const todayDirname = `logs/${date}`;

        const options: LoggerOptions = {};
        options.level = logger.level;
        options.transports = [];
        for (const transport of logger.transports) {
            if (transport instanceof winston.transports.File) {
                if (transport.dirname === todayDirname) {
                    return;
                }

                if (transport.dirname === 'logs') {
                    options.transports.push(new winston.transports.File({ filename: `logs/${transport.filename}`, format: transport.format }));
                } else {
                    options.transports.push(
                        new winston.transports.File({ filename: `${todayDirname}/${transport.filename}`, format: transport.format })
                    );
                }
            } else {
                options.transports.push(new winston.transports.Console({ format: transport.format }));
            }
        }

        logger.configure(options);
    }
}

export default new LoggingService();
