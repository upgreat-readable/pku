import { LogEntry } from 'winston';

export default interface LogEntriesWithPositionsToMark {
    /** Записи логов */
    entries: Array<LogEntry>;

    /**
     * Позиции в логах после последних полученных записей
     *
     * Нужны, чтобы пометить отправленные записи.
     */
    serverPosition: number;
    clientPosition: number;
}
