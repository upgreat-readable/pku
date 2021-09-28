import { LogEntry } from 'winston';
import fs from 'fs';

import { logPersistencePath } from '../config';

class LogPersistenceService {
    public async getEntries(from: Date): Promise<Array<LogEntry>> {
        return fs
            .readFileSync(logPersistencePath)
            .toString()
            .split('\n')
            .filter(Boolean)
            .map(line => JSON.parse(line))
            .filter(entry => new Date(entry.timestamp) > from);
    }

    public async trimLog(to: Date): Promise<void> {
        const dataToKeep = fs
            .readFileSync(logPersistencePath)
            .toString()
            .split('\n')
            .filter(Boolean)
            .map(line => JSON.parse(line))
            .filter(entry => new Date(entry.timestamp) > to)
            .map(entry => JSON.stringify(entry))
            .join('\n');

        fs.writeFileSync(logPersistencePath, dataToKeep);
    }
}

export default LogPersistenceService;
