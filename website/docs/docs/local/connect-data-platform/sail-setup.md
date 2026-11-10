---
title: "Настройка Sail"
sidebar_label: "Sail"
description: "Из этого руководства вы узнаете, как настроить подключение к Sail в dbt."
id: "sail-setup"
meta:
  maintained_by: LakeSail
  authors: 'LakeSail'
  github_repo: 'lakehq/dbt-sail'
  pypi_package: 'dbt-sail'
  min_core_version: 'v1.8.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: 'LakeSail Community Slack'
  slack_channel_link: 'https://www.launchpass.com/lakesail-community/free'
  platform_name: 'Sail'
  config_page: '/reference/resource-configs/spark-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Sail с помощью **dbt-sail**

[Sail](https://github.com/lakehq/sail) — это прямая замена Apache Spark, которую разрабатывает и поддерживает [LakeSail](https://lakesail.com/). Sail реализует протокол Spark Connect, поэтому `dbt-sail` представляет собой тонкую обёртку над `dbt-spark`, которая подключается к Sail вместо Spark на JVM. `dbt-sail` поддерживает тот же набор возможностей, что и `dbt-spark`.

`dbt-sail` поддерживает два режима подключения:

- `embedded` — запускает сервер Sail в текущем процессе с помощью [`pysail`](https://pypi.org/project/pysail/). Внешний сервер не требуется.
- `remote` — подключается к уже работающему серверу Sail через Spark Connect.

## Настройка профиля

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sail
      mode: embedded   # или 'remote'
      host: 127.0.0.1  # обязателен для 'remote'; по умолчанию 127.0.0.1 для 'embedded'
      port: 50051      # используется в режиме 'remote'; игнорируется в режиме 'embedded'
      schema: SCHEMA_NAME
      threads: 1
```

</File>

| Поле | Описание | Обязательное? | Значение по умолчанию |
| ----- | ----------- | --------- | ------- |
| `type` | Должно иметь значение `sail`. | Да | - |
| `mode` | Режим подключения: `embedded` или `remote`. | Да | - |
| `host` | Имя хоста сервера Sail. Обязательно для режима `remote`. | Обязательно для `remote` | `127.0.0.1` (embedded) |
| `port` | Порт Spark Connect на сервере Sail. Используется в режиме `remote`. | Нет | `50051` |
| `schema` | Схема по умолчанию, в которой dbt создаёт объекты. | Да | - |
| `threads` | Количество потоков, используемых dbt. | Нет | `1` |
| `server_side_parameters` | Словарь параметров, передаваемых в базовый сеанс Spark. | Нет | `{}` |

Поскольку `dbt-sail` расширяет `dbt-spark`, также поддерживаются дополнительные поля профиля `dbt-spark`. Полный список приведён на странице [Настройка Apache Spark](/docs/local/connect-data-platform/spark-setup).

### Пример: режим embedded

<File name='~/.dbt/profiles.yml'>

```yaml
my_sail_project:
  target: dev
  outputs:
    dev:
      type: sail
      mode: embedded
      schema: analytics
      threads: 4
```

</File>

### Пример: режим remote

<File name='~/.dbt/profiles.yml'>

```yaml
my_sail_project:
  target: dev
  outputs:
    dev:
      type: sail
      mode: remote
      host: sail.internal
      port: 50051
      schema: analytics
      threads: 4
```

</File>

## Настройка ресурсов

`dbt-sail` поддерживает те же настройки ресурсов, что и `dbt-spark`. Сведения о вариантах материализации, инкрементальных стратегиях и других настройках на уровне моделей приведены на странице [Настройки Apache Spark](/reference/resource-configs/spark-configs).
