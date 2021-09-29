import { Command } from 'commander';

import AbstractCommand from './interface/AbstractCommand';
import { DemoMoveFileService } from '../service/DemoMoveFileService';
import { CommandLogger } from '../logger';
import LoggingService from '../service/LoggingService';

/**
 * Команда перемещения файла
 */
class DemoMoveFileCommand extends AbstractCommand {
    private loggingService: LoggingService = new LoggingService();

    name: string = 'demoMoveFile';

    description: string = 'Команда для теста обмена. Перемещает файл из in в out с добавлением разметки';

    protected bindOptions(command: Command) {
        command.option('--fileId <fileId>', 'id файла в папке files/in/');
    }

    /**
     * Обработка команды
     */
    protected action = (options: FileOptions) => {
        try {
            const server = new DemoMoveFileService(options);
            server.moveAction();
        } catch (e) {
            this.loggingService.process(CommandLogger, { level: 'error', message: `Во время отправки произошла ошибка.\n${e.message}` });
        }
    };
}

export default DemoMoveFileCommand;
