---
title: "Настройка SingleStore"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища SingleStore в dbt."
id: "singlestore-setup"
meta:
  maintained_by: SingleStore, Inc.
  authors: 'SingleStore, Inc.'
  github_repo: 'memsql/dbt-singlestore'
  pypi_package: 'dbt-singlestore'
  min_core_version: 'v1.0.0'
  cloud_support: Не поддерживается
  min_supported_version: 'v7.5'
  slack_channel_name: 'db-singlestore'
  slack_channel_link: 'https://getdbt.slack.com/archives/C02V2QHFF7U'
  platform_name: 'SingleStore'
  config_page: '/reference/resource-configs/singlestore-configs'
---

:::info Плагин, поддерживаемый поставщиком

Некоторые основные функции могут отличаться. Если вы хотите сообщить об ошибке, запросить функцию или внести свой вклад, вы можете ознакомиться с указанным репозиторием и открыть задачу.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

### Настройка цели SingleStore {#set-up-a-singlestore-target}

Цели SingleStore должны быть настроены с использованием следующей конфигурации в вашем файле `profiles.yml`. Если вы используете SingleStore Managed Service, необходимые данные для подключения можно найти на странице вашего кластера в разделе "Connect" -> вкладка "SQL IDE".

<File name='~/.dbt/profiles.yml'>

```yaml
singlestore:
  target: dev
  outputs:
    dev:
      type: singlestore
      host: [hostname]  # необязательно, по умолчанию localhost
      port: [port number]  # необязательно, по умолчанию 3306
      user: [user]  # необязательно, по умолчанию root
      password: [password]  # необязательно, по умолчанию пусто
      database: [database name]  # обязательно
      schema: [prefix for tables that dbt will generate]  # обязательно
      threads: [1 or more]  # необязательно, по умолчанию 1
```

</File>
Рекомендуется также задать необязательные параметры.

### Описание полей профиля SingleStore {#description-of-singlestore-profile-fields}

| Поле                    | Обязательно | Описание |
|-------------------------|-------------|--------------------------------------------------------------------------------------------------------|
| `type`                  | Да          | Должно быть установлено в `singlestore`. Это должно быть включено либо в `profiles.yml`, либо в файл `dbt_project.yml`. |
| `host`                  | Нет         | Имя хоста сервера SingleStore для подключения. |
| `user`                  | Нет         | Ваше имя пользователя базы данных SingleStore. |
| `password`              | Нет         | Ваш пароль базы данных SingleStore. |
| `database`              | Да          | Имя вашей базы данных. Если вы используете пользовательские имена баз данных в конфигурации моделей, они должны быть созданы до запуска этих моделей. |
| `schema`                | Да          | Строка для префикса имен сгенерированных таблиц, если добавлен макрос `generate_alias_name` (см. ниже). Если вы используете пользовательское имя схемы в конфигурации модели, оно будет объединено с указанным в профиле с помощью `_`. |
| `threads`               | Нет         | Количество потоков, доступных для dbt. |

## Схема и параллельная разработка {#schema-and-concurrent-development}

SingleStore не имеет концепции `schema`, которая соответствует используемой в `dbt` (пространство имен в базе данных). `schema` в вашем профиле необходима для корректной работы `dbt` с метаданными вашего проекта. Например, вы увидите это на странице "dbt docs", даже если это не присутствует в базе данных.

Для поддержки параллельной разработки `schema` может использоваться для префикса имен <Term id="table" /> таблиц, которые `dbt` создает в вашей базе данных. Чтобы включить это, добавьте следующий макрос в ваш проект. Этот макрос будет использовать поле `schema` из вашего файла `profiles.yml` в качестве префикса имени таблицы.

```sql
-- macros/generate_alias_name.sql
{% macro generate_alias_name(custom_alias_name=none, node=none) -%}
    {%- if custom_alias_name is none -%}
        {{ node.schema }}__{{ node.name }}
    {%- else -%}
        {{ node.schema }}__{{ custom_alias_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

Таким образом, если вы установите `schema=dev` в вашем файле `.dbt/profiles.yml` и запустите модель `customers` с соответствующим профилем, `dbt` создаст таблицу с именем `dev__customers` в вашей базе данных.