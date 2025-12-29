---
title: "Конфигурация IBM watsonx.data Presto"
id: "watsonx-presto-config"
---

## Требования к экземпляру

Для использования IBM watsonx.data Presto (java) с адаптером `dbt-watsonx-presto` убедитесь, что экземпляр имеет подключённый каталог, который поддерживает создание, переименование, изменение и удаление объектов, таких как таблицы и представления. Пользователь, подключающийся к экземпляру через адаптер `dbt-watsonx-presto`, должен иметь необходимые права доступа к целевому каталогу.

Подробные инструкции по настройке, включая установку watsonx.data, добавление движка Presto (Java), конфигурацию хранилищ, регистрацию источников данных и управление правами доступа, см. в официальной документации IBM:
- Документация watsonx.data Software: [IBM watsonx.data Software Guide](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x)
- Документация watsonx.data SaaS: [IBM watsonx.data SaaS Guide](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-getting-started)

## Свойства сессии

В экземпляре IBM watsonx.data SaaS/Software вы можете [задавать session properties](https://prestodb.io/docs/current/sql/set-session.html), чтобы изменять текущую конфигурацию для пользовательской сессии.

Чтобы временно изменить session properties для конкретной dbt-модели или группы моделей, используйте [dbt hook](/reference/resource-configs/pre-hook-post-hook). Например:

```sql
{{
  config(
    pre_hook="set session query_max_run_time='10m'"
  )
}}
```

## Свойства коннекторов

IBM watsonx.data SaaS/Software поддерживает различные свойства коннекторов, которые позволяют управлять тем, как представлены ваши данные. Эти свойства особенно полезны для файловых коннекторов, таких как Hive.

Информацию о том, какие возможности поддерживаются для каждого источника данных, см. в следующих ресурсах:
- [watsonx.data SaaS Catalog](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-reg_database)
- [watsonx.data Software Catalog](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=components-adding-data-source)

## Конфигурация форматов файлов

Файловые коннекторы, такие как Hive и Iceberg, позволяют настраивать материализацию таблиц, форматы данных и стратегии партиционирования в dbt-моделях. Примеры ниже демонстрируют, как сконфигурировать эти параметры для каждого коннектора.

### Конфигурация Hive

Hive поддерживает указание форматов файлов и стратегий партиционирования с помощью параметра `properties` в dbt-моделях. В примере ниже показано, как создать партиционированную таблицу, хранящуюся в формате Parquet:

```sql
{{
  config(
    materialized='table',
    properties={
      "format": "'PARQUET'", -- Specifies the file format
      "partitioned_by": "ARRAY['id']", -- Defines the partitioning column(s)
    }
  )
}}
```

Дополнительную информацию о создании таблиц Hive и поддерживаемых свойствах см. в [документации по коннектору Hive](https://prestodb.io/docs/current/connector/hive.html#create-a-managed-table).

### Конфигурация Iceberg

Iceberg поддерживает определение форматов файлов и расширенных стратегий партиционирования для оптимизации производительности запросов. В следующем примере показано, как создать таблицу в формате ORC с партиционированием на основе бакетирования:

```sql
{{
  config(
    materialized='table',
    properties={
      "format": "'ORC'", -- Specifies the file format
      "partitioning": "ARRAY['bucket(id, 2)']", -- Defines the partitioning strategy
    }
  )
}}
```

Дополнительную информацию о создании таблиц Iceberg и поддерживаемых конфигурациях см. в [документации по коннектору Iceberg](https://prestodb.io/docs/current/connector/iceberg.html#create-table).

## Seeds

Адаптер `dbt-watsonx-presto` обеспечивает полную поддержку всех [типов данных watsonx.data Presto](https://www.ibm.com/support/pages/node/7157339) в seed-файлах. Чтобы воспользоваться этой возможностью, необходимо явно определить типы данных для каждого столбца.

Вы можете настраивать типы данных столбцов либо в файле `dbt_project.yml`, либо в property-файлах, поддерживаемых dbt. Подробнее о конфигурации seed-данных и лучших практиках см. в [документации по настройке dbt seeds](/reference/seed-configs).

## Материализации

Адаптер `dbt-watsonx-presto` поддерживает материализации `table` и `view`, позволяя управлять тем, как данные хранятся и запрашиваются в watsonx.data Presto (java).

Дополнительную информацию о настройке материализаций см. в [документации по materializations в dbt](/reference/resource-configs/materialized).

### Таблицы

Адаптер `dbt-watsonx-presto` позволяет создавать и обновлять таблицы с помощью materialization `table`, что упрощает работу с данными в watsonx.data Presto.

#### Рекомендации
- **Проверьте права доступа:** убедитесь, что в каталоге или схеме включены необходимые разрешения для создания таблиц.
- **Проверьте документацию коннектора:** ознакомьтесь с поддержкой SQL-операторов watsonx.data Presto в разделе [sql statement support](https://www.ibm.com/support/pages/node/7157339), чтобы убедиться, что создание и изменение таблиц поддерживается.

#### Ограничения для некоторых коннекторов

Некоторые коннекторы watsonx.data Presto, особенно доступные только для чтения или имеющие ограниченные права, не позволяют создавать или изменять таблицы. При попытке использовать materialization `table` с такими коннекторами может возникнуть ошибка вида:

```sh
PrestoUserError(type=USER_ERROR, name=NOT_SUPPORTED, message="This connector does not support creating tables with data", query_id=20241206_071536_00026_am48r)
```

### Представления

Адаптер `dbt-watsonx-presto` по умолчанию автоматически создаёт представления, так как `view` является стандартной materialization в dbt. Если materialization явно не указана, dbt создаст представление в watsonx.data Presto.

Чтобы убедиться, что ваш коннектор поддерживает создание представлений, см. раздел watsonx.data [sql statement support](https://www.ibm.com/support/pages/node/7157339).

## Неподдерживаемые возможности

Следующие возможности не поддерживаются адаптером `dbt-watsonx-presto`:
- Инкрементальная материализация
- Материализованные представления
- Снимки (snapshots)

