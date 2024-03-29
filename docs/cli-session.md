# Взаимодействие с сервером

Программный комплекс участника упакован в docker контейнер.
![Схема взаимодействия с сервером](https://i.imgur.com/VoECF3J.png)

## Протокол, инкапсуляция

Обмен с сервером происходит по протоколу websocket с помощью высокоуровневой библиотеки socket.io.
Весь код обмена с сервером инкапсулирован в клиенте внутри docker контейнера и к нему предоставлен консольный интерфейс, что позволяет интегрироваться с сервером на любом удобном языке программирования.

## Количество подключений

С одного токена разрешено только одно одновременное подключение к серверу.

# Начало работы

```shell script
./pku start --mode <mode> --count 300 --type train --lang ru --time
```

-   `mode` режим сессии. Возможные варианты: algorithmic/technical/final. Сессию финала можно поднять только в день проведения финальных испытаний.
-   `count` количество файлов в выборке. Максимум 1000. Если количество файлов превзойдет количество размеченных на данный момент текстов в системе двумя экспертами - то выдастся максимально возможное количество со стороны сервера. Параметр актуален только для алгоритмической сессии.
-   `type` тип выборки. Возможные варианты: train/test. Параметр актуален только для алгоритмической сессии.
-   `lang` язык датасета. Возможные варианты: rus/eng/all. Параметр актуален только для алгоритмической сессии. (Будет реализован с 0.20 версии)
-   `time` время лимита отдачи одного файла. Может принимать параметры в диапазоне от 10 до 60 секунд. По умолчанию 10 секунд. Параметр актуален только для алгоритмической сессии. (Будет реализован с 0.20 версии)

Запуск сессии запускает фоновый процесс клиента websocket соединения в рамках docker контейнера.

> _это не рекомендуемая практика в рамках идеологии docker контейнера, но docker в ПКУ используется в 1 очередь для инкапсуляции._

## Сессия может быть завершена:

1. В случае завершения приема файлов со стороны сервера. Сервер завершает прием файлов через 5 минут после отдачи последнего файла.
2. В случае ручного завершения сессии со стороны клиента.
3. В случае при разрыве соединения которое продлится 15 и более минут.

Вне зависимости от действий пользователя cli интерфейса (за исключением команды `pku endSession`) клиент websocket соединения будет принимать файлы и складывать их в директорию `files/in` (в ближайших версиях папки in/out будут разделены на подпапки сессий).

## Лимиты времени отдачи файлов клиентом серверу

После того как сервер отдал файл клиенту (с момента push по протоколу websocket) сервер начинает отсчет времени, в рамках которого принятый от клиента файла будет считать уложившимся в сроки.

-   В рамках сессии финала лимит времени на отдачу файлов ограничен техническим регламентом.
-   В рамках сессии технической квалификации лимит на отдачу 60 секунд.
-   В рамках сессии алгоритмической квалификации лимит на отдачу по умолчанию 60 секунд, но может быть изменен отдельным параметром.
    Если сессия открыта — сервер примет и сохранит файл который был отдан клиентом с просроченным лимитом времени, но пометит его меткой просроченного времени. Если сессия завершена — файл передать невозможно.

## Reconnect

В рамках сессии допускается потери соединений до 15 минут каждое. ПКУ может переподключиться командой `./pku reconnect` в течение 15 минут.
При переподключении не будет возможности получить с сервера те файлы, которые были переданы за время отключения, по завершению сессии, они будут помечены как не отданные клиентом. Клиент продолжит принимать файлы и складывать их в директорию.

## Получение файлов через cli

Команды получения файлов выдает идентификаторы файлов без указания расширения файла.

```shell script
# Получение последнего переданного файла от сервера клиенту из папки /files/in
./pku getNextFile

# Получение списка всех переданных на данный момент файлов (по сути всех файлов в папке /files/in)
./pku getFileList
```

## Запрос повторного получения файла

Участнику будет повторно отправлен файл, обработка которого от него ожидается.

```shell script
# Запрос повторного получения файла
./pku repeatFile
```

## Отправка размеченных файлов

Получив файл, участник после их разметки должен положить файл с разметкой в директорию /files/out с тем же именем что и входной файл.

```shell script
# Командой sendFile отправляется файл который лежит в директории /files/out на сервер
./pku send --fileId <fileId>

# Пример
./pku send --fileId 000015
```

fileId - это идентификатор, без указания расширения файла.

## Принудительное завершение сессии

```shell script
./pku stop
```

Команду принудительного завершения не стоит использовать для завершения сессии в рабочем режиме, в случае использовании команды отчет не будет составлен.

## Отправка логов

Отправляются только те записи, которые не были отправлены ранее.

```shell script
# Командой sendLogs отправляются записи из файлов /logs/<date>/server-persistence.log и /logs/<date>/client-persistence.log на сервер
./pku sendLogs --date <date>

# Пример
./pku sendLogs --date 2021-10-14
```

date - это дата в формате ISO, логи за которую нужно отправить.

## Базовый алгоритм работы

1. Подключаемся к сессии (`pku start ...параметры`)
2. Проверяем наличие нового файла командой `getNextFile`
3. Обрабатываем файл (добавляем разметку в json) и кладем обработанный файл в директорию /files/out
4. Отправляем обработанный файл на сервер командой `send`

После завершения сессии сервер обрабатывает данные с помощью модулей PSR и модулей расчета критериев на сервере в порядке очереди и предоставляет отчет о прохождении квалификационной сессии.  
Отчет о финальной сессии будет доступен после проверки экспертами текстов.

## Диагностика неполадок

1. `docker-compose logs` может выдать дополнительную информацию если что-то пошло не так.
2. Запустите `docker-compose up -d --force-recreate`
