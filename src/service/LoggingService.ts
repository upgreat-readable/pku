import { LogEntry, Logger } from 'winston';

class LoggingService {
    process(logger: Logger, info: LogEntry) {
        logger.log(info);
    }
}

export default new LoggingService();
