import RootIPC from 'node-ipc';
import fs from 'fs';
import logger from '../logger';
import { File } from '../files/File';
import CliException from '../exceptions/CliException';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';

const socketPath = '/tmp/ipc.sock';
export class DemoMoveFileService {
    protected file: File;

    constructor(file: File) {
        this.file = file;
    }

    public moveAction() {
        let fileContent = this.file.getJson();
        fileContent.selections = [];
        fileContent.selections.push({
            id: 592,
            startSelection: 10,
            endSelection: 20,
            type: 'ЛМНЕНИЕ',
            comment: '',
            explanation:
                'Личное мнение. Автор не приводит свое мнение, а дает рекомендации , что делать .',
            correction: '',
            tag: '',
            group: 'meaning',
            subtype: '',
        });

        fs.writeFileSync('files/out/' + this.file.id, JSON.stringify(fileContent));

        const client = new IPCClient();
        client.sendMessage(IPCServer.sendFileEvent, {
            fileId: this.file.id,
            content: this.getFileContentOut(),
        });
    }

    getFileContentOut() {
        return fs.readFileSync('files/out/' + this.file.id, 'utf8');
    }
}
