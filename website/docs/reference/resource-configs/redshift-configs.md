---
title: "Конфигурации Redshift"
description: "Конфигурации Redshift - прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "redshift-configs"
---

## Стратегии инкрементальной материализации

В dbt-redshift поддерживаются следующие стратегии инкрементальной материализации:

- `append` (по умолчанию, когда `unique_key` не определен)
- `merge`
- `delete+insert` (по умолчанию, когда `unique_key` определен)
- [`microbatch`](/docs/build/incremental-microbatch)

Все эти стратегии унаследованы от dbt-postgres.

## Оптимизация производительности

### Использование sortkey и distkey

Таблицы в Amazon Redshift имеют две мощные оптимизации для улучшения производительности запросов: distkeys и sortkeys. Указание этих значений в конфигурациях на уровне модели применяет соответствующие настройки в сгенерированном `CREATE TABLE` <Term id="ddl" />. Обратите внимание, что эти настройки не будут иметь эффекта на модели, установленные как `view` или `ephemeral`.

- `dist` может иметь значение `all`, `even`, `auto` или имя ключа.
- `sort` принимает список ключей сортировки, например: `['reporting_day', 'category']`. dbt создаст ключ сортировки в том же порядке, в котором указаны поля.
- `sort_type` может иметь значение `interleaved` или `compound`. Если значение не указано, по умолчанию используется `compound`.

