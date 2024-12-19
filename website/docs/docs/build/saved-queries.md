---
title: Сохраненные запросы
id: saved-queries
description: "Сохраненные запросы — это способ сохранить часто используемые запросы в MetricFlow. Они могут быть использованы для экономии времени и избежания повторного написания одного и того же запроса."
sidebar_label: "Сохраненные запросы"
tags: [Метрики, Семантический уровень]
---

Сохраненные запросы — это способ сохранить часто используемые запросы в MetricFlow. Вы можете сгруппировать метрики, измерения и фильтры, которые логически связаны, в сохраненный запрос. Сохраненные запросы являются узлами и видны в dbt <Term id="dag" />.

Сохраненные запросы служат основным строительным блоком, позволяя вам [настраивать экспорты](#configure-exports) в конфигурации вашего сохраненного запроса. Экспорты расширяют эту функциональность, позволяя вам [планировать и записывать сохраненные запросы](/docs/use-dbt-semantic-layer/exports) непосредственно в вашей платформе данных с использованием [планировщика заданий dbt Cloud](/docs/deploy/job-scheduler).

## Параметры

Чтобы создать сохраненный запрос, обратитесь к следующей таблице параметров.

:::tip
Обратите внимание, что мы используем двойной двоеточие (::), чтобы указать, вложен ли параметр в другой параметр. Например, `query_params::metrics` означает, что параметр `metrics` вложен в `query_params`.
:::
<!-- Для версий 1.8 и выше -->
<VersionBlock firstVersion="1.8">

| Параметр | Тип    | Обязательный | Описание    |
|-------|---------|----------|----------------|
| `name`       | String    | Обязательный     | Имя объекта сохраненного запроса.          |
| `description`     | String      | Обязательный     | Описание сохраненного запроса.     |
| `label`     | String      | Обязательный     | Отображаемое имя для вашего сохраненного запроса. Это значение будет показано в downstream инструментах.    |
| `config`     | String      |  Необязательный     |  Используйте свойство [`config`](/reference/resource-properties/config), чтобы указать конфигурации для вашего сохраненного запроса. Поддерживает конфигурации `cache`, [`enabled`](/reference/resource-configs/enabled), `export_as`, [`group`](/reference/resource-configs/group), [`meta`](/reference/resource-configs/meta) и [`schema`](/reference/resource-configs/schema).   |
| `config::cache::enabled`     | Object      | Необязательный     |  Объект с подключом, используемым для указания, должен ли сохраненный запрос заполнять [кэш](/docs/use-dbt-semantic-layer/sl-cache). Принимает подключ `true` или `false`. По умолчанию `false`. |
| `query_params`       | Structure   | Обязательный     | Содержит параметры запроса. |
| `query_params::metrics`   | List or String   | Необязательный    | Список метрик, которые будут использоваться в запросе, как указано в интерфейсе командной строки. |
| `query_params::group_by`    | List or String          | Необязательный    | Список сущностей и измерений, которые будут использоваться в запросе, включая `Dimension` или `TimeDimension`. |
| `query_params::where`        | List or String | Необязательный  | Список строк, которые могут включать объекты `Dimension` или `TimeDimension`. |
| `exports`     | List or Structure | Необязательный    | Список экспортов, которые должны быть указаны в структуре экспортов.     |
| `exports::name`       | String               | Обязательный     | Имя объекта экспорта.      |
| `exports::config`     | List or Structure     | Обязательный     | Раздел конфигурации для любых параметров, указывающих экспорт.  |
| `exports::config::export_as` | String    | Обязательный     | Тип экспорта для выполнения. Варианты включают таблицу или представление в настоящее время и кэш в ближайшем будущем.   |
| `exports::config::schema`   | String   | Необязательный    | Схема для создания таблицы или представления. Этот параметр не может быть использован для кэширования.   |
| `exports::config::alias`  | String     | Необязательный    | Псевдоним таблицы, используемый для записи в таблицу или представление. Этот параметр не может быть использован для кэширования.  |

</VersionBlock> 

<!-- Для версий 1.7 и ниже-->
<VersionBlock lastVersion="1.7">

| Параметр | Тип    | Обязательный | Описание    |
|-------|---------|----------|----------------|
| `name`       | String    | Обязательный     | Имя объекта сохраненного запроса.          |
| `description`     | String      | Обязательный     | Описание сохраненного запроса.     |
| `label`     | String      | Обязательный     | Отображаемое имя для вашего сохраненного запроса. Это значение будет показано в downstream инструментах.    |
| `query_params`       | Structure   | Обязательный     | Содержит параметры запроса. |
| `query_params::metrics`   | List or String   | Необязательный    | Метрики, вложенные в `query_params`: список метрик, которые будут использоваться в запросе, как указано в интерфейсе командной строки. |
| `query_params::group_by`    | List or String          | Необязательный    | Группировка, вложенная в `query_params`: список сущностей и измерений, которые будут использоваться в запросе, включая `Dimension` или `TimeDimension`. |
| `query_params::where`        | List or String | Необязательный  | Условия, вложенные в `query_params`: список строк, которые могут включать объекты `Dimension` или `TimeDimension`. |
| `exports`     | List or Structure | Необязательный    | Список экспортов, которые должны быть указаны в структуре экспортов.     |
| `exports::name`       | String               | Обязательный     | Имя объекта экспорта, вложенное в `exports`.   |
| `exports::config`     | List or Structure     | Обязательный     | Раздел конфигурации для любых параметров, указывающих экспорт, вложенный в `exports`.  |
| `exports::config::export_as` | String    | Обязательный     |  Указывает тип экспорта: таблица, представление или предстоящие параметры кэширования. Вложенный в `exports` и `config`.   |
| `exports::config::schema`   | String   | Необязательный    | Схема для создания таблицы или представления, не применимая для кэширования. Вложенный в `exports` и `config`.   |
| `exports::config::alias`  | String     | Необязательный    | Псевдоним таблицы, используемый для записи в таблицу или представление. Этот параметр не может быть использован для кэширования. Вложенный в `exports` и `config`.  |

</VersionBlock>

Если вы используете несколько метрик в сохраненном запросе, вы сможете ссылаться только на общие измерения, которые эти метрики разделяют, в предложениях `group_by` или `where`. Используйте префикс имени сущности с объектом Dimension, например, `Dimension('user__ds')`.

## Настройка сохраненного запроса

Используйте сохраненные запросы для определения и управления общими запросами семантического уровня в YAML, включая метрики и измерения. Сохраненные запросы позволяют вам организовывать и повторно использовать общие запросы MetricFlow в проектах dbt. Например, вы можете сгруппировать связанные метрики вместе для лучшей организации и включить часто используемые измерения и фильтры.

В вашей конфигурации сохраненного запроса вы также можете использовать [кэширование](/docs/use-dbt-semantic-layer/sl-cache) с планировщиком заданий dbt Cloud для кэширования общих запросов, ускорения производительности и снижения затрат на вычисления.

<!-- Для версий 1.8 и выше -->

<VersionBlock firstVersion="1.8">

В следующем примере вы можете установить сохраненный запрос в файле `semantic_model.yml`:

<File name='semantic_model.yml'>

```yaml
saved_queries:
  - name: test_saved_query
    description: "{{ doc('saved_query_description') }}"
    label: Тестовый сохраненный запрос
    config:
      cache:
        enabled: true  # Или false, если вы хотите отключить по умолчанию
    query_params:
      metrics:
        - simple_metric
      group_by:
        - "Dimension('user__ds')"
      where:
        - "{{ Dimension('user__ds', 'DAY') }} <= now()"
        - "{{ Dimension('user__ds', 'DAY') }} >= '2023-01-01'"
    exports:
      - name: my_export
        config:
          alias: my_export_alias
          export_as: table
          schema: my_export_schema_name
```
</File>

Обратите внимание, что вы можете установить `export_as` как для сохраненного запроса, так и для конфигурации экспортов [config](/reference/resource-properties/config), при этом значение конфигурации экспортов имеет приоритет. Если ключ не установлен в конфигурации экспортов, он унаследует значение конфигурации сохраненного запроса.

#### Условие Where

Используйте следующий синтаксис для ссылки на сущности, измерения, временные измерения или метрики в фильтрах и обратитесь к [Метрикам как измерениям](/docs/build/ref-metrics-in-filters) для получения подробной информации о том, как использовать метрики в качестве измерений с фильтрами метрик:

```yaml
filter: | 
  {{ Entity('entity_name') }}

filter: |  
  {{ Dimension('primary_entity__dimension_name') }}

filter: |  
  {{ TimeDimension('time_dimension', 'granularity') }}

filter: |  
  {{ Metric('metric_name', group_by=['entity_name']) }}
```

</VersionBlock>

<!-- Для версий 1.7 и ниже-->
<VersionBlock lastVersion="1.7">

В следующем примере вы можете установить сохраненный запрос в файле `semantic_model.yml`:

<File name='semantic_model.yml'>

```yaml
saved_queries:
  - name: test_saved_query
    description: "{{ doc('saved_query_description') }}"
    label: Тестовый сохраненный запрос
    query_params:
      metrics:
        - simple_metric
      group_by:
        - "Dimension('user__ds')"
      where:
        - "{{ Dimension('user__ds', 'DAY') }} <= now()"
        - "{{ Dimension('user__ds', 'DAY') }} >= '2023-01-01'"
    exports:
      - name: my_export
        config:
          alias: my_export_alias
          export_as: table
          schema: my_export_schema_name
```
</File>
</VersionBlock>

#### Сохраненные запросы на уровне проекта

Чтобы включить сохраненные запросы на уровне проекта, вы можете установить конфигурацию `saved-queries` в файле [`dbt_project.yml`](/reference/dbt_project.yml). Это сэкономит вам время на настройку сохраненных запросов в каждом файле:

<File name='dbt_project.yml'>

```yaml
saved-queries:
  my_saved_query:
    +cache:
      enabled: true
```
</File>

Для получения дополнительной информации о `dbt_project.yml` и соглашениях о наименовании конфигураций смотрите [страницу справки по dbt_project.yml](/reference/dbt_project.yml#naming-convention).

Чтобы создать `saved_queries`, используйте флаг [`--resource-type`](/reference/global-configs/resource-type) и выполните команду `dbt build --resource-type saved_query`.

## Настройка экспортов

Экспорты — это дополнительная конфигурация, добавленная к сохраненному запросу. Они определяют, _как_ записать сохраненный запрос, а также схему и имя таблицы.

После того как вы настроили свой сохраненный запрос и установили основной блок, вы можете теперь настроить экспорты в файле конфигурации YAML `saved_queries` (в том же файле, что и ваши определения метрик). Это также позволит вам [автоматически выполнять экспорты](#run-exports) в вашей платформе данных с использованием [планировщика заданий dbt Cloud](/docs/deploy/job-scheduler).

Следующий пример показывает сохраненный запрос с экспортом:

<File name='semantic_model.yml'>

```yaml
saved_queries:
  - name: order_metrics
    description: Соответствующие метрики заказов
    query_params:
      metrics:
        - orders
        - large_order
        - food_orders
        - order_total
      group_by:
        - Entity('order_id')
        - TimeDimension('metric_time', 'day')
        - Dimension('customer__customer_name')
        - ... # Дополнительные group_by
      where:
        - "{{TimeDimension('metric_time')}} > current_timestamp - interval '1 week'"
        - ... # Дополнительные условия where
    exports:
      - name: order_metrics
        config:
          export_as: table # Доступные варианты: table, view
          schema: YOUR_SCHEMA # Необязательный - по умолчанию используется схема развертывания
          alias: SOME_TABLE_NAME # Необязательный - по умолчанию используется имя экспорта
```
</File>

## Выполнение экспортов

После того как вы настроили экспорты, вы можете сделать шаг вперед, запустив экспорты, чтобы автоматически записывать сохраненные запросы в вашей платформе данных с использованием [планировщика заданий dbt Cloud](/docs/deploy/job-scheduler). Эта функция доступна только с [Семантическим уровнем dbt Cloud](/docs/use-dbt-semantic-layer/dbt-sl).

Для получения дополнительной информации о том, как выполнять экспорты, обратитесь к документации по [Экспортам](/docs/use-dbt-semantic-layer/exports).

## Часто задаваемые вопросы

<DetailsToggle alt_header="Могу ли я иметь несколько экспортов в одном сохраненном запросе?">

Да, это возможно. Однако различия будут заключаться в имени, схеме и стратегии материализации экспорта.
</DetailsToggle>

<DetailsToggle alt_header="Как я могу выбрать saved_queries по их типу ресурса?">

Чтобы включить все сохраненные запросы в выполнение сборки dbt, используйте флаг [`--resource-type`](/reference/global-configs/resource-type) и выполните команду `dbt build --resource-type saved_query`.

</DetailsToggle>

## Связанные документы
- [Проверка семантических узлов в CI-задании](/docs/deploy/ci-jobs#semantic-validations-in-ci)
- Настройка [кэширования](/docs/use-dbt-semantic-layer/sl-cache)