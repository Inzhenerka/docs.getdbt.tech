---
title: "Настройка DuckDB"
sidebar_label: "DuckDB"
description: "В этом руководстве описана настройка хранилища DuckDB в dbt."
meta:
  maintained_by: Сообщество
  authors: 'Josh Wills (https://github.com/jwills)'
  github_repo: 'duckdb/dbt-duckdb'
  pypi_package: 'dbt-duckdb'
  min_core_version: 'v1.0.1'
  cloud_support: Не поддерживается
  min_supported_version: 'DuckDB 0.3.2'
  slack_channel_name: '#db-duckdb'
  slack_channel_link: 'https://getdbt.slack.com/archives/C039D1J1LA2'
  platform_name: 'Duck DB'
  config_page: '/reference/resource-configs/duckdb-configs'
availability: local_free
---

<VersionBlock firstVersion="2.0">

# Подключение DuckDB к <Constant name="fusion" />

DuckDB с <Constant name="fusion_engine" /> — самый простой способ запустить проект dbt локально &mdash; без учётной записи хранилища и учётных данных. [DuckDB](https://duckdb.org) — это встраиваемая база данных, которая работает целиком внутри процесса, поэтому dbt подключается напрямую к локальному файлу `.duckdb` без дополнительной настройки.

DuckDB не требует аутентификации &mdash; она работает локально на вашем компьютере.

### Установка dbt-duckdb

Адаптер DuckDB встроен в v2. Чтобы начать работу, [установите dbt](/docs/local/install-dbt). В качестве интерфейса разработки рекомендуем использовать [расширение для VS Code](/docs/local/install-dbt?version=2).

#### Драйвер и расширения DuckDB {#driver-and-extensions}

<Constant name="fusion" /> поставляется со встроенным драйвером DuckDB. Однако этот драйвер _не_ поддерживает загрузку расширений DuckDB (например, `httpfs`, `parquet` или `spatial`).

Чтобы использовать [расширения DuckDB](https://duckdb.org/docs/current/extensions/overview) с <Constant name="fusion" />, установите драйвер DuckDB с помощью [`dbc`](https://docs.columnar.tech/dbc/#__tabbed_2_4). <Constant name="fusion" /> сначала проверяет наличие установленного в системе драйвера DuckDB и использует встроенный драйвер, если системный не найден.

Примеры подключения и общие настройки профиля приведены в разделе [Подключение к DuckDB](#connecting-to-duckdb).

### Ограничения

Некоторые возможности адаптера `dbt-duckdb` для <Constant name="core" /> пока не поддерживаются.

Текущая работа по обеспечению паритета возможностей адаптера и устранению пробелов в анализе SQL отслеживается в [dbt#14393](https://github.com/dbt-labs/dbt/issues/14393).

#### Статический анализ и локальные файлы данных

<Constant name="fusion_engine" /> выполняет статический анализ SQL-моделей, чтобы определять типы столбцов и происхождение данных без выполнения запросов. Если ваши модели обращаются к локальным файлам данных (CSV, Parquet или JSON) через функции DuckDB `read_csv()`, `read_parquet()` или `read_json()`, <Constant name="fusion" /> может не определить схему этих файлов на этапе анализа. В результате могут появляться предупреждения об определении типов или ошибки компиляции, даже если при выполнении запрос завершился бы успешно. Подробнее см. в разделе [Новые концепции](/docs/build/about-static-analysis).

</VersionBlock>

<VersionBlock lastVersion="1.99">

# Подключение DuckDB к <Constant name="core" />

Также доступно подключение, <ProductCard text="совместимое с dbt v2" url="/docs/local/connect-data-platform/duckdb-setup?version=2" />.

:::info Плагин сообщества

Некоторые возможности могут быть ограничены. Если вы хотите внести свой вклад, ознакомьтесь с исходным кодом в каждом из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

</VersionBlock>

## Подключение к DuckDB {#connecting-to-duckdb}

[DuckDB](https://duckdb.org) — это встраиваемая база данных, похожая на SQLite, но предназначенная для аналитики в стиле OLAP, а не OLTP. Подключить dbt к DuckDB можно несколькими способами в зависимости от того, где вы хотите хранить данные. Настройте `profiles.yml`, используя примеры из следующих разделов:

- [В памяти](#in-memory)
- [Локальный файл](#local-file)
- [MotherDuck](#motherduck)
- [Подключение дополнительных баз данных](#attaching-additional-databases)

В следующей таблице перечислены поля для использования в `profiles.yml`. Поле `type: duckdb` обязательно _всегда_. Используйте `path` для локальных файлов или строк подключения MotherDuck, а для базы данных в памяти укажите `:memory:` или не задавайте `path`.

| Поле профиля | Описание | Пример |
| --- | --- | --- |
| `type` | Тип адаптера. | `duckdb` |
| `path` | Путь к файлу базы данных DuckDB, строка подключения MotherDuck `md:` или `:memory:` для базы данных в памяти. | `./jaffle_shop.duckdb` |
| `schema` | Имя схемы, в которой dbt создаёт объекты. | `main` |
| `threads` | Количество потоков, используемых dbt для параллельного построения моделей. | `4` |
| `extensions` | Список [расширений DuckDB](https://duckdb.org/docs/extensions/overview), загружаемых при запуске. | `httpfs`, `parquet` |
| `settings` | Словарь [параметров конфигурации DuckDB](https://duckdb.org/docs/sql/configuration), задаваемых при запуске. | `s3_region: us-east-1` |

Если вы используете <Constant name="fusion" />, для загрузки расширений необходимо установить драйвер DuckDB с помощью [`dbc`](https://docs.columnar.tech/dbc/#__tabbed_2_4). Подробнее см. в разделе [Драйвер и расширения DuckDB](#driver-and-extensions).

### В памяти {#in-memory}

Для самой простой конфигурации достаточно указать в профиле только `type: duckdb`. При этом база данных работает в памяти &mdash; все данные теряются после завершения запуска. Это удобно для тестирования конвейеров и рабочих процессов, которые используют исключительно внешние файлы CSV, Parquet или JSON.

<File name='profiles.yml'>

```yaml
default:
  outputs:
    dev:
      type: duckdb
  target: dev
```

</File>

### Локальный файл {#local-file}

Чтобы сохранять данные между запусками, укажите в `path` путь к файлу `.duckdb` в локальной файловой системе. DuckDB автоматически создаст файл, если он не существует.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: './my_project.duckdb'
      schema: main   # optional; defaults to main
      threads: 4     # optional
```

</File>

Можно использовать относительный путь (отсчитываемый от расположения файла `profiles.yml`) или абсолютный путь. `dbt-duckdb` автоматически задаёт свойству `database` значение, равное имени файла без расширения (например, для `/tmp/a/dbfile.duckdb` свойство `database` получает значение `dbfile`).

### MotherDuck

В `dbt-duckdb 1.5.2` и более поздних версиях можно подключиться к экземпляру DuckDB, работающему в [MotherDuck](https://motherduck.com), указав в `path` строку подключения `md:`:

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: "md:my_db?motherduck_token={{ env_var('MOTHERDUCK_TOKEN') }}"
      threads: 4
```

</File>

Базы данных MotherDuck в целом работают так же, как локальные базы данных DuckDB, с некоторыми отличиями, описанными в [документации MotherDuck](https://motherduck.com/docs/architecture-and-capabilities#considerations-and-limitations). MotherDuck предварительно загружает распространённые расширения DuckDB, но не поддерживает загрузку сторонних расширений или пользовательских функций.

### Подключение дополнительных баз данных {#attaching-additional-databases}

DuckDB поддерживает [подключение дополнительных баз данных](https://duckdb.org/docs/sql/statements/attach.html), что позволяет читать и записывать данные в нескольких базах данных. Настройте дополнительные базы данных с помощью аргумента `attach` в профиле:

<File name='profiles.yml'>

```yaml
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
        - path: postgresql://username@hostname/dbname
          type: postgres
  target: dev
```

</File>

К подключённым базам данных можно обращаться по имени файла (без расширения) или по указанному вами `alias`. Аргумент `type` поддерживает значения `duckdb`, `sqlite` и `postgres`. Также можно передавать произвольные параметры с помощью словаря `options` &mdash; подробнее см. в разделе [Произвольные параметры ATTACH](/reference/resource-configs/duckdb-configs#arbitrary-attach-options).

Для локальных баз данных DuckLake используйте `ducklake:`. Для DuckLake под управлением MotherDuck используйте `md:` с `is_ducklake: true`. Подробнее см. в разделе [Конфигурация DuckLake](/reference/resource-configs/duckdb-configs#ducklake).

## Расширения

Вы можете загружать любые поддерживаемые [расширения DuckDB](https://duckdb.org/docs/extensions/overview), перечислив их в поле `extensions` своего профиля. Также можно задавать любые дополнительные [параметры конфигурации DuckDB](https://duckdb.org/docs/sql/configuration) в поле `settings`.

<File name='profiles.yml'>

```yaml
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

</File>

Также можно настроить расширения из других репозиториев, помимо основного (например, расширения сообщества), указав пару `name`/`repo`:

```yml
extensions:
  - httpfs
  - parquet
  - name: h3
    repo: community
  - name: uc_catalog
    repo: core_nightly
```

О настройке доступа к облачному хранилищу с помощью Secrets Manager в DuckDB или файловых систем fsspec см. на странице [Конфигурации DuckDB](/reference/resource-configs/duckdb-configs).

## Дополнительная информация

Информацию о специфичных для DuckDB настройках можно найти в [справочном руководстве по адаптеру DuckDB](/reference/resource-configs/duckdb-configs).

Исходный код адаптера доступен в [репозитории `dbt-duckdb`](https://github.com/duckdb/dbt-duckdb). Примечания к выпускам адаптера см. на [странице выпусков `dbt-duckdb`](https://github.com/duckdb/dbt-duckdb/releases).
