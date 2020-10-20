import { Command } from 'commander';

import AbstractCommand from './interface/AbstractCommand';
import { DemoMoveFileService } from '../service/DemoMoveFileService';
import { File } from '../files/File';

/**
 * Команда перемещения файла
 */
class DemoMoveFileCommand extends AbstractCommand {
    name: string = 'demoMoveFile';

    description: string =
        'Команда для теста обмена. Перемещает файл из in в out с добавлением разметки';

    protected bindOptions(command: Command) {
        command.option('--fileId <fileId>', 'id файла в папке files/in/');
    }

    /**
     * Обработка команды
     */
    protected action = (options: FileOptions) => {
        const filePath = 'files/in/';
        try {
            // @ts-ignore
            const file = new File({ fileId: options.fileId, filePath: '', dir: filePath });
            // @ts-ignore
            const server = new DemoMoveFileService(file);
            server.moveAction();
        } catch (e) {
            console.log(`Во время отправки произошла ошибка. \n${e.message}`);
        }
    };
}

export default DemoMoveFileCommand;
