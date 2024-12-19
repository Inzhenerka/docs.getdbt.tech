---
title: "Настройка Apache Spark"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Apache Spark в dbt."
id: "spark-setup"
meta:
  maintained_by: dbt Labs
  authors: 'основные разработчики dbt'
  github_repo: 'dbt-labs/dbt-spark'
  pypi_package: 'dbt-spark'
  min_core_version: 'v0.15.0'
  cloud_support: Поддерживается
  min_supported_version: 'н/д'
  slack_channel_name: 'db-databricks-and-spark'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNGCW8HKL'
  platform_name: 'Spark'
  config_page: '/reference/resource-configs/spark-configs'
---


<Snippet path="warehouse-setups-cloud-callout" />
<Snippet path="dbt-databricks-for-databricks" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


Если вы подключаетесь к Databricks через ODBC-драйвер, вам потребуется `pyodbc`. В зависимости от вашей системы, вы можете установить его отдельно или через pip. См. [вики `pyodbc`](https://github.com/mkleehammer/pyodbc/wiki/Install) для получения информации о установке, специфичной для ОС.

Если вы подключаетесь к кластеру Spark через общие методы thrift или http, вам потребуется `PyHive`.

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

<p>Для настройки, специфичной для {frontMatter.meta.platform_name}, пожалуйста, обратитесь к <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>Для получения дополнительной информации обратитесь к репозиторию GitHub: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Методы подключения

dbt-spark может подключаться к кластерам Spark четырьмя различными способами:

- [`odbc`](#odbc) является предпочтительным методом при подключении к Databricks. Он поддерживает подключение к SQL Endpoint или к интерактивному кластеру общего назначения.
- [`thrift`](#thrift) подключается напрямую к ведущему узлу кластера, который может находиться как локально, так и в облаке (например, Amazon EMR).
- [`http`](#http) является более общим методом для подключения к управляемому сервису, который предоставляет HTTP-эндпоинт. В настоящее время это включает подключения к интерактивному кластеру Databricks.

- [`session`](#session) подключается к сессии pySpark, работающей локально или на удаленной машине.

:::info Расширенная функциональность
Метод подключения `session` предназначен для опытных пользователей и экспериментальной разработки dbt. Этот метод подключения не поддерживается в dbt Cloud.
:::


### ODBC

Используйте метод подключения `odbc`, если вы подключаетесь к SQL-эндпоинту Databricks или интерактивному кластеру через ODBC-драйвер. (Скачайте последнюю версию официального драйвера [здесь](https://databricks.com/spark/odbc-driver-download).)

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
      
      # необязательно
      port: [port]              # по умолчанию 443
      user: [user]
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

### Thrift

Используйте метод подключения `thrift`, если вы подключаетесь к серверу Thrift, который находится перед кластером Spark, например, кластеру, работающему локально или на Amazon EMR.

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
      
      # необязательно
      port: [port]              # по умолчанию 10001
      user: [user]
      auth: [например, KERBEROS]
      kerberos_service_name: [например, hive]
      use_ssl: [true|false]   # значение hive.server2.use.SSL, по умолчанию false
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

### HTTP

Используйте метод `http`, если ваш поставщик Spark поддерживает общие подключения через HTTP (например, интерактивный кластер Databricks).

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
      
      # необязательно
      port: [port]              # по умолчанию: 443
      user: [user]
      connect_timeout: 60       # по умолчанию 10
      connect_retries: 5        # по умолчанию 0
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

Интерактивные кластеры Databricks могут запускаться в течение нескольких минут. Вы можете включить необязательные параметры профиля `connect_timeout` и `connect_retries`, и dbt будет периодически повторять попытки подключения.

### Session

Используйте метод `session`, если вы хотите запустить `dbt` против сессии pySpark. 

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

## Необязательные настройки

### Повторные попытки

Непредвиденные ошибки могут возникать неожиданно при выполнении запросов к Apache Spark. Если `retry_all` включен, dbt-spark будет наивно повторять любые запросы, которые не удались, основываясь на конфигурации, предоставленной `connect_timeout` и `connect_retries`. Он не пытается определить, была ли ошибка запроса временной или, вероятно, будет успешной при повторной попытке. Эта конфигурация рекомендуется в производственных средах, где запросы должны быть успешными.

Например, это укажет dbt повторять все неудачные запросы до 3 раз с задержкой в 5 секунд между каждой попыткой:

<File name='~/.dbt/profiles.yml'>

```yaml
retry_all: true
connect_timeout: 5
connect_retries: 3
```

</File>

### Конфигурация на стороне сервера

Spark можно настроить с помощью [Application Properties](https://spark.apache.org/docs/latest/configuration.html). С помощью этих свойств можно настроить выполнение, например, выделив больше памяти для процесса драйвера. Также через эти свойства можно установить время выполнения Spark SQL. Например, это позволяет пользователю [установить каталоги Spark](https://spark.apache.org/docs/latest/configuration.html#spark-sql).

## Предостережения

При возникновении трудностей выполните `poetry run dbt debug --log-level=debug`. Логи сохраняются в `logs/dbt.log`.

### Использование с EMR
Чтобы подключиться к Apache Spark, работающему на кластере Amazon EMR, вам нужно выполнить `sudo /usr/lib/spark/sbin/start-thriftserver.sh` на главном узле кластера, чтобы запустить сервер Thrift (см. [документацию](https://aws.amazon.com/premiumsupport/knowledge-center/jdbc-connection-emr/) для получения дополнительной информации). Вам также нужно подключиться к порту 10001, который подключится к серверу Thrift на бэкенде Spark; порт 10000 подключится к бэкенду Hive, что не будет работать корректно с dbt.

### Поддерживаемая функциональность

Большинство функций dbt Core поддерживается, но некоторые функции доступны только на Delta Lake (Databricks).

Функции только для Delta:
1. Инкрементальные обновления модели по `unique_key` вместо `partition_by` (см. [`merge` strategy](/reference/resource-configs/spark-configs#the-merge-strategy))
2. [Снимки](/docs/build/snapshots)
3. [Сохранение](/reference/resource-configs/persist_docs) описаний на уровне столбцов в качестве комментариев к базе данных

### Стандартное пространство имен с методом подключения Thrift

Чтобы выполнять запросы метаданных в dbt, вам необходимо иметь пространство имен с именем `default` в Spark при подключении с помощью Thrift. Вы можете проверить доступные пространства имен, используя `pyspark` и выполнив `spark.sql("SHOW NAMESPACES").show()`. Если пространство имен по умолчанию не существует, создайте его, выполнив `spark.sql("CREATE NAMESPACE default").show()`.

Если возникла проблема с сетевым подключением, в ваших логах будет отображаться ошибка, подобная `Could not connect to any of [('127.0.0.1', 10000)]` (или что-то подобное).