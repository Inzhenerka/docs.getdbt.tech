---
title: "Конфигурации Redshift"
description: "Конфигурации Redshift — подробное руководство, которое поможет разобраться с настройками в dbt."
id: "redshift-configs"
tags: ['Redshift', 'dbt Fusion', 'dbt Core']
---

<!----
To-do:
- use the reference doc structure for this article/split into separate articles
- think about whether some of these should be outside of models
--->

## Стратегии инкрементальной материализации

В dbt-redshift поддерживаются следующие стратегии инкрементальной материализации:

- `append` (по умолчанию, если `unique_key` не задан)
- `merge`
- `delete+insert` (по умолчанию, если `unique_key` задан)
- [`microbatch`](/docs/build/incremental-microbatch)

Все эти стратегии унаследованы из dbt-postgres.

## Оптимизация производительности

### Использование sortkey и distkey

Таблицы в Amazon Redshift имеют два мощных механизма оптимизации для повышения производительности запросов: distkeys и sortkeys. Указание этих значений в конфигурации модели приводит к применению соответствующих настроек в сгенерированном `CREATE TABLE` <Term id="ddl" />. Обратите внимание, что эти настройки не будут иметь эффекта для моделей с материализацией `view` или `ephemeral`.

- `dist` может принимать значение `all`, `even`, `auto` или имя ключа.
- `sort` принимает список sort key, например: `['reporting_day', 'category']`. dbt создаст sort key в том порядке, в котором указаны поля.
- `sort_type` может иметь значение `interleaved` или `compound`. Если значение не указано, `sort_type` по умолчанию равен `compound`.

