---
title: "о this"
sidebar_label: "this"
id: "this"
description: "Представляет текущую модель в базе данных."
keywords: 
  - relation, relation object, this function, this jinja, this.database, this.schema, this.identifier
meta:
  label: 'this'
---

`this` — это представление текущей модели в базе данных. Это полезно, когда:
- Определяется оператор `where` в [инкрементальных моделях](/docs/build/incremental-models)
- Используются [pre или post хуки](/reference/resource-configs/pre-hook-post-hook)

`this` является [Relation](/reference/dbt-classes#relation), и, как таковой, свойства, такие как `{{ this.database }}` и `{{ this.schema }}`, компилируются как ожидается.
  - Примечание &mdash; До версии dbt v1.6, dbt Cloud IDE возвращает `request` как результат `{{ ref.identifier }}`.

`this` можно рассматривать как эквивалент `ref('<the_current_model>')`, и это удобный способ избежать циклических зависимостей.

## Примеры

### Конфигурирование инкрементальных моделей

<File name='models/stg_events.sql'>

```sql
{{ config(materialized='incremental') }}

select
    *,
    my_slow_function(my_column)

from raw_app_data.events

{% if is_incremental() %}
  where event_time > (select max(event_time) from {{ this }})
{% endif %}
```

</File>