---
title: "Быстрый старт с time spine в MetricFlow"
id: "mf-time-spine"
level: 'Intermediate'
icon: 'guides'
tags: ['Quickstart', 'Semantic Layer']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом руководстве объясняется, как настроить time spine, используя в качестве примера проект [<Constant name="semantic_layer" /> Jaffle shop](https://github.com/dbt-labs/jaffle-sl-template).

### Что такое модель time spine? {#what-is-a-time-spine-model}

[Time spine](/docs/build/metricflow-time-spine) — это ключевой компонент для временных join-ов и агрегаций в MetricFlow, движке, который лежит в основе <Constant name="semantic_layer" />.

Чтобы использовать MetricFlow с метриками и измерениями, зависящими от времени, необходимо предоставить time spine. Он служит фундаментом для всех временных join-ов и агрегаций. Вы можете:

- создать SQL‑модель time spine с нуля, или  
- использовать уже существующую модель в проекте, например `dim_date`.

После того как time spine готов, его нужно описать в YAML, чтобы MetricFlow знал, как его использовать. В этом руководстве показано, как сделать и то, и другое.

### Предварительные требования {#prerequisites}

- Настроенный проект dbt. Если у вас его ещё нет, воспользуйтесь [кратким руководством по началу работы с <Constant name="semantic_layer" />](/guides/sl-qs?step=1) или [краткими руководствами по началу работы с <Constant name="dbt" />](/guides?tags=Quickstart).

- настроенный dbt‑проект. Если его нет, воспользуйтесь [quickstart‑руководством по <Constant name="semantic_layer" />](/guides/sl-qs?step=1) или одним из [quickstart‑руководств <Constant name="cloud" />](/guides?tags=Quickstart).

Для начала предположим, что вы создаёте временную шкалу (time spine) с нуля. Если у вас уже настроен проект dbt и есть собственная временная шкала (например, модель типа `dim_date`), вы можете пропустить этот шаг и перейти к разделу [Использование существующей модели dim_date](https://docs.getdbt.com/guides/mf-time-spine?step=3#using-an-existing-dim_date-model).

Начнём с предположения, что вы создаёте time spine с нуля. Если у вас уже есть dbt‑проект и собственная time spine (например, модель типа `dim_date`), этот шаг можно пропустить и сразу перейти к разделу [Использование существующей модели dim_date](/guides/mf-time-spine#using-an-existing-dim_date-model).

Time spine — это dbt‑модель, которая генерирует последовательность дат (или временных меток) с заданной гранулярностью. В этом примере мы создадим ежедневный time spine — `time_spine_daily.sql`.

1. Перейдите в директорию `models/marts` вашего dbt‑проекта.
2. Добавьте новый SQL‑файл с именем `time_spine_daily.sql` со следующим содержимым:

    <File name='models/marts/time_spine_daily.sql'>

    ```sql
    {{
        config(
            materialized = 'table',
        )
    }}

    with

    base_dates as (
        {{
            dbt.date_spine(
                'day',
                "DATE('2000-01-01')",
                "DATE('2030-01-01')"
            )
        }}
    ),

    final as (
        select
            cast(date_day as date) as date_day
        from base_dates
    )

    select *
    from final
    where date_day > dateadd(year, -5, current_date())  -- Keep recent dates only
      and date_day < dateadd(day, 30, current_date())
    ```
    </File>

    Эта модель генерирует ежедневные даты в диапазоне от 5 лет в прошлом до 30 дней в будущем.

3. Выполните модель и при необходимости посмотрите результат:
    ```bash
    dbt run --select time_spine_daily 
    dbt show --select time_spine_daily # Используйте эту команду для предпросмотра при локальной разработке
    ```

4. Если вы разрабатываете модель в <Constant name="studio_ide" />, вы можете просмотреть результат её выполнения, нажав кнопку **Preview**:
   <Lightbox src="/img/mf-guide-preview-time-spine-table.png" title="Предпросмотр модели временной шкалы в Studio IDE" />

## Добавление YAML‑конфигурации для time spine {#add-yaml-configuration-for-the-time-spine}

Теперь, когда SQL‑файл создан, нужно описать его в YAML, чтобы MetricFlow смог распознать и использовать модель.

1. Перейдите в директорию `models/marts`.
2. Добавьте новый YAML‑файл с именем `_models.yml` со следующим содержимым:

    <File name='models/marts/_models.yml'>

    ```yaml
    models:
      - name: time_spine_daily
        description: A time spine with one row per day, ranging from 5 years in the past to 30 days into the future.
        time_spine:
          standard_granularity_column: date_day  # The base column used for time joins
        columns:
          - name: date_day
            description: The base date column for daily granularity
            granularity: day
    ```
    </File>

Этот YAML‑файл:

- определяет `date_day` как базовую колонку для дневной гранулярности;
- настраивает свойства `time_spine`, чтобы MetricFlow мог использовать модель.

### Использование существующей модели dim_date {#using-an-existing-dim_date-model}

Этот необязательный подход позволяет переиспользовать уже существующую модель и не создавать новую. Если вы создали time spine с нуля, этот раздел можно пропустить.

Если в проекте уже есть модель `dim_date` или аналогичная, её можно настроить как time spine:

1. Найдите существующую модель (`dim_date`).
2. Обновите файл `_models.yml`, добавив конфигурацию time spine:

    <File name='_models.yml'>

    ```yaml
    models:
      - name: dim_date
        description: An existing date dimension model used as a time spine.
        time_spine:
          standard_granularity_column: date_day
        columns:
          - name: date_day
            granularity: day
          - name: day_of_week
            granularity: day
          - name: full_date
            granularity: day
    ```
    </File>

Эта YAML‑конфигурация настраивает свойство `time_spine`, чтобы MetricFlow мог использовать модель.

## Запуск и проверка time spine {#run-and-preview-the-time-spine}

Если вы ещё не запускали созданный time spine, сделайте это сейчас. Если модель уже была выполнена, этот шаг можно пропустить.

1. Выполните команды:
   ```bash
   dbt run --select time_spine_daily
   dbt show --select time_spine_daily # Используйте для предпросмотра при локальной разработке
   ```

2. Если вы разрабатываете в <Constant name="studio_ide" />, вы можете предварительно просмотреть модель, нажав кнопку **Preview**:
    <Lightbox src="/img/mf-guide-preview-time-spine-table.png" title="Предпросмотр модели временной шкалы в Studio IDE" />

3. Убедитесь, что модель:
   - содержит ровно одну строку на каждый день;
   - покрывает нужный диапазон дат (5 лет назад и 30 дней вперёд).

4. (Необязательно) Если в проекте уже определены [метрики](/docs/build/metrics-overview), вы можете проверить time spine, выполнив запросы через [команды <Constant name="semantic_layer" />](/docs/build/metricflow-commands).

   Например, если у вас есть метрика `revenue`, выполните:

    ```bash
    dbt sl query --metrics revenue --group-by metric_time
    ```

В <Constant name="studio_ide" /> будут выведены результаты, аналогичные следующим:
    <Lightbox src="/img/quickstarts/dbt-platform/validate-mf-timespine-output.png" title="Проверка результатов метрик и временной шкалы в Studio IDE" />

5. Проверьте, что данные корректны и соответствуют ожиданиям.

## Добавление дополнительных гранулярностей {#add-additional-granularities}

Этот раздел необязательный и показывает, как добавить дополнительные гранулярности в time spine:

- [Годовая](#yearly-time-spine)
- [Пользовательские календари](#custom-calendars)

### Годовая time spine {#yearly-time-spine}

Чтобы поддерживать несколько гранулярностей (например, почасовую, месячную, годовую), создайте дополнительные модели time spine и настройте их в YAML.

1. Добавьте SQL‑файл `time_spine_yearly.sql` со следующим содержимым:
    <File name='models/marts/time_spine_yearly.sql'>

    ```sql
    {{
        config(
            materialized = 'table',
        )
    }}

    with years as (

        {{
            dbt.date_spine(
                'year',
                "to_date('01/01/2000','mm/dd/yyyy')",
                "to_date('01/01/2025','mm/dd/yyyy')"
            )
        }}

    ),

    final as (
        select cast(date_year as date) as date_year
        from years
    )

    select * from final
    -- filter the time spine to a specific range
    where date_year >= date_trunc('year', dateadd(year, -4, current_timestamp())) 
      and date_year < date_trunc('year', dateadd(year, 1, current_timestamp()))
    ```
    </File>

2. Затем обновите файл `_models.yml`, добавив годовой time spine (ниже конфигурации дневного):

    <File name='_models.yml'>

    ```yaml
    models:
      - name: time_spine_daily
        ... rest of the daily time spine config ...

      - name: time_spine_yearly
        description: time spine one row per house
        time_spine:
          standard_granularity_column: date_year
        columns:
          - name: date_year
            granularity: year
    ```
    </File>

3. Запустите или просмотрите модель:
   ```bash
   dbt run --select time_spine_yearly
   dbt show --select time_spine_yearly # Для предпросмотра при локальной разработке
   ```

4. Проверьте результат, выполнив запрос:
   ```bash
   dbt sl query --metrics orders --group-by metric_time__year
   ```

Если вы разрабатываете в <Constant name="studio_ide" />, вы можете просмотреть результат выполнения модели, нажав кнопку **Preview**.
   <Lightbox src="/img/mf-guide-query.png" title="Проверка метрик и временной шкалы в Studio IDE" />

:::tip Дополнительные баллы!
Для дополнительной практики попробуйте:

- отсортировать результат команды `dbt sl query --metrics orders --group-by metric_time__year` по возрастанию `metric_time__year` (см. документацию по [командам dbt Semantic Layer](/docs/build/metricflow-commands#query));
- отфильтровать данные только за текущий и прошлый год;
- создать месячный time spine: скопируйте дневную модель, измените её так, чтобы она генерировала одну строку на месяц, и добавьте в YAML `granularity: month`.
:::

### Пользовательские календари {#custom-calendars}

Чтобы поддерживать пользовательские календари (например, финансовые годы, финансовые кварталы и т. д.), создайте дополнительную временную шкалу (time spine) и настройте её в YAML. Эта возможность доступна в [треке релизов **v1 Latest**](/docs/dbt-versions/dbt-release-tracks) <Constant name="dbt" /> или в [<Constant name="dbt" /> версии 1.9 и выше](/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.9).

    <File name='models/marts/fiscal_calendar.sql'>

    ```sql
        with date_spine as (

        select 
            date_day,
            extract(year from date_day) as calendar_year,
            extract(week from date_day) as calendar_week

        from {{ ref('time_spine_daily') }}

    ),

    fiscal_calendar as (

        select
            date_day,
            -- Define custom fiscal year starting in October
            case 
                when extract(month from date_day) >= 10 
                    then extract(year from date_day) + 1
                else extract(year from date_day) 
            end as fiscal_year,

            -- Define fiscal weeks (e.g., shift by 1 week)
            extract(week from date_day) + 1 as fiscal_week

        from date_spine

    )

    select * from fiscal_calendar
    ```
    </File>

2. Затем обновите `_models.yml`, добавив фискальный календарь (ниже годового time spine):

    <File name='_models.yml'>

    ```yaml
    models:
      - name: time_spine_yearly
        ... rest of the yearly time spine config ...  
        
      - name: fiscal_calendar
        description: A custom fiscal calendar with fiscal year and fiscal week granularities.
        time_spine:
          standard_granularity_column: date_day
          custom_granularities:
            - name: fiscal_year
              column_name: fiscal_year
            - name: fiscal_week
              column_name: fiscal_week
        columns:
          - name: date_day
            granularity: day
          - name: fiscal_year
            description: "Custom fiscal year starting in October"
          - name: fiscal_week
            description: "Fiscal week, shifted by 1 week from standard calendar"
    ```
    </File>

3. Запустите или просмотрите модель:
   ```bash
   dbt run --select fiscal_calendar
   dbt show --select fiscal_calendar # Для предпросмотра при локальной разработке
   ```

Если вы разрабатываете в <Constant name="studio_ide" />, вы можете предварительно просмотреть модель, нажав кнопку **Preview**.

4. Проверьте результат, выполнив запрос:
   ```bash
   dbt sl query --metrics orders --group-by metric_time__fiscal_year
   ```

   <Lightbox src="/img/mf-guide-fiscal-preview.png" title="Проверка метрик и временной шкалы пользовательского календаря в Studio IDE" />

## Что дальше {#whats-next}

<ConfettiTrigger>

Поздравляем 🎉! Вы настроили time spine и готовы использовать преимущества MetricFlow и <Constant name="semantic_layer" /> в своей организации. Вы узнали:

- как создать time spine или использовать существующую модель;
- как настроить time spine в YAML;
- как добавить дополнительные гранулярности.

Полезные материалы для дальнейшего изучения:

- [Time spine в MetricFlow](/docs/build/metricflow-time-spine)
- [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl)
- [Создание метрик](/docs/build/metrics-overview)
- [Быстрый старт с <Constant name="semantic_layer" />](/guides/sl-qs?step=1)

</ConfettiTrigger>

</div>
