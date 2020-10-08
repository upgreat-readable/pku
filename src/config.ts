export const socketPath = '/tmp/ipc.sock';
export const IPCServerName = 'world';
export const logFormat = process.env.LOG_FORMAT;
export const isDebug = process.env.DEBUG_FLAG;

// События
const WSClientEvents = {
    sendFile: 'session-file-send',
    abort: 'session-client-abort',
};
