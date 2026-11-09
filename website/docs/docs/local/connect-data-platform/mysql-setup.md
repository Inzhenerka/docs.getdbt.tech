---
title: "Подключение MySQL к dbt v1"
sidebar_label: "MySQL"
description: "Прочитайте это руководство, чтобы узнать, как настроить подключение к хранилищу данных MySQL в dbt."
id: "mysql-setup"
meta:
  maintained_by: Community
  authors: 'Doug Beatty (https://github.com/dbeatty10)'
  github_repo: 'dbeatty10/dbt-mysql'
  pypi_package: 'dbt-mysql'
  min_core_version: 'v0.18.0'
  cloud_support: Не поддерживается
  min_supported_version: 'MySQL 5.7 и 8.0'
  slack_channel_name: '#db-mysql-family'
  slack_channel_link: 'https://getdbt.slack.com/archives/C03BK0SHC64'
  platform_name: 'MySQL'
  config_page: '/reference/resource-configs/no-configs'
availability: local_free
---

:::info Плагин сообщества

Некоторая основная функциональность может быть ограничена. Если вы заинтересованы в участии, ознакомьтесь с исходным кодом для каждого из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

Это экспериментальный плагин:
- Он не был тщательно протестирован.
- Движки хранения, отличные от InnoDB по умолчанию, не тестировались.
- Протестирован только с [dbt-adapter-tests](https://github.com/dbt-labs/dbt-adapter-tests) с следующими версиями:
  - MySQL 5.7
  - MySQL 8.0
  - MariaDB 10.5
- Совместимость с другими [пакетами dbt](https://hub.getdbt.com/) (такими как [dbt_utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/)) также не тестировалась.

Пожалуйста, внимательно прочитайте эту документацию и используйте на свой страх и риск. [Проблемы](https://github.com/dbeatty10/dbt-mysql/issues/new) и [PRs](https://github.com/dbeatty10/dbt-mysql/blob/main/CONTRIBUTING.rst#contributing) приветствуются!


## Подключение к MySQL с помощью dbt-mysql {#connecting-to-mysql-with-dbt-mysql}

Цели MySQL должны быть настроены с использованием следующей конфигурации в вашем файле `profiles.yml`.

Пример:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: mysql
      server: localhost
      port: 3306
      schema: analytics
      username: your_mysql_username
      password: your_mysql_password
      ssl_disabled: True
```

</File>

#### Описание полей профиля MySQL {#description-of-mysql-profile-fields}

| Опция          | Описание                                                                         | Обязательно?                                                      | Пример                                        |
| --------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------- |
| type            | Конкретный адаптер для использования                                             | Обязательно                                                        | `mysql`, `mysql5` или `mariadb`                            |
| server          | Сервер (имя хоста) для подключения                                               | Обязательно                                                        | `yourorg.mysqlhost.com`                        |
| port            | Порт для использования                                                           | Необязательно                                                      | `3306`                                         |
| schema          | Укажите схему (базу данных) для построения моделей                               | Обязательно                                                        | `analytics`                                    |
| username        | Имя пользователя для подключения к серверу                                       | Обязательно                                                        | `dbt_admin`                                    |
| password        | Пароль для аутентификации на сервере                                             | Обязательно                                                        | `correct-horse-battery-staple`                 |
| ssl_disabled    | Установите для включения или отключения TLS подключения к mysql5.x               | Необязательно                                                      | `True` или `False`                              |

## Поддерживаемые функции {#supported-features}

| MariaDB 10.5 | MySQL 5.7 | MySQL 8.0 | Функция                     |
|:---------:|:---------:|:---:|-----------------------------|
|     ✅     |     ✅     |  ✅  | Материализация таблиц       |
|     ✅     |     ✅     |  ✅  | Материализация представлений |
|     ✅     |     ✅     |  ✅  | Инкрементальная материализация |
|     ✅     |     ❌     |  ✅  | Эфемерная материализация   |
|     ✅     |     ✅     |  ✅  | Семена                       |
|     ✅     |     ✅     |  ✅  | Источники                   |
|     ✅     |     ✅     |  ✅  | Пользовательские тесты данных |
|     ✅     |     ✅     |  ✅  | Генерация документации      |
|     🤷     |     🤷     |  ✅  | Снимки                      |

## Примечания {#notes}
- Эфемерные материализации зависят от [Общих табличных выражений](https://en.wikipedia.org/wiki/Hierarchical_and_recursive_queries_in_SQL) (CTEs), которые поддерживаются только с MySQL 8.0.
- MySQL 5.7 имеет некоторые особенности конфигурации, которые могут повлиять на работу снимков dbt из-за [автоматической инициализации и обновления для `TIMESTAMP`](https://dev.mysql.com/doc/refman/5.7/en/timestamp-initialization.html).
  - Если вывод `SHOW VARIABLES LIKE 'sql_mode'` включает `NO_ZERO_DATE`. Решением является включение следующего в файл `*.cnf`:
  ```
  [mysqld]
  explicit_defaults_for_timestamp = true
  sql_mode = "ALLOW_INVALID_DATES,{other_sql_modes}"
  ```
- Где `{other_sql_modes}` — остальные режимы из вывода `SHOW VARIABLES LIKE 'sql_mode'`.
