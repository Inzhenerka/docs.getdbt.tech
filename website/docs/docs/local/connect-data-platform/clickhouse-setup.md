---
title: "Настройка ClickHouse"
sidebar_label: "ClickHouse"
description: "Из этого руководства вы узнаете, как настроить хранилище ClickHouse в dbt."
meta:
  maintained_by: Community
  authors: 'Geoff Genz & Bentsi Leviav'
  github_repo: 'ClickHouse/dbt-clickhouse'
  pypi_package: 'dbt-clickhouse'
  min_core_version: 'v0.19.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-clickhouse'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'ClickHouse'
  config_page: '/reference/resource-configs/clickhouse-configs'
availability: local_free
---

<VersionBlock firstVersion="2.0">

# Подключение ClickHouse к <Constant name="fusion" /> <Lifecycle status="beta" />

Адаптер ClickHouse для <Constant name="fusion_engine" /> подключается к [ClickHouse](https://clickhouse.com) по HTTP или HTTPS. Он поддерживает самостоятельно управляемые одноузловые установки ClickHouse и [ClickHouse Cloud](https://clickhouse.com/cloud).

## Установка dbt

Адаптер ClickHouse встроен в v2. Чтобы начать работу, [установите dbt](/docs/local/install-dbt).

Примеры подключения и настройки профиля приведены в разделе [Подключение к ClickHouse](#connecting-to-clickhouse).

## Аутентификация

<Constant name="fusion" /> использует имя пользователя и пароль для аутентификации в ClickHouse. Установите `secure: true` в профиле для подключения по HTTPS (порт по умолчанию — 8443) или не задавайте этот параметр для подключения по обычному HTTP (порт по умолчанию — 8123). Для ClickHouse Cloud требуется `secure: true`.

## Права доступа к хранилищу

import FusionClickHouseWarehousePerms from '/snippets/_v2-warehouse-permissions-clickhouse.md';

<FusionClickHouseWarehousePerms />

## Ограничения {#limitations}

Адаптер ClickHouse для <Constant name="fusion" /> находится на стадии бета-тестирования. Возможны небольшие ошибки, поэтому пока не используйте его в производственных средах. Некоторые возможности адаптера `dbt-clickhouse` для <Constant name="core" /> пока не поддерживаются.

Адаптер ClickHouse активно разрабатывается. Если вы столкнулись с проблемой, [создайте issue в dbt-core](https://github.com/dbt-labs/dbt-core/issues/new) и добавьте метку `adapter:clickhouse`.

### Что уже работает

В одноузловых установках ClickHouse и в ClickHouse Cloud (с поддержкой многоузловых кластеров):

- Все материализации: table, view, incremental (все стратегии и `on_schema_change`), materialized view (включая обновляемые), dictionary, snapshot, seed и ephemeral
- Контракты и ограничения, `settings` для моделей и запросов, проекции и индексы
- Тесты данных, модульные тесты, генерация каталога и табличная функция `s3`

### Что пока не поддерживается

- Самостоятельно управляемые кластеры с параметром `cluster:` в профиле пока не поддерживаются. В инструкции языка определения данных (DDL) не добавляется `ON CLUSTER`, поэтому движки Replicated и материализации `distributed_table` и `distributed_incremental` не работают.
- Конфигурация `grants`, а также команды `dbt clone` и `dbt source freshness` пока не поддерживаются.
- Сохраняются и менее значительные ограничения: `query-comment: null` не учитывается, результаты выполнения не включают ClickHouse `query_id`, а описания `persist_docs`, содержащие `;`, приводят к ошибке.
- Функции анализа SQL (статический анализ и остальные интеллектуальные возможности dbt для работы с SQL) пока недоступны. Поддержка появится в ближайшее время.
- В основных функциях работы с ClickHouse всё ещё могут встречаться небольшие ошибки.

</VersionBlock>

<VersionBlock lastVersion="1.99">

# Подключение ClickHouse к <Constant name="core" />

<ProductCard text="Совместимо с Fusion" url="/docs/local/connect-data-platform/clickhouse-setup?version=2" />

Также доступно подключение через <Constant name="fusion" />.

:::info Плагин сообщества

Некоторые основные возможности могут быть ограничены. Если вы хотите внести свой вклад, ознакомьтесь с исходным кодом в каждом из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

</VersionBlock>

## Подключение к ClickHouse {#connecting-to-clickhouse}

Чтобы подключиться к ClickHouse из dbt, необходимо добавить [профиль](/docs/local/profiles.yml)
в файл конфигурации `profiles.yml`. Используйте приведённый ниже пример конфигурации для настройки профиля ClickHouse:

<File name='profiles.yml'>
```yaml
clickhouse-service:
  target: dev
  outputs:
    dev:
      type: clickhouse
      schema: [ default ]  # База данных ClickHouse для моделей dbt

      # необязательные параметры
      host: [ <your-clickhouse-host> ]  # URL вашего кластера ClickHouse, например abc123.clickhouse.cloud. По умолчанию — `localhost`.
      port: [ 8123 ]  # По умолчанию — 8123, 8443, 9000 или 9440 в зависимости от настроек secure и driver 
      user: [ default ]  # Пользователь для всех операций с базой данных
      password: [ <empty string> ]  # Пароль пользователя
      secure: [ False ]  # Использовать TLS (протокол native) или HTTPS (протокол http). Для ClickHouse Cloud необходимо установить true.

```

Полный список параметров конфигурации приведён в [документации ClickHouse](https://clickhouse.com/docs/integrations/dbt).
</File>

### Создание проекта dbt
Теперь вы можете использовать этот профиль в одном из существующих проектов или создать новый с помощью команды:

```sh
dbt init project_name
```

Перейдите в каталог `project_name` и обновите файл `dbt_project.yml`, чтобы использовать профиль, настроенный для подключения к ClickHouse.

```yaml
profile: 'clickhouse-service'
```

### Проверка подключения

Выполните `dbt debug` в командной строке, чтобы проверить, может ли dbt подключиться к ClickHouse. Убедитесь, что ответ содержит `Connection test: [OK connection ok]`, что указывает на успешное подключение.

<VersionBlock lastVersion="1.99">

## Поддерживаемые возможности

### Возможности dbt

Тип | Поддерживается? | Подробности
-----|------------|----------------
Контракты | ✅ | 
Docs generate | ✅ |
Большинство макросов dbt-utils | ✅ | (теперь включены в dbt-core) 
Seeds | ✅ | 
Источники | ✅ | 
Снимки | ✅ | 
Тесты | ✅ | 

### Материализации

Тип | Поддерживается? | Подробности
-----|------------|----------------
Table | ✅ | Создаёт [таблицу](https://clickhouse.com/docs/en/operations/system-tables/tables/).
View | ✅ | Создаёт [представление](https://clickhouse.com/docs/en/sql-reference/table-functions/view/).
Incremental | ✅ | Создаёт таблицу, если она не существует, а затем записывает в неё только обновления.
Microbatch incremental | ✅ | 
Материализация ephemeral | ✅ | Создаёт материализацию ephemeral/CTE. Эта модель используется только внутри dbt и не создаёт объектов в базе данных.
Materialized View | ✅, экспериментальная | Создаёт [материализованное представление](https://clickhouse.com/docs/en/materialized-view).
Материализация распределённой таблицы | ✅, экспериментальная | Создаёт [распределённую таблицу](https://clickhouse.com/docs/en/engines/table-engines/special/distributed).
Распределённая инкрементальная материализация | ✅, экспериментальная | Инкрементальная модель, основанная на том же принципе, что и распределённая таблица. Обратите внимание, что поддерживаются не все стратегии. Дополнительные сведения приведены в [документации по распределённой инкрементальной материализации](https://github.com/ClickHouse/dbt-clickhouse?tab=readme-ov-file#distributed-incremental-materialization).
Материализация словаря | ✅, экспериментальная | Создаёт [словарь](https://clickhouse.com/docs/en/engines/table-engines/special/dictionary).

**Примечание**: Возможности, разработанные сообществом, помечены как экспериментальные. Несмотря на это обозначение, многие из них, например материализованные представления, широко распространены и успешно используются в производственных средах.

## Документация

Дополнительные сведения об использовании адаптера `dbt-clickhouse` для управления моделью данных приведены в [документации ClickHouse](https://clickhouse.com/docs/integrations/dbt).

## Участие в разработке

Мы приветствуем вклад сообщества в улучшение адаптера `dbt-ClickHouse`. Исправляете ли вы ошибку,
добавляете новую возможность или улучшаете документацию — мы очень ценим ваши усилия!

Для начала ознакомьтесь с нашим [руководством по участию в разработке](https://github.com/ClickHouse/dbt-clickhouse/blob/main/CONTRIBUTING.md). В нём приведены подробные инструкции по настройке окружения, запуску тестов и отправке pull request.

</VersionBlock>
