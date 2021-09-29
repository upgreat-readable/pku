import { Logger } from 'winston';

import messagesConsole from './console';
import CliException from '../exceptions/CliException';
import MessageData from '../types/Message';
import logger from '../logger';
import LoggingService from '../service/LoggingService';

const dictionary = { ...messagesConsole };

/**
 * Класс для рендера сообщений
 *
 * рендерит в консоль
 * обрабатывает исходные параметры
 * ищет в справочнике
 */
class Message implements MessageData {
    private loggingService: LoggingService = new LoggingService();

    type: string = 'info';
    message: string;
    source: any;
    logger: Logger = logger;

    constructor(params: MessageData) {
        this.message = params.message;
        this.source = params.source;
        if (params.type) {
            this.type = params.type;
        }
    }

    static fromDictionary(params: MessageData) {
        // @ts-ignore
        let dictionaryMessage = dictionary[params.message];
        const currentParams = Object.assign({}, params);

        if (!dictionaryMessage) {
            throw new CliException('Не существующий ключ сообщения ' + params.message);
        }

        currentParams.message = dictionaryMessage;

        return new Message(currentParams);
    }

    public show() {
        if (this.source) {
            this.loggingService.process(this.logger, { level: this.type, message: `${this.message} ${JSON.stringify(this.source)}` });
            return;
        }

        this.loggingService.process(this.logger, { level: this.type, message: this.message });
    }

    public setLogger(logger: Logger) {
        this.logger = logger;
        return this;
    }
}

export default Message;
