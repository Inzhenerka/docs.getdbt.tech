---
title: Временная шкала MetricFlow
id: metricflow-time-spine
description: "MetricFlow ожидает таблицу временной шкалы по умолчанию, называемую metricflow_time_spine"
sidebar_label: "Временная шкала MetricFlow"
tags: [Метрики, Семантический слой]
---
<VersionBlock firstVersion="1.9">


В аналитической инженерии часто используется таблица измерения дат или "временная шкала" в качестве базовой таблицы для различных типов соединений и агрегаций на основе времени. Структура этой таблицы обычно включает базовую колонку с ежедневными или почасовыми датами, с дополнительными колонками для других временных гранулярностей, таких как фискальные кварталы, определяемые на основе базовой колонки. Вы можете присоединять другие таблицы к временной шкале по базовой колонке, чтобы вычислять метрики, такие как доход в определенный момент времени, или агрегировать данные до определенной временной гранулярности.

Чтобы использовать MetricFlow с метриками и измерениями, основанными на времени, вам **обязательно** нужно предоставить time spine. Эта таблица служит основой для всех временных соединений (joins) и агрегаций. Вы можете:

- Создать time spine с нуля (см. раздел [example time spine](#example-time-spine-tables) с примерами), или
- Использовать уже существующую таблицу в вашем проекте, например таблицу `dim_date`

После того как time spine создан, его необходимо настроить в YAML, чтобы сообщить MetricFlow, как именно его использовать.

## Prerequisites {#prerequisites}
MetricFlow требует, чтобы вы определили как минимум одну dbt-модель, которая предоставляет time spine, а затем указали (в YAML), какие столбцы должны использоваться для временных соединений. Это означает, что вам нужно:

- Определите как минимум один [time spine](#example-time-spine-tables) с той гранулярностью, которая требуется для ваших метрик (например, дневной или почасовой). При необходимости вы также можете определить дополнительные таблицы с более крупной гранулярностью (например, месячной или годовой).
- [Сконфигурируйте каждый time spine в YAML‑файле свойств](#configuring-time-spine-in-yaml), чтобы определить, как MetricFlow распознаёт и использует его колонки.

Обратите внимание, что time spine не могут пересекаться.

После этого MetricFlow будет выполнять join с моделью time spine для следующих типов метрик и измерений:

- [Кумулятивные метрики](/docs/build/cumulative)
- [Смещения метрик](/docs/build/derived#derived-metric-offset)
- [Метрики конверсии](/docs/build/conversion)
- [Медленно изменяющиеся измерения](/docs/build/dimensions#scd-type-ii)
- [Метрики](/docs/build/metrics-overview) с конфигурацией `join_to_timespine`, установленной в true

Чтобы посмотреть сгенерированный SQL для типов метрик и измерений, которые используют соединения с time spine, обратитесь к соответствующей документации или добавьте флаг `compile=true` при выполнении запроса к <Constant name="semantic_layer" />, чтобы вернуть скомпилированный SQL.

## Настройка временной шкалы в YAML {#configuring-time-spine-in-yaml}

:::tip Используйте наше мини‑руководство для создания таблицы time spine
Для быстрого старта по созданию таблицы time spine ознакомьтесь с нашим [мини‑руководством по MetricFlow time spine](/guides/mf-time-spine)!
:::

Модели time spine — это обычные модели dbt с дополнительными конфигурациями, которые указывают dbt и MetricFlow, как использовать определённые колонки, задавая их свойства. Добавьте ключ [`models`](/reference/model-properties) для time spine в директории `models/` вашего проекта. Если в проекте уже есть календарная таблица или таблица измерений дат, вы можете настроить эту таблицу как time spine. В противном случае посмотрите [примеры таблиц time spine](#example-time-spine-tables), чтобы создать свою. Если соответствующего файла модели ещё не существует, создайте его и добавьте конфигурацию, описанную в [следующем разделе](#creating-a-time-spine-table).

Несколько важных моментов при настройке моделей time spine:

- Убедитесь, что в вашем проекте уже определена SQL‑таблица time spine.
- Добавляйте конфигурации под ключом `time_spine` в [свойствах модели](/reference/model-properties), так же как вы добавляете описание или тесты.
- Необходимо настраивать только те модели time spine, которые должен распознавать <Constant name="semantic_layer" />.
- Как минимум, определите таблицу time spine с дневной гранулярностью.
- При необходимости можно определить дополнительные таблицы time spine с другой гранулярностью, например почасовой. При выборе таблиц для создания ознакомьтесь с [соображениями по гранулярности](#granularity-considerations).
- Если вам нужно указать гранулярность временного измерения, чтобы MetricFlow мог преобразовать исходную колонку к требуемой гранулярности, обратитесь к [документации по временной гранулярности](/docs/build/dimensions?dimension=time_gran).

:::tip
- Если вы ранее использовали модель `metricflow_time_spine.sql`, её можно удалить после настройки свойства `time_spine` в YAML. <Constant name="semantic_layer" /> автоматически распознаёт новую конфигурацию. Дополнительные файлы `.yml` не требуются.
- Вы также можете настроить MetricFlow на использование любого измерения даты или таблицы time spine, уже существующих в вашем проекте, обновив параметр `model` в <Constant name="semantic_layer" />.
- Если у вас нет таблицы измерений дат, вы всё равно можете создать её, используя фрагмент кода в [следующем разделе](#creating-a-time-spine-table) для построения модели time spine.
:::
:::

### Создание таблицы временной шкалы {#creating-a-time-spine-table}

MetricFlow поддерживает гранулярности от миллисекунд до лет. Обратитесь к [странице измерений](/docs/build/dimensions?dimension=time_gran#time) (вкладка time_granularity), чтобы найти полный список поддерживаемых гранулярностей.

Чтобы создать таблицу временной шкалы с нуля, вы можете добавить следующий код в ваш проект dbt. Этот пример создает временную шкалу с почасовой и ежедневной гранулярностью: `time_spine_hourly` и `time_spine_daily`.

<VersionBlock firstVersion="1.9">
<File name="models/_models.yml">
  
```yaml
[models:](/reference/model-properties) 
# Почасовая временная шкала
  - name: time_spine_hourly 
    description: моя любимая временная шкала
    time_spine:
      standard_granularity_column: date_hour # колонка для стандартной гранулярности вашей таблицы, должна быть типа date time.
      custom_granularities:
        - name: fiscal_year
          column_name: fiscal_year_column # must refer to a column defined in the model
    columns:
      - name: date_hour
        granularity: hour # установите гранулярность на уровне колонки для standard_granularity_column

# Ежедневная временная шкала
  - name: time_spine_daily
    time_spine:
      standard_granularity_column: date_day # колонка для стандартной гранулярности вашей таблицы
    columns:
      - name: date_day
        granularity: day # установите гранулярность на уровне колонки для standard_granularity_column
```
</File>
</VersionBlock>

- В этом примере конфигурации показана модель time spine с именами `time_spine_hourly` и `time_spine_daily`. В ней настройки time spine задаются под ключом `time_spine`.  
- `standard_granularity_column` — это колонка, которая сопоставляется с одной из [стандартных гранулярностей](/docs/build/dimensions?dimension=time_gran). Эта колонка должна быть указана под ключом `columns` и должна иметь гранулярность, которая является более мелкой или равной любой пользовательской гранулярности, определённой в той же модели.  
  - Она должна ссылаться на колонку, определённую под ключом `columns` — в данном случае это `date_hour` и `date_day` соответственно.  
  - Гранулярность задаётся на уровне колонки с помощью ключа `granularity`, в данном примере — `hour` и `day` соответственно.  
- MetricFlow будет использовать `standard_granularity_column` в качестве ключа соединения при join таблицы time spine с другой исходной таблицей.  
- Поле [`custom_granularities`](#custom-calendar) (доступно в <Constant name="cloud" /> Latest и в dbt Core версии 1.9 и выше) позволяет указывать нестандартные временные периоды, такие как `fiscal_year` или `retail_month`, которые могут использоваться в вашей организации.  
  - Поле `column_name` должно ссылаться на колонку, которая существует в той же модели.

Для примера проекта обратитесь к нашему [примеру Jaffle shop](https://github.com/dbt-labs/jaffle-sl-template/blob/main/models/marts/_models.yml).

### Миграция с SQL на YAML {#migrating-from-sql-to-yaml}

Если у вас уже есть SQL-модель, которая определяет ваш time spine, вы можете напрямую сослаться на эту модель в YAML-файле. Если у вас нет SQL-модели, определяющей time spine, добавьте её перед тем, как переходить к следующим шагам.

1. Добавьте следующую конфигурацию в новый или существующий YAML‑файл свойств, используя ключ [`models`](/reference/model-properties) для time spine в вашем каталоге `models/`. Назовите файл свойств YAML как угодно (например, `util/_models.yml`):

  <File name="models/_models.yml">

  ```yaml
  models:
    - name: all_days
      description: A time spine with one row per day, ranging from 2020-01-01 to 2039-12-31.
      time_spine:
        standard_granularity_column: date_day  # Column for the standard grain of your table
      columns:
        - name: date_day
          granularity: day  # Set the granularity of the column
  ```
  </File>

2. После добавления YAML-конфигурации и при условии, что у вас есть SQL-модель, определяющая time spine, вы можете удалить существующий файл `metricflow_time_spine.sql` из проекта, чтобы избежать предупреждений или ошибок, связанных с устаревшим функционалом.

3. Протестируйте конфигурацию, чтобы убедиться в её совместимости с вашими production-задачами.

Обратите внимание: если вы мигрируете с файла `metricflow_time_spine.sql`:

- Замените его функциональность, добавив свойство `time_spine` в YAML, как показано в предыдущем примере.
- После настройки MetricFlow будет распознавать параметры из YAML, и SQL-файл модели можно будет безопасно удалить.

### Рекомендации по выбору гранулярностей {#granularity-considerations}

- MetricFlow использует time spine с наибольшей подходящей гранулярностью для конкретного запроса, чтобы обеспечить максимально эффективное выполнение. Например, если у вас есть time spine с месячной гранулярностью и запрос к измерению с месячной гранулярностью, MetricFlow будет использовать месячный time spine. Если же у вас есть только дневной time spine, MetricFlow будет использовать его и применять `date_trunc` до месяца.
- Вы можете добавить time spine для каждой гранулярности, которую планируете использовать, если для вас важнее эффективность запросов, чем время на конфигурацию или ограничения по хранению данных. Для большинства движков разница в производительности будет минимальной, и преобразование time spine к более крупной гранулярности во время выполнения запроса не должно существенно увеличивать накладные расходы.
- Мы рекомендуем иметь time spine с самой мелкой гранулярностью, используемой в любых ваших измерениях, чтобы избежать неожиданных ошибок. Например, если у вас есть измерения с почасовой гранулярностью, у вас также должен быть time spine с почасовой гранулярностью.

## Примеры таблиц временной шкалы {#example-time-spine-tables}

Следующие примеры показывают, как создавать таблицы time spine с разной гранулярностью:

<!-- no toc -->
- [Seconds](#seconds)
- [Minutes](#minutes)
- [Daily](#daily)
- [Daily (BigQuery)](#daily-bigquery)
- [Hourly](#hourly)

### Seconds {#seconds}

<File name="metricflow_time_spine.sql">

```sql
{{ config(materialized='table') }}

with seconds as (

    {{
        dbt.date_spine(
            'second',
            "date_trunc('second', dateadd(second, -10, current_timestamp()))",
            "date_trunc('second', current_timestamp())"
        )
    }}

),

final as (
    select cast(date_second as timestamp) as second_timestamp
    from seconds
)

select * from final

```
</File>

### Minutes {#minutes}

<File name="metricflow_time_spine.sql">

```sql
{{ config(materialized='table') }}

with minutes as (

    {{
        dbt.date_spine(
            'minute',
            "date_trunc('minute', dateadd(minute, -5, current_timestamp()))",
            "date_trunc('minute', current_timestamp())"
        )
    }}

),

final as (
    select cast(date_minute as timestamp) as minute_timestamp
    from minutes
)

select * from final
```

</File>

### Daily {#daily}

<File name="metricflow_time_spine.sql">

```sql
{{
    config(
        materialized = 'table',
    )
}}

with days as (

    {{
        dbt.date_spine(
            'day',
            "to_date('01/01/2000','mm/dd/yyyy')",
            "to_date('01/01/2025','mm/dd/yyyy')"
        )
    }}

),

final as (
    select cast(date_day as date) as date_day
    from days
)

select * from final
where date_day > dateadd(year, -4, current_timestamp()) 
and date_day < dateadd(day, 30, current_timestamp())
```

### Ежедневная (BigQuery) {#daily-bigquery}

Используйте эту модель, если вы используете BigQuery. BigQuery поддерживает `DATE()` вместо `TO_DATE()`:

<File name="metricflow_time_spine.sql">

```sql

{{config(materialized='table')}}
with days as (
    {{dbt.date_spine(
        'day',
        "DATE(2000,01,01)",
        "DATE(2025,01,01)"
    )
    }}
),

final as (
    select cast(date_day as date) as date_day
    from days
)

select *
from final
-- фильтруйте временную шкалу до определенного диапазона
where date_day > date_add(DATE(current_timestamp()), INTERVAL -4 YEAR)
and date_day < date_add(DATE(current_timestamp()), INTERVAL 30 DAY)
```

</File>

</File>

### Почасовая {#hourly}

<File name='time_spine_hourly.sql'>

```sql
{{
    config(
        materialized = 'table',
    )
}}

with hours as (

    {{
        dbt.date_spine(
            'hour',
            "to_date('01/01/2000','mm/dd/yyyy')",
            "to_date('01/01/2025','mm/dd/yyyy')"
        )
    }}

),

final as (
    select cast(date_hour as timestamp) as date_hour
    from hours
)

select * from final
-- фильтруйте временную шкалу до определенного диапазона
where date_day > dateadd(year, -4, current_timestamp()) 
and date_hour < dateadd(day, 30, current_timestamp())
```

</File>


</VersionBlock>


## Пользовательский календарь <Lifecycle status="Preview"/> {#custom-calendar}

:::tip
Ознакомьтесь с нашим мини‑руководством о [how to create a time spine table](/guides/mf-time-spine) для начала!
:::


<VersionBlock firstVersion="1.9">

Пользовательские преобразования дат могут быть сложными, и у организаций часто есть уникальные потребности, которые трудно обобщить. Создание модели пользовательского календаря позволяет вам определять эти преобразования в SQL, предлагая больше гибкости, чем встроенные преобразования в MetricFlow. Этот подход позволяет вам сопоставлять пользовательские колонки с гранулярностями MetricFlow, обеспечивая согласованность, при этом давая вам контроль над преобразованиями.

Например, если вы используете пользовательский календарь в вашей организации, такой как фискальный календарь, вы можете настроить его в MetricFlow, используя его операции с датами и временем.

- Это полезно для расчета метрик на основе пользовательского календаря, таких как фискальные кварталы или недели.
- Используйте ключ `custom_granularities`, чтобы определить нестандартный временной период для запроса данных, такой как `retail_month` или `fiscal_week`, вместо стандартных опций, таких как `day`, `month` или `year`.
- Эта функция предоставляет больше контроля над тем, как рассчитываются метрики на основе времени.

<Expandable alt_header="Соображения по типам данных и часовым поясам">
 
При работе с пользовательскими календарями в MetricFlow важно обеспечить:

- Согласованные типы данных &mdash; как ваша колонка измерения, так и колонка временной шкалы должны использовать один и тот же тип данных для точных сравнений. Функции, такие как `DATE_TRUNC`, не изменяют тип данных входных данных в некоторых базах данных (например, Snowflake). Использование разных типов данных может привести к несоответствиям и неточным результатам.

  Мы рекомендуем использовать типы данных `DATETIME` или `TIMESTAMP` для ваших временных измерений и временной шкалы, так как они поддерживают все гранулярности. Тип данных `DATE` может не поддерживать более мелкие гранулярности, такие как часы или минуты.

- Часовые пояса &mdash; MetricFlow в настоящее время не выполняет никаких манипуляций с часовыми поясами. При работе с данными, учитывающими часовой пояс, несоответствия в часовых поясах могут привести к неожиданным результатам при агрегациях и сравнениях.

Например, если ваша колонка временной шкалы имеет тип `TIMESTAMP`, а ваша колонка измерения имеет тип `DATE`, сравнения между этими колонками могут не работать, как предполагалось. Чтобы исправить это, преобразуйте вашу колонку `DATE` в `TIMESTAMP` или убедитесь, что обе колонки имеют один и тот же тип данных.

</Expandable>

### Добавление пользовательских гранулярностей {#add-custom-granularities}

Чтобы добавить пользовательские гранулярности, <Constant name="semantic_layer" /> поддерживает пользовательские конфигурации календаря, которые позволяют выполнять запросы к данным с использованием нестандартных временных периодов, таких как `fiscal_year` или `retail_month`. Вы можете определить эти пользовательские гранулярности (все в нижнем регистре), изменив YAML‑конфигурацию вашей модели следующим образом:

<File name="models/_models.yml">

```yaml
models:
 - name: my_time_spine
   description: моя любимая временная шкала
   time_spine:
      standard_granularity_column: date_day
      custom_granularities:
        - name: fiscal_year
          column_name: fiscal_year_column # must refer to a column defined in the model
```
</File>

#### Скоро {#coming-soon}
Обратите внимание, что такие функции, как расчет смещений и периодов по периодам, будут поддерживаться в ближайшее время!

</VersionBlock>


## Связанные документы {#related-docs}

- [Гранулярность времени в MetricFlow](/docs/build/dimensions?dimension=time_gran#time)
- [Мини‑руководство по временной шкале (time spine) в MetricFlow](/guides/mf-time-spine)
