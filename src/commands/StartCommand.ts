import AbstractCommand from './interface/AbstractCommand';
import { Command } from 'commander';
import { IPCServer } from '../connections/IPCServer';
import IPCClient from '../connections/IPCClient';

/**
 * Команда старта сессии
 */
class StartCommand extends AbstractCommand {
    name: string = 'start';
    description: string = 'Команда старта сессии';

    protected bindOptions(command: Command) {
        command
            .requiredOption(
                '--mode <mode>',
                'режим сессии (algorithmic|technical|small)',
                /^(algorithmic|technical|small)$/i,
                'algorithmic'
            )
            .option('--type <type>', 'тип датасета (train|test)', /^(train|test)$/i, 'train')
            .option('--count <count>', 'количество файлов (100-1000)', /^1000|[\d]{3}$/i)
            .option('--lang <lang>', 'язык датасета(ru|en|all)', /^(ru|en|all)$/i, 'ru')
            .option(
                '--time <time>',
                'интервал отдачи файлов (10|20|30|40|50|60)',
                /^[1-6][0]$/i,
                '30'
            )
            .option('--demo <demo>', 'demo режим', false);
    }

    /**
     * Обработка команды
     */
    protected action = (options: StartCommandOptions) => {
        const client = new IPCClient();
        client.sendMessage(IPCServer.sessionStartEvent, options);
    };
}

export default StartCommand;
