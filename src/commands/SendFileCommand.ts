import { Command } from 'commander';
import fs from 'fs';

import AbstractCommand from './interface/AbstractCommand';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';
import CliException from '../exceptions/CliException';
import MessageData from '../types/Message';
import Message from '../messages';
import { CommandLogger } from '../logger';
import LoggingService from '../service/LoggingService';

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
    protected action = async (options: FileOptions) => {
        await new Promise(resolve => {
            try {
                // @ts-ignore
                this.getFileContent(options.fileId);
            } catch (e) {
                LoggingService.prototype.process(CommandLogger, { level: 'error', message: 'Ошибка отправки файла' });
                throw new CliException('Указанный файл не существует.');
            }
            this.validateOptions(options);

            const client = new IPCClient();
            client.connect().then((connection: any) => {
                connection.on('message.file', (messageData: MessageData) => {
                    Message.fromDictionary(messageData).setLogger(CommandLogger).show();

                    resolve();
                    client.disconnect();
                });

                client.sendMessage(IPCServer.sendFileEvent, {
                    fileId: options.fileId, // @ts-ignore
                    content: this.getFileContent(options.fileId),
                });
            });
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
