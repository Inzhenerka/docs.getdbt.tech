---
title: "Настройка Microsoft Fabric Lakehouse"
description: "Прочитайте это руководство, чтобы узнать о настройке Microsoft Fabric Spark для Lakehouse в dbt."
id: "fabricspark-setup"
meta:
  maintained_by: Microsoft
  authors: Microsoft
  github_repo: 'microsoft/dbt-fabricspark'
  pypi_package: 'dbt-fabricspark'
  min_core_version: 'v1.7'
  cloud_support: 'Not supported'
  min_supported_version: 'n/a'
  slack_channel_name: 'db-fabric-synapse'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Microsoft Fabric'
  config_page: '/reference/resource-configs/fabricspark-configs'
---


<Snippet path="warehouse-setups-cloud-callout" />


Ниже приведено руководство по использованию [Fabric Data Engineering](https://learn.microsoft.com/en-us/fabric/data-engineering/data-engineering-overview) — нового продукта в составе Microsoft Fabric. В настоящее время этот адаптер поддерживает подключение только к endpoint’у lakehouse.

Чтобы узнать, как настроить dbt для работы с Fabric Warehouse, см. [Microsoft Fabric Data Warehouse](/docs/core/connect-data-platform/fabric-setup).


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


<p>Для получения дополнительной информации см. GitHub-репозиторий: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Способы подключения {#connection-methods}

dbt-fabricspark может подключаться к Fabric Spark runtime с использованием Fabric Livy API. Fabric Livy API позволяет отправлять задания в двух разных режимах:  

- [`session-jobs`](#session-jobs) Livy session job предполагает установку Spark-сессии, которая остаётся активной на протяжении всей работы Spark. В рамках одной Spark-сессии можно выполнять несколько заданий (каждое задание — это действие), при этом между заданиями разделяется состояние и кэшированные данные.
- batch jobs предполагают отправку Spark-приложения для выполнения одного задания. В отличие от Livy session job, batch job не поддерживает длительную Spark-сессию. При использовании Livy batch jobs для каждого задания создаётся новая Spark-сессия, которая завершается после окончания выполнения задания.

:::info Поддерживаемый режим
Чтобы разделять состояние сессии между заданиями и уменьшить накладные расходы на управление сессиями, адаптер dbt-fabricspark поддерживает только режим `session-jobs`.
:::

### session-jobs {#session-jobs}

session-jobs — это предпочтительный способ подключения к Fabric Lakehouse.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabricspark
      method: livy
      authentication: CLI
      endpoint: https://api.fabric.microsoft.com/v1
      workspaceid: [Fabric Workspace GUID]
      lakehouseid: [Lakehouse GUID]
      lakehouse: [Lakehouse Name]
      schema: [Lakehouse Name]
      spark_config:
        name: [Application Name]
        # optional
        archives:
          - "example-archive.zip"
        conf:
            spark.executor.memory: "2g"
            spark.executor.cores: "2"
        tags:
          project: [Project Name]
          user: [User Email]
          driverMemory: "2g"
          driverCores: 2
          executorMemory: "4g"
          executorCores: 4
          numExecutors: 3
      # optional
      connect_retries: 0
      connect_timeout: 10
      retry_all: true
```

</File>

## Дополнительные настройки {#optional-configurations}

### Повторы (Retries) {#retries}

При выполнении запросов к Fabric Spark могут неожиданно возникать кратковременные ошибки. Если включена опция `retry_all`, dbt-fabricspark будет повторно выполнять любые неудавшиеся запросы в соответствии с настройками `connect_timeout` и `connect_retries`. При этом не предпринимается попытка определить, была ли ошибка временной или имеет ли смысл повторный запуск. Такая конфигурация рекомендуется для production-окружений, где запросы в норме должны успешно выполняться. Значение `connect_retries` по умолчанию равно 2. 

Например, следующая конфигурация укажет dbt повторять все неудавшиеся запросы до 3 раз с задержкой 5 секунд между попытками:

<File name='~/.dbt/profiles.yml'>

```yaml
retry_all: true
connect_timeout: 5
connect_retries: 3
```
</File>



### Конфигурация Spark {#spark-configuration}

Spark можно настраивать с помощью [Application Properties](https://spark.apache.org/docs/latest/configuration.html). Используя эти свойства, можно изменить параметры выполнения, например, выделить больше памяти для процесса драйвера. Также через эти свойства можно задать настройки Spark SQL runtime. Например, это позволяет пользователю [настроить Spark catalogs](https://spark.apache.org/docs/latest/configuration.html#spark-sql).


### Поддерживаемая функциональность {#supported-functionality}

Поддерживается большая часть функциональности <Constant name="core" />. Подробнее см. [Delta Lake interoporability](https://learn.microsoft.com/en-us/fabric/fundamentals/delta-lake-interoperability).

Функциональность, доступная только для Delta:
1. Инкрементальные обновления моделей по `unique_key` вместо `partition_by` (см. стратегию [`merge`](/reference/resource-configs/spark-configs#the-merge-strategy))
2. [Snapshots](/docs/build/snapshots)
3. [Сохранение](/reference/resource-configs/persist_docs) описаний столбцов на уровне базы данных в виде комментариев

### Ограничения {#limitations}

1. Схемы Lakehouse не поддерживаются. См. [ограничения](https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-schemas#public-preview-limitations)
2. Аутентификация через Service Principal пока не поддерживается Livy API.
3. Fabric Lakehouse поддерживает только форматы данных таблиц Delta, CSV и Parquet.
