---
id: "persist_docs"
description: "Persist_docs - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: Dict[Str, Bool]
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value:'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
  ]
}>

<TabItem value="models">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +persist_docs:
      relation: true
      columns: true

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
  persist_docs={"relation": true, "columns": true}
) }}

select ...

```

</File>

</TabItem>

<TabItem value="sources">

Эта конфигурация не реализована для источников.

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +persist_docs:
      relation: true
      columns: true

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +persist_docs:
      relation: true
      columns: true

```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  persist_docs={"relation": true, "columns": true}
) }}

select ...

{% endsnapshot %}

```

</File>

</TabItem>

</Tabs>

## Определение

Опционально сохраняйте [описания ресурсов](/reference/resource-properties/description) в виде комментариев к столбцам и отношениям в базе данных. По умолчанию сохранение документации отключено, но его можно включить для конкретных ресурсов или групп ресурсов по мере необходимости.

## Поддержка

Конфигурация `persist_docs` поддерживается на наиболее широко используемых адаптерах dbt:
- Postgres
- Redshift
- Snowflake
- BigQuery
- Databricks 
- Apache Spark

Однако некоторые базы данных ограничивают, где и как можно добавлять описания к объектам базы данных. Эти адаптеры баз данных могут не поддерживать `persist_docs` или могут предлагать только частичную поддержку.

Некоторые известные проблемы и ограничения:

<WHCode>

<div warehouse="Databricks">

- Комментарии на уровне столбцов требуют `file_format: delta` (или другого "v2 формата файла")

</div>

<div warehouse="Snowflake">

- Известных проблем нет

</div>

</WHCode>

## Использование

### Документирование столбцов и отношений

Предоставьте [описание](/reference/resource-properties/description) для модели:

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: dim_customers
    description: Одна запись на клиента
    columns:
      - name: customer_id
        description: Первичный ключ

```

</File>

Включите `persist_docs` для столбцов и отношений в вашем проекте:

<File name='dbt_project.yml'>

```yml
models:
  +persist_docs:
    relation: true
    columns: true
```

</File>

Запустите dbt и убедитесь, что созданные отношения и столбцы аннотированы вашими описаниями:

<Lightbox src="/img/reference/persist_docs_relation.png"
          title="Описания отношений в BigQuery"/>

<Lightbox src="/img/reference/persist_docs_columns.png"
          title="Описания столбцов в BigQuery"/>