import AbstractCommand from './interface/AbstractCommand';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';
import { Command } from 'commander';
import { CommandLogger } from '../logger';
import MessageData from '../types/Message';
import Message from '../messages';

class StartCommand extends AbstractCommand {
    name: string = 'start';
    description: string = 'Команда старта сессии';

    protected bindOptions(command: Command) {
        command
            .requiredOption('--mode <mode>', 'режим сессии (algorithmic|technical|final)', /^(algorithmic|technical|final)$/i, 'algorithmic')
            .option('--type <type>', 'тип датасета (train|test)', /^(train|test)$/i, 'train')
            .option('--count <count>', 'количество файлов (30-1000)', /^\d+$/i, '300')
            .option('--lang <lang>', 'язык датасета(rus|eng|all)', /^(rus|eng|all)$/i, 'rus')
            .option('--time <time>', 'интервал отдачи файлов (10|20|30|40|50|60)', /^[1-6][0]$/i, '30')
            .option('--demo <demo>', 'demo режим', false);
    }

    /** Обработка команды */
    protected action = async (options: StartCommandOptions) => {
        await new Promise(resolve => {
            const client = new IPCClient();
            client.log(IPCServer.sessionStartEvent);
            client.connect().then((connection: any) => {
                connection.on('message.start', (messageData: MessageData) => {
                    Message.fromDictionary(messageData).setLogger(CommandLogger).show();

                    resolve();
                    client.disconnect();
                });
                client.sendMessage(IPCServer.sessionStartEvent, options);
            });
        });
    };
}

export default StartCommand;
