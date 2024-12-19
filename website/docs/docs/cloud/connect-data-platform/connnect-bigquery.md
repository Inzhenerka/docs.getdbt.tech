---
title: "Подключение к BigQuery"
id: connect-bigquery
description: "Настройка подключения к BigQuery."
sidebar_label: "Подключение к BigQuery"
---

## Аутентификация

### JSON ключевой файл

:::info Загрузка JSON ключевого файла сервисного аккаунта

Хотя поля в подключении к BigQuery можно указать вручную, мы рекомендуем загрузить JSON <Term id="json" /> ключевой файл сервисного аккаунта для быстрой и точной настройки подключения к BigQuery.

Вы можете предоставить JSON ключевой файл в одном из двух форматов:

- Загрузка JSON ключевого файла &mdash; Загрузите файл ключа в его обычном формате JSON.
- Строка в формате base64 &mdash; Предоставьте файл ключа в виде строки, закодированной в base64. Когда вы предоставляете строку в формате base64, dbt автоматически декодирует ее и заполняет необходимые поля.

:::

Загрузка JSON ключевого файла должна заполнить следующие поля:
- Идентификатор проекта
- Идентификатор закрытого ключа
- Закрытый ключ
- Электронная почта клиента
- Идентификатор клиента
- URI аутентификации
- URI токена
- URL сертификата провайдера аутентификации x509
- URL сертификата клиента x509

В дополнение к этим полям есть два других необязательных поля, которые можно настроить в подключении к BigQuery:

