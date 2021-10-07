import RootIPC from 'node-ipc';
import fs from 'fs';

import CliException from '../exceptions/CliException';
import { socketPath, IPCServerName, isDebug } from '../config';
import { IPCClientLogger, CommandLogger } from '../logger';
import MessageData from '../types/Message';
import Message from '../messages';
import LoggingService from '../service/LoggingService';

/**
 * Класс клиента для подключения
 * к демонизированному процессу клиента Socket.IO соединения
 */
class IPCClient {
    private loggingService: LoggingService = new LoggingService();

    protected initialized = false;

    constructor() {
        if (!isDebug) {
            RootIPC.config.silent = true;
        }

        RootIPC.config.logger = function (message) {
            LoggingService.prototype.process(IPCClientLogger, { level: 'verbose', message, group: 'IPC' });
        };
    }

    /**
     * Подключается к IPCServer
     *
     * Обработка событий и отправка сообщений
     * возможна только после разрешения промиса
     */
    public connect() {
        return new Promise(resolve => {
            this.initialized = true;
            RootIPC.connectTo(IPCServerName, socketPath, () => {
                this.getSelector()

                    // system
                    .on('error', (error: any) => this.throwError('error', error))
                    .on('socket.disconnected', () => this.throwError('socket.disconnected'))
                    .on('destroy', () => this.throwError('destroy'))
                    .on('disconnect', () => this.throwError('disconnect'))

                    // network
                    .on('message.network', (messageData: MessageData) => {
                        Message.fromDictionary(messageData).show();
                        if (messageData.message === 'message.socket-io.reconnect_failed') {
                            process.exit(1);
                        }
                    });

                resolve(this.getSelector());
            });
        });
    }

    /**
     * Отправка сообщения серверу
     * @param event
     * @param message объект который необходимо отправить
     * @param waitResponse необходимо дождаться ответа
     */
    public sendMessage(event: string, message: any = {}, waitResponse: boolean = false) {
        this.checkConnect();
        this.log(event);
        this.emit(event, message);
    }

    public log(message: string) {
        this.loggingService.process(IPCClientLogger, { level: 'info', message, group: 'IPC' });
    }

    /** Метод проверки наличия сокета */
    protected checkConnect() {
        if (!fs.existsSync(socketPath)) {
            throw new CliException('Не найден сокет для подключения к демону');
        }

        if (!this.initialized) {
            throw new CliException('Невозможно отправить сообщение т.к. подключение не инициализировано');
        }
    }

    /** Отключение клиента от демона */
    public disconnect() {
        RootIPC.disconnect(IPCServerName);
    }

    /** Получение ссылки на сервер */
    protected getSelector() {
        return RootIPC.of[IPCServerName];
    }

    /**
     * Обёртка над .emit ipc-client, для конфигурации и управления из cli-команд
     * @param event
     * @param message
     * @protected
     */
    public emit(event: string, message: any) {
        this.checkConnect();

        this.getSelector().emit(event, message);
        return this;
    }

    // noinspection JSMethodCanBeStatic
    private throwError(eventType: string, error: any = null) {
        const message = 'Сокет IPCClient отключился ';

        if (eventType == 'disconnect') {
            this.loggingService.process(IPCClientLogger, { level: 'info', message: `${message} ${eventType} ${error || ''}`, group: 'IPC' });
            process.exit(1);
        }

        this.loggingService.process(CommandLogger, { level: 'error', message: `${message} ${eventType} ${error || ''}`, group: 'IPC' });
        this.loggingService.process(IPCClientLogger, { level: 'error', message: `${message} ${eventType} ${error || ''}`, group: 'IPC' });

        process.exit(1);
    }
}

export default IPCClient;
