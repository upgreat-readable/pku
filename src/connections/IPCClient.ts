import RootIPC from 'node-ipc';
import fs from 'fs';
import CliException from '../exceptions/CliException';
import { socketPath, IPCServerName, isDebug } from '../config';
import { IPCClientLogger } from '../logger';

/**
 * Класс клиента для подключения
 * к демонизированному процессу клиента Socket.IO соединения
 */
class IPCClient {
    protected initialized = false;

    constructor() {
        if (!isDebug) {
            RootIPC.config.silent = true;
        }

        RootIPC.config.logger = function (message) {
            IPCClientLogger.info(message);
        };
    }

    public connect() {
        return new Promise(resolve => {
            this.initialized = true;
            RootIPC.connectTo(IPCServerName, socketPath, () => {
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
        IPCClientLogger.info(message);
    }

    /** Метод проверки наличия сокета */
    protected checkConnect() {
        if (!fs.existsSync(socketPath)) {
            throw new CliException('Не найден сокет для подключения к демону');
        }

        if (!this.initialized) {
            throw new CliException(
                'Невозможно отправить сообщение т.к. подключение не инициализировано'
            );
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

    /**
     * Обёртка над .on ipc-client, для конфигурации и управления из cli-команд
     * @param event
     * @param callback
     * @protected
     */
    public on(event: string, callback: any) {
        this.checkConnect();

        this.getSelector().on(event, callback);
        return this;
    }

    /**
     * Синхронный метод ожидания программы
     * @param ms
     * @protected
     * @deprecated
     */
    public sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Установим silent на логи
     * @deprecated
     */
    public setConfigSilent() {}
}

export default IPCClient;
