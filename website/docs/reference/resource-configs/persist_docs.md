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

<VersionBlock firstVersion="1.9">
<File name='snapshots/snapshot_name.yml'>

```yaml

snapshots:
  - name: snapshot_name
    [config](/reference/resource-properties/config):
      persist_docs:
        relation: true
        columns: true
```

</File>
</VersionBlock>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot [snapshot_name](/reference/resource-configs/snapshot_name) %}

{{ config(
  persist_docs={"relation": true, "columns": true}
) }}

select ...

{% endsnapshot %}

```

</File>

</TabItem>

</Tabs>

## Определение {#definition}

Опционально сохраняйте [описания ресурсов](/reference/resource-properties/description) в виде комментариев к столбцам и отношениям в базе данных. По умолчанию сохранение документации отключено, но его можно включить для конкретных ресурсов или групп ресурсов по мере необходимости.

## Поддержка {#support}

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

- Комментарии на уровне колонок требуют `file_format: delta` (или другого «v2 file format»).

</div>

<div warehouse="Snowflake">

- Если имя колонки в SQL-модели задано в смешанном регистре (например, `ca_net_ht_N`), документация для этой колонки **не будет сохранена**. Чтобы документация сохранялась, есть два варианта:

  - Определить имя колонки в соответствующем YML-файле, используя **только строчные или только заглавные буквы**.
  - Использовать конфигурацию [`quote`](../resource-properties/columns.md#quoter) в соответствующем YML-файле.

  Ниже приведён пример пошаговых действий, показывающий, как использовать поле `quote` для колонок со смешанным регистром.

1. Создайте следующие SQL- и YML-файлы:

    <File name='<modelname>.sql'>

    ```sql
    {{ config(materialized='table') }}

    select 1 as "ca_net_ht_N" # обратите внимание на использование двойных кавычек для имени колонки
    ```
    </File>

    <File name='<modelname>.yml'>

    ```yml
    models:
      - name: <modelname>
        description: This is the table description

    columns:
      - name: "ca_net_ht_N"
        description: This should be the description of the column
        quote: true
    ```
    </File>

2. Выполните команду `dbt build -s models/<modelname>.sql --full-refresh`.

3. Откройте логи в файле `logs/dbt.log` и проверьте описание колонки:

    ```log
    alter table analytics.<schema>.<modelname> alter
        "ca_net_ht_N" COMMENT $$This should be the description of the column$$;
    ```

</div>

</WHCode>

## Использование {#usage}

### Документирование столбцов и отношений {#documenting-columns-and-relations}

Предоставьте [описание](/reference/resource-properties/description) для модели:

<File name='models/schema.yml'>

```yml

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