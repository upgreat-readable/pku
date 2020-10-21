#!/usr/local/bin/node
import IPCServer from './connections/IPCServer';
import * as cluster from 'cluster';

/**
 * Если это мастер процесс — то создается форк.
 * Сервер-процесс IPC поднимаем на форкнутом процессе.
 */
// if (cluster.isMaster) {
//     cluster.fork();
// } else {
//     const server = new IPCServer();
// }

const server = IPCServer.run();
