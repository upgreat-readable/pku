export default {
    'message.start.success': 'Сессия успешно стартовала',
    'message.start.error': 'Ошибка старта сессии',
    'message.start.auth': 'Произошла ошибка авторизации по токену',

    'message.reconnect.success': 'Сессия успешно переподключилась',
    'message.reconnect.error': 'Не удалось переподключится к сессии',
    'message.reconnect.auth': 'Произошла ошибка авторизации по токену',

    'message.stop.success': 'Сессия прервана',
    'message.stop.error': 'Ошибка завершения сессии',
    'message.stop.empty': 'Сессия не может быть прервана т.к. не запущена в данном контейнере. Запустите сессию командой start или reconnect.',

    // Сетевые сообщения
    'message.socket-io.disconnect': 'network: disconnect',

    'message.socket-io.connect_error': 'network: connect_error',
    'message.socket-io.connect_timeout': 'network: connect_timeout',

    'message.socket-io.reconnect_attempt': 'network: reconnect_attempt',
    'message.socket-io.reconnect_error': 'network: reconnect_error',
    'message.socket-io.reconnect_failed': 'network: reconnect_failed',
    'message.socket-io.reconnect': 'network: reconnect success',

    'message.file.success': 'Файл был успешно отправлен',
    'message.file.error': 'Файл не был отправлен',
};
