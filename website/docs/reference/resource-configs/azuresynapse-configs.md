---
title: "Конфигурации Microsoft Azure Synapse DWH"
id: "azuresynapse-configs"
---

Все [опции конфигурации для адаптера Microsoft SQL Server](/reference/resource-configs/mssql-configs) также применимы к этому адаптеру.

Кроме того, доступны следующие опции конфигурации.

### Индексы и распределения {#indices-and-distributions}

Основной индекс и тип распределения могут быть заданы для моделей, которые материализуются в таблицы.

<Tabs
    defaultValue="model"
    values={[
        {label: 'Конфигурация модели', value: 'model'},
        {label: 'Конфигурация проекта', value: 'project'}
    ]}
>

<TabItem value="model">

<File name="models/example.sql">

```sql
{{
    config(
        index='HEAP',
        dist='ROUND_ROBIN'
        )
}}

select *
from ...
```

</File>

</TabItem>

<TabItem value="project">

<File name="dbt_project.yml">

```yaml
models:
  your_project_name:
    materialized: view
    staging:
      materialized: table
      index: HEAP
```

</File>

</TabItem>

</Tabs>

Поддерживаемые типы индексов:

* `CLUSTERED COLUMNSTORE INDEX` (по умолчанию)
* `HEAP`
* `CLUSTERED INDEX (COLUMN_NAME)`
* `CLUSTERED COLUMNSTORE INDEX ORDER(COLUMN_NAME)`

Поддерживаемые типы распределения:

* `ROUND_ROBIN` (по умолчанию)
* `HASH(COLUMN_NAME)`
* `REPLICATE`