---
title: "Изменения в поведении адаптера Amazon Redshift"
id: "redshift-changes"
sidebar: "Redshift"
---

Ниже перечислены текущие [флаги изменения поведения](/docs/reference/global-configs/behavior-changes.md#behavior-change-flags), специфичные для `dbt-redshift`:

<SimpleTable>
| Флаг                          | `dbt-redshift`: Введение | `dbt-redshift`: Зрелость | Статус |
| ----------------------------- | --------------------- | ------------------------ | ------ |
| [`redshift_skip_autocommit_transaction_statements`](#redshift_skip_autocommit_transaction_statements-flag) | 1.12.0 | Пока не определено | Активен |
</SimpleTable>

<!--
## Флаг `restrict_direct_pg_catalog_access`

Изначально адаптер `dbt-redshift` был построен на основе адаптера `dbt-postgres` и использовал таблицы Postgres для доступа к метаданным. Когда этот флаг включён, адаптер использует API Redshift (через клиент Python), если он доступен, или запрашивает таблицы `information_schema` Redshift вместо таблиц `pg_` _для некоторых запросов метаданных_.

Обратите внимание, что этот флаг применяется не ко всем запросам метаданных, выполняемым адаптером. Например, запрос списка отношений может по-прежнему обращаться к `information_schema`, даже когда флаг отключён.

Хотя вы не должны заметить каких-либо изменений в поведении, dbt Labs из соображений предосторожности управляет этим изменением с помощью флага изменения поведения и рекомендует протестировать его, прежде чем оно станет поведением по умолчанию.
-->

## Флаг `redshift_skip_autocommit_transaction_statements` {#redshift_skip_autocommit_transaction_statements-flag}

Доступен начиная с `dbt-redshift` 1.12.0.

Флаг `redshift_skip_autocommit_transaction_statements` определяет, отправляет ли dbt явные операторы [`BEGIN`](https://docs.aws.amazon.com/redshift/latest/dg/r_BEGIN.html), [`COMMIT`](https://docs.aws.amazon.com/redshift/latest/dg/r_COMMIT.html) и [`ROLLBACK`](https://docs.aws.amazon.com/redshift/latest/dg/r_ROLLBACK.html) в Amazon Redshift, когда включён режим автоматической фиксации транзакций (autocommit). Начиная с `dbt-redshift` 1.5, подключение к Redshift по умолчанию использует `autocommit=True`, поэтому драйвер уже фиксирует каждый оператор. В такой конфигурации при включённом autocommit эти операторы избыточны и приводят к дополнительным обменам запросами и ответами с Redshift.

- При значении `false` (по умолчанию) dbt отправляет операторы `BEGIN`, `COMMIT` и `ROLLBACK` (прежнее поведение).
- При значении `true` dbt не отправляет операторы `BEGIN`, `COMMIT` и `ROLLBACK` в Redshift, что может сократить количество обменов запросами и ответами и повысить производительность. dbt по-прежнему вызывает `begin()`, `commit()` и `rollback_if_open()` для подключения, но больше не выполняет соответствующие SQL-операторы:

  - `begin()` вызывается, но dbt не выполняет `BEGIN` в Redshift.
  - `commit()` вызывается, но dbt не выполняет `COMMIT` в Redshift.
  - `rollback_if_open()` вызывается, но dbt не выполняет `ROLLBACK` в Redshift.

dbt по-прежнему поддерживает внутреннее состояние `transaction_open`, поэтому отслеживание транзакций остаётся согласованным, даже когда эти SQL-операторы пропускаются.

Чтобы пропускать ненужные операторы управления транзакциями при включённом `autocommit`, установите для флага значение `true` в файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
flags:
  redshift_skip_autocommit_transaction_statements: true
```

</File>

### Как этот флаг взаимодействует с `autocommit`

- Если подключение использует `autocommit=False`, поведение dbt при явном управлении транзакциями не меняется.
- Если подключение использует `autocommit=True` (по умолчанию), а флаг имеет значение `false` (по умолчанию), dbt по-прежнему отправляет `BEGIN`, `COMMIT` и `ROLLBACK`.
- Если подключение использует `autocommit=True`, а флаг имеет значение `true`, dbt пропускает эти операторы.
