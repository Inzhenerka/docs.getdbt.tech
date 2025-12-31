---
title: "Конфигурации Starburst/Trino"
id: "trino-configs"
---

## Требования к кластеру {#cluster-requirements}

Назначенный кластер должен иметь прикрепленный каталог, в котором можно создавать, переименовывать, изменять и удалять объекты, такие как таблицы и представления. Любой пользователь, подключающийся к кластеру с помощью dbt, также должен иметь эти же разрешения для целевого каталога.

## Свойства сессии {#session-properties}

С кластерами Starburst Enterprise, Starburst Galaxy или Trino вы можете [устанавливать свойства сессии](https://trino.io/docs/current/sql/set-session.html) для изменения текущей конфигурации вашей пользовательской сессии.

Стандартный способ определения свойств сессии — это использование поля `session_properties` в вашем `profiles.yml`. Это гарантирует, что все подключения dbt будут использовать эти настройки по умолчанию.

Однако, чтобы временно изменить эти свойства сессии для конкретной модели dbt или группы моделей, вы можете использовать [хук dbt](/reference/resource-configs/pre-hook-post-hook) для установки свойств сессии на конкретной модели dbt. Например:

```sql
{{
  config(
    pre_hook="set session query_max_run_time='10m'"
  )
}}
```

## Свойства коннектора {#connector-properties}

Вы можете использовать свойства таблиц Starburst/Trino для настройки того, как вы хотите, чтобы ваши данные были представлены.

Для получения информации о поддерживаемых функциях для каждого поддерживаемого источника данных обратитесь к [Trino Connectors](https://trino.io/docs/current/connector.html) или [Starburst Catalog](https://docs.starburst.io/starburst-galaxy/catalogs/).

### Каталоги Hive {#hive-catalogs}

Целевой каталог, использующий коннектор Hive и службу метаданных (HMS), является типичным при работе с Starburst и dbt. Следующие настройки рекомендуются для работы с dbt. Цель состоит в том, чтобы гарантировать, что dbt может выполнять часто используемые операторы `DROP` и `RENAME`.

```java
hive.metastore-cache-ttl=0s
hive.metastore-refresh-interval=5s
```

## Конфигурация формата файла {#file-format-configuration}

При использовании коннекторов на основе файлов, таких как Hive, пользователь может настроить аспекты коннектора, такие как используемый формат, а также тип материализации.

Ниже представлена конфигурация таблицы, которая будет материализована как набор разделенных файлов [Parquet](https://spark.apache.org/docs/latest/sql-data-sources-parquet.html).

```sql
{{
  config(
    materialized='table',
    properties= {
      "format": "'PARQUET'",
      "partitioning": "ARRAY['bucket(id, 2)']",
    }
  )
}}
```

## Seeds и подготовленные операторы {#seeds-and-prepared-statements}

Команда [dbt seed](/docs/build/seeds) использует подготовленные операторы в [Starburst](https://docs.starburst.io/latest/sql/prepare.html)/[Trino](https://trino.io/docs/current/sql/prepare.html).

Подготовленные операторы — это шаблонные SQL-операторы, которые можно выполнять многократно с высокой эффективностью. Значения передаются в отдельном поле, а не жестко кодируются в самой строке SQL. Это часто используется в приложениях для структурирования операторов `INSERT` в OLTP базах данных. Из-за этого подготовленные операторы часто имеют столько же переменных-заполнителей (параметров), сколько и столбцов в целевой таблице.

Большинство файлов seed содержат более одной строки, и часто тысячи строк. Это делает размер клиентского запроса таким же большим, как и количество параметров.

### Ограничение длины строки заголовка в клиенте HTTP на Python {#header-line-length-limit-in-python-http-client}

Вы можете столкнуться с сообщением об ошибке об ограничении длины строки заголовка, если в ваших подготовленных операторах слишком много параметров. Это связано с тем, что ограничение длины строки заголовка в HTTP-клиенте Python составляет `65536` байт.

Вы можете избежать этого ограничения, преобразовав большой подготовленный оператор в более мелкие операторы. dbt уже делает это, группируя весь файл seed в группы строк — одна группа для определенного количества строк в CSV.

Предположим, у вас есть файл seed с 20 столбцами, 600 строками и 12 000 параметров. Вместо создания одного подготовленного оператора для этого, вы можете заставить dbt создать четыре подготовленных оператора `INSERT` с 150 строками и 3 000 параметров.

Есть недостаток в группировке строк вашей таблицы. Когда в файле seed много столбцов (параметров), размер пакета должен быть очень маленьким.

Для адаптера `dbt-trino` макрос для размера пакета — это `trino__get_batch_size()`, и его значение по умолчанию — `1000`. Чтобы изменить это поведение по умолчанию, вы можете добавить этот макрос в ваш проект dbt:

<File name='macros/YOUR_MACRO_NAME.sql'>

```sql
{% macro trino__get_batch_size() %}
  {{ return(10000) }} -- Измените это число по своему усмотрению
{% endmacro %}
```

</File>

Другой способ избежать ограничения длины строки заголовка — установить `prepared_statements_enabled` в `true` в вашем профиле dbt; однако это считается устаревшим поведением и может быть удалено в будущих выпусках.

## Материализации {#materializations}
### Таблица {#table}

Адаптер `dbt-trino` поддерживает эти режимы в материализации `table` (и [полные обновления](/reference/commands/run#refresh-incremental-models) в материализации `incremental`), которые вы можете настроить с помощью `on_table_exists`:

- `rename` — Создаёт промежуточную таблицу, переименовывает целевую таблицу в резервную, а затем переименовывает промежуточную таблицу в целевую.
- `drop` — Удаляет и заново создаёт таблицу. Это позволяет обойти ограничение на переименование таблиц в AWS Glue.
- `replace` — Заменяет таблицу с использованием конструкции CREATE OR REPLACE. Поддержка замены таблиц различается в зависимости от коннектора. Подробности см. в документации соответствующего коннектора.
- `skip` — Полностью пропускает материализацию таблицы, используя конструкцию CREATE TABLE IF NOT EXISTS.

Если CREATE OR REPLACE поддерживается в базовом коннекторе, `replace` является рекомендуемым вариантом. В противном случае, рекомендуемая материализация `table` использует `on_table_exists = 'rename'` и также является значением по умолчанию. Вы можете изменить эту конфигурацию по умолчанию, отредактировав _один_ из этих файлов:
- SQL-файл для вашей модели
- файл конфигурации `dbt_project.yml`

Следующие примеры настраивают материализацию `table` на `drop`: 

<File name='models/YOUR_MODEL_NAME.sql'>

```sql
{{
  config(
    materialized = 'table',
    on_table_exists = 'drop`
  )
}}
```

</File>


<File name='dbt_project.yml'>

```yaml 
models:
  path:
    materialized: table
    +on_table_exists: drop
```
</File>

Если вы используете материализацию `table` и `on_table_exists = 'rename'` с AWS Glue, вы можете столкнуться с этим сообщением об ошибке. Вы можете преодолеть ограничение на переименование таблицы, используя `drop`: 

```sh
TrinoUserError(type=USER_ERROR, name=NOT_SUPPORTED, message="Table rename is not yet supported by Glue service")
```

### Представление {#view}

Адаптер `dbt-trino` поддерживает эти режимы безопасности в материализации `view`, которые вы можете настроить с помощью `view_security`:
- `definer`
- `invoker`

Для получения более подробной информации о режимах безопасности в представлениях, см. [Security](https://trino.io/docs/current/sql/create-view.html#security) в документации Trino.

По умолчанию, материализация `view` использует `view_security = 'definer'`. Вы можете изменить эту конфигурацию по умолчанию, отредактировав _один_ из этих файлов:
- SQL-файл для вашей модели
- файл конфигурации `dbt_project.yml`

Например, эти настройки изменяют режим безопасности на `invoker`:  

<File name='models/YOUR_MODEL_NAME.sql'>

```sql
{{
  config(
    materialized = 'view',
    view_security = 'invoker'
  )
}}
```

</File>

<File name='dbt_project.yml'>

```yaml 
models:
  path:
    materialized: view
    +view_security: invoker
```
</File>


### Инкрементальная {#incremental}

Использование инкрементальной модели ограничивает объем данных, которые необходимо преобразовать, что значительно сокращает время выполнения ваших преобразований. Это улучшает производительность и снижает затраты на вычисления.

```sql
{{
    config(
      materialized = 'incremental', 
      unique_key='<optional>',
      incremental_strategy='<optional>',)
}}
select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```

Используйте свойство `+on_schema_change`, чтобы определить, как dbt-trino должен обрабатывать изменения колонок. Подробнее об этом свойстве см. в разделе [column changes](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change).

Если ваш коннектор не поддерживает представления, установите свойство `+views_enabled` в `false`.

Вы можете решить, как модель должна быть перестроена при выполнении `full-refresh`, указав конфигурацию `on_table_exists`. Варианты такие же, как описано в [разделе материализации таблицы](/reference/resource-configs/trino-configs#table)

#### стратегия append {#append-strategy}

Стратегия инкрементальной загрузки по умолчанию — `append`. `append` добавляет только новые записи на основе условия, указанного в условном блоке `is_incremental()`.

```sql
{{
    config(
      materialized = 'incremental')
}}
select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```

#### стратегия delete+insert {#deleteinsert-strategy}

С помощью стратегии инкрементальной загрузки `delete+insert` вы можете указать dbt использовать двухэтапный инкрементальный подход. Сначала он удаляет записи, обнаруженные через настроенный блок `is_incremental()`, затем повторно вставляет их.

```sql
{{
    config(
      materialized = 'incremental',
      unique_key='user_id',
      incremental_strategy='delete+insert',
      )
}}
select * from {{ ref('users') }}
{% if is_incremental() %}
  where updated_ts > (select max(updated_ts) from {{ this }})
{% endif %}
```

#### стратегия merge {#merge-strategy}

С помощью стратегии инкрементальной загрузки `merge` dbt-trino создает [оператор MERGE Trino](https://trino.io/docs/current/sql/merge.html) для `вставки` новых записей и `обновления` существующих записей на основе свойства `unique_key`.

Если `unique_key` не уникален, вы можете использовать стратегию `delete+insert`.

```sql
{{
    config(
      materialized = 'incremental',
      unique_key='user_id',
      incremental_strategy='merge',
      )
}}
select * from {{ ref('users') }}
{% if is_incremental() %}
  where updated_ts > (select max(updated_ts) from {{ this }})
{% endif %}
```

Имейте в виду, что некоторые коннекторы Trino не поддерживают `MERGE` или имеют ограниченную поддержку.

#### Инкрементальная перезапись на моделях Hive {#incremental-overwrite-on-hive-models}

Если есть [коннектор Hive](https://trino.io/docs/current/connector/hive.html), обращающийся к вашей целевой инкрементальной модели, вы можете имитировать оператор `INSERT OVERWRITE`, используя настройку `insert-existing-partitions-behavior` в конфигурации коннектора Hive в Trino:

```ini
<hive-catalog-name>.insert-existing-partitions-behavior=OVERWRITE
```

Ниже приведен пример конфигурации Hive, которая устанавливает функциональность `OVERWRITE` для коннектора Hive под названием `minio`:

```yaml
trino-incremental-hive:
  target: dev
  outputs:
    dev:
      type: trino
      method: none
      user: admin
      password:
      catalog: minio
      schema: tiny
      host: localhost
      port: 8080
      http_scheme: http
      session_properties:
        minio.insert_existing_partitions_behavior: OVERWRITE
      threads: 1
```

`dbt-trino` перезаписывает существующие разделы в целевой модели, которые соответствуют подготовленным данным. Он добавляет оставшиеся разделы в целевую модель. Эта функциональность работает на инкрементальных моделях, использующих разбиение. Например:  

```sql
{{
    config(
        materialized = 'incremental',
        properties={
          "format": "'PARQUET'",
          "partitioned_by": "ARRAY['day']",
        }
    )
}}
```

### Материализованное представление {#materialized-view}

Адаптер `dbt-trino` поддерживает [материализованные представления](https://trino.io/docs/current/sql/create-materialized-view.html) и обновляет их для каждого последующего `dbt run`, который вы выполняете. Для получения дополнительной информации см. [REFRESH MATERIALIZED VIEW](https://trino.io/docs/current/sql/refresh-materialized-view.html) в документации Trino.

Вы также можете определить пользовательские свойства для материализованного представления через конфигурацию `properties`.

Эта материализация поддерживает конфигурацию и флаг [full_refresh](/reference/resource-configs/full_refresh).

Всякий раз, когда вам нужно пересобрать материализованное представление (например, при изменении исходного SQL‑запроса), выполните команду `dbt run --full-refresh`.

Вы можете создать материализованное представление, отредактировав _один_ из этих файлов:
- SQL-файл для вашей модели
- файл конфигурации `dbt_project.yml`

Следующие примеры создают материализованное представление в формате Parquet: 

<File name='models/YOUR_MODEL_NAME.sql'>

```sql
{{
  config(
    materialized = 'materialized_view',
    properties = {
      'format': "'PARQUET'"
    },
  )
}}
```

</File>


<File name='dbt_project.yml'>

```yaml 
models:
  path:
    materialized: materialized_view
    properties:
      format: "'PARQUET'"
```
</File>

## Снимки {#snapshots}

[Снимки в dbt](/docs/build/snapshots) зависят от макроса `current_timestamp`, который по умолчанию возвращает временную метку с точностью до миллисекунд (3 цифры). Некоторые коннекторы для Trino не поддерживают такую точность временной метки (`TIMESTAMP(3) WITH TIME ZONE`), например, Iceberg.

Чтобы изменить точность временной метки, вы можете определить свой собственный [макрос](/docs/build/jinja-macros). Например, это определяет новый макрос `trino__current_timestamp()` с точностью до микросекунд (6 цифр): 

<File name='macros/YOUR_MACRO_NAME.sql'>

```sql
{% macro trino__current_timestamp() %}
    current_timestamp(6)
{% endmacro %}
```
</File>

## Гранты {#grants}

Используйте [гранты](/reference/resource-configs/grants) для управления доступом к наборам данных, которые вы создаете с помощью dbt. Вы можете использовать гранты с [Starburst Enterprise](https://docs.starburst.io/latest/security/biac-overview.html), [Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/security/access-control.html) и Hive ([sql-standard](https://trino.io/docs/current/connector/hive-security.html)).

Чтобы реализовать разрешения на доступ, определите гранты как конфигурации ресурсов для каждой модели, seed и снимка. Определите гранты по умолчанию, которые применяются ко всему проекту, в вашем `dbt_project.yml`, и определите гранты, специфичные для модели, в каждом SQL или YAML файле модели.
<File name='dbt_project.yml'>

```yaml
models:
  - name: NAME_OF_YOUR_MODEL
    config:
      grants:
        select: ['reporter', 'bi']
```
</File>

## Контракты моделей {#model-contracts}

Адаптер `dbt-trino` поддерживает [контракты моделей](/docs/mesh/govern/model-contracts). В настоящее время поддерживаются только [ограничения](/reference/resource-properties/constraints) с типом `not_null`.

Перед использованием ограничений `not_null` в модели убедитесь, что используемый коннектор поддерживает `not null`, чтобы избежать возникновения ошибок.
