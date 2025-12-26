---
title: "Конфигурации Redshift"
description: "Конфигурации Redshift - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "redshift-configs"
tags: ['Redshift', 'dbt Fusion', 'dbt Core']
---

<!----
To-do:
- использовать структуру справочного документа для этой статьи/разделить на отдельные статьи
- подумать, стоит ли некоторые из них вынести за пределы моделей
--->

## Стратегии инкрементальной материализации

В dbt-redshift поддерживаются следующие стратегии инкрементальной материализации:

- `append` (по умолчанию, если `unique_key` не определен)
- `merge`
- `delete+insert` (по умолчанию, если `unique_key` определен)
- [`microbatch`](/docs/build/incremental-microbatch)

Все эти стратегии унаследованы от dbt-postgres.

## Оптимизация производительности

### Использование sortkey и distkey

Таблицы в Amazon Redshift имеют две мощные оптимизации для улучшения производительности запросов: distkeys и sortkeys. Указание этих значений в качестве конфигураций на уровне модели применяет соответствующие настройки в сгенерированном `CREATE TABLE` <Term id="ddl" />. Обратите внимание, что эти настройки не будут иметь эффекта на модели, установленные как `view` или `ephemeral`.

- `dist` может иметь значение `all`, `even`, `auto` или имя ключа.
- `sort` принимает список ключей сортировки, например: `['reporting_day', 'category']`. dbt будет строить ключ сортировки в том порядке, в котором указаны поля.
- `sort_type` может иметь значение `interleaved` или `compound`. Если настройка не указана, sort_type по умолчанию принимает значение `compound`.

