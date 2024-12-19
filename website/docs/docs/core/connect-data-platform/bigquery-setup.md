---
title: "Настройка BigQuery"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища BigQuery в dbt."
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-bigquery'
  pypi_package: 'dbt-bigquery'
  min_core_version: 'v0.10.0'
  cloud_support: Поддерживается
  min_supported_version: 'n/a'
  slack_channel_name: '#db-bigquery'
  slack_channel_link: 'https://getdbt.slack.com/archives/C99SNSRTK'
  platform_name: 'BigQuery'
  config_page: '/reference/resource-configs/bigquery-configs'
---

<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Методы аутентификации

Цели BigQuery могут быть указаны с использованием одного из четырех методов:

1. [OAuth через `gcloud`](#oauth-via-gcloud)
2. [На основе токена OAuth](#oauth-token-based)
3. [файл учетной записи службы](#service-account-file)
4. [json учетной записи службы](#service-account-json)

Для локальной разработки мы рекомендуем использовать метод OAuth. Если вы планируете запускать dbt на сервере, вместо этого следует использовать метод аутентификации с учетной записью службы.

Цели BigQuery должны быть настроены с использованием следующей конфигурации в вашем файле `profiles.yml`. Также вы можете указать ряд [необязательных конфигураций](#optional-configurations).

### OAuth через gcloud

Этот метод подключения требует [локальной аутентификации OAuth через `gcloud`](#local-oauth-gcloud-setup).

<File name='~/.dbt/profiles.yml'>

```yaml
# Обратите внимание, что требуется только одна из этих целей

my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: GCP_PROJECT_ID
      dataset: DBT_DATASET_NAME # Вы также можете использовать "schema" здесь
      threads: 4 # Должно быть значение 1 или больше 
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>

**Проект по умолчанию**

Если вы не укажете `project`/`database` и используете метод `oauth`, dbt будет использовать проект по умолчанию, связанный с вашим пользователем, как определено в `gcloud config set`.

### На основе токена OAuth

Смотрите [документацию](https://developers.google.com/identity/protocols/oauth2) о том, как использовать OAuth 2.0 для доступа к Google API.

#### Токен обновления

Используя токен обновления и информацию о клиенте, dbt будет создавать новые токены доступа по мере необходимости.

<File name='~/.dbt/profiles.yml'>

```yaml
my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth-secrets
      project: GCP_PROJECT_ID
      dataset: DBT_DATASET_NAME # Вы также можете использовать "schema" здесь
      threads: 4 # Должно быть значение 1 или больше
      refresh_token: TOKEN
      client_id: CLIENT_ID
      client_secret: CLIENT_SECRET
      token_uri: REDIRECT_URI
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>

#### Временный токен

dbt будет использовать одноразовый токен доступа без дополнительных вопросов. Этот подход имеет смысл, если у вас есть внешний процесс развертывания, который может создавать новые токены доступа и обновлять файл профиля соответственно.

<File name='~/.dbt/profiles.yml'>

```yaml
my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth-secrets
      project: GCP_PROJECT_ID
      dataset: DBT_DATASET_NAME # Вы также можете использовать "schema" здесь
      threads: 4 # Должно быть значение 1 или больше
      token: TEMPORARY_ACCESS_TOKEN # обновляется + обновляется внешним процессом
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>

### Файл учетной записи службы

<File name='~/.dbt/profiles.yml'>

```yaml
my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: service-account
      project: GCP_PROJECT_ID
      dataset: DBT_DATASET_NAME
      threads: 4 # Должно быть значение 1 или больше
      keyfile: /PATH/TO/BIGQUERY/keyfile.json
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>

### JSON учетной записи службы

:::caution Примечание

Этот метод аутентификации рекомендуется только для производственных сред, где использование файла ключа учетной записи службы непрактично.

:::

<File name='~/.dbt/profiles.yml'>

```yaml
my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: service-account-json
      project: GCP_PROJECT_ID
      dataset: DBT_DATASET_NAME
      threads: 4 # Должно быть значение 1 или больше
      [OPTIONAL_CONFIG](#optional-configurations): VALUE

      # Эти поля берутся из файла ключа учетной записи службы в формате json
      keyfile_json:
        type: xxx
        project_id: xxx
        private_key_id: xxx
        private_key: xxx
        client_email: xxx
        client_id: xxx
        auth_uri: xxx
        token_uri: xxx
        auth_provider_x509_cert_url: xxx
        client_x509_cert_url: xxx

```

</File>

## Необязательные конфигурации

### Приоритет

`priority` для заданий BigQuery, которые выполняет dbt, можно настроить с помощью конфигурации `priority` в вашем профиле BigQuery. Поле `priority` может быть установлено на одно из значений `batch` или `interactive`. Для получения дополнительной информации о приоритете запросов обратитесь к [документации BigQuery](https://cloud.google.com/bigquery/docs/running-queries).

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      priority: interactive
```

### Таймауты и повторы

Плагин `dbt-bigquery` использует библиотеку клиента Python BigQuery для отправки запросов. Каждый запрос требует двух этапов:
1. Создание задания: отправка задания запроса в BigQuery и получение его идентификатора задания.
2. Выполнение задания: ожидание завершения выполнения задания запроса и получение его результата.

Некоторые запросы неизбежно терпят неудачу на разных этапах процесса. Чтобы справиться с этими случаями, dbt поддерживает <Term id="grain">тонкую</Term> настройку таймаутов и повторов запросов.

#### job_execution_timeout_seconds

Используйте конфигурацию `job_execution_timeout_seconds`, чтобы установить количество секунд, которые dbt должен ждать завершения запросов после их успешной отправки. Из четырех конфигураций, которые контролируют таймауты и повторы, эта является наиболее распространенной.

:::info Переименованная конфигурация

В более ранних версиях `dbt-bigquery` эта же конфигурация называлась `timeout_seconds`.

:::

По умолчанию таймаут не установлен. (По историческим причинам некоторые типы запросов используют значение по умолчанию 300 секунд, если конфигурация `job_execution_timeout_seconds` не установлена). Когда вы устанавливаете `job_execution_timeout_seconds`, если какой-либо запрос dbt занимает более 300 секунд для завершения, адаптер dbt-bigquery вызовет исключение:

```
 Операция не завершилась в установленный таймаут.
```

:::caution Примечание

`job_execution_timeout_seconds` представляет собой количество секунд, которые нужно ждать для [основного HTTP-транспорта](https://cloud.google.com/python/docs/reference/bigquery/latest/google.cloud.bigquery.job.QueryJob#google_cloud_bigquery_job_QueryJob_result). Это _не_ представляет собой максимальное допустимое время для самого задания BigQuery. Таким образом, если dbt-bigquery столкнется с исключением на 300 секундах, фактическое задание BigQuery все еще может выполняться в течение времени, установленного в собственных настройках таймаута BigQuery.

:::

Вы можете изменить количество секунд таймаута для этапа выполнения задания, настроив `job_execution_timeout_seconds` в профиле BigQuery:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      job_execution_timeout_seconds: 600 # 10 минут
```

#### job_creation_timeout_seconds

Также возможно, что задание запроса не удастся отправить с самого начала. Вы можете настроить максимальный таймаут для этапа создания задания, настроив `job_creation_timeout_seconds`. По умолчанию таймаут не установлен.

На этапе создания задания dbt просто отправляет задание запроса в API `Jobs.Insert` BigQuery и получает идентификатор задания запроса в ответ. Это должно занять не более нескольких секунд. В некоторых редких ситуациях это может занять больше времени.

#### job_retries

Клиент Python BigQuery от Google имеет встроенную поддержку повторных попыток для заданий запросов, которые истекают по времени, или запросов, которые сталкиваются с временными ошибками и, вероятно, будут успешными при повторном запуске. Вы можете настроить максимальное количество повторов, настроив `job_retries`.

:::info Переименованная конфигурация

В более ранних версиях `dbt-bigquery` конфигурация `job_retries` просто называлась `retries`.

:::

Значение по умолчанию равно 1, что означает, что dbt повторит неудачные запросы ровно один раз. Вы можете установить конфигурацию в 0, чтобы полностью отключить повторы.

#### job_retry_deadline_seconds

После того как задание запроса истекает по времени или сталкивается с временной ошибкой, dbt будет ждать одну секунду перед повторной попыткой того же запроса. В случаях, когда запросы постоянно истекают по времени, это может привести к длительному ожиданию. Вы можете установить конфигурацию `job_retry_deadline_seconds`, чтобы установить общее количество секунд, которые вы готовы ждать ("срок"), пока повторяете тот же запрос. Если dbt достигнет срока, он сдается и возвращает ошибку.

Объединив четыре вышеуказанные конфигурации, мы можем максимизировать наши шансы на смягчение периодических ошибок запросов. В приведенном ниже примере мы будем ждать до 30 секунд для первоначального создания задания. Затем мы будем ждать до 10 минут (600 секунд) для получения результатов запроса. Если запрос истекает по времени или сталкивается с временной ошибкой, мы повторим его до 5 раз. Весь процесс не может занять более 20 минут (1200 секунд). В этот момент dbt вызовет ошибку.

<File name='profiles.yml'>

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      job_creation_timeout_seconds: 30
      job_execution_timeout_seconds: 600
      job_retries: 5
      job_retry_deadline_seconds: 1200

```

</File>

### Местоположения наборов данных

Местоположение наборов данных BigQuery можно настроить с помощью конфигурации `location` в профиле BigQuery. `location` может быть либо много региональным местоположением (например, `EU`, `US`), либо региональным местоположением (например, `us-west2`), как описано в [документации BigQuery](https://cloud.google.com/bigquery/docs/locations).
Пример:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      location: US # Необязательно, одно из US или EU, или региональное местоположение
```

### Максимальные выставленные счета в байтах

Когда для профиля BigQuery настроено значение `maximum_bytes_billed`, запросы, выполняемые dbt, будут завершаться с ошибкой, если они превышают установленный максимальный порог в байтах. Эта конфигурация должна быть указана в виде целого числа байтов.

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      # Если запрос будет выставлен более чем за гигабайт данных, то
      # BigQuery отклонит запрос
      maximum_bytes_billed: 1000000000
```

**Пример вывода**

```
Ошибка базы данных в модели debug_table (models/debug_table.sql)
  Запрос превысил лимит по выставленным счетам: 1000000000. Требуется 2000000000 или больше.
  скомпилированный SQL в target/run/bq_project/models/debug_table.sql
```

### OAuth 2.0 области для Google API

По умолчанию коннектор BigQuery запрашивает три области OAuth, а именно `https://www.googleapis.com/auth/bigquery`, `https://www.googleapis.com/auth/cloud-platform` и `https://www.googleapis.com/auth/drive`. Эти области были изначально добавлены для предоставления доступа к моделям, которые читают данные из Google Sheets. Однако в некоторых случаях пользователю может потребоваться настроить области по умолчанию (например, чтобы сократить их до минимально необходимых). Используя конфигурацию профиля `scopes`, вы можете настроить свои собственные области OAuth для dbt. Пример:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      scopes:
        - https://www.googleapis.com/auth/bigquery
```

### Имитация учетной записи службы

Эта функция позволяет пользователям, аутентифицирующимся через локальный OAuth, получать доступ к ресурсам BigQuery на основе разрешений учетной записи службы.

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      impersonate_service_account: dbt-runner@yourproject.iam.gserviceaccount.com
```

Для общего обзора этого процесса смотрите официальную документацию по [Созданию краткосрочных учетных данных учетной записи службы](https://cloud.google.com/iam/docs/creating-short-lived-service-account-credentials).

<FAQ path="Warehouse/bq-impersonate-service-account-why" />
<FAQ path="Warehouse/bq-impersonate-service-account-setup" />

### Исполнительный проект

По умолчанию dbt будет использовать указанный `project`/`database` как:
1. Место для материализации ресурсов (моделей, семян, снимков и т. д.), если они не указывают пользовательскую конфигурацию `project`/`database`
2. Проект GCP, который получает счет за затраты на запросы или использование слотов

При желании вы можете указать `execution_project`, чтобы выставлять счета за выполнение запросов, вместо `project`/`database`, где вы материализуете большинство ресурсов.

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      execution_project: buck-stops-here-456
```

### Запуск моделей Python на Dataproc

import BigQueryDataproc from '/snippets/_bigquery-dataproc.md';

<BigQueryDataproc />

Затем добавьте имя ведра, имя кластера и регион кластера в ваш профиль подключения:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      
      # для запуска моделей Python dbt на кластере Dataproc
      gcs_bucket: dbt-python
      dataproc_cluster_name: dbt-python
      dataproc_region: us-central1
```

В качестве альтернативы можно использовать Dataproc Serverless:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      
      # для запуска моделей Python dbt на Dataproc Serverless
      gcs_bucket: dbt-python
      dataproc_region: us-central1
      submission_method: serverless
      dataproc_batch:
        batch_id: MY_CUSTOM_BATCH_ID # Поддерживается в v1.7+
        environment_config:
          execution_config:
            service_account: dbt@abc-123.iam.gserviceaccount.com
            subnetwork_uri: regions/us-central1/subnetworks/dataproc-dbt
        labels:
          project: my-project
          role: dev
        runtime_config:
          properties:
            spark.executor.instances: "3"
            spark.driver.memory: 1g
```

Для полного списка возможных полей конфигурации, которые можно передать в `dataproc_batch`, обратитесь к документации [Dataproc Serverless Batch](https://cloud.google.com/dataproc-serverless/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.Batch).

## Необходимые разрешения

Модель разрешений BigQuery отличается от более традиционных баз данных, таких как Snowflake и Redshift. Для учетных записей пользователей dbt требуются следующие разрешения:
- Редактор данных BigQuery
- Пользователь BigQuery

Этот набор разрешений позволит пользователям dbt читать и создавать таблицы и <Term id="view">представления</Term> в проекте BigQuery.

## Настройка локального OAuth gcloud

Чтобы подключиться к BigQuery, используя метод `oauth`, выполните следующие шаги:

1. Убедитесь, что команда `gcloud` [установлена на вашем компьютере](https://cloud.google.com/sdk/downloads)
2. Активируйте учетную запись по умолчанию приложения с помощью

```shell
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/bigquery,\
https://www.googleapis.com/auth/drive.readonly,\
https://www.googleapis.com/auth/iam.test
```

Должно открыться окно браузера, и вам будет предложено войти в свою учетную запись Google. После этого dbt будет использовать ваши учетные данные OAuth для подключения к BigQuery!

Эта команда использует флаг `--scopes`, чтобы запросить доступ к Google Sheets. Это позволяет преобразовывать данные в Google Sheets с помощью dbt. Если ваш проект dbt не преобразует данные в Google Sheets, вы можете опустить флаг `--scopes`.