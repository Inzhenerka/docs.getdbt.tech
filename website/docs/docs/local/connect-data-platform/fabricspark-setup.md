---
title: "Подключение Microsoft Fabric Lakehouse к dbt v1"
sidebar_label: "Microsoft Fabric Lakehouse"
description: "Из этого руководства вы узнаете, как настроить Microsoft Fabric Spark для работы с Lakehouse в dbt."
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
availability: local_free
---


<Snippet path="warehouse-setups-cloud-callout" />


Ниже приведено руководство по работе с [Fabric Data Engineering](https://learn.microsoft.com/en-us/fabric/data-engineering/data-engineering-overview) — новым продуктом в составе Microsoft Fabric. В настоящее время этот адаптер поддерживает подключение к конечной точке Lakehouse.

Чтобы узнать, как настроить dbt для работы с Fabric Warehouse, обратитесь к разделу [Microsoft Fabric Data Warehouse](/docs/local/connect-data-platform/fabric-setup).


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


<p>Дополнительную информацию см. в репозитории GitHub: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Поддерживаемые типы аутентификации

Адаптер Fabric Lakehouse (`dbt-fabricspark`) подключается к Fabric Spark через Livy API. Выберите метод аутентификации в зависимости от того, где вы запускаете <Constant name="core" />.

<Tabs>

<TabItem value="Azure CLI">

Используйте Azure CLI для установок dbt в собственной инфраструктуре. Это позволяет <Constant name="core" /> использовать учётные данные из активного сеанса `az login`. Чтобы использовать этот метод, задайте `authentication: CLI` в файле `profiles.yml` и выполните `az login`.

При аутентификации Azure CLI может открыть окно браузера или предложить перейти на [страницу входа Microsoft с устройства](https://microsoft.com/devicelogin) и ввести одноразовый код для завершения входа. После успешной аутентификации dbt автоматически использует активный сеанс Azure CLI для последующих команд.

#### Пример конфигурации Azure CLI

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: fabricspark
      method: livy
      endpoint: https://api.fabric.microsoft.com/v1
      workspaceid: WORKSPACE_ID
      lakehouseid: LAKEHOUSE_ID
      lakehouse: LAKEHOUSE_NAME
      schema: LAKEHOUSE_OR_SCHEMA_NAME
      threads: 1

      # Authentication (CLI for self-hosted dbt installations)
      authentication: CLI
```

</File>

</TabItem>

<TabItem value="Service principal">

Используйте субъект-службу Microsoft Entra ID для CI/CD и других автоматизированных рабочих нагрузок. Этот метод использует учётные данные регистрации приложения, а не активный сеанс `az login`. Чтобы использовать этот метод, задайте `authentication: SPN` в файле `profiles.yml` и укажите идентификатор клиента, идентификатор арендатора и секрет клиента для субъекта-службы.

Перед запуском с аутентификацией через субъект-службу убедитесь, что:

- У субъекта-службы есть доступ к рабочей области Fabric и Lakehouse.
- На портале администрирования Fabric включён параметр «Service principals can use Fabric APIs».

#### Пример конфигурации субъекта-службы

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: fabricspark
      method: livy
      endpoint: https://api.fabric.microsoft.com/v1
      workspaceid: WORKSPACE_ID
      lakehouseid: LAKEHOUSE_ID
      lakehouse: LAKEHOUSE_NAME
      schema: LAKEHOUSE_OR_SCHEMA_NAME
      threads: 1

      # Authentication (SPN for CI/CD)
      authentication: SPN
      client_id: SPN_CLIENT_ID
      tenant_id: MICROSOFT_ENTRA_TENANT_ID
      client_secret: SPN_CLIENT_SECRET
```

</File>

</TabItem>

<TabItem value="Fabric notebook">

Вы можете проходить аутентификацию через Livy API из блокнота Fabric для рабочих нагрузок в производственной среде и сценариев оркестрации в экосистеме Microsoft Fabric. Этот метод использует [`notebookutils.credentials`](https://learn.microsoft.com/en-us/fabric/data-engineering/notebookutils/notebookutils-credentials?tabs=python).

Используйте блокноты Python вместо блокнотов PySpark, чтобы минимизировать затраты на вычислительные ресурсы, поскольку Livy API запускает собственные сеансы Spark.

#### Пример конфигурации для блокнота Fabric

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: fabricspark
      method: livy
      endpoint: https://api.fabric.microsoft.com/v1
      workspaceid: WORKSPACE_ID
      lakehouseid: LAKEHOUSE_ID
      lakehouse: LAKEHOUSE_NAME
      schema: LAKEHOUSE_OR_SCHEMA_NAME
      threads: 1

      # Authentication (fabric_notebook for execution from a Fabric notebook)
      authentication: fabric_notebook
```

</File>

</TabItem>

<TabItem value="Custom TokenCredential">

Используйте `token_credential`, если вам нужно, чтобы <Constant name="core" /> загружал пользовательскую реализацию [`azure.core.credentials.TokenCredential`](https://learn.microsoft.com/en-us/python/api/azure-core/azure.core.credentials.tokencredential), например для федерации удостоверений рабочих нагрузок или получения токенов через посредника. Чтобы использовать этот метод, задайте `authentication: token_credential` и укажите путь к своему классу учётных данных через точку.

#### Пример конфигурации пользовательского TokenCredential

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: fabricspark
      method: livy
      endpoint: https://api.fabric.microsoft.com/v1
      workspaceid: WORKSPACE_ID
      lakehouseid: LAKEHOUSE_ID
      lakehouse: LAKEHOUSE_NAME
      schema: LAKEHOUSE_OR_SCHEMA_NAME
      threads: 1

      # Authentication (custom TokenCredential)
      authentication: token_credential
      credential_class: my_package.auth.ExternalTokenCredential
      credential_kwargs:
        tenant_id: MICROSOFT_ENTRA_TENANT_ID
```

</File>

Замените значения `credential_class` и `credential_kwargs` на путь к классу и именованные аргументы, которые ожидает ваша пользовательская реализация учётных данных.

</TabItem>

</Tabs>

## Методы подключения

`dbt-fabricspark` может подключаться к среде выполнения Fabric Spark с помощью Fabric Livy API. Fabric Livy API позволяет отправлять задания в двух разных режимах:  

- [`session-jobs`](#session-jobs) — задание в сеансе Livy предполагает создание сеанса Spark, который остаётся активным на протяжении всего сеанса. В одном сеансе Spark можно выполнять несколько заданий (каждое задание представляет собой действие), совместно используя состояние и кешированные данные.
- Пакетные задания предполагают отправку приложения Spark для однократного выполнения задания. В отличие от задания в сеансе Livy, пакетное задание не поддерживает постоянно работающий сеанс Spark. При использовании пакетных заданий Livy каждое задание запускает новый сеанс Spark, который завершается по окончании задания.

:::info Поддерживаемый режим
Чтобы совместно использовать состояние сеанса между заданиями и сократить накладные расходы на управление сеансами, адаптер `dbt-fabricspark` поддерживает только режим `session-jobs`.
:::

### session-jobs

`session-jobs` — предпочтительный метод подключения к Fabric Lakehouse.

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

## Дополнительные настройки

### Повторные попытки

При выполнении запросов к Fabric Spark могут неожиданно возникать временные ошибки. Если включён параметр `retry_all`, `dbt-fabricspark` будет повторно выполнять любые запросы, завершившиеся с ошибкой, в соответствии с настройками `connect_timeout` и `connect_retries`. При этом адаптер не пытается определить, была ли ошибка запроса временной и может ли повторная попытка завершиться успешно. Эта настройка рекомендуется для производственных сред, где запросы должны выполняться успешно. Значение `connect_retries` по умолчанию — 2. 

Например, следующая конфигурация предписывает dbt повторять все запросы, завершившиеся с ошибкой, до 3 раз с задержкой в 5 секунд между попытками:

<File name='~/.dbt/profiles.yml'>

```yaml
retry_all: true
connect_timeout: 5
connect_retries: 3
```
</File>



### Настройка Spark

Spark можно настроить с помощью [свойств приложения](https://spark.apache.org/docs/latest/configuration.html). Эти свойства позволяют изменять параметры выполнения, например выделять больше памяти процессу драйвера. Кроме того, с помощью этих свойств можно настроить среду выполнения Spark SQL. Например, это позволяет пользователю [задать каталоги Spark](https://spark.apache.org/docs/latest/configuration.html#spark-sql).


### Поддерживаемые возможности

Поддерживается большинство возможностей <Constant name="core" />. Подробнее см. в разделе [Совместимость Delta Lake](https://learn.microsoft.com/en-us/fabric/fundamentals/delta-lake-interoperability).

Возможности, доступные только для Delta:
1. Инкрементальное обновление моделей по `unique_key` вместо `partition_by` (см. [стратегию `merge`](/reference/resource-configs/spark-configs#the-merge-strategy))
2. [Снимки](/docs/build/snapshots)
3. [Сохранение](/reference/resource-configs/persist_docs) описаний столбцов в виде комментариев в базе данных

### Ограничения

1. Fabric Lakehouse поддерживает только форматы данных таблиц Delta, CSV и Parquet.
