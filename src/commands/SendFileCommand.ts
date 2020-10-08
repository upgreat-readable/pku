import AbstractCommand from './interface/AbstractCommand';
import IPCClient from '../connections/IPCClient';
import { Command } from 'commander';
import fs from 'fs';
import { IPCServer } from '../connections/IPCServer';

/**
 * Команда отправки файла
 */
class SendFileCommand extends AbstractCommand {
    name: string = 'send';
    description: string = 'Команда отправки файла';
    alias: string = 'sendFile';

    protected bindOptions(command: Command) {
        command.option('--fileId <fileId>', 'file id', /\d{6}/);
    }

    /** Обработка команды */
    protected action = (options: FileOptions) => {
        const client = new IPCClient();
        client.sendMessage(IPCServer.sendFileEvent, {
            fileId: options.fileId, // @ts-ignore
            content: this.getFileContent(options.fileId),
        });
    };

    getFileContent(fileId: string | number): string {
        return fs.readFileSync('files/out/' + fileId + '.json', 'utf8');
    }
}

export default SendFileCommand;
