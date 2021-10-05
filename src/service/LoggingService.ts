import { LogEntry, Logger } from 'winston';

import SIClient, { SocketIoClient } from '../connections/SocketIoClient';

class LoggingService {
    client: SocketIoClient;

    constructor() {
        this.client = SIClient;
    }

    process(logger: Logger, info: LogEntry) {
        logger.log(info);
    }
}

export default LoggingService;
