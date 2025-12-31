---
title: "Настройка BigQuery"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища BigQuery в dbt."
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-bigquery'
  min_core_version: 'v0.10.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-bigquery'
  slack_channel_link: 'https://getdbt.slack.com/archives/C99SNSRTK'
  platform_name: 'BigQuery'
  config_page: '/reference/resource-configs/bigquery-configs'
---

<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Обязательные разрешения {#required-permissions}

import BigQueryPerms from '/snippets/_bigquery-permissions.md';

<BigQueryPerms />

## Методы аутентификации {#authentication-methods}

Цели BigQuery могут быть указаны с использованием одного из четырех методов:

1. [OAuth через `gcloud`](#oauth-via-gcloud)
2. [OAuth на основе токена](#oauth-token-based)
3. [Файл service account](#service-account-file)
4. [JSON service account](#service-account-json)

Для локальной разработки мы рекомендуем использовать метод OAuth. Если вы планируете запускать dbt на сервере, следует использовать метод аутентификации через учетную запись службы.

Цели BigQuery должны быть настроены с использованием следующей конфигурации в вашем файле `profiles.yml`. Также вы можете указать ряд [дополнительных конфигураций](#optional-configurations).

### OAuth через gcloud {#oauth-via-gcloud}

Этот метод подключения требует [локального OAuth через `gcloud`](#local-oauth-gcloud-setup).

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
      threads: 4 # Должно быть значением 1 или больше
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>

**Проект по умолчанию**

Если вы не указываете `project`/`database` и используете метод `oauth`, dbt будет использовать проект по умолчанию, связанный с вашим пользователем, как определено в `gcloud config set`.

### На основе OAuth токена {#oauth-token-based}

См. [документацию](https://developers.google.com/identity/protocols/oauth2) о использовании OAuth 2.0 для доступа к Google API.

#### Токен обновления {#refresh-token}

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
      threads: 4 # Должно быть значением 1 или больше
      refresh_token: TOKEN
      client_id: CLIENT_ID
      client_secret: CLIENT_SECRET
      token_uri: REDIRECT_URI
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>

#### Временный токен {#temporary-token}

dbt будет использовать одноразовый токен доступа без дополнительных вопросов. Этот подход имеет смысл, если у вас есть внешний процесс развертывания, который может создавать новые токены доступа и обновлять файл профиля соответствующим образом.

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
      threads: 4 # Должно быть значением 1 или больше
      token: TEMPORARY_ACCESS_TOKEN # обновляется внешним процессом
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>

### Файл учетной записи службы {#service-account-file}

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
      threads: 4 # Должно быть значением 1 или больше
      keyfile: /PATH/TO/BIGQUERY/keyfile.json
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>

### JSON учетной записи службы {#service-account-json}

:::caution Примечание

Этот метод аутентификации рекомендуется только для производственных сред, где использование ключевого файла учетной записи службы непрактично.

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
      threads: 4 # Должно быть значением 1 или больше
      [OPTIONAL_CONFIG](#optional-configurations): VALUE

      # Эти поля берутся из JSON-файла ключа сервисного аккаунта
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

## Дополнительные конфигурации {#optional-configurations}

### Приоритет {#priority}

`priority` для заданий BigQuery, которые выполняет dbt, можно настроить с помощью конфигурации `priority` в вашем профиле BigQuery. Поле `priority` может быть установлено в одно из значений: `batch` или `interactive`. Для получения дополнительной информации о приоритете запросов обратитесь к [документации BigQuery](https://cloud.google.com/bigquery/docs/running-queries).

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

### Тайм-ауты и повторные попытки {#timeouts-and-retries}

Плагин `dbt-bigquery` использует клиентскую библиотеку BigQuery на Python для отправки запросов. Каждый запрос требует двух шагов:
1. Создание задания: Отправка задания запроса в BigQuery и получение его идентификатора.
2. Выполнение задания: Ожидание завершения выполнения задания запроса и получение его результата.

Некоторые запросы неизбежно терпят неудачу на разных этапах процесса. Чтобы справиться с этими случаями, dbt поддерживает <Term id="grain">тонкую настройку</Term> конфигурации для тайм-аутов и повторных попыток запросов.

#### job_execution_timeout_seconds {#jobexecutiontimeout_seconds}

Используйте конфигурацию `job_execution_timeout_seconds`, чтобы установить количество секунд, в течение которых dbt должен ожидать завершения запросов после их успешной отправки. Из четырех конфигураций, управляющих тайм-аутами и повторными попытками, эта является наиболее часто используемой.

:::info Переименованная конфигурация

В более старых версиях `dbt-bigquery` эта же конфигурация называлась `timeout_seconds`.

:::

По умолчанию тайм-аут не установлен. (По историческим причинам некоторые типы запросов используют значение по умолчанию 300 секунд, если конфигурация `job_execution_timeout_seconds` не установлена). Когда вы устанавливаете `job_execution_timeout_seconds`, если любой запрос dbt занимает более 300 секунд для завершения, адаптер dbt-bigquery столкнется с исключением:

```
 Операция не завершена в течение установленного времени ожидания.
```

:::caution Примечание

Параметр `job_execution_timeout_seconds` задаёт количество секунд ожидания для [базового HTTP-транспорта](https://cloud.google.com/python/docs/reference/bigquery/latest/google.cloud.bigquery.job.QueryJob#google_cloud_bigquery_job_QueryJob_result). Он **не** определяет максимально допустимое время выполнения самого задания BigQuery.

Обычно BigQuery продолжает выполнять задание даже после достижения этого таймаута, однако `dbt-bigquery` в этом случае отправит запрос в BigQuery на его отмену.

:::

Вы можете изменить количество секунд тайм-аута для шага выполнения задания, настроив `job_execution_timeout_seconds` в профиле BigQuery:

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

import JobTimeout from '/snippets/_bigquery-timeout.md';

<JobTimeout />

#### job_creation_timeout_seconds {#jobcreationtimeout_seconds}

Также возможно, что задание запроса не удастся отправить с самого начала. Вы можете настроить максимальный тайм-аут для шага создания задания, настроив `job_creation_timeout_seconds`. По умолчанию тайм-аут не установлен.

На этапе создания задания dbt просто отправляет задание запроса в API `Jobs.Insert` BigQuery и получает идентификатор задания запроса в ответ. Это должно занять несколько секунд максимум. В некоторых редких ситуациях это может занять больше времени.

import JobTimeout2 from '/snippets/_bigquery-timeout.md';

<JobTimeout2 />


#### job_retries {#job_retries}

Клиент Python для BigQuery от Google имеет встроенную поддержку повторных попыток выполнения заданий запросов, которые истекли по времени, или запросов, которые столкнулись с временными ошибками и, вероятно, будут успешными при повторном запуске. Вы можете настроить максимальное количество повторных попыток, настроив `job_retries`.

:::info Переименованная конфигурация

В более старых версиях `dbt-bigquery` конфигурация `job_retries` называлась просто `retries`.

:::

Значение по умолчанию равно 1, что означает, что dbt повторит неудачные запросы ровно один раз. Вы можете установить конфигурацию в 0, чтобы полностью отключить повторные попытки.

#### job_retry_deadline_seconds {#jobretrydeadline_seconds}

После того как задание запроса истекло по времени или столкнулось с временной ошибкой, dbt будет ждать одну секунду перед повторной попыткой выполнения того же запроса. В случаях, когда запросы постоянно истекают по времени, это может привести к длительному ожиданию. Вы можете установить конфигурацию `job_retry_deadline_seconds`, чтобы установить общее количество секунд, в течение которых вы готовы ждать ("дедлайн") при повторной попытке выполнения того же запроса. Если dbt достигнет дедлайна, он прекратит попытки и вернет ошибку.

Комбинируя четыре конфигурации выше, мы можем максимизировать наши шансы на смягчение прерывистых ошибок запросов. В примере ниже мы будем ждать до 30 секунд для первоначального создания задания. Затем мы будем ждать до 10 минут (600 секунд) для получения результатов запроса. Если запрос истечет по времени или столкнется с временной ошибкой, мы повторим его до 5 раз. Весь процесс не может занять более 20 минут (1200 секунд). В этот момент dbt выдаст ошибку.

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

### Расположение наборов данных {#dataset-locations}

### Расположение датасетов {#maximum-bytes-billed}

Расположение датасетов BigQuery можно настроить с помощью параметра `location` в профиле BigQuery.
Значение `location` может быть либо мульти-региональным (например, `EU`, `US`), либо региональным (например, `us-west2`), как это описано в [документации BigQuery](https://cloud.google.com/bigquery/docs/locations).
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
      location: US # Опционально, одно из US или EU, или региональное местоположение
```

### Максимальное количество байт для выставления счетов {#oauth-20-scopes-for-google-apis}

Когда значение `maximum_bytes_billed` настроено для профиля BigQuery,
запросы, выполняемые dbt, будут завершаться с ошибкой, если они превышают установленный порог максимального количества байт.
Эта конфигурация должна быть указана как целое число байт.

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      # Если запрос будет выставлять счет более чем за гигабайт данных, то
      # BigQuery отклонит запрос
      maximum_bytes_billed: 1000000000
```

**Пример вывода**

```
Ошибка базы данных в модели debug_table (models/debug_table.sql)
  Запрос превысил лимит для байтов, выставленных на счет: 1000000000. Требуется 2000000000 или больше.
  скомпилированный SQL в target/run/bq_project/models/debug_table.sql
```

### OAuth 2.0 области для Google API {#service-account-impersonation}

По умолчанию, коннектор BigQuery запрашивает три области OAuth, а именно `https://www.googleapis.com/auth/bigquery`, `https://www.googleapis.com/auth/cloud-platform` и `https://www.googleapis.com/auth/drive`. Эти области были изначально добавлены для предоставления доступа к моделям, которые читают из Google Sheets. Однако в некоторых случаях пользователю может потребоваться настроить области по умолчанию (например, чтобы сократить их до минимально необходимого набора). Используя конфигурацию профиля `scopes`, вы можете настроить свои собственные области OAuth для dbt. Пример:

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

### Имитация учетной записи службы {#execution-project}

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

Для общего обзора этого процесса см. официальную документацию по [Созданию краткосрочных учетных данных учетной записи службы](https://cloud.google.com/iam/docs/creating-short-lived-service-account-credentials).

<FAQ path="Warehouse/bq-impersonate-service-account-why" />
<FAQ path="Warehouse/bq-impersonate-service-account-setup" />

### Проект выполнения {#quota-project}

По умолчанию dbt будет использовать указанный `project`/`database` как:
1. Место для материализации ресурсов (моделей, семян, снимков и т.д.), если они не указывают пользовательскую конфигурацию `project`/`database`
2. Проект GCP, который получает счет за стоимость запросов или использование слотов

Опционально, вы можете указать `execution_project` для выставления счетов за выполнение запросов, вместо `project`/`database`, где вы материализуете большинство ресурсов.

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

### Проект квот {#running-python-models-on-bigquery-dataframes}

По умолчанию dbt использует значение `quota_project_id`, указанное в учётных данных аккаунта, с помощью которого вы аутентифицируетесь в BigQuery.

При необходимости вы можете указать параметр `quota_project`, чтобы биллинг выполнения запросов шёл не в проект по умолчанию, заданный в окружении для аккаунта, а в другой проект.

Иногда это требуется при использовании impersonation сервисных аккаунтов, у которых в проекте, где они определены, не включён BigQuery API. Без явного переопределения quota project подключение завершится ошибкой.

Если вы решите указать quota project, аккаунт, используемый для аутентификации, должен иметь роль `Service Usage Consumer` в этом проекте.

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      quota_project: my-bq-quota-project
```

### Запуск моделей Python в DataFrames BigQuery {#running-python-models-on-dataproc}

Для запуска Python-моделей dbt в GCP dbt использует BigQuery DataFrames, которые выполняются напрямую на вычислительных ресурсах BigQuery, используя масштабируемость и производительность BigQuery.

```
my-profile:
  target: dev
  outputs:
    dev:
      compute_region: us-central1
      dataset: my_dataset
      gcs_bucket: dbt-python
      job_execution_timeout_seconds: 300
      job_retries: 1
      location: US
      method: oauth
      priority: interactive
      project: abc-123
      threads: 1
      type: bigquery
```

### Запуск моделей Python в Dataproc

import BigQueryDataproc from '/snippets/_bigquery-dataproc.md';

<BigQueryDataproc />

Затем добавьте имя корзины, имя кластера и регион кластера в ваш профиль подключения:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      
      # для выполнения моделей dbt Python на кластере Dataproc
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
      
      # для выполнения моделей dbt Python на Dataproc Serverless
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

Для полного списка возможных полей конфигурации, которые могут быть переданы в `dataproc_batch`, обратитесь к документации [Dataproc Serverless Batch](https://cloud.google.com/dataproc-serverless/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.Batch).

## Необходимые разрешения {#local-oauth-gcloud-setup}


Чтобы подключиться к BigQuery с использованием метода `oauth`, выполните следующие шаги:

Чтобы подключиться к BigQuery с использованием метода `oauth`, выполните следующие шаги:

1. Убедитесь, что команда `gcloud` [установлена на вашем компьютере](https://cloud.google.com/sdk/downloads)
2. Активируйте учетную запись application-default с помощью:

```shell
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/bigquery,\
https://www.googleapis.com/auth/drive.readonly,\
https://www.googleapis.com/auth/iam.test,\
https://www.googleapis.com/auth/cloud-platform
```

Должно открыться окно браузера, и вам будет предложено войти в свою учетную запись Google. После этого dbt будет использовать ваши учетные данные OAuth для подключения к BigQuery!

Эта команда использует флаг `--scopes` для запроса доступа к Google Sheets. Это позволяет преобразовывать данные в Google Sheets с помощью dbt. Если ваш проект dbt не преобразует данные в Google Sheets, вы можете опустить флаг `--scopes`.
