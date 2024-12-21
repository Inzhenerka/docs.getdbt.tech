---
title: "Вебхуки для ваших задач"
sidebar_label: "Вебхуки"
description: "Получайте уведомления в реальном времени о ваших задачах dbt с помощью вебхуков."
---

С помощью dbt Cloud вы можете создавать исходящие вебхуки для отправки событий (уведомлений) о ваших задачах dbt в другие системы. Ваши другие системы могут слушать (подписываться на) эти события для дальнейшей автоматизации ваших рабочих процессов или для запуска автоматизированных процессов, которые вы настроили.

Вебхук — это функция обратного вызова на основе HTTP, которая позволяет осуществлять коммуникацию, основанную на событиях, между двумя различными веб-приложениями. Это позволяет получать самую актуальную информацию о ваших задачах dbt в реальном времени. Без этого вам пришлось бы многократно делать вызовы API, чтобы проверить, есть ли какие-либо обновления, которые вам нужно учесть (опрос). Из-за этого вебхуки также называют _push API_ или _reverse API_ и часто используют для разработки инфраструктуры.

dbt Cloud отправляет JSON-пакет на URL-адрес конечной точки вашего приложения, когда ваш вебхук срабатывает. Вы можете отправить уведомление в [Slack](/guides/zapier-slack), уведомление в [Microsoft Teams](/guides/zapier-ms-teams), [открыть инцидент в PagerDuty](/guides/serverless-pagerduty), когда задача dbt завершается с ошибкой.

