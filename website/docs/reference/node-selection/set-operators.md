---
title: "Операторы множеств"
---

### Объединения (Unions) {#unions}
Если передать несколько аргументов, разделённых пробелами, флагам `--select` или `--exclude`, 
будет выбрано их объединение. Если ресурс включён хотя бы в один селектор, 
он попадёт в итоговый набор.

Запустить `snowplow_sessions`, всех предков `snowplow_sessions`, `fct_orders` и всех предков `fct_orders`:


  ```bash
dbt run --select "+snowplow_sessions +fct_orders"
  ```

### Пересечения (Intersections) {#intersections}

Если разделять несколько аргументов для `--select` и `--exclude` запятыми без пробелов между ними, dbt выберет только те ресурсы, которые удовлетворяют _всем_ аргументам одновременно.

Запустить всех общих предков `snowplow_sessions` и `fct_orders`:


  ```bash
dbt run --select "+snowplow_sessions,+fct_orders"
```


Запустить всех общих потомков `stg_invoices` и `stg_accounts`:


  ```bash
dbt run --select "stg_invoices+,stg_accounts+"
  ```


Запустить модели, которые находятся в подкаталоге `marts/finance` *и* помечены тегом `nightly`:


  ```bash
dbt run --select "marts.finance,tag:nightly"
```
