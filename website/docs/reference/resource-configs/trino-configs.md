---
title: "Конфигурации Starburst/Trino"
id: "trino-configs"
---

## Требования к кластеру

Назначенный кластер должен иметь прикрепленный каталог, в котором могут быть созданы, переименованы, изменены и удалены объекты, такие как таблицы и представления. Любой пользователь, подключающийся к кластеру с помощью dbt, также должен иметь те же разрешения для целевого каталога.

## Свойства сессии

С помощью кластера Starburst Enterprise, Starburst Galaxy или Trino вы можете [установить свойства сессии](https://trino.io/docs/current/sql/set-session.html), чтобы изменить текущую конфигурацию для вашей пользовательской сессии.

Стандартный способ определения свойств сессии — это использование поля `session_properties` в вашем `profiles.yml`. Это гарантирует, что все подключения dbt используют эти настройки по умолчанию.

Однако, чтобы временно изменить эти свойства сессии для конкретной модели dbt или группы моделей, вы можете использовать [dbt hook](/reference/resource-configs/pre-hook-post-hook) для установки свойств сессии на конкретной модели dbt. Например:

```sql
{{
  config(
    pre_hook="set session query_max_run_time='10m'"
  )
}}
```

## Свойства соединителя

Вы можете использовать свойства таблицы Starburst/Trino для настройки того, как вы хотите, чтобы ваши данные были представлены.

Для получения подробной информации о поддерживаемых свойствах для каждого поддерживаемого источника данных обратитесь к [Trino Connectors](https://trino.io/docs/current/connector.html) или [Starburst Catalog](https://docs.starburst.io/starburst-galaxy/catalogs/).

### Каталоги Hive

Целевой каталог, который использует соединитель Hive и службу метаданных (HMS), является типичным при работе с Starburst и dbt. Рекомендуется использовать следующие настройки для работы с dbt. Цель состоит в том, чтобы гарантировать, что dbt может выполнять часто выполняемые операторы `DROP` и `RENAME`.

```java
hive.metastore-cache-ttl=0s
hive.metastore-refresh-interval=5s
```

## Конфигурация формата файла

При использовании основанных на файлах соединителей, таких как Hive, пользователь может настроить аспекты соединителя, такие как формат, который используется, а также тип материализации.

Ниже настраивается таблица для материализации в виде набора партиционированных [Parquet](https://spark.apache.org/docs/latest/sql-data-sources-parquet.html) файлов.

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

## Seeds и подготовленные выражения

Команда [dbt seed](/docs/build/seeds) использует подготовленные выражения в [Starburst](https://docs.starburst.io/latest/sql/prepare.html)/[Trino](https://trino.io/docs/current/sql/prepare.html).

Подготовленные выражения — это шаблонные SQL-выражения, которые вы можете выполнять многократно с высокой эффективностью. Значения отправляются в отдельном поле, а не жестко закодированы в строке SQL. Это часто то, как фронтенды приложений структурируют свои операторы `INSERT` в OLTP-базе данных. Из-за этого часто бывает так, что подготовленные выражения имеют столько же переменных-заполнителей (параметров), сколько столбцов в целевой таблице.

Большинство seed-файлов имеют более одной строки и часто содержат тысячи строк. Это делает размер клиентского запроса таким же большим, как и количество параметров.

### Ограничение длины заголовка в Python HTTP клиенте

Вы можете столкнуться с сообщением об ошибке о лимите длины заголовка, если ваши подготовленные выражения имеют слишком много параметров. Это связано с тем, что лимит длины заголовка в HTTP-клиенте Python составляет `65536` байт.

Вы можете избежать этого верхнего предела, преобразовав большое подготовленное выражение в более мелкие выражения. dbt уже делает это, группируя весь seed-файл в группы строк — одна группа для определенного количества строк в CSV.

Предположим, у вас есть seed-файл с 20 столбцами, 600 строками и 12,000 параметрами. Вместо того чтобы создавать одно подготовленное выражение для этого, вы можете заставить dbt создать четыре подготовленных оператора `INSERT` с 150 строками и 3,000 параметрами.

Существует недостаток группировки строк вашей таблицы. Когда в seed-файле много столбцов (параметров), размер пакета должен быть очень маленьким.

Для адаптера `dbt-trino` макрос для размера пакета — это `trino__get_batch_size()`, и его значение по умолчанию составляет `1000`. Чтобы изменить это поведение по умолчанию, вы можете добавить этот макрос в ваш проект dbt:

<File name='macros/YOUR_MACRO_NAME.sql'>

```sql
{% macro trino__get_batch_size() %}
  {{ return(10000) }} -- Настройте это число по своему усмотрению
{% endmacro %}
```

</File>

Другой способ избежать ограничения длины заголовка — установить `prepared_statements_enabled` в `true` в вашем профиле dbt; однако это считается устаревшим поведением и может быть удалено в будущих версиях.

## Материализации
### Таблица

Адаптер `dbt-trino` поддерживает эти режимы в материализации `table` (и [полные обновления](/reference/commands/run#refresh-incremental-models) в материализации `incremental`), которые вы можете настроить с помощью `on_table_exists`:

- `rename` — Создает промежуточную таблицу, переименовывает целевую таблицу в резервную и переименовывает промежуточную таблицу в целевую.
- `drop` — Удаляет и воссоздает таблицу. Это преодолевает ограничение на переименование таблиц в AWS Glue.
- `replace` — Заменяет таблицу с использованием оператора CREATE OR REPLACE. Поддержка замены таблицы варьируется в зависимости от соединителей. Обратитесь к документации соединителя для получения подробной информации.

Если CREATE OR REPLACE поддерживается в подлежащем соединителе, рекомендуется использовать `replace`. В противном случае рекомендуемая материализация `table` использует `on_table_exists = 'rename'` и также является значением по умолчанию. Вы можете изменить эту конфигурацию по умолчанию, отредактировав _один_ из этих файлов:
- SQL-файл для вашей модели
- конфигурационный файл `dbt_project.yml`

Следующие примеры настраивают материализацию `table` на `drop`: 

<File name='models/YOUR_MODEL_NAME.sql'>

```sql
{{
  config(
    materialized = 'table',
    on_table_exists = 'drop'
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

Если вы используете материализацию `table` и `on_table_exists = 'rename'` с AWS Glue, вы можете столкнуться с сообщением об ошибке. Вы можете преодолеть ограничение на переименование таблиц, используя `drop`: 

```sh
TrinoUserError(type=USER_ERROR, name=NOT_SUPPORTED, message="Переименование таблицы пока не поддерживается службой Glue")
```

### Представление

Адаптер `dbt-trino` поддерживает эти режимы безопасности в материализации `view`, которые вы можете настроить с помощью `view_security`:
- `definer`
- `invoker`

Для получения дополнительной информации о режимах безопасности в представлениях смотрите [Безопасность](https://trino.io/docs/current/sql/create-view.html#security) в документации Trino.

По умолчанию материализация `view` использует `view_security = 'definer'`. Вы можете изменить эту конфигурацию по умолчанию, отредактировав _один_ из этих файлов:
- SQL-файл для вашей модели
- конфигурационный файл `dbt_project.yml`

Например, эти настройки конфигурируют режим безопасности на `invoker`:  

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

### Инкрементальная

Использование инкрементальной модели ограничивает объем данных, которые необходимо преобразовать, что значительно сокращает время выполнения ваших преобразований. Это улучшает производительность и снижает затраты на вычисления.

```sql
{{
    config(
      materialized = 'incremental', 
      unique_key='<опционально>',
      incremental_strategy='<опционально>',)
}}
select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```

Используйте свойство `+on_schema_change`, чтобы определить, как dbt-trino должен обрабатывать изменения столбцов. Для получения дополнительной информации об этом свойстве смотрите [изменения столбцов](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/configuring-incremental-models#what-if-the-columns-of-my-incremental-model-change). 

Если ваш соединитель не поддерживает представления, установите свойство `+views_enabled` в `false`.

Вы можете определить, как модель должна быть перестроена в процессе `full-refresh`, указав конфигурацию `on_table_exists`. Опции такие же, как описано в разделе [материализация таблицы](/reference/resource-configs/trino-configs#table).

#### Стратегия добавления

Стратегия инкремента по умолчанию — `append`. `append` только добавляет новые записи на основе условия, указанного в условном блоке `is_incremental()`.

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

#### Стратегия удаления+вставки

С помощью стратегии инкремента `delete+insert` вы можете указать dbt использовать двухэтапный инкрементный подход. Сначала он удаляет записи, обнаруженные через настроенный блок `is_incremental()`, а затем повторно вставляет их.

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

#### Стратегия слияния

С помощью стратегии инкремента `merge` dbt-trino строит [оператор MERGE Trino](https://trino.io/docs/current/sql/merge.html), чтобы `insert` новые записи и `update` существующие записи на основе свойства `unique_key`.

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

Имейте в виду, что есть некоторые соединители Trino, которые не поддерживают `MERGE` или имеют ограниченную поддержку.

#### Инкрементальное перезаписывание на моделях Hive

Если к вашей целевой инкрементальной модели обращается [соединитель Hive](https://trino.io/docs/current/connector/hive.html), вы можете смоделировать оператор `INSERT OVERWRITE`, используя настройку `insert-existing-partitions-behavior` в конфигурации соединителя Hive в Trino:

```ini
<hive-catalog-name>.insert-existing-partitions-behavior=OVERWRITE
```

Ниже приведен пример конфигурации Hive, который устанавливает функциональность `OVERWRITE` для соединителя Hive с именем `minio`:

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

`dbt-trino` перезаписывает существующие партиции в целевой модели, которые соответствуют подготовленным данным. Он добавляет оставшиеся партиции в целевую модель. Эта функциональность работает на инкрементальных моделях, которые используют партиционирование. Например:  

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

### Материализованное представление

Адаптер `dbt-trino` поддерживает [материализованные представления](https://trino.io/docs/current/sql/create-materialized-view.html) и обновляет их для каждого последующего `dbt run`, который вы выполняете. Для получения дополнительной информации смотрите [REFRESH MATERIALIZED VIEW](https://trino.io/docs/current/sql/refresh-materialized-view.html) в документации Trino.

Вы также можете определить пользовательские свойства для материализованного представления через конфигурацию `properties`.

Эта материализация поддерживает конфигурацию и флаг [full_refresh](https://docs.getdbt.com/reference/resource-configs/full_refresh).
Когда вы хотите перестроить свое материализованное представление (например, при изменении основного SQL-запроса), выполните `dbt run --full-refresh`.

Вы можете создать материализованное представление, отредактировав _один_ из этих файлов:
- SQL-файл для вашей модели
- конфигурационный файл `dbt_project.yml`

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

## Снимки

[Снимки в dbt](/docs/build/snapshots) зависят от макроса `current_timestamp`, который по умолчанию возвращает временную метку с миллисекундной точностью (3 цифры). Существуют некоторые соединители для Trino, которые не поддерживают эту точность временной метки (`TIMESTAMP(3) WITH TIME ZONE`), такие как Iceberg.

Чтобы изменить точность временной метки, вы можете определить свой собственный [макрос](/docs/build/jinja-macros). Например, это определяет новый макрос `trino__current_timestamp()` с точностью микросекунд (6 цифр): 

<File name='macros/YOUR_MACRO_NAME.sql'>

```sql
{% macro trino__current_timestamp() %}
    current_timestamp(6)
{% endmacro %}
```
</File>

## Права

Используйте [права](/reference/resource-configs/grants) для управления доступом к наборам данных, которые вы создаете с помощью dbt. Вы можете использовать права с [Starburst Enterprise](https://docs.starburst.io/latest/security/biac-overview.html), [Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/security/access-control.html) и Hive ([sql-standard](https://trino.io/docs/current/connector/hive-security.html)).

Чтобы реализовать разрешения доступа, определите права как конфигурации ресурсов для каждой модели, seed и снимка. Определите стандартные права, которые применяются ко всему проекту, в вашем `dbt_project.yml`, и определите специфические для модели права в каждом SQL или YAML файле модели.
<File name='dbt_project.yml'>

```yaml
models:
  - name: NAME_OF_YOUR_MODEL
    config:
      grants:
        select: ['reporter', 'bi']
```
</File>

## Контракты моделей

Адаптер `dbt-trino` поддерживает [контракты моделей](/docs/collaborate/govern/model-contracts). В настоящее время поддерживаются только [ограничения](/reference/resource-properties/constraints) с `type` как `not_null`.
Перед использованием ограничений `not_null` в вашей модели убедитесь, что подлежащий соединитель поддерживает `not null`, чтобы избежать возникновения ошибок.