Вы можете создавать вебхуки для этих событий из [веб-интерфейса dbt Cloud](#create-a-webhook-subscription) и с помощью [API dbt Cloud](#api-for-webhooks):

- `job.run.started` &mdash; Запуск начат.
- `job.run.completed` &mdash; Запуск завершен. Это может быть запуск, который завершился с ошибкой или успешно.
- `job.run.errored` &mdash; Запуск завершился с ошибкой.

dbt Cloud повторяет отправку каждого события пять раз. dbt Cloud хранит журнал каждой доставки вебхука в течение 30 дней. У каждого вебхука есть собственный раздел **Recent Deliveries**, который показывает, была ли доставка успешной или неудачной.

Вебхук в dbt Cloud имеет тайм-аут в 10 секунд. Это означает, что если конечная точка не ответит в течение 10 секунд, процессор вебхуков завершит работу по тайм-ауту. Это может привести к ситуации, когда клиент успешно отвечает после 10-секундного тайм-аута и фиксирует статус успеха, в то время как система вебхуков dbt Cloud интерпретирует это как неудачу.

:::tip Видео
Если вас интересует обучение с помощью видео, ознакомьтесь с [курсом по вебхукам на требование](https://learn.getdbt.com/courses/webhooks) от dbt Labs.

Вы также можете ознакомиться с бесплатным [курсом Основы dbt](https://learn.getdbt.com/courses/dbt-fundamentals).
:::

## Предварительные условия
- У вас есть учетная запись dbt Cloud на [плане Team или Enterprise](https://www.getdbt.com/pricing/).
- Для доступа `write` к вебхукам:
    - **Учетные записи плана Enterprise** &mdash; Наборы разрешений одинаковы как для токенов службы API, так и для интерфейса dbt Cloud. Вы или токен службы API должны иметь набор разрешений Account Admin, Admin или Developer [permission set](/docs/cloud/manage-access/enterprise-permissions).
    - **Учетные записи плана Team** &mdash; Для интерфейса dbt Cloud вам необходимо иметь [лицензию разработчика](/docs/cloud/manage-access/self-service-permissions). Для токенов службы API вы должны назначить токен службы, чтобы иметь набор разрешений [Account Admin или Member](/docs/dbt-cloud-apis/service-tokens#team-plans-using-service-account-tokens).
- У вас есть многопользовательская или одноарендная модель развертывания AWS в dbt Cloud. Для получения дополнительной информации обратитесь к [Многопользовательской среде](/docs/cloud/about-cloud/tenancy).
- Ваша система назначения поддерживает [заголовки авторизации](#troubleshooting).

## Создание подписки на вебхук {#create-a-webhook-subscription}

Перейдите в **Настройки учетной записи** в dbt Cloud (нажав на имя вашей учетной записи в левой панели) и нажмите **Создать новый вебхук** в разделе **Вебхуки**. Вы можете найти соответствующий URL-адрес доступа dbt Cloud для вашего региона и плана с помощью [Регионы и IP-адреса](/docs/cloud/about-cloud/access-regions-ip-addresses).

Чтобы настроить новый вебхук:

- **Имя** &mdash; Введите имя для вашего исходящего вебхука.
- **Описание** &mdash; Введите описание вебхука.
- **События** &mdash; Выберите событие, которое вы хотите использовать для запуска этого вебхука. Вы можете подписаться на более чем одно событие.
- **Задачи** &mdash; Укажите задачу(и), на которые вы хотите, чтобы вебхук срабатывал. Или вы можете оставить это поле пустым, чтобы вебхук срабатывал на все задачи в вашей учетной записи. По умолчанию dbt Cloud настраивает ваш вебхук на уровне учетной записи.
- **Конечная точка** &mdash; Введите URL-адрес конечной точки вашего приложения, куда dbt Cloud может отправлять событие(я).

Когда закончите, нажмите **Сохранить**. dbt Cloud предоставляет секретный токен, который вы можете использовать для [проверки подлинности вебхука](#validate-a-webhook). Настоятельно рекомендуется выполнять эту проверку на вашем сервере, чтобы защитить себя от поддельных (подставных) запросов.

### Различия между завершенными и ошибочными событиями вебхуков {#completed-errored-event-difference}
Событие `job.run.errored` является подмножеством событий `job.run.completed`. Если вы подписаны на оба, вы получите два уведомления, когда ваша задача столкнется с ошибкой. Однако dbt Cloud запускает два события в разное время:

- `job.run.completed` &mdash; Это событие срабатывает только после того, как метаданные и артефакты задачи были загружены и доступны из API dbt Cloud Admin и Discovery.
- `job.run.errored` &mdash; Это событие срабатывает немедленно, поэтому метаданные и артефакты задачи могут не быть загружены. Это означает, что информация может быть недоступна для использования.

Если ваша интеграция зависит от данных из Admin API (например, доступ к журналам запуска) или Discovery API (доступ к статусам моделей), используйте событие `job.run.completed` и фильтруйте по `runStatus` или `runStatusCode`.

Если ваша интеграция не зависит от дополнительных данных или если улучшенная производительность доставки более важна для вас, используйте `job.run.errored` и настройте вашу интеграцию для обработки вызовов API, которые могут не возвращать данные в течение короткого времени вначале.

## Проверка вебхука

Вы можете использовать секретный токен, предоставленный dbt Cloud, чтобы проверить, что вебхуки, полученные вашей конечной точкой, действительно были отправлены dbt Cloud. Официальные вебхуки будут включать заголовок `Authorization`, который содержит SHA256-хэш тела запроса и использует секретный токен в качестве ключа.

Пример проверки подлинности вебхука на Python:

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
  "webhooksID": "wsu_12345abcde",
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
    "runReason": "Kicked off from UI by test@test.com",
    "runStartedAt": "2023-01-31T19:28:07Z"
  }
}
```

Пример пакета вебхука для завершенного запуска:

```json
{
  "accountId": 1,
  "webhooksID": "wsu_12345abcde",
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
    "runReason": "Kicked off from UI by test@test.com",
    "runStartedAt": "2023-01-31T19:28:07Z",
    "runFinishedAt": "2023-01-31T19:29:32Z"
  }
}
```

Пример пакета вебхука для запуска с ошибкой:

```json
{
  "accountId": 1,
  "webhooksID": "wsu_12345abcde",
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
    "runReason": "Kicked off from UI by test@test.com",
    "runStartedAt": "2023-01-31T21:14:41Z",
    "runErroredAt": "2023-01-31T21:15:20Z"
  }
}
```

## API для вебхуков {#api-for-webhooks}
Вы можете использовать API dbt Cloud для создания новых вебхуков, на которые вы хотите подписаться, получения подробной информации о ваших вебхуках и управления вебхуками, связанными с вашей учетной записью. В следующих разделах описаны конечные точки API, которые вы можете использовать для этого.

:::info URL-адреса доступа
dbt Cloud размещен в нескольких регионах мира, и каждый регион имеет свой URL-адрес доступа. Пользователи на планах Enterprise могут выбрать размещение своей учетной записи в любом из этих регионов. Для полного списка доступных URL-адресов доступа dbt Cloud обратитесь к [Регионы и IP-адреса](/docs/cloud/about-cloud/access-regions-ip-addresses).
:::

### Список всех подписок на вебхуки
Список всех вебхуков, доступных из конкретной учетной записи dbt Cloud.

#### Запрос
```shell
GET https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscriptions
```

#### Параметры пути
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL-адрес входа в вашу учетную запись dbt Cloud. |
| `account_id` | Учетная запись dbt Cloud, с которой связаны вебхуки. |

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
            "name": "Notication Webhook",
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
| `data` | Список доступных вебхуков для указанного ID учетной записи dbt Cloud. |  |
| `id` | ID вебхука. Это универсальный уникальный идентификатор (UUID), уникальный для всех регионов, включая многопользовательские и одноарендные. |  |
| `account_identifier` | Уникальный идентификатор для _вашей_ учетной записи dbt Cloud. |  |
| `name` | Имя исходящего вебхука. |  |
| `description` | Описание вебхука. |  |
| `job_ids` | Конкретные задачи, для которых настроен вебхук. Когда список пуст, вебхук настроен для срабатывания на все задачи в вашей учетной записи; по умолчанию dbt Cloud настраивает вебхуки на уровне учетной записи. | <ul><li>Пустой список</li> <li>Список ID задач</li></ul> |
| `event_types` | Тип(ы) события, на которые настроен вебхук. | Один или несколько из следующих: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL-адрес конечной точки для приложения, куда dbt Cloud может отправлять событие(я). |  |
| `active` | Логическое значение, указывающее, активен ли вебхук. | Одно из следующих: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Временная метка создания вебхука. |  |
| `updated_at` | Временная метка последнего обновления вебхука. |  |
| `http_status_code` | Последний HTTP-статус вебхука. | Может быть любым [кодом состояния HTTP-ответа](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Если значение `0`, это означает, что вебхук никогда не срабатывал. |
| `dispatched_at` | Временная метка последней отправки вебхука на указанную конечную точку. |  |
| `account_id` | ID учетной записи dbt Cloud. |  |

### Получение подробной информации о вебхуке
Получите подробную информацию о конкретном вебхуке.

#### Запрос
```shell
GET https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}
```
#### Параметры пути
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL-адрес входа в вашу учетную запись dbt Cloud. |
| `account_id` | Учетная запись dbt Cloud, с которой связан вебхук. |
| `webhook_id` | Вебхук, о котором вы хотите получить подробную информацию. |

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
| `id` | ID вебхука. |  |
| `account_identifier` | Уникальный идентификатор для _вашей_ учетной записи dbt Cloud. |  |
| `name` | Имя исходящего вебхука. |  |
| `description` | Полное описание вебхука. |  |
| `event_types` | Тип события, на которое настроен вебхук. | Один или несколько из следующих: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL-адрес конечной точки для приложения, куда dbt Cloud может отправлять событие(я). |  |
| `active` | Логическое значение, указывающее, активен ли вебхук. | Одно из следующих: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Временная метка создания вебхука. |  |
| `updated_at` | Временная метка последнего обновления вебхука. |  |
| `dispatched_at` | Временная метка последней отправки вебхука на указанную конечную точку. |  |
| `account_id` | ID учетной записи dbt Cloud. |  |
| `job_ids` | Конкретные задачи, для которых настроен вебхук. Когда список пуст, вебхук настроен для срабатывания на все задачи в вашей учетной записи; по умолчанию dbt Cloud настраивает вебхуки на уровне учетной записи. | Один из следующих: <ul><li>Пустой список</li> <li>Список ID задач</li></ul> |
| `http_status_code` | Последний HTTP-статус вебхука. | Может быть любым [кодом состояния HTTP-ответа](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Если значение `0`, это означает, что вебхук никогда не срабатывал. |

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
| `your access URL` | URL-адрес входа в вашу учетную запись dbt Cloud. |
| `account_id` | Учетная запись dbt Cloud, с которой связан вебхук. |

#### Параметры запроса
| Имя | Описание | Возможные значения |
| --- | --- | --- |
| `event_types` | Введите событие, которое вы хотите использовать для запуска этого вебхука. Вы можете подписаться на более чем одно событие. | Один или несколько из следующих: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `name` | Введите имя вашего вебхука. |  |
| `client_url` | Введите URL-адрес конечной точки вашего приложения, куда dbt Cloud может отправлять событие(я).|  |
| `active` | Введите логическое значение, указывающее, активен ли ваш вебхук. | Одно из следующих: <ul><li>`true`</li><li>`false`</li></ul> |
| `description` | Введите описание вашего вебхука. |  |
| `job_ids` | Введите конкретные задачи, на которые вы хотите, чтобы вебхук срабатывал, или вы можете оставить этот параметр пустым списком. Если это пустой список, вебхук настроен для срабатывания на все задачи в вашей учетной записи; по умолчанию dbt Cloud настраивает вебхуки на уровне учетной записи. | Один из следующих: <ul><li>Пустой список</li> <li>Список ID задач</li></ul> |

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
| `id` | ID вебхука. |  |
| `account_identifier` | Уникальный идентификатор для _вашей_ учетной записи dbt Cloud. |  |
| `name` | Имя исходящего вебхука. |  |
| `description` | Полное описание вебхука. |  |
| `job_ids` | Конкретные задачи, для которых настроен вебхук. Когда список пуст, вебхук настроен для срабатывания на все задачи в вашей учетной записи; по умолчанию dbt Cloud настраивает вебхуки на уровне учетной записи. | Один из следующих: <ul><li>Пустой список</li> <li>Список ID задач</li></ul> |
| `event_types` | Тип события, на которое настроен вебхук. | Один или несколько из следующих: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL-адрес конечной точки для приложения, куда dbt Cloud может отправлять событие(я). |  |
| `hmac_secret` | Секретный ключ для вашего нового вебхука. Вы можете использовать этот ключ для [проверки подлинности этого вебхука](#validate-a-webhook). |  |
| `active` | Логическое значение, указывающее, активен ли вебхук. | Одно из следующих: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Временная метка создания вебхука. |  |
| `updated_at` | Временная метка последнего обновления вебхука. |  |
| `account_id` | ID учетной записи dbt Cloud. |  |
| `http_status_code` | Последний HTTP-статус вебхука. | Может быть любым [кодом состояния HTTP-ответа](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Если значение `0`, это означает, что вебхук никогда не срабатывал. |

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
| `your access URL` | URL-адрес входа в вашу учетную запись dbt Cloud. |
| `account_id` | Учетная запись dbt Cloud, с которой связан вебхук. |
| `webhook_id` | Вебхук, который вы хотите обновить. |

#### Параметры запроса
| Имя | Описание | Возможные значения |
|------|-------------|-----------------|
| `event_types` | Обновите тип события, на которое настроен вебхук. Вы можете подписаться на более чем одно. | Один или несколько из следующих: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `name` | Измените имя вашего вебхука. |  |
| `client_url` | Обновите URL-адрес конечной точки для приложения, куда dbt Cloud может отправлять событие(я). |  |
| `active` | Измените логическое значение, указывающее, активен ли вебхук. | Одно из следующих: <ul><li>`true`</li><li>`false`</li></ul> |
| `description` | Обновите описание вебхука. |  |
| `job_ids` | Измените, для каких задач вы хотите, чтобы вебхук срабатывал. Или вы можете использовать пустой список, чтобы он срабатывал для всех задач в вашей учетной записи. | Один из следующих: <ul><li>Пустой список</li> <li>Список ID задач</li></ul> |

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
| `id` | ID вебхука. |  |
| `account_identifier` | Уникальный идентификатор для _вашей_ учетной записи dbt Cloud. |  |
| `name` | Имя исходящего вебхука. |  |
| `description` | Полное описание вебхука. |  |
| `job_ids` | Конкретные задачи, для которых настроен вебхук. Когда список пуст, вебхук настроен для срабатывания на все задачи в вашей учетной записи; по умолчанию dbt Cloud настраивает вебхуки на уровне учетной записи. | Один из следующих: <ul><li>Пустой список</li> <li>Список ID задач</li></ul> |
| `event_types` | Тип события, на которое настроен вебхук. | Один или несколько из следующих: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL-адрес конечной точки для приложения, куда dbt Cloud может отправлять событие(я). |  |
| `active` | Логическое значение, указывающее, активен ли вебхук. | Одно из следующих: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Временная метка создания вебхука. |  |
| `updated_at` | Временная метка последнего обновления вебхука. |  |
| `http_status_code` | Последний HTTP-статус вебхука. | Может быть любым [кодом состояния HTTP-ответа](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Если значение `0`, это означает, что вебхук никогда не срабатывал. |
| `account_id` | ID учетной записи dbt Cloud. |  |

### Тестирование вебхука
Протестируйте конкретный вебхук.

#### Запрос
```shell
GET https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}/test
```

#### Параметры пути
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL-адрес входа в вашу учетную запись dbt Cloud. |
| `account_id` | Учетная запись dbt Cloud, с которой связан вебхук. |
| `webhook_id` | Вебхук, который вы хотите протестировать.  |

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
| `your access URL` | URL-адрес входа в вашу учетную запись dbt Cloud. |
| `account_id` | Учетная запись dbt Cloud, с которой связан вебхук. |
| `webhook_id` | Вебхук, который вы хотите удалить. |

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

## Связанные документы
- [dbt Cloud CI](/docs/deploy/continuous-integration)
- [Использование вебхуков dbt Cloud с другими SaaS-приложениями](https://docs.getdbt.com/guides?tags=Webhooks)

## Устранение неполадок

Если ваша система назначения не получает вебхуки dbt Cloud, убедитесь, что она поддерживает заголовки авторизации. Вебхуки dbt Cloud отправляют заголовок Authorization, и если ваша конечная точка не поддерживает это, она может быть несовместима. Сервисы, такие как Azure Logic Apps и Power Automate, могут не принимать заголовки авторизации, поэтому они не будут работать с вебхуками dbt Cloud. Вы можете протестировать поддержку вашей конечной точки, отправив запрос с помощью curl и заголовка Authorization, как показано ниже:

```shell
curl -H 'Authorization: 123' -X POST https://<your-webhook-endpoint>
```