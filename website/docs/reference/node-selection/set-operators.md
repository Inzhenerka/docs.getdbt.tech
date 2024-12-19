---
title: "Операторы объединения"
---

### Объединения
Предоставление нескольких аргументов, разделенных пробелами, для флагов `--select` или `--exclude` выбирает объединение всех из них. Если ресурс включен хотя бы в один селектор, он будет включен в окончательный набор.

Запустите snowplow_sessions, всех предков snowplow_sessions, fct_orders и всех предков fct_orders:

  ```bash
dbt run --select "+snowplow_sessions +fct_orders"
  ```

### Пересечения

Если вы разделяете несколько аргументов для `--select` и `--exclude` запятыми без пробелов между ними, dbt выберет только те ресурсы, которые удовлетворяют _всем_ аргументам.

Запустите всех общих предков snowplow_sessions и fct_orders:

  ```bash
dbt run --select "+snowplow_sessions,+fct_orders"
```

Запустите всех общих потомков stg_invoices и stg_accounts:

  ```bash
dbt run --select "stg_invoices+,stg_accounts+"
  ```

Запустите модели, которые находятся в подкаталоге marts/finance *и* помечены как nightly:

  ```bash
dbt run --select "marts.finance,tag:nightly"
```