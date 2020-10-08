import { Command } from 'commander';
import AbstractCommand from './interface/AbstractCommand';
import CriteriaService from '../service/CriteriaService';
import CliException from '../exceptions/CliException';
import fs from 'fs';
import { FileCollection } from '../files/FileCollection';
import logger from '../logger';

/**
 * Команда критериев
 * Возвращает json расчет критериев из пакета критериев
 */
class CriteriaCommand extends AbstractCommand {
    name: string = 'criteria';
    description: string = 'Команда расчета критериев';

    protected bindOptions(command: Command) {
        command.option('--fileId <fileId>', 'id файла в папке files/custom');
        command.option(
            '--filePath <filePath>',
            'путь к файлу относительно папки files | --filePath myDir/filepathWithExtension.json'
        );
        command.option(
            '--dir <dir>',
            'параметр директории, из которой необходимо считывать файлы',
            'files/custom/'
        );
        command.option(
            '--save <save>',
            'параметр, позволяющий сохранить результаты расчёта критериев в отдельный файл',
            false
        );
    }

    /**
     * Обработка команды
     *
     * Логика обработки файла оставлена в команде
     * чтобы не делать роутинг в сервисе из нескольких источников
     * - путь к файлу
     * - json
     * - id
     *
     * @param options
     */
    protected action = (options: FileOptions) => {
        this.validateOptions(options);
        try {
            let fileCollection = new FileCollection(options);
            let fileJsonContent = fileCollection.getFirst().getJson();
            let saveString = fileCollection.getFirst().getPath();

            if (!saveString) {
                saveString = 'files/custom/temp.json';
                console.log(
                    'Не удалось отрезолвить путь к файлу. Результат последнего расчёта будет сохранен в files/custom/temp.json'
                );
            }

            const service = new CriteriaService(fileJsonContent);

            //@ts-ignore
            if (options.save) {
                fileJsonContent.criteria = JSON.parse(service.getResult());
                fs.writeFileSync(saveString, JSON.stringify(fileJsonContent));

                console.log('Результат записан в ' + saveString);
            } else {
                console.log(service.getResult());
            }
        } catch (e) {
            // logger.error('Пакет критериев - ошибка' + e.message)
            console.log('Во время расчёта критериев произошла ошибка.' + '\n' + e.message);
            process.exit(1);
        }
    };

    protected validateOptions(options: FileOptions) {
        if (!options.fileId) {
            throw new CliException('Обязательный параметр --fileId не был заполнен.');
        }

        // @ts-ignore
        const fileId = parseInt(options.fileId);
        if (fileId <= 0 || isNaN(fileId)) {
            throw new CliException('параметр fileId должен быть числом');
        }
    }
}

export default CriteriaCommand;
