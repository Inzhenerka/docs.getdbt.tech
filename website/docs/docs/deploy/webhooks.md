---
title: "Вебхуки для ваших задач"
sidebar_label: "Вебхуки"
description: "Получайте уведомления в реальном времени о ваших задачах dbt с помощью вебхуков."
---

# Webhooks for your jobs <Lifecycle status="self_service,managed,managed_plus" />

С помощью <Constant name="cloud" /> вы можете создавать исходящие вебхуки для отправки событий (уведомлений) о ваших dbt jobs в другие системы. Эти системы могут принимать (подписываться на) такие события, чтобы дальше автоматизировать ваши рабочие процессы или запускать настроенные вами сценарии автоматизации.

Вебхук — это функция обратного вызова на основе HTTP, которая позволяет осуществлять коммуникацию, основанную на событиях, между двумя различными веб-приложениями. Это позволяет получать самую актуальную информацию о ваших задачах dbt в реальном времени. Без этого вам пришлось бы многократно делать вызовы API, чтобы проверить, есть ли какие-либо обновления, которые вам нужно учесть (опрос). Из-за этого вебхуки также называют _push API_ или _reverse API_ и часто используют для разработки инфраструктуры.

<Constant name="cloud" /> отправляет JSON‑полезную нагрузку на endpoint URL вашего приложения, когда срабатывает webhook. Вы можете отправить уведомление в [Slack](/guides/zapier-slack), уведомление в [Microsoft Teams](/guides/zapier-ms-teams) или [открыть инцидент в PagerDuty](/guides/serverless-pagerduty), когда задание dbt завершается с ошибкой.

