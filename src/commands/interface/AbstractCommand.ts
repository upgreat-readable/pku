import { ICommand } from './ICommand';
import { CommanderStatic, Command } from 'commander';

/**
 * Абстрактная команда
 *
 * Используется для простых команд, не нуждающихся в unix коннекте
 * к демонизированному процессу
 */
abstract class AbstractCommand implements ICommand {
    abstract name: string;
    abstract description: string;
    alias: string = '';

    /** Биндинг коммандера */
    public bind(commander: Command) {
        // @ts-ignore
        const command: Command = commander
            .command(this.name)
            .description(this.description)
            .option('-d,--debug', 'output options');

        if (this.alias && this.alias.length > 0) {
            command.alias(this.alias);
        }

        this.bindOptions(command);

        command.action(this.action);
    }

    /** Биндинг параметров */
    protected bindOptions(command: Command) {}

    /**
     * Метод для реализации основной функции команды
     * @protected
     */
    protected abstract action(options: object): void;
}

export default AbstractCommand;
