import AbstractCommand from './interface/AbstractCommand';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';
import logger from '../logger';

/**
 * Команда остановки сессии
 */
class StopCommand extends AbstractCommand {
    name: string = 'stop';
    description: string = 'Команда завершения сессии';
    alias: string = 'endSession';

    /** Обработка команды */
    protected action = async () => {
        const client = new IPCClient();
        client.log(IPCServer.sessionStopEvent);

        await new Promise(resolve => {
            const client = new IPCClient();
            client.log(IPCServer.sessionStopEvent);
            client.connect().then((connection: any) => {
                connection.on('start-feedback-to-command', () => {
                    logger.info('The session was successfully terminated.');
                    resolve();
                    client.disconnect();
                });
            });
            client.sendMessage(IPCServer.sessionStopEvent);
        });
    };
}

export default StopCommand;
