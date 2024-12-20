---
title: "Подключение BigQuery"
id: connect-bigquery
description: "Настройка подключения BigQuery."
sidebar_label: "Подключение BigQuery"
---

## Аутентификация

### JSON ключевой файл

:::info Загрузка JSON ключевого файла учетной записи службы

Хотя поля в подключении BigQuery можно указать вручную, мы рекомендуем загружать JSON ключевой файл учетной записи службы для быстрой и точной настройки подключения к BigQuery.

Вы можете предоставить JSON ключевой файл в одном из двух форматов:

- Загрузка JSON ключевого файла &mdash; Загрузите ключевой файл напрямую в его обычном формате JSON.
- Строка, закодированная в base64 &mdash; Предоставьте ключевой файл в виде строки, закодированной в base64. Когда вы предоставляете строку, закодированную в base64, dbt автоматически декодирует ее и заполняет необходимые поля.

:::

Загрузка JSON ключевого файла должна заполнить следующие поля:
- Project id
- Private key id
- Private key
- Client email
- Client id
- Auth uri
- Token uri
- Auth provider x509 cert url
- Client x509 cert url

В дополнение к этим полям, в подключении BigQuery можно настроить два других необязательных поля:

| Поле | Описание | Примеры |
| ----- | ----------- | ------- |
| Timeout | Устарело; существует для обратной совместимости с более старыми версиями dbt и будет удалено в будущем. | `300` |
| Location | [Местоположение](https://cloud.google.com/bigquery/docs/locations), где dbt должен создавать наборы данных. | `US`, `EU` |

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/bigquery-connection.png" title="Действительное подключение BigQuery"/>

### BigQuery OAuth
**Доступно в:** Среды разработки, только корпоративные планы

Метод аутентификации OAuth позволяет dbt Cloud выполнять запросы на разработку от имени пользователя BigQuery без настройки ключевого файла учетной записи службы BigQuery в dbt Cloud. Для получения дополнительной информации о начальной настройке подключения BigQuery OAuth в dbt Cloud, пожалуйста, ознакомьтесь с [документацией по настройке BigQuery OAuth](/docs/cloud/manage-access/set-up-bigquery-oauth).

Как конечный пользователь, если ваша организация настроила BigQuery OAuth, вы можете связать проект с вашей личной учетной записью BigQuery в вашем личном профиле в dbt Cloud, следующим образом:
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/bq_oauth/bq_oauth_as_user.gif" title="Кнопка связи на экране учетных данных dbt Cloud" />

## Конфигурация

Чтобы узнать, как оптимизировать производительность с помощью конфигураций, специфичных для платформы данных в dbt Cloud, обратитесь к [конфигурации, специфичной для BigQuery](/reference/resource-configs/bigquery-configs).

### Необязательные конфигурации

В BigQuery необязательные конфигурации позволяют настроить параметры для таких задач, как приоритет запросов, местоположение набора данных, время ожидания выполнения задания и многое другое. Эти опции дают вам больший контроль над тем, как BigQuery работает за кулисами, чтобы соответствовать вашим требованиям.

Чтобы настроить ваши необязательные конфигурации в dbt Cloud:

1. Нажмите на ваше имя в нижнем левом углу бокового меню в dbt Cloud
2. Выберите **Ваш профиль** из меню
3. Оттуда нажмите **Проекты** и выберите ваш проект BigQuery
5. Перейдите в **Подключение для разработки** и выберите BigQuery
6. Нажмите **Редактировать** и затем прокрутите вниз до **Необязательные настройки**

<Lightbox src="/img/bigquery/bigquery-optional-config.png" width="70%" title="Необязательная конфигурация BigQuery"/>

Следующие конфигурации являются необязательными, которые вы можете настроить в dbt Cloud:

| Конфигурация    | <div style={{width:'250'}}>Информация</div>   | Тип    | <div style={{width:'150'}}>Пример</div>             |
|---------------------------|-----------------------------------------|---------|--------------------|
| [Priority](#priority)             | Устанавливает приоритет для заданий BigQuery (либо `interactive`, либо в очереди для пакетной обработки `batch`)  | Строка  | `batch` или `interactive`    |
| [Retries](#retries)                       | Указывает количество повторных попыток для неудачных заданий из-за временных проблем             | Целое число | `3`                         |
| [Location](#location)                       | Местоположение для создания новых наборов данных       | Строка  | `US`, `EU`, `us-west2`      |
| [Maximum bytes billed](#maximum-bytes-billed)           | Ограничивает максимальное количество байтов, которые могут быть выставлены за запрос            | Целое число | `1000000000`                |
| [Execution project](#execution-project)              | Указывает идентификатор проекта для выставления счетов за выполнение запросов       | Строка  | `my-project-id`             |
| [Impersonate service account](#impersonate-service-account)    | Позволяет пользователям, аутентифицированным локально, получать доступ к ресурсам BigQuery под указанной учетной записью службы   | Строка  | `service-account@project.iam.gserviceaccount.com` |
| [Job retry deadline seconds](#job-retry-deadline-seconds)     | Устанавливает общее количество секунд, в течение которых BigQuery будет пытаться повторно выполнить задание, если оно не удалось    | Целое число | `600`                       |
| [Job creation timeout seconds](#job-creation-timeout-seconds)   | Указывает максимальное время ожидания для шага создания задания       | Целое число | `120`                       |
| [Google cloud storage-bucket](#google-cloud-storage-bucket)    | Местоположение для хранения объектов в Google Cloud Storage   | Строка  | `my-bucket`                 |
| [Dataproc region](#dataproc-region)                | Указывает облачный регион для выполнения заданий по обработке данных    | Строка  | `US`, `EU`, `asia-northeast1` |
| [Dataproc cluster name](#dataproc-cluster-name)          | Присваивает уникальный идентификатор группе виртуальных машин в Dataproc          | Строка  | `my-cluster`                |

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

Когда значение `maximum_bytes_billed` настроено для профиля BigQuery, это позволяет вам ограничить объем данных, которые может обработать ваш запрос. Это мера предосторожности, чтобы предотвратить случайную обработку вашим запросом большего объема данных, чем вы ожидаете, что может привести к увеличению затрат. Запросы, выполняемые dbt, будут завершаться с ошибкой, если они превышают установленный порог максимального количества байтов. Эта конфигурация должна быть указана в виде целого числа байтов.

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

</Expandable>

#### Запуск моделей dbt на Python в Google Cloud Platform

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

### Подключения на уровне учетной записи и управление учетными данными

Вы можете повторно использовать подключения в нескольких проектах с помощью [глобальных подключений](/docs/cloud/connect-data-platform/about-connections#migration-from-project-level-connections-to-account-level-connections). Подключения привязаны на уровне среды (ранее на уровне проекта), поэтому вы можете использовать несколько подключений внутри одного проекта (для управления разработкой, тестированием, производством и т.д.).

Подключения BigQuery в dbt Cloud в настоящее время ожидают, что учетные данные будут обрабатываться на уровне подключения (и только подключения BigQuery). Это изначально было разработано для облегчения создания нового подключения путем загрузки ключевого файла учетной записи службы. Это описывает, как переопределить учетные данные на уровне среды с помощью [расширенных атрибутов](/docs/dbt-cloud-environments#extended-attributes), _чтобы позволить администраторам проектов управлять учетными данными независимо_ от деталей подключения на уровне учетной записи, используемых для этой среды.

Для проекта вы сначала создадите переменную среды для хранения секретного значения `private_key`. Затем вы используете расширенные атрибуты, чтобы переопределить весь JSON учетной записи службы (вы не можете переопределить только секретный ключ из-за ограничения расширенных атрибутов).

1. **Новая переменная среды**

    - Создайте новую _секретную_ [переменную среды](https://docs.getdbt.com/docs/build/environment-variables#handling-secrets) для обработки закрытого ключа: `DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY`
    - Заполните значение закрытого ключа в соответствии с окружением

    Чтобы автоматизировать ваше развертывание, используйте следующий [запрос API администратора](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Create%20Projects%20Environment%20Variables%20Bulk), с `XXXXX` вашим номером учетной записи, `YYYYY` вашим номером проекта, `ZZZZZ` вашим [токеном API](/docs/dbt-cloud-apis/authentication):

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

    В деталях среды заполните блок [расширенных атрибутов](/docs/dbt-cloud-environments#extended-attributes) следующим содержимым (заменив `XXX` на вашу соответствующую информацию):

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

    Если вам нужно [переопределить другие поля](/docs/core/connect-data-platform/bigquery-setup#service-account-json) на уровне среды через расширенные атрибуты, пожалуйста, соблюдайте [ожидаемую отступы](/docs/dbt-cloud-environments#only-the-top-level-keys-are-accepted-in-extended-attributes) (порядок не имеет значения):

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

    Чтобы автоматизировать ваше развертывание, вам сначала нужно [создать полезную нагрузку расширенных атрибутов](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Create%20Extended%20Attributes) для данного проекта, а затем [назначить ее](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Update%20Environment) конкретной среде. С `XXXXX` как вашим номером учетной записи, `YYYYY` как вашим номером проекта, и `ZZZZZ` как вашим [токеном API](/docs/dbt-cloud-apis/authentication):

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