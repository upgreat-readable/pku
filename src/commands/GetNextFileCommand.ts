import { Command } from 'commander';
import AbstractCommand from './interface/AbstractCommand';
import { GetNextFileService } from '../service/GetNextFileService';

/**
 * Команда критериев
 * Возвращает json расчет критериев из пакета критериев
 */
class GetNextFileCommand extends AbstractCommand {
    name: string = 'getNextFile';
    description: string = 'Команда получения имени последнего принятого файла';

    /**
     * Обработка команды
     *
     */
    protected action = () => {
        let server = new GetNextFileService();
        let result = server.goSignal();

        console.log(result);
    };
}

export default GetNextFileCommand;
