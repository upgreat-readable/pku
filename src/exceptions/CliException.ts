/**
 * Базовый класс исключений
 *
 * Позволит обрабатывать ошибки разными способами.
 * Помимо вывода в stderr можно выводить в json формате при наличии флага
 */
import LoggingService from '../service/LoggingService';
import logger from '../logger';

class CliException extends Error {
    public code: string | number | undefined | null;

    constructor(message: string, code?: string | number | undefined | null) {
        super(message);
        Object.setPrototypeOf(this, CliException.prototype);

        this.code = code;
        this.message = message;
        CliException.showMessage(message);

        // принудительно выходим чтобы не вывелся стандартный trace
        process.exit(1);
    }

    protected static showMessage(message: string) {
        LoggingService.process(logger, { level: 'error', message: `Ошибка: ${message}`, group: 'exceptions' });
    }
}

export default CliException;
