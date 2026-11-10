---
title: "Запросы к Discovery API"
id: "discovery-querying"
sidebar_label: "Выполнение запросов к Discovery API"
pagination_next: "docs/dbt-apis/discovery-schema-environment"
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

import ApiRateLimitsCallout from '/snippets/_api-rate-limits-callout.md';

Discovery API поддерживает разовые запросы и интеграции. Если вы только начинаете работать с этим API, ознакомьтесь с вводной информацией в разделе [О Discovery API](/docs/dbt-apis/discovery-api).

<ApiRateLimitsCallout />

Используйте Discovery API для оценки состояния конвейеров данных и состояния проекта как на протяжении нескольких запусков, так и в конкретный момент времени. dbt Labs предоставляет стандартный [GraphQL explorer](https://metadata.cloud.getdbt.com/graphql) для этого API, который позволяет выполнять запросы и просматривать схему. При этом вы также можете использовать любой другой GraphQL-клиент по своему выбору для обращения к API.

Поскольку GraphQL описывает данные, доступные в API, схема, отображаемая в GraphQL explorer, точно отражает граф и поля, доступные для запросов.

<Snippet path="metadata-api-prerequisites" />

## Авторизация {#authorization}

В настоящее время авторизация запросов выполняется [с помощью сервисного токена](/docs/dbt-apis/service-tokens). Пользователи <Constant name="dbt" /> с правами администратора могут создать сервисный токен с уровнем доступа Metadata Only, который разрешает выполнение определённого запроса к Discovery API.

Создав токен, вы можете использовать его в заголовке Authorization запросов к <Constant name="dbt" /> Discovery API. Обязательно укажите префикс Token в заголовке Authorization, иначе запрос завершится с ошибкой `401 Unauthorized`. Обратите внимание, что в заголовке Authorization вместо `Token` можно использовать `Bearer`. Оба варианта синтаксиса эквивалентны.

## Доступ к Discovery API {#access-the-discovery-api}

1. Создайте [токен сервисного аккаунта](/docs/dbt-apis/service-tokens) для авторизации запросов. Пользователи <Constant name="dbt" /> с правами администратора могут сгенерировать сервисный токен _Metadata Only_, который можно использовать для выполнения определённого запроса к Discovery API для авторизации запросов.

2. Определите URL API, который нужно использовать, из таблицы [Discovery API endpoints](#discovery-api-endpoints).

3. По вопросам, связанным с конкретными запросами, обратитесь к [документации схемы](/docs/dbt-apis/discovery-schema-job).

## Выполнение запросов с помощью HTTP-запросов {#run-queries-using-http-requests}

Вы можете выполнять запросы, отправляя `POST`-запросы к Discovery API, не забыв заменить:
* `YOUR_API_URL` на соответствующий [Discovery API endpoint](#discovery-api-endpoints) для вашего региона и тарифного плана.
* `YOUR_TOKEN` в заголовке Authorization на ваш реальный API-токен. Обязательно указывайте префикс Token.
* `QUERY_BODY` на GraphQL-запрос, например `{ "query": "<query text>", "variables": "<variables in json>" }`
* `VARIABLES` на словарь с переменными вашего GraphQL-запроса, например ID job или фильтр.
* `ENDPOINT` на endpoint, к которому вы обращаетесь, например environment.

  ```shell
  curl 'YOUR_API_URL' \
    -H 'authorization: Bearer YOUR_TOKEN' \
    -H 'content-type: application/json'
    -X POST
    --data QUERY_BODY
  ```

Пример на Python:

```python
response = requests.post(
    'YOUR_API_URL',
    headers={"authorization": "Bearer "+YOUR_TOKEN, "content-type": "application/json"},
    json={"query": QUERY_BODY, "variables": VARIABLES}
)

metadata = response.json()['data'][ENDPOINT]
```

Для каждого запроса потребуется ID окружения или задания. Вы можете получить этот ID из URL-адреса <Constant name="dbt" /> или с помощью Admin API.

На этой странице приведено несколько наглядных примеров запросов. Дополнительные примеры см. в разделе [Сценарии использования и примеры для Discovery API](/docs/dbt-apis/discovery-use-cases-and-examples).

## Конечные точки Discovery API {#discovery-api-endpoints}

Найдите свой эндпоинт Discovery API в разделе **Account settings** → **Access URLs** в <Constant name="dbt_platform"/>. Формат зависит от типа развертывания и региона:

<SimpleTable>
| Deployment type | Discovery API URL |
| --------------- | ------------------- |
| Мультиарендная среда | `https://ACCOUNT_PREFIX.metadata.REGION.dbt.com/graphql` |
| Одноарендная среда | `https://ACCOUNT_PREFIX.metadata.ROUTING_SUBDOMAIN.dbt.com/graphql` |
</SimpleTable>

- Замените следующие заполнители фактическими значениями. Дополнительную информацию о регионах и поддоменах см. в разделе [Доступ, регионы и IP-адреса](/docs/platform/about-platform/access-regions-ip-addresses):
  - `ACCOUNT_PREFIX` — идентификатор вашей учетной записи (указан в **Account settings** в разделе **Access URLs**)
  - `REGION` — регион вашего развертывания (например, `us1` для Северной Америки в AWS, `eu1` для EMEA, `jp1` для Японии, `au1` для APAC и т. д.)
  - `ROUTING_SUBDOMAIN` — поддомен маршрутизации вашей одноарендной среды (обычно это название вашей компании. Если вы не уверены, обратитесь к команде по работе с вашей учетной записью)
  - Например, если вы используете AWS в Северной Америке с префиксом учетной записи `abc123`, ваш URL Discovery API — `https://abc123.metadata.us1.dbt.com/graphql`.

## Разумное использование {#reasonable-use}

Использование Discovery (GraphQL) API ограничено лимитами на частоту запросов и размер ответов, чтобы поддерживать производительность и стабильность платформы метаданных и предотвращать злоупотребления.

На эндпоинты уровня задания распространяются ограничения сложности запросов. Вложенные узлы (например, parents), код (например, rawCode) и столбцы каталога считаются наиболее сложными элементами. Слишком сложные запросы следует разбивать на отдельные запросы, включая в них только необходимые поля. Для большинства сценариев использования dbt Labs рекомендует вместо этого использовать эндпоинт окружения, чтобы получать актуальные описательные метаданные и метаданные результатов для проекта <Constant name="dbt" />.

## Ограничения хранения данных {#retention-limits}
Вы можете использовать Discovery API для запросов данных за последние два месяца. Например, если сегодня 1 апреля, вы сможете запрашивать данные начиная с 1 февраля.

## Выполнение запросов с помощью GraphQL explorer {#run-queries-with-the-graphql-explorer}

Вы можете выполнять ad-hoc запросы напрямую в [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) и использовать document explorer в левой части экрана, чтобы увидеть все доступные узлы и поля.

Информацию о настройке и авторизации GraphQL см. в [документации Apollo explorer](https://www.apollographql.com/docs/graphos/explorer/explorer).

1. Откройте [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) и выберите поля, которые вы хотите запросить.

2. Внизу explorer выберите **Variables** и замените все поля со значением `null` на ваши уникальные значения.

3. [Аутентифицируйтесь](https://www.apollographql.com/docs/graphos/explorer/connecting-authenticating#authentication), используя Bearer auth с `YOUR_TOKEN`. Внизу explorer выберите **Headers** и нажмите **+New header**.

4. В выпадающем списке **header key** выберите **Authorization** и в поле **value** укажите ваш Bearer-токен. Не забудьте включить префикс Token. Заголовок должен иметь формат: `{"Authorization": "Bearer <YOUR_TOKEN>}`.

<!-- TODO: Screenshot needs to be replaced with new one. If we want to show model historical runs, show `environment { applied { modelHistoricalRuns } }` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API can be used -- the content (request and response) doesn't matter too much` -->

<br />

<Lightbox src="/img/docs/dbt-platform/discovery-api/graphql_header.jpg" width="85%" title="Введите ключ заголовка и значение токена аутентификации Bearer"/>

1. Запустите запрос, нажав синюю кнопку выполнения запроса в правом верхнем углу редактора **Operation** (справа от запроса). Справа в explorer вы должны увидеть успешный ответ на запрос.

<!-- TODO: Screenshot needs to be replaced with new one. If we want to show model historical runs, show `environment { applied { modelHistoricalRuns } }` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API can be used -- the content (request and response) doesn't matter too much` -->

<Lightbox src="/img/docs/dbt-platform/discovery-api/graphql.jpg" width="85%" title="Выполнение запросов с помощью обозревателя GraphQL Apollo Server"/>

### Фрагменты {#fragments}

Используйте нотацию [`... on`](https://www.apollographql.com/docs/react/data/fragments/) для выполнения запросов по lineage и получения результатов для конкретных типов узлов.

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(first: $first, filter: { uniqueIds: "MODEL.PROJECT.MODEL_NAME" }) {
        edges {
          node {
            name
            ancestors(types: [Model, Source, Seed, Snapshot]) {
              ... on ModelAppliedStateNestedNode {
                name
                resourceType
                materializedType
                executionInfo {
                  executeCompletedAt
                }
              }
              ... on SourceAppliedStateNestedNode {
                sourceName
                name
                resourceType
                freshness {
                  maxLoadedAt
                }
              }
              ... on SnapshotAppliedStateNestedNode {
                name
                resourceType
                executionInfo {
                  executeCompletedAt
                }
              }
              ... on SeedAppliedStateNestedNode {
                name
                resourceType
                executionInfo {
                  executeCompletedAt
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Пагинация {#pagination}

Запросы к большим наборам данных могут влиять на производительность нескольких функций в конвейере API. Пагинация снижает нагрузку, возвращая данные меньшими порциями — по одной странице за раз. Это позволяет получать определённую часть набора данных или весь набор по частям для повышения производительности. <Constant name="dbt" /> использует пагинацию на основе курсора, которая упрощает получение страниц постоянно изменяющихся данных.

Используйте объект `PageInfo`, чтобы получить информацию о странице. Доступные поля:

- `startCursor` тип string &mdash; соответствует первому `node` в `edge`.
- `endCursor` тип string &mdash; соответствует последнему `node` в `edge`.
- `hasNextPage` тип boolean &mdash; указывает, есть ли дополнительные `nodes` после возвращённых результатов.

При выполнении запроса доступны следующие переменные соединения:

- `first` тип integer &mdash; возвращает первые n `nodes` на странице, максимум 500.
- `after` тип string &mdash; задаёт курсор, после которого нужно вернуть `nodes`. Рекомендуется указывать значение `after`, используя ID объекта из `endCursor` предыдущей страницы.

Ниже приведён пример, который возвращает первые 500 моделей (`first`) после указанного Object ID (`after`) в переменных. Объект `PageInfo` показывает, с какого Object ID начинается курсор, где он заканчивается и есть ли следующая страница.

<!-- TODO: Update screenshot to use `$environmentId: BigInt!, or remove it` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API can be used -- the content (request and response) doesn't matter too much` -->

<Lightbox src="/img/Paginate.png" width="75%" title="Пример пагинации"/>

Ниже приведён пример кода для объекта `PageInfo`:

```graphql
pageInfo {
  startCursor
  endCursor
  hasNextPage
}
totalCount # Total number of records across all pages
```

Описанный выше подход с `PageInfo` и `totalCount` применяется к эндпоинтам `environment`, которые возвращают результаты в виде соединения (connection) с `edges` и `nodes`.

<a id="job-based-queries" />

#### Пагинация эндпоинтов на уровне задания

Эндпоинты списков на уровне задания также поддерживают пагинацию на основе курсора. Используйте этот подход при запросе ресурсов внутри объекта [`job`](/docs/dbt-apis/discovery-schema-job). Эти эндпоинты возвращают плоский список, а не соединение `edges`/`nodes`, поэтому объект `PageInfo` в них недоступен.

Следующие поля списков на уровне задания принимают аргументы `first` и `after`:

- `models`
- `sources`
- `seeds`
- `snapshots`
- `tests`
- `macros`
- `metrics`
- `exposures`

Передайте `first`, чтобы задать размер страницы (не более 100). Каждый возвращаемый элемент содержит поле `paginationCursor` — непрозрачное значение, индивидуальное для каждого элемента, которое нужно включить в выборку запроса. В следующем запросе передайте значение `paginationCursor` последнего элемента в качестве `after`, чтобы получить следующую страницу.

В отличие от запросов на уровне окружения, эти эндпоинты на уровне задания не возвращают объект `PageInfo` или поле `hasNextPage`. Последняя страница достигнута, если страница содержит меньше строк, чем задано в `first` (или меньше, чем размер страницы по умолчанию).

Рекомендуем всегда указывать `first`, чтобы ограничивать размер ответов. Ранее, если не указывать `first` и `after`, API возвращал все строки, соответствующие запросу. Для больших заданий рекомендуется явно передавать `first` и `after`, чтобы ваша интеграция не зависела от ответов без пагинации.

:::note Предстоящее изменение запросов без пагинации

В одном из будущих обновлений запросы без `first` и `after` будут возвращать не более 100 строк. dbt Labs заранее уведомит о внедрении этого изменения.

:::

Чтобы выполнить пример, используйте свой [эндпоинт Discovery API](#discovery-api-endpoints) и [сервисный токен с правами Metadata Only](#authorization). Получите `jobId` и необязательный `runId` из URL задания или запуска либо с помощью [Admin API](/docs/dbt-apis/admin-api). Если не указать `runId`, API использует последний запуск задания. Выполните запрос в [GraphQL explorer](#run-queries-with-the-graphql-explorer) или с помощью [HTTP-запросов](#run-queries-using-http-requests).

В приведённом ниже примере используется список `models` задания. Те же аргументы `first` и `after` работают и для других типов ресурсов, перечисленных выше. Пример сценария использования с большим количеством полей см. в разделе [Сценарии использования и примеры для Discovery API](/docs/dbt-apis/discovery-use-cases-and-examples).

```graphql
query JobModelsPage($jobId: BigInt!, $runId: BigInt, $first: Int!, $after: String) {
  job(id: $jobId, runId: $runId) {
    models(first: $first, after: $after) {
      uniqueId
      paginationCursor
    }
  }
}
```

Переменные для первой страницы:

```json
{
  "jobId": 12345,
  "runId": 67890,
  "first": 10,
  "after": null
}
```

Для следующей страницы задайте в `after` значение `paginationCursor` из _последней_ строки предыдущей страницы. Курсор — это непрозрачная закодированная строка, а не `uniqueId`. Повторяйте запросы, пока страница не вернёт меньше строк, чем задано в `first` (или меньше, чем размер страницы по умолчанию).

```json
{
  "jobId": 12345,
  "runId": 67890,
  "first": 10,
  "after": "Y3Vyc29yOm1vZGVsLm15X3Byb2plY3QuZGltX2N1c3RvbWVycw=="
}
```

### Фильтры

Фильтрация помогает сузить результаты запроса к API. Если вы хотите запросить и получить только модели и тесты, выполнение которых завершается с ошибкой, или найти модели, выполнение которых занимает слишком много времени, вы можете получить сведения о выполнении, такие как [`executionTime`](/docs/dbt-apis/discovery-schema-job-models#fields), [`runElapsedTime`](/docs/dbt-apis/discovery-schema-job-models#fields) или [`status`](/docs/dbt-apis/discovery-schema-job-models#fields). Это помогает командам по работе с данными отслеживать производительность моделей, выявлять узкие места и оптимизировать конвейер обработки данных в целом.

Ниже приведён пример фильтрации результатов для моделей, которые успешно выполнились по значению `lastRunStatus`:

<Lightbox src="/img/Filtering.png" width="75%" title="Пример фильтрации"/>

Ниже приведён пример фильтрации моделей с ошибкой на последнем запуске и тестов, которые завершились с ошибкой:

<!-- TODO: Update screenshot to use `$environmentId: BigInt!, or remove it` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API can be used -- the content (request and response) doesn't matter too much` -->

```graphql
query ModelsAndTests($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(first: $first, filter: { lastRunStatus: error }) {
        edges {
          node {
            name
            executionInfo {
              lastRunId
            }
          }
        }
      }
      tests(first: $first, filter: { status: "fail" }) {
        edges {
          node {
            name
            executionInfo {
              lastRunId
            }
          }
        }
      }
    }
  }
}
```

## Связанные материалы {#related-content}

- [Сценарии использования и примеры для Discovery API](/docs/dbt-apis/discovery-use-cases-and-examples)
- [Схема](/docs/dbt-apis/discovery-schema-job)
