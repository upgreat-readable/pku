import fs from 'fs';

import { logPersistenceFile } from '../config';
import LogEntriesWithPositionToMark from '../types/LogEntriesWithPositionToMark';

class LogPersistenceService {
    private static readonly sentMark = '### logs sent ###\n';

    public static getUnsentLogEntries(day: string): LogEntriesWithPositionToMark {
        const content = fs.readFileSync(`logs/${day}/${logPersistenceFile}`).toString();
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
     * @param day
     * @param position
     */
    public static placeSentMark(day: string, position: number) {
        const logPath = `logs/${day}/${logPersistenceFile}`;

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
