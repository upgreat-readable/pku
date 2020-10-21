import AbstractCommand from './interface/AbstractCommand';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';
import Message from '../messages';
import { CommandLogger } from '../logger';
import MessageData from '../types/Message';

/**
 * Команда остановки сессии
 */
class StopCommand extends AbstractCommand {
    name: string = 'stop';
    description: string = 'Команда завершения сессии';
    alias: string = 'endSession';

    /** Обработка команды */
    protected action = async () => {
        await new Promise(resolve => {
            const client = new IPCClient();
            client.connect().then((connection: any) => {
                connection.on('message.stop', (messageData: MessageData) => {
                    Message.fromDictionary(messageData).setLogger(CommandLogger).show();

                    resolve();
                    client.disconnect();
                });
                client.sendMessage(IPCServer.sessionStopEvent);
            });
        });
    };
}

export default StopCommand;
