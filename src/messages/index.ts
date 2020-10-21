import console from './console';
import CliException from '../exceptions/CliException';
import MessageData from '../types/Message';
import logger from '../logger';
import { Logger } from 'winston';

const dictionary = { ...console };

/**
 * Класс для рендера сообщений
 *
 * рендерит в консоль
 * обрабатывает исходные параметры
 * ищет в справочнике
 */
class Message implements MessageData {
    type: string | undefined = 'info';
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
        // @ts-ignore
        const loggerMethod = this.logger[this.type];

        if (this.source) {
            loggerMethod(this.message, this.source);
            return;
        }

        loggerMethod(this.message);
    }

    public setLogger(logger: Logger) {
        this.logger = logger;
        return this;
    }
}

export default Message;
