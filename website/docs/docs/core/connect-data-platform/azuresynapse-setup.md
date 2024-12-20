---
title: "Настройка Microsoft Azure Synapse DWH"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища данных Microsoft Azure Synapse в dbt."
meta:
  maintained_by: Microsoft
  authors: 'Microsoft (https://github.com/Microsoft)'
  github_repo: 'Microsoft/dbt-synapse'
  pypi_package: 'dbt-synapse'
  min_core_version: 'v0.18.0'
  cloud_support: Supported
  min_supported_version: 'Azure Synapse 10'
  slack_channel_name: '#db-synapse'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Synapse'
  config_page: '/reference/resource-configs/azuresynapse-configs'
---

:::info

Следующее руководство посвящено использованию выделенных SQL-пулов Azure Synapse Analytics, ранее известных как SQL DW. Для получения дополнительной информации обратитесь к [Что такое выделенный SQL-пул (ранее SQL DW) в Azure Synapse Analytics?](https://learn.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is).

Обратитесь к [Microsoft Fabric Synapse Data Warehouse](/docs/core/connect-data-platform/fabric-setup), чтобы настроить его с dbt.

:::

<!--Следующий код использует компонент и встроенный файл частичных markdown docusaurus, который содержит повторно используемый контент, назначенный в мета-данных. Для этой страницы частичный файл - _setup-pages-intro.md. Вы должны включить код 'import' и затем назначить компонент по мере необходимости. -->

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

:::info Только выделенные SQL

Azure Synapse предлагает как выделенные SQL-пулы, так и серверные SQL-пулы.
**Только выделенные SQL-пулы поддерживаются этим адаптером. 

:::

### Предварительные требования

На Debian/Ubuntu убедитесь, что у вас есть заголовочные файлы ODBC перед установкой

```bash
sudo apt install unixodbc-dev
```

Скачайте и установите [Microsoft ODBC Driver 18 для SQL Server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15).
Если у вас уже установлен ODBC Driver 17, то он также будет работать.

:::tip Изменение настроек по умолчанию в dbt-synapse v1.2 / ODBC Driver 18
Microsoft внесла несколько изменений, связанных с шифрованием соединений. Подробнее об изменениях читайте [здесь](/docs/core/connect-data-platform/mssql-setup).
:::

### Методы аутентификации

Этот адаптер основан на адаптере для Microsoft SQL Server.
Поэтому поддерживаются те же методы аутентификации.

Конфигурация такая же, за исключением одного важного отличия:
вместо указания `type: sqlserver`, вы указываете `type: synapse`.

Пример:

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: synapse
      driver: 'ODBC Driver 17 for SQL Server' # (ODBC Driver, установленный на вашей системе)
      server: workspacename.sql.azuresynapse.net # (Выделенный SQL-эндпоинт вашего рабочего пространства здесь)
      port: 1433
      database: exampledb
      schema: schema_name
      user: username
      password: password
```

</File>

Вы можете найти все доступные опции и документацию о том, как их настроить, на [странице документации для адаптера dbt-sqlserver](/docs/core/connect-data-platform/mssql-setup).