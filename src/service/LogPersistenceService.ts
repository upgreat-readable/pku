import { LogEntry } from 'winston';
import fs from 'fs';

import { logPersistencePath, userToken } from '../config';

class LogPersistenceService {
    public async getEntries(from: Date): Promise<Array<LogEntry>> {
        return fs
            .readFileSync(logPersistencePath)
            .toString()
            .split('\n')
            .filter(Boolean)
            .map(LogPersistenceService.parseLine)
            .filter(entry => entry.timestamp)
            .filter(entry => new Date(entry.timestamp) > from)
            .map(entry => ({ ...entry, token: userToken }));
    }

    public async trimLog(to: Date): Promise<void> {
        const dataToKeep = fs
            .readFileSync(logPersistencePath)
            .toString()
            .split('\n')
            .filter(Boolean)
            .map(LogPersistenceService.parseLine)
            .filter(entry => entry.timestamp)
            .filter(entry => new Date(entry.timestamp) > to)
            .map(entry => JSON.stringify(entry))
            .join('\n');

        fs.writeFileSync(logPersistencePath, dataToKeep);
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
