---
title: "Настройка IBM DB2"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища IBM DB2 в dbt."
id: "ibmdb2-setup"
meta:
  maintained_by: Сообщество
  authors: 'Rasmus Nyberg (https://github.com/aurany)'
  github_repo: 'aurany/dbt-ibmdb2'
  pypi_package: 'dbt-ibmdb2'
  min_core_version: 'v1.0.4'
  cloud_support: Не поддерживается
  min_supported_version: 'IBM DB2 V9fp2'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'IBM DB2'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Плагин сообщества

Некоторые основные функции могут быть ограничены. Если вы хотите внести свой вклад, ознакомьтесь с исходным кодом каждого из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />



Это экспериментальный плагин:
- Мы не проводили его обширное тестирование
- Тестировался с [dbt-adapter-tests](https://pypi.org/project/pytest-dbt-adapter/) и DB2 LUW на Mac OS+RHEL8
- Совместимость с другими [пакетами dbt](https://hub.getdbt.com/) (такими как [dbt_utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/)) протестирована только частично

## Подключение к IBM DB2 с помощью dbt-ibmdb2

Цели IBM DB2 должны быть настроены с использованием следующей конфигурации в вашем файле `profiles.yml`.

Пример:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: ibmdb2
      schema: analytics
      database: test
      host: localhost
      port: 50000
      protocol: TCPIP
      username: my_username
      password: my_password
```

</File>

#### Описание полей профиля IBM DB2

| Опция          | Описание                                                                         | Обязательно?                                                      | Пример                                        |
| --------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------- |
| type            | Конкретный адаптер для использования                                               | Обязательно                                                       | `ibmdb2`                                       |
| schema          | Укажите схему (базу данных), в которую будут создаваться модели                   | Обязательно                                                       | `analytics`                                    |
| database        | Укажите базу данных, к которой вы хотите подключиться                              | Обязательно                                                       | `testdb`                                       |
| host            | Имя хоста или IP-адрес                                                             | Обязательно                                                       | `localhost`                                    |
| port            | Порт для использования                                                              | Необязательно                                                     | `50000`                                        |
| protocol        | Протокол для использования                                                          | Необязательно                                                     | `TCPIP`                                        |
| username        | Имя пользователя для подключения к серверу                                         | Обязательно                                                       | `my-username`                                  |
| password        | Пароль для аутентификации на сервере                                              | Обязательно                                                       | `my-password`                                  |


## Поддерживаемые функции

| DB2 LUW | DB2 z/OS | Функция |
|:---------:|:---:|---------------------|
| ✅ | 🤷 | Материализация таблиц       |
| ✅ | 🤷 | Материализация представлений  |
| ✅ | 🤷 | Инкрементальная материализация |
| ✅ | 🤷 | Эфемерная материализация   |
| ✅ | 🤷 | Семена                       |
| ✅ | 🤷 | Источники                    |
| ✅ | 🤷 | Пользовательские тесты данных |
| ✅ | 🤷 | Генерация документации       |
| ✅ | 🤷 | Снимки                      |

## Примечания 
- dbt-ibmdb2 основан на пакете ibm_db для Python, и существуют известные проблемы с кодировкой, связанные с z/OS.