---
title: "Настройка Apache Spark"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Apache Spark в dbt."
id: "spark-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-spark'
  min_core_version: 'v0.15.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: 'db-databricks-and-spark'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNGCW8HKL'
  platform_name: 'Spark'
  config_page: '/reference/resource-configs/spark-configs'
---

<Snippet path="warehouse-setups-cloud-callout" />
<Snippet path="dbt-databricks-for-databricks" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

Если вы подключаетесь к Databricks через ODBC-драйвер, потребуется `pyodbc`. В зависимости от вашей системы, вы можете установить его отдельно или через pip. Подробности установки для различных ОС смотрите в [wiki `pyodbc`](https://github.com/mkleehammer/pyodbc/wiki/Install).

Если вы подключаетесь к Databricks через ODBC-драйвер, потребуется библиотека `pyodbc`. В зависимости от вашей системы вы можете установить её отдельно или через pip. Подробности установки для разных операционных систем смотрите на странице [вики `pyodbc`](https://github.com/mkleehammer/pyodbc/wiki/Install).

Если вы подключаетесь к кластеру Spark через общие методы thrift или http, потребуется `PyHive`.

```zsh
# odbc соединения
$ python -m pip install "dbt-spark[ODBC]"

# thrift или http соединения
$ python -m pip install "dbt-spark[PyHive]"
```

```zsh
# session соединения
$ python -m pip install "dbt-spark[session]"
```

<h2> Настройка {frontMatter.meta.pypi_package} </h2>

<p>Для конфигурации, специфичной для {frontMatter.meta.platform_name}, обратитесь к <a href={frontMatter.meta.config_page}>Конфигурация {frontMatter.meta.platform_name}</a> </p>

<p>Для получения дополнительной информации обратитесь к репозиторию GitHub: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Методы подключения

dbt-spark может подключаться к кластерам Spark четырьмя различными методами:

- [`odbc`](#odbc) — предпочтительный метод при подключении к Databricks. Он поддерживает подключение к SQL Endpoint или к универсальному интерактивному кластеру.
- [`thrift`](#thrift) — подключается напрямую к ведущему (lead) узлу кластера, развернутого локально / on‑premise или в облаке (например, Amazon EMR).
- [`http`](#http) — более универсальный метод подключения к управляемому сервису, который предоставляет HTTP‑endpoint. В настоящее время это включает подключения к интерактивному кластеру Databricks.

- [`session`](#session) — подключается к pySpark‑сессии, запущенной локально или на удалённой машине.

:::info Advanced functionality
Метод подключения `session` предназначен для опытных пользователей и экспериментальной разработки в dbt. Этот метод подключения не поддерживается в <Constant name="cloud" />.
:::
:::

### ODBC

Используйте метод подключения `odbc`, если вы подключаетесь к SQL endpoint или интерактивному кластеру Databricks через ODBC-драйвер. (Скачайте последнюю версию официального драйвера [здесь](https://databricks.com/spark/odbc-driver-download).)

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: odbc
      driver: [path/to/driver]
      schema: [database/schema name]
      host: [yourorg.sparkhost.com]
      organization: [org id]    # Только для Azure Databricks
      token: [abc123]
      
      # один из:
      endpoint: [endpoint id]
      cluster: [cluster id]
      
      # опционально
      port: [port]              # по умолчанию 443
      user: [user]
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

### Thrift

Используйте метод подключения `thrift`, если вы подключаетесь к Thrift‑серверу, который находится перед кластером Spark, например к кластеру, запущенному локально или в Amazon EMR.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: thrift
      schema: [database/schema name]
      host: [hostname]
      
      # опционально
      port: [port]              # по умолчанию 10001
      user: [user]
      auth: [например, KERBEROS]
      kerberos_service_name: [например, hive]
      use_ssl: [true|false]   # значение параметра hive.server2.use.SSL, по умолчанию false
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

### HTTP

Используйте метод `http`, если ваш Spark‑провайдер поддерживает универсальные подключения по HTTP (например, интерактивный кластер Databricks).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: http
      schema: [database/schema name]
      host: [yourorg.sparkhost.com]
      organization: [org id]    # Только для Azure Databricks
      token: [abc123]
      cluster: [cluster id]
      
      # опционально
      port: [port]              # по умолчанию: 443
      user: [user]
      connect_timeout: 60       # по умолчанию 10
      connect_retries: 5        # по умолчанию 0
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

Интерактивные кластеры Databricks могут запускаться несколько минут. Вы можете включить опциональные конфигурации профиля `connect_timeout` и `connect_retries`, и dbt будет периодически пытаться повторно подключиться.

### Session

Используйте метод `session`, если вы хотите запускать `dbt` против pySpark сессии.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: session
      schema: [database/schema name]
      host: NA                           # не используется, но требуется `dbt-core`
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

## Опциональные конфигурации

### Повторы

Периодические ошибки могут возникать неожиданно при выполнении запросов к Apache Spark. Если `retry_all` включен, dbt-spark будет наивно повторять любой запрос, который завершился неудачей, основываясь на конфигурации, заданной `connect_timeout` и `connect_retries`. Он не пытается определить, была ли ошибка запроса временной или вероятно успешной при повторе. Эта конфигурация рекомендуется в производственных средах, где запросы должны выполняться успешно.

Например, это укажет dbt повторять все неудачные запросы до 3 раз с задержкой в 5 секунд между каждой попыткой:

<File name='~/.dbt/profiles.yml'>

```yaml
retry_all: true
connect_timeout: 5
connect_retries: 3
```

</File>

### Конфигурация на стороне сервера

Spark может быть настроен с использованием [Свойств приложения](https://spark.apache.org/docs/latest/configuration.html). Используя эти свойства, выполнение может быть настроено, например, для выделения большего объема памяти процессу драйвера. Также, через эти свойства можно настроить выполнение Spark SQL. Например, это позволяет пользователю [установить каталоги Spark](https://spark.apache.org/docs/latest/configuration.html#spark-sql).

## Предостережения

При возникновении трудностей запустите `poetry run dbt debug --log-level=debug`. Логи сохраняются в `logs/dbt.log`.

### Использование с EMR
Чтобы подключиться к Apache Spark, работающему на кластере Amazon EMR, вам нужно будет запустить `sudo /usr/lib/spark/sbin/start-thriftserver.sh` на главном узле кластера, чтобы запустить Thrift-сервер (подробнее см. в [документации](https://aws.amazon.com/premiumsupport/knowledge-center/jdbc-connection-emr/)). Вам также нужно будет подключиться к порту 10001, который подключится к Thrift-серверу Spark; порт 10000 вместо этого подключится к Hive-серверу, что не будет работать корректно с dbt.

### Поддерживаемая функциональность

Большая часть функциональности <Constant name="core" /> поддерживается, однако некоторые возможности доступны только в Delta Lake (Databricks).

Функции, доступные только в Delta:
1. Инкрементальные обновления моделей по `unique_key` вместо `partition_by` (см. [стратегию `merge`](/reference/resource-configs/spark-configs#the-merge-strategy))
2. [Снимки](/docs/build/snapshots)
3. [Сохранение](/reference/resource-configs/persist_docs) описаний на уровне столбцов в виде комментариев в базе данных

### Пространство имен по умолчанию с методом подключения Thrift

Для выполнения запросов метаданных в dbt вам нужно иметь пространство имен с именем `default` в Spark при подключении с помощью Thrift. Вы можете проверить доступные пространства имен, используя `pyspark` и выполнив `spark.sql("SHOW NAMESPACES").show()`. Если пространство имен по умолчанию не существует, создайте его, выполнив `spark.sql("CREATE NAMESPACE default").show()`.

Если возникнет проблема с сетевым подключением, ваши логи отобразят ошибку, такую как `Could not connect to any of [('127.0.0.1', 10000)]` (или что-то подобное).