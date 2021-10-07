import { Command } from 'commander';
import fs from 'fs';
import { LogEntry } from 'winston';

import AbstractCommand from './interface/AbstractCommand';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';
import CliException from '../exceptions/CliException';
import MessageData from '../types/Message';
import Message from '../messages';
import { CommandLogger } from '../logger';
import { logPersistenceFile } from '../config';
import LogPersistenceService from '../service/LogPersistenceService';

/**
 * Команда отправки логов
 */
class SendLogsCommand extends AbstractCommand {
    name: string = 'sendLogs';

    description: string = 'Команда отправки логов';

    protected bindOptions(command: Command) {
        command.requiredOption('--sessionId <sessionId>', 'ID сессии', /^\d+$/);
    }

    /**
     * Обработка команды
     */
    protected action = async (options: SendLogsCommandOptions) => {
        await new Promise(resolve => {
            this.validateOptions(options);

            const hasFile = fs.existsSync(`logs/sessions/${options.sessionId}/${logPersistenceFile}`);

            let logEntries: LogEntry[] = [];
            if (hasFile) {
                logEntries = LogPersistenceService.getLogEntries(options.sessionId);
            }

            if (!hasFile || logEntries.length === 0) {
                Message.fromDictionary({ type: 'error', message: 'message.logs.not-found' }).setLogger(CommandLogger).show();
                throw new CliException(`Не найдены логи для отправки на сервер для сессии ${options.sessionId}.`);
            }

            const client = new IPCClient();
            client.connect().then((connection: any) => {
                connection.on('message.logs', (messageData: MessageData) => {
                    Message.fromDictionary(messageData).setLogger(CommandLogger).show();

                    resolve();
                    client.disconnect();
                });

                client.sendMessage(IPCServer.sendLogsEvent, {
                    sessionId: options.sessionId,
                    content: logEntries,
                });
            });
        });
    };

    protected validateOptions(options: SendLogsCommandOptions) {
        const sessionId = parseInt(options.sessionId.toString(), 10);
        if (sessionId < 0 || Number.isNaN(sessionId)) {
            throw new CliException('параметр sessionId должен быть неотрицательным числом');
        }
    }
}

export default SendLogsCommand;
