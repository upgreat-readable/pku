import fs from 'fs';
import logger from '../logger';

export class File {
    public id?: string | number | Array<string>;
    public path?: string;
    public dir?: string;
    public jsonFileContent: object;

    constructor(file: { fileId?: string; filePath?: string; dir?: string }) {
        // @ts-ignore
        this.id = file.fileId.toString();
        this.dir = file.dir;
        this.path = file.filePath;

        if (this.id && this.dir && (!this.path || this.path === '')) {
            this.path = this.dir + this.id + '.json';
        }

        this.jsonFileContent = this.getJson();
    }

    public getPath() {
        return this.path;
    }

    public getId() {
        return this.id;
    }

    public getJson() {
        try {
            if (this.path)
                return JSON.parse(
                    // @ts-ignore
                    fs.readFileSync(this.path.toString(), 'utf8')
                );
        } catch (e) {
            console.log(e.message);
        }
    }

    public setJson(jsonFileContent: object) {
        this.jsonFileContent = jsonFileContent;
    }

    public isExist() {
        // @ts-ignore
        return fs.existsSync(this.path.toString());
    }

    public save(newPath?: string) {
        try {
            if (newPath) {
                fs.writeFileSync(newPath + this.id + '.json', JSON.stringify(this.jsonFileContent));
            } else {
                // @ts-ignore
                fs.writeFileSync(this.path.toString(), JSON.stringify(this.jsonFileContent));
            }
        } catch (e) {
            logger.error('файл ' + this.id + ' не был сохранен с ошибкой' + e.message);
        }
    }
}