При работе с sort key настоятельно рекомендуется следовать [лучшим практикам Redshift](https://docs.aws.amazon.com/prescriptive-guidance/latest/query-best-practices-redshift/best-practices-tables.html#sort-keys), касающимся эффективности sort key и кардинальности.

Sort key и dist key следует добавлять в блок `{{ config(...) }}` в `.sql`-файлах моделей, например:

<File name='my_model.sql'>

```sql
-- Example with one sort key
{{ config(materialized='table', sort='reporting_day', dist='unique_id') }}

select ...


-- Example with multiple sort keys
{{ config(materialized='table', sort=['category', 'region', 'reporting_day'], dist='received_at') }}

select ...


-- Example with interleaved sort keys
{{ config(materialized='table',
          sort_type='interleaved'
          sort=['category', 'region', 'reporting_day'],
          dist='unique_id')
}}

select ...
```

</File>

Подробнее о distkeys и sortkeys см. в документации Amazon:

- [AWS Documentation » Amazon Redshift » Database Developer Guide » Designing Tables » Choosing a Data Distribution Style](https://docs.aws.amazon.com/redshift/latest/dg/t_Distributing_data.html)
- [AWS Documentation » Amazon Redshift » Database Developer Guide » Designing Tables » Choosing Sort Keys](https://docs.aws.amazon.com/redshift/latest/dg/t_Sorting_data.html)

## Позднее связывание представлений (Late binding views)

Redshift поддерживает <Term id="view">представления</Term>, не связанные жёстко со своими зависимостями, или [late binding views](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_VIEW.html#late-binding-views). Эта опция DDL «отвязывает» представление от данных, из которых оно выбирает. На практике это означает, что если вышестоящие представления или таблицы удаляются с использованием `cascade`, late-binding view при этом не будет удалено.

Использование late-binding views в продакшн-развёртывании dbt может значительно повысить доступность данных в хранилище, особенно для моделей, материализованных как late-binding views и используемых конечными пользователями, поскольку они не будут удаляться при обновлении вышестоящих моделей. Кроме того, late-binding views можно использовать с [external tables](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_TABLE.html) через Redshift Spectrum.

Чтобы материализовать модель dbt как late-binding view, используйте параметр конфигурации `bind: false`:

<File name='my_view.sql'>

```sql
{{ config(materialized='view', bind=False) }}

select *
from source.data
```

</File>

Чтобы сделать все представления late-binding, настройте файл `dbt_project.yml` следующим образом:

<File name='dbt_project.yml'>

```yaml
models:
  +bind: false # Materialize all views as late-binding
  project_name:
    ....
```

</File>

## Материализованные представления

Адаптер Redshift поддерживает [материализованные представления](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-overview.html)
со следующими параметрами конфигурации:

| Parameter                                                                        | Type         | Required | Default                                        | Change Monitoring Support |
|----------------------------------------------------------------------------------|--------------|----------|------------------------------------------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`   | no       | `apply`                                        | n/a                       |
| [`dist`](#using-sortkey-and-distkey)                                             | `<string>`   | no       | `even`                                         | drop/create               |
| [`sort`](#using-sortkey-and-distkey)                                             | `[<string>]` | no       | `none`                                         | drop/create               |
| [`sort_type`](#using-sortkey-and-distkey)                                        | `<string>`   | no       | `auto` if no `sort` <br />`compound` if `sort` | drop/create               |
| [`auto_refresh`](#auto-refresh)                                                  | `<boolean>`  | no       | `false`                                        | alter                     |
| [`backup`](#backup)                                                              | `<string>`   | no       | `true`                                         | n/a                       |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project YAML file', value: 'project-yaml', },
    { label: 'Properties YAML file', value: 'property-yaml', },
    { label: 'SQL file config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): materialized_view
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[dist](#using-sortkey-and-distkey): all | auto | even | <field-name>
    [+](/reference/resource-configs/plus-prefix)[sort](#using-sortkey-and-distkey): <field-name> | [<field-name>]
    [+](/reference/resource-configs/plus-prefix)[sort_type](#using-sortkey-and-distkey): auto | compound | interleaved
    [+](/reference/resource-configs/plus-prefix)[auto_refresh](#auto-refresh): true | false
    [+](/reference/resource-configs/plus-prefix)[backup](#backup): true | false
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): materialized_view
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [dist](#using-sortkey-and-distkey): all | auto | even | <field-name>
      [sort](#using-sortkey-and-distkey): <field-name> | [<field-name>]
      [sort_type](#using-sortkey-and-distkey): auto | compound | interleaved
      [auto_refresh](#auto-refresh): true | false
      [backup](#backup): true | false
```

</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)="materialized_view",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [dist](#using-sortkey-and-distkey)="all" | "auto" | "even" | "<field-name>",
    [sort](#using-sortkey-and-distkey)=["<field-name>"],
    [sort_type](#using-sortkey-and-distkey)="auto" | "compound" | "interleaved",
    [auto_refresh](#auto-refresh)=true | false,
    [backup](#backup)=true | false,
) }}
```

</File>

</TabItem>

</Tabs>

Многие из этих параметров соответствуют параметрам таблиц и были связаны выше.
Параметры, уникальные для материализованных представлений, — это функции [auto-refresh](#auto-refresh) и [backup](#backup), которые описаны ниже.

Подробнее об этих параметрах см. в документации Redshift: [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html).

#### Auto-refresh

| Parameter      | Type        | Required | Default | Change Monitoring Support |
|----------------|-------------|----------|---------|---------------------------|
| `auto_refresh` | `<boolean>` | no       | `false` | alter                     |

Redshift поддерживает настройку [автоматического обновления](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-refresh.html#materialized-view-auto-refresh) для материализованных представлений.
По умолчанию материализованное представление не обновляется автоматически.
dbt отслеживает изменения этого параметра и применяет их с помощью оператора `ALTER`.

Дополнительную информацию о [параметрах](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters) см. в документации Redshift.

#### Backup

| Parameter | Type        | Required | Default | Change Monitoring Support |
|-----------|-------------|----------|---------|---------------------------|
| `backup`  | `<boolean>` | no       | `true`  | n/a                       |

Redshift поддерживает настройку [резервного копирования](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html) на уровне объектов кластера.
Этот параметр определяет, должно ли материализованное представление включаться в резервные копии (snapshot) кластера.
По умолчанию материализованное представление включается в snapshot кластера.
dbt не может отслеживать этот параметр, так как он недоступен для запросов внутри Redshift.
Если значение изменяется, материализованное представление необходимо пересобрать с использованием `--full-refresh`, чтобы применить настройку.

Подробнее об этих параметрах см. в документации Redshift: [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters).

### Ограничения

Как и у большинства платформ данных, у материализованных представлений есть ограничения. Некоторые из наиболее важных:

- Материализованные представления не могут ссылаться на представления, временные таблицы, пользовательские функции или late-binding tables.
- Auto-refresh нельзя использовать, если материализованное представление ссылается на изменяемые функции, внешние схемы или другое материализованное представление.

Дополнительную информацию об ограничениях материализованных представлений см. в документации Redshift: [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-limitations).

## Ограничения unit-тестов

- Redshift не поддерживает [unit tests](/docs/build/unit-tests), если SQL в common table expression (CTE) содержит функции, такие как `LISTAGG`, `MEDIAN`, `PERCENTILE_CONT` и т.п. Эти функции должны выполняться над таблицей, созданной пользователем. dbt объединяет переданные строки так, чтобы они были частью CTE, что Redshift не поддерживает.

  Чтобы в будущем поддержать этот паттерн, dbt потребуется «материализовывать» входные фикстуры в виде таблиц, а не подставлять их как CTE. Если вам интересна эта функциональность, мы рекомендуем поучаствовать в обсуждении issue на GitHub: [dbt-labs/<Constant name="core" />#8499](https://github.com/dbt-labs/dbt-core/issues/8499)

- Redshift не поддерживает unit-тесты, которые используют источники (sources) в базе данных, отличной от базы данных моделей. Подробнее см. соответствующий issue на GitHub: https://github.com/dbt-labs/dbt-redshift/issues/995
