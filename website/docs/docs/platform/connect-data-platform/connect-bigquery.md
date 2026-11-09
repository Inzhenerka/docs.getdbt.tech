---
title: "Подключение BigQuery"
id: connect-bigquery
description: "Настройка подключения к BigQuery."
sidebar_label: "Подключение к BigQuery"
availability:
  surface: platform
  access: login_required
---

# Подключение к BigQuery <ProductCard text="Совместимо с dbt v2" />

Чтобы узнать, какие функции BigQuery поддерживаются в <Constant name="fusion"/> в режиме `strict`, см. [Поддержка функций BigQuery](/reference/resource-configs/bigquery-function-support).

## Необходимые разрешения {#required-permissions}

import BigQueryPerms from '/snippets/_bigquery-permissions.md';

<BigQueryPerms />

## Права доступа к хранилищу данных для <Constant name="fusion" />

import FusionBigQueryWarehousePerms from '/snippets/_v2-warehouse-permissions-bigquery.md';

<FusionBigQueryWarehousePerms />

## Аутентификация

<Constant name="dbt" /> поддерживает различные методы аутентификации в зависимости от вашей среды и тарифного плана:

- Окружения для разработки поддерживают:
    - Service JSON
    - BigQuery OAuth <Lifecycle status="managed" />
- Окружения для деплоя поддерживают: 
    - Service JSON
    - BigQuery Workload Identity Federation (WIF) <Lifecycle status="managed" />

Эти методы аутентификации настраиваются в [глобальных настройках подключений учетной записи](/docs/platform/connect-data-platform/about-connections), а не в настройках единого входа или интеграций.

При создании нового подключения BigQuery вам будет предложено два варианта схемы подключения (оба используют один и тот же адаптер):

- **BigQuery:** Поддерживает все типы подключений (используйте этот вариант)
- **BigQuery (Legacy):**  Поддерживает все типы подключений, кроме WIF (устаревшая функция. Не используйте.)

Для всех новых подключений следует выбирать **BigQuery**, поскольку вариант **BigQuery (Legacy)** будет выведен из эксплуатации. Чтобы обновить существующие подключения и учетные данные в окружении для использования нового варианта BigQuery, сначала удалите конфигурации с помощью [API](/docs/dbt-apis/admin-api).

### JSON keyfile {#json-keyfile}

:::info Загрузка JSON ключевого файла учетной записи службы

Хотя поля в подключении BigQuery можно заполнить вручную, мы рекомендуем загрузить keyfile сервисного аккаунта <Term id="json" />, чтобы быстро и корректно настроить подключение к BigQuery.

Вы можете предоставить JSON ключевой файл в одном из двух форматов:

- **JSON keyfile upload** &mdash; Загрузите keyfile напрямую в его стандартном формате JSON.
- **Base64-encoded string** &mdash; Укажите keyfile в виде строки, закодированной в base64. При предоставлении строки в формате base64 dbt автоматически декодирует её и заполняет необходимые поля.

:::

Опция **JSON keyfile** доступна для настройки как **development**, так и **deployment** окружений.

Загрузка корректного JSON keyfile заполнит следующие поля:
- Project ID
- Private key ID
- Private key
- Client email
- Client ID
- Auth URI
- Token URI
- Auth provider x509 cert url
- Client x509 cert url

В дополнение к этим полям, в подключении BigQuery можно настроить ещё два необязательных поля:

