---
title: "Конфигурация DuckDB"
id: "duckdb-configs"
description: "Настройки dbt-duckdb для DuckDB, включая секреты, DuckLake, внешние файлы и инкрементальные стратегии."
tags: ['DuckDB']
---

Эти настройки относятся к `dbt-duckdb`. Настройки профиля и подключения описаны в разделе [Подключение DuckDB](/docs/local/connect-data-platform/duckdb-setup). Общие сведения о dbt см. в разделах [Материализации](/docs/build/materializations) и [Инкрементальные модели](/docs/build/incremental-models).

Для некоторых возможностей требуется определённая минимальная версия `dbt-duckdb`. Требования к версии указаны по ходу текста на этой странице.

## Менеджер секретов

Используйте [менеджер секретов DuckDB](https://duckdb.org/docs/configuration/secrets_manager.html) для управления учётными данными для облачных хранилищ. Настройте поле `secrets` в своём профиле:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      extensions:
        - httpfs
        - parquet
      secrets:
        - type: s3
          region: my-aws-region
          key_id: "{{ env_var('S3_ACCESS_KEY_ID') }}"
          secret: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
  target: dev
```

### Получение учетных данных из контекста

Вместо того чтобы указывать учетные данные напрямую, можно использовать поставщик секретов `credential_chain`, чтобы задействовать любой поддерживаемый механизм AWS (например, токены веб-идентификации). Подробности см. в [документации по поставщикам секретов DuckDB](https://duckdb.org/docs/configuration/secrets_manager.html#secret-providers).

```yml
secrets:
  - type: s3
    provider: credential_chain
```

### Ограничение области действия учетных данных по префиксу пути в хранилище

Для секретов можно задать область действия, чтобы для разных путей в хранилище использовались разные учетные данные:

```yml
secrets:
  - type: s3
    provider: credential_chain
    scope: [ "s3://bucket-in-eu-region", "s3://bucket-2-in-eu-region" ]
    region: "eu-central-1"
  - type: s3
    region: us-west-2
    scope: "s3://bucket-in-us-region"
```

При получении секрета для определенного пути области действия секретов сравниваются с этим путем. Если подходят несколько секретов, выбирается секрет с самым длинным совпадающим префиксом.

## Облачные хранилища с fsspec

В `dbt-duckdb 1.4.1` и более поздних версиях доступна экспериментальная возможность использования файловых систем DuckDB, реализованных через [fsspec](https://duckdb.org/docs/guides/python/filesystems.html). Библиотека `fsspec` поддерживает [различные системы облачного хранения данных](https://filesystem-spec.readthedocs.io/en/latest/api.html#other-known-implementations), включая S3, GCS и Azure Blob Storage.

Чтобы использовать реализацию `fsspec`, установите соответствующие модули Python и настройте `filesystems` в своем профиле:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      filesystems:
        - fs: s3
          anon: false
          key: "{{ env_var('S3_ACCESS_KEY_ID') }}"
          secret: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
          client_kwargs:
            endpoint_url: "http://localhost:4566"
  target: dev
```

Каждая запись должна содержать свойство `fs`, которое указывает протокол `fsspec` для загрузки (`s3`, `gcs`, `abfs` и т. д.), а также может содержать дополнительные пары «ключ — значение» для настройки соответствующей реализации.

## Произвольные параметры ATTACH {#arbitrary-attach-options}

Базовый синтаксис `attach` в профиле описан в разделе [Подключение к DuckDB](/docs/local/connect-data-platform/duckdb-setup#attaching-additional-databases). Используйте словарь `options`, если необходимо передать дополнительные пары «ключ — значение» в инструкцию `ATTACH` DuckDB:

```yml
attach:
  - path: /tmp/db1.sqlite
    type: sqlite
    read_only: true
  - path: /tmp/special.duckdb
    options:
      cache_size: 1GB
      threads: 4
      enable_fsst: true
```

Если указать один и тот же параметр и в отдельном поле (`type`, `secret`, `read_only`), и в словаре `options`, `dbt-duckdb` выдаст ошибку, чтобы предотвратить конфликты.

## DuckLake

[DuckLake](https://ducklake.select) — это табличный формат, который обеспечивает транзакции <Term id="acid" /> и доступ к историческим версиям данных (time travel) для DuckDB. DuckLake можно использовать как с локальными базами данных, так и с MotherDuck.

### DuckLake в MotherDuck

В `dbt-duckdb 1.9.6` и более поздних версиях можно подключиться к [DuckLake, размещённому в MotherDuck](https://motherduck.com/blog/ducklake-motherduck/), создав базу данных DuckLake и задав `is_ducklake: true`.

Чтобы настроить DuckLake в MotherDuck:

1. Создайте базу данных DuckLake в MotherDuck:

  ```sql
  CREATE DATABASE my_ducklake
    (TYPE ducklake, DATA_PATH 's3://...')
  ```

2. Настройте профиль:

  ```yml
  default:
    outputs:
      dev:
        type: duckdb
        path: "md:my_db?motherduck_token={{ env_var('MOTHERDUCK_TOKEN') }}"
        attach:
          - path: "md:my_ducklake"
            is_ducklake: true
    target: dev
  ```

  Необходимо явно обозначить DuckLake с помощью `is_ducklake: true`, чтобы dbt применял безопасные операции DDL.

  Для локального DuckLake используйте `ducklake:` в пути:

  ```yml
  attach:
    - path: "ducklake:my_ducklake.ddb"
  ```

### Партиционирование таблиц DuckLake

Для таблиц, хранящихся в DuckLake (включая DuckLake под управлением MotherDuck), можно настроить физическое партиционирование моделей с материализацией `table` или `incremental` с помощью `partitioned_by`:

```sql
{{ config(materialized='table', partitioned_by=['year', 'month']) }}

select
  *,
  year(event_time) as year,
  month(event_time) as month
from {{ ref('upstream_model') }}
```

`partition_by` допускается в качестве псевдонима для `partitioned_by`. Эта настройка применяется только к объектам DuckLake; для целевых платформ, не использующих DuckLake, она игнорируется с выдачей предупреждения.

DuckLake применяет партиционирование с помощью `ALTER TABLE ... SET PARTITIONED BY (...)`, причём оно влияет только на новые данные. При первоначальном создании или полном обновлении `dbt-duckdb` создаёт пустую таблицу, задаёт партиционирование, а затем вставляет данные, чтобы первоначальная загрузка также была партиционирована. Дополнительные сведения см. в [документации DuckLake по партиционированию](https://ducklake.select/docs/stable/duckdb/advanced_features/partitioning).

<VersionBlock lastVersion="1.99">

## Плагины {#plugins}

В `dbt-duckdb` есть [система плагинов](https://github.com/duckdb/dbt-duckdb#configuring-dbt-duckdb-plugins), позволяющая расширять возможности адаптера с помощью пользовательских UDF на Python, загружать исходные данные из Excel/Google Sheets/SQLAlchemy и многое другое. Подробную информацию о настройке и разработке плагинов см. в [документации dbt-duckdb по плагинам](https://github.com/duckdb/dbt-duckdb#configuring-dbt-duckdb-plugins).

:::info Только для <Constant name="core" />
Плагины — это возможность `dbt-duckdb`, которая не поддерживается в <Constant name="fusion_engine" /> и <Constant name="dbt_platform" />.
:::

## Модели на Python

[Модели Python](/docs/build/python-models) поддерживаются в <Constant name="dbt" /> начиная с версии 1.3. В `dbt-duckdb` они выполняются в том же процессе, который владеет подключением DuckDB. Файл `.py` загружается как модуль через [`importlib`](https://docs.python.org/3/library/importlib.html). Функция `model` получает объект `dbt` со сведениями о `ref` и `source`, а также объект `DuckDBPyConnection`. Возвращённый объект материализуется как таблица.

Значением `dbt.ref` и `dbt.source` внутри Python-модели будет объект [DuckDB Relation](https://duckdb.org/docs/api/python/reference/), который можно преобразовать в DataFrame Pandas/Polars или таблицу Arrow. Возвращаемым значением может быть любой объект, который DuckDB умеет преобразовывать в таблицу, включая DataFrame Pandas/Polars, DuckDB Relation или объекты Arrow: Table, Dataset, RecordBatchReader или Scanner.

### Пакетная обработка данных

В `dbt-duckdb` версии 1.6.1 и более поздних можно читать и записывать данные порциями, что позволяет работать в Python-моделях с наборами данных, размер которых превышает объём оперативной памяти:

```py
import pyarrow as pa

def batcher(batch_reader: pa.RecordBatchReader):
    for batch in batch_reader:
        df = batch.to_pandas()
        # Do some operations on the DF...
        # ...then yield back a new batch
        yield pa.RecordBatch.from_pandas(df)

def model(dbt, session):
    big_model = dbt.ref("big_model")
    batch_reader = big_model.record_batch(100_000)
    batch_iter = batcher(batch_reader)
    return pa.RecordBatchReader.from_batches(batch_reader.schema, batch_iter)
```

### Использование локальных модулей Python

Настройка профиля `module_paths` позволяет указать список путей в файловой системе, содержащих дополнительные модули Python. Эти пути добавляются в `sys.path` процесса dbt, благодаря чему модули становятся доступными для импорта в dbt. Это можно использовать для включения в проект вспомогательного кода, например пользовательских плагинов `dbt-duckdb` или общих библиотек для моделей Python.

## Внешние файлы

Одна из самых мощных возможностей DuckDB — чтение и запись файлов CSV, JSON и Parquet напрямую, без необходимости предварительно импортировать их в базу данных или экспортировать из неё.

### Чтение из внешних файлов

В моделях dbt можно ссылаться на внешние файлы напрямую или как на источники dbt, настроив `external_location` в разделе `config.meta` либо непосредственно через `config.external_location` в определении источника. Настройки из `config.meta` включаются в документацию, создаваемую командой `dbt docs generate`, а настройки, заданные непосредственно через `config.external_location`, — нет.

```yml
sources:
  - name: external_source
    config:
      meta:
        external_location: "s3://my-bucket/my-sources/{name}.parquet"
    tables:
      - name: source1
      - name: source2
```

Здесь `config.meta.external_location` в `external_source` задаёт шаблон f-строки для расположения любой таблицы, определённой для этого источника. Например, для такой модели dbt:

```sql
SELECT *
FROM {{ source('external_source', 'source1') }}
```

Будет скомпилировано как:

```sql
SELECT *
FROM 's3://my-bucket/my-sources/source1.parquet'
```

Если одна из исходных таблиц не соответствует шаблону, вы также можете задать `external_location` непосредственно для этой таблицы:

```yml
sources:
  - name: external_source
    config:
      meta:
        external_location: "s3://my-bucket/my-sources/{name}.parquet"
    tables:
      - name: source1
      - name: source2
        config:
          external_location: "read_parquet(['s3://my-bucket/my-sources/source2a.parquet', 's3://my-bucket/my-sources/source2b.parquet'])"
```

Свойство `external_location` не обязательно должно быть строкой, представляющей путь; оно также может быть вызовом функции, что удобно для CSV-файлов, требующих специальной обработки:

```yml
sources:
  - name: flights_source
    tables:
      - name: flights
        config:
          external_location: "read_csv('flights.csv', types={'FlightDate': 'DATE'}, names=['FlightDate', 'UniqueCarrier'])"
          formatter: oldstyle
```

Параметр конфигурации `formatter` определяет, какой способ форматирования строк использовать: `newstyle` (по умолчанию), `oldstyle` или `template`. Здесь необходим форматировщик `oldstyle`, поскольку `str.format` интерпретировал бы аргумент `types={'FlightDate': 'DATE'}` как переменную шаблона.

### Запись во внешние файлы

Вы можете создавать модели dbt, данные которых хранятся во внешних файлах, с помощью стратегии материализации `external`:

```sql
{{ config(materialized='external', location='local/directory/file.parquet') }}

SELECT m.*, s.id IS NOT NULL as has_source_id
FROM {{ ref('upstream_model') }} m
LEFT JOIN {{ source('upstream', 'source') }} s USING (id)
```

| Параметр | Значение по умолчанию | Описание |
| --- | --- | --- |
| `location` | Макрос `external_location` | Путь для записи внешней материализации. |
| `format` | `parquet` | Формат внешнего файла (`parquet`, `csv` или `json`). |
| `delimiter` | `,` | Разделитель полей для файлов CSV. |
| `options` | Нет | Любые другие параметры, передаваемые операции `COPY` в DuckDB (например, `partition_by`, `codec`). |
| `glue_register` | `false` | Если задано `true`, попытаться зарегистрировать файл, созданный этой моделью, в AWS Glue Catalog. |
| `glue_database` | `default` | Имя базы данных AWS Glue, в которой нужно зарегистрировать модель. |

- Если задан `location`, его значением должно быть имя файла или путь в бакете S3. Если при этом не указан `format`, `dbt-duckdb` попытается определить формат по расширению файла.

- Если аргумент `location` не указан, внешний файл получит имя файла `model.sql` (или `model.py`), в котором он определён, с расширением, соответствующим аргументу `format`. По умолчанию внешние файлы создаются относительно текущего рабочего каталога. Вы можете изменить каталог по умолчанию (или бакет/префикс S3), указав настройку `external_root` в своём профиле DuckDB.

Стратегии инкрементальной материализации не поддерживаются для моделей `external`.

### Регистрация внешних моделей {#register-external-models}

При использовании `:memory:` в качестве базы данных DuckDB последующие запуски dbt могут завершаться ошибкой, если выбрано подмножество моделей, зависящих от внешних таблиц. Это происходит потому, что внешние файлы регистрируются как представления DuckDB только при их создании, а не при обращении к ним. Чтобы решить эту проблему, используйте макрос `register_upstream_external_models` в начале запуска:

```yml
on-run-start:
  - "{{ register_upstream_external_models() }}"
```
## Материализация `table_function`

`dbt-duckdb` предоставляет пользовательскую материализацию `table_function`, которая использует возможность DuckDB [Table Function / Table Macro](https://duckdb.org/docs/sql/statements/create_macro.html) для создания параметризованных представлений.

Преимущества использования `table_function`:
- Позднее связывание позволяет изменять базовую таблицу (добавлять новые столбцы) без необходимости пересоздавать функцию, в отличие от представлений.
- Параметры позволяют принудительно применять проталкивание фильтров.
- Функции могут предоставлять расширенные возможности, например динамический SQL.

Пример создания `table_function` без параметров:

```sql
{{
    config(
        materialized='table_function'
    )
}}
select * from {{ ref("example_table") }}
```

Пример вызова (скобки обязательны даже при отсутствии параметров):

```sql
select * from {{ ref("my_table_function") }}()
```

Пример `table_function` с двумя параметрами:

```sql
{{
    config(
        materialized='table_function',
        parameters=['where_a', 'where_b']
    )
}}
select *
from {{ ref("example_table") }}
where 1=1
    and a = where_a
    and b = where_b
```

Пример вызова с параметрами:

```sql
select * from {{ ref("my_table_function_with_parameters") }}(1, 2)
```

</VersionBlock>

## Инкрементальные стратегии

`dbt-duckdb` поддерживает следующие стратегии для инкрементальных моделей таблиц:

- [`append`](#append-strategy)
- [`delete+insert`](#deleteinsert-strategy)
- [`merge`](#merge-strategy)
- [`microbatch`](#microbatch-strategy)

### Стратегия append {#append-strategy}

| Конфигурация | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `incremental_predicates` | `<list>` | null | SQL-условия для фильтрации добавляемых записей. |

### Стратегия delete+insert {#deleteinsert-strategy}

| Конфигурация | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `unique_key` | `<string>`/`<list>` | — | Обязательный параметр. Столбцы, используемые для определения записей, подлежащих удалению. |
| `incremental_predicates` | `<list>` | null | SQL-условия для фильтрации операций удаления и вставки. |

### Стратегия merge {#merge-strategy}

Стратегия `merge` требует DuckDB версии 1.4.0 или более поздней и предоставляет доступ к встроенному оператору `MERGE` в DuckDB.

**Базовая конфигурация**

Если указан только `unique_key`, `dbt-duckdb` использует операции DuckDB `UPDATE BY NAME` и `INSERT BY NAME`, которые автоматически сопоставляют столбцы по имени:

```yml
models:
  - name: my_incremental_model
    config:
      materialized: incremental
      incremental_strategy: merge
      unique_key: id
```

**Расширенная конфигурация**

Дополнительные параметры для более точного управления:

| Конфигурация | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `unique_key` | `<string/list>` | — | Обязательный параметр. Столбцы, используемые в условии соединения MERGE. |
| `incremental_predicates` | `<list>` | null | Дополнительные SQL-условия для фильтрации операции MERGE. |
| `merge_update_condition` | `<string>` | null | SQL-условие, определяющее, когда обновлять совпавшие записи. |
| `merge_insert_condition` | `<string>` | null | SQL-условие, определяющее, когда вставлять записи, для которых не найдено совпадений. |
| `merge_update_columns` | `<list>` | null | Конкретные столбцы для обновления. |
| `merge_exclude_columns` | `<list>` | null | Столбцы, исключаемые из обновления. |
| `merge_update_set_expressions` | `<dict>` | null | Пользовательские выражения для обновления столбцов. |

Для максимальной гибкости используйте `merge_clauses`, чтобы задать собственное поведение `when_matched` и `when_not_matched`. При использовании DuckLake в операторах MERGE допускается только одно действие UPDATE или DELETE в предложениях `when_matched` из-за текущих ограничений реализации MERGE в DuckLake.

В условиях и выражениях используйте `DBT_INTERNAL_SOURCE` для ссылки на входящие данные, а `DBT_INTERNAL_DEST` — для ссылки на существующую целевую таблицу.

### Стратегия microbatch {#microbatch-strategy}

Стратегия `microbatch` требует <Constant name="dbt" /> версии 1.9 или более поздней и выполняет инкрементальное построение пакетами, сформированными по временным интервалам на основе настроенного столбца `event_time`.

| Конфигурация | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `event_time` | `<string>` | — | Обязательный параметр. Имя столбца с временными метками, используемого для определения временных окон микропакетов. |
| `begin` | `<string>` | — | Обязательный параметр. Начальное время для формирования пакетов (например, `2025-01-01`). |
| `batch_size` | `<string>` | — | Обязательный параметр. Временная гранулярность пакета (например, `day`, `hour`). |
| `incremental_predicates` | `<list>` | null | Необязательные дополнительные предикаты, применяемые внутри каждого пакета. |

:::tip
Обработка микропакетами не всегда является оптимальным вариантом с точки зрения производительности. DuckDB работает с группами строк, а не с физическими разделами (если только вы явно не разделили данные на разделы в DuckLake). Обязательно протестируйте разное количество потоков, чтобы подобрать подходящее для вашего сценария.
:::

<VersionBlock firstVersion="1.9" lastVersion="1.99">

## Интерактивная оболочка

В `dbt-duckdb` версии 1.9.3 и более поздних интерактивная оболочка позволяет выполнять команды dbt и запросы к базе данных DuckDB в единой среде командной строки. Оболочка автоматически запускает [DuckDB UI](https://duckdb.org/2025/03/12/duckdb-ui.html), предоставляющий визуальный интерфейс для исследования данных во время работы с моделями dbt.

Чтобы запустить интерактивную оболочку:

```bash
python -m dbt.adapters.duckdb.cli
```

Вы можете указать профиль с помощью флага `--profile`:

```bash
python -m dbt.adapters.duckdb.cli --profile my_profile
```

Оболочка предоставляет доступ ко всем стандартным командам dbt (`run`, `test`, `build`, `seed`, `snapshot`, `compile`, `parse`, `debug`, `deps`, `list`) и поддерживает автодополнение имён моделей, если установлен необязательный пакет `iterfzf`.

</VersionBlock>

## Дополнительная информация

- Сведения о режимах подключения и настройке профиля см. в разделе [Подключение DuckDB](/docs/local/connect-data-platform/duckdb-setup).
- Исходный код адаптера и плагины см. в [репозитории `dbt-duckdb`](https://github.com/duckdb/dbt-duckdb). Примечания к выпускам адаптера см. на [странице выпусков `dbt-duckdb`](https://github.com/duckdb/dbt-duckdb/releases).
- О концепциях dbt, используемых на этой странице, см. в разделах [Материализации](/docs/build/materializations), [Инкрементальные модели](/docs/build/incremental-models) и [Модели Python](/docs/build/python-models).
