import fs from 'fs';
import { File } from '../files/File';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';
import { blobSelections } from '../DemoSelectionExamples';

export class DemoMoveFileService {
    protected file: File;

    constructor(file: File) {
        this.file = file;
    }

    public moveAction() {
        let fileContent = this.file.getJson();
        // @ts-ignore
        const selectionExample: any = blobSelections[fileContent.meta.subject];
        fileContent.selections = [];
        fileContent.selections.push(selectionExample);

        fs.writeFileSync('files/out/' + this.file.id + '.json', JSON.stringify(fileContent));

        const client = new IPCClient();
        client.connect().then(() => {
            client.sendMessage(IPCServer.sendFileEvent, {
                fileId: this.file.id,
                content: this.getFileContentOut(),
            });
            client.disconnect();
        });
    }

    getFileContentOut() {
        return fs.readFileSync('files/out/' + this.file.id + '.json', 'utf8');
    }
}
