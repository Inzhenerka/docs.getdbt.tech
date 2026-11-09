---
resource_types: [snapshots]
description: "Target_schema - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: string
---

:::note

Начиная с <Constant name="dbt" /> v1.9, эта функциональность больше не используется. Вместо неё используйте конфигурацию [schema](/reference/resource-configs/schema), чтобы задать пользовательскую схему с учётом макроса `generate_schema_name`. 

Попробуйте это уже сейчас в [канале выпусков <Constant name="dbt" /> **v1 Latest**](/docs/dbt-versions/dbt-release-tracks).

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

## Описание {#description}
Схема, в которую dbt должен построить [снимок](/docs/build/snapshots) <Term id="table" />. Когда указан `target_schema`, снимки строятся в ту же `target_schema`, независимо от того, кто их запускает.

На **BigQuery** это аналогично `dataset`.

## По умолчанию {#default}

<VersionBlock firstVersion="1.9">В <Constant name="dbt" /> версии 1.9 и выше этот параметр не является обязательным. </VersionBlock>

## Примеры {#examples}
### Построение всех снимков в схеме с именем `snapshots` {#build-all-snapshots-in-a-schema-named-snapshots}

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_schema: snapshots

```

</File>

