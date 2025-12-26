---
title: Сохраненные запросы
id: saved-queries
description: "Сохраненные запросы — это способ сохранить часто используемые запросы в MetricFlow. Они могут использоваться для экономии времени и избегания повторного написания одного и того же запроса."
sidebar_label: "Сохраненные запросы"
tags: [Метрики, Семантический слой]
---

Сохраненные запросы — это способ сохранить часто используемые запросы в MetricFlow. Вы можете сгруппировать метрики, измерения и фильтры, которые логически связаны, в сохраненный запрос. Сохраненные запросы являются узлами и видны в dbt <Term id="dag" />.

Saved queries служат базовым строительным блоком, позволяя вам [настраивать экспорты](#configure-exports) в конфигурации сохранённого запроса. Exports развивает эту функциональность дальше, позволяя вам [планировать выполнение и запись saved queries](/docs/use-dbt-semantic-layer/exports) напрямую в вашей data platform с использованием [планировщика заданий <Constant name="cloud" />](/docs/deploy/job-scheduler).

## Параметры

Чтобы создать сохраненный запрос, обратитесь к следующей таблице параметров.

:::tip
Обратите внимание, что мы используем точечную нотацию (`.`), чтобы указать, является ли параметр вложенным в другой параметр. Например, `query_params.metrics` означает, что параметр `metrics` вложен в `query_params`.
:::

<!-- For versions 1.9 and higher -->
<VersionBlock firstVersion="1.9">

| Параметр | Тип    | Обязательный | Описание    |
|-------|---------|----------|----------------|
| `name`       | String    | Required     | Имя объекта сохранённого запроса.          |
| `description`     | String      | Required     | Описание сохранённого запроса.     |
| `label`     | String      | Required     | Отображаемое имя для сохранённого запроса. Это значение будет показано в downstream‑инструментах.    |
| `config`     | String      | Optional     | Используйте свойство [`config`](/reference/resource-properties/config) для задания конфигураций сохранённого запроса. Поддерживаются конфигурации `cache`, [`enabled`](/reference/resource-configs/enabled), `export_as`, [`group`](/reference/resource-configs/group), [`meta`](/reference/resource-configs/meta), [`tags`](/reference/resource-configs/tags) и [`schema`](/reference/resource-configs/schema).   |
| `config.cache.enabled`     | Object      | Optional     | Объект с вложенным ключом, который используется для указания, должен ли сохранённый запрос заполнять [cache](/docs/use-dbt-semantic-layer/sl-cache). Принимает значение `true` или `false`. По умолчанию `false`. |
| `limit`     | Integer    | Optional     | Максимальное количество строк, которое нужно вернуть. |
| `order_by`  | String     | Optional     | Метрики и group by, по которым нужно упорядочить запрос. |
| `query_params`       | Structure   | Required     | Содержит параметры запроса. |
| `query_params.metrics`   | List or String   | Optional    | Список метрик, которые будут использоваться в запросе, в формате, соответствующем интерфейсу командной строки. |
| `query_params.group_by`    | List or String          | Optional    | Список Entities и Dimensions, которые будут использоваться в запросе, включая `Dimension` или `TimeDimension`. |
| `query_params.where`        | List or String | Optional  | Список строк, которые могут включать объекты `Dimension` или `TimeDimension`. |
| `exports`     | List or Structure | Optional    | Список экспортов, задаваемых внутри структуры exports.     |
| `exports.name`       | String               | Required     | Имя объекта экспорта.      |
| `exports.config`     | List or Structure     | Required     | Свойство [`config`](/reference/resource-properties/config) для задания параметров экспорта.  |
| `exports.config.export_as` | String    | Required     | Тип экспорта, который нужно выполнить. В настоящее время доступны варианты table или view, а в ближайшем будущем — cache.   |
| `exports.config.schema`   | String   | Optional    | [Schema](/reference/resource-configs/schema) для создания таблицы или представления. Этот параметр нельзя использовать для кэширования.   |
| `exports.config.alias`  | String     | Optional    | [Alias](/reference/resource-configs/alias) таблицы, используемый при записи таблицы или представления. Этот параметр нельзя использовать для кэширования.  |

</VersionBlock>

Если вы используете несколько метрик в сохраненном запросе, то вы сможете ссылаться только на общие измерения, которые эти метрики разделяют в `group_by` или `where` выражениях. Используйте префикс имени сущности с объектом Dimension, например `Dimension('user__ds')`.

## Настройка сохраненного запроса

Используйте сохранённые запросы (saved queries) для определения и управления общими запросами <Constant name="semantic_layer" /> в YAML, включая метрики и измерения. Сохранённые запросы позволяют организовывать и повторно использовать типовые запросы MetricFlow внутри проектов dbt. Например, вы можете группировать связанные метрики для более удобной структуры, а также включать часто используемые измерения и фильтры.

В конфигурации сохранённого запроса вы также можете использовать [кэширование](/docs/use-dbt-semantic-layer/sl-cache) вместе с планировщиком заданий <Constant name="cloud" />, чтобы кэшировать часто используемые запросы, повышать производительность и снижать вычислительные затраты.

<!-- For versions 1.9 and higher -->

В следующем примере вы можете задать сохраненный запрос в файле `semantic_model.yml`:

<File name='semantic_model.yml'>
<VersionBlock firstVersion="1.9">

```yaml
saved_queries:
  - name: test_saved_query
    description: "{{ doc('saved_query_description') }}"
    label: Test saved query
    config:
      cache:
        [enabled](/reference/resource-configs/enabled): true | false
        [tags](/reference/resource-configs/tags): 'my_tag'
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
          export_as: table 
          alias: my_export_alias
          schema: my_export_schema_name
```
</VersionBlock>

</File>

Обратите внимание, что параметр `export_as` можно задать как для сохранённого запроса, так и в конфигурации экспорта [config](/reference/resource-properties/config), при этом значение, указанное в конфигурации экспорта, имеет приоритет. Если какой‑либо ключ не задан в конфигурации экспорта, он будет унаследован из конфигурации сохранённого запроса.

#### Where выражение

Используйте следующий синтаксис для ссылки на сущности, измерения, временные измерения или метрики в фильтрах и обратитесь к [Метрики как измерения](/docs/build/ref-metrics-in-filters) для получения подробной информации о том, как использовать метрики как измерения с фильтрами метрик:

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

#### Сохранённые запросы на уровне проекта

Чтобы включить сохраненные запросы на уровне проекта, вы можете задать конфигурацию `saved-queries` в файле [`dbt_project.yml`](/reference/dbt_project.yml). Это сэкономит вам время на настройку сохраненных запросов в каждом файле:

<File name='dbt_project.yml'>

```yaml
saved-queries:
  my_saved_query:
    +cache:
      enabled: true
```
</File>

Для получения дополнительной информации о `dbt_project.yml` и соглашениях об именах конфигураций, см. [страницу справки dbt_project.yml](/reference/dbt_project.yml#naming-convention).

Чтобы собрать `saved_queries`:

- Убедитесь, что в вашей среде задана правильная [переменная окружения](/docs/use-dbt-semantic-layer/exports#set-environment-variable).
- Выполните команду `dbt build --resource-type saved_query`, используя [флаг `--resource-type`](/reference/global-configs/resource-type).

## Настройка экспортов

Экспорты — это дополнительная конфигурация, добавляемая к сохраненному запросу. Они определяют _как_ записать сохраненный запрос, вместе со схемой и именем таблицы.

После того как вы настроили сохранённый запрос и задали базовый блок, вы можете сконфигурировать экспорты в YAML‑файле конфигурации `saved_queries` (в том же файле, где находятся определения метрик). Это также позволит вам [запускать экспорты](#run-exports) автоматически внутри вашей платформы данных с помощью [планировщика заданий <Constant name="cloud" />](/docs/deploy/job-scheduler).

Следующий пример показывает сохраненный запрос с экспортом:

<File name='semantic_model.yml'>
<VersionBlock firstVersion="1.9">

```yaml
saved_queries:
  - name: order_metrics
    description: Relevant order metrics
    config:
      tags:
        - order_metrics
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
         - ... # Дополнительные where выражения
    exports:
      - name: order_metrics
        config:
          export_as: table # Доступные варианты: table, view
          [alias](/reference/resource-configs/alias): my_export_alias # Необязательно — по умолчанию используется имя Export
          [schema](/reference/resource-configs/schema): my_export_schema_name # Необязательно — по умолчанию используется схема деплоя
```
</VersionBlock>


</File>

## Запуск экспортов

После того как вы настроили экспорты, можно пойти дальше и запускать их так, чтобы сохранённые запросы автоматически записывались в вашу платформу данных с помощью [планировщика заданий <Constant name="cloud" />](/docs/deploy/job-scheduler). Эта возможность доступна только при использовании [<Constant name="semantic_layer" /> в <Constant name="cloud" />](/docs/use-dbt-semantic-layer/dbt-sl).

Для получения дополнительной информации о том, как запускать экспорты, обратитесь к документации [Экспорты](/docs/use-dbt-semantic-layer/exports).

## Часто задаваемые вопросы

<DetailsToggle alt_header="Могу ли я иметь несколько экспортов в одном сохраненном запросе?">

Да, это возможно. Однако разница будет в имени, схеме и стратегии материализации экспорта.
</DetailsToggle>

<DetailsToggle alt_header="Как я могу выбрать saved_queries по их типу ресурса?">

Чтобы включить все сохраненные запросы в выполнение сборки dbt, используйте флаг [`--resource-type`](/reference/global-configs/resource-type) и выполните команду `dbt build --resource-type saved_query`.

</DetailsToggle>

## Связанные документы
- [Проверка семантических узлов в CI задаче](/docs/deploy/ci-jobs#semantic-validations-in-ci)
- Настройка [кэширования](/docs/use-dbt-semantic-layer/sl-cache)