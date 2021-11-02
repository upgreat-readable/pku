# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.10.0](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.10.0) (2021-11-02)

### Features

-   **фидбек комманд:** фидбек команд - в работе ([d08d283](https://github.com/upgreat-readable/pku/commit/d08d2834bdfa540196a7e8d804decf3902b42cb1))
-   **фидбек от комманд:** команды теперь возвращают фидбек по выполнению ([9aea9a1](https://github.com/upgreat-readable/pku/commit/9aea9a1c9d58f140bae9cf491955dfb5b0d9a0fe))
-   **eslint:** убрал правило "no-continue" ([ca579ca](https://github.com/upgreat-readable/pku/commit/ca579ca7c9a87698b3c50b7764f8251cb3f85330))
-   **file:** добавил автоматический запрос на получение пропущенного файла при подключении ([97ed6be](https://github.com/upgreat-readable/pku/commit/97ed6be2129bde5821c80c6a65eeddce1bd7ab85))
-   **file:** добавил команду для повторного получения файла ([0aed739](https://github.com/upgreat-readable/pku/commit/0aed739db5f00328766c5afae8410713851f0182))
-   **file:** убрал логирование содержимого повторно полученного файла ([8ebd4fb](https://github.com/upgreat-readable/pku/commit/8ebd4fb1e99f7350d2d3f3f2d5c2772f5657fa48))
-   **logs crit-upd file repeat:** расширение логов, обновление пакета критериев, дозапрос файла ([3343dfd](https://github.com/upgreat-readable/pku/commit/3343dfdf6874772bffd2ed51fe375a9bf4c4832f))
-   **logs:** добавил группы логируемым сообщениям ([87dc198](https://github.com/upgreat-readable/pku/commit/87dc1981249333f7a69db3983633c083922b3c70))
-   **logs:** добавил исключение для локальной работы (не пишущее в логи) ([0541032](https://github.com/upgreat-readable/pku/commit/0541032b4ca2f964fd1e4556ad4192238db584be))
-   **logs:** добавил класс-обёртку для логирования ([1183040](https://github.com/upgreat-readable/pku/commit/1183040e17c12a396ccccb8c5edd5b66f376603e))
-   **logs:** добавил команду и функционал отправки логов сессии на сервер ([78b724a](https://github.com/upgreat-readable/pku/commit/78b724a4367088195a0ac1c72c8ae0fe3c166664))
-   **logs:** добавил обработку запроса сервера на получение логов ([3fc41fb](https://github.com/upgreat-readable/pku/commit/3fc41fbc2748450877d4615069382c26aa65f25c))
-   **logs:** добавил обработку ошибок парсинга записей лога ([9123bb9](https://github.com/upgreat-readable/pku/commit/9123bb94fbd5ded15460ac0d7ecf75c2d47072a2))
-   **logs:** добавил общие логи для отладки ([7918a80](https://github.com/upgreat-readable/pku/commit/7918a804d27e01e29fac961754dad4854fdacd45))
-   **logs:** добавил переключение на новую папку логов при изменении дня ([bbbc653](https://github.com/upgreat-readable/pku/commit/bbbc653bf573c1fc10462ac16a4dab1494f19af6))
-   **logs:** добавил проверку на пустой результат перед отправкой логов на сервер ([e13aad6](https://github.com/upgreat-readable/pku/commit/e13aad6e282d5eedf26bfdf9a9f403c5687a0697))
-   **logs:** добавил сервис для работы с собранными для отправки по запросу сервера логами ([ad8206b](https://github.com/upgreat-readable/pku/commit/ad8206bbb57a84aa7b5298ed396aba18841c439c))
-   **logs:** добавил собирание всех логов для отправки по запросу сервера ([f783ccc](https://github.com/upgreat-readable/pku/commit/f783ccca3c59f7b34718f9fb9357be2772397b30))
-   **logs:** добавил ID сессии в записи логов ([1a49205](https://github.com/upgreat-readable/pku/commit/1a49205aeec0cd0e566510fad8480e758e4ea8c9))
-   **logs:** доработал логирование ([f23e69b](https://github.com/upgreat-readable/pku/commit/f23e69bef9bb5f73a2e0d47ff41e472c6a347829))
-   **logs:** избавился от лишних файлов в логах ([156d8e8](https://github.com/upgreat-readable/pku/commit/156d8e88e7ffe55e1e65899e54f865ed0fc56013))
-   **logs:** изменил формат времени в логах ([30813c1](https://github.com/upgreat-readable/pku/commit/30813c1bb3e22d1765cc894177a819f2a7ca93fa))
-   **logs:** обновил сообщение лога при запросе отправки логов на сервер ([fcd98d5](https://github.com/upgreat-readable/pku/commit/fcd98d57f54c0a29818b69707a4bdabc5e5e6b36))
-   **logs:** переделал логирование ошибки отправки файла ([19c7e61](https://github.com/upgreat-readable/pku/commit/19c7e61b7ee2a450b0d5a2ef4fb6e337e52fbaba))
-   **logs:** переделал логирование с сессий на дни ([ab92e55](https://github.com/upgreat-readable/pku/commit/ab92e55a626452444db9d354adb32268953076f0))
-   **logs:** переделал отправку логов под разделённые логи ([7ca16dd](https://github.com/upgreat-readable/pku/commit/7ca16dde48115f0689bc8792b3877934cbc0693b))
-   **logs:** переделал работу с логами для отправки на сервер на дни ([3ff94c3](https://github.com/upgreat-readable/pku/commit/3ff94c3737e918e79064f3bbe0568ca4520b9a64))
-   **logs:** переименовал файл разных логов ([35863de](https://github.com/upgreat-readable/pku/commit/35863def370893316bbe7aa9b4bcfabd5fdbf9e8))
-   **logs:** поправил уровни логирования ([96620e0](https://github.com/upgreat-readable/pku/commit/96620e0e5e1c88d443154cbced6fdcf39e7c7e52))
-   **logs:** поправил уровни логирования ([739b6a2](https://github.com/upgreat-readable/pku/commit/739b6a20f91feed5da912362bc81a4acf33f98d3))
-   **logs:** пропустил все логирования через класс-обёртку ([63bf46d](https://github.com/upgreat-readable/pku/commit/63bf46d143741cd3c3703db324b64fe3de725f2e))
-   **logs:** разделил логи на логи сервера и логи клиента ([cef8cfc](https://github.com/upgreat-readable/pku/commit/cef8cfc115f37f9545d55ccc003b400aad1111b6))
-   **logs:** расширение формата, использования принудительно uncolorize для файлов ([719e537](https://github.com/upgreat-readable/pku/commit/719e5375b26a14cc9ce16e667e304c054065ef22))
-   **logs:** решил проблему парсинга строк с несколькими JSON объектами ([2b69a9a](https://github.com/upgreat-readable/pku/commit/2b69a9acd6628f274d639b5b28d235d23b65d6f3))
-   **logs:** сделал выход с корректным статусом при успешной отправке логов ([8a8058a](https://github.com/upgreat-readable/pku/commit/8a8058acc668214ff7767f03250e919669c1245c))
-   **logs:** сделал добавление токена к записям лога для пакетной отправки на сервер ([8a38a71](https://github.com/upgreat-readable/pku/commit/8a38a71cc2a8f7cee1fe4caf6171a0c51b6fd68d))
-   **logs:** сделал добавление токена к запросу отправки записи лога на сервер ([a7fc3de](https://github.com/upgreat-readable/pku/commit/a7fc3decd6f848d1bf57f966b7a1034fd933a3c2))
-   **logs:** сделал добавление timestamp к запросу отправки записи лога на сервер ([4184c58](https://github.com/upgreat-readable/pku/commit/4184c580461e2e358f2fff8845f93abc38360e3a))
-   **logs:** сделал сбор логов сессий в отдельных каталогах ([933e7b3](https://github.com/upgreat-readable/pku/commit/933e7b36b71f57f137d187456262d90a848e22e0))
-   **logs:** убрал логирование содержимого полученного файла ([a101c7c](https://github.com/upgreat-readable/pku/commit/a101c7c46cf8e48cfb3efae9e34f6138b1458a3b))
-   **logs:** убрал отправку записи на сервер при её занесении в лог ([98880c3](https://github.com/upgreat-readable/pku/commit/98880c34585f806ab0744784a69b00293dd1d0b2))
-   **logs:** убрал отправку на сервер логов локальной работы ([5660968](https://github.com/upgreat-readable/pku/commit/5660968e506737ec08ba5e4bfd8d1fc0a9096377))
-   **logs:** убрал путь к файлу лога для передачи на сервер из константы ([244f0a0](https://github.com/upgreat-readable/pku/commit/244f0a05b209d612fbf44219cb0ecebfbe9de51b))
-   **logs:** улучшил отправку логов сессии на сервер ([b8fa615](https://github.com/upgreat-readable/pku/commit/b8fa615864183bfbc87852bac8e53a76445fbb16))
-   **logs:** формат логов теперь не копирует символы в файлы. TimeStamp в логах ([419a82f](https://github.com/upgreat-readable/pku/commit/419a82f77d0c4132cff3f09668e31f2058edd18d)), closes [#8](https://github.com/upgreat-readable/pku/issues/8)
-   **logs:** revert "сделал добавление токена к записям лога для пакетной отправки на сервер" ([4ce2327](https://github.com/upgreat-readable/pku/commit/4ce23272d6e5ccd0d2bf549855bbf85b4ebc4203))
-   **logs:** revert "сделал добавление токена к запросу отправки записи лога на сервер" ([030d868](https://github.com/upgreat-readable/pku/commit/030d868592e0b81cf51cc62dab1f9d78552754db))
-   **metrics:** добавил роут метрики активности подключения к socket Refs: CU-1pbvumc ([c006bea](https://github.com/upgreat-readable/pku/commit/c006beaca6967c1a5a7806d852d61526194f00c7))
-   **metrics:** format prom monitoring Refs: CU-1pbvumc ([4bc4285](https://github.com/upgreat-readable/pku/commit/4bc4285fa5caef51d554fa1ba2550f50aea0e62f))
-   **metrics:** modern metrics calc ([fec9331](https://github.com/upgreat-readable/pku/commit/fec933191ca57a020b7634e3054a62de36635484))
-   **start command:** интервал по умолчанию теперь 10 секунд ([073289d](https://github.com/upgreat-readable/pku/commit/073289d19060c80a2331a8c3ec1d8e491ed67ad9))
-   **ws:** повышение количества попыток автоматического переподключения ([7892df2](https://github.com/upgreat-readable/pku/commit/7892df2e83919798158fed52f6fd39a1a2ae81b4))

### Bug Fixes

-   **count:** поправил регулярку и валидцию counta ([6af9edd](https://github.com/upgreat-readable/pku/commit/6af9edd7b2350fd1718fbf5d170c0070f51e9442))
-   **demo:** fix demo mode ([d1f6fd8](https://github.com/upgreat-readable/pku/commit/d1f6fd87b1bea04df53e3a279c5c85ff23527c64))
-   **ds:** неправильный формат файла ([9b9288a](https://github.com/upgreat-readable/pku/commit/9b9288a4a9dd0a08fc17981b170904488e7ad040))
-   **fix demo:** fix demo mode ([7f96baf](https://github.com/upgreat-readable/pku/commit/7f96baf3294ab4d9159ae698d42c1b5fb4a29323))
-   **fix savefile:** fix saveFile, 300 default count value ([3c2df68](https://github.com/upgreat-readable/pku/commit/3c2df681e9eed09969e8a886c5d8ce1f71eadbfc))
-   **logging:** добавил проверку на undefined ([efef616](https://github.com/upgreat-readable/pku/commit/efef616ea7fd99dcabd315323565fbbf1a658551))
-   **logs:** исправил получение булевого значения из строки ([c69379e](https://github.com/upgreat-readable/pku/commit/c69379e82593ed31418b46b8dff877517e9de4e0))
-   **logs:** поправил уровень сообщения об отключении от удалённого сервера ([6a51ed8](https://github.com/upgreat-readable/pku/commit/6a51ed8d4b03fb4e25915048492f89867b51c016))
-   **logs:** убраны логи ipc.client в консоли ([c931547](https://github.com/upgreat-readable/pku/commit/c93154759da6792f591088cbb1bb0dad9ebbc7e8))
-   **messages:** повышена стабильность отдачи уведомлений ([1705747](https://github.com/upgreat-readable/pku/commit/170574771e8200a63b5ef80e52959c6e4ee1165f))
-   **metrics:** format fix Refs: CU-1pbvumc ([840b8d7](https://github.com/upgreat-readable/pku/commit/840b8d71e2fc13f60994c6f6c2bb8187f24a5a7b))
-   **metrics:** remove неиспользуемых пакетов Refs: CU-1pbvumc ([b6f8f08](https://github.com/upgreat-readable/pku/commit/b6f8f08f03524dae0794e7c314d64f3d264b5e06))
-   **socket:** добавил проверку на undefined ([9505104](https://github.com/upgreat-readable/pku/commit/95051043fe4013c874f56463010e4e5d73c64436))
-   **start command:** изменено количество файлов по умолчанию, теперь их 300 ([a096b4c](https://github.com/upgreat-readable/pku/commit/a096b4caf3087253fd35a883b9cbcb5078ba4621))
-   **sync versions:** sync ci versions ([46f3a6f](https://github.com/upgreat-readable/pku/commit/46f3a6f1e32a0a41238e880db4b5f1da156a4b84))

## [1.9.0](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.9.0) (2021-10-31)

### Features

-   **repeat:** repeat file теперь работает при реконнекте и коннекте
-   **psr:** обновленная версия + новая логика номинаций (команда старта та же)

## [1.8.0](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.8.0) (2021-10-18)

## [1.7.0](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.7.0) (2021-10-15)

## [1.6.0](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.6.0) (2020-12-02)

### [1.5.3](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.5.3) (2020-11-13)

### [1.5.2](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.5.2) (2020-11-08)

### [1.5.1](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.5.1) (2020-11-06)

## [1.5.0](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.5.0) (2020-11-06)

### Features

-   **metrics:** modern metrics calc ([fec9331](https://github.com/upgreat-readable/pku/commit/fec933191ca57a020b7634e3054a62de36635484))

### [1.4.2](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.4.2) (2020-10-26)

### Bug Fixes

-   **fix demo:** fix demo mode ([7f96baf](https://github.com/upgreat-readable/pku/commit/7f96baf3294ab4d9159ae698d42c1b5fb4a29323))

### [1.4.1](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.4.1) (2020-10-26)

### Bug Fixes

-   **demo:** fix demo mode ([d1f6fd8](https://github.com/upgreat-readable/pku/commit/d1f6fd87b1bea04df53e3a279c5c85ff23527c64))

## [1.4.0](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.4.0) (2020-10-22)

### Features

-   **fix savefile:** fix saveFile, 300 default count value ([3c2df68](https://github.com/upgreat-readable/pku/commit/3c2df681e9eed09969e8a886c5d8ce1f71eadbfc))
-   **fix savefile:** send теперь дает фидбек

### [1.3.2](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.3.2) (2020-10-22)

### Features

-   **logs:** дополнительная обработка и логирование исключительных случаев
-   **psr:** обновленная версия
-   **logs:** расширение формата, использования принудительно uncolorize для файлов ([719e537](https://github.com/upgreat-readable/pku/commit/719e5375b26a14cc9ce16e667e304c054065ef22))

### [1.3.1](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.3.1) (2020-10-21)

### Bug Fixes

-   **logs:** убраны логи ipc.client в консоли ([c931547](https://github.com/upgreat-readable/pku/commit/c93154759da6792f591088cbb1bb0dad9ebbc7e8))

## [1.3.0](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.3.0) (2020-10-20)

### Features

-   **logs:** формат логов теперь не копирует символы в файлы. TimeStamp в логах ([419a82f](https://github.com/upgreat-readable/pku/commit/419a82f77d0c4132cff3f09668e31f2058edd18d)), closes [#8](https://github.com/upgreat-readable/pku/issues/8)

### [1.2.2](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.2.2) (2020-10-20)

### [1.2.1](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.2.1) (2020-10-20)

## [1.2.0](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.2.0) (2020-10-19)

## [1.1.0](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.1.0) (2020-10-19)

### Features

-   **фидбек комманд:** фидбек команд - в работе ([d08d283](https://github.com/upgreat-readable/pku/commit/d08d2834bdfa540196a7e8d804decf3902b42cb1))
-   **фидбек от комманд:** команды теперь возвращают фидбек по выполнению ([9aea9a1](https://github.com/upgreat-readable/pku/commit/9aea9a1c9d58f140bae9cf491955dfb5b0d9a0fe))

### [1.0.9](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.0.9) (2020-10-14)

### Bug Fixes

-   **count:** поправил регулярку и валидцию counta ([6af9edd](https://github.com/upgreat-readable/pku/commit/6af9edd7b2350fd1718fbf5d170c0070f51e9442))

### [1.0.8](https://github.com/upgreat-readable/pku/compare/v1.0.7...v1.0.8) (2020-10-14)

### Bug Fixes

### [1.0.6](https://github.com/upgreat-readable/pku/compare/v1.0.4...v1.0.6) (2020-10-13)

### [1.0.5](https://github.com/upgreat-readable/pku/compare/v1.0.4...v1.0.5) (2020-10-12)

### [1.0.4](https://github.com/upgreat-readable/pku/compare/v1.0.3...v1.0.4) (2020-10-12)

### [1.0.3](https://github.com/upgreat-readable/pku/compare/v1.0.2...v1.0.3) (2020-10-09)

### Bug Fixes

-   **command line:** поправил валидацию + установил новую версию пакета критериев ([953b56d](https://github.com/upgreat-readable/pku/commit/953b56d63bb130fdaae43315adce3f9964355792))
-   **pku-cli:** add correct non-zero exit code ([8855366](https://github.com/upgreat-readable/pku/commit/88553663db4094d38b2d5915663444bc2cfa3089))
-   **pku-cli:** add correct non-zero exit code ([3f2041c](https://github.com/upgreat-readable/pku/commit/3f2041cf08919d8432e1f97b5dbbfb6d041e32df))
-   **release script:** add changes in .env\* ([787623d](https://github.com/upgreat-readable/pku/commit/787623d88bb997e6c0dd4de8fba59eaded331b96))

### 1.0.1 (2020-10-08)
