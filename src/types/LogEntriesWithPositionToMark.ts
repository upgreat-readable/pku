import { LogEntry } from 'winston';

export default interface LogEntriesWithPositionToMark {
    /** Записи лога */
    entries: Array<LogEntry>;
    /**
     * Позиция в логе после последней полученной записи
     *
     * Нужна, чтобы пометить отправленные записи.
     */
    position: number;
}
