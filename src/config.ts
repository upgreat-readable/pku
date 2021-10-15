export const socketPath = '/tmp/ipc.sock';
export const IPCServerName = 'world';
export const logFormat = process.env.LOG_FORMAT;
export const isDebug = process.env.DEBUG_FLAG;
export const logPersistenceFile = 'persistence.log';

export const debugLink = process.env.DEBUG_ADDRESS;
export const link = debugLink ? debugLink : 'https://ds.readable.upgreat.one/pku';
export const userToken = process.env.USER_TOKEN;