Вы можете создавать webhooks для этих событий через [веб‑интерфейс <Constant name="cloud" />](#create-a-webhook-subscription), а также с помощью [API <Constant name="cloud" />](#api-for-webhooks):

- `job.run.started` &mdash; Запуск начат.
- `job.run.completed` &mdash; Запуск завершен. Это может быть запуск, который завершился с ошибкой или успешно.
- `job.run.errored` &mdash; Запуск завершился с ошибкой.

<Constant name="cloud" /> повторно отправляет каждое событие до пяти раз. <Constant name="cloud" /> хранит журнал каждой доставки webhook в течение 30 дней. У каждого webhook есть собственный раздел **Recent Deliveries**, который позволяет с первого взгляда увидеть, была ли доставка успешной или завершилась с ошибкой.

Webhook в <Constant name="cloud" /> имеет тайм-аут 10 секунд. Это означает, что если конечная точка не отвечает в течение 10 секунд, обработчик webhook завершает работу по тайм-ауту. В результате может возникнуть ситуация, когда клиент успешно отвечает после истечения этих 10 секунд и фиксирует статус успеха, тогда как система webhook в <Constant name="cloud" /> интерпретирует такую доставку как неудачную.

:::tip Видео
Если вас интересует обучение с помощью видео, ознакомьтесь с [курсом по вебхукам на требование](https://learn.getdbt.com/courses/webhooks) от dbt Labs.

Вы также можете ознакомиться с бесплатным [курсом Основы dbt](https://learn.getdbt.com/courses/dbt-fundamentals).
:::

## Предварительные требования
- У вас есть учетная запись <Constant name="cloud" />, работающая на тарифном плане [Starter или Enterprise-tier](https://www.getdbt.com/pricing/).
- Для доступа `write` к вебхукам:
    - **Тарифные планы Enterprise-tier** &mdash; Наборы разрешений одинаковы как для API service tokens, так и для интерфейса <Constant name="cloud" />. Вы или API service token должны иметь набор разрешений Account Admin, Admin или Developer ([permission set](/docs/cloud/manage-access/enterprise-permissions)).
    - **Аккаунты на тарифе Starter** &mdash; Для интерфейса <Constant name="cloud" /> вам необходимо иметь [лицензию Developer](/docs/cloud/manage-access/self-service-permissions).
- Вы используете модель развертывания multi-tenant или AWS single-tenant в <Constant name="cloud" />. Дополнительную информацию см. в разделе [Tenancy](/docs/cloud/about-cloud/tenancy).
- Ваша целевая система поддерживает [Authorization headers](#troubleshooting).

## Создание подписки на вебхук {#create-a-webhook-subscription}

1. Перейдите в **Account settings** в <Constant name="cloud" /> (кликнув по имени своей учетной записи в левой боковой панели).
2. Перейдите в раздел **Webhooks** и нажмите **Create webhook**.
3. Для настройки нового вебхука:
   - **Webhook name** &mdash; Введите имя для исходящего вебхука.
   - **Description** &mdash; Введите описание вебхука.
   - **Events** &mdash; Выберите событие, при наступлении которого будет срабатывать этот вебхук. Можно подписаться на несколько событий.
   - **Jobs** &mdash; Укажите задание(я), для которых должен срабатывать вебхук. Либо оставьте это поле пустым, чтобы вебхук срабатывал для всех заданий в вашей учетной записи. По умолчанию <Constant name="cloud" /> настраивает вебхук на уровне учетной записи.
   - **Endpoint** &mdash; Укажите URL эндпоинта вашего приложения, на который <Constant name="cloud" /> сможет отправлять события.
4. По завершении нажмите **Save**.

   <Constant name="cloud" /> предоставляет секретный токен, который вы можете использовать для [проверки подлинности вебхука](#validate-a-webhook). Настоятельно рекомендуется выполнять эту проверку на стороне вашего сервера, чтобы защититься от поддельных (spoofed) запросов.

:::info
Обратите внимание, что <Constant name="cloud" /> автоматически деактивирует вебхук после 5 последовательных неудачных попыток отправки событий на ваш эндпоинт. Чтобы повторно активировать вебхук, найдите его в списке вебхуков и нажмите кнопку повторной активации, чтобы снова включить его и продолжить получать события.
:::

Чтобы найти подходящий URL доступа <Constant name="cloud" /> для вашего региона и тарифного плана, см. [Regions & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses).

### Различия между событиями completed и errored {#completed-errored-event-difference}
Событие `job.run.errored` является подмножеством событий `job.run.completed`. Если вы подпишетесь на оба, вы получите два уведомления, когда выполнение задания завершится с ошибкой. Однако <Constant name="cloud" /> инициирует эти два события в разное время:

- `job.run.completed` &mdash; это событие срабатывает только после того, как метаданные и артефакты задания будут загружены и станут доступны через Admin и Discovery API <Constant name="cloud" />.
- `job.run.errored` &mdash; это событие срабатывает немедленно, поэтому метаданные и артефакты задания могут еще не быть загружены. Это означает, что часть информации может быть недоступна для использования.

Если ваша интеграция зависит от данных из Admin API (например, доступ к журналам запуска) или Discovery API (доступ к статусам моделей), используйте событие `job.run.completed` и фильтруйте по `runStatus` или `runStatusCode`.

Если ваша интеграция не зависит от дополнительных данных или если улучшенная производительность доставки более важна для вас, используйте `job.run.errored` и настройте вашу интеграцию для обработки вызовов API, которые могут не возвращать данные в течение короткого времени вначале.

## Проверка вебхука

Вы можете использовать секретный токен, предоставленный dbt Cloud, чтобы проверить, что вебхуки, полученные вашей конечной точкой, действительно были отправлены dbt Cloud. Официальные вебхуки будут включать заголовок `Authorization`, который содержит SHA256-хэш тела запроса и использует секретный токен в качестве ключа.

Вы можете использовать секретный токен, предоставленный <Constant name="cloud" />, чтобы проверить, что вебхуки, полученные вашим эндпоинтом, действительно были отправлены <Constant name="cloud" />. Официальные вебхуки будут содержать заголовок `Authorization`, в котором находится SHA256‑хэш тела запроса, вычисленный с использованием секретного токена в качестве ключа.

Ниже приведён пример проверки подлинности вебхука на Python:

```python
auth_header = request.headers.get('authorization', None)
app_secret = os.environ['MY_DBT_CLOUD_AUTH_TOKEN'].encode('utf-8')
signature = hmac.new(app_secret, request_body, hashlib.sha256).hexdigest()
return signature == auth_header
```

Обратите внимание, что система назначения должна поддерживать [заголовки авторизации](#troubleshooting), чтобы вебхук работал корректно. Вы можете протестировать поддержку вашей конечной точки, отправив запрос с помощью curl и заголовка Authorization, как показано ниже:

```shell
curl -H 'Authorization: 123' -X POST https://<your-webhook-endpoint>
```

## Инспекция HTTP-запросов
При работе с вебхуками рекомендуется использовать такие инструменты, как [RequestBin](https://requestbin.com/) и [Requestly](https://requestly.io/). Эти инструменты позволяют инспектировать ваши HTML-запросы, полезные нагрузки ответов и заголовки ответов, чтобы вы могли отлаживать и тестировать вебхуки перед их интеграцией в ваши системы.

## Примеры JSON-пакетов

Пример пакета вебхука для запуска, который начался:

```json
{
  "accountId": 1,
  "webhookId": "wsu_12345abcde",
  "eventId": "wev_2L6Z3l8uPedXKPq9D2nWbPIip7Z",
  "timestamp": "2023-01-31T19:28:15.742843678Z",
  "eventType": "job.run.started",
  "webhookName": "test",
  "data": {
    "jobId": "123",
    "jobName": "Daily Job (dbt build)",
    "runId": "12345",
    "environmentId": "1234",
    "environmentName": "Production",
    "dbtVersion": "1.0.0",
    "projectName": "Snowflake Github Demo",
    "projectId": "167194",
    "runStatus": "Running",
    "runStatusCode": 3,
    "runStatusMessage": "None",
    "runReason": "Kicked off from the UI by test@test.com",
    "runStartedAt": "2023-01-31T19:28:07Z"
  }
}
```

Пример пакета вебхука для завершенного запуска:

```json
{
  "accountId": 1,
  "webhookId": "wsu_12345abcde",
  "eventId": "wev_2L6ZDoilyiWzKkSA59Gmc2d7FDD",
  "timestamp": "2023-01-31T19:29:35.789265936Z",
  "eventType": "job.run.completed",
  "webhookName": "test",
  "data": {
    "jobId": "123",
    "jobName": "Daily Job (dbt build)",
    "runId": "12345",
    "environmentId": "1234",
    "environmentName": "Production",
    "dbtVersion": "1.0.0",
    "projectName": "Snowflake Github Demo",
    "projectId": "167194",
    "runStatus": "Success",
    "runStatusCode": 10,
    "runStatusMessage": "None",
    "runReason": "Kicked off from the UI by test@test.com",
    "runStartedAt": "2023-01-31T19:28:07Z",
    "runFinishedAt": "2023-01-31T19:29:32Z"
  }
}
```

Пример пакета вебхука для запуска с ошибкой:

```json
{
  "accountId": 1,
  "webhookId": "wsu_12345abcde",
  "eventId": "wev_2L6m5BggBw9uPNuSmtg4MUiW4Re",
  "timestamp": "2023-01-31T21:15:20.419714619Z",
  "eventType": "job.run.errored",
  "webhookName": "test",
  "data": {
    "jobId": "123",
    "jobName": "dbt Vault",
    "runId": "12345",
    "environmentId": "1234",
    "environmentName": "dbt Vault Demo",
    "dbtVersion": "1.0.0",
    "projectName": "Snowflake Github Demo",
    "projectId": "167194",
    "runStatus": "Errored",
    "runStatusCode": 20,
    "runStatusMessage": "None",
    "runReason": "Kicked off from the UI by test@test.com",
    "runStartedAt": "2023-01-31T21:14:41Z",
    "runErroredAt": "2023-01-31T21:15:20Z"
  }
}
```

## API для вебхуков {#api-for-webhooks}
Вы можете использовать API <Constant name="cloud" /> для создания новых вебхуков, на которые вы хотите подписаться, получения подробной информации о ваших вебхуках, а также для управления вебхуками, связанными с вашей учетной записью. В следующих разделах описаны конечные точки API, которые вы можете для этого использовать.

:::info URLs доступа
<Constant name="cloud" /> размещён в нескольких регионах по всему миру, и для каждого региона используется свой URL доступа. Пользователи тарифных планов Enterprise могут выбрать размещение своей учетной записи в любом из этих регионов. Полный список доступных URL доступа <Constant name="cloud" /> см. в разделе [Regions & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses).  
:::

### Список всех подписок на вебхуки
Отображает список всех вебхуков, доступных для конкретной учетной записи <Constant name="cloud" />.

#### Запрос
```shell
GET https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscriptions
```

#### Параметры пути
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL для входа в вашу учётную запись <Constant name="cloud" />. |
| `account_id` | Учётная запись <Constant name="cloud" />, с которой связаны вебхуки. |

#### Пример ответа
```json
{
    "data": [
        {
            "id": "wsu_12345abcde",
            "account_identifier": "act_12345abcde",
            "name": "Webhook for jobs",
            "description": "A webhook for when jobs are started",
            "job_ids": [
                "123",
                "321"
            ],
            "event_types": [
                "job.run.started"
            ],
            "client_url": "https://test.com",
            "active": true,
            "created_at": "1675735768491774",
            "updated_at": "1675787482826757",
            "account_id": "123",
            "http_status_code": "0"
        },
        {
            "id": "wsu_12345abcde",
            "account_identifier": "act_12345abcde",
            "name": "Notification Webhook",
            "description": "Webhook used to trigger notifications in Slack",
            "job_ids": [],
            "event_types": [
                "job.run.completed",
                "job.run.started",
                "job.run.errored"
            ],
            "client_url": "https://test.com",
            "active": true,
            "created_at": "1674645300282836",
            "updated_at": "1675786085557224",
            "http_status_code": "410",
            "dispatched_at": "1675786085548538",
            "account_id": "123"
        }
    ],
    "status": {
        "code": 200
    },
    "extra": {
        "pagination": {
            "total_count": 2,
            "count": 2
        },
        "filters": {
            "offset": 0,
            "limit": 10
        }
    }
}
```

#### Схема ответа
| Имя | Описание | Возможные значения |
| --- | --- | --- |
| `data` | Список доступных вебхуков для указанного ID аккаунта <Constant name="cloud" />. |  |
| `id` | ID вебхука. Это универсально уникальный идентификатор (UUID), который является уникальным для всех регионов, включая multi-tenant и single-tenant. |  |
| `account_identifier` | Уникальный идентификатор _вашего_ аккаунта <Constant name="cloud" />. |  |
| `name` | Имя исходящего вебхука. |  |
| `description` | Описание вебхука. |  |
| `job_ids` | Конкретные job’ы, для которых настроен запуск вебхука. Если список пуст, вебхук будет срабатывать для всех job’ов в вашем аккаунте; по умолчанию <Constant name="cloud" /> настраивает вебхуки на уровне аккаунта. | <ul><li>Пустой список</li> <li>Список ID job’ов</li></ul> |
| `event_types` | Тип(ы) событий, на которые настроен запуск вебхука. | Один или несколько из следующих: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL эндпоинта приложения, на который <Constant name="cloud" /> может отправлять событие(я). |  |
| `active` | Булево значение, указывающее, активен ли вебхук. | Одно из следующих: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Временная метка момента создания вебхука. |  |
| `updated_at` | Временная метка момента последнего обновления вебхука. |  |
| `http_status_code` | Последний HTTP-статус вебхука. | Может быть любым [HTTP-кодом ответа](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Если значение равно `0`, это означает, что вебхук ни разу не был вызван. |
| `dispatched_at` | Временная метка момента, когда вебхук в последний раз был отправлен на указанный URL эндпоинта. |  |
| `account_id` | ID аккаунта <Constant name="cloud" />. |  |

### Получение подробной информации о вебхуке
Получите подробную информацию о конкретном вебхуке.

#### Запрос
```shell
GET https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}
```
#### Параметры пути
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL для входа в вашу учетную запись <Constant name="cloud" />. |
| `account_id` | Учетная запись <Constant name="cloud" />, с которой связан вебхук. |
| `webhook_id` | Вебхук, по которому требуется получить подробную информацию. |

#### Пример ответа
```json
{
    "data": {
        "id": "wsu_12345abcde",
        "account_identifier": "act_12345abcde",
        "name": "Webhook for jobs",
        "description": "A webhook for when jobs are started",
        "event_types": [
            "job.run.started"
        ],
        "client_url": "https://test.com",
        "active": true,
        "created_at": "1675789619690830",
        "updated_at": "1675793192536729",
        "dispatched_at": "1675793192533160",
        "account_id": "123",
        "job_ids": [],
        "http_status_code": "0"
    },
    "status": {
        "code": 200
    }
}
```

#### Схема ответа
| Имя | Описание | Возможные значения |
| --- | --- | --- |
| `id` | Идентификатор вебхука. |  |
| `account_identifier` | Уникальный идентификатор _вашего_ аккаунта <Constant name="cloud" />. |  |
| `name` | Название исходящего вебхука. |  |
| `description` | Полное описание вебхука. |  |
| `event_types` | Тип события, на которое настроено срабатывание вебхука. | Один или несколько из следующих: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL конечной точки приложения, на которую <Constant name="cloud" /> может отправлять событие(я). |  |
| `active` | Булево значение, указывающее, активен ли вебхук. | Одно из следующих: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Временная метка, когда вебхук был создан. |  |
| `updated_at` | Временная метка последнего обновления вебхука. |  |
| `dispatched_at` | Временная метка последней отправки вебхука на указанный URL конечной точки. |  |
| `account_id` | Идентификатор аккаунта <Constant name="cloud" />. |  |
| `job_ids` | Конкретные задания, для которых настроено срабатывание вебхука. Если список пуст, вебхук будет срабатывать для всех заданий в вашем аккаунте; по умолчанию <Constant name="cloud" /> настраивает вебхуки на уровне аккаунта. | Одно из следующих: <ul><li>Пустой список</li> <li>Список идентификаторов заданий</li></ul> |
| `http_status_code` | Последний HTTP-статус вебхука. | Может быть любым [кодом статуса HTTP-ответа](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Если значение равно `0`, это означает, что вебхук ни разу не срабатывал. |

### Создание новой подписки на вебхук
Создайте новый исходящий вебхук и укажите URL-адрес конечной точки, который будет подписываться (слушать) на события вебхука.

#### Пример запроса

```shell
POST https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscriptions
```

```json
{
	"event_types": [
			"job.run.started"
	],
	"name": "Webhook for jobs",
	"client_url": "https://test.com",
	"active": true,
	"description": "A webhook for when jobs are started",
	"job_ids": [
			123,
			321
	]
}
```

#### Параметры пути
| Имя | Описание |
| --- | --- |
| `your access URL` | URL для входа в ваш аккаунт <Constant name="cloud" />. |
| `account_id` | Аккаунт <Constant name="cloud" />, с которым связан вебхук. |

#### Параметры запроса
| Имя | Описание | Возможные значения |
| --- | --- | --- |
| `event_types` | Укажите событие, при котором должен срабатывать этот webhook. Вы можете подписаться более чем на одно событие. | Одно или несколько из следующих: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `name` | Укажите имя вашего webhook. |  |
| `client_url` | Укажите URL конечной точки вашего приложения, на который <Constant name="cloud" /> сможет отправлять событие(я). |  |
| `active` | Укажите логическое значение, которое определяет, активен ли ваш webhook. | Одно из следующих: <ul><li>`true`</li><li>`false`</li></ul> |
| `description` | Укажите описание вашего webhook. |  |
| `job_ids` | Укажите конкретные задания, для которых должен срабатывать webhook, либо оставьте этот параметр пустым списком. Если передан пустой список, webhook будет настроен на срабатывание для всех заданий в вашем аккаунте; по умолчанию <Constant name="cloud" /> настраивает webhooks на уровне аккаунта. | Одно из следующих: <ul><li>Пустой список</li> <li>Список идентификаторов заданий</li></ul> |

#### Пример ответа
```json
{
    "data": {
        "id": "wsu_12345abcde",
        "account_identifier": "act_12345abcde",
        "name": "Webhook for jobs",
        "description": "A webhook for when jobs are started",
        "job_ids": [
            "123",
						"321"
        ],
        "event_types": [
            "job.run.started"
        ],
        "client_url": "https://test.com",
        "hmac_secret": "12345abcde",
        "active": true,
        "created_at": "1675795644808877",
        "updated_at": "1675795644808877",
        "account_id": "123",
        "http_status_code": "0"
    },
    "status": {
        "code": 201
    }
}
```

#### Схема ответа
| Имя | Описание | Возможные значения |
| --- | --- | --- |
| `id` | Идентификатор вебхука. |  |
| `account_identifier` | Уникальный идентификатор _вашего_ аккаунта <Constant name="cloud" />. |  |
| `name` | Название исходящего вебхука. |  |
| `description` | Полное описание вебхука. |  |
| `job_ids` | Конкретные задания, для которых настроено срабатывание вебхука. Если список пуст, вебхук будет срабатывать для всех заданий в вашем аккаунте; по умолчанию <Constant name="cloud" /> настраивает вебхуки на уровне аккаунта. | Один из вариантов: <ul><li>Пустой список</li> <li>Список идентификаторов заданий</li></ul> |
| `event_types` | Типы событий, на которые настроено срабатывание вебхука. | Один или несколько из следующих: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL конечной точки приложения, на который <Constant name="cloud" /> может отправлять событие(я). |  |
| `hmac_secret` | Секретный ключ для нового вебхука. Этот ключ можно использовать для [проверки подлинности вебхука](#validate-a-webhook). |  |
| `active` | Логическое значение, указывающее, активен ли вебхук. | Один из вариантов: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Временная метка создания вебхука. |  |
| `updated_at` | Временная метка последнего обновления вебхука. |  |
| `account_id` | Идентификатор аккаунта <Constant name="cloud" />. |  |
| `http_status_code` | Последний HTTP-статус вебхука. | Может быть любым [кодом статуса HTTP-ответа](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Если значение равно `0`, это означает, что вебхук ни разу не срабатывал. |

### Обновление вебхука
Обновите детали конфигурации для конкретного вебхука.

#### Пример запроса
```shell
PUT https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}
```

```json
{
	"event_types": [
			"job.run.started"
	],
	"name": "Webhook for jobs",
	"client_url": "https://test.com",
	"active": true,
	"description": "A webhook for when jobs are started",
	"job_ids": [
			123,
			321
	]
}
```

#### Параметры пути
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL для входа в ваш аккаунт <Constant name="cloud" />. |
| `account_id` | Аккаунт <Constant name="cloud" />, с которым связан webhook. |
| `webhook_id` | Webhook, который вы хотите обновить. |

#### Параметры запроса
| Имя | Описание | Возможные значения |
|------|-------------|-----------------|
| `event_types` | Обновите тип события, на которое будет срабатывать вебхук. Можно подписаться более чем на одно событие. | Один или несколько из следующих вариантов: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `name` | Измените имя вашего вебхука. |  |
| `client_url` | Обновите URL конечной точки приложения, куда <Constant name="cloud" /> может отправлять событие(я). |  |
| `active` | Измените логическое значение, указывающее, активен вебхук или нет. | Один из следующих вариантов: <ul><li>`true`</li><li>`false`</li></ul> |
| `description` | Обновите описание вебхука. |  |
| `job_ids` | Измените, для каких заданий должен срабатывать вебхук. Также можно использовать пустой список, чтобы он срабатывал для всех заданий в вашей учетной записи. | Один из следующих вариантов: <ul><li>Пустой список</li> <li>Список идентификаторов заданий</li></ul> |

#### Пример ответа
```json
{
    "data": {
        "id": "wsu_12345abcde",
        "account_identifier": "act_12345abcde",
        "name": "Webhook for jobs",
        "description": "A webhook for when jobs are started",
        "job_ids": [
            "123"
        ],
        "event_types": [
            "job.run.started"
        ],
        "client_url": "https://test.com",
        "active": true,
        "created_at": "1675798888416144",
        "updated_at": "1675804719037018",
        "http_status_code": "200",
        "account_id": "123"
    },
    "status": {
        "code": 200
    }
}
```

#### Схема ответа
| Имя | Описание | Возможные значения |
| --- | --- | --- |
| `id` | Идентификатор вебхука. |  |
| `account_identifier` | Уникальный идентификатор _вашего_ аккаунта <Constant name="cloud" />. |  |
| `name` | Название исходящего вебхука. |  |
| `description` | Полное описание вебхука. |  |
| `job_ids` | Конкретные задания, для которых настроен запуск вебхука. Если список пуст, вебхук будет срабатывать для всех заданий в вашем аккаунте; по умолчанию <Constant name="cloud" /> настраивает вебхуки на уровне аккаунта. | Одно из следующих значений: <ul><li>Пустой список</li> <li>Список идентификаторов заданий</li></ul> |
| `event_types` | Типы событий, при наступлении которых срабатывает вебхук. | Один или несколько из следующих: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL конечной точки приложения, на который <Constant name="cloud" /> может отправлять событие(я). |  |
| `active` | Булево значение, указывающее, активен ли вебхук. | Одно из следующих значений: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Временная метка создания вебхука. |  |
| `updated_at` | Временная метка последнего обновления вебхука. |  |
| `http_status_code` | Последний HTTP-статус вебхука. | Может быть любым [HTTP-кодом ответа](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Если значение равно `0`, это означает, что вебхук ни разу не срабатывал. |
| `account_id` | Идентификатор аккаунта <Constant name="cloud" />. |  |

### Тестирование вебхука
Протестируйте конкретный вебхук.

#### Запрос
```shell
GET https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}/test
```

#### Параметры пути
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL для входа в вашу учетную запись <Constant name="cloud" />. |
| `account_id` | Учетная запись <Constant name="cloud" />, с которой связан вебхук. |
| `webhook_id` | Вебхук, который вы хотите протестировать. |

#### Пример ответа
```json
{
    "data": {
        "verification_error": null,
        "verification_status_code": "200"
    },
    "status": {
        "code": 200
    }
}
```

### Удаление вебхука
Удалите конкретный вебхук.

#### Запрос
```shell
DELETE https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}
```

#### Параметры пути
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL для входа в вашу учетную запись <Constant name="cloud" />. |
| `account_id` | Учетная запись <Constant name="cloud" />, с которой связан webhook. |
| `webhook_id` | Webhook, который вы хотите удалить. |

#### Пример ответа

```json
{
    "data": {
        "id": "wsu_12345abcde"
    },
    "status": {
        "code": 200,
        "is_success": true
    }
}
```

## Связанная документация
- [CI в <Constant name="cloud" />](/docs/deploy/continuous-integration)
- [Использование вебхуков <Constant name="cloud" /> с другими SaaS‑приложениями](/guides?tags=Webhooks)

## Устранение неполадок

Если ваша целевая система не получает вебхуки <Constant name="cloud" />, убедитесь, что она поддерживает заголовки Authorization. Вебхуки <Constant name="cloud" /> отправляют заголовок Authorization, и если ваш endpoint не умеет его обрабатывать, он может быть несовместим. Такие сервисы, как Azure Logic Apps и Power Automate, могут не принимать заголовки Authorization, поэтому они не будут работать с вебхуками <Constant name="cloud" />. Вы можете проверить, поддерживает ли ваш endpoint такие заголовки, отправив запрос с помощью curl с заголовком Authorization, например так:

```shell
curl -H 'Authorization: 123' -X POST https://<your-webhook-endpoint>
```