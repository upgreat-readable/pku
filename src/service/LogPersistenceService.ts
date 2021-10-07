import { LogEntry } from 'winston';
import fs from 'fs';

import { logPersistenceFile } from '../config';
import LogEntriesWithPositionToMark from '../types/LogEntriesWithPositionToMark';

class LogPersistenceService {
    private static readonly sentMark = '### logs sent ###\n';

    public async getUnsentEntries(from: Date): Promise<Array<LogEntry>> {
        const logEntries = LogPersistenceService.getUnsentLogEntries();

        return logEntries.entries.filter(entry => new Date(entry.timestamp) > from);
    }

    public async trimLog(to: Date): Promise<void> {
        const logEntries = LogPersistenceService.getUnsentLogEntries();

        const dataToKeep = logEntries.entries
            .filter(entry => new Date(entry.timestamp) > to)
            .map(entry => JSON.stringify(entry))
            .join('\n');

        fs.writeFileSync(`logs/${logPersistenceFile}`, dataToKeep);
    }

    public static getUnsentLogEntries(sessionId: number | null = null): LogEntriesWithPositionToMark {
        const content = fs.readFileSync(this.getLogPath(sessionId)).toString();
        const markIndex = content.lastIndexOf(this.sentMark);
        const unsentContent = markIndex === -1 ? content : content.substring(markIndex + this.sentMark.length);

        const entries = unsentContent
            .replace(/\}\{/g, '}\n{')
            .split('\n')
            .filter(Boolean)
            .map(LogPersistenceService.parseLine)
            .filter(entry => entry.timestamp);

        return {
            entries,
            position: content.length,
        };
    }

    /**
     * Пометить записи, которые были отправлены
     *
     * @param sessionId
     * @param position
     */
    public static placeSentMark(sessionId: number | null = null, position: number) {
        const logPath = this.getLogPath(sessionId);

        const content = fs.readFileSync(logPath).toString();
        const markedContent = content.substring(0, position) + this.sentMark + content.substring(position);

        fs.writeFileSync(logPath, markedContent);
    }

    private static getLogPath(sessionId: number | null = null): string {
        if (sessionId === null) {
            return `logs/${logPersistenceFile}`;
        }

        return `logs/sessions/${sessionId}/${logPersistenceFile}`;
    }

    private static parseLine(line: string): any {
        try {
            return JSON.parse(line);
        } catch (e) {
            return {};
        }
    }
}

export default LogPersistenceService;
