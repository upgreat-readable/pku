import RootIPC from 'node-ipc';
import { IPCServerLogger } from '../logger';
import { socketPath } from '../config';
import fs from 'fs';
import SessionService from '../service/SessionService';
import MessageData from '../types/Message';
import Message from '../messages';

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
    static readonly sendFileEvent = 'ipc.sendFile';
    static readonly sessionReconnectEvent = 'ipc.reconnect';

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
    }

    public getCurrent() {
        return RootIPC.server;
    }

    // noinspection JSMethodCanBeStatic
    private configureIPCServer() {
        RootIPC.config.logger = function (message) {
            IPCServerLogger.verbose(message);
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
            IPCServerLogger.error('Пользователь не ожидает ответа. Пропущено.' + event);
            return;
        }

        this.getCurrent().emit(this.lastSocket, event, messageData);
    }

    private handleEvents() {
        const { sendFileEvent, sessionStartEvent, sessionStopEvent, sessionReconnectEvent } = IPCServer;

        this.getCurrent()
            .on(sendFileEvent, (data, socket) => this.transferEventToSession(sendFileEvent, data, socket))
            .on(sessionStartEvent, (data, socket) => this.transferEventToSession(sessionStartEvent, data, socket))
            .on(sessionStopEvent, (data, socket) => this.transferEventToSession(sessionStopEvent, data, socket))
            .on(sessionReconnectEvent, (data, socket) => this.transferEventToSession(sessionReconnectEvent, data, socket));
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
