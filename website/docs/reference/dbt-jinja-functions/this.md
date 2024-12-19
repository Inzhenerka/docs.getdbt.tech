---
title: "о this"
sidebar_label: "this"
id: "this"
description: "Представляет текущую модель в базе данных."
keywords: 
  - отношение, объект отношения, эта функция, этот jinja, this.database, this.schema, this.identifier
meta:
  label: 'this'
---

`this` — это представление текущей модели в базе данных. Это полезно, когда:
- Определяете оператор `where` в [инкрементальных моделях](/docs/build/incremental-models)
- Используете [предварительные или последующие хуки](/reference/resource-configs/pre-hook-post-hook)

`this` является [Relation](/reference/dbt-classes#relation), и, как таковой, свойства, такие как `{{ this.database }}` и `{{ this.schema }}`, компилируются как ожидается. 
  - Примечание &mdash; До версии dbt v1.6, IDE dbt Cloud возвращает `request` в качестве результата `{{ ref.identifier }}`.

`this` можно рассматривать как эквивалент `ref('<текущая_модель>')`, и это удобный способ избежать циклических зависимостей.

## Примеры

### Настройка инкрементальных моделей

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