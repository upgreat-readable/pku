import RootIPC from 'node-ipc';
import logger, { IPCServerLogger } from '../logger';
import { IPCServerName, socketPath } from '../config';
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
        this.session = new SessionService(this);

        RootIPC.serve(socketPath);
        this.handleEvents();
        this.getCurrent().start();
    }

    public getCurrent() {
        return RootIPC.server;
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

    public remoteSingleReaction(eventToEmit: string, params: any) {
        RootIPC.connectTo(IPCServerName, socketPath, () => {
            RootIPC.of[IPCServerName].on('connect', () => {
                RootIPC.of[IPCServerName].emit(eventToEmit, params);
                RootIPC.disconnect(IPCServerName);
            });
        });
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
        logger.debug('IPC server handle: ' + IPCServer.sessionStartEvent);
        this.session.start(options);

        this.getCurrent().on('start-feedback-from-io', data => {
            this.getCurrent().emit(socket, 'start-feedback-to-command', data);
        });
    }

    public onSendFile(data: any) {
        logger.debug('IPC server handle: ' + IPCServer.sendFileEvent);
        this.session.send(data);
    }

    public onSessionStop(data: any, socket: any) {
        logger.debug('IPC server handle: ' + IPCServer.sessionStopEvent);
        this.session.stop();

        this.getCurrent().on('start-feedback-from-io', data => {
            this.getCurrent().emit(socket, 'start-feedback-to-command', data);
        });
    }

    public onSessionReconnect() {
        console.log('onSessionReconnect');
        logger.debug('IPC server handle: ' + IPCServer.sessionReconnectEvent);
        this.session.reconnect();
    }
}
