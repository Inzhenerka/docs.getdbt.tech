---
title: "Конфигурация DuckDB"
id: "duckdb-configs"
---


## Профиль

Пользователям <Constant name="cloud" /> не требуется создавать собственный файл `profiles.yml`. Профиль dbt-duckdb ([profiles](/docs/core/connect-data-platform/duckdb-setup#connecting-to-duckdb-with-dbt-duckdb)) должен быть настроен следующим образом:

```yml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: 'file_path/database_name.duckdb'
      extensions:
        - httpfs
        - parquet
      settings:
        s3_region: my-aws-region
        s3_access_key_id: "{{ env_var('S3_ACCESS_KEY_ID') }}"
        s3_secret_access_key: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
```

В таком виде ваш конвейер dbt-duckdb будет выполняться поверх базы данных [DuckDB](https://www.duckdb.org), работающей в памяти, и данные не будут сохранены после завершения запуска.

Чтобы ваш конвейер dbt сохранял отношения (relations) в файле DuckDB, укажите параметр `path` в профиле — путь к файлу DuckDB, из которого вы хотите читать данные и в который хотите записывать их на локальной файловой системе. (Если путь не указан, он автоматически устанавливается в специальное значение `:memory:`, и база данных будет работать в памяти без сохранения данных на диск.)


`dbt-duckdb` добавляет свойство `database`: его значение автоматически устанавливается равным базовому имени файла, указанного в `path`, без суффикса. Например, если путь — `/tmp/a/dbfile.duckdb`, то поле `database` будет установлено в значение `dbfile`.


## Использование MotherDuck

Начиная с версии `dbt-duckdb 1.5.2`, вы можете подключаться к экземпляру DuckDB, работающему в [MotherDuck](https://motherduck.com), указав в `path` строку подключения с префиксом `md:`, так же как это делается в DuckDB CLI или Python API.

С точки зрения dbt базы данных MotherDuck в целом работают так же, как и локальные базы DuckDB, однако есть несколько отличий, о которых следует помнить:

1. В настоящее время MotherDuck требует использования определённой версии DuckDB, зачастую самой новой, как указано в документации MotherDuck.
1. MotherDuck заранее загружает набор наиболее распространённых расширений DuckDB, но не поддерживает загрузку пользовательских расширений или пользовательских функций.
1. Небольшая часть продвинутых возможностей SQL пока не поддерживается; для адаптера dbt это означает, что макрос `dbt.listagg` и ограничения внешних ключей будут работать с локальной базой DuckDB, но не будут работать с базой MotherDuck.

## Расширения

Вы можете загружать любые поддерживаемые [расширения DuckDB](https://duckdb.org/docs/extensions/overview), перечислив их в поле `extensions` вашего профиля. Также можно задавать любые дополнительные [параметры конфигурации DuckDB](https://duckdb.org/docs/sql/configuration) через поле `settings`, включая параметры, поддерживаемые загруженными расширениями.

Начиная с версии `dbt-duckdb 1.4.1`, была добавлена (экспериментальная) поддержка файловых систем DuckDB, реализованных через `fsspec`. Библиотека fsspec предоставляет возможность чтения и записи файлов в различных облачных хранилищах данных, включая S3, GCS и Azure Blob Storage. Вы можете настроить список совместимых с fsspec реализаций для использования в вашем проекте `dbt-duckdb`, установив соответствующие Python-модули и настроив профиль следующим образом:

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

Здесь свойство `filesystems` принимает список конфигураций, где каждая запись должна содержать свойство `fs`, указывающее, какой протокол fsspec необходимо загрузить (например, `s3`, `gcs`, `abfs`), а также произвольный набор пар ключ–значение для настройки конкретной реализации fsspec. См. [пример проекта](https://dagster.io/blog/duckdb-data-lake), демонстрирующий использование этой возможности для подключения из dbt-duckdb к экземпляру localstack с запущенным S3.

## Secret Manager

Для использования [DuckDB Secrets Manager](https://duckdb.org/docs/configuration/secrets_manager.html) можно воспользоваться полем `secrets`. Например, чтобы подключиться к S3 и читать/записывать файлы Parquet с использованием ключа и секрета доступа AWS, профиль может выглядеть следующим образом:

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

### Получение учётных данных из контекста

Вместо явного указания учётных данных через блок `settings` вы также можете использовать провайдер секретов `credential_chain`. Это позволяет применять любой поддерживаемый AWS механизм получения учётных данных (например, web identity tokens). Чтобы использовать провайдер `credential_chain` и автоматически получать учётные данные из AWS, укажите его в разделе `secrets`:

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
          provider: credential_chain
  target: dev
```

## Подключение дополнительных баз данных

В версии DuckDB `0.7.0` была добавлена поддержка [подключения дополнительных баз данных](https://duckdb.org/docs/sql/statements/attach.html) к запуску `dbt-duckdb`, что позволяет читать и записывать данные в несколько баз данных. Дополнительные базы данных можно настроить с помощью [хуков dbt run](/docs/build/hooks-operations) или через аргумент `attach` в профиле, добавленный в `dbt-duckdb 1.4.0`:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      attach:
        - path: /tmp/other.duckdb
        - path: ./yet/another.duckdb
          alias: yet_another
        - path: s3://yep/even/this/works.duckdb
          read_only: true
        - path: sqlite.db
          type: sqlite
```

К подключённым базам данных можно обращаться в dbt sources и моделях двумя способами:

- по базовому имени файла базы данных без суффикса (например, `/tmp/other.duckdb` будет базой `other`, а `s3://yep/even/this/works.duckdb` — базой `works`);

или

- по заданному вами алиасу (в приведённой конфигурации база `./yet/another.duckdb` будет доступна как `yet_another`, а не `another`).

Обратите внимание, что дополнительные базы данных не обязательно должны быть файлами DuckDB. Механизмы хранения и каталога DuckDB являются расширяемыми. Кроме того, DuckDB 0.7.0 включает поддержку чтения и записи подключённых баз данных SQLite. Тип базы данных, к которой вы подключаетесь, можно указать с помощью аргумента `type`, который в настоящее время поддерживает значения `duckdb` и `sqlite`.

## Плагины

`dbt-duckdb` имеет собственную систему [плагинов](https://github.com/duckdb/dbt-duckdb/blob/master/dbt/adapters/duckdb/plugins/__init__.py), которая позволяет опытным пользователям расширять функциональность dbt-duckdb, в том числе:

- определять пользовательские Python UDF на соединении с базой данных DuckDB, чтобы использовать их в SQL-моделях;
- загружать исходные данные из Excel, Google Sheets или таблиц SQLAlchemy.

Подробности см. в разделе [Writing Your Own Plugins](https://github.com/duckdb/dbt-duckdb#writing-your-own-plugins).

Чтобы настроить плагин для использования в проекте dbt, укажите свойство `plugins` в профиле:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      plugins:
        - module: gsheet
          config:
            method: oauth
        - module: sqlalchemy
          alias: sql
          config:
            connection_url: "{{ env_var('DBT_ENV_SECRET_SQLALCHEMY_URI') }}"
        - module: path.to.custom_udf_module
```

Каждый плагин должен иметь свойство `module`, указывающее, где определён класс плагина для загрузки. Существует [набор встроенных плагинов](https://github.com/duckdb/dbt-duckdb/blob/master/dbt/adapters/duckdb/plugins), на которые можно ссылаться по имени базового файла (`excel` или `gsheet`), в то время как пользовательские плагины (описанные далее в документе) должны указываться по полному пути модуля (например, модуль `lib.my.custom`, определяющий класс с именем `plugin`).

Каждый экземпляр плагина имеет имя, используемое для логирования и ссылок, которое по умолчанию совпадает с именем модуля, но может быть переопределено пользователем с помощью свойства `alias`. Кроме того, модули могут инициализироваться произвольным набором пар ключ–значение, определённых в словаре `config`. В данном примере плагин `gsheet` инициализируется с параметром `method: oauth`, а плагин `sqlalchemy` (с алиасом `sql`) — с параметром `connection_url`, значение которого задаётся через переменную окружения.

Обратите внимание, что использование плагинов может потребовать добавления дополнительных зависимостей в Python-среду, в которой выполняется конвейер dbt-duckdb:

- `excel` зависит от `pandas` и `openpyxl` или `xlsxwriter` для записи файлов;
- `gsheet` зависит от `gspread` и `pandas`;
- `iceberg` зависит от `pyiceberg` и `Python >= 3.8`;
- `sqlalchemy` зависит от `pandas`, `sqlalchemy` и необходимых драйверов.

## Поддержка Python

Поддержка [Python-моделей](/docs/build/python-models) была добавлена в dbt в версии `1.3.0`. Для большинства платформ данных dbt упаковывает Python-код, определённый в файле `.py`, и отправляет его на выполнение в ту Python-среду, которую поддерживает соответствующая платформа (например, Snowpark для Snowflake или Dataproc для BigQuery).

В `dbt-duckdb` Python-модели выполняются в том же процессе, который владеет соединением с базой данных DuckDB; по умолчанию это Python-процесс, создаваемый при запуске dbt. Для выполнения Python-модели файл `.py`, в котором она определена, рассматривается как Python-модуль и загружается в работающий процесс с помощью [`importlib`](https://docs.python.org/3/library/importlib.html). Затем формируются аргументы для определённой вами функции модели (объект `dbt`, содержащий имена всех `ref` и `source`, необходимых модели, а также объект `DuckDBPyConnection` для взаимодействия с базой DuckDB), вызывается функция модели, после чего возвращаемый объект материализуется в виде таблицы в DuckDB.

Значения функций `dbt.ref` и `dbt.source` внутри Python-модели будут объектами типа [DuckDB Relation](https://duckdb.org/docs/api/python/reference/), которые легко преобразуются в DataFrame Pandas/Polars или в таблицу Arrow. Возвращаемое значение функции модели может быть любым Python-объектом, который DuckDB умеет преобразовывать в таблицу, включая DataFrame Pandas/Polars, DuckDB Relation или Arrow Table, Dataset, RecordBatchReader или Scanner.

### Пакетная обработка

Начиная с версии `1.6.1`, появилась возможность читать и записывать данные порциями (chunks), что позволяет обрабатывать в Python-моделях наборы данных, превышающие объём доступной памяти. Ниже приведён базовый пример:

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

### Использование локальных Python‑модулей

В `dbt-duckdb 1.6.0` была добавлена настройка профиля `module_paths`, которая позволяет указать список путей в файловой системе, содержащих дополнительные Python-модули, которые должны быть добавлены в свойство `sys.path` Python-процесса. Это позволяет включать в dbt-проекты вспомогательные Python-модули, доступные во время выполнения dbt, и использовать их для определения пользовательских плагинов dbt-duckdb или библиотечного кода, полезного при создании Python-моделей dbt.

## Внешние файлы

Одной из самых мощных возможностей DuckDB является способность напрямую читать и записывать файлы CSV, JSON и Parquet без необходимости предварительного импорта или экспорта данных в базу данных.

### Чтение из внешних файлов

Вы можете ссылаться на внешние файлы в dbt-моделях напрямую или как на dbt sources, настроив `external_location` либо в разделе `meta`, либо в опции `config` определения источника. Разница заключается в том, что настройки в разделе `meta` будут включены в документацию по источнику, сгенерированную командой `dbt docs generate`, тогда как настройки в разделе `config` — нет. Любые параметры источника, которые следует исключить из документации, нужно указывать в `config`, а те, которые вы хотите видеть в сгенерированной документации, — в `meta`.

```yml
sources:
  - name: external_source
    config:
      meta: # changed to config in v1.10
        external_location: "s3://my-bucket/my-sources/{name}.parquet"
    tables:
      - name: source1
      - name: source2
```

Здесь параметры `meta` у `external_source` определяют `external_location` как f-string, что позволяет задать шаблон расположения файлов для всех таблиц, определённых в этом источнике.

Таким образом, dbt-модель:

```sql
SELECT *
FROM {{ source('external_source', 'source1') }}
```

будет скомпилирована как:

```sql
SELECT *
FROM 's3://my-bucket/my-sources/source1.parquet'
```

Если одна из таблиц источника отклоняется от этого шаблона или требует особой обработки, параметр `external_location` можно задать и на уровне самой таблицы в `meta`, например:

```yml
sources:
  - name: external_source
    config:
      meta: # changed to config in v1.10
        external_location: "s3://my-bucket/my-sources/{name}.parquet"
    tables:
      - name: source1
      - name: source2
        config:
          external_location: "read_parquet(['s3://my-bucket/my-sources/source2a.parquet', 's3://my-bucket/my-sources/source2b.parquet'])"
```

В этом случае настройка `external_location` для таблицы `source2` будет иметь приоритет.

Соответственно, dbt-модель:

```sql
SELECT *
FROM {{ source('external_source', 'source2') }}
```

будет скомпилирована в SQL-запрос:

```sql
SELECT *
FROM read_parquet(['s3://my-bucket/my-sources/source2a.parquet', 's3://my-bucket/my-sources/source2b.parquet'])
```

Обратите внимание, что значение свойства `external_location` не обязательно должно быть строкой, похожей на путь; оно также может быть вызовом функции. Это полезно, например, если внешний источник — CSV-файл, который требует специальной обработки для корректной загрузки в DuckDB:

```yml
sources:
  - name: flights_source
    tables:
      - name: flights
        config:
          external_location: "read_csv('flights.csv', types={'FlightDate': 'DATE'}, names=['FlightDate', 'UniqueCarrier'])"
          formatter: oldstyle
```

Обратите внимание, что для этого примера необходимо переопределить стратегию форматирования строк по умолчанию (`str.format`), поскольку аргумент `types={'FlightDate': 'DATE'}` функции `read_csv` будет интерпретирован `str.format` как шаблон. Это приведёт к ошибке `KeyError: "'FlightDate'"` при попытке разобрать источник в dbt-модели.

Параметр `formatter` в конфигурации источника указывает, какую стратегию форматирования строк следует использовать: newstyle (по умолчанию), oldstyle или template string.

Подробнее о различных стратегиях форматирования строк и примеры можно найти в этом [обсуждении интеграционного теста dbt-duckdb](https://stackoverflow.com/questions/78821149/formatting-strings-in-dask-duckdb).

Вы также можете создавать dbt-модели, основанные на внешних файлах, используя стратегию материализации `external`:

```sql 
{{
  config(materialized='external', location='local/directory/file.parquet') 
}}

SELECT m.*, s.id IS NOT NULL as has_source_id
FROM {{ ref('upstream_model') }} m
LEFT JOIN {{ source('upstream', 'source') }} s USING (id)
```


| Опция | По умолчанию | Описание |
| --- | --- | --- |
| location | `external_location` macro | Путь, по которому будет записана внешняя материализация. Подробнее см. ниже. |
| format | parquet | Формат внешнего файла (parquet, CSV или JSON). |
| delimiter | , | Для CSV-файлов — разделитель полей. |
| options | None | Любые дополнительные параметры для операции COPY DuckDB (например, `partition_by`, `codec` и т. д.). |
| `glue_register` | false | Если true, попытаться зарегистрировать файл, созданный этой моделью, в AWS Glue Catalog. |
| `glue_database` | default | Имя базы данных AWS Glue, в которой будет зарегистрирована модель. |


Если аргумент `location` указан, он должен быть именем файла (или S3 bucket/path), и `dbt-duckdb` попытается определить аргумент `format` по расширению файла в `location`, если `format` не указан (эта возможность была добавлена в версии `1.4.1`).

Если аргумент `location` не указан, внешний файл будет назван по имени файла `model.sql` (или `model.py`), в котором он определён, с расширением, соответствующим аргументу `format` (parquet, CSV или JSON). По умолчанию внешние файлы создаются относительно текущего рабочего каталога, но вы можете изменить каталог по умолчанию (или S3 bucket/prefix), указав настройку `external_root` в профиле DuckDB.


`dbt-duckdb` поддерживает стратегии [incremental](/docs/build/incremental-strategy#built-in-strategies) `delete+insert` и `append` для инкрементальных табличных моделей, однако для внешних моделей стратегии инкрементальной материализации не поддерживаются.

### Регистрация внешних моделей

При использовании `:memory:` в качестве базы данных DuckDB последующие запуски dbt могут завершаться ошибками при выборе подмножества моделей, зависящих от внешних таблиц. Это связано с тем, что внешние файлы регистрируются как представления DuckDB только в момент их создания, а не при обращении к ним. Чтобы решить эту проблему, используйте макрос `register_upstream_external_models`, который можно запускать в начале выполнения.

Чтобы включить автоматическую регистрацию, добавьте следующее в файл `dbt_project.yml`:

```yml
on-run-start:
  - "{{ register_upstream_external_models() }}"
```
