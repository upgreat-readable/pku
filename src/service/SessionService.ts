import { SocketIoClient } from '../connections/SocketIoClient';
import { IPCServer } from '../connections/IPCServer';
import logger from '../logger';
import RootIPC from 'node-ipc';
import { IPCServerName, socketPath } from '../config';

class SessionService {
    IPCServer: IPCServer;
    client: SocketIoClient;
    id: number | false = false;
    active: Boolean = false;
    receivedFiles: Array<number> = [];
    processedFiles: Array<number> = [];
    options: StartCommandOptions | undefined;

    constructor(IPCServer: IPCServer) {
        this.IPCServer = IPCServer;
        this.client = new SocketIoClient();
    }

    start(options: StartCommandOptions) {
        this.options = options;
        if (this.options.demo) {
            this.client.demoMode = true;
            logger.info('Ваша сессия стартовала в DEMO-режиме');
        }
        this.client.connect();

        setTimeout(() => {
            this.active = this.client.socket.connected;
        }, 2000);

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

        this.client.send('session-client-abort', { sessionId: this.id });

        this.active = this.client.socket.connected;
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
        this.client.connect();
        this.active = this.client.socket.connected;
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
                logger.info('Сессия успешно подключилась ' + sessionId);
                this.id = sessionId;
                this.IPCServer.sendToClient('start-feedback-to-command', true);
            })
            .on('session-reconnect-success', ({ sessionId }: any): never | any => {
                logger.info('Сессия успешно переподключилась ' + sessionId);
                this.id = sessionId;
            })

            // START
            .on('session-start-error', (data: any): never | any => {
                logger.error('При старте сессии произошла ошибка ' + JSON.stringify(data));
                this.IPCServer.sendToClient('start-feedback-to-command', JSON.stringify(data));
            })

            .on('connection-auth-error', (data: any) => {
                logger.error(
                    'connection-auth-error - Произошла ошибка авторизации по токену' +
                        JSON.stringify(data)
                );
                this.IPCServer.sendToClient('start-feedback-to-command', JSON.stringify(data));
                // @todo remove active|id
            })

            // STOP
            .on('session-client-abort-success', (data: any) => {
                logger.info('session-client-abort-success' + JSON.stringify(data));
                this.IPCServer.sendToClient('stop-feedback-to-command', JSON.stringify(data));
                this.client.disconnect();
            })
            .on('session-client-abort-error', (data: any) => {
                logger.error('session-client-abort-error' + JSON.stringify(data));
                this.IPCServer.sendToClient('stop-feedback-to-command', JSON.stringify(data));
                this.client.disconnect();
            });
    }
}

export default SessionService;
