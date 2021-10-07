import { Command } from 'commander';
import fs from 'fs';

import AbstractCommand from './interface/AbstractCommand';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';
import CliException from '../exceptions/CliException';
import MessageData from '../types/Message';
import Message from '../messages';
import { CommandLogger } from '../logger';
import { logPersistenceFile } from '../config';
import LogPersistenceService from '../service/LogPersistenceService';
import LogEntriesWithPositionToMark from '../types/LogEntriesWithPositionToMark';

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

            let logEntries: LogEntriesWithPositionToMark = { entries: [], position: -1 };
            if (hasFile) {
                logEntries = LogPersistenceService.getUnsentLogEntries(options.sessionId);
            }

            if (!hasFile || logEntries.entries.length === 0) {
                Message.fromDictionary({ type: 'error', message: 'message.logs.not-found' }).setLogger(CommandLogger).show();
                throw new CliException(`Не найдены логи для отправки на сервер для сессии ${options.sessionId}.`);
            }

            const client = new IPCClient();
            client.connect().then((connection: any) => {
                connection.on('message.logs', (messageData: MessageData) => {
                    if (messageData.message === 'message.logs.success') {
                        LogPersistenceService.placeSentMark(options.sessionId, logEntries.position);
                    }

                    Message.fromDictionary(messageData).setLogger(CommandLogger).show();

                    resolve();
                    client.disconnect();

                    if (messageData.message === 'message.logs.success') {
                        process.exit(0);
                    }
                });

                client.sendMessage(IPCServer.sendLogsEvent, {
                    sessionId: options.sessionId,
                    content: logEntries.entries,
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
