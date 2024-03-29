import RootIPC from 'node-ipc';
import fs from 'fs';
import { LogEntry } from 'winston';
import http, { IncomingMessage, RequestListener, Server, ServerResponse } from 'http';
import * as url from 'url';

import promClient, { Gauge } from 'prom-client';

import { IPCServerLogger } from '../logger';
import { isDebug, socketPath } from '../config';
import SessionService from '../service/SessionService';
import MessageData from '../types/Message';
import Message from '../messages';
import LoggingService from '../service/LoggingService';
/**
 * Класс IPC сервера
 * отвечает за работу демонизированного процесса
 *
 * Главная задача быть прослойкой между (Command + IPCClient) <=> SessionService(SocketIO)
 */
export class IPCServer {
    /**
     * *magic*
     * т.к. константы транслируются в сервис в виде вызова метода SessionService
     * То они должны соответствовать названиями методов SessionService
     */
    static readonly sessionStartEvent = 'ipc.start';

    static readonly sessionStopEvent = 'ipc.stop';

    static readonly repeatFileEvent = 'ipc.repeatFile';

    static readonly sendFileEvent = 'ipc.sendFile';

    static readonly sessionReconnectEvent = 'ipc.reconnect';

    static readonly sendLogsEvent = 'ipc.sendLogs';

    /** Последнее подключение клиента-сокета */
    lastSocket: any;

    // @ts-ignore
    session: SessionService;

    /**
     * Создает RootIPC сервер, который будет слушать события
     * @private
     */
    run() {
        this.checkSocket();
        this.configureIPCServer();
        this.session = new SessionService();

        RootIPC.serve(socketPath);
        this.handleEvents();
        this.getCurrent().start();
        if (isDebug) {
            this.initHttpMetricServer();
        }
    }

    public initHttpMetricServer() {
        const promRegister = promClient.register;

        const connectedSockets = new Gauge({
            name: 'socket_io_connected',
            help: 'Is the connection active or not',
        });

        const port = 3000;
        const requestHandler: RequestListener = async (req: IncomingMessage, res: ServerResponse) => {
            const route = url.parse(`${req.url}`).pathname;
            if (route === '/metrics') {
                connectedSockets.reset();
                const isConnected = this.session.client.isConnect() ?? false;
                if (isConnected) {
                    connectedSockets.inc();
                }

                const result = await promRegister.metrics();

                res.setHeader('Content-Type', promRegister.contentType);
                res.end(result);
            } else {
                res.end('');
            }
        };
        const server: Server = http.createServer(requestHandler);
        server.listen(port);
    }

    public getCurrent() {
        return RootIPC.server;
    }

    // noinspection JSMethodCanBeStatic
    private configureIPCServer() {
        RootIPC.config.logger = function (message) {
            const level = message.includes('ipc.sendFile') || message.includes('ipc.sendLogs') ? 'verbose' : 'info';
            LoggingService.process(IPCServerLogger, { level, message, group: 'IPC' });
        };
    }

    /**
     * Проверяем наличие сокета
     * Предотвращает возможность запустить 2 демона
     */
    public checkSocket() {
        if (fs.existsSync(socketPath)) {
            fs.unlinkSync(socketPath);
        }
    }

    /** Отправка сообщения подключившемуся клиенту */
    public sendToClient(event: string, messageData: MessageData) {
        // рендерим сообщение в консоль сервера
        Message.fromDictionary(messageData).show();

        if (!this.lastSocket || !this.lastSocket.readable) {
            const info: LogEntry = { level: 'error', message: `Пользователь не ожидает ответа. Пропущено. ${event}`, group: 'IPC' };
            if (this.session) {
                info.sessionId = this.session.id;
            }
            LoggingService.process(IPCServerLogger, info);
            return;
        }

        this.getCurrent().emit(this.lastSocket, event, messageData);
    }

    private handleEvents() {
        const { repeatFileEvent, sendFileEvent, sessionStartEvent, sessionStopEvent, sessionReconnectEvent, sendLogsEvent } = IPCServer;

        this.getCurrent()
            .on(repeatFileEvent, (data, socket) => this.transferEventToSession(repeatFileEvent, data, socket))
            .on(sendFileEvent, (data, socket) => this.transferEventToSession(sendFileEvent, data, socket))
            .on(sessionStartEvent, (data, socket) => this.transferEventToSession(sessionStartEvent, data, socket))
            .on(sessionStopEvent, (data, socket) => this.transferEventToSession(sessionStopEvent, data, socket))
            .on(sessionReconnectEvent, (data, socket) => this.transferEventToSession(sessionReconnectEvent, data, socket))
            .on(sendLogsEvent, (data, socket) => this.transferEventToSession(sendLogsEvent, data, socket));
    }

    /**
     * Метод транслирует вызов в сессию
     * @param event
     * @param clientPayload
     * @param socket
     * @private
     */
    private transferEventToSession(event: string, clientPayload: any, socket: any) {
        this.lastSocket = socket;
        const methodName = event.replace('ipc.', '');

        // @ts-ignore
        this.session[methodName](clientPayload);
    }
}

export default new IPCServer();
