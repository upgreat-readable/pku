import AbstractCommand from './interface/AbstractCommand';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';
import MessageData from '../types/Message';
import Message from '../messages';
import { CommandLogger } from '../logger';

/**
 * Команда запроса повторного получения файла
 */
class RepeatFileCommand extends AbstractCommand {
    name: string = 'repeatFile';

    description: string = 'Команда запроса повторного получения файла';

    /**
     * Обработка команды
     */
    protected action = async () => {
        await new Promise(resolve => {
            const client = new IPCClient();
            client.connect().then((connection: any) => {
                connection.on('message.file.repeat', (messageData: MessageData) => {
                    Message.fromDictionary(messageData).setLogger(CommandLogger).show();

                    resolve();
                    client.disconnect();

                    if (messageData.message === 'message.file.repeat.success') {
                        process.exit(0);
                    }
                });

                client.sendMessage(IPCServer.repeatFileEvent);
            });
        });
    };
}

export default RepeatFileCommand;
