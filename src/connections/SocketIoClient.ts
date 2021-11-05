import io from 'socket.io-client';
import { Counter, Gauge } from 'prom-client';

import logger from '../logger';
import { link, userToken } from '../config';
import IPCServer from './IPCServer';
import LoggingService from '../service/LoggingService';
import { GetNextFileService } from '../service/GetNextFileService';

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
        const connectTotal = new Counter({
            name: 'socket_io_connect_total',
            help: 'Total count of socket.io connection requests',
        });

        const disconnectTotal = new Counter({
            name: 'socket_io_disconnect_total',
            help: 'Total count of socket.io disconnections',
        });

        const connectErrorTotal = new Counter({
            name: 'socket_io_connect_error_total',
            help: 'Total count of socket.io connect error',
        });

        const connectTimeoutTotal = new Counter({
            name: 'socket_io_connect_timeout_total',
            help: 'Total count of socket.io connect timeout',
        });

        const reconnectAttemptTotal = new Counter({
            name: 'socket_io_reconnect_attempt_total',
            help: 'Total count of socket.io reconnect attempt',
        });

        const reconnectErrorTotal = new Counter({
            name: 'socket_io_reconnect_error_total',
            help: 'Total count of socket.io reconnect error',
        });

        const reconnectFailedTotal = new Counter({
            name: 'socket_io_reconnect_failed_total',
            help: 'Total count of socket.io reconnect failed',
        });

        const reconnectTotal = new Counter({
            name: 'socket_io_reconnect_total',
            help: 'Total count of socket.io reconnect',
        });

        const errorTotal = new Counter({
            name: 'socket_io_error_total',
            help: 'Total count of socket.io error',
        });

        this.socket
            .on('connect', () => {
                connectTotal.inc();
                LoggingService.process(logger, { level: 'info', message: 'установлено подключение к сокету удалённого сервера', group: 'socket.io' });

                LoggingService.process(logger, { level: 'info', message: 'запрос на получение пропущенного файла', group: 'socket.io' });
                this.socket.emit('session-file-repeat', { lastFileId: new GetNextFileService().getFileName() });
            })
            .on('disconnect', () => {
                disconnectTotal.inc();
                this.sendToClient('disconnect', 'error');
            })
            .on('connect_error', () => {
                connectErrorTotal.inc();
                this.sendToClient('disconnect', 'error');
            })
            .on('connect_timeout', () => {
                connectTimeoutTotal.inc();
                this.sendToClient('disconnect', 'error');
            })
            .on('reconnect_attempt', () => {
                reconnectAttemptTotal.inc();
                this.sendToClient('reconnect_attempt');
            })
            .on('reconnect_error', () => {
                reconnectErrorTotal.inc();
                this.sendToClient('reconnect_error', 'error');
            })
            .on('reconnect_failed', () => {
                reconnectFailedTotal.inc();
                this.sendToClient('reconnect_failed', 'error');
            })
            .on('reconnect', () => {
                reconnectTotal.inc();
                this.sendToClient('reconnect');
            })
            .on('error', (error: Object) => {
                errorTotal.inc();
                LoggingService.process(logger, { level: 'error', message: error.toString(), error, group: 'socket.io' });
            });
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
