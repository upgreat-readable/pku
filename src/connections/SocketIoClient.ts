import io from 'socket.io-client';
import logger from '../logger';
import fs from 'fs';
import { File } from '../files/File';
import { DemoMoveFileService } from '../service/DemoMoveFileService';
import { link, userToken } from '../config';

export class SocketIoClient {
    isConnected: boolean = false;
    demoMode: boolean = false;

    // @ts-ignore
    socket: SocketIOClient.Socket;

    public connect() {
        if (!userToken) {
            // @todo заменить на более безобидный вариант или отловить
            throw new Error('из env не был получен токен юзера');
        }

        this.socket = io.connect(link, {
            secure: true,
            rejectUnauthorized: false,
            query: {
                token: userToken,
            },
            transports: ['websocket'],
        });
        this.handleRemoteEvents();
    }

    public isConnect() {
        return this.socket.connected;
    }

    public disconnect() {
        this.socket.disconnect();
    }

    public send(eventName: string, data: object = {}) {
        this.socket.emit(eventName, data);
    }

    /**
     * Обработка событий инициированных удаленным сервером
     */
    private handleRemoteEvents() {
        this.socket
            .on('connection', () => {
                logger.info('connected to web socket server');
                this.isConnected = true;
            })
            .on('disconnect', () => {
                logger.info('disconnect web socket server');
                this.isConnected = false;
            })
            .on('connect_error', () => {
                logger.debug('connect_error');
            })
            .on('connect_timeout', () => {
                logger.debug('connect_timeout');
            })
            .on('reconnect_attempt', () => {
                logger.debug('reconnect_attempt');
            })
            .on('reconnecting', () => {
                logger.debug('reconnecting');
            })
            .on('session-file-available', (data: any) => {
                logger.info(`Стал доступен файл ${data.fileId} в сессии`);

                /** Если ПКУ был запущен с флагом demo true - при сохрании файл доразмечается,
                 * отправляется в папку out и отправляется на сервер. */
                if (this.demoMode) {
                    this.saveFileInDemoMode(data);
                } else {
                    this.saveFile(data);
                }
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

    private saveFileInDemoMode(data: any) {
        try {
            fs.writeFileSync('files/in/' + data.fileId + '.json', JSON.stringify(data.content));
            if (this.demoMode) {
                //@ts-ignore
                const file = new File({ fileId: data.fileId, filePath: '', dir: 'files/in/' });
                // @ts-ignore
                const server = new DemoMoveFileService(file);
                server.moveAction();
            }
        } catch (e) {
            logger.error(
                'DEMO-режим - файл ' + data.fileId + ' не был сохранен с ошибкой' + e.message
            );
        }
    }
}
