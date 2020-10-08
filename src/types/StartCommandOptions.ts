interface StartOptions {
    mode: string;
    type: string;
    lang: string;
    time?: number;
    count?: string;
}

interface StartCommandOptions extends StartOptions {
    demo?: boolean;
    debug?: boolean;
    isReconnect?: boolean;
}
