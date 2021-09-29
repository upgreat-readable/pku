import RootIPC from 'node-ipc';
import fs from 'fs';

import { File } from '../files/File';
import { IPCServer } from '../connections/IPCServer';
import { blobSelections } from '../DemoSelectionExamples';
import { IPCServerName, socketPath } from '../config';

export class DemoMoveFileService {
    protected file: any;

    constructor(file: any) {
        this.file = new File({ fileId: file.fileId, filePath: '', dir: 'files/in/' });
    }

    /** Обработка команды */
    public moveAction() {
        let fileContent = this.file.getJson();
        // @ts-ignore
        const selectionExample: any = blobSelections[fileContent.meta.subject];
        fileContent.selections = [];
        fileContent.selections.push(selectionExample);

        fs.writeFileSync('files/out/' + this.file.id + '.json', JSON.stringify(fileContent));

        RootIPC.connectTo(IPCServerName, socketPath, () => {
            RootIPC.of.world.emit(IPCServer.sendFileEvent, {
                fileId: this.file.id,
                content: this.getFileContentOut(),
            });
        });
    }

    getFileContentOut() {
        return fs.readFileSync('files/out/' + this.file.id + '.json', 'utf8');
    }
}