При работе с ключами сортировки настоятельно рекомендуется следовать [лучшим практикам Redshift](https://docs.aws.amazon.com/prescriptive-guidance/latest/query-best-practices-redshift/best-practices-tables.html#sort-keys) по эффективности и кардинальности ключей сортировки.

Ключи сортировки и распределения следует добавлять в блок `{{ config(...) }}` в файлах модели `.sql`, например:

<File name='my_model.sql'>

```sql
-- Пример с одним ключом сортировки
{{ config(materialized='table', sort='reporting_day', dist='unique_id') }}

select ...


-- Пример с несколькими ключами сортировки
{{ config(materialized='table', sort=['category', 'region', 'reporting_day'], dist='received_at') }}

select ...


-- Пример с чередующимися ключами сортировки
{{ config(materialized='table',
          sort_type='interleaved'
          sort=['category', 'region', 'reporting_day'],
          dist='unique_id')
}}

select ...
```

</File>

Для получения дополнительной информации о distkeys и sortkeys, ознакомьтесь с документацией Amazon:

- [Документация AWS » Amazon Redshift » Руководство разработчика базы данных » Проектирование таблиц » Выбор стиля распределения данных](https://docs.aws.amazon.com/redshift/latest/dg/t_Distributing_data.html)
- [Документация AWS » Amazon Redshift » Руководство разработчика базы данных » Проектирование таблиц » Выбор ключей сортировки](https://docs.aws.amazon.com/redshift/latest/dg/t_Sorting_data.html)

## Поздние связывающие представления

Redshift поддерживает <Term id="view">представления</Term>, не связанные с их зависимостями, или [поздние связывающие представления](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_VIEW.html#late-binding-views). Эта опция DDL "отвязывает" представление от данных, которые оно выбирает. На практике это означает, что если вышестоящие представления или таблицы удаляются с квалификатором каскада, позднее связывающее представление не удаляется.

Использование поздних связывающих представлений в производственном развертывании dbt может значительно улучшить доступность данных в хранилище, особенно для моделей, которые материализуются как поздние связывающие представления и запрашиваются конечными пользователями, так как они не будут удалены при обновлении вышестоящих моделей. Кроме того, поздние связывающие представления могут использоваться с [внешними таблицами](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_TABLE.html) через Redshift Spectrum.

Чтобы материализовать модель dbt как позднее связывающее представление, используйте опцию конфигурации `bind: false`:

<File name='my_view.sql'>

```sql
{{ config(materialized='view', bind=False) }}

select *
from source.data
```

</File>

Чтобы сделать все представления поздними связывающими, настройте ваш файл `dbt_project.yml` следующим образом:

<File name='dbt_project.yml'>

```yaml
models:
  +bind: false # Материализовать все представления как поздние связывающие
  project_name:
    ....
```

</File>

## Материализованные представления

Адаптер Redshift поддерживает [материализованные представления](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-overview.html) с следующими параметрами конфигурации:

| Параметр                                                                         | Тип         | Обязательный | По умолчанию                                   | Поддержка мониторинга изменений |
|----------------------------------------------------------------------------------|-------------|--------------|------------------------------------------------|---------------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`  | нет          | `apply`                                        | н/д                             |
| [`dist`](#using-sortkey-and-distkey)                                             | `<string>`  | нет          | `even`                                         | drop/create                     |
| [`sort`](#using-sortkey-and-distkey)                                             | `[<string>]`| нет          | `none`                                         | drop/create                     |
| [`sort_type`](#using-sortkey-and-distkey)                                        | `<string>`  | нет          | `auto` если нет `sort` <br />`compound` если `sort` | drop/create                     |
| [`auto_refresh`](#auto-refresh)                                                  | `<boolean>` | нет          | `false`                                        | alter                           |
| [`backup`](#backup)                                                              | `<string>`  | нет          | `true`                                         | н/д                             |

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

Многие из этих параметров соответствуют их аналогам для таблиц и были связаны выше. Параметры, уникальные для материализованных представлений, это функциональность [автообновления](#auto-refresh) и [резервного копирования](#backup), которые описаны ниже.

Узнайте больше об этих параметрах в документации Redshift [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html).

#### Автообновление

| Параметр      | Тип        | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|---------------|------------|--------------|--------------|---------------------------------|
| `auto_refresh`| `<boolean>`| нет          | `false`      | alter                           |

Redshift поддерживает [автоматическую настройку обновления](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-refresh.html#materialized-view-auto-refresh) для материализованных представлений. По умолчанию материализованное представление не обновляется автоматически. dbt отслеживает этот параметр на предмет изменений и применяет их с помощью оператора `ALTER`.

Узнайте больше о [параметрах](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters) в документации Redshift.

#### Резервное копирование

| Параметр | Тип        | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|----------|------------|--------------|--------------|---------------------------------|
| `backup` | `<boolean>`| нет          | `true`       | н/д                             |

Redshift поддерживает [настройку резервного копирования](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html) кластеров на уровне объектов. Этот параметр определяет, должно ли материализованное представление быть включено в резервную копию кластера. По умолчанию материализованное представление будет включено в резервную копию во время снимка кластера. dbt не может отслеживать этот параметр, так как он не доступен для запроса в Redshift. Если значение изменится, материализованное представление должно пройти через `--full-refresh`, чтобы его установить.

Узнайте больше об этих параметрах в документации Redshift [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters).

### Ограничения

Как и в большинстве платформ данных, существуют ограничения, связанные с материализованными представлениями. Некоторые из них, которые стоит отметить, включают:

- Материализованные представления не могут ссылаться на представления, временные таблицы, пользовательские функции или поздние связывающие таблицы.
- Автообновление не может использоваться, если материализованное представление ссылается на изменяемые функции, внешние схемы или другое материализованное представление.

Узнайте больше об ограничениях материализованных представлений в документации Redshift [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-limitations).

## Ограничения модульных тестов

- Redshift не поддерживает [модульные тесты](/docs/build/unit-tests), если SQL в общем табличном выражении (CTE) содержит такие функции, как `LISTAGG`, `MEDIAN`, `PERCENTILE_CONT` и т. д. Эти функции должны выполняться над таблицей, созданной пользователем. dbt объединяет заданные строки так, чтобы они стали частью CTE, а Redshift этого не поддерживает.

  Чтобы в будущем поддержать такой сценарий, dbt потребовалось бы «материализовывать» входные фикстуры в виде таблиц, а не подставлять их как CTE. Если вам интересна такая функциональность, мы рекомендуем принять участие в обсуждении этого issue на GitHub: [dbt-labs/<Constant name="core" />#8499](https://github.com/dbt-labs/dbt-core/issues/8499)

- Redshift не поддерживает модульные тесты, которые зависят от источников (sources) в базе данных, отличной от базы данных моделей. Подробнее см. соответствующий issue на GitHub: https://github.com/dbt-labs/dbt-redshift/issues/995
