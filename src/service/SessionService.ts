import { SocketIoClient } from '../connections/SocketIoClient';
import logger from '../logger';

class SessionService {
    client: SocketIoClient;
    id: number | false = false;
    active: Boolean = false;
    receivedFiles: Array<number> = [];
    processedFiles: Array<number> = [];
    options: StartOptions | undefined;

    constructor() {
        this.client = new SocketIoClient();
    }

    start(options: StartOptions) {
        this.options = options;
        this.active = true;
        this.client.connect();
        this.subscribe();
        this.client.send('session-start', {
            type: this.options.mode,
            params: {
                dsType: this.options.type,
                countFiles: this.options.count,
                lang: this.options.lang,
                time: this.options.time,
            },
        });
    }

    stop() {
        if (!this.isActive()) {
            return;
        }

        this.active = false;
        this.client.send('session-client-abort', { sessionId: this.id });
        this.client.disconnect();
    }

    send(data: any) {
        logger.debug('socketIo client=>server: session-file-send');
        this.client.send('session-file-send', {
            sessionId: this.id,
            fileId: data.fileId,
            content: data.content,
        });
    }

    reconnect() {
        this.active = true;
        this.client.connect();
        this.subscribe();
        this.client.send('session-reconnect');
    }

    /** Сессия уже запущена? */
    isActive() {
        return this.active;
    }

    subscribe() {
        this.client.socket
            .on('session-start-success', ({ sessionId }: any): never | any => {
                logger.info('Сессия успешно переподключилась ' + sessionId);
                this.id = sessionId;
            })
            .on('session-reconnect-success', ({ sessionId }: any): never | any => {
                logger.info('Сессия успешно переподключилась ' + sessionId);
                this.id = sessionId;
            });
    }
}

export default SessionService;
