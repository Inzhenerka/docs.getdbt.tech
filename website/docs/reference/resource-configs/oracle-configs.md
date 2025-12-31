---
title: "Конфигурации Oracle"
id: "oracle-configs"
---

<VersionBlock firstVersion="1.3.2">

## Использование подсказки `parallel` {#use-parallel-hint}

Материализация таблицы поддерживает указание количества параллельных выполнений, как показано ниже

```sql
-- Создание модели dbt с использованием 4 параллельных выполнений
{{config(materialized='table', parallel=4}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

## Использование `table_compression_clause` {#use-tablecompressionclause}

Материализация таблицы поддерживает различные компрессионные клаузы, как показано ниже

### Расширенное сжатие строк {#advanced-row-compression}

При включенном расширенном сжатии база данных Oracle поддерживает сжатие во время всех типов операций манипуляции данными, включая обычные DML, такие как INSERT и UPDATE. `ROW STORE COMPRESS ADVANCED` рекомендуется в системах OLTP.

```sql
-- Расширенное сжатие строк
{{config(materialized='table', table_compression_clause='ROW STORE COMPRESS ADVANCED')}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

### Гибридное колонное сжатие {#hybrid-columnar-compression}

#### Запросы {#querying}

`COLUMN STORE COMPRESS FOR QUERY` полезно в средах хранилищ данных. Допустимые значения — `HIGH` или `LOW`, при этом `HIGH` обеспечивает более высокий коэффициент сжатия. По умолчанию используется `HIGH`.

```sql
{{config(materialized='table', table_compression_clause='COLUMN STORE COMPRESS FOR QUERY LOW')}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

или

```sql
{{config(materialized='table', table_compression_clause='COLUMN STORE COMPRESS FOR QUERY HIGH')}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

#### Архивирование {#archival}

`COLUMN STORE COMPRESS FOR ARCHIVE` поддерживает более высокий коэффициент сжатия, чем `COLUMN STORE COMPRESS FOR QUERY`, и полезно для архивирования. Допустимые значения — `HIGH` или `LOW`, при этом `HIGH` обеспечивает самый высокий коэффициент сжатия. По умолчанию используется `LOW`.

```sql
{{config(materialized='table', table_compression_clause='COLUMN STORE COMPRESS FOR ARCHIVE LOW')}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

или

```sql
{{config(materialized='table', table_compression_clause='COLUMN STORE COMPRESS FOR ARCHIVE HIGH')}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

## Партиционирование {#partitioning}

Конфигурация материализации таблицы и инкрементальной материализации поддерживает добавление партиционной клаузулы:

```sql
{
    config(
        materialized='incremental',
        unique_key='group_id',
        parallel=4,
        partition_config={"clause": "PARTITION BY HASH(PROD_NAME) PARTITIONS 4"},
        table_compression_clause='COLUMN STORE COMPRESS FOR QUERY LOW')
}}
SELECT *
FROM {{ source('sh_database', 'sales') }}
```

## Информация о сессии в `v$session` {#session-info-in-vsession}

Пользовательская информация о сессии может быть указана в `session_info` в `profile.yml`

```yaml
dbt_test:
   target: dev
   outputs:
      dev:
         type: oracle
         user: "{{ env_var('DBT_ORACLE_USER') }}"
         pass: "{{ env_var('DBT_ORACLE_PASSWORD') }}"
         database: "{{ env_var('DBT_ORACLE_DATABASE') }}"
         tns_name: "{{ env_var('DBT_ORACLE_TNS_NAME') }}"
         schema: "{{ env_var('DBT_ORACLE_SCHEMA') }}"
         threads: 4
         session_info:
            action: "dbt run"
            client_identifier: "dbt-unique-client-uuid"
            client_info: "dbt Python3.9 thin driver"
            module: "dbt-oracle-1.8.x"
```

Это помогает отслеживать сессии dbt в представлении базы данных [V$SESSION](https://docs.oracle.com/en/database/oracle/oracle-database/19/refrn/V-SESSION.html)

</VersionBlock>