---
title: "Конфигурации Yellowbrick"
description: "Конфигурации Yellowbrick: подробное руководство по работе с конфигурациями в dbt."
id: "yellowbrick-configs"
---

## Стратегии инкрементальной материализации {#incremental-materialization-strategies}

Адаптер dbt-yellowbrick поддерживает следующие стратегии инкрементальной материализации:

- `append` (используется по умолчанию, если `unique_key` не определён)
- `delete+insert` (используется по умолчанию, если `unique_key` определён)

Все эти стратегии унаследованы от адаптера dbt-postgres.

## Оптимизация производительности {#performance-optimizations}
    
Для повышения производительности запросов таблицы в Yellowbrick Data поддерживают ряд оптимизаций, которые могут быть заданы как конфигурации на уровне модели в dbt. 
Эти настройки будут применяться к операторам `CREATE TABLE` <Term id="ddl" />, 
которые генерируются во время компиляции или выполнения. Обратите внимание, что эти параметры не оказывают никакого влияния на модели с материализацией `view` или `ephemeral`.

dbt-yellowbrick поддерживает следующие специфичные для Yellowbrick возможности при определении таблиц:
- `dist` — задаёт ключ распределения по одному столбцу либо устанавливает распределение `RANDOM` или `REPLICATE`
- `sort_col` — добавляет выражение `SORT ON (column)`, указывающее один столбец, по которому данные сортируются перед записью на носитель
- `cluster_cols` — добавляет выражение `CLUSTER ON (column, column, ...)`, указывающее 
до четырёх столбцов для кластеризации перед записью данных на носитель

Таблица с отсортированными или кластеризованными столбцами позволяет пропускать блоки 
данных при сканировании таблиц, если в запросе применяются ограничения. Более подробную 
информацию можно найти в документации [Yellowbrick Data Warehouse](https://docs.yellowbrick.com/latest/ybd_sqlref/clustered_tables.html#clustered-tables).

### Примеры конфигураций моделей {#some-example-model-configurations}

* ```DISTRIBUTE REPLICATE``` с колонкой ```SORT```...

```sql
{{
  config(
    materialized = "table",
    dist = "replicate",
    sort_col = "stadium_capacity"
  )
}}

select
    hash(stg.name) as team_key
    , stg.name as team_name
    , stg.nickname as team_nickname
    , stg.city as home_city
    , stg.stadium as stadium_name
    , stg.capacity as stadium_capacity
    , stg.avg_att as average_game_attendance
    , current_timestamp as md_create_timestamp
from
    {{ source('premdb_public','team') }} stg
where
    stg.name is not null
``` 
даёт следующий результат модели:

```sql
create table if not exists marts.dim_team as (
select
    hash(stg.name) as team_key
    , stg.name as team_name
    , stg.nickname as team_nickname
    , stg.city as home_city
    , stg.stadium as stadium_name
    , stg.capacity as stadium_capacity
    , stg.avg_att as average_game_attendance
    , current_timestamp as md_create_timestamp
from
    premdb.public.team stg
where
    stg.name is not null
)
distribute REPLICATE
sort on (stadium_capacity);
```
<br />

* ```DISTRIBUTE``` по одному столбцу и определение до четырёх столбцов ```CLUSTER```...

```sql 
{{
  config(
    materialized = 'table',
    dist = 'match_key',
    cluster_cols = ['season_key', 'match_date_key', 'home_team_key', 'away_team_key']
  )
}}

select
	hash(concat_ws('||',
	    lower(trim(s.season_name)),
		translate(left(m.match_ts,10), '-', ''),
	    lower(trim(h."name")),
		lower(trim(a."name")))) as match_key
	, hash(lower(trim(s.season_name))) as season_key
	, cast(translate(left(m.match_ts,10), '-', '') as integer) as match_date_key
	, hash(lower(trim(h."name"))) as home_team_key
	, hash(lower(trim(a."name"))) as away_team_key
	, m.htscore
	, split_part(m.htscore, '-', 1)  as home_team_goals_half_time
	, split_part(m.htscore , '-', 2)  as away_team_goals_half_time
	, m.ftscore
	, split_part(m.ftscore, '-', 1)  as home_team_goals_full_time
	, split_part(m.ftscore, '-', 2)  as away_team_goals_full_time
from
	{{ source('premdb_public','match') }} m
		inner join {{ source('premdb_public','team') }} h on (m.htid = h.htid)
		inner join {{ source('premdb_public','team') }} a on (m.atid = a.atid)
		inner join {{ source('premdb_public','season') }} s on (m.seasonid = s.seasonid)
```

даёт следующий результат модели:

```sql
create  table if not exists marts.fact_match as (
select
    hash(concat_ws('||',
        lower(trim(s.season_name)),
        translate(left(m.match_ts,10), '-', ''),
        lower(trim(h."name")),
        lower(trim(a."name")))) as match_key
    , hash(lower(trim(s.season_name))) as season_key
    , cast(translate(left(m.match_ts,10), '-', '') as integer) as match_date_key
    , hash(lower(trim(h."name"))) as home_team_key
    , hash(lower(trim(a."name"))) as away_team_key
    , m.htscore
    , split_part(m.htscore, '-', 1)  as home_team_goals_half_time
    , split_part(m.htscore , '-', 2)  as away_team_goals_half_time
    , m.ftscore
    , split_part(m.ftscore, '-', 1)  as home_team_goals_full_time
    , split_part(m.ftscore, '-', 2)  as away_team_goals_full_time
from
    premdb.public.match m
        inner join premdb.public.team h on (m.htid = h.htid)
        inner join premdb.public.team a on (m.atid = a.atid)
        inner join premdb.public.season s on (m.seasonid = s.seasonid)
)
distribute on (match_key)
cluster on (season_key, match_date_key, home_team_key, away_team_key);
```

## Кросс-базовая материализация {#cross-database-materializations}

Yellowbrick поддерживает запросы между базами данных, и адаптер dbt-yellowbrick позволяет выполнять чтение из других баз данных в конкретную целевую базу в рамках одного и того же экземпляра appliance.

## Ограничения {#limitations}

Данная первоначальная реализация адаптера dbt для Yellowbrick Data Warehouse может не поддерживать некоторые сценарии использования. Мы настоятельно рекомендуем проверять все записи и преобразования данных, полученные в результате работы адаптера.
