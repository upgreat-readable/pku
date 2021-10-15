import fs from 'fs';

import { logPersistenceFile } from '../config';
import LogEntriesWithPositionsToMark from '../types/LogEntriesWithPositionsToMark';
import LogEntriesWithPositionToMark from '../types/LogEntriesWithPositionToMark';

class LogPersistenceService {
    private static readonly sentMark = '### logs sent ###\n';

    /**
     * Получить не отправленные ранее записи логов за день
     *
     * @param day
     */
    public static getUnsentDayLogEntries(day: string): LogEntriesWithPositionsToMark {
        const serverEntries = this.getUnsentLogEntries(`logs/${day}/server-${logPersistenceFile}`);
        const clientEntries = this.getUnsentLogEntries(`logs/${day}/client-${logPersistenceFile}`);

        return {
            entries: [...serverEntries.entries, ...clientEntries.entries],
            serverPosition: serverEntries.position,
            clientPosition: clientEntries.position,
        };
    }

    /**
     * Пометить записи в логах, которые были отправлены
     *
     * @param day
     * @param serverPosition
     * @param clientPosition
     */
    public static placeSentMarks(day: string, serverPosition: number, clientPosition: number) {
        this.placeSingleSentMark(`logs/${day}/server-${logPersistenceFile}`, serverPosition);
        this.placeSingleSentMark(`logs/${day}/client-${logPersistenceFile}`, clientPosition);
    }

    /**
     * Получить не отправленные ранее записи лога
     *
     * @param logPath
     * @private
     */
    private static getUnsentLogEntries(logPath: string): LogEntriesWithPositionToMark {
        if (!fs.existsSync(logPath)) {
            return { entries: [], position: -1 };
        }

        const content = fs.readFileSync(logPath).toString();
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
     * Пометить записи в логе, которые были отправлены
     *
     * @param logPath
     * @param position
     * @private
     */
    private static placeSingleSentMark(logPath: string, position: number) {
        if (!fs.existsSync(logPath)) {
            return;
        }

        const content = fs.readFileSync(logPath).toString();
        const markedContent = content.substring(0, position) + this.sentMark + content.substring(position);

        fs.writeFileSync(logPath, markedContent);
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
