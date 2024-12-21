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
    { label: 'Блок конфигурации', value: 'config', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): <materialization_name>
    [+](/reference/resource-configs/plus-prefix)[sql_header](/reference/resource-configs/sql_header): <string>
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail #только для материализованных представлений на поддерживаемых адаптерах
    [+](/reference/resource-configs/plus-prefix)[unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>

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
      [materialized](/reference/resource-configs/materialized): <materialization_name>
      [sql_header](/reference/resource-configs/sql_header): <string>
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail #только для материализованных представлений на поддерживаемых адаптерах
      [unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>

```

</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

```sql

{{ config(
    [materialized](/reference/resource-configs/materialized)="<materialization_name>",
    [sql_header](/reference/resource-configs/sql_header)="<string>"
    [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail #только для материализованных представлений на поддерживаемых адаптерах
    [unique_key](/reference/resource-configs/unique_key)='column_name_or_expression'
) }}

```

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
    { label: 'Блок конфигурации', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

<VersionBlock lastVersion="1.8">

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

```
</VersionBlock>

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

<VersionBlock lastVersion="1.8">

```yaml
version: 2

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
```
</VersionBlock>

<VersionBlock firstVersion="1.9">

```yaml
version: 2

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

<VersionBlock lastVersion="1.8">

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
    [contract](/reference/resource-configs/contract)={<dictionary>}
) }}

```
</VersionBlock>

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

1. Используя макрос Jinja `config()` внутри модели.
2. Используя `config` [свойство ресурса](/reference/model-properties) в файле `.yml`.
3. Из файла проекта `dbt_project.yml`, под ключом `models:`. В этом случае модель, вложенная глубже всего, будет иметь наивысший приоритет.

Наиболее специфичная конфигурация всегда имеет приоритет. В файле проекта, например, конфигурации, примененные к подкаталогу `marketing`, будут иметь приоритет над конфигурациями, примененными ко всему проекту `jaffle_shop`. Чтобы применить конфигурацию к модели или каталогу моделей, определите [путь ресурса](/reference/resource-configs/resource-path) как вложенные ключи словаря.

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
    sort = 'event_time',
    dist = 'event_id'
  )
}}

select * from ...
```

</File>

<File name='models/events/base/properties.yml'>

```yaml
version: 2

models:
  - name: base_events
    config:
      materialized: table
      sort: event_time
      dist: event_id
```

</File>