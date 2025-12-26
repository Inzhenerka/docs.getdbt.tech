---
resource_types: [snapshots]
description: "Target_schema - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: string
---

:::note

Начиная с dbt Core v1.9+ эта функциональность больше не используется. Вместо неё используйте конфигурацию [schema](/reference/resource-configs/schema), чтобы определить пользовательскую схему, при этом продолжая учитывать макрос `generate_schema_name`.

Попробуйте прямо сейчас в [<Constant name="cloud" /> треке релизов «Latest»](/docs/dbt-versions/cloud-release-tracks).

:::

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +target_schema: string

```

</File>

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
      target_schema="string"
) }}

```

</File>

## Описание
Схема, в которую dbt должен построить [снимок](/docs/build/snapshots) <Term id="table" />. Когда указан `target_schema`, снимки строятся в ту же `target_schema`, независимо от того, кто их запускает.

На **BigQuery** это аналогично `dataset`.

## По умолчанию

<VersionBlock firstVersion="1.9">В dbt Core v1.9+ и в релизном треке <Constant name="cloud" /> «Latest» этот параметр не является обязательным.</VersionBlock>

## Примеры
### Построение всех снимков в схеме с именем `snapshots`

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_schema: snapshots

```

</File>

