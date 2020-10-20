import AbstractCommand from './interface/AbstractCommand';
import { Command } from 'commander';
import { IPCServer } from '../connections/IPCServer';
import IPCClient from '../connections/IPCClient';
import MessageData from '../types/Message';
import Message from '../messages';
import { CommandLogger } from '../logger';

/**
 * Команда переподключения
 */
class ReconnectCommand extends AbstractCommand {
    name: string = 'reconnect';
    description: string = 'Команда переподключения';

    /**
     * Обработка команды
     */
    protected action = async () => {
        await new Promise(resolve => {
            const client = new IPCClient();
            client.connect().then((connection: any) => {
                connection.on('message.stop', (messageData: MessageData) => {
                    Message.fromDictionary(messageData).setLogger(CommandLogger).show();

                    resolve();
                    client.disconnect();
                });
            });
            client.sendMessage(IPCServer.sessionReconnectEvent);
        });
    };
}

export default ReconnectCommand;
