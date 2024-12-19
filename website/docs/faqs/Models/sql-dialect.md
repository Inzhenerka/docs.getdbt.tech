---
title: На каком SQL-диалекте мне писать свои модели? Или какой SQL-диалект использует dbt?
description: "Используйте SQL-диалект вашей базы данных"
sidebar_label: 'Какой SQL-диалект использовать?'
id: sql-dialect
---

dbt может казаться магией, но на самом деле это не магия. За кулисами он выполняет SQL в вашем собственном хранилище — ваши данные не обрабатываются вне вашего хранилища.

Таким образом, ваши модели должны использовать **SQL-диалект вашей базы данных**. Затем, когда dbt оборачивает ваши `select` операторы в соответствующий <Term id="ddl" /> или <Term id="dml" />, он будет использовать правильный DML для вашего хранилища — вся эта логика уже заложена в dbt.

Вы можете найти больше информации о поддерживаемых базах данных, платформах и движках запросов в документации [Поддерживаемые платформы данных](/docs/supported-data-platforms).

Хотите углубиться в то, как это работает? Рассмотрим фрагмент SQL, который работает в каждом хранилище:

<File name='models/test_model.sql'>

```sql
select 1 as my_column

```

</File>

Чтобы заменить существующую <Term id="table" />, вот _иллюстративный_ пример SQL, который dbt будет выполнять в разных хранилищах (фактический SQL может быть гораздо сложнее этого!)

<Tabs
  defaultValue="redshift"
  values={[
    {label: 'Redshift', value: 'redshift'},
    {label: 'BigQuery', value: 'bigquery'},
    {label: 'Snowflake', value: 'snowflake'},
  ]}>
  <TabItem value="redshift">

```sql
-- вы не можете создать или заменить в redshift, поэтому используйте транзакцию, чтобы сделать это атомарно

begin;

create table "dbt_alice"."test_model__dbt_tmp" as (
    select 1 as my_column
);

alter table "dbt_alice"."test_model" rename to "test_model__dbt_backup";

alter table "dbt_alice"."test_model__dbt_tmp" rename to "test_model"

commit;

begin;

drop table if exists "dbt_alice"."test_model__dbt_backup" cascade;

commit;
```

  </TabItem>

  <TabItem value="bigquery">

```sql

-- Сделайте API-вызов для создания набора данных (нет DDL интерфейса для этого)!!;

create or replace table `dbt-dev-87681`.`dbt_alice`.`test_model` as (
  select 1 as my_column
);
```

  </TabItem>

  <TabItem value="snowflake">

```sql
create schema if not exists analytics.dbt_alice;

create or replace table analytics.dbt_alice.test_model as (
    select 1 as my_column
);
```

  </TabItem>
</Tabs>