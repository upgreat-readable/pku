import fs from 'fs';
import { File } from '../files/File';
import IPCClient from '../connections/IPCClient';
import { IPCServer } from '../connections/IPCServer';
import { blobSelections } from '../DemoSelectionExamples';
import CliException from '../exceptions/CliException';
import MessageData from '../types/Message';
import Message from '../messages';
import { CommandLogger } from '../logger';
import RootIPC from 'node-ipc';
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
