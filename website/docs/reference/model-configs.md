---
title: Конфигурации моделей
description: "Прочтите это руководство, чтобы понять конфигурации моделей в dbt."
meta:
  resource_type: Models
---

import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';

## Связанная документация
* [Модели](/docs/build/models)
* [Команда `run`](/reference/commands/run)

## Доступные конфигурации
### Конфигурации, специфичные для модели

<ConfigResource meta={frontMatter.meta}/>

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация в SQL‑файле', value: 'config', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

<VersionBlock lastVersion="1.9">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): <materialization_name>
    [+](/reference/resource-configs/plus-prefix)[sql_header](/reference/resource-configs/sql_header): <string>
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail #только для материализованных представлений на поддерживаемых адаптерах
    [+](/reference/resource-configs/plus-prefix)[unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>

```

</VersionBlock>

<VersionBlock firstVersion="1.10">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): <materialization_name>
    [+](/reference/resource-configs/plus-prefix)[sql_header](/reference/resource-configs/sql_header): <string>
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail #only for materialized views on supported adapters
    [+](/reference/resource-configs/plus-prefix)[unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-configs/freshness): <dict>
    
```

</VersionBlock>
</File>

</TabItem>

<TabItem value="property-yaml">

<VersionBlock lastVersion="1.9">

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): <materialization_name>
      [sql_header](/reference/resource-configs/sql_header): <string>
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail #только для материализованных представлений на поддерживаемых адаптерах
      [unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>

```
</File>
</VersionBlock>

<VersionBlock firstVersion="1.10">

Обратите внимание, что большинство конфигураций моделей определены в `config`, тогда как `build_after` задаётся в `freshness`.

<File name='models/properties.yml'>

```yaml

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): <materialization_name>
      [sql_header](/reference/resource-configs/sql_header): <string>
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail #only for materialized views on supported adapters
      [unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>
      [freshness](/reference/resource-configs/freshness):
        # build_after is nested under freshness. Available on dbt platform Enterprise tiers only.
        build_after: <dict>
```

</File>
</VersionBlock>
</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

<VersionBlock lastVersion="1.9">

```sql

{{ config(
    [materialized](/reference/resource-configs/materialized)="<materialization_name>",
    [sql_header](/reference/resource-configs/sql_header)="<string>"
    [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail #только для материализованных представлений на поддерживаемых адаптерах
    [unique_key](/reference/resource-configs/unique_key)='column_name_or_expression'
) }}

```

</VersionBlock>

<VersionBlock firstVersion="1.10">

```sql

{{ config(
    [materialized](/reference/resource-configs/materialized)="<materialization_name>",
    [sql_header](/reference/resource-configs/sql_header)="<string>"
    [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail # only for materialized views for supported adapters
    [unique_key](/reference/resource-configs/unique_key)='column_name_or_expression'
    [freshness](/reference/resource-configs/freshness)=<dict>
) }}
```

</VersionBlock>

</File>

</TabItem>

</Tabs>

### Общие конфигурации

<ConfigGeneral />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация в SQL-файле', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[pre-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[post-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[database](/reference/resource-configs/database): <string>
    [+](/reference/resource-configs/plus-prefix)[schema](/reference/resource-properties/schema): <string>
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[persist_docs](/reference/resource-configs/persist_docs): <dict>
    [+](/reference/resource-configs/plus-prefix)[full_refresh](/reference/resource-configs/full_refresh): <boolean>
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[grants](/reference/resource-configs/grants): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[contract](/reference/resource-configs/contract): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[event_time](/reference/resource-configs/event-time): my_time_field

```
</VersionBlock>
</File>

</TabItem>

<TabItem value="property-yaml">

<File name='models/properties.yml'>

<VersionBlock firstVersion="1.9">

```yaml

models:
  - name: [<model-name>]
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-properties/schema): <string>
      [alias](/reference/resource-configs/alias): <string>
      [persist_docs](/reference/resource-configs/persist_docs): <dict>
      [full_refresh](/reference/resource-configs/full_refresh): <boolean>
      [meta](/reference/resource-configs/meta): {<dictionary>}
      [grants](/reference/resource-configs/grants): {<dictionary>}
      [contract](/reference/resource-configs/contract): {<dictionary>}
      [event_time](/reference/resource-configs/event-time): my_time_field
```

</VersionBlock>
</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>


<VersionBlock firstVersion="1.9">

```sql

{{ config(
    [enabled](/reference/resource-configs/enabled)=true | false,
    [tags](/reference/resource-configs/tags)="<string>" | ["<string>"],
    [pre_hook](/reference/resource-configs/pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [post_hook](/reference/resource-configs/pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [database](/reference/resource-configs/database)="<string>",
    [schema](/reference/resource-properties/schema)="<string>",
    [alias](/reference/resource-configs/alias)="<string>",
    [persist_docs](/reference/resource-configs/persist_docs)={<dict>},
    [meta](/reference/resource-configs/meta)={<dict>},
    [grants](/reference/resource-configs/grants)={<dict>},
    [contract](/reference/resource-configs/contract)={<dictionary>},
    [event_time](/reference/resource-configs/event-time)='my_time_field',

) }}

```
</VersionBlock>

</File>

</TabItem>

</Tabs>

### Конфигурации, специфичные для хранилища
* [Конфигурации BigQuery](/reference/resource-configs/bigquery-configs)
* [Конфигурации Redshift](/reference/resource-configs/redshift-configs)
* [Конфигурации Snowflake](/reference/resource-configs/snowflake-configs)
* [Конфигурации Databricks](/reference/resource-configs/databricks-configs)
* [Конфигурации Spark](/reference/resource-configs/spark-configs)

## Конфигурирование моделей

Конфигурации моделей применяются иерархически. Вы можете настраивать модели как в установленном пакете, так и в вашем проекте dbt следующими способами, перечисленными в порядке приоритета:

1. Используя Jinja-макрос `config()` внутри модели.
2. Используя `config` как [свойство ресурса](/reference/model-properties) в `.yml`‑файле.
3. Из YAML‑файла проекта (`dbt_project.yml`), в разделе `models:`. В этом случае модель, находящаяся на самом глубоком уровне вложенности, будет иметь наивысший приоритет.

Наиболее специфичная конфигурация всегда имеет приоритет. Например, в YAML‑файле проекта конфигурации, применённые к подкаталогу `marketing`, будут иметь приоритет над конфигурациями, применёнными ко всему проекту `jaffle_shop`. Чтобы применить конфигурацию к модели или каталогу моделей, определите [путь к ресурсу](/reference/resource-configs/resource-path) в виде вложенных ключей словаря.

Конфигурации моделей в вашем корневом проекте dbt имеют _высший_ приоритет по сравнению с конфигурациями в установленных пакетах. Это позволяет вам переопределять конфигурации установленных пакетов, предоставляя больше контроля над вашими запусками dbt.

## Пример

### Конфигурирование каталогов моделей в `dbt_project.yml`

Чтобы настроить модели в вашем файле `dbt_project.yml`, используйте опцию конфигурации `models:`. Убедитесь, что вы указали пространство имен для ваших конфигураций в вашем проекте (показано ниже):

<File name='dbt_project.yml'>

```yml

name: dbt_labs

models:
  # Убедитесь, что вы указали пространство имен для конфигураций моделей в вашем проекте
  dbt_labs:

    # Это настраивает модели, найденные в models/events/
    events:
      +enabled: true
      +materialized: view

      # Это настраивает модели, найденные в models/events/base
      # Эти модели будут эфемерными, так как конфигурация выше будет переопределена
      base:
        +materialized: ephemeral

      ...

```

</File>

### Применение конфигураций только к одной модели

Некоторые типы конфигураций специфичны для конкретной модели. В этих случаях размещение конфигураций в файле `dbt_project.yml` может быть неудобным. Вместо этого вы можете указать эти конфигурации в начале файла модели `.sql` или в его индивидуальных YAML-свойствах.

<File name='models/events/base/base_events.sql'>

```sql
{{
  config(
    materialized = "table",
    tags = ["core", "events"]
  )
}}

```sql
select * from {{ ref('raw_events') }}
```

</File>

<File name='models/events/base/properties.yml'>

```yaml

models:
  - name: base_events
    description: "Standardized event data from raw sources"
    columns:
      - name: user_id
        description: "Unique identifier for a user"
        data_tests:
          - not_null
          - unique
      - name: event_type
        description: "Type of event recorded (click, purchase, etc.)"
```

</File>

<VersionBlock firstVersion="1.10">

### Настройка свежести источников

Конфигурация `freshness` на уровне модели позволяет перестраивать модели только тогда, когда доступны новые данные в источниках или в апстрим‑моделях. Это полезно для моделей, которые зависят от других моделей, но не требуют обновления при каждом запуске. Подробнее см. в разделе [freshness](/reference/resource-configs/freshness).

Обратите внимание: для каждой конфигурации `freshness` необходимо либо задать значения **и для `count`, и для `period`**, либо указать `freshness: null`. Это требование распространяется на все типы `freshness`: `freshness.warn_after`, `freshness.error_after` и `freshness.build_after`.

Ниже приведён пример файла `my_model.yml`, в котором используется конфигурация `freshness`:

<File name="models/my_model.yml">
  
```yml
models:
  - name: stg_orders
    config:
      freshness:
        build_after:  # перестраивать эту модель не чаще, чем раз в X единиц времени, при условии наличия новых данных. Доступно только на Enterprise-тарифах dbt Platform.
          count: <positive_integer>
          period: minute | hour | day
          updates_on: any | all # необязательная настройка
```
  
</File>

</VersionBlock>
