---
title: "О подключениях к платформам данных в dbt Core"
id: "about-core-connections"
description: "Информация о подключениях к платформам данных в dbt Core"
sidebar_label: "О подключениях к платформам данных в dbt Core"
hide_table_of_contents: true
pagination_next: "docs/core/connect-data-platform/profiles.yml"
pagination_prev: null
---

dbt Core может подключаться к различным поставщикам платформ данных, включая:

- [Amazon Redshift](/docs/core/connect-data-platform/redshift-setup) 
- [Apache Spark](/docs/core/connect-data-platform/spark-setup) 
- [Azure Synapse](/docs/core/connect-data-platform/azuresynapse-setup)
- [Databricks](/docs/core/connect-data-platform/databricks-setup) 
- [Google BigQuery](/docs/core/connect-data-platform/bigquery-setup)
- [Microsoft Fabric](/docs/core/connect-data-platform/fabric-setup)
- [PostgreSQL](/docs/core/connect-data-platform/postgres-setup)
- [Snowflake](/docs/core/connect-data-platform/snowflake-setup)
- [Starburst или Trino](/docs/core/connect-data-platform/trino-setup)

dbt взаимодействует с рядом различных платформ данных, используя специальный адаптер для каждой из них. При установке dbt Core вам также потребуется установить конкретный адаптер для вашей платформы данных, подключиться к dbt Core и настроить файл [profiles.yml](/docs/core/connect-data-platform/profiles.yml). Это можно сделать с помощью командной строки (CLI).

Поддерживаемые платформы данных в dbt Core могут быть проверены нашей Программой Доверенных Адаптеров и поддерживаются dbt Labs, партнерами или членами сообщества.

Эти инструкции по подключению предоставляют основные поля, необходимые для настройки подключения к платформе данных в dbt Cloud. Для более подробных руководств, которые включают данные демонстрационного проекта, ознакомьтесь с нашими [Руководствами по быстрому старту](https://docs.getdbt.com/docs/guides).

## Профили подключения

Если вы используете dbt из командной строки (CLI), вам потребуется файл profiles.yml, который содержит данные для подключения к вашей платформе данных. Когда вы запускаете dbt из CLI, он читает ваш файл dbt_project.yml, чтобы найти имя профиля, а затем ищет профиль с тем же именем в вашем файле profiles.yml. Этот профиль содержит всю информацию, необходимую dbt для подключения к вашей платформе данных.

Для получения подробной информации вы можете обратиться к разделу [Профили подключения](/docs/core/connect-data-platform/connection-profiles).

## Функции адаптеров

В следующей таблице перечислены функции, доступные для адаптеров:

| Адаптер | Каталог | Свежесть источника |
|---------|---------|--------------------|
| dbt default configuration | полный | `loaded_at_field` |
| `dbt-bigquery` | частичный и полный | на основе метаданных и `loaded_at_field` |
| `dbt-databricks` | полный | на основе метаданных и `loaded_at_field` |
| `dbt-postgres` | частичный и полный | `loaded_at_field` |
| `dbt-redshift` | частичный и полный | на основе метаданных и `loaded_at_field` |
| `dbt-snowflake` | частичный и полный | на основе метаданных и `loaded_at_field` |
| `dbt-spark` | полный | `loaded_at_field` |

### Каталог

Для адаптеров, которые это поддерживают, вы можете частично построить каталог. Это позволяет строить каталог только для определенного числа моделей с помощью `dbt docs generate --select ...`. Для адаптеров, которые не поддерживают частичное создание каталога, необходимо выполнить `dbt docs generate`, чтобы построить полный каталог.

### Свежесть источника

Вы можете измерять свежесть источника, используя таблицы метаданных хранилища на поддерживаемых адаптерах. Это позволяет вычислять свежесть источника без использования [`loaded_at_field`](/reference/resource-properties/freshness#loaded_at_field) и без прямого запроса к таблице. Это быстрее и более гибко (хотя иногда может быть неточным, в зависимости от того, как хранилище отслеживает измененные таблицы). Вы можете переопределить это с помощью `loaded_at_field` в [конфигурации источника](/reference/source-configs). Если адаптер этого не поддерживает, вы все равно можете использовать `loaded_at_field`.