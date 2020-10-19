import AbstractCommand from './interface/AbstractCommand';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';
import { ConsoleGlossary } from '../glossary/ConsoleGlossary';

/**
 * Команда остановки сессии
 * Возвращает json расчет критериев из пакета критериев
 */
class StopCommand extends AbstractCommand {
    name: string = 'stop';
    description: string = 'Команда завершения сессии';
    alias: string = 'endSession';
    commandStatus: boolean | string = false;
    commandDelay: number = 10000;
    commandKeyToGlossary: string = IPCServer.sessionStopEvent + '-';

    /** Обработка команды */
    protected action = () => {
        const client = new IPCClient();
        client.setConfigSilent();
        client.sendToLogMessage(IPCServer.sessionStopEvent);

        client.connect(() => {
            client.on('connect', () => {
                this.stopHandler(client);
            });
        });
    };

    protected stopHandler(client: IPCClient) {
        client.emit(IPCServer.sessionStopEvent, {});
        client.on('stop-feedback-to-command', (data: any) => {
            this.commandStatus = data;
        });
        client.sleep(this.commandDelay).then(() => {
            if (typeof this.commandStatus === 'string') {
                console.log(JSON.parse(this.commandStatus).message);
            } else {
                this.commandKeyToGlossary =
                    this.commandKeyToGlossary + this.commandStatus.toString();
                //@ts-ignore
                console.log(ConsoleGlossary[this.commandKeyToGlossary]);
            }
            client.disconnect();
        });
    }
}

export default StopCommand;
