import AbstractCommand from './interface/AbstractCommand';
import { Command } from 'commander';
import { IPCServer } from '../connections/IPCServer';
import IPCClient from '../connections/IPCClient';

/**
 * Команда переподключения
 */
class ReconnectCommand extends AbstractCommand {
    name: string = 'reconnect';
    description: string = 'Команда переподключения';

    /**
     * Обработка команды
     */
    protected action = () => {
        const client = new IPCClient();
        client.sendMessage(IPCServer.sessionReconnectEvent);
    };
}

export default ReconnectCommand;
