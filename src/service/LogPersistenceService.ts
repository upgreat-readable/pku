import { LogEntry } from 'winston';
import fs from 'fs';

import { logPersistencePath } from '../config';

class LogPersistenceService {
    public async getEntries(from: Date): Promise<Array<LogEntry>> {
        const logEntries = await LogPersistenceService.getLogEntries();

        return logEntries.filter(entry => new Date(entry.timestamp) > from);
    }

    public async trimLog(to: Date): Promise<void> {
        const logEntries = await LogPersistenceService.getLogEntries();

        const dataToKeep = logEntries
            .filter(entry => new Date(entry.timestamp) > to)
            .map(entry => JSON.stringify(entry))
            .join('\n');

        fs.writeFileSync(logPersistencePath, dataToKeep);
    }

    private static async getLogEntries(): Promise<Array<LogEntry>> {
        return fs
            .readFileSync(logPersistencePath)
            .toString()
            .split('\n')
            .filter(Boolean)
            .map(LogPersistenceService.parseLine)
            .filter(entry => entry.timestamp);
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
