import io from 'socket.io-client';

import logger from '../logger';
import { link, userToken } from '../config';
import IPCServer from './IPCServer';
import LoggingService from '../service/LoggingService';

export class SocketIoClient {
    // @ts-ignore
    socket: SocketIOClient.Socket;

    public connect(callback: Function = () => {}) {
        if (!userToken) {
            // @todo заменить на более безобидный вариант или отловить
            throw new Error('из env не был получен токен юзера');
        }

        // если подключен - пропускаем
        if (this.socket && this.socket.connected) {
            return;
        }

        // если сокет есть, но отключен - подключаемся
        if (this.socket) {
            this.socket.connect();
            return;
        }

        // создаем новый
        this.socket = io.connect(link, {
            secure: true,
            rejectUnauthorized: false,
            query: {
                token: userToken,
            },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 3000,
            reconnectionDelay: 2500, // how long to initially wait before attempting a new reconnection
            reconnectionDelayMax: 3000, // maximum amount of time to wait between reconnection attempts. Each attempt increases the reconnection delay by 2x along with a randomization factor
            randomizationFactor: 0.5,
        });

        this.handleRemoteEvents();
        callback();
    }

    public isConnect() {
        return this.socket && this.socket.connected;
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
            .on('connect', () =>
                LoggingService.process(logger, {
                    level: 'info',
                    message: 'установлено подключение к сокету удалённого сервера',
                    group: 'socket.io',
                })
            )
            .on('disconnect', () => this.sendToClient('disconnect', 'error'))

            .on('connect_error', () => this.sendToClient('disconnect', 'error'))
            .on('connect_timeout', () => this.sendToClient('disconnect', 'error'))

            .on('reconnect_attempt', () => this.sendToClient('reconnect_attempt'))
            .on('reconnect_error', () => this.sendToClient('reconnect_error', 'error'))
            .on('reconnect_failed', () => this.sendToClient('reconnect_failed', 'error'))
            .on('reconnect', () => this.sendToClient('reconnect'))

            .on('error', (error: Object) => LoggingService.process(logger, { level: 'error', message: error.toString(), error, group: 'socket.io' }));
    }

    // noinspection JSMethodCanBeStatic
    private sendToClient(code: string, type: string = 'info') {
        IPCServer.sendToClient('message.network', {
            message: 'message.socket-io.' + code,
            type,
        });
    }
}

export default new SocketIoClient();
