import { SocketIoClient } from '../connections/SocketIoClient';
import { IPCServer } from '../connections/IPCServer';
import logger from '../logger';
import Message from '../messages';

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
            logger.info('Сессия стартовала в DEMO-режиме');
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
            this.IPCServer.sendToClient('message.stop', {
                message: 'message.stop.error',
                type: 'error',
            });
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

            // START
            .on('session-start-success', ({ sessionId }: any) => {
                this.id = sessionId;
                this.IPCServer.sendToClient('message.start', {
                    message: 'message.start.success',
                    source: sessionId,
                });
            })
            .on('session-start-error', (data: any) => {
                this.IPCServer.sendToClient('message.start', {
                    message: 'message.start.error',
                    source: data,
                    type: 'error',
                });
            })
            .on('connection-auth-error', (data: any) => {
                this.IPCServer.sendToClient('message.start', {
                    message: 'message.start.auth',
                    source: data,
                    type: 'error',
                });
                this.IPCServer.sendToClient('message.reconnect', {
                    message: 'message.reconnect.auth',
                    source: data,
                    type: 'error',
                });
            })

            // RECONNECT
            .on('session-reconnect-success', ({ sessionId }: any) => {
                this.IPCServer.sendToClient('message.reconnect', {
                    message: 'message.reconnect.success',
                    source: sessionId,
                });
                this.id = sessionId;
            })
            .on('session-reconnect-error', (data: any) => {
                this.IPCServer.sendToClient('message.reconnect', {
                    message: 'message.reconnect.error',
                    source: data,
                    type: 'error',
                });
            })

            // STOP
            .on('session-client-abort-success', (data: any) => {
                this.IPCServer.sendToClient('message.stop', {
                    message: 'message.stop.success',
                    source: data,
                });
                this.client.disconnect();
            })
            .on('session-client-abort-error', (data: any) => {
                this.IPCServer.sendToClient('message.stop', {
                    message: 'message.stop.error',
                    source: data,
                    type: 'error',
                });
                this.client.disconnect();
            });
    }
}

export default SessionService;
