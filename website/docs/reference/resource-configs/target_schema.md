---
resource_types: [snapshots]
description: "Target_schema - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: string
---

:::info

Начиная с dbt Core версии 1.9+, эта функциональность больше не используется. Используйте конфигурацию [database](/reference/resource-configs/database) в качестве альтернативы для определения пользовательской базы данных, при этом соблюдая макрос `generate_database_name`.

Попробуйте это сейчас в [dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks).

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

<VersionBlock lastVersion="1.8" >Это обязательный параметр, значение по умолчанию не предоставляется. </VersionBlock>
<VersionBlock firstVersion="1.9.1">В dbt Core версии 1.9+ и dbt Cloud "Latest" release track, это не обязательный параметр. </VersionBlock>

## Примеры
### Построение всех снимков в схеме с именем `snapshots`

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_schema: snapshots

```

</File>

<VersionBlock lastVersion="1.8" >

### Использование того же поведения именования схем, что и для моделей

Для нативной поддержки снимков, учитывающих окружение, обновитесь до версии dbt Core 1.9+ и удалите любую существующую конфигурацию `target_schema`.

</VersionBlock>