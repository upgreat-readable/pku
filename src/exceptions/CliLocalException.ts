import CliException from './CliException';

/**
 * Класс исключений, который не пишет ничего в логи
 */
class CliLocalException extends CliException {
    protected static showMessage(message: string) {
        // eslint-disable-next-line no-console
        console.log(`Ошибка: ${message}`);
    }
}

export default CliLocalException;
