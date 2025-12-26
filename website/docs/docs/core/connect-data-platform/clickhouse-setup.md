---
title: "Настройка ClickHouse"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища ClickHouse в dbt."
meta:
  maintained_by: Community
  authors: 'Geoff Genz & Bentsi Leviav'
  github_repo: 'ClickHouse/dbt-clickhouse'
  pypi_package: 'dbt-clickhouse'
  min_core_version: 'v0.19.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-clickhouse'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Clickhouse'
  config_page: '/reference/resource-configs/clickhouse-configs'
---

Некоторая основная функциональность может быть ограничена. Если вы заинтересованы в участии, ознакомьтесь с исходным кодом для каждого из перечисленных ниже репозиториев.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к ClickHouse

Чтобы подключиться к ClickHouse из dbt, вам необходимо добавить [профиль](/docs/core/connect-data-platform/connection-profiles)
в файл конфигурации `profiles.yml`. Используйте эталонную конфигурацию ниже, чтобы настроить профиль ClickHouse:

<File name='profiles.yml'>

```yaml
clickhouse-service:
  target: dev
  outputs:
    dev:
      type: clickhouse
      schema: [ default ]  # База данных ClickHouse для моделей dbt

      # необязательно
      host: [ <your-clickhouse-host> ]  # URL вашего кластера ClickHouse, например abc123.clickhouse.cloud. По умолчанию `localhost`.
      port: [ 8123 ]  # По умолчанию 8123, 8443, 9000 или 9440 в зависимости от настроек secure и используемого драйвера
      user: [ default ]  # Пользователь для всех операций с базой данных
      password: [ <empty string> ]  # Пароль пользователя
      secure: [ False ]  # Использовать TLS (native protocol) или HTTPS (http protocol)

```

For a complete list of configuration options, see the [ClickHouse documentation](https://clickhouse.com/docs/integrations/dbt).
</File>

### Создание проекта dbt

Теперь вы можете использовать этот профиль в одном из существующих проектов или создать новый с помощью команды:

```sh
dbt init project_name
```

Перейдите в директорию `project_name` и обновите файл `dbt_project.yml`, указав профиль, который вы настроили для подключения к ClickHouse.

```yaml
profile: 'clickhouse-service'
```

### Проверка подключения

Выполните команду `dbt debug` с помощью CLI, чтобы убедиться, что dbt может подключиться к ClickHouse. Убедитесь, что в выводе есть строка `Connection test: [OK connection ok]`, которая означает успешное подключение.

## Поддерживаемые возможности

### Возможности dbt

Type | Supported? | Details
-----|------------|----------------
Contracts | YES | 
Docs generate | YES |
Most dbt-utils macros | YES | (теперь включены в dbt-core) 
Seeds | YES | 
Sources | YES | 
Snapshots | YES | 
Tests | YES | 

### Материализации

Type | Supported? | Details
-----|------------|----------------
Table | YES | Создаёт [table](https://clickhouse.com/docs/en/operations/system-tables/tables/). Ниже приведён список поддерживаемых движков.
View | YES | Создаёт [view](https://clickhouse.com/docs/en/sql-reference/table-functions/view/).
Incremental | YES | Создаёт таблицу, если она не существует, а затем записывает в неё только обновления.
Microbatch incremental | YES | 
Ephemeral materialization | YES | Создаёт эфемерную материализацию / CTE. Эта модель является внутренней для dbt и не создаёт объектов в базе данных.
Materialized View | YES, Experimental | Создаёт [materialized view](https://clickhouse.com/docs/en/materialized-view).
Distributed table materialization | YES, Experimental | Создаёт [distributed table](https://clickhouse.com/docs/en/engines/table-engines/special/distributed).
Distributed incremental materialization | YES, Experimental | Инкрементальная модель, основанная на той же идее, что и distributed table. Обратите внимание, что поддерживаются не все стратегии — подробнее см. [здесь](https://github.com/ClickHouse/dbt-clickhouse?tab=readme-ov-file#distributed-incremental-materialization).
Dictionary materialization | YES, Experimental | Создаёт [dictionary](https://clickhouse.com/docs/en/engines/table-engines/special/dictionary).

**Примечание**: Возможности, разработанные сообществом, помечены как experimental. Несмотря на этот статус, многие из них, например materialized views, широко используются и успешно применяются в продакшене.

## Документация

Подробнее об использовании адаптера `dbt-clickhouse` для управления моделями данных см. в [документации ClickHouse](https://clickhouse.com/docs/integrations/dbt).

## Вклад в проект

Мы приветствуем вклад сообщества в развитие адаптера `dbt-ClickHouse`. Будь то исправление ошибки, добавление новой возможности или улучшение документации — любая помощь будет очень полезна!

Пожалуйста, ознакомьтесь с нашим [руководством по внесению вклада](https://github.com/ClickHouse/dbt-clickhouse/blob/main/CONTRIBUTING.md), чтобы начать работу. В нём приведены подробные инструкции по настройке окружения, запуску тестов и отправке pull request’ов.
