# Обновление ПКУ

### Для обновления ПКУ необходимо сделать следующее
1. `git pull origin master` - скачиваем последнюю версию
2. `cp .env.example .env` - копируем актуальную версию ENV файла. Можно просто руками перенести тег версии из нового файла в свой
3. `docker-compose pull` - скачиваем актуальный образ docker контейнера
4. `docker-compose images` - убеждаемся что у вас стоит тег самой последней версии пку. Тег самой последней версии можно всего посмотреть в [разделе релизы](https://github.com/upgreat-readable/pku/releases).
5. `docker-compose up -d --force-recreate` - перезапускаем контейнер

### Альтернативный вариант:
1. Удаляем папку с приложением
2. Клонируем репозиторий заново
3. Следуем инструкции по установке
