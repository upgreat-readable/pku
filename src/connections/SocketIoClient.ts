import io from 'socket.io-client';
import logger from '../logger';
import fs from 'fs';

export class SocketIoClient {
    isConnected: boolean = false;

    // @ts-ignore
    socket: SocketIOClient.Socket;

    public connect() {
        let { link, userToken } = this.getEnvVariable();

        if (!userToken) {
            // @todo заменить на более безобидный вариант или отловить
            throw new Error('из env не был получен токен юзера');
        }

        this.socket = io.connect(link, {
            secure: true,
            rejectUnauthorized: false,
            query: {
                token: userToken,
            },
            transports: ['websocket'],
        });
        this.handleRemoteEvents();
    }

    public disconnect() {
        this.socket.disconnect();
    }

    public send(eventName: string, data: object = {}) {
        this.socket.emit(eventName, data);
    }

    private getEnvVariable = () => {
        let debugLink = process.env.DEBUG_ADDRESS;
        let link = debugLink ? debugLink : 'https://ds.readable.upgreat.one/pku';
        let userToken = process.env.USER_TOKEN;
        return {
            link,
            userToken,
        };
    };

    /**
     * Обработка событий инициированных удаленным сервером
     */
    private handleRemoteEvents() {
        this.socket
            .on('connection', () => {
                logger.info('connected to web socket server');
                this.isConnected = true;
            })
            .on('disconnect', () => {
                logger.info('disconnect web socket server');
                this.isConnected = false;
            })
            .on('connect_error', () => {
                logger.debug('connect_error');
            })
            .on('connect_timeout', () => {
                logger.debug('connect_timeout');
            })
            .on('reconnect_attempt', () => {
                logger.debug('reconnect_attempt');
            })
            .on('reconnecting', () => {
                logger.debug('reconnecting');
            })
            .on('connection-auth-error', (data: any) => {
                logger.error(
                    'connection-auth-error - Произошла ошибка авторизации по токену' +
                        JSON.stringify(data)
                );
                // @todo remove active|id
            })
            .on('session-file-available', (data: any) => {
                logger.info(`Стал доступен файл ${data.fileId} в сессии @todo`);
                this.saveFile(data);
            })

            // ABORT
            .on('session-client-abort-success', (data: any) => {
                logger.info('session-client-abort-success' + JSON.stringify(data));
                // @todo remove active|id
            })
            .on('session-client-abort-error', (data: any) => {
                logger.error('session-client-abort-error' + JSON.stringify(data));
                // @todo remove active|id
            })

            // START
            .on('session-start-error', (data: any): never | any => {
                logger.error('При старте сессии произошла ошибка ' + JSON.stringify(data));
                // @todo remove active|id
            })

            // RECONNECT
            .on('session-reconnect-error', (data: any): never | any => {
                logger.info('Не удалось переподключится к сессии ' + JSON.stringify(data));
                // @todo remove active|id
            });
    }

    // noinspection JSMethodCanBeStatic
    private saveFile(data: any) {
        try {
            fs.writeFileSync('files/in/' + data.fileId + '.json', JSON.stringify(data.content));
        } catch (e) {
            logger.error('файл ' + data.fileId + ' не был сохранен с ошибкой' + e.message);
        }
    }
}