| Поле | Описание | Примеры |
| ----- | ----------- | ------- |
| Таймаут | Устарело; существует для обратной совместимости со старыми версиями dbt и будет удалено в будущем. | `300` |
| Местоположение | [Местоположение](https://cloud.google.com/bigquery/docs/locations), где dbt должен создавать наборы данных. | `US`, `EU` |



<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/bigquery-connection.png" title="Действительное подключение к BigQuery"/>

### BigQuery OAuth
**Доступно в:** Разработческих средах, только для корпоративных планов

Метод аутентификации OAuth позволяет dbt Cloud выполнять запросы разработки от имени пользователя BigQuery без настройки ключевого файла сервисного аккаунта в dbt Cloud. Для получения дополнительной информации о первоначальной настройке подключения BigQuery OAuth в dbt Cloud, пожалуйста, смотрите [документацию по настройке BigQuery OAuth](/docs/cloud/manage-access/set-up-bigquery-oauth).

Как конечный пользователь, если ваша организация настроила BigQuery OAuth, вы можете связать проект с вашей личной учетной записью BigQuery в вашем личном профиле в dbt Cloud, следующим образом:
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/bq_oauth/bq_oauth_as_user.gif" title="Кнопка связи на экране учетных данных dbt Cloud" />

## Настройка

Чтобы узнать, как оптимизировать производительность с помощью конфигураций, специфичных для платформы данных в dbt Cloud, обратитесь к [конфигурации, специфичной для BigQuery](/reference/resource-configs/bigquery-configs).

### Необязательные конфигурации

В BigQuery необязательные конфигурации позволяют вам настраивать параметры для таких задач, как приоритет запросов, местоположение набора данных, таймаут задания и многое другое. Эти параметры дают вам больший контроль над тем, как BigQuery работает за кулисами, чтобы соответствовать вашим требованиям.

Чтобы настроить свои необязательные конфигурации в dbt Cloud:

1. Нажмите на свое имя в нижнем левом углу бокового меню в dbt Cloud
2. Выберите **Ваш профиль** из меню
3. Оттуда нажмите **Проекты** и выберите свой проект BigQuery
5. Перейдите в **Подключение для разработки** и выберите BigQuery
6. Нажмите **Редактировать**, а затем прокрутите вниз до **Необязательных настроек**

<Lightbox src="/img/bigquery/bigquery-optional-config.png" width="70%" title="Необязательная конфигурация BigQuery"/>

Следующие необязательные конфигурации вы можете установить в dbt Cloud:

| Конфигурация    | <div style={{width:'250'}}>Информация</div>   | Тип    | <div style={{width:'150'}}>Пример</div>             |
|---------------------------|-----------------------------------------|---------|--------------------|
| [Приоритет](#priority)             | Устанавливает приоритет для заданий BigQuery (либо `interactive`, либо в очереди для `batch` обработки)  | Строка  | `batch` или `interactive`    |
| [Повторные попытки](#retries)                       | Указывает количество повторных попыток для неудачных заданий из-за временных проблем             | Целое число | `3`                         |
| [Местоположение](#location)                       | Местоположение для создания новых наборов данных       | Строка  | `US`, `EU`, `us-west2`      |
| [Максимальное количество байт для выставления счета](#maximum-bytes-billed)           | Ограничивает максимальное количество байт, которые могут быть выставлены за запрос            | Целое число | `1000000000`                |
| [Проект выполнения](#execution-project)              | Указывает идентификатор проекта для выставления счета за выполнение запроса       | Строка  | `my-project-id`             |
| [Имитация сервисного аккаунта](#impersonate-service-account)    | Позволяет пользователям, аутентифицированным локально, получать доступ к ресурсам BigQuery от имени указанного сервисного аккаунта   | Строка  | `service-account@project.iam.gserviceaccount.com` |
| [Секунды до дедлайна повторной попытки задания](#job-retry-deadline-seconds)     | Устанавливает общее количество секунд, в течение которых BigQuery будет пытаться повторить задание в случае его неудачи    | Целое число | `600`                       |
| [Секунды до таймаута создания задания](#job-creation-timeout-seconds)   | Указывает максимальный таймаут для этапа создания задания       | Целое число | `120`                       |
| [Google Cloud Storage - бакет](#google-cloud-storage-bucket)    | Местоположение для хранения объектов в Google Cloud Storage   | Строка  | `my-bucket`                 |
| [Регион Dataproc](#dataproc-region)                | Указывает облачный регион для выполнения заданий по обработке данных    | Строка  | `US`, `EU`, `asia-northeast1` |
| [Имя кластера Dataproc](#dataproc-cluster-name)          | Присваивает уникальный идентификатор группе виртуальных машин в Dataproc          | Строка  | `my-cluster`                |


<Expandable alt_header="Приоритет">

`priority` для заданий BigQuery, которые выполняет dbt, можно настроить с помощью конфигурации `priority` в вашем профиле BigQuery. Поле приоритета может быть установлено на одно из значений `batch` или `interactive`. Для получения дополнительной информации о приоритете запросов обратитесь к [документации BigQuery](https://cloud.google.com/bigquery/docs/running-queries).

</Expandable>

<Expandable alt_header="Повторные попытки">

Повторные попытки в BigQuery помогают обеспечить успешное завершение заданий, пытаясь снова после временных сбоев, что делает ваши операции более надежными.

</Expandable>

<Expandable alt_header="Местоположение">

`location` наборов данных BigQuery можно установить с помощью настройки `location` в профиле BigQuery. Согласно [документации BigQuery](https://cloud.google.com/bigquery/docs/locations), `location` может быть либо многорегиональным местоположением (например, `EU`, `US`), либо региональным местоположением (например, `us-west2`).

</Expandable>

<Expandable alt_header="Максимальное количество байт для выставления счета">

Когда для профиля BigQuery настроено значение `maximum_bytes_billed`, это позволяет вам ограничить, сколько данных ваш запрос может обработать. Это мера предосторожности, чтобы предотвратить случайную обработку большего объема данных, чем вы ожидаете, что может привести к более высоким затратам. Запросы, выполняемые dbt, будут завершаться с ошибкой, если они превышают установленный предел максимального количества байт. Эта конфигурация должна быть указана в виде целого числа байт.

Если ваше значение `maximum_bytes_billed` равно 1000000000, вы должны ввести это значение в поле `maximum_bytes_billed` в dbt cloud.

</Expandable>

<Expandable alt_header="Проект выполнения">

По умолчанию dbt будет использовать указанный `project`/`database` как:

1. Местоположение для материализации ресурсов (моделей, семян, снимков и т. д.), если они не указывают пользовательскую конфигурацию проекта/базы данных
2. Проект GCP, который получает счет за затраты на запросы или использование слотов

При желании вы можете указать проект выполнения для выставления счета за выполнение запроса, вместо проекта/базы данных, где вы материализуете большинство ресурсов.

</Expandable>

<Expandable alt_header="Имитация сервисного аккаунта">

Эта функция позволяет пользователям, аутентифицированным с помощью локального OAuth, получать доступ к ресурсам BigQuery на основе разрешений сервисного аккаунта.

Для общего обзора этого процесса смотрите официальную документацию по [Созданию краткосрочных учетных данных сервисного аккаунта](https://cloud.google.com/iam/docs/create-short-lived-credentials-direct).

</Expandable>

<Expandable alt_header="Секунды до дедлайна повторной попытки задания">

Секунды до дедлайна повторной попытки задания — это максимальное количество времени, которое BigQuery будет тратить на повторные попытки задания, прежде чем оно сдадится.

</Expandable>

<Expandable alt_header="Секунды до таймаута создания задания">

Секунды до таймаута создания задания — это максимальное время, которое BigQuery будет ждать, чтобы начать задание. Если задание не начнется в течение этого времени, оно завершится с ошибкой.

</Expandable>

#### Запуск моделей dbt на Python в Google Cloud Platform

import BigQueryDataproc from '/snippets/_bigquery-dataproc.md';

<BigQueryDataproc />

<Expandable alt_header="Google Cloud Storage - бакет">

Все, что вы храните в Cloud Storage, должно быть помещено в [бакет](https://cloud.google.com/storage/docs/buckets). Бакеты помогают вам организовать ваши данные и управлять доступом к ним.

</Expandable>

<Expandable alt_header="Регион Dataproc">

Назначенное местоположение в облаке, где вы можете эффективно выполнять свои задания по обработке данных. Этот регион должен соответствовать местоположению вашего набора данных BigQuery, если вы хотите использовать Dataproc с BigQuery, чтобы гарантировать, что данные не перемещаются между регионами, что может быть неэффективно и дорого.

Для получения дополнительной информации о [регионах Dataproc](https://cloud.google.com/bigquery/docs/locations) обратитесь к документации BigQuery.

</Expandable>

<Expandable alt_header="Имя кластера Dataproc">

Уникальная метка, которую вы присваиваете своей группе виртуальных машин, чтобы помочь вам идентифицировать и управлять своими задачами по обработке данных в облаке. Когда вы интегрируете Dataproc с BigQuery, вам нужно предоставить имя кластера, чтобы BigQuery знал, какой конкретный набор ресурсов (кластер) использовать для выполнения заданий по обработке данных.

Посмотрите [документацию Dataproc по созданию кластера](https://cloud.google.com/dataproc/docs/guides/create-cluster) для получения обзора того, как работают кластеры.

</Expandable>

### Подключения на уровне аккаунта и управление учетными данными

Вы можете повторно использовать подключения в нескольких проектах с помощью [глобальных подключений](/docs/cloud/connect-data-platform/about-connections#migration-from-project-level-connections-to-account-level-connections). Подключения прикрепляются на уровне среды (ранее на уровне проекта), поэтому вы можете использовать несколько подключений внутри одного проекта (для разработки, тестирования, производства и т. д.).

Подключения BigQuery в dbt Cloud в настоящее время ожидают, что учетные данные будут обрабатываться на уровне подключения (и только для подключений BigQuery). Это было изначально разработано для упрощения создания нового подключения путем загрузки ключевого файла сервисного аккаунта. Это описывает, как переопределить учетные данные на уровне среды с помощью [расширенных атрибутов](/docs/dbt-cloud-environments#extended-attributes), _чтобы позволить администраторам проектов управлять учетными данными независимо_ от деталей подключения на уровне аккаунта, используемых для этой среды.

Для проекта вы сначала создадите переменную окружения для хранения секретного значения `private_key`. Затем вы используете расширенные атрибуты, чтобы переопределить весь JSON сервисного аккаунта (вы не можете переопределить только секретный ключ из-за ограничения расширенных атрибутов).

1. **Новая переменная окружения**

    - Создайте новую _секретную_ [переменную окружения](https://docs.getdbt.com/docs/build/environment-variables#handling-secrets) для обработки значения закрытого ключа: `DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY`
    - Заполните значение закрытого ключа в зависимости от среды

    Чтобы автоматизировать развертывание, используйте следующий [запрос API администратора](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Create%20Projects%20Environment%20Variables%20Bulk), с `XXXXX` вашим номером аккаунта, `YYYYY` вашим номером проекта, `ZZZZZ` вашим [API токеном](/docs/dbt-cloud-apis/authentication):

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
        "project": "Значение по умолчанию для всего проекта",
        "ENVIRONMENT_NAME_1": "Необязательно, если нужно, значение для имени среды 1",
        "ENVIRONMENT_NAME_2": "Необязательно, если нужно, значение для имени среды 2"
    }
    ]
    }'
    ```

2. **Расширенные атрибуты**

    В деталях среды заполните блок [расширенных атрибутов](/docs/dbt-cloud-environments#extended-attributes) следующим содержимым (заменив `XXX` на соответствующую информацию):

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

    Если вам нужно переопределить [другие поля](/docs/core/connect-data-platform/bigquery-setup#service-account-json) на уровне среды с помощью расширенных атрибутов, пожалуйста, соблюдайте [ожидаемую индентацию](/docs/dbt-cloud-environments#only-the-top-level-keys-are-accepted-in-extended-attributes) (порядок не имеет значения):

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

    Чтобы автоматизировать развертывание, вам сначала нужно [создать полезную нагрузку расширенных атрибутов](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Create%20Extended%20Attributes) для данного проекта, а затем [назначить ее](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Update%20Environment) конкретной среде. С `XXXXX` как номером вашего аккаунта, `YYYYY` как номером вашего проекта и `ZZZZZ` как вашим [API токеном](/docs/dbt-cloud-apis/authentication):

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
    _Обратите внимание на `id`, возвращаемый в сообщении._ Он будет использоваться в следующем вызове. С `EEEEE` как идентификатором среды, `FFFFF` как идентификатором расширенных атрибутов: 

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