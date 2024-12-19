---
resource_types: [snapshots]
description: "Target_schema - Прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: string
---

:::info

Начиная с dbt Core v1.9+, эта функциональность больше не используется. Используйте конфигурацию [database](/reference/resource-configs/database) в качестве альтернативы для определения пользовательской базы данных, при этом уважая макрос `generate_database_name`. 

Попробуйте это сейчас в [последнем релизе dbt Cloud](/docs/dbt-versions/cloud-release-tracks).

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
Схема, в которую dbt должен создать [snapshot](/docs/build/snapshots) <Term id="table" />. Когда указано `target_schema`, snapshots создаются в одной и той же `target_schema`, независимо от того, кто их запускает.

На **BigQuery** это аналогично `dataset`.

## По умолчанию

<VersionBlock lastVersion="1.8" >Это обязательный параметр, значение по умолчанию не предоставляется. </VersionBlock>
<VersionBlock firstVersion="1.9.1">В dbt Core v1.9+ и в последнем релизе dbt Cloud это не обязательный параметр. </VersionBlock>

## Примеры
### Создание всех snapshots в схеме с именем `snapshots`

<File name='dbt_project.yml'>

```yml
snapshots:
  +target_schema: snapshots

```

</File>

<VersionBlock lastVersion="1.8" >

### Используйте такое же поведение именования схем, как и для моделей

Для нативной поддержки snapshots, учитывающих окружение, обновите до версии dbt Core 1.9+ и удалите любую существующую конфигурацию `target_schema`. 

</VersionBlock>