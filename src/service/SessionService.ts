import SIClient, { SocketIoClient } from '../connections/SocketIoClient';
import IPCServer from '../connections/IPCServer';
import logger from '../logger';
import fs from 'fs';
import { File } from '../files/File';
import { DemoMoveFileService } from './DemoMoveFileService';

class SessionService {
    demoMode: boolean = false;
    client: SocketIoClient;
    id: number | false = false;
    options: StartCommandOptions | undefined;

    constructor() {
        this.client = SIClient;
    }

    start(options: StartCommandOptions) {
        this.options = options;
        if (this.options.demo) {
            this.demoMode = true;
            logger.info('Сессия стартовала в DEMO-режиме');
        }
        this.connect();

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
        this.connect();
        this.client.send('session-client-abort', { sessionId: this.id });
    }

    sendFile(data: any) {
        this.connect();
        logger.debug('socketIo client=>server: session-file-send');
        this.client.send('session-file-send', {
            sessionId: this.id,
            fileId: data.fileId,
            content: data.content,
        });
    }

    reconnect() {
        this.connect();
        this.client.send('session-reconnect');
    }

    connect() {
        this.client.connect(() => {
            this.subscribe();
        });
    }

    // noinspection JSMethodCanBeStatic
    private saveFile(data: any) {
        try {
            fs.writeFileSync('files/in/' + data.fileId + '.json', JSON.stringify(data.content));
        } catch (e) {
            logger.error('файл ' + data.fileId + ' не был сохранен с ошибкой' + e.message);
        }
    }

    /**
     * В демо режиме сессия сама размечает файл и отправляет на сервер
     * @param data
     * @private
     */
    private saveFileInDemoMode(data: any) {
        try {
            this.saveFile(data);
            if (this.demoMode) {
                //@ts-ignore
                const file = new File({ fileId: data.fileId, filePath: '', dir: 'files/in/' });
                // @ts-ignore
                const server = new DemoMoveFileService(file);
                server.moveAction();
            }
        } catch (e) {
            logger.error('DEMO-режим - файл ' + data.fileId + ' не был сохранен с ошибкой' + e.message);
        }
    }

    subscribe() {
        console.log('subscribe');
        this.client.socket

            // START
            .on('session-start-success', ({ sessionId }: any) => {
                this.id = sessionId;
                IPCServer.sendToClient('message.start', { message: 'message.start.success', source: sessionId });
            })
            .on('session-start-error', (data: any) => {
                IPCServer.sendToClient('message.start', { message: 'message.start.error', source: data, type: 'error' });
            })
            .on('connection-auth-error', (data: any) => {
                IPCServer.sendToClient('message.start', { message: 'message.start.auth', source: data, type: 'error' });
                IPCServer.sendToClient('message.reconnect', { message: 'message.reconnect.auth', source: data, type: 'error' });
            })

            // RECONNECT
            .on('session-reconnect-success', ({ sessionId }: any) => {
                IPCServer.sendToClient('message.reconnect', { message: 'message.reconnect.success', source: sessionId });
                this.id = sessionId;
            })
            .on('session-reconnect-error', (data: any) => {
                IPCServer.sendToClient('message.reconnect', { message: 'message.reconnect.error', source: data, type: 'error' });
            })

            // STOP
            .on('session-client-abort-success', (data: any) => {
                IPCServer.sendToClient('message.stop', { message: 'message.stop.success', source: data });
                this.client.disconnect();
            })
            .on('session-client-abort-error', (data: any) => {
                IPCServer.sendToClient('message.stop', { message: 'message.stop.error', source: data, type: 'error' });
                this.client.disconnect();
            })

            // SERVER SENT FILE
            .on('session-file-available', (data: any) => {
                logger.info(`Стал доступен файл ${data.fileId} в сессии `);

                if (this.demoMode) {
                    this.saveFileInDemoMode(data);
                } else {
                    this.saveFile(data);
                }
            });
    }
}

export default SessionService;
