import fs from 'fs';

import SIClient, { SocketIoClient } from '../connections/SocketIoClient';
import IPCServer from '../connections/IPCServer';
import logger from '../logger';
import { DemoMoveFileService } from './DemoMoveFileService';
import LoggingService from './LoggingService';
import LogPersistenceService from './LogPersistenceService';

class SessionService {
    demoMode: boolean = false;
    client: SocketIoClient;
    id: number | false = false;
    options: StartCommandOptions | undefined;

    constructor() {
        this.client = SIClient;
    }

    start(options: StartCommandOptions) {
        LoggingService.process(logger, { level: 'info', message: 'запрошен старт новой сессии', sessionId: this.id, group: 'session-start' });
        this.options = options;

        this.demoMode = false;
        if (this.options.demo) {
            this.demoMode = true;
            LoggingService.process(logger, {
                level: 'info',
                message: 'Сессия стартует в DEMO-режиме',
                sessionId: this.id,
                group: 'session-start',
            });
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
        LoggingService.process(logger, { level: 'info', message: 'запрошена остановка сессии', sessionId: this.id, group: 'session-stop' });
        this.connect();
        this.client.send('session-client-abort', { sessionId: this.id });
    }

    repeatFile() {
        this.connect();
        LoggingService.process(logger, {
            level: 'info',
            message: `запрошено повторное получение файла от сервера`,
            sessionId: this.id,
            group: 'file',
        });
        this.client.send('session-file-repeat');
    }

    sendFile(data: any) {
        this.connect();
        LoggingService.process(logger, {
            level: 'debug',
            message: `запрошена отправка файла ${data.fileId} на сервер`,
            sessionId: this.id,
            data,
            group: 'file',
        });
        this.client.send('session-file-send', {
            sessionId: this.id,
            fileId: data.fileId,
            content: data.content,
        });
    }

    reconnect() {
        LoggingService.process(logger, {
            level: 'info',
            message: 'запрошено восстановление подключения к сессии',
            sessionId: this.id,
            group: 'session-reconnect',
        });
        this.connect();
        this.client.send('session-reconnect');
    }

    connect() {
        LoggingService.process(logger, { level: 'info', message: 'подключение', sessionId: this.id, group: 'session-start' });
        this.client.connect(() => {
            this.subscribe();
        });
    }

    sendLogs(data: any) {
        this.connect();
        LoggingService.process(logger, {
            level: 'info',
            message: `запрошена отправка логов сессии ${data.sessionId} на сервер`,
            sessionId: this.id,
            group: 'logs',
        });
        this.client.send('logs-send', data.content);
    }

    // noinspection JSMethodCanBeStatic
    private saveFile(data: any) {
        LoggingService.process(logger, { level: 'info', message: `сохранение файла ${data.fileId}`, sessionId: this.id, data, group: 'file' });
        try {
            fs.writeFileSync('files/in/' + data.fileId + '.json', JSON.stringify(data.content));
        } catch (e) {
            LoggingService.process(logger, {
                level: 'error',
                message: `файл ${data.fileId} не был сохранен с ошибкой ${e.message}`,
                sessionId: this.id,
                group: 'file',
            });
        }
    }

    /**
     * В демо режиме сессия сама размечает файл и отправляет на сервер
     * @param data
     * @private
     */
    private saveFileInDemoMode(data: any) {
        LoggingService.process(logger, {
            level: 'info',
            message: `DEMO-режим - сохранение файла ${data.fileId}`,
            sessionId: this.id,
            data,
            group: 'file',
        });
        try {
            this.saveFile(data);
            if (this.demoMode) {
                //@ts-ignore
                let server = new DemoMoveFileService(data);
                server.moveAction();
            }
        } catch (e) {
            LoggingService.process(logger, {
                level: 'error',
                message: `DEMO-режим - файл ${data.fileId} не был сохранен с ошибкой ${e.message}`,
                sessionId: this.id,
                group: 'file',
            });
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
                LoggingService.process(logger, {
                    level: 'info',
                    message: `Стал доступен файл ${data.fileId} в сессии`,
                    sessionId: this.id,
                    data,
                    group: 'file',
                });

                if (this.demoMode) {
                    this.saveFileInDemoMode(data);
                } else {
                    this.saveFile(data);
                }
            })
            .on('session-file-repeat-success', (data: any) => {
                LoggingService.process(logger, {
                    level: 'info',
                    message: `Повторно получен файл ${data.fileId}`,
                    sessionId: this.id,
                    data,
                    group: 'file',
                });

                try {
                    fs.writeFileSync(`files/in/${data.fileId}.json`, JSON.stringify(data.content));
                    IPCServer.sendToClient('message.file.repeat', { message: 'message.file.repeat.success' });
                } catch (e) {
                    LoggingService.process(logger, {
                        level: 'error',
                        message: `файл ${data.fileId} не был сохранен с ошибкой ${e.message}`,
                        sessionId: this.id,
                        group: 'file',
                    });
                    IPCServer.sendToClient('message.file.repeat', { message: 'message.file.repeat.error', source: e.message, type: 'error' });
                }
            })
            .on('session-file-repeat-error', (data: any) => {
                IPCServer.sendToClient('message.file.repeat', { message: 'message.file.repeat.error', source: data, type: 'error' });
            })

            .on('session-file-send-success', (data: any) => {
                IPCServer.sendToClient('message.file', { message: 'message.file.success', source: data });
            })
            .on('session-file-send-error', (data: any) => {
                IPCServer.sendToClient('message.file', { message: 'message.file.error', source: data, type: 'error' });
            })

            .on('logs-get', async (data: any) => {
                const border = new Date(data.from);

                await LogPersistenceService.prototype.trimLog(border);

                const entriesToSend = await LogPersistenceService.prototype.getUnsentEntries(border);
                if (entriesToSend.length > 0) {
                    this.client.send('logs-send', entriesToSend);
                }
            })

            .on('logs-send-success', () => {
                IPCServer.sendToClient('message.logs', { message: 'message.logs.success' });
            })
            .on('logs-send-error', (data: any) => {
                IPCServer.sendToClient('message.logs', { message: 'message.logs.error', source: data, type: 'error' });
            });
    }
}

export default SessionService;