При работе с ключами сортировки настоятельно рекомендуется следовать [лучшим практикам Redshift](https://docs.aws.amazon.com/prescriptive-guidance/latest/query-best-practices-redshift/best-practices-tables.html#sort-keys) по эффективности ключей сортировки и кардинальности.

Ключи сортировки и распределения должны быть добавлены в блок `{{ config(...) }}` в файлах модели `.sql`, например:

<File name='my_model.sql'>

```sql
-- Пример с одним ключом сортировки
{{ config(materialized='table', sort='reporting_day', dist='unique_id') }}

select ...


-- Пример с несколькими ключами сортировки
{{ config(materialized='table', sort=['category', 'region', 'reporting_day'], dist='received_at') }}

select ...


-- Пример с интерливированными ключами сортировки
{{ config(materialized='table',
          sort_type='interleaved'
          sort=['category', 'region', 'reporting_day'],
          dist='unique_id')
}}

select ...
```

</File>

Для получения дополнительной информации о distkeys и sortkeys ознакомьтесь с документацией Amazon:

- [AWS Documentation » Amazon Redshift » Database Developer Guide » Designing Tables » Choosing a Data Distribution Style](https://docs.aws.amazon.com/redshift/latest/dg/t_Distributing_data.html)
- [AWS Documentation » Amazon Redshift » Database Developer Guide » Designing Tables » Choosing Sort Keys](https://docs.aws.amazon.com/redshift/latest/dg/t_Sorting_data.html)

## Поздние связываемые представления

Redshift поддерживает <Term id="view">представления</Term>, не связанные с их зависимостями, или [поздние связываемые представления](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_VIEW.html#late-binding-views). Эта опция DDL "развязывает" представление от данных, которые оно выбирает. На практике это означает, что если верхние представления или таблицы удаляются с помощью каскадного квалификатора, позднее связываемое представление не будет удалено.

Использование поздних связываемых представлений в производственном развертывании dbt может значительно улучшить доступность данных в хранилище, особенно для моделей, которые материализуются как поздние связываемые представления и запрашиваются конечными пользователями, поскольку они не будут удалены при обновлении верхних моделей. Кроме того, поздние связываемые представления могут использоваться с [внешними таблицами](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_TABLE.html) через Redshift Spectrum.

Чтобы материализовать модель dbt как позднее связываемое представление, используйте опцию конфигурации `bind: false`:

<File name='my_view.sql'>

```sql
{{ config(materialized='view', bind=False) }}

select *
from source.data
```

</File>

Чтобы сделать все представления поздними связываемыми, настройте ваш файл `dbt_project.yml` следующим образом:

<File name='dbt_project.yml'>

```yaml
models:
  +bind: false # Материализовать все представления как поздние связываемые
  project_name:
    ....
```

</File>

## Материализованные представления

Адаптер Redshift поддерживает [материализованные представления](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-overview.html) с следующими параметрами конфигурации:

| Параметр                                                                        | Тип         | Обязательный | По умолчанию                                        | Поддержка мониторинга изменений |
|----------------------------------------------------------------------------------|--------------|--------------|----------------------------------------------------|---------------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`   | нет          | `apply`                                            | н/д                             |
| [`dist`](#using-sortkey-and-distkey)                                             | `<string>`   | нет          | `even`                                             | drop/create                     |
| [`sort`](#using-sortkey-and-distkey)                                             | `[<string>]` | нет          | `none`                                             | drop/create                     |
| [`sort_type`](#using-sortkey-and-distkey)                                        | `<string>`   | нет          | `auto`, если `sort` не указан <br />`compound`, если `sort` | drop/create                     |
| [`auto_refresh`](#auto-refresh)                                                  | `<boolean>`  | нет          | `false`                                           | alter                           |
| [`backup`](#backup)                                                              | `<string>`   | нет          | `true`                                            | н/д                             |

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
version: 2

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

Многие из этих параметров соответствуют их аналогам для таблиц и были связаны выше. Параметры, уникальные для материализованных представлений, это функциональность [auto-refresh](#auto-refresh) и [backup](#backup), которые описаны ниже.

Узнайте больше об этих параметрах в документации Redshift: [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html).

#### Автообновление

| Параметр      | Тип        | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|----------------|-------------|--------------|--------------|---------------------------------|
| `auto_refresh` | `<boolean>` | нет          | `false`      | alter                           |

Redshift поддерживает [автоматическое обновление](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-refresh.html#materialized-view-auto-refresh) для материализованных представлений. По умолчанию материализованное представление не обновляется автоматически. dbt отслеживает этот параметр на предмет изменений и применяет их с помощью оператора `ALTER`.

Узнайте больше о [параметрах](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters) в документации Redshift.

#### Резервное копирование

| Параметр | Тип        | Обязательный | По умолчанию | Поддержка мониторинга изменений |
|-----------|-------------|--------------|--------------|---------------------------------|
| `backup`  | `<boolean>` | нет          | `true`       | н/д                             |

Redshift поддерживает [резервное копирование](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html) конфигурации кластеров на уровне объектов. Этот параметр определяет, должно ли материализованное представление быть включено в резервную копию снимка кластера. По умолчанию материализованное представление будет включено в резервную копию во время снимка кластера. dbt не может отслеживать этот параметр, так как он не может быть запрошен в Redshift. Если значение изменится, материализованное представление должно пройти через `--full-refresh`, чтобы установить его.

Узнайте больше об этих параметрах в документации Redshift: [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters).

### Ограничения

Как и на большинстве платформ данных, существуют ограничения, связанные с материализованными представлениями. Некоторые из них стоит отметить:

- Материализованные представления не могут ссылаться на представления, временные таблицы, функции, определенные пользователем, или таблицы с поздним связыванием.
- Автообновление не может использоваться, если материализованное представление ссылается на изменяемые функции, внешние схемы или другое материализованное представление.

Дополнительную информацию об ограничениях материализованных представлений можно найти в документации Redshift: [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-limitations).

<VersionBlock firstVersion="1.8">

## Ограничения юнит-тестов

Redshift не поддерживает [юнит-тесты](/docs/build/unit-tests), когда SQL в общем выражении таблицы (CTE) содержит функции, такие как `LISTAGG`, `MEDIAN`, `PERCENTILE_CONT` и т. д. Эти функции должны выполняться против таблицы, созданной пользователем. dbt объединяет заданные строки, чтобы они стали частью CTE, что Redshift не поддерживает.

Чтобы поддерживать этот шаблон в будущем, dbt должен будет "материализовать" входные фикстуры как таблицы, а не интерполировать их как CTE. Если вас интересует эта функциональность, мы рекомендуем вам участвовать в этом вопросе на GitHub: [dbt-labs/dbt-core#8499](https://github.com/dbt-labs/dbt-core/issues/8499)

</VersionBlock>