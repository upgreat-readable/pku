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
     * Отправка сообщения серверу
     * @param event
     * @param message объект который необходимо отправить
     * @param waitResponse необходимо дождаться ответа
     */
    public sendMessage(event: string, message: any = {}, waitResponse: boolean = false) {
        this.checkSocket();

        if (!isDebug) {
            RootIPC.config.silent = true;
        }

        RootIPC.config.logger = function (message) {
            IPCClientLogger.info(message);
        };

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
    protected disconnect() {
        RootIPC.disconnect(IPCServerName);
    }
}

export default IPCClient;
