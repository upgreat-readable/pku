import RootIPC from 'node-ipc';
import logger, { IPCServerLogger } from '../logger';
import { isDebug, IPCServerName, socketPath } from '../config';
import fs from 'fs';
import SessionService from '../service/SessionService';
import MessageData from '../types/Message';
import Message from '../messages';
import http, { IncomingMessage, RequestListener, Server, ServerResponse } from 'http';
/**
 * Класс IPC сервера
 * отвечает за работу демонизированного процесса
 */
export class IPCServer {
    static readonly sessionStartEvent = 'message.start';
    static readonly sessionStopEvent = 'ipc.session-stop';
    static readonly sendFileEvent = 'ipc.send-file';
    static readonly sessionReconnectEvent = 'ipc.session-reconnect';
    session: SessionService;
    lastSocket: any;

    /**
     * Создает RootIPC сервер, который будет слушать события
     * @private
     */
    constructor() {
        this.checkSocket();
        this.configureIPCServer();
        this.session = new SessionService(this);

        RootIPC.serve(socketPath);
        this.handleEvents();
        this.getCurrent().start();

        if (isDebug) {
            this.initHttpServer();
        }
    }

    public initHttpServer() {
        const port = 3000;
        const requestHandler: RequestListener = (req: IncomingMessage, res: ServerResponse) => {
            if (req.url === '/metrics') {
                const isConnected = this.session.client.isConnect() ?? false;
                const payload = { isConnected };
                const content = JSON.stringify(payload);
                console.log(`get metrics:${content}`);
                res.setHeader('Content-Type', 'application/json');
                res.end(content);
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
            IPCServerLogger.info(message);
        };
    }

    /**
     * Проверяем наличие сокета
     * Предотвращает возможность запустить 2 демона
     */
    public checkSocket() {
        if (fs.existsSync(socketPath)) {
            fs.unlinkSync(socketPath);
            // throw new CliException('Нельзя запустить второй процесс сервера');
        }
    }

    private handleEvents() {
        const {
            sendFileEvent,
            sessionStartEvent,
            sessionStopEvent,
            sessionReconnectEvent,
        } = IPCServer;

        this.getCurrent()
            .on(sendFileEvent, data => this.onSendFile(data))
            .on(sessionStartEvent, (data, socket) => this.onSessionStart(data, socket))
            .on(sessionStopEvent, (data, socket) => this.onSessionStop(data, socket))
            .on(sessionReconnectEvent, () => this.onSessionReconnect());
    }

    public onSessionStart(options: StartOptions, socket: any) {
        this.lastSocket = socket;
        logger.debug('IPC server handle: ' + IPCServer.sessionStartEvent);
        this.session.start(options);
    }

    public onSendFile(data: any) {
        logger.debug('IPC server handle: ' + IPCServer.sendFileEvent);
        this.session.send(data);
    }

    public onSessionStop(data: any, socket: any) {
        this.lastSocket = socket;
        logger.debug('IPC server handle: ' + IPCServer.sessionStopEvent);
        this.session.stop();
    }

    public onSessionReconnect() {
        logger.debug('IPC server handle: ' + IPCServer.sessionReconnectEvent);
        this.session.reconnect();
    }

    /** Отправка сообщения подключившемуся клиенту */
    public sendToClient(event: string, messageData: MessageData) {
        // рендерим сообщение в консоль сервера

        Message.fromDictionary(messageData).show();

        this.getCurrent().emit(this.lastSocket, event, messageData);
    }
}
