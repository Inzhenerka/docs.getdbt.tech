---
title: "BigQuery"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища данных BigQuery в dbt."
meta:
  maintained_by: dbt Labs
  authors: 'dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-bigquery'
  min_core_version: 'v0.10.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-bigquery'
  slack_channel_link: 'https://getdbt.slack.com/archives/C99SNSRTK'
  platform_name: 'BigQuery'
  config_page: '/reference/resource-configs/bigquery-configs'
availability: local_free
---

<VersionBlock firstVersion="2.0">

# Подключение BigQuery к <Constant name="fusion" />

Вы можете настроить адаптер BigQuery, выполнив `dbt init` в CLI или вручную создав файл `profiles.yml` с полями, настроенными для выбранного типа аутентификации.

Адаптер BigQuery для <Constant name="fusion" /> поддерживает следующие [методы аутентификации](#supported-authentication-types):
- Сервисный аккаунт (JSON-файл)
- gcloud OAuth
- Workload Identity Federation (Microsoft Entra)

## Разрешения для хранилища данных

import FusionBigQueryWarehousePerms from '/snippets/_v2-warehouse-permissions-bigquery.md';

<FusionBigQueryWarehousePerms />

## Настройка <Constant name="fusion" />

При выполнении `dbt init` в CLI вам будет предложено заполнить следующие поля:
- **Project ID:** Идентификатор проекта BigQuery в GCP
- **Dataset:** Имя схемы
- **Location:** Расположение вашей среды GCP (например, us-east1)

Кроме того, вы можете вручную создать файл `profiles.yml` и настроить его поля. Примеры форматирования приведены в разделе [аутентификации](#supported-authentication-types). Если файл `profiles.yml` уже существует, вы можете сохранить существующие поля или перезаписать их. 

Затем выберите метод аутентификации. Следуйте инструкциям на экране, чтобы указать необходимые сведения.

## Поддерживаемые типы аутентификации {#supported-authentication-types}

<Tabs>

<TabItem value="Service account (JSON file)">

При выборе типа аутентификации **Service account (JSON file)** вам будет предложено указать путь к JSON-файлу. Вы также можете вручную задать этот путь в файле `profiles.yml`.

#### Пример настройки сервисного аккаунта с использованием JSON-файла

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: bigquery
      threads: 16
      database: ABC123
      schema: JAFFLE_SHOP
      method: service-account
      keyfile: /Users/youruser/Downloads/CustomRoleDefinition.json
      location: us-east1
      dataproc_batch: null
```

</File>

</TabItem>

<TabItem value="gcloud OAuth">

Перед выбором этого метода аутентификации необходимо настроить локальную аутентификацию OAuth для gcloud:

#### Настройка локальной аутентификации OAuth для gcloud

1. Убедитесь, что команда `gcloud` [установлена на вашем компьютере](https://cloud.google.com/sdk/downloads).
2. Активируйте учётную запись для учётных данных приложения по умолчанию:

```shell
gcloud auth application-default login \           
  --scopes=https://www.googleapis.com/auth/bigquery,\
https://www.googleapis.com/auth/drive.readonly,\
https://www.googleapis.com/auth/iam.test,\
https://www.googleapis.com/auth/cloud-platform

# Эта команда использует флаг `--scopes` для запроса доступа к Google Sheets. Это позволяет преобразовывать данные в Google Sheets с помощью dbt. Если ваш проект dbt не преобразует данные в Google Sheets, флаг `--scopes` можно опустить.
```

Должно открыться окно браузера с предложением войти в ваш аккаунт Google. После входа dbt будет использовать ваши учётные данные OAuth для подключения к BigQuery.

#### Пример настройки gcloud

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: bigquery
      threads: 16
      database: ABC123
      schema: JAFFLE_SHOP
      method: oauth
      location: us-east1
      dataproc_batch: null

```

</File>

</TabItem>

<TabItem value="Workload Identity Federation (Microsoft Entra)">

Workload Identity Federation (WIF) позволяет проходить аутентификацию в BigQuery с помощью учётных данных, выданных внешним поставщиком удостоверений OAuth &mdash; в настоящее время Microsoft Entra &mdash; без необходимости управлять файлом ключа сервисного аккаунта Google. 

<Constant name="fusion" /> обменивает токен, выданный Entra, на краткосрочные учётные данные Google через [пул удостоверений рабочих нагрузок](https://docs.cloud.google.com/iam/docs/workload-identity-federation#pools) Google Cloud.

Перед выбором этого метода администратор должен настроить в GCP пул удостоверений рабочих нагрузок и поставщика, который доверяет вашему тенанту Entra. Вам потребуется полученный путь к поставщику пула удостоверений рабочих нагрузок.

#### Поля конфигурации
Ниже приведены обязательные и необязательные поля для настройки WIF в файле `profiles.yml`:

<SimpleTable>

| Поле | Обязательное | Описание |
|-------|----------|-------------|
| `method` | Да | Укажите `external-oauth-wif`. |
| `workload_pool_provider_path` | Да | Полный путь к ресурсу поставщика пула удостоверений рабочих нагрузок GCP, который доверяет вашему тенанту Entra. |
| `token_endpoint.type` | Да | Тип внешнего поставщика удостоверений. В настоящее время поддерживается только `entra`. |
| `token_endpoint.request_url` | Да | Конечная точка OAuth в Entra для получения токена. |
| `token_endpoint.request_data` | Да | Тело запроса в формате URL-кодирования, используемое для получения токена Entra (например, `grant_type`, `client_id`, `client_secret` и `scope`). |
| `service_account_impersonation_url` | Нет | URL `generateAccessToken` сервисного аккаунта, от имени которого нужно действовать после федерации, если требуется ограничить доступ к BigQuery разрешениями этого сервисного аккаунта. |

</SimpleTable>

#### Пример настройки WIF в `profiles.yml`
В следующем фрагменте кода приведён пример настройки WIF в файле `profiles.yml`. Обязательно замените значения на свои:

<File name="profiles.yml">

```yaml
default:
  target: dev
  outputs:
    dev:
      type: bigquery
      threads: 16
      database: ABC123
      schema: JAFFLE_SHOP
      method: external-oauth-wif
      location: us-east1
      workload_pool_provider_path: //iam.googleapis.com/projects/123/locations/global/workloadIdentityPools/my-pool/providers/my-provider
      token_endpoint:
        type: entra
        request_url: https://login.microsoftonline.com/TENANT_ID/oauth2/v2.0/token
        request_data: "grant_type=client_credentials&client_id={{ env_var('ENTRA_CLIENT_ID') }}&client_secret={{ env_var('ENTRA_CLIENT_SECRET') }}&scope=SCOPE/.default"
        
      # Необязательно: добавляйте только в том случае, если ваш пул удостоверений рабочих нагрузок не имеет прямого доступа к ресурсам и должен действовать от имени сервисного аккаунта.
      # service_account_impersonation_url: https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/sa@project.iam.gserviceaccount.com:generateAccessToken
```

</File>
</TabItem>
</Tabs>

## Дополнительная информация

Сведения о настройках, специфичных для BigQuery, приведены в [справочном руководстве по адаптеру BigQuery](/reference/resource-configs/bigquery-configs).

</VersionBlock>

<VersionBlock lastVersion="1.99">

# Подключение BigQuery к <Constant name="core" />

Также доступно подключение <ProductCard text="Совместимо с dbt v2" url="/docs/local/connect-data-platform/bigquery-setup?version=2" />.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Предварительные требования

- Установите [Git](https://git-scm.com/install/)
- Установите [Google Cloud SDK](https://docs.cloud.google.com/sdk/docs/install-sdk)
- Используйте Python версии 3.13.x или более ранней. Python 3.14 пока [не поддерживается](/faqs/Core/install-python-compatibility#python-compatibility-matrix)
- Доступ к проекту BigQuery в аккаунте GCP
- Доступ к репозиторию на Git-платформе (например, GitHub, AzureDevOps, GitLab и т. д.)

## Необходимые разрешения {#required-permissions}

import BigQueryPerms from '/snippets/_bigquery-permissions.md';



<BigQueryPerms />

## Методы аутентификации {#authentication-methods}

Цели BigQuery могут быть указаны с использованием одного из четырех методов:

1. [OAuth через `gcloud`](#oauth-via-gcloud)
2. [OAuth на основе токена](#oauth-token-based)
3. [Файл service account](#service-account-file)
4. [JSON service account](#service-account-json)

Для установок dbt в собственной инфраструктуре мы рекомендуем использовать метод OAuth. Если вы запускаете dbt по расписанию на сервере, следует использовать метод аутентификации с помощью сервисного аккаунта.

:::tip Федерация удостоверений рабочих нагрузок (Workload Identity Federation)
Аутентификация WIF (`external-oauth-wif`) доступна в [<Constant name="fusion" />](/docs/local/connect-data-platform/bigquery-setup?version=2.0#supported-authentication-types). Она не поддерживается в dbt версии 1.12 и более ранних.
:::

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

В более ранних версиях `dbt-bigquery` эта же настройка называлась `timeout_seconds`.

Используйте настройку `job_execution_timeout_seconds`, чтобы задать время в секундах, в течение которого dbt должен ожидать завершения запросов после их успешной отправки. Из четырёх настроек, управляющих временем ожидания и повторными попытками, эта используется чаще всего.

<VersionBlock lastVersion="1.11">

Вы можете задать настройку `job_execution_timeout_seconds` в своём профиле BigQuery. Значение, заданное на уровне профиля, становится значением по умолчанию и применяется ко всем запускам.

Например:

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


</VersionBlock>

<VersionBlock firstVersion="1.12">

You can set the `job_execution_timeout_seconds` config in your BigQuery profile. The value set at the profile level becomes the default and applies to all runs. To override this default value, you can set the config individually per model, snapshot, seed, or test.

- Profile-level configuration:

  ```yaml
  my-profile:
    target: dev
    outputs:
      dev:
        type: bigquery
        method: oauth
        project: abc-123
        dataset: my_dataset
        job_execution_timeout_seconds: 600 # 10 minutes
  ```

- Resource-level configuration:

  <Tabs>
  <TabItem value="model" label="Models">

  <File name='my_model.sql'>

  ```sql
  {{ config(job_execution_timeout_seconds=600) }}
  SELECT ...
  ```

  </File>

  <File name='schema.yml'>

  ```yaml
  models:
    - name: my_model
      config:
        job_execution_timeout_seconds: 600
  ```

  </File>

  </TabItem>
  <TabItem value="seeds" label="Seeds">

  ```yaml
  seeds:
    - name: my_seed
      config:
        job_execution_timeout_seconds: 600
  ```

  For seeds, the timeout applies to the SQL that runs after the CSV is uploaded. The upload step uses the profile-level timeout.

  </TabItem>
  <TabItem value="snapshots" label="Snapshots">

  ```yaml
  snapshots:
    - name: my_snapshot
      config:
        job_execution_timeout_seconds: 600
  ```

  </TabItem>
  <TabItem value="tests" label="Tests">

  ```yaml
  models:
    - name: my_model
      columns:
        - name: id
          data_tests:
            - unique:
                config:
                  job_execution_timeout_seconds: 600
  ```

  </TabItem>
  </Tabs>

</VersionBlock>
  
No timeout is set by default. For historical reasons, some query types use a default of 300 seconds when the `job_execution_timeout_seconds` configuration is not set. When you do set the `job_execution_timeout_seconds`, if any dbt query takes more than the configured number of seconds to finish, the `dbt-bigquery` adapter will run into an exception:

```
 Operation did not complete within the designated timeout.
```

:::caution Note

The `job_execution_timeout_seconds` represents the number of seconds to wait for the [underlying HTTP transport](https://cloud.google.com/python/docs/reference/bigquery/latest/google.cloud.bigquery.job.QueryJob#google_cloud_bigquery_job_QueryJob_result). It _doesn't_ represent the maximum allowable time for a BigQuery job itself. 
Normally, BigQuery keeps running the job even if this timeout is reached; however, `dbt-bigquery` will send a request to BigQuery to cancel it.

:::

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

<VersionBlock firstVersion="1.12">

#### job_link_info_level_log {#job_link_info_level_log}

По умолчанию `dbt-bigquery` записывает ссылки на задания BigQuery в журнал на уровне debug, поэтому они отображаются только при запуске dbt с флагом `--debug`. Это может затруднить поиск соответствующего задания в консоли BigQuery.

Чтобы записывать ссылки на задания на уровне info, задайте `job_link_info_level_log: true` в своём профиле BigQuery. 

Если этот параметр включён, ссылки на задания отображаются в журналах dbt, что позволяет быстрее переходить в консоль BigQuery для отладки и мониторинга.

Вы можете настроить `dbt-bigquery` на запись ссылок на задания BigQuery на уровне info, задав `job_link_info_level_log: true` в своём профиле BigQuery. Благодаря этому ссылки на задания отображаются в журналах dbt, что упрощает переход в консоль BigQuery для отладки и мониторинга.

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
      job_link_info_level_log: true
```

</File>
</VersionBlock>

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

### Максимальный объём оплачиваемых данных в байтах

Если для профиля BigQuery задано значение `maximum_bytes_billed`,
запросы, выполняемые dbt, будут завершаться с ошибкой, если объём обрабатываемых ими данных превысит заданный максимальный
порог в байтах. Значение этого параметра должно быть задано целым числом
байтов.

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

### Запуск моделей Python в DataFrames BigQuery {#running-python-models-in-bigquery-dataframes}

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

### Запуск моделей Python в Dataproc {#running-python-models-on-dataproc}

import BigQueryDataproc from '/snippets/_bigquery-dataproc.md';

<BigQueryDataproc />

Поле профиля `submission_method` определяет, как dbt отправляет задания Python-моделей на выполнение. Поддерживаются три значения:

| `submission_method` | Описание |
|---------------------|-------------|
| `serverless` (по умолчанию) | Запускает задания в [Dataproc Serverless](/docs/local/connect-data-platform/bigquery-setup#dataproc-serverless) без необходимости управлять кластером |
| `cluster` | Запускает задания в существующем [кластере Dataproc](/docs/local/connect-data-platform/bigquery-setup#dataproc-cluster) |
| `bigframes` | Запускает задания с помощью [BigQuery DataFrames](/docs/local/connect-data-platform/bigquery-setup#bigframes). Настройка Spark не требуется |

#### Кластер Dataproc

Добавьте имя бакета, имя кластера и регион кластера в профиль подключения:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
# для запуска Python-моделей dbt в кластере Dataproc
      submission_method: cluster
      gcs_bucket: dbt-python
      dataproc_cluster_name: dbt-python
      dataproc_region: us-central1
```

#### Dataproc Serverless

Dataproc Serverless — это метод отправки заданий (`submission_method`) по умолчанию. Он не требует управления кластерами и поддерживает необязательную настройку пакетных заданий:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
# для запуска Python-моделей dbt в Dataproc Serverless
      submission_method: serverless
      gcs_bucket: dbt-python
      dataproc_region: us-central1
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

#### BigFrames

[BigQuery DataFrames](https://cloud.google.com/bigquery/docs/bigquery-dataframes-introduction) позволяет запускать модели Python с помощью API непосредственно в BigQuery без настройки Spark. Полные инструкции по настройке см. в руководстве [Модели Python в dbt с BigFrames](/guides/dbt-python-bigframes).

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset

      # для запуска моделей Python в dbt с помощью BigQuery DataFrames
      submission_method: bigframes
      gcs_bucket: dbt-python
      dataproc_region: us-central1
```

### Резервирование {#reservation}

Если в вашей организации настроены резервирования BigQuery Reservations, вы можете указать параметр `reservation`, чтобы dbt использовал соответствующее резервирование для выполнения запросов.

Это применяется ко всем заданиям для целевого окружения. Чтобы переопределить резервирование для конкретной модели или набора моделей, используйте [конфигурацию модели `reservation`](/reference/resource-configs/bigquery-configs#using-reservations).

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      reservation: projects/abc-admin/locations/US/reservations/my-reservation
```

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

Эта команда использует флаг `--scopes` для запроса доступа к Google Sheets. Это позволяет преобразовывать данные в Google Sheets с помощью dbt. Если ваш проект dbt не преобразует данные в Google Sheets, вы можете не указывать флаг `--scopes`.

</VersionBlock>
