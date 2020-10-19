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
    /**
     * Установим silent на логи
     */
    public setConfigSilent() {
        if (!isDebug) {
            RootIPC.config.silent = true;
        }
    }

    public sendToLogMessage(message: string) {
        RootIPC.config.logger = function (message) {
            IPCClientLogger.info(message);
        };
    }

    public connect(callback: any) {
        RootIPC.connectTo(IPCServerName, socketPath, callback);
    }

    /**
     * Отправка сообщения серверу
     * @param event
     * @param message объект который необходимо отправить
     * @param waitResponse необходимо дождаться ответа
     */
    public sendMessage(event: string, message: any = {}, waitResponse: boolean = false) {
        this.checkSocket();
        this.setConfigSilent();
        this.sendToLogMessage(message);

        const sendData = () => {
            this.getSelector().emit(event, message);
            this.disconnect();
        };

        RootIPC.connectTo(IPCServerName, socketPath, () => {
            this.getSelector().on('connect', sendData);
        });
    }

    /** Метод проверки наличия сокета */
    public checkSocket() {
        if (!fs.existsSync(socketPath)) {
            throw new CliException('не найден сокет для подключения к демону');
        }
    }

    /**
     * Получение ссылки на сервер
     * @protected
     */
    protected getSelector() {
        return RootIPC.of[IPCServerName];
    }

    /** Отключение клиента от демона */
    public disconnect() {
        RootIPC.disconnect(IPCServerName);
    }

    /**
     * Обёртка над .emit ipc-client, для конфигурации и управления из cli-команд
     * @param event
     * @param message
     * @protected
     */
    public emit(event: string, message: any) {
        this.checkSocket();

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
        this.checkSocket();

        this.getSelector().on(event, callback);
        return this;
    }

    /**
     * Синхронный метод ожидания программы
     * @param ms
     * @protected
     */
    public sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default IPCClient;
