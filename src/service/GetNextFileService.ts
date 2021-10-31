import fs from 'fs';
import path from 'path';

import logger from '../logger';
import LoggingService from './LoggingService';

// noinspection JSUnfilteredForInLoop
export class GetNextFileService {
    protected lastFileName: any;

    public getFileName() {
        const file = this.goSignal();

        return file.toString().split('.')[0];
    }

    goSignal() {
        try {
            const dirPath = 'files/in/';
            this.lastFileName = GetNextFileService.getMostRecentFile(dirPath);

            if (this.lastFileName) {
                return this.lastFileName.file;
            } else {
                return 'Последний полученный файл не был найден.';
            }
        } catch (e) {
            LoggingService.process(logger, { level: 'error', message: e.message, trace: e.trace, group: 'file' });
            return 'Во время получения файла произошла ошибка';
        }
    }

    private static getMostRecentFile = (dir: string) => {
        const files = GetNextFileService.orderReccentFiles(dir);
        return files.length ? files[0] : undefined;
    };

    private static orderReccentFiles = (dir: string) => {
        return fs
            .readdirSync(dir)
            .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
            .filter(file => !/(^|\/)\.[^\/\.]/g.test(file))
            .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
            .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    };
}
