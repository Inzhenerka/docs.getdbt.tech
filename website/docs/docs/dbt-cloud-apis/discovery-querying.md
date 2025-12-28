---
title: "Запросы к Discovery API"
id: "discovery-querying"
sidebar_label: "Запросы к Discovery API"
pagination_next: "docs/dbt-cloud-apis/discovery-schema-environment"
---

Discovery API поддерживает ad-hoc запросы и интеграции. Если вы впервые работаете с этим API, ознакомьтесь с документом [About the Discovery API](/docs/dbt-cloud-apis/discovery-api), где приведено вводное описание.

Используйте Discovery API для оценки состояния конвейеров данных и состояния проекта как на протяжении нескольких запусков, так и в конкретный момент времени. dbt Labs предоставляет стандартный [GraphQL explorer](https://metadata.cloud.getdbt.com/graphql) для этого API, который позволяет выполнять запросы и просматривать схему. При этом вы также можете использовать любой другой GraphQL-клиент по своему выбору для обращения к API.

Поскольку GraphQL описывает данные, доступные в API, схема, отображаемая в GraphQL explorer, точно отражает граф и поля, доступные для запросов.

<Snippet path="metadata-api-prerequisites" />

## Авторизация

В настоящее время авторизация запросов осуществляется [с использованием service token](/docs/dbt-cloud-apis/service-tokens). Пользователи с правами администратора <Constant name="cloud" /> могут сгенерировать service token с типом _Metadata Only_, который будет авторизован на выполнение конкретного запроса к Discovery API.

После создания токена вы можете использовать его в заголовке Authorization при выполнении запросов к Discovery API <Constant name="cloud" />. Обязательно указывайте префикс Token в заголовке Authorization, иначе запрос завершится ошибкой `401 Unauthorized`. Обратите внимание, что вместо `Token` в заголовке Authorization можно использовать `Bearer`. Оба варианта эквивалентны.

## Доступ к Discovery API

1. Создайте [service account token](/docs/dbt-cloud-apis/service-tokens) для авторизации запросов. Пользователи с правами администратора <Constant name="cloud" /> могут сгенерировать service token типа _Metadata Only_, который можно использовать для выполнения конкретного запроса к Discovery API и авторизации запросов.

2. Определите URL API, который нужно использовать, из таблицы [Discovery API endpoints](#discovery-api-endpoints).

3. Для конкретных точек запроса обратитесь к [документации схемы](/docs/dbt-cloud-apis/discovery-schema-job).

## Выполнение запросов с помощью HTTP-запросов

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

Каждый запрос требует указания ID environment или ID job. Вы можете получить этот ID из URL <Constant name="cloud" /> или с помощью Admin API.

На этой странице приведено несколько наглядных примеров запросов. Дополнительные примеры см. в разделе [Use cases and examples for the Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples).

## Discovery API endpoints

Ниже приведены endpoints для доступа к Discovery API. Используйте тот, который соответствует вашему региону и тарифному плану.

| Deployment type |	Discovery API URL |
| --------------- | ------------------- |
| North America multi-tenant	|	https://metadata.cloud.getdbt.com/graphql |
| EMEA multi-tenant	|	https://metadata.emea.dbt.com/graphql |
| APAC multi-tenant	|	https://metadata.au.dbt.com/graphql |
| Multi-cell	| `https://YOUR_ACCOUNT_PREFIX.metadata.REGION.dbt.com/graphql`<br /><br />  Замените `YOUR_ACCOUNT_PREFIX` на идентификатор вашего аккаунта, а `REGION` — на ваш регион, например `us1.dbt.com`. |<br />
| Single-tenant | `https://metadata.YOUR_ACCESS_URL/graphql`<br /><br />  Замените `YOUR_ACCESS_URL` на префикс вашего аккаунта с соответствующим [Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и тарифного плана.|

## Разумное использование

Использование Discovery (GraphQL) API ограничено лимитами на частоту запросов и размер ответов, чтобы поддерживать производительность и стабильность платформы метаданных и предотвращать злоупотребления.

Endpoints уровня job подчиняются ограничениям на сложность запросов. Вложенные узлы (например, parents), код (например, rawCode) и колонки каталога считаются наиболее сложными. Слишком сложные запросы рекомендуется разбивать на несколько отдельных запросов, включая только необходимые поля. dbt Labs рекомендует в большинстве случаев использовать endpoint environment, чтобы получать актуальные описательные и результатные метаданные для проекта <Constant name="cloud" />.

## Ограничения хранения данных
Вы можете использовать Discovery API для запросов данных за последние два месяца. Например, если сегодня 1 апреля, вы сможете запрашивать данные начиная с 1 февраля.

## Выполнение запросов с помощью GraphQL explorer

Вы можете выполнять ad-hoc запросы напрямую в [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) и использовать document explorer в левой части экрана, чтобы увидеть все доступные узлы и поля.

Информацию о настройке и авторизации GraphQL см. в [документации Apollo explorer](https://www.apollographql.com/docs/graphos/explorer/explorer).

1. Откройте [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) и выберите поля, которые вы хотите запросить.

2. Внизу explorer выберите **Variables** и замените все поля со значением `null` на ваши уникальные значения.

3. [Аутентифицируйтесь](https://www.apollographql.com/docs/graphos/explorer/connecting-authenticating#authentication), используя Bearer auth с `YOUR_TOKEN`. Внизу explorer выберите **Headers** и нажмите **+New header**.

4. В выпадающем списке **header key** выберите **Authorization** и в поле **value** укажите ваш Bearer-токен. Не забудьте включить префикс Token. Заголовок должен иметь формат: `{"Authorization": "Bearer <YOUR_TOKEN>}`.

<!-- TODO: Screenshot needs to be replaced with new one. If we want to show model historical runs, show `environment { applied { modelHistoricalRuns } }` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API canbe used -- the content (request and response) doesn't matter too much` -->

<br />

<Lightbox src="/img/docs/dbt-cloud/discovery-api/graphql_header.jpg" width="85%" title="Введите значения header key и Bearer auth token"/>

1. Запустите запрос, нажав синюю кнопку выполнения запроса в правом верхнем углу редактора **Operation** (справа от запроса). Справа в explorer вы должны увидеть успешный ответ на запрос.

<!-- TODO: Screenshot needs to be replaced with new one. If we want to show model historical runs, show `environment { applied { modelHistoricalRuns } }` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API canbe used -- the content (request and response) doesn't matter too much` -->

<Lightbox src="/img/docs/dbt-cloud/discovery-api/graphql.jpg" width="85%" title="Выполнение запросов с помощью Apollo Server GraphQL explorer"/>

### Фрагменты

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

### Пагинация

Запросы к большим наборам данных могут негативно влиять на производительность различных частей API. Пагинация снижает нагрузку, возвращая данные небольшими порциями — по одной странице за раз. Это полезно для получения как части набора данных, так и всего набора поэтапно, что улучшает производительность. <Constant name="cloud" /> использует курсорную пагинацию, которая упрощает работу с постоянно изменяющимися данными.

Используйте объект `PageInfo`, чтобы получить информацию о странице. Доступные поля:

- `startCursor` тип string &mdash; соответствует первому `node` в `edge`.
- `endCursor` тип string &mdash; соответствует последнему `node` в `edge`.
- `hasNextPage` тип boolean &mdash; указывает, есть ли дополнительные `nodes` после возвращённых результатов.

При выполнении запроса доступны следующие переменные соединения:

- `first` тип integer &mdash; возвращает первые n `nodes` на странице, максимум 500.
- `after` тип string &mdash; задаёт курсор, после которого нужно вернуть `nodes`. Рекомендуется указывать значение `after`, используя ID объекта из `endCursor` предыдущей страницы.

Ниже приведён пример, который возвращает первые 500 моделей (`first`) после указанного Object ID (`after`) в переменных. Объект `PageInfo` показывает, с какого Object ID начинается курсор, где он заканчивается и есть ли следующая страница.

<!-- TODO: Update screenshot to use `$environmentId: BigInt!, or remove it` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API canbe used -- the content (request and response) doesn't matter too much` -->

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

### Фильтры

Фильтрация помогает сузить результаты API-запроса. Например, если вы хотите получить только модели и тесты с ошибками или найти модели, которые выполняются слишком долго, вы можете запросить такие детали выполнения, как [`executionTime`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields), [`runElapsedTime`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields) или [`status`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields). Это помогает командам данных отслеживать производительность моделей, выявлять узкие места и оптимизировать общий конвейер данных.

Ниже приведён пример фильтрации результатов для моделей, которые успешно выполнились по значению `lastRunStatus`:

<Lightbox src="/img/Filtering.png" width="75%" title="Пример фильтрации"/>

Ниже приведён пример фильтрации моделей с ошибкой на последнем запуске и тестов, которые завершились с ошибкой:

<!-- TODO: Update screenshot to use `$environmentId: BigInt!, or remove it` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API canbe used -- the content (request and response) doesn't matter too much` -->

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

## Связанные материалы

- [Use cases and examples for the Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples)
- [Schema](/docs/dbt-cloud-apis/discovery-schema-job)
