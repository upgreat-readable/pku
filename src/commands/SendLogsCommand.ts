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
        command.requiredOption('--date <date>', 'дата в формате ISO', /^\d{4}-\d\d-\d\d$/);
    }

    /**
     * Обработка команды
     */
    protected action = async (options: SendLogsCommandOptions) => {
        await new Promise(resolve => {
            this.validateOptions(options);

            const hasFile = fs.existsSync(`logs/${options.date}/${logPersistenceFile}`);

            let logEntries: LogEntriesWithPositionToMark = { entries: [], position: -1 };
            if (hasFile) {
                logEntries = LogPersistenceService.getUnsentLogEntries(options.date);
            }

            if (!hasFile || logEntries.entries.length === 0) {
                Message.fromDictionary({ type: 'error', message: 'message.logs.not-found' }).setLogger(CommandLogger).show();
                throw new CliException(`Не найдены логи для отправки на сервер для даты ${options.date}.`);
            }

            const client = new IPCClient();
            client.connect().then((connection: any) => {
                connection.on('message.logs', (messageData: MessageData) => {
                    if (messageData.message === 'message.logs.success') {
                        LogPersistenceService.placeSentMark(options.date, logEntries.position);
                    }

                    Message.fromDictionary(messageData).setLogger(CommandLogger).show();

                    resolve();
                    client.disconnect();

                    if (messageData.message === 'message.logs.success') {
                        process.exit(0);
                    }
                });

                client.sendMessage(IPCServer.sendLogsEvent, {
                    date: options.date,
                    content: logEntries.entries,
                });
            });
        });
    };

    protected validateOptions(options: SendLogsCommandOptions) {
        if (new Date(options.date).toISOString().substring(0, 10) !== options.date) {
            throw new CliException('параметр date должен быть датой в формате ISO');
        }
    }
}

export default SendLogsCommand;
