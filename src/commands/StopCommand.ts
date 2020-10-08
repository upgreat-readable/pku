import AbstractCommand from './interface/AbstractCommand';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';

/**
 * Команда остановки сессии
 * Возвращает json расчет критериев из пакета критериев
 */
class StopCommand extends AbstractCommand {
    name: string = 'stop';
    description: string = 'Команда завершения сессии';
    alias: string = 'endSession';

    /** Обработка команды */
    protected action = () => {
        const client = new IPCClient();
        client.sendMessage(IPCServer.sessionStopEvent);
    };
}

export default StopCommand;
