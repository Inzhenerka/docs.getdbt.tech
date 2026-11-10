---
title: "Информационная схема dbt"
sidebar_label: "Об информационной схеме dbt"
description: "Информационная схема dbt — это интерфейс с определённым контрактом для доступа к метаданным вашего проекта dbt."
id: "dbt-information-schema"
availability:
  engine: v2
  access: free
---


Информационная схема dbt — это интерфейс с определённым контрактом для доступа к метаданным вашего проекта. Вы можете обращаться к ней с помощью SQL через [`dbt show`](#querying-with-dbt-show) или в своих [проверках](#using-the-information-schema-in-checks).

Метаданные хранятся в файлах [Parquet](https://parquet.apache.org/), которые компактнее JSON-артефактов и обеспечивают более эффективное выполнение запросов. Например, для проекта, в котором общий размер `manifest.json` и `catalog.json` составляет около 70 МБ, размер информационной схемы составляет около 5 МБ.

Создание информационной схемы и выполнение запросов к ней не используют вычислительные ресурсы хранилища данных. dbt записывает файлы на основе внутренних метаданных проекта с помощью встроенного движка DuckDB, работающего внутри процесса dbt. Для использования информационной схемы не нужно устанавливать, настраивать или администрировать DuckDB.

При использовании флага [`--generate-info-schema`](#generating-the-information-schema) dbt записывает эти файлы в каталог с указанием версии, например `target/info_schema/v1/`. Объём доступных метаданных растёт по мере обработки проекта в dbt:

- Парсинг предоставляет основные метаданные проекта
- Компиляция добавляет типы столбцов моделей и происхождение данных на уровне столбцов (при использовании `--static-analysis strict`)
- Выполнение команд run или build добавляет результаты выполнения

Используйте `dbt show --inline` для выполнения SQL-запросов или `dbt show --info` для запроса представления по имени. Вы также можете читать файлы с помощью инструментов, поддерживающих Parquet, например Pandas или Polars.

Список доступных таблиц и их описания см. в разделе [Таблицы информационной схемы](/reference/info-schema).

<Constant name="wizard" /> также использует информационную схему для анализа вашего проекта. Подробнее см. в разделе [Как работает <Constant name="wizard" />](/docs/dbt-ai/wizard-how-it-works#dbt-information-schema).

## Создание информационной схемы {#generating-the-information-schema}

Используйте `--generate-info-schema` или `DBT_ENGINE_GENERATE_INFO_SCHEMA=true` с командами `dbt build`, `dbt run`, `dbt compile` или `dbt parse`. По умолчанию таблица `dbt.node_columns` содержит только столбцы, объявленные в YAML, как для моделей, так и для источников.

- Чтобы включить выведенные типы столбцов моделей и происхождение данных на уровне столбцов, добавьте `--static-analysis strict`:

  ```shell
  dbt build --generate-info-schema --static-analysis strict
  ```

  С этим флагом dbt определяет типы столбцов на основе SQL-кода ваших моделей. Столбцы источников по-прежнему ограничены теми, которые объявлены в YAML.

- Чтобы включить типы столбцов из хранилища данных и все столбцы источников, используемых выбранными узлами, добавьте [`--write-catalog`](/reference/commands/cmd-docs#--write-catalog-flag) к команде `dbt build` или `dbt run`:

  ```shell
  dbt build --generate-info-schema --write-catalog
  dbt build --generate-info-schema --static-analysis strict --write-catalog # to get inferred model column types and column-level lineage
  ```

- При использовании [`dbt parse`](/reference/commands/parse) информационная схема не содержит типов столбцов, сведений о происхождении данных и результатов выполнения, поскольку `dbt parse` не подключается к вашему хранилищу данных.

- `dbt show` читает метаданные проекта напрямую, поэтому перед использованием этой команды ничего создавать не нужно. Используйте `--generate-info-schema`, если хотите экспортировать файлы Parquet на диск (например, чтобы прочитать их с помощью [внешних инструментов](#querying-with-external-tools)).

### Каталог схемы

Файлы Parquet информационной схемы находятся в подкаталоге с указанием версии внутри каталога `target/info_schema/` вашего проекта (или каталога, заданного с помощью [`--info-schema-dir`](#overriding-the-output-directory)). Они не хранятся в вашем хранилище данных.

#### Переопределение выходного каталога {#overriding-the-output-directory}

Используйте `--info-schema-dir` или `DBT_ENGINE_INFO_SCHEMA_DIR`, чтобы записать информационную схему в указанный вами каталог. Подкаталог с указанием версии (`v1/`) по-прежнему создаётся внутри заданного каталога.

```shell
dbt build --generate-info-schema --info-schema-dir /tmp/my_schema
# writes to /tmp/my_schema/v1/
```

## Запросы к информационной схеме

Вы можете выполнять запросы к информационной схеме локально с помощью `dbt show` или любого инструмента, поддерживающего Parquet.

### Запросы с помощью `dbt show` {#querying-with-dbt-show}

Используйте `dbt show --info <view>`, чтобы запросить представление непосредственно из CLI:

```shell
dbt show --info models
dbt show --info models --format json --limit 20
```

Эта команда напрямую запрашивает промежуточные представления, не подключаясь к вашему хранилищу данных. `--info <view>` эквивалентно `--inline "select * from {{ info_schema('<view>') }}"`.

Вы также можете использовать `--inline` с SQL-кодом, который напрямую вызывает `{{ info_schema() }}`:

```shell
dbt show --inline "select name from {{ info_schema('models') }} order by name"
```

### Запросы с помощью внешних инструментов {#querying-with-external-tools}

Укажите любому инструменту, поддерживающему Parquet, путь к файлам в `target/info_schema/v1/`. Например, для pandas:

```python
import pandas as pd
models = pd.read_parquet("target/info_schema/v1/dbt.models.parquet")
```

## Использование информационной схемы в проверках {#using-the-information-schema-in-checks}

[Проверки](/docs/build/checks) — это SQL-запросы к информационной схеме dbt, предназначенные для проверки качества вашего проекта. Используйте макрос [`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) в своей проверке, чтобы обратиться к представлению в информационной схеме dbt. В `dbt_project.yml` необходимо указать версию `info_schema`, которую вы хотите использовать. На данный момент доступна только версия `1`.

```yaml
info_schema:
  version: 1
```

Версию схемы можно найти в имени подкаталога с указанием версии (например, `target/info_schema/v1/`).

## Связанная документация
- [Таблицы информационной схемы](/reference/info-schema)
- [Команды для создания метаданных](/reference/commands/cmd-docs#commands-for-generating-metadata)
- [`dbt build`](/reference/commands/build)
- [`dbt run`](/reference/commands/run)
- [`dbt compile`](/reference/commands/compile)
- [`dbt parse`](/reference/commands/parse)
