---
title: "Кроссплатформенная Mesh с каталогами Iceberg"
id: cross-platform-mesh
sidebar_label: "Кроссплатформенная Mesh"
description: Узнайте, как объединить каталоги Iceberg и dbt Mesh для совместной работы на нескольких платформах данных.
---

# Кроссплатформенная Mesh с каталогами Iceberg <Lifecycle status="beta" />

Если для модели задан параметр `catalog_name`, dbt использует [определение каталога](/docs/build/iceberg/about-catalogs) текущего проекта (в `catalogs.yml`) для текущего активного адаптера, чтобы определить пространство имён верхнего уровня этой модели.

Это означает, что вы можете материализовать модель dbt из `databricks_project` в таблицу Iceberg в Unity catalog и читать из неё данные в другой модели в `snowflake_project`. Вы даже можете материализовать эту модель обратно в Unity catalog, а затем использовать её в других моделях в `databricks_project`.

Для этого необходим автоматизированный сервис, который связывает или синхронизирует метаданные между вашим каталогом Iceberg и подключёнными платформами данных. К таким сервисам относятся [базы данных Snowflake, связанные с каталогом](https://docs.snowflake.com/en/sql-reference/sql/create-database-catalog-linked), [федерация каталогов Databricks](https://docs.databricks.com/aws/en/query-federation/catalog-federation), [федерация каталогов AWS Glue](https://docs.aws.amazon.com/lake-formation/latest/dg/catalog-federation.html) и [каталог среды выполнения GCP Lakehouse](https://docs.cloud.google.com/lakehouse/docs/about-lakehouse-catalogs).

Поддерживаются следующие кроссплатформенные сочетания:
- Snowflake ↔ Databricks с использованием Unity catalog ([документация Snowflake](https://docs.snowflake.com/en/user-guide/tables-iceberg-configure-catalog-integration-rest-unity), [практическое руководство](https://docs.snowflake.com/en/user-guide/tutorials/tables-iceberg-set-up-bidirectional-access-to-unity-catalog))
- Snowflake ↔ Athena с использованием Glue catalog ([документация Snowflake](https://docs.snowflake.com/en/user-guide/tables-iceberg-configure-catalog-integration-rest-glue))
- Snowflake ↔ BigQuery с использованием BigLake catalog ([документация Snowflake](https://docs.snowflake.com/en/user-guide/tables-iceberg-configure-catalog-integration-rest-biglake))
- Snowflake ↔ DuckDB с использованием Horizon catalog ([пример](https://github.com/dataders/dbt_aws_cloud_cost))
- Databricks ↔ DuckDB с использованием Unity catalog ([пример](https://github.com/dataders/dbt_aws_cloud_cost))

## Пример: Snowflake ↔ Databricks с использованием Unity catalog {#example-snowflake-databricks}

Представим два проекта «mesh», [`jaffle_finance`](https://github.com/dbt-labs/jaffle-shop-mesh-finance) и [`jaffle_marketing`](https://github.com/dbt-labs/jaffle-shop-mesh-marketing), с межпроектной зависимостью `jaffle_finance -> jaffle_marketing`.

Если проект `jaffle_finance` записывает свои публичные модели в каталог Iceberg, из которого проект `jaffle_marketing` может читать данные, и оба проекта настраивают этот каталог Iceberg в `catalogs.yml` с одинаковым значением `name`, то эти проекты теперь могут работать на **разных платформах данных.**

```yaml
# jaffle_finance/dbt_project.yml
flags:
  use_catalogs_v2: true

models:
  jaffle_finance:
    marts:
      access: public
      catalog_name: finance_db
```

```yaml
# jaffle_finance/catalogs.yml
catalogs:
  - name: finance_db
    type: unity
    config:
      databricks:
        # where jaffle_finance project will write its public models to
        catalog_database: finance_db
```

```yaml
# jaffle_marketing/dbt_project.yml
flags:
  use_catalogs_v2: true
```

```yaml
# jaffle_marketing/catalogs.yml
catalogs:
  - name: finance_db
    type: unity
    config:
      snowflake:
        # catalog-linked database pointing to same Unity catalog
        # where jaffle_marketing project will read jaffle_finance public models from
        catalog_database: snowflake_cld__finance_db
```

:::note

Если вы создадите [базу данных Snowflake, связанную с каталогом](https://docs.snowflake.com/en/sql-reference/sql/create-database-catalog-linked), с параметром `CATALOG_CASE_SENSITIVITY = CASE_INSENSITIVE`, вам не потребуется заключать в кавычки все имена столбцов и идентификаторы объектов, которые Snowflake читает из Unity или записывает в Unity.

:::

Что здесь происходит?

- Проект `jaffle_finance`, работающий на Databricks, материализует модели витрин данных в базу данных `finance_db` в Unity catalog.
- Фактически это каталог Iceberg, доступ к которому мы предоставили Snowflake через связанную с каталогом базу данных. В Snowflake эта база данных называется `snowflake_cld__finance_db`.
- При запуске проекта `jaffle_marketing` dbt обнаруживает межпроектную ссылку на публичную модель в проекте `jaffle_finance`:

```sql
-- marketing/models/marts/roi_by_channel.sql
with monthly_revenue as (

    select * from {{ ref('jaffle_finance', 'monthly_revenue') }}

),

...
```

<img width="691" height="134" alt="Блок-схема: модель ROI по каналам проекта marketing зависит от модели месячной выручки проекта finance" src="https://github.com/user-attachments/assets/e0a07911-b9d5-4422-9a81-6287e1946ca2" /> 

Это работает для [обоих способов разрешения межпроектных ссылок](/docs/mesh/govern/project-dependencies):

1. Зависимости `package` (поддерживаются в <Constant name="core" /> и на платформе dbt)
2. Зависимости `project` (редакция Enterprise платформы dbt; см. [преимущества этого подхода](/docs/mesh/govern/project-dependencies#advantages))

**Для зависимостей `package`:**

```yaml
# dependencies.yml
packages:
  - git: https://github.com/dbt-labs/jaffle-shop-mesh-finance
```

Для модели `jaffle_finance.monthly_revenue` из вышестоящего пакета задан параметр `catalog_name: finance_db`. dbt использует `catalogs.yml` текущего выполняемого (корневого) проекта, чтобы определить полное имя объекта базы данных из трёх частей. В этом проекте (`jaffle_marketing`) на этой платформе (Snowflake) для данного каталога задано `database: snowflake_cld__finance_db`. Поэтому dbt преобразует ссылку следующим образом:

**Для зависимостей `project`:**

```yaml
# dependencies.yml
projects:
  - name: jaffle_finance
```

Раньше, если бы мы использовали только настройку `database` вышестоящей модели, dbt преобразовал бы эту ссылку в `finance_db.jaffle_finance.monthly_revenue` — объект, которого нет в Snowflake.

Теперь вместо этого dbt **сопоставляет `catalog_name`** модели, на которую указывает ссылка, с записями в `catalogs.yml` текущего выполняемого (корневого) проекта. dbt видит, что у `jaffle_finance.monthly_revenue` задано `catalog_name: finance_db`, а для этого каталога в данном проекте (`jaffle_marketing`) на данной платформе (Snowflake) задано `database: snowflake_cld__finance_db`. Поэтому dbt преобразует ссылку следующим образом:

```sql

-- marketing/target/compiled/models/marts/roi_by_channel.sql
with monthly_revenue as (

    select * from snowflake_cld__finance_db."jaffle_finance"."monthly_revenue"

),

...

```

_И всё просто работает!_

За кулисами Snowflake синхронизирует `finance_db` в Databricks ↔ `snowflake_cld__finance_db` в Snowflake, обеспечивая согласованность в конечном счёте. Это означает, что `finance_db.jaffle_finance.monthly_revenue` в Databricks и `snowflake_cld__finance_db."jaffle_finance"."monthly_revenue"` в Snowflake указывают на _одну и ту же таблицу Iceberg_ в Unity catalog, управляемом Databricks.

### Альтернативный подход: федерация каталогов {#catalog-federation}

Запись во внешние каталоги Iceberg обычно медленнее записи в управляемые таблицы Iceberg, а при масштабировании также могут возникать проблемы с надёжностью. (См. нашу [статью в блоге](/blog/catalog-linked-databases) и [сравнительное тестирование](https://github.com/dbt-labs/snow-dbx-iceberg-benchmark).)

Вместо того чтобы выполнять запись из Snowflake непосредственно в Unity catalog через связанную с каталогом базу данных, можно настроить Snowflake на запись в собственный (управляемый) Horizon catalog и использовать [федерацию каталогов Databricks](https://docs.databricks.com/aws/en/query-federation/catalog-federation) для синхронизации метаданных Iceberg с целью последующего чтения.

<Lightbox src="/img/docs/building-a-dbt-project/snow-dbx-xplat-mesh.png" title="Схема с несколькими каталогами для кроссплатформенной Mesh на Databricks и Snowflake" />

<File name='catalogs.yml'>

```yaml
catalogs:
  - name: finance_unity
    type: unity
    config:
      databricks:
        # catalog where jaffle_finance project will write its public models to
        catalog_database: finance_db
      snowflake:
         # name of catalog-linked database
         # where jaffle_marketing will read jaffle_finance's public models
         catalog_database: snowflake_cld__finance_db
  - name: marketing_horizon
    type: horizon
    config:
      snowflake:
        # database where jaffle_marketing will write its public models to
        catalog_database: horizon_db
      databricks:
         # name of federated catalog in Unity
         # where jaffle_finance will read jaffle_marketing's public models
        catalog_database: dbx_federation__horizon_db
```

</File>
