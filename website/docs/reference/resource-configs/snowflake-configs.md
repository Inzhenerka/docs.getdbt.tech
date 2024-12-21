---
title: "Конфигурации Snowflake"
id: "snowflake-configs"
description: "Конфигурации Snowflake - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
---

<!----
To-do:
- use the reference doc structure for this article / split into separate articles
--->

<VersionBlock firstVersion="1.9">

## Формат таблиц Iceberg <Lifecycle status="beta"/>

Адаптер dbt-snowflake поддерживает формат таблиц Iceberg. Он доступен для трех материализаций Snowflake:

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental)
- [Dynamic](#dynamic-tables)

На данный момент, чтобы создать таблицы Iceberg, необходимо реализовать [флаг поведения](/reference/global-configs/behavior-changes) из-за влияния на производительность, связанного с использованием таблиц Iceberg. Snowflake не поддерживает `is_iceberg` в запросе `Show Objects`, на который dbt полагается для метаданных.

Чтобы использовать Iceberg, установите флаг `enable_iceberg_materializations` в значение `True` в вашем dbt_project.yml:

<File name='dbt_project.yml'>

```yaml

flags:
  enable_iceberg_materializations: True

```

</File>

Поддерживаются следующие конфигурации.
Для получения дополнительной информации ознакомьтесь с документацией Snowflake по [`CREATE ICEBERG TABLE` (Snowflake как каталог)](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake).

| Поле | Тип   | Обязательно | Описание   | Пример ввода | Примечание   |
| ------ | ----- | -------- | ------------- | ------------ | ------ |
| Формат таблицы    | Строка | Да     | Настраивает формат таблицы объектов.  | `iceberg`  | `iceberg` — единственное допустимое значение.    |
| Внешний объем       | Строка | Да(*)   | Указывает идентификатор (имя) внешнего объема, где Snowflake записывает метаданные и файлы данных таблицы Iceberg. | `my_s3_bucket`            | *Не нужно указывать это, если у аккаунта, базы данных или схемы уже есть связанный внешний объем. [Подробнее](https://docs.snowflake.com/en/sql-reference/sql/create-iceberg-table-snowflake#:~:text=Snowflake%20Table%20Structures.-,external_volume) |
| Подпуть базового расположения | Строка | Нет       | Необязательный суффикс для добавления к пути `base_location`, который dbt автоматически указывает.     | `jaffle_marketing_folder` | Мы рекомендуем не указывать это. Изменение этого параметра приводит к созданию новой таблицы Iceberg. См. [Базовое расположение](#base-location) для получения дополнительной информации.                                                                                                  |

### Пример конфигурации

Чтобы настроить материализацию таблицы Iceberg в dbt, обратитесь к примеру конфигурации:

<File name='models/<modelname>.sql'>

```sql

{{
  config(
    materialized = "table",
    table_format="iceberg",
    external_volume="s3_iceberg_snow",
  )
}}

select * from {{ ref('raw_orders') }}

```

</File>

### Базовое расположение

DDL Snowflake `CREATE ICEBERG TABLE` требует указания `base_location`. dbt определяет этот параметр от имени пользователя, чтобы упростить использование и обеспечить базовую изоляцию данных таблицы в пределах `EXTERNAL VOLUME`. Поведение по умолчанию в dbt — предоставлять строку `base_location` в формате: `_dbt/{SCHEMA_NAME}/{MODEL_NAME}`

#### Подпуть базового расположения
Мы рекомендуем использовать автоматически сгенерированное dbt `base_location`. Однако, если вам нужно настроить результирующее `base_location`, dbt позволяет пользователям настроить `base_location_subpath`. При указании подпуть добавляется в конец ранее описанного шаблона для генерации строки `base_location`.

Например, `config(base_location_subpath="prod")` создаст `base_location` в формате `_dbt/{SCHEMA_NAME}/{MODEL_NAME}/prod/`.

Теоретический (но не рекомендуемый) случай использования — повторное использование `EXTERNAL VOLUME` при сохранении изоляции между средами разработки и производства. Мы не рекомендуем это, так как разрешения на хранение должны быть настроены на внешнем объеме и базовом хранилище, а не на путях, которые любой аналитический инженер может изменить.

#### Обоснование

dbt управляет `base_location` от имени пользователей, чтобы обеспечить соблюдение лучших практик. С таблицами формата Iceberg, управляемыми Snowflake, пользователь владеет и поддерживает хранение данных таблиц во внешнем хранилище (объявленный `external volume`). Параметр `base_location` указывает, где записывать данные в пределах внешнего объема. Каталог Snowflake Iceberg отслеживает вашу таблицу Iceberg независимо от того, где находятся данные в объявленном `external volume` и предоставленном `base_location`. Однако Snowflake позволяет передавать что угодно в поле `base_location`, включая пустую строку, даже повторно используя тот же путь для нескольких таблиц. Такое поведение может привести к будущим техническим долгам, так как это ограничит возможность:

- Навигации по базовому объектному хранилищу (S3/Azure blob)
- Чтения таблиц Iceberg через интеграцию с объектным хранилищем
- Предоставления доступа к таблицам на уровне схемы через объектное хранилище
- Использования краулера, направленного на таблицы в пределах внешнего объема, для создания нового каталога с помощью другого инструмента

Чтобы поддерживать лучшие практики, мы настаиваем на вводе. В настоящее время мы не поддерживаем переопределение ввода `base location` по умолчанию, но рассмотрим это на основе отзывов пользователей.

Вкратце, dbt-snowflake не поддерживает произвольное определение `base_location` для таблиц Iceberg. Вместо этого dbt по умолчанию записывает ваши таблицы с префиксом `_dbt/{SCHEMA_NAME}/{TABLE_NAME}`, чтобы обеспечить более легкую наблюдаемость и аудит объектного хранилища.

### Ограничения

Существуют некоторые ограничения в реализации, о которых вам нужно знать:

- Используя таблицы Iceberg с dbt, результатом является материализация вашего запроса в Iceberg. Однако часто dbt создает промежуточные объекты как временные и переходные таблицы для определенных материализаций, таких как инкрементные. Невозможно настроить эти временные объекты также в формате Iceberg. Вы можете увидеть, что в логах создаются не-Iceberg таблицы для поддержки определенных материализаций, но они будут удалены после использования.
- Вы не можете инкрементно обновить существующую инкрементную модель, чтобы она стала таблицей Iceberg. Для этого необходимо полностью перестроить таблицу с флагом `--full-refresh`.

</VersionBlock>

## Динамические таблицы

Адаптер Snowflake поддерживает [динамические таблицы](https://docs.snowflake.com/en/user-guide/dynamic-tables-about).
Эта материализация специфична для Snowflake, что означает, что любая конфигурация модели, которая обычно идет вместе с `dbt-core` (например, как с `view`), может быть недоступна для динамических таблиц. Этот разрыв будет уменьшаться в будущих патчах и версиях.
Хотя эта материализация специфична для Snowflake, она во многом следует реализации [материализованных представлений](/docs/build/materializations#Materialized-View).
В частности, динамические таблицы имеют доступ к настройке `on_configuration_change`.
Динамические таблицы поддерживаются с следующими параметрами конфигурации:

<VersionBlock lastVersion="1.8">

| Параметр          | Тип       | Обязательно | По умолчанию     | Поддержка мониторинга изменений |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | нет       | `apply`     | n/a                       |
| [`target_lag`](#target-lag)      | `<string>` | да      |        | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | да      |       | alter  |
</VersionBlock>

<VersionBlock firstVersion="1.9">

| Параметр          | Тип       | Обязательно | По умолчанию     | Поддержка мониторинга изменений |
|--------------------|------------|----------|-------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>` | нет       | `apply`     | n/a                       |
| [`target_lag`](#target-lag)      | `<string>` | да      |        | alter          |
| [`snowflake_warehouse`](#configuring-virtual-warehouses)   | `<string>` | да      |       | alter  |
| [`refresh_mode`](#refresh-mode)       | `<string>` | нет       | `AUTO`      | refresh        |
| [`initialize`](#initialize)     | `<string>` | нет       | `ON_CREATE` | n/a   |

</VersionBlock>

<VersionBlock lastVersion="1.8">

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Блок конфигурации', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): dynamic_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): dynamic_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [target_lag](#target-lag): downstream | <time-delta>
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",

) }}

```

</File>

</TabItem>

</Tabs>

</VersionBlock>

<VersionBlock firstVersion="1.9">

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Блок конфигурации', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): dynamic_table
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[target_lag](#target-lag): downstream | <time-delta>
    [+](/reference/resource-configs/plus-prefix)[snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
    [+](/reference/resource-configs/plus-prefix)[refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL
    [+](/reference/resource-configs/plus-prefix)[initialize](#initialize): ON_CREATE | ON_SCHEDULE 

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): dynamic_table
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [target_lag](#target-lag): downstream | <time-delta>
      [snowflake_warehouse](#configuring-virtual-warehouses): <warehouse-name>
      [refresh_mode](#refresh-mode): AUTO | FULL | INCREMENTAL 
      [initialize](#initialize): ON_CREATE | ON_SCHEDULE 

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja

{{ config(
    [materialized](/reference/resource-configs/materialized)="dynamic_table",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [target_lag](#target-lag)="downstream" | "<integer> seconds | minutes | hours | days",
    [snowflake_warehouse](#configuring-virtual-warehouses)="<warehouse-name>",
    [refresh_mode](#refresh-mode)="AUTO" | "FULL" | "INCREMENTAL",
    [initialize](#initialize)="ON_CREATE" | "ON_SCHEDULE", 

) }}

```

</File>

</TabItem>

</Tabs>

</VersionBlock>

Узнайте больше об этих параметрах в [документации Snowflake](https://docs.snowflake.com/en/sql-reference/sql/create-dynamic-table):

### Целевое отставание

Snowflake позволяет два сценария конфигурации для планирования автоматических обновлений:
- **На основе времени** &mdash; Укажите значение в формате `<int> { seconds | minutes | hours | days }`. Например, если динамическую таблицу нужно обновлять каждые 30 минут, используйте `target_lag='30 minutes'`.
- **Нисходящий поток** &mdash; Применимо, когда динамическая таблица ссылается на другие динамические таблицы. В этом сценарии `target_lag='downstream'` позволяет контролировать обновления на целевом уровне, а не на каждом уровне.

Узнайте больше о `target_lag` в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh#understanding-target-lag). Обратите внимание, что Snowflake поддерживает целевое отставание в 1 минуту или дольше.

<VersionBlock firstVersion="1.9">

### Режим обновления

Snowflake позволяет три варианта режима обновления:
- **AUTO** &mdash; По умолчанию обеспечивает инкрементное обновление динамической таблицы. Если оператор `CREATE DYNAMIC TABLE` не поддерживает режим инкрементного обновления, динамическая таблица автоматически создается в режиме полного обновления.
- **FULL** &mdash; Обеспечивает полное обновление динамической таблицы, даже если динамическая таблица может быть обновлена инкрементно.
- **INCREMENTAL** &mdash; Обеспечивает инкрементное обновление динамической таблицы. Если запрос, лежащий в основе динамической таблицы, не может выполнить инкрементное обновление, создание динамической таблицы завершается с ошибкой.

Узнайте больше о `refresh_mode` в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

### Инициализация

Snowflake позволяет два варианта инициализации:
- **ON_CREATE** &mdash; Обновляет динамическую таблицу синхронно при создании. Если это обновление не удается, создание динамической таблицы завершается с ошибкой.
- **ON_SCHEDULE** &mdash; Обновляет динамическую таблицу при следующем запланированном обновлении.

Узнайте больше о `initialize` в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-refresh).

</VersionBlock>

### Ограничения

Как и в случае с материализованными представлениями на большинстве платформ данных, существуют ограничения, связанные с динамическими таблицами. Некоторые из них, которые стоит отметить, включают:

- SQL динамической таблицы имеет [ограниченный набор функций](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#query-constructs-not-currently-supported-in-dynamic-tables).
- SQL динамической таблицы не может быть обновлен; динамическая таблица должна пройти через `--full-refresh` (DROP/CREATE).
- Динамические таблицы не могут быть ниже по потоку от: материализованных представлений, внешних таблиц, потоков.
- Динамические таблицы не могут ссылаться на представление, которое находится ниже по потоку от другой динамической таблицы.

Найдите больше информации об ограничениях динамических таблиц в [документации Snowflake](https://docs.snowflake.com/en/user-guide/dynamic-tables-tasks-create#dynamic-table-limitations-and-supported-functions).

Для ограничений dbt, эти функции dbt не поддерживаются:
- [Контракты моделей](/docs/collaborate/govern/model-contracts)
- [Конфигурация копирования грантов](/reference/resource-configs/snowflake-configs#copying-grants)

## Временные таблицы

Инкрементные слияния таблиц для Snowflake предпочитают использовать `view`, а не `temporary table`. Причина в том, чтобы избежать шага записи в базу данных, который инициировала бы временная таблица, и сэкономить время компиляции.

Однако остаются некоторые ситуации, когда временная таблица может достичь результатов быстрее или безопаснее. Конфигурация `tmp_relation_type` позволяет вам выбрать временные таблицы для инкрементных сборок. Это определяется как часть конфигурации модели.

Чтобы гарантировать точность, инкрементная модель, использующая стратегию `delete+insert` с определенным `unique_key`, требует временной таблицы; попытка изменить это на представление приведет к ошибке.

Определено в YAML проекта:

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  <resource-path>:
    +tmp_relation_type: table | view ## Если не определено, по умолчанию используется view.
  
```

</File>

В формате конфигурации для SQL файла модели:

<File name='dbt_model.sql'>

```yaml

{{ config(
    tmp_relation_type="table | view", ## Если не определено, по умолчанию используется view.
) }}

```

</File>

## Переходные таблицы

Snowflake поддерживает создание [переходных таблиц](https://docs.snowflake.net/manuals/user-guide/tables-temp-transient.html). Snowflake не сохраняет историю для этих таблиц, что может привести к заметному снижению ваших затрат на хранение в Snowflake. Переходные таблицы участвуют в путешествии во времени в ограниченной степени с периодом удержания по умолчанию в 1 день без периода резервного копирования. Взвесьте эти компромиссы при принятии решения о том, следует ли настраивать ваши модели dbt как `transient`. **По умолчанию все таблицы Snowflake, созданные dbt, являются `transient`.**

### Настройка переходных таблиц в dbt_project.yml

Целая папка (или пакет) может быть настроена как переходная (или нет) путем добавления строки в файл `dbt_project.yml`. Эта конфигурация работает так же, как и все [конфигурации моделей](/reference/model-configs), определенные в `dbt_project.yml`.

<File name='dbt_project.yml'>

```yaml
name: my_project

...

models:
  +transient: false
  my_project:
    ...
```

</File>

### Настройка переходности для конкретной модели

Конкретная модель может быть настроена как переходная, установив конфигурацию модели `transient` в `true`.

<File name='my_table.sql'>

```sql
{{ config(materialized='table', transient=true) }}

select * from ...
```

</File>

## Теги запросов

[Теги запросов](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) — это параметр Snowflake, который может быть весьма полезен позже при поиске в [представлении QUERY_HISTORY](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

dbt поддерживает установку тега запроса по умолчанию на время своих соединений Snowflake в [вашем профиле](/docs/core/connect-data-platform/snowflake-setup). Вы можете установить более точные значения (и переопределить значение по умолчанию) для подмножеств моделей, установив конфигурацию модели `query_tag` или переопределив макрос `set_query_tag` по умолчанию:

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +query_tag: dbt_special

```

</File>

<File name='models/<modelname>.sql'>

```sql
{{ config(
    query_tag = 'dbt_special'
) }}

select ...

```
  
В этом примере вы можете настроить тег запроса, который будет применяться к каждому запросу с именем модели.
  
```sql 

  {% macro set_query_tag() -%}
  {% set new_query_tag = model.name %} 
  {% if new_query_tag %}
    {% set original_query_tag = get_current_query_tag() %}
    {{ log("Установка query_tag на '" ~ new_query_tag ~ "'. Будет сброшен на '" ~ original_query_tag ~ "' после материализации.") }}
    {% do run_query("alter session set query_tag = '{}'".format(new_query_tag)) %}
    {{ return(original_query_tag)}}
  {% endif %}
  {{ return(none)}}
{% endmacro %}

```

**Примечание:** теги запросов устанавливаются на уровне _сессии_. В начале каждой <Term id="materialization" /> модели, если у модели настроен пользовательский `query_tag`, dbt выполнит `alter session set query_tag`, чтобы установить новое значение. В конце материализации dbt выполнит еще один оператор `alter`, чтобы сбросить тег на его значение по умолчанию. Таким образом, сбои сборки в середине материализации могут привести к тому, что последующие запросы будут выполняться с неправильным тегом.

</File>

## Поведение слияния (инкрементные модели)

Конфигурация [`incremental_strategy`](/docs/build/incremental-strategy) управляет тем, как dbt строит инкрементные модели. По умолчанию dbt будет использовать [оператор слияния](https://docs.snowflake.net/manuals/sql-reference/sql/merge.html) в Snowflake для обновления инкрементных таблиц.

Snowflake поддерживает следующие стратегии инкрементного обновления:
- Слияние (по умолчанию)
- Добавление
- Удаление+вставка
- [`microbatch`](/docs/build/incremental-microbatch)

Оператор `merge` Snowflake завершится с ошибкой "недетерминированное слияние", если `unique_key`, указанный в конфигурации вашей модели, не является уникальным. Если вы столкнулись с этой ошибкой, вы можете указать dbt использовать двухэтапный инкрементный подход, установив конфигурацию `incremental_strategy` для вашей модели на `delete+insert`.

## Настройка кластеризации таблиц

dbt поддерживает [кластеризацию таблиц](https://docs.snowflake.net/manuals/user-guide/tables-clustering-keys.html) в Snowflake. Чтобы управлять кластеризацией для <Term id="table" /> или инкрементной модели, используйте конфигурацию `cluster_by`. Когда эта конфигурация применяется, dbt выполнит два действия:

1. Он неявно упорядочит результаты таблицы по указанным полям `cluster_by`
2. Он добавит указанные ключи кластеризации в целевую таблицу

Используя указанные поля `cluster_by` для упорядочивания таблицы, dbt минимизирует объем работы, требуемой для автоматической кластеризации Snowflake. Если инкрементная модель настроена на использование кластеризации таблиц, то dbt также упорядочит промежуточный набор данных перед его слиянием в целевую таблицу. Таким образом, таблица, управляемая dbt, всегда должна находиться в основном кластеризованном состоянии.

### Использование cluster_by

Конфигурация `cluster_by` принимает либо строку, либо список строк для использования в качестве ключей кластеризации. Следующий пример создаст таблицу сессий, кластеризованную по столбцу `session_start`.

<File name='models/events/sessions.sql'>

```sql
{{
  config(
    materialized='table',
    cluster_by=['session_start']
  )
}}

select
  session_id,
  min(event_time) as session_start,
  max(event_time) as session_end,
  count(*) as count_pageviews

from {{ source('snowplow', 'event') }}
group by 1
```

</File>

Код выше будет скомпилирован в SQL, который выглядит (примерно) так:

```sql
create or replace table my_database.my_schema.my_table as (

  select * from (
    select
      session_id,
      min(event_time) as session_start,
      max(event_time) as session_end,
      count(*) as count_pageviews

    from {{ source('snowplow', 'event') }}
    group by 1
  )

  -- этот order by добавляется dbt для создания
  -- таблицы в уже кластеризованном виде.
  order by session_start

);

 alter table my_database.my_schema.my_table cluster by (session_start);
```

### Автоматическая кластеризация

Автоматическая кластеризация [включена по умолчанию в Snowflake сегодня](https://docs.snowflake.com/en/user-guide/tables-auto-reclustering.html), никаких действий не требуется для ее использования. Хотя существует конфигурация `automatic_clustering`, она не имеет эффекта, кроме как для аккаунтов с (устаревшей) ручной кластеризацией.

Если [ручная кластеризация все еще включена для вашего аккаунта](https://docs.snowflake.com/en/user-guide/tables-clustering-manual.html), вы можете использовать конфигурацию `automatic_clustering`, чтобы управлять тем, включена ли автоматическая кластеризация для моделей dbt. Когда `automatic_clustering` установлено в `true`, dbt выполнит запрос `alter table <table name> resume recluster` после сборки целевой таблицы.

Конфигурация `automatic_clustering` может быть указана в файле `dbt_project.yml` или в блоке `config()` модели.

<File name='dbt_project.yml'>

```yaml
models:
  +automatic_clustering: true
```

</File>

## Настройка виртуальных складов

Склад по умолчанию, который использует dbt, можно настроить в вашем [профиле](/docs/core/connect-data-platform/profiles.yml) для соединений Snowflake. Чтобы переопределить склад, который используется для конкретных моделей (или групп моделей), используйте конфигурацию модели `snowflake_warehouse`. Эта конфигурация может быть использована для указания большего склада для определенных моделей, чтобы контролировать затраты на Snowflake и время сборки проекта.

<Tabs
  defaultValue="dbt_project.yml"
  values={[
    { label: 'YAML код', value: 'dbt_project.yml', },
    { label: 'SQL код', value: 'models/events/sessions.sql', },
    ]}
>

<TabItem value="dbt_project.yml">

Пример конфигурации ниже изменяет склад для группы моделей с помощью аргумента конфигурации в yml.

<File name='dbt_project.yml'>

```yaml
name: my_project
version: 1.0.0

...

models:
  +snowflake_warehouse: "EXTRA_SMALL"    # используйте склад `EXTRA_SMALL` для всех моделей в проекте...
  my_project:
    clickstream:
      +snowflake_warehouse: "EXTRA_LARGE"    # ...кроме моделей в папке `clickstream`, которые будут использовать склад `EXTRA_LARGE`.

snapshots:
  +snowflake_warehouse: "EXTRA_LARGE"    # все модели Snapshot настроены на использование склада `EXTRA_LARGE`.
```

</File>
</TabItem>

<TabItem value="models/events/sessions.sql">

Пример конфигурации ниже изменяет склад для одной модели с помощью блока config() в SQL модели.

<File name='models/events/sessions.sql'>

```sql
{{
  config(
    materialized='table',
    snowflake_warehouse='EXTRA_LARGE'
  )
}}

with

aggregated_page_events as (

    select
        session_id,
        min(event_time) as session_start,
        max(event_time) as session_end,
        count(*) as count_page_views
    from {{ source('snowplow', 'event') }}
    group by 1

),

index_sessions as (

    select
        *,
        row_number() over (
            partition by session_id
            order by session_start
        ) as page_view_in_session_index
    from aggregated_page_events

)

select * from index_sessions
```

</File>
</TabItem>
</Tabs>

## Копирование грантов

Когда конфигурация `copy_grants` установлена в `true`, dbt добавит квалификатор `copy grants` <Term id="ddl" /> при перестроении таблиц и <Term id="view">представлений</Term>. Значение по умолчанию — `false`.

<File name='dbt_project.yml'>

```yaml
models:
  +copy_grants: true
```

</File>

## Безопасные представления

Чтобы создать [безопасное представление](https://docs.snowflake.net/manuals/user-guide/views-secure.html) в Snowflake, используйте конфигурацию `secure` для моделей представлений. Безопасные представления могут быть использованы для ограничения доступа к конфиденциальным данным. Примечание: безопасные представления могут привести к снижению производительности, поэтому вы должны использовать их только в случае необходимости.

Следующий пример настраивает модели в папке `sensitive/` как безопасные представления.

<File name='dbt_project.yml'>

```yaml
name: my_project
version: 1.0.0

models:
  my_project:
    sensitive:
      +materialized: view
      +secure: true
```

</File>

## Известное ограничение свежести источника

Snowflake рассчитывает свежесть источника, используя информацию из столбца `LAST_ALTERED`, что означает, что он полагается на поле, обновляемое всякий раз, когда любой объект подвергается модификации, а не только обновлениям данных. Никаких действий не требуется, но аналитические команды должны учитывать эту оговорку.

Согласно [документации Snowflake](https://docs.snowflake.com/en/sql-reference/info-schema/tables#usage-notes):

> Столбец `LAST_ALTERED` обновляется, когда выполняются следующие операции над объектом:
> - Операции DDL.
> - Операции DML (только для таблиц).
> - Фоновые операции по обслуживанию метаданных, выполняемые Snowflake.

<VersionBlock firstVersion="1.9">

## Постраничная навигация для результатов объектов

По умолчанию, когда dbt сталкивается со схемой с до 100,000 объектов, он будет разбивать результаты из `show objects` на страницы по 10,000 на страницу для до 10 страниц.

Среды с более чем 100,000 объектов в схеме могут настроить количество результатов на страницу и лимит страниц, используя следующие [флаги](/reference/global-configs/about-global-configs) в `dbt_project.yml`:

- `list_relations_per_page` &mdash; Количество отношений на каждой странице (Максимум 10k, так как это максимум, который позволяет Snowflake).
- `list_relations_page_limit` &mdash; Максимальное количество страниц для включения в результаты.

Например, если вы хотите включить 10,000 объектов на страницу и включить до 100 страниц (1 миллион объектов), настройте флаги следующим образом:

```yml

flags:
  list_relations_per_page: 10000
  list_relations_page_limit: 100

```

</VersionBlock>