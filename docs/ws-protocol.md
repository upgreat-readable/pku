# Протокол обмена с Socket.io

Используются не чистый WS протокол, а надстройка socket.io.

EntryPoint: [https://ds.readable.upgreat.one/pku](https://ds.readable.upgreat.one/pku)

ПКУ работает на socket.io реализации на nodejs.

Пример запуска клиента на socket.io nodejs

```js
import io from 'socket.io-client';

const socket = io.connect(link, {
    secure: true,
    rejectUnauthorized: false,
    query: {
        token: userToken,
    },
    transports: ['websocket'],
});
```

# Сообщения WS сервера

-   **`connection-auth-error`**: ошибка авторизации

-   **`session-start-success`**: успех начала сессии. В payload прилетает id сессии.
-   **`session-start-error`**: ошибка начала сессии

-   **`session-reconnect-success`**: успех переподключения. В payload прилетает id сессии.
-   **`session-reconnect-error`**: ошибка переподключения

-   **`session-client-abort-success`**: успех остановки сессии
-   **`session-client-abort-error`**: ошибка остановки сессии

-   **`session-file-repeat-success`**: успех повторного получения файла
-   **`session-file-repeat-error`**: ошибка повторного получения файла

-   **`session-file-send-success`**: успех отправки файла
-   **`session-file-send-error`**: ошибка отправки файла

-   **`session-file-available`**: получение нового файла

    payload

    -   `sessionId`
    -   `fileId`
    -   `content`

-   **`session-close`**

    В payload прилетает `type`

    -   **`finish`**: сессия закрыта т.к. приняты все файлы
    -   **`timeout-close`**: закрытие сессии по таймауту 5 минут, последний файл отправлен сервером, но клиент не вернул один из файлов

-   **`logs-send-success`**: успех отправки логов
-   **`logs-send-error`**: ошибка отправки логов

В сообщения типа \*-error приходит сообщение с ошибкой.

# Сообщения WS клиента

-   **`session-start`**: начало сессии
-   **`session-reconnect`**: попытка переподключения к сессии
-   **`session-file-repeat`**: запрос повторного получения файла
-   **`session-file-send`**: отправка файла
-   **`session-client-abort`**: остановка сессии
-   **`logs-send`**: отправка логов
