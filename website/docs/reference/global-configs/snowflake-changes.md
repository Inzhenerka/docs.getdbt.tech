---
title: "Изменения в поведении адаптера Snowflake"
id: "snowflake-changes"
sidebar: "Snowflake"
---

## Флаг `enable_truthy_nulls_equals_macro`

Флаг `enable_truthy_nulls_equals_macro` по умолчанию установлен в `False`. Установка его значения в `True` в файле `dbt_project.yml` включает null-safe сравнение в макросе dbt `equals`, который используется в materialization типа incremental и snapshot.

Например, при сравнении `NULL` с использованием оператора `=` без этого флага результатом не будет `TRUE`, даже в случае сравнения `NULL = NULL`. Включение null-safe логики позволяет выполнять корректные сравнения с `NULL`.

Если оба значения равны `NULL`, выражение будет вычисляться как `TRUE`, а не как `UNKNOWN`.
