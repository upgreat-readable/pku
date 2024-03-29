export default {
    'message.start.success': 'Сессия успешно стартовала',
    'message.start.error': 'Ошибка старта сессии',
    'message.start.auth': 'Произошла ошибка авторизации по токену',

    'message.reconnect.success': 'Сессия успешно переподключилась',
    'message.reconnect.error': 'Не удалось переподключиться к сессии',
    'message.reconnect.auth': 'Произошла ошибка авторизации по токену',

    'message.stop.success': 'Сессия прервана',
    'message.stop.error': 'Ошибка завершения сессии',
    'message.stop.empty': 'Сессия не может быть прервана т.к. не запущена в данном контейнере. Запустите сессию командой start или reconnect.',

    'message.file.repeat.success': 'Файл был получен повторно',
    'message.file.repeat.error': 'Произошла ошибка повторного получения файла',

    'message.file.success': 'Файл был успешно отправлен',
    'message.file.error': 'Файл не был отправлен',

    'message.logs.not-found': 'Не найдены логи для отправки на сервер',
    'message.logs.success': 'Логи были отправлены',
    'message.logs.error': 'Логи не были отправлены',

    // Сетевые сообщения
    'message.socket-io.disconnect': 'network: disconnect',

    'message.socket-io.connect_error': 'network: connect_error',
    'message.socket-io.connect_timeout': 'network: connect_timeout',

    'message.socket-io.reconnect_attempt': 'network: reconnect_attempt',
    'message.socket-io.reconnect_error': 'network: reconnect_error',
    'message.socket-io.reconnect_failed': 'network: reconnect_failed',
    'message.socket-io.reconnect': 'network: reconnect success',
};