| Поле | Описание | Примеры |
| ----- | ----------- | ------- |
| Timeout | Устарело; существует для обратной совместимости с более старыми версиями dbt и будет удалено в будущем. | `300` |
| Location | [Местоположение](https://cloud.google.com/bigquery/docs/locations), где dbt должен создавать наборы данных. | `US`, `EU` |

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/bigquery-connection.png" title="A valid BigQuery connection"/>

### BigQuery OAuth {#bigquery-oauth}
**Доступно в:** средах разработки, только в планах Enterprise

Метод аутентификации OAuth позволяет <Constant name="dbt" /> выполнять запросы от имени пользователя BigQuery или рабочей нагрузки без хранения файла ключа сервисного аккаунта BigQuery в <Constant name="dbt" />. Однако для завершения настройки в dbt Cloud по-прежнему необходимо предоставить JSON или заполнить поля вручную. Чтобы обойти это требование, необязательно указывать реальные значения (например, можно указать `N/A`). Подробнее о первоначальной настройке подключения к BigQuery через OAuth в <Constant name="dbt" />> см. в [документации по настройке BigQuery OAuth](/docs/platform/manage-access/set-up-bigquery-oauth).

Если ваша организация настроила BigQuery OAuth, вы как конечный пользователь можете связать проект со своим личным аккаунтом BigQuery в своём профиле в <Constant name="dbt" />.

### Федерация удостоверений рабочей нагрузки BigQuery <Lifecycle status="managed, preview" /> {#bigquery-workload-identity-federation}

:::note

Если вы используете BigQuery WIF, рекомендуем использовать его вместе с BigQuery OAuth. В противном случае необходимо создать два подключения — одно с service JSON и одно с WIF, чтобы использовать service JSON в средах разработки.
:::

**Доступно в:** средах развертывания

Метод аутентификации BigQuery WIF позволяет <Constant name="dbt" /> выполнять запросы при развертывании от имени сервисного аккаунта без настройки файла ключа сервисного аккаунта BigQuery в <Constant name="dbt" />. Дополнительную информацию о первоначальной настройке подключения BigQuery WIF в <Constant name="dbt" /> см. в разделе [Настройка Workload Identity Federation для BigQuery](/docs/platform/manage-access/set-up-bigquery-oauth#set-up-bigquery-workload-identity-federation-).

Чтобы узнать, как оптимизировать производительность с помощью конфигураций, специфичных для конкретной платформы данных, в <Constant name="cloud" />, обратитесь к разделу [BigQuery-specific configuration](/reference/resource-configs/bigquery-configs).

Чтобы узнать, как оптимизировать производительность с помощью настроек для конкретной платформы данных в <Constant name="dbt" />, обратитесь к разделу [Настройки для BigQuery](/reference/resource-configs/bigquery-configs).

В BigQuery необязательные конфигурации позволяют настроить параметры для таких задач, как приоритет запросов, местоположение набора данных, время ожидания выполнения задания и многое другое. Эти опции дают вам больший контроль над тем, как BigQuery работает за кулисами, чтобы соответствовать вашим требованиям.

Чтобы настроить дополнительные параметры в <Constant name="cloud" />:

Чтобы настроить необязательные параметры конфигурации в <Constant name="dbt" />:

<Lightbox src="/img/bigquery/bigquery-optional-config.png" width="70%" title="Необязательная конфигурация BigQuery"/>

Ниже перечислены необязательные параметры конфигурации, которые вы можете задать в <Constant name="cloud" />:

Ниже перечислены необязательные параметры конфигурации, которые можно задать в <Constant name="dbt" />:

| Параметр конфигурации    | <div style={{width:'250'}}>Информация</div>   | Тип    | <div style={{width:'150'}}>Пример</div>             |
|---------------------------|-----------------------------------------|---------|--------------------|
| [Priority](#priority)             | Задаёт приоритет заданий BigQuery (либо `interactive`, либо постановка в очередь для обработки в режиме `batch`) | String  | `batch` or `interactive`    |
| [Retries](#retries)               | Определяет количество повторных попыток для заданий, завершившихся неудачно из‑за временных проблем             | Integer | `3`                         |
| [Location](#location)             | Регион для создания новых наборов данных                                   | String  | `US`, `EU`, `us-west2`      |
| [Maximum bytes billed](#maximum-bytes-billed) | Ограничивает максимальное количество байт, за которые может быть выставлен счёт при выполнении запроса | Integer | `1000000000`                |
| [Execution project](#execution-project) | Указывает идентификатор проекта, на который будет выставляться счёт за выполнение запроса | String  | `my-project-id`             |
| [Impersonate service account](#impersonate-service-account) | Позволяет пользователям, аутентифицированным локально, получать доступ к ресурсам BigQuery от имени указанного сервисного аккаунта | String  | `service-account@project.iam.gserviceaccount.com` |
| [Job retry deadline seconds](#job-retry-deadline-seconds) | Задаёт общее количество секунд, в течение которых BigQuery будет пытаться повторно выполнить задание при сбое | Integer | `600`                       |
| [Job creation timeout seconds](#job-creation-timeout-seconds) | Определяет максимальный таймаут для этапа создания задания                     | Integer | `120`                       |
| [Google cloud storage-bucket](#google-cloud-storage-bucket) | Расположение для хранения объектов в Google Cloud Storage                      | String  | `my-bucket`                 |
| [Dataproc region](#dataproc-region) | Указывает облачный регион для запуска заданий обработки данных                 | String  | `US`, `EU`, `asia-northeast1` |
| [Dataproc cluster name](#dataproc-cluster-name) | Назначает уникальный идентификатор группе виртуальных машин в Dataproc         | String  | `my-cluster`                |
| [Notebook Template ID](#notebook-template-id) | Уникальный идентификатор среды выполнения ноутбука Colab Enterprise            | Integer | `7018811640745295872`       |
| [Compute Region](#compute-region) | Указывает регион вычислительных ресурсов                                      | String  | `US`, `EU`, `asia-northeast1` |

<Expandable alt_header="Priority">

`priority` для заданий BigQuery, которые выполняет dbt, можно настроить с помощью конфигурации `priority` в вашем профиле BigQuery. Поле приоритета может быть установлено в `batch` или `interactive`. Для получения дополнительной информации о приоритете запросов обратитесь к [документации BigQuery](https://cloud.google.com/bigquery/docs/running-queries).

</Expandable>

<Expandable alt_header="Retries">

Повторные попытки в BigQuery помогают гарантировать успешное завершение заданий, повторяя их после временных сбоев, делая ваши операции более надежными и устойчивыми.

</Expandable>

<Expandable alt_header="Location">

`location` наборов данных BigQuery можно установить с помощью настройки `location` в профиле BigQuery. Согласно [документации BigQuery](https://cloud.google.com/bigquery/docs/locations), `location` может быть либо многорегиональным местоположением (например, `EU`, `US`), либо региональным местоположением (например, `us-west2`).

</Expandable>

<Expandable alt_header="Maximum bytes billed">

Значение `maximum_bytes_billed`, заданное в профиле BigQuery, позволяет ограничить объём данных, который может обработать ваш запрос. Это защитная мера, предотвращающая случайную обработку большего объёма данных, чем вы ожидаете, что могло бы привести к увеличению затрат. Запросы, выполняемые dbt, завершатся с ошибкой, если превысят установленный предел количества байтов. Значение этого параметра необходимо указывать как целое число байтов.

Если значение `maximum_bytes_billed` равно 1000000000, укажите его в поле `maximum_bytes_billed` в <Constant name="dbt" />.

Если ваш `maximum_bytes_billed` равен 1000000000, вы должны ввести это значение в поле `maximum_bytes_billed` в dbt cloud.

</Expandable>

<Expandable alt_header="Execution project">

По умолчанию dbt будет использовать указанный `project`/`database` как:

1. Место для материализации ресурсов (моделей, семян, снимков и т.д.), если они не указывают пользовательскую конфигурацию проекта/базы данных
2. Проект GCP, который получает счет за стоимость запросов или использование слотов

При необходимости вы можете указать проект выполнения для выставления счетов за выполнение запросов, вместо проекта/базы данных, где вы материализуете большинство ресурсов.

</Expandable>

<Expandable alt_header="Impersonate service account">

Эта функция позволяет пользователям, аутентифицирующимся с использованием локального OAuth, получать доступ к ресурсам BigQuery на основе разрешений учетной записи службы.

Для общего обзора этого процесса см. официальную документацию по [Созданию краткосрочных учетных данных учетной записи службы](https://cloud.google.com/iam/docs/create-short-lived-credentials-direct).

</Expandable>

<Expandable alt_header="Job retry deadline seconds">

Job retry deadline seconds — это максимальное время, которое BigQuery потратит на повторные попытки выполнения задания, прежде чем оно будет прекращено.

</Expandable>

<Expandable alt_header="Job creation timeout seconds">

Job creation timeout seconds — это максимальное время, которое BigQuery будет ждать для начала выполнения задания. Если задание не начнется в течение этого времени, оно будет прервано.

import JobTimeout from '/snippets/_bigquery-timeout.md';

<JobTimeout />


</Expandable>

#### Запуск моделей dbt на Python в Google Cloud Platform {#run-dbt-python-models-on-google-cloud-platform}

import BigQueryDataproc from '/snippets/_bigquery-dataproc.md';

<BigQueryDataproc />

<Expandable alt_header="Google cloud storage bucket">

Все, что вы храните в Cloud Storage, должно быть размещено внутри [bucket](https://cloud.google.com/storage/docs/buckets). Buckets помогают вам организовать ваши данные и управлять доступом к ним.

</Expandable>

<Expandable alt_header="Dataproc region">

Назначенное местоположение в облаке, где вы можете эффективно выполнять свои задания по обработке данных. Этот регион должен совпадать с местоположением вашего набора данных BigQuery, если вы хотите использовать Dataproc с BigQuery, чтобы гарантировать, что данные не перемещаются между регионами, что может быть неэффективным и дорогостоящим.

Для получения дополнительной информации о [регионах Dataproc](https://cloud.google.com/bigquery/docs/locations) обратитесь к документации BigQuery.

</Expandable>

<Expandable alt_header="Dataproc cluster name">

Уникальная метка, которую вы присваиваете вашей группе виртуальных машин, чтобы помочь вам идентифицировать и управлять вашими задачами по обработке данных в облаке. Когда вы интегрируете Dataproc с BigQuery, вам нужно предоставить имя кластера, чтобы BigQuery знал, какой конкретный набор ресурсов (кластер) использовать для выполнения заданий по обработке данных.

Ознакомьтесь с [документом Dataproc о создании кластера](https://cloud.google.com/dataproc/docs/guides/create-cluster) для обзора работы кластеров.

</Expandable>

<Expandable alt_header="Notebook Template ID">

Уникальный идентификатор, связанный с конкретным ноутбуком Colab, который выступает в роли Python-рантайма для BigQuery DataFrames.

</Expandable>

<Expandable alt_header="Compute Region">

Этот регион должен совпадать с местоположением вашего датасета BigQuery, если вы хотите использовать BigQuery DataFrames. Также убедитесь, что среда выполнения Colab находится в том же регионе.

</Expandable>

### Подключения и управление учетными данными на уровне аккаунта {#account-level-connections-and-credential-management}

Вы можете повторно использовать подключения в нескольких проектах с помощью [глобальных подключений](/docs/platform/connect-data-platform/about-connections#migration-from-project-level-connections-to-account-level-connections). Подключения привязываются на уровне окружения (ранее — на уровне проекта), поэтому в одном проекте можно использовать несколько подключений (для разработки, staging, production и других задач).

В настоящее время подключения BigQuery в <Constant name="dbt" /> предполагают управление учетными данными на уровне подключения (это относится только к подключениям BigQuery). Изначально такой подход был разработан, чтобы упростить создание нового подключения путем загрузки файла ключа сервисного аккаунта. Здесь описано, как переопределить эти учетные данные с помощью [расширенных атрибутов](/docs/dbt-platform-environments#extended-attributes), _чтобы администраторы проектов могли управлять учетными данными независимо_ от параметров подключения на уровне аккаунта. Информацию о том, где настроить эти атрибуты для окружений развертывания и разработки, см. в разделе [Расширенные атрибуты](/docs/dbt-platform-environments#extended-attributes).

В этом разделе описывается, как переопределить учетные данные на уровне окружения с помощью [extended attributes](/docs/dbt-platform-environments#extended-attributes), _чтобы администраторы проекта могли управлять учетными данными независимо_ от параметров подключения на уровне аккаунта, используемых для данного окружения.

Для проекта вы сначала создадите переменную среды для хранения секретного значения `private_key`. Затем вы используете расширенные атрибуты, чтобы переопределить весь JSON учетной записи службы (вы не можете переопределить только секретный ключ из-за ограничения расширенных атрибутов).

1. **Новая переменная среды**

Чтобы автоматизировать развертывание, используйте следующий [запрос к API администрирования](/dbt-cloud/api-v3#/operations/Create%20Projects%20Environment%20Variables%20Bulk), где `XXXXX` — номер вашей учетной записи, `YYYYY` — номер вашего проекта, `ZZZZZ` — ваш [API-токен](/docs/dbt-apis/authentication):

    ```shell
    curl --request POST \
    --url https://cloud.getdbt.com/api/v3/accounts/XXXXX/projects/YYYYY/environment-variables/bulk/ \
    --header 'Accept: application/json' \
    --header 'Authorization: Bearer ZZZZZ' \
    --header 'Content-Type: application/json' \
    --data '{
    "env_var": [
    {
        "new_name": "DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY",
        "project": "Value by default for the entire project",
        "ENVIRONMENT_NAME_1": "Optional, if wanted, value for environment name 1",
        "ENVIRONMENT_NAME_2": "Optional, if wanted, value for environment name 2"
    }
    ]
    }'
    ```

2. **Расширенные атрибуты**

Заполните блок [расширенных атрибутов](/docs/dbt-platform-environments#extended-attributes) следующим содержимым (заменив `XXX` соответствующими значениями). На этой странице объясняется, где настроить их для сред развертывания и разработки:

    ```yaml
    keyfile_json:
      type: service_account
      project_id: xxx
      private_key_id: xxx
      private_key: '{{ env_var(''DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY'') }}'
      client_email: xxx
      client_id: xxx
      auth_uri: xxx
      token_uri: xxx
      auth_provider_x509_cert_url: xxx
      client_x509_cert_url: xxx
    ```

Если вам нужно переопределить [другие поля](/docs/local/connect-data-platform/bigquery-setup?version=1.12#service-account-json) на уровне окружения с помощью расширенных атрибутов, соблюдайте [требуемые отступы](/docs/dbt-platform-environments#extended-attributes) (порядок не имеет значения):

    ```yaml
    priority: interactive
    keyfile_json:
      type: xxx
      project_id: xxx
      private_key_id: xxx
      private_key: '{{ env_var(''DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY'') }}'
      client_email: xxx
      client_id: xxx
      auth_uri: xxx
      token_uri: xxx
      auth_provider_x509_cert_url: xxx
      client_x509_cert_url: xxx
    execution_project: buck-stops-here-456
    ```

Чтобы автоматизировать развертывание, сначала необходимо [создать полезную нагрузку расширенных атрибутов](/dbt-cloud/api-v3#/operations/Create%20Extended%20Attributes) для выбранного проекта, а затем [назначить ее](/dbt-cloud/api-v3#/operations/Update%20Environment) определенной среде. Здесь `XXXXX` — номер вашего аккаунта, `YYYYY` — номер вашего проекта, а `ZZZZZ` — ваш [токен API](/docs/dbt-apis/authentication):

    ```shell
    curl --request POST \
    --url https://cloud.getdbt.com/api/v3/accounts/XXXXX/projects/YYYYY/extended-attributes/ \
    --header 'Accept: application/json' \
    --header 'Authorization: Bearer ZZZZZ' \
    --header 'Content-Type: application/json' \
    --data '{
    "id": null,
    "extended_attributes": {"type":"service_account","project_id":"xxx","private_key_id":"xxx","private_key":"{{ env_var('DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY')    }}","client_email":"xxx","client_id":xxx,"auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"xxx"},
    "state": 1
    }'
    ```
    _Запомните `id`, возвращенный в сообщении._ Он будет использован в следующем вызове. С `EEEEE` идентификатором среды, `FFFFF` идентификатором расширенных атрибутов: 

    ```shell
    curl --request POST \
    --url https://cloud.getdbt.com/api/v3/accounts/XXXXX/projects/YYYYY/environments/EEEEE/ \
    --header 'Accept: application/json' \
    --header 'Authorization: Bearer ZZZZZZ' \
    --header 'Content-Type: application/json' \
    --data '{
      "extended_attributes_id": FFFFF
    }'
    ```
