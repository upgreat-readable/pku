# Сообщения WS сервера

-   **`session-close`**

    В payload прилетает `type`

    -   **`finish`**: сессия закрыта т.к. приняты все файлы
    -   **`timeout-close`**: закрытие сессии по таймауту 5 минут, последний файл отправлен сервером, но клиент не вернул один из файлов

-   **`session-reconnect-success`**: успех переподключения
-   **`session-reconnect-error`**: ошибка переподключения
-   **`session-client-abort-success`**: успех остановки сессии
-   **`session-client-abort-error`**: ошибка остановки сессии

-   **`connection-auth-error`**: ошибка авторизации
-   **`session-start-success`**: успех начала сессии
-   **`session-file-available`**: доставка файла

# Сообщения WS клиента

-   **`session-start`**: начало сессии
-   **`session-reconnect`**: попытка переподключения к сессии
-   **`session-file-send`**: отправка файла
-   **`session-client-abort`**: остановка сессии
