import AbstractCommand from './interface/AbstractCommand';
import IPCClient from '../connections/IPCClient';
import { Command } from 'commander';
import fs from 'fs';
import { IPCServer } from '../connections/IPCServer';
import CliException from '../exceptions/CliException';

/**
 * Команда отправки файла
 */
class SendFileCommand extends AbstractCommand {
    name: string = 'send';
    description: string = 'Команда отправки файла';
    alias: string = 'sendFile';

    protected bindOptions(command: Command) {
        command.option('--fileId <fileId>', 'file id', /^\d+$/);
    }

    /** Обработка команды */
    protected action = (options: FileOptions) => {
        try {
            // @ts-ignore
            this.getFileContent(options.fileId);
        } catch (e) {
            throw new CliException('Указанный файл не существует.');
        }

        this.validateOptions(options);

        const client = new IPCClient();
        client.sendMessage(IPCServer.sendFileEvent, {
            fileId: options.fileId, // @ts-ignore
            content: this.getFileContent(options.fileId),
        });
    };

    getFileContent(fileId: string | number): string {
        return fs.readFileSync('files/out/' + fileId + '.json', 'utf8');
    }

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

export default SendFileCommand;
