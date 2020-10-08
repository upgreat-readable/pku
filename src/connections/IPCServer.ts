import RootIPC from 'node-ipc';
import logger, { IPCServerLogger } from '../logger';
import { socketPath } from '../config';
import fs from 'fs';
import SessionService from '../service/SessionService';

/**
 * Класс IPC сервера
 * отвечает за работу демонизированного процесса
 */
export class IPCServer {
    static readonly sessionStartEvent = 'ipc.session-start';
    static readonly sessionStopEvent = 'ipc.session-stop';
    static readonly sendFileEvent = 'ipc.send-file';
    static readonly sessionReconnectEvent = 'ipc.session-reconnect';
    session: SessionService;

    /**
     * Создает RootIPC сервер, который будет слушать события
     * @private
     */
    constructor() {
        this.checkSocket();
        this.configureIPCServer();
        this.session = new SessionService();

        RootIPC.serve(socketPath);
        this.handleEvents();
        RootIPC.server.start();
    }

    // noinspection JSMethodCanBeStatic
    private configureIPCServer() {
        // RootIPC.config.silent = true;
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

        RootIPC.server
            .on(sendFileEvent, data => this.onSendFile(data))
            .on(sessionStartEvent, data => this.onSessionStart(data))
            .on(sessionStopEvent, () => this.onSessionStop())
            .on(sessionReconnectEvent, () => this.onSessionReconnect());
    }

    public onSessionStart(options: StartOptions) {
        logger.debug('IPC server handle: ' + IPCServer.sessionStartEvent);
        this.session.start(options);
    }

    public onSendFile(data: any) {
        logger.debug('IPC server handle: ' + IPCServer.sendFileEvent);
        this.session.send(data);
    }

    public onSessionStop() {
        logger.debug('IPC server handle: ' + IPCServer.sessionStopEvent);
        this.session.stop();
    }

    public onSessionReconnect() {
        console.log('onSessionReconnect');
        logger.debug('IPC server handle: ' + IPCServer.sessionReconnectEvent);
        this.session.reconnect();
    }
}
