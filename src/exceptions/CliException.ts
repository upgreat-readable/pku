/**
 * Базовый класс исключений
 *
 * Позволит обрабатывать ошибки разными способами.
 * Помимо вывода в stderr можно выводить в json формате при наличии флага
 */
class CliException extends Error {
    public code: string | number | undefined | null;

    constructor(message: string, code?: string | number | undefined | null) {
        super(message);
        Object.setPrototypeOf(this, CliException.prototype);

        this.code = code;
        this.message = message;
        CliException.showMessage(message);

        // принудительно выходим чтобы не вывелся стандартный trace
        process.exit();
    }

    private static showMessage(message: string) {
        console.error('Ошибка: ' + message);
    }
}

export default CliException;
