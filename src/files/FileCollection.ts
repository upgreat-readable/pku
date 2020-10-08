import { File } from './File';

export class FileCollection {
    public files: Array<File> = [] as Array<File>;
    protected dir: string | undefined;
    protected fileOptions: FileOptions;

    constructor(fileOptions: FileOptions) {
        this.fileOptions = fileOptions;
        this.makeFromOptions();
    }

    protected makeFromOptions() {
        if (this.fileOptions.filePath) {
            this.compileFilesByFilePath();
        } else {
            this.dir = this.fileOptions.dir;
            this.compileFilesByDir();
        }
    }

    private compileFilesByDir() {
        if (!Array.isArray(this.fileOptions.fileId)) {
            //@ts-ignore
            this.files.push(new File(this.fileOptions));
        } else {
            this.fileOptions.fileId.forEach((value, index, array) => {
                this.files.push(
                    new File({ fileId: value, filePath: '', dir: this.fileOptions.dir })
                );
            });
        }
    }

    private compileFilesByFilePath() {
        if (!Array.isArray(this.fileOptions.filePath)) {
            //@ts-ignore
            this.files.push(new File(this.fileOptions));
        } else {
            this.fileOptions.filePath.forEach((value, index, array) => {
                this.files.push(new File({ fileId: '', filePath: value, dir: '' }));
            });
        }
    }

    public getFirst() {
        return this.files[0];
    }
}
