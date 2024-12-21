---
title: В каком SQL-диалекте писать мои модели? Или какой SQL-диалект использует dbt?
description: "Используйте SQL-диалект вашей собственной базы данных"
sidebar_label: 'Какой SQL-диалект использовать?'
id: sql-dialect
---

dbt может казаться магией, но на самом деле это не так. Под капотом он выполняет SQL в вашем собственном хранилище данных — ваши данные не обрабатываются за пределами вашего хранилища.

Таким образом, ваши модели должны использовать **SQL-диалект вашей собственной базы данных**. Затем, когда dbt оборачивает ваши `select` выражения в соответствующие <Term id="ddl" /> или <Term id="dml" />, он будет использовать правильный DML для вашего хранилища — вся эта логика уже заложена в dbt.

Вы можете найти больше информации о базах данных, платформах и движках запросов, которые поддерживает dbt, в документации [Поддерживаемые платформы данных](/docs/supported-data-platforms).

Хотите углубиться в то, как это работает? Рассмотрим фрагмент SQL, который работает на каждом хранилище:

<File name='models/test_model.sql'>

```sql
select 1 as my_column

```

</File>

Чтобы заменить существующую <Term id="table" />, вот _иллюстративный_ пример SQL, который dbt выполнит на разных хранилищах (фактический SQL может быть гораздо сложнее этого!)

<Tabs
  defaultValue="redshift"
  values={[
    {label: 'Redshift', value: 'redshift'},
    {label: 'BigQuery', value: 'bigquery'},
    {label: 'Snowflake', value: 'snowflake'},
  ]}>
  <TabItem value="redshift">

```sql
-- на redshift нельзя создать или заменить, поэтому используйте транзакцию для выполнения этого атомарно

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

-- Сделайте API-вызов для создания набора данных (нет интерфейса DDL для этого)!!;

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