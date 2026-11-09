---
title: "Вебхуки для ваших заданий" 
sidebar_label: "Вебхуки"
description: "Получайте уведомления о ваших заданиях dbt в реальном времени с помощью вебхуков."
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

# Вебхуки для ваших заданий

С помощью <Constant name="dbt" /> вы можете создавать исходящие вебхуки для отправки событий (уведомлений) о ваших заданиях dbt в другие системы. Эти системы могут отслеживать такие события (подписываться на них), чтобы дополнительно автоматизировать ваши рабочие процессы или запускать настроенные вами сценарии автоматизации.

Вебхук — это функция обратного вызова на основе HTTP, которая позволяет осуществлять коммуникацию, основанную на событиях, между двумя различными веб-приложениями. Это позволяет получать самую актуальную информацию о ваших задачах dbt в реальном времени. Без этого вам пришлось бы многократно делать вызовы API, чтобы проверить, есть ли какие-либо обновления, которые вам нужно учесть (опрос). Из-за этого вебхуки также называют _push API_ или _reverse API_ и часто используют для разработки инфраструктуры.

<Constant name="dbt" /> отправляет JSON-данные на URL-адрес конечной точки вашего приложения при срабатывании вебхука. Вы можете отправить уведомление в [Slack](/guides/zapier-slack), уведомление в [Microsoft Teams](/guides/zapier-ms-teams) или [создать инцидент в PagerDuty](/guides/serverless-pagerduty), если задание dbt завершится с ошибкой. 

Вы можете создавать вебхуки для этих событий через [веб-интерфейс <Constant name="dbt" />](#create-a-webhook-subscription) и с помощью [API <Constant name="dbt" />](#api-for-webhooks):

- `job.run.started` &mdash; Запуск начат.
- `job.run.completed` &mdash; Запуск завершен. Это может быть запуск, который завершился с ошибкой или успешно.
- `job.run.errored` &mdash; Запуск завершился с ошибкой.

<Constant name="dbt" /> делает до пяти повторных попыток отправки каждого события. <Constant name="dbt" /> хранит журнал доставки каждого вебхука в течение 7 дней. У каждого вебхука есть собственный раздел **Recent Deliveries**, в котором можно сразу увидеть, была ли доставка успешной или завершилась сбоем.

Тайм-аут вебхука в <Constant name="dbt" /> составляет 10 секунд. Это означает, что если конечная точка не отвечает в течение 10 секунд, обработчик вебхуков прекращает ожидание. В результате может возникнуть ситуация, когда клиент успешно отвечает по истечении 10-секундного тайм-аута и регистрирует успешный статус, а система вебхуков <Constant name="dbt" /> считает доставку неудачной.

:::tip Видео
Если вас интересует обучение с помощью видео, ознакомьтесь с [курсом по вебхукам на требование](https://learn.getdbt.com/courses/webhooks) от dbt Labs.

Вы также можете ознакомиться с бесплатным [курсом Основы dbt](https://learn.getdbt.com/courses/dbt-fundamentals).
:::

## Предварительные требования 
- У вас есть учетная запись <Constant name="dbt" /> на тарифном плане [Starter или Enterprise](https://www.getdbt.com/pricing/). 
- Для доступа к вебхукам с правом `write`: 
    - **Тарифные планы Enterprise** &mdash; Наборы разрешений одинаковы для сервисных токенов API и пользовательского интерфейса <Constant name="dbt" />. У вас или у сервисного токена API должен быть [набор разрешений](/docs/platform/manage-access/enterprise-permissions) Account Admin, Admin или Developer.  
    - **Учетные записи на тарифном плане Starter** &mdash; Для работы в пользовательском интерфейсе (UI) <Constant name="dbt" /> вам нужна [лицензия Developer](/docs/platform/manage-access/self-service-permissions).
- Вы используете многопользовательскую (multi-tenant) или однопользовательскую (single-tenant) модель развертывания на AWS в <Constant name="dbt" />. Подробнее см. в разделе [Модель размещения](/docs/platform/about-platform/tenancy).
- Ваша целевая система поддерживает [заголовки Authorization](#troubleshooting).

## Создание подписки на вебхук {#create-a-webhook-subscription}

1. Перейдите в **Account settings** в <Constant name="dbt" /> (нажмите на название своей учетной записи на левой боковой панели)
2. Перейдите в раздел **Webhooks** и нажмите **Create webhook**. 
3. Настройте новый вебхук: 
   - **Webhook name** &mdash; Введите имя исходящего вебхука.
   - **Description** &mdash; Введите описание вебхука.
   - **Events** &mdash; Выберите событие, которое должно вызывать срабатывание этого вебхука. Можно подписаться на несколько событий.
   - **Jobs** &mdash; Укажите задания, для которых должен срабатывать вебхук. Также можно оставить это поле пустым, чтобы вебхук срабатывал для всех заданий в вашей учетной записи. По умолчанию <Constant name="dbt" /> настраивает вебхук на уровне учетной записи. 
   - **Endpoint** &mdash; Введите URL конечной точки вашего приложения, на который <Constant name="dbt" /> сможет отправлять события.
4. По завершении нажмите **Save**. 
   
   <Constant name="dbt" /> предоставляет секретный токен, который можно использовать для [проверки подлинности вебхука](#validate-a-webhook). Настоятельно рекомендуется выполнять эту проверку на вашем сервере, чтобы защититься от поддельных запросов (спуфинга).


## Архивированные вебхуки

dbt автоматически архивирует вебхук после 1 000 неудачных попыток доставки подряд или 7 дней подряд с неудачными попытками доставки — в зависимости от того, что наступит раньше.

- На странице **Account settings → Webhooks** в <Constant name="dbt_platform"/> появляется предупреждающий баннер, который можно закрыть, если одна или несколько подписок архивированы.
- У архивированных подписок в столбце статуса вместо HTTP-статуса отображается значок **Archived**.
- Наведите указатель на значок, чтобы узнать, почему dbt архивировал подписку и как ее повторно активировать.

<Lightbox src="/img/docs/deploy/webhooks-archived.png" width="100%" title="Страница вебхуков с предупреждающим баннером об архивированной подписке и значком статуса «Archived»"/>

Чтобы повторно активировать вебхук, воспользуйтесь одним из следующих способов:

- **Пользовательский интерфейс <Constant name="dbt_platform"/>**: Измените URL конечной точки вебхука. <Constant name="dbt" /> автоматически повторно активирует вебхук при изменении URL.
- **REST API**: Отправьте запрос `PUT` для [обновления вебхука](#update-a-webhook) и задайте для `active` значение `true` или укажите в `client_url` новый URL конечной точки.
- **Провайдер Terraform**: Задайте `active = true` и обновите `client_url` в ресурсе вебхука.

Чтобы найти подходящий URL доступа к <Constant name="dbt" /> для вашего региона и тарифного плана, обратитесь к разделу [Регионы и IP-адреса](/docs/platform/about-platform/access-regions-ip-addresses).

### Различия между событиями вебхуков completed и errored {#completed-errored-event-difference}
Событие `job.run.errored` — это частный случай событий `job.run.completed`. Если вы подпишетесь на оба события, то получите два уведомления при возникновении ошибки в задании. Однако <Constant name="dbt" /> инициирует эти два события в разные моменты:

- `job.run.completed` &mdash; Это событие возникает только после того, как метаданные и артефакты задания будут загружены и станут доступны через Admin API и Discovery API <Constant name="dbt" />. 
- `job.run.errored` &mdash; Это событие возникает немедленно, поэтому метаданные и артефакты задания могут быть еще не загружены. Это означает, что соответствующая информация может быть пока недоступна для использования.

Если ваша интеграция зависит от данных из Admin API (например, доступ к журналам запуска) или Discovery API (доступ к статусам моделей), используйте событие `job.run.completed` и фильтруйте по `runStatus` или `runStatusCode`.

Если ваша интеграция не зависит от дополнительных данных или если улучшенная производительность доставки более важна для вас, используйте `job.run.errored` и настройте вашу интеграцию для обработки вызовов API, которые могут не возвращать данные в течение короткого времени вначале.

## Проверка вебхука {#validate-a-webhook}

Вы можете использовать секретный токен, предоставленный dbt Cloud, чтобы проверить, что вебхуки, полученные вашей конечной точкой, действительно были отправлены dbt Cloud. Официальные вебхуки будут включать заголовок `Authorization`, который содержит SHA256-хэш тела запроса и использует секретный токен в качестве ключа.

Вы можете использовать секретный токен, предоставленный <Constant name="dbt" />, чтобы убедиться, что вебхуки, полученные вашей конечной точкой, действительно были отправлены <Constant name="dbt" />. Официальные вебхуки содержат заголовок `Authorization` с хешем SHA256 тела запроса, вычисленным с использованием секретного токена в качестве ключа.

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

## Инспекция HTTP-запросов {#inspect-http-requests}
При работе с вебхуками рекомендуется использовать такие инструменты, как [RequestBin](https://requestbin.com/) и [Requestly](https://requestly.io/). Эти инструменты позволяют инспектировать ваши HTML-запросы, полезные нагрузки ответов и заголовки ответов, чтобы вы могли отлаживать и тестировать вебхуки перед их интеграцией в ваши системы.

## Примеры JSON-пакетов {#examples-of-json-payloads}

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
Вы можете использовать API <Constant name="dbt" />, чтобы создавать новые подписки на вебхуки, получать подробную информацию о своих вебхуках и управлять вебхуками, связанными с вашей учетной записью. В следующих разделах описаны конечные точки API, которые можно использовать для этого. 

:::info URL-адреса доступа
<Constant name="dbt" /> размещается в нескольких регионах мира, и у каждого региона свой URL-адрес доступа. Пользователи тарифных планов Enterprise могут выбрать любой из этих регионов для размещения своей учетной записи. Полный список доступных URL-адресов доступа к <Constant name="dbt" /> приведен в разделе [Регионы и IP-адреса](/docs/platform/about-platform/access-regions-ip-addresses).   
:::

### Получение списка всех подписок на вебхуки
Получите список всех вебхуков, доступных в определенной учетной записи <Constant name="dbt" />.

#### Запрос {#request}
```shell
GET https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscriptions
```

#### Параметры пути {#path-parameters}
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL для входа в вашу учетную запись <Constant name="dbt" />. |
| `account_id` | Учетная запись <Constant name="dbt" />, с которой связаны вебхуки. |

#### Пример ответа {#response-sample}
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

#### Схема ответа {#response-schema}
| Имя | Описание | Возможные значения |
| --- | --- | --- |
| `data` | Список доступных вебхуков для указанного идентификатора аккаунта <Constant name="dbt" />. |  |
| `id` | Идентификатор вебхука. Это универсальный уникальный идентификатор (UUID), уникальный во всех регионах, включая мультитенантные и однотенантные среды. |  |
| `account_identifier` | Уникальный идентификатор _вашего_ аккаунта <Constant name="dbt" />. |  |
| `name` | Название исходящего вебхука. |  |
| `description` | Описание вебхука. |  |
| `job_ids` | Конкретные задания, для которых настроено срабатывание вебхука. Если список пуст, вебхук настроен на срабатывание для всех заданий в вашем аккаунте; по умолчанию <Constant name="dbt" /> настраивает вебхуки на уровне аккаунта. | <ul><li>Пустой список</li> <li>Список идентификаторов заданий</li></ul> |
| `event_types` | Типы событий, при которых настроено срабатывание вебхука. | Один или несколько из следующих типов: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL конечной точки приложения, на который <Constant name="dbt" /> может отправлять события. |  |
| `active` | Логическое значение, указывающее, активен ли вебхук. | Одно из следующих значений: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Отметка времени создания вебхука. |  |
| `updated_at` | Отметка времени последнего обновления вебхука. |  |
| `http_status_code` | Последний код состояния HTTP для вебхука. | Может быть любым [кодом состояния ответа HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Значение `0` означает, что вебхук ни разу не срабатывал. |
| `dispatched_at` | Отметка времени последней отправки вебхука на указанный URL конечной точки. |  |
| `account_id` | Идентификатор аккаунта <Constant name="dbt" />. |  |

### Получение подробной информации о вебхуке {#get-details-about-a-webhook}
Получите подробную информацию о конкретном вебхуке.

#### Запрос {#request-1}
```shell
GET https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}
```
#### Параметры пути {#path-parameters-1}
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL для входа в вашу учетную запись <Constant name="dbt" />. |
| `account_id` | Учетная запись <Constant name="dbt" />, с которой связан вебхук. |
| `webhook_id` | Вебхук, о котором вы хотите получить подробную информацию. |

#### Пример ответа {#response-sample-1}
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

#### Схема ответа {#response-schema-1}
| Имя | Описание | Возможные значения |
| --- | --- | --- |
| `id` | Идентификатор вебхука. |  |
| `account_identifier` | Уникальный идентификатор _вашей_ учетной записи <Constant name="dbt" />. |  |
| `name` | Название исходящего вебхука. |  |
| `description` | Полное описание вебхука. |  |
| `event_types` | Тип события, при котором настроено срабатывание вебхука. | Один или несколько из следующих типов: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL конечной точки приложения, на который <Constant name="dbt" /> может отправлять события. |  |
| `active` | Логическое значение, указывающее, активен ли вебхук. | Одно из следующих значений: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Метка времени создания вебхука. |  |
| `updated_at` | Метка времени последнего обновления вебхука. |  |
| `dispatched_at` | Метка времени последней отправки вебхука на указанный URL конечной точки. |  |
| `account_id` | Идентификатор учетной записи <Constant name="dbt" />. |  |
| `job_ids` | Конкретные задания, для которых настроено срабатывание вебхука. Если список пуст, вебхук настроен на срабатывание для всех заданий в вашей учетной записи; по умолчанию <Constant name="dbt" /> настраивает вебхуки на уровне учетной записи. | Один из следующих вариантов: <ul><li>Пустой список</li> <li>Список идентификаторов заданий</li></ul> |
| `http_status_code` | Последний код состояния HTTP для вебхука. | Может быть любым [кодом состояния ответа HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Если значение равно `0`, это означает, что вебхук еще ни разу не срабатывал. |

### Создание новой подписки на вебхук {#create-a-new-webhook-subscription}
Создайте новый исходящий вебхук и укажите URL-адрес конечной точки, который будет подписываться (слушать) на события вебхука.

#### Пример запроса {#request-sample}

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

#### Параметры пути {#path-parameters-2}
| Имя | Описание |
| --- | --- |
| `your access URL` | URL для входа в вашу учетную запись <Constant name="dbt" />. |
| `account_id` | Учетная запись <Constant name="dbt" />, с которой связан вебхук. |

#### Параметры запроса {#request-parameters}
| Имя | Описание | Возможные значения |
| --- | --- | --- |
| `event_types` | Укажите событие, которое должно вызывать срабатывание этого вебхука. Вы можете подписаться на несколько событий. | Одно или несколько из следующих событий: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `name` | Укажите имя вашего вебхука. |  |
| `client_url` | Укажите URL конечной точки вашего приложения, на который <Constant name="dbt" /> сможет отправлять события.|  |
| `active` | Укажите логическое значение, определяющее, активен ли ваш вебхук. | Одно из следующих значений: <ul><li>`true`</li><li>`false`</li></ul> |
| `description` | Укажите описание вашего вебхука. |  |
| `job_ids` | Укажите конкретные задания, для которых должен срабатывать вебхук, или оставьте этот параметр пустым списком. Если список пуст, вебхук будет срабатывать для всех заданий в вашей учётной записи; по умолчанию <Constant name="dbt" /> настраивает вебхуки на уровне учётной записи. | Один из следующих вариантов: <ul><li>Пустой список</li> <li>Список идентификаторов заданий</li></ul> |

#### Пример ответа {#response-sample-2}
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

#### Схема ответа {#response-schema-2}
| Имя | Описание | Возможные значения |
| --- | --- | --- |
| `id` | Идентификатор вебхука. |  |
| `account_identifier` | Уникальный идентификатор _вашей_ учетной записи <Constant name="dbt" />. |  |
| `name` | Название исходящего вебхука. |  |
| `description` | Полное описание вебхука. |  |
| `job_ids` | Конкретные задания, для которых настроено срабатывание вебхука. Если список пуст, вебхук настроен на срабатывание для всех заданий в вашей учетной записи; по умолчанию <Constant name="dbt" /> настраивает вебхуки на уровне учетной записи. | Один из вариантов: <ul><li>Пустой список</li> <li>Список идентификаторов заданий</li></ul> |
| `event_types` | Тип события, при котором настроено срабатывание вебхука. | Один или несколько из следующих вариантов: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL конечной точки приложения, на которую <Constant name="dbt" /> может отправлять события. |  |
| `hmac_secret` | Секретный ключ для вашего нового вебхука. Этот ключ можно использовать для [проверки подлинности этого вебхука](#validate-a-webhook). |  |
| `active` | Логическое значение, указывающее, активен ли вебхук. | Один из вариантов: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Метка времени создания вебхука. |  |
| `updated_at` | Метка времени последнего обновления вебхука. |  |
| `account_id` | Идентификатор учетной записи <Constant name="dbt" />. |  |
| `http_status_code` | Последний код состояния HTTP вебхука. | Может быть любым [кодом состояния ответа HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Если значение равно `0`, это означает, что вебхук еще ни разу не срабатывал. |

### Обновление вебхука {#update-a-webhook}
Обновите детали конфигурации для конкретного вебхука.

#### Пример запроса {#request-sample-1}
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

#### Параметры пути {#path-parameters-3}
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL для входа в вашу учетную запись <Constant name="dbt" />. |
| `account_id` | Учетная запись <Constant name="dbt" />, с которой связан вебхук. |
| `webhook_id` | Вебхук, который вы хотите обновить. |

#### Параметры запроса {#request-parameters-1}
| Имя | Описание | Возможные значения |
|------|-------------|-----------------|
| `event_types` | Измените тип события, при котором срабатывает вебхук. Можно подписаться на несколько типов событий. | Один или несколько из следующих типов: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `name` | Измените имя вебхука. |  |
| `client_url` | Обновите URL конечной точки приложения, на которую <Constant name="dbt" /> может отправлять события. |  |
| `active` | Измените логическое значение, указывающее, активен ли вебхук. | Одно из следующих значений: <ul><li>`true`</li><li>`false`</li></ul> |
| `description` | Обновите описание вебхука. |  |
| `job_ids` | Измените список заданий, для которых должен срабатывать вебхук. Также можно использовать пустой список, чтобы вебхук срабатывал для всех заданий в вашем аккаунте. | Один из следующих вариантов: <ul><li>Пустой список</li> <li>Список идентификаторов заданий</li></ul> |

#### Пример ответа {#response-sample-3}
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

#### Схема ответа {#response-schema-3}
| Имя | Описание | Возможные значения |
| --- | --- | --- |
| `id` | Идентификатор вебхука. |  |
| `account_identifier` | Уникальный идентификатор _вашего_ аккаунта <Constant name="dbt" />. |  |
| `name` | Название исходящего вебхука. |  |
| `description` | Полное описание вебхука. |  |
| `job_ids` | Конкретные задания, для которых настроено срабатывание вебхука. Если список пуст, вебхук настроен на срабатывание для всех заданий в вашем аккаунте; по умолчанию <Constant name="dbt" /> настраивает вебхуки на уровне аккаунта. | Один из вариантов: <ul><li>Пустой список</li> <li>Список идентификаторов заданий</li></ul> |
| `event_types` | Тип события, при котором срабатывает вебхук. | Один или несколько из следующих типов: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | URL конечной точки приложения, на которую <Constant name="dbt" /> может отправлять события. |  |
| `active` | Логическое значение, указывающее, активен ли вебхук. | Одно из значений: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Временная метка создания вебхука. |  |
| `updated_at` | Временная метка последнего обновления вебхука. |  |
| `http_status_code` | Последний код состояния HTTP для вебхука. | Может быть любым [кодом состояния ответа HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). Если значение равно `0`, это означает, что вебхук ещё ни разу не срабатывал. |
| `account_id` | Идентификатор аккаунта <Constant name="dbt" />. |  |

### Тестирование вебхука {#test-a-webhook}
Протестируйте конкретный вебхук.

#### Запрос {#request-2}
```shell
GET https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}/test
```

#### Параметры пути {#path-parameters-4}
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL для входа в вашу учетную запись <Constant name="dbt" />. |
| `account_id` | Учетная запись <Constant name="dbt" />, с которой связан вебхук. |
| `webhook_id` | Вебхук, который вы хотите протестировать.  |

#### Пример ответа {#response-sample-4}
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

### Удаление вебхука {#delete-a-webhook}
Удалите конкретный вебхук.

#### Запрос {#request-3}
```shell
DELETE https://{your access URL}/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}
```

#### Параметры пути {#path-parameters-5}
| Имя | Описание |
|------------|--------------------------------------|
| `your access URL` | URL для входа в вашу учетную запись <Constant name="dbt" />. |
| `account_id` | Учетная запись <Constant name="dbt" />, с которой связан вебхук. |
| `webhook_id` | Вебхук, который вы хотите удалить. |

#### Пример ответа {#response-sample-5}

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
- [CI в <Constant name="dbt" />](/docs/deploy/continuous-integration)
- [Использование вебхуков <Constant name="dbt" /> с другими SaaS-приложениями](/guides?tags=Webhooks)

## Устранение неполадок {#troubleshooting}

Если ваша целевая система не получает вебхуки <Constant name="dbt" />, убедитесь, что она допускает заголовки Authorization. Вебхуки <Constant name="dbt" /> отправляют заголовок Authorization, и если ваш эндпоинт не поддерживает его, он может быть несовместим с ними. Такие сервисы, как Azure Logic Apps и Power Automate, могут не принимать заголовки Authorization, поэтому они не будут работать с вебхуками <Constant name="dbt" />. Вы можете проверить, поддерживает ли ваш эндпоинт этот заголовок, отправив запрос с помощью curl с заголовком Authorization, например так:

```shell
curl -H 'Authorization: 123' -X POST https://<your-webhook-endpoint>
```
