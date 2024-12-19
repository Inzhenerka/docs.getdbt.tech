---
title: "Конфигурации Yellowbrick"
description: "Конфигурации Yellowbrick: прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "yellowbrick-configs"
---

## Стратегии инкрементной материализации

Адаптер dbt-yellowbrick поддерживает следующие стратегии инкрементной материализации:

- `append` (по умолчанию, когда `unique_key` не определен)
- `delete+insert` (по умолчанию, когда `unique_key` определен)

Все эти стратегии унаследованы от адаптера dbt-postgres.

## Оптимизация производительности

Для улучшения производительности запросов таблицы в Yellowbrick Data поддерживают несколько оптимизаций, которые могут быть определены как конфигурации на уровне модели в dbt. Эти настройки будут применены к операторам `CREATE TABLE` <Term id="ddl" /> , сгенерированным во время компиляции или выполнения. Обратите внимание, что эти настройки не будут иметь эффекта на модели, установленные в `view` или `ephemeral`.

dbt-yellowbrick поддерживает следующие специфические для Yellowbrick функции при определении таблиц:
- `dist` - применяет ключ распределения по одному столбцу или устанавливает распределение на `RANDOM` или `REPLICATE`
- `sort_col` - применяет оператор `SORT ON (column)`, который указывает один столбец для сортировки перед сохранением данных на носителе
- `cluster_cols` - применяет оператор `CLUSTER ON (column, column, ...)`, который указывает до четырех столбцов для кластеризации перед сохранением данных на носителе

Таблица, имеющая отсортированные или кластеризованные столбцы, облегчает пропуск блоков при сканировании таблиц с применением ограничений в запросе. Дополнительные сведения можно найти в документации [Yellowbrick Data Warehouse](https://docs.yellowbrick.com/latest/ybd_sqlref/clustered_tables.html#clustered-tables).

### Примеры конфигураций моделей

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
дает следующий вывод модели:

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

* ```DISTRIBUTE``` по одному столбцу и определение до четырех колонок ```CLUSTER```...

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

дает следующий вывод модели:

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

## Материализации между базами данных

Yellowbrick поддерживает запросы между базами данных, и адаптер dbt-yellowbrick позволит выполнять чтение из одной базы данных в конкретную целевую базу данных на одном экземпляре устройства.

## Ограничения

Эта первоначальная реализация адаптера dbt для Yellowbrick Data Warehouse может не поддерживать некоторые сценарии использования. Мы настоятельно рекомендуем проверять все записи или преобразования, полученные в результате вывода адаптера.