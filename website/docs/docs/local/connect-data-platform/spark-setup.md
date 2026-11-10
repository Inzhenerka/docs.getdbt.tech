---
title: "Настройка Apache Spark"
sidebar_label: "Apache Spark"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища данных Apache Spark в dbt."
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
availability: local_free
---

<VersionBlock firstVersion="2.0">

# Подключение Apache Spark к <Constant name="fusion" /> <Lifecycle status="beta" />

<Constant name="fusion_engine" /> поддерживает Apache Spark, ускоряя компиляцию и выполнение ваших проектов dbt на базе Spark. В настоящее время <Constant name="fusion" /> поддерживает только Apache Spark 3.0.

## <Constant name="fusion" /> и Spark

При работе со Spark <Constant name="fusion" /> использует диалект Databricks SQL для [статического анализа](/docs/build/about-static-analysis#principles-of-static-analysis). Databricks SQL — это надмножество Spark SQL, поэтому ваш SQL проверяется в соответствии с семантикой Databricks. Это обеспечивает всестороннюю проверку ошибок и функции анализа SQL. В одном из будущих выпусков планируется добавить отдельный диалект Spark SQL для статического анализа.


## Аутентификация

Адаптер Spark в <Constant name="fusion" /> поддерживает:

- Thrift
  - Механизм PLAIN протокола Simple Authentication and Security Layer (SASL)
  - Без SASL (NOSASL) 
- Livy
  - Базовую аутентификацию (имя пользователя и пароль)
  - При развертывании в Amazon Web Services (AWS): AWS Signature Version 4
    - Поддерживается аутентификация с использованием единого входа, служебных учетных записей или пользовательских токенов

## Настройка <Constant name="fusion" />

Настройте подключение к Spark в `profiles.yml`:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: CONNECTION_METHOD # thrift, http, or livy
      port: PORT_NUMBER
      auth: AUTH_METHOD
      schema: SCHEMA_NAME
      host: HOSTNAME
      platform_hint: PLATFORM_HINT # optional; aws_emr_serverless or aws_emr_eks
      server_side_parameters: # optional; required keys depend on platform_hint
        livy.server.session.ttl: SESSION_TTL_SECONDS # optional when using method: livy
```

</File>

| Поле профиля | Обязательное | Описание | Пример |
| --- | --- | --- | --- |
| `method` | Да | Метод подключения. Допустимые значения: `thrift`, `http` или `livy`. | `thrift` |
| `port` | Да | Номер порта для подключения. | `443` |
| `auth` | Да | Метод аутентификации. | `SASL PLAIN`, `NOSASL`, `AWS_SIGV4`  |
| `schema` | Да | Имя базы данных или схемы, в которой dbt будет создавать объекты и выполнять запросы к ним. | `analytics` |
| `host` | Да | Имя хоста кластера Spark или рабочей области Databricks. | `yourorg.sparkhost.com` |
| `platform_hint` | Нет | Указывает <Constant name="fusion" />, какую платформу Spark вы используете. <Constant name="fusion" /> использует это значение для проверки обязательных параметров в `server_side_parameters`. Допустимые значения: `aws_emr_serverless`, `aws_emr_eks`. Если параметр не указан, <Constant name="fusion" /> предполагает, что используется обычный кластер Spark. | `aws_emr_serverless` |
| `server_side_parameters` | Нет | Параметры сеанса Spark, передаваемые кластеру. <br/><br/>Обязательные ключи при использовании `platform_hint`:<br/>- Для `aws_emr_serverless` используйте `emr-serverless.session.executionRoleArn`.<br/>- Для `aws_emr_eks` используйте `spark.kubernetes.namespace`.<br/><br/>При использовании `method: livy` можно задать `livy.server.session.ttl`, чтобы настроить время, в течение которого сеанс может оставаться неактивным до его завершения. | См. [примеры профилей](#example-profiles). |

### Примеры профилей {#example-profiles}

<Tabs>

<TabItem value="thrift-binary" label="Thrift (бинарный)">

<File name='~/.dbt/profiles.yml'>

```yaml
spark-local-thrift-binary:
  target: spark
  outputs:
    spark:
      type: spark
      method: thrift
      port: 10000
      auth: NOSASL
      host: localhost
      schema: my_schema
```

</File>

</TabItem>

<TabItem value="thrift-http" label="Thrift (HTTP)">

<File name='~/.dbt/profiles.yml'>

```yaml
spark-local-thrift-http:
  target: spark
  outputs:
    spark:
      type: spark
      method: http
      port: 443
      auth: NOSASL
      # Omit the protocol scheme to use HTTPS. For HTTP, use a host like http://localhost
      host: localhost
      schema: my_schema
```

</File>

</TabItem>

<TabItem value="emr-serverless" label="AWS EMR Serverless">

<File name='~/.dbt/profiles.yml'>

```yaml
spark-emr-serverless:
  target: spark
  outputs:
    spark:
      type: spark
      method: livy
      auth: AWS_SIGV4
      port: 443
      host: "YOUR_APPLICATION_ID.livy.emr-serverless-services.us-east-1.amazonaws.com"
      schema: my_schema
      platform_hint: aws_emr_serverless
      server_side_parameters:
        "spark.driver.memory": "1g"
        "spark.driver.cores": 1
        "spark.executor.memory": "1g"
        "spark.executor.cores": 1
        # Required by EMR Serverless when using platform_hint: aws_emr_serverless
        "emr-serverless.session.executionRoleArn": "arn:aws:iam::YOUR_AWS_ACCOUNT:role/YOUR_ROLE"
```

</File>

</TabItem>

<TabItem value="emr-eks" label="AWS EMR в EKS">

<File name='~/.dbt/profiles.yml'>

```yaml
spark-emr-eks:
  target: spark
  outputs:
    spark:
      type: spark
      method: livy
      auth: AWS_SIGV4
      port: 443
      host: "https://my-spark-cluster.com"
      schema: my_schema
      platform_hint: aws_emr_eks
      server_side_parameters:
        # Required by EMR on EKS when using platform_hint: aws_emr_eks
        "spark.kubernetes.namespace": "emr-jobs"
        "spark.driver.memory": "1g"
        "spark.driver.cores": 1
        "spark.executor.memory": "8g"
        "spark.executor.cores": 4
```

</File>

</TabItem>

</Tabs>

Подробные сведения о параметрах конфигурации см. на странице [Настройка Spark](/reference/resource-configs/spark-configs).

</VersionBlock>

<VersionBlock lastVersion="1.99">

# Подключение Apache Spark к <Constant name="core" />

Также доступно подключение, <ProductCard text="совместимое с dbt v2" url="/docs/local/connect-data-platform/spark-setup?version=2" />.
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

## Методы подключения {#connection-methods}

dbt-spark может подключаться к кластерам Spark четырьмя различными методами:

- [`odbc`](#odbc) — предпочтительный метод при подключении к Databricks. Он поддерживает подключение к SQL Endpoint или к универсальному интерактивному кластеру.
- [`thrift`](#thrift) — подключается напрямую к ведущему (lead) узлу кластера, развернутого локально / on‑premise или в облаке (например, Amazon EMR).
- [`http`](#http) — более универсальный метод подключения к управляемому сервису, который предоставляет HTTP‑endpoint. В настоящее время это включает подключения к интерактивному кластеру Databricks.

- [`session`](#example-profiles) — подключается к pySpark‑сессии, запущенной локально или на удалённой машине.

:::info Расширенные возможности
Метод подключения `session` предназначен для опытных пользователей и экспериментальной разработки dbt. Этот метод подключения не поддерживается <Constant name="dbt" />.
:::

### ODBC {#odbc}

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

### Thrift {#thrift}

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

### HTTP {#http}

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

### Session {#session}

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
host: NA                           # не используется, но требуется dbt
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

## Опциональные конфигурации {#optional-configurations}

### Повторы {#retries}

Периодические ошибки могут возникать неожиданно при выполнении запросов к Apache Spark. Если `retry_all` включен, dbt-spark будет наивно повторять любой запрос, который завершился неудачей, основываясь на конфигурации, заданной `connect_timeout` и `connect_retries`. Он не пытается определить, была ли ошибка запроса временной или вероятно успешной при повторе. Эта конфигурация рекомендуется в производственных средах, где запросы должны выполняться успешно.

Например, это укажет dbt повторять все неудачные запросы до 3 раз с задержкой в 5 секунд между каждой попыткой:

<File name='~/.dbt/profiles.yml'>

```yaml
retry_all: true
connect_timeout: 5
connect_retries: 3
```

</File>

### Конфигурация на стороне сервера {#server-side-configuration}

Spark может быть настроен с использованием [Свойств приложения](https://spark.apache.org/docs/latest/configuration.html). Используя эти свойства, выполнение может быть настроено, например, для выделения большего объема памяти процессу драйвера. Также, через эти свойства можно настроить выполнение Spark SQL. Например, это позволяет пользователю [установить каталоги Spark](https://spark.apache.org/docs/latest/configuration.html#spark-sql).

## Предостережения {#caveats}

При возникновении трудностей запустите `poetry run dbt debug --log-level=debug`. Логи сохраняются в `logs/dbt.log`.

### Использование с EMR {#usage-with-emr}
Чтобы подключиться к Apache Spark, работающему на кластере Amazon EMR, вам нужно будет запустить `sudo /usr/lib/spark/sbin/start-thriftserver.sh` на главном узле кластера, чтобы запустить Thrift-сервер (подробнее см. в [документации](https://aws.amazon.com/premiumsupport/knowledge-center/jdbc-connection-emr/)). Вам также нужно будет подключиться к порту 10001, который подключится к Thrift-серверу Spark; порт 10000 вместо этого подключится к Hive-серверу, что не будет работать корректно с dbt.

### Поддерживаемая функциональность {#supported-functionality}

Большая часть функциональности <Constant name="core" /> поддерживается, однако некоторые возможности доступны только в Delta Lake (Databricks).

Функции, доступные только в Delta:
1. Инкрементальные обновления моделей по `unique_key` вместо `partition_by` (см. [стратегию `merge`](/reference/resource-configs/spark-configs#the-merge-strategy))
2. [Снимки](/docs/build/snapshots)
3. [Сохранение](/reference/resource-configs/persist_docs) описаний на уровне столбцов в виде комментариев в базе данных

### Пространство имен по умолчанию с методом подключения Thrift {#default-namespace-with-thrift-connection-method}

Для выполнения запросов метаданных в dbt вам нужно иметь пространство имен с именем `default` в Spark при подключении с помощью Thrift. Вы можете проверить доступные пространства имен, используя `pyspark` и выполнив `spark.sql("SHOW NAMESPACES").show()`. Если пространство имен по умолчанию не существует, создайте его, выполнив `spark.sql("CREATE NAMESPACE default").show()`.

Если возникнет проблема с сетевым подключением, в журналах появится ошибка вида `Could not connect to any of [('127.0.0.1', 10000)]` (или похожая).

</VersionBlock>
