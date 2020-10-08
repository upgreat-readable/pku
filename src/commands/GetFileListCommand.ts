import { Command } from 'commander';
import AbstractCommand from './interface/AbstractCommand';
import { GetFileListService } from '../service/GetFileListService';

/**
 * Команда критериев
 * Возвращает json расчет критериев из пакета критериев
 */
class GetFileListCommand extends AbstractCommand {
    name: string = 'getFileList';
    description: string = 'Команда получения списка всех принятых файлов';

    /**
     * Обработка команды
     *
     */
    protected action = () => {
        let server = new GetFileListService();
        let result = server.goSignal();

        console.log(result);
    };
}

export default GetFileListCommand;
