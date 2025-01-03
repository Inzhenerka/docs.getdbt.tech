---
title: "Изменения в поведении адаптера Amazon Redshift"
id: "redshift-changes"
sidebar: "Redshift"
---

## Флаг restrict_direct_pg_catalog_access

Изначально адаптер `dbt-redshift` был построен на основе адаптера `dbt-postgres` и использовал таблицы Postgres для доступа к метаданным. Когда этот флаг включен, адаптер использует API Redshift (через Python-клиент), если он доступен, или выполняет запросы к таблицам `information_schema` Redshift вместо использования таблиц `pg_`.

Хотя вы не должны заметить каких-либо изменений в поведении из-за этого изменения, dbt Labs, тем не менее, осторожно ограничивает его флагом изменения поведения и рекомендует протестировать его перед тем, как он станет стандартным.