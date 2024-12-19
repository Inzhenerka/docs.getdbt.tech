---
title: Столбцы моего seed изменились, и теперь я получаю ошибку при выполнении команды `seed`, что мне делать?
description: "Повторите команду с флагом `--full-refresh`"
sidebar_label: 'отладка ошибки при изменении столбцов seed'
id: full-refresh-seed

---
Если вы изменили столбцы вашего seed, вы можете получить ошибку `Database Error`:

<Tabs
  defaultValue="snowflake"
  values={[
    { label: 'Snowflake', value: 'snowflake', },
    { label: 'Redshift', value: 'redshift', }
  ]
}>
<TabItem value="snowflake">

```shell
$ dbt seed
Running with dbt=0.16.0-rc2
Found 0 models, 0 tests, 0 snapshots, 0 analyses, 130 macros, 0 operations, 1 seed file, 0 sources

12:12:27 | Concurrency: 8 threads (target='dev_snowflake')
12:12:27 |
12:12:27 | 1 of 1 START seed file dbt_claire.country_codes...................... [RUN]
12:12:30 | 1 of 1 ERROR loading seed file dbt_claire.country_codes.............. [ERROR in 2.78s]
12:12:31 |
12:12:31 | Finished running 1 seed in 10.05s.

Completed with 1 error and 0 warnings:

Database Error in seed country_codes (seeds/country_codes.csv)
  000904 (42000): SQL compilation error: error line 1 at position 62
  invalid identifier 'COUNTRY_NAME'

Done. PASS=0 WARN=0 ERROR=1 SKIP=0 TOTAL=1

```

</TabItem>
<TabItem value="redshift">

```shell
$ dbt seed
Running with dbt=0.16.0-rc2
Found 0 models, 0 tests, 0 snapshots, 0 analyses, 149 macros, 0 operations, 1 seed file, 0 sources

12:14:46 | Concurrency: 1 threads (target='dev_redshift')
12:14:46 |
12:14:46 | 1 of 1 START seed file dbt_claire.country_codes...................... [RUN]
12:14:46 | 1 of 1 ERROR loading seed file dbt_claire.country_codes.............. [ERROR in 0.23s]
12:14:46 |
12:14:46 | Finished running 1 seed in 1.75s.

Completed with 1 error and 0 warnings:

Database Error in seed country_codes (seeds/country_codes.csv)
  column "country_name" of relation "country_codes" does not exist

Done. PASS=0 WARN=0 ERROR=1 SKIP=0 TOTAL=1
```

</TabItem>

</Tabs>

В этом случае вам следует повторить команду с флагом `--full-refresh`, вот так:

```shell
dbt seed --full-refresh
```

**Почему это происходит?**

Когда вы обычно выполняете dbt seed, dbt очищает существующую <Term id="table" /> и заново вставляет данные. Эта схема позволяет избежать команды `drop cascade`, которая может привести к удалению объектов на нижнем уровне (которые могут запрашивать ваши BI пользователи!).

Однако, когда имена столбцов изменяются или добавляются новые столбцы, эти операции завершатся неудачей, так как структура таблицы изменилась.

Флаг `--full-refresh` заставит dbt выполнить `drop cascade` для существующей таблицы перед ее восстановлением.