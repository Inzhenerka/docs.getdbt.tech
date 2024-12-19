---
title: "Запрос к Discovery API"
id: "discovery-querying"
sidebar_label: "Запрос к Discovery API"
pagination_next: "docs/dbt-cloud-apis/discovery-schema-environment"
---

Discovery API поддерживает произвольные запросы и интеграции. Если вы новичок в API, ознакомьтесь с разделом [О Discovery API](/docs/dbt-cloud-apis/discovery-api) для получения вводной информации.

Используйте Discovery API для оценки состояния данных в пайплайне и состояния проекта на протяжении выполнения или в определенный момент времени. dbt Labs предоставляет [GraphQL-эксплорер](https://metadata.cloud.getdbt.com/graphql) для этого API, позволяя вам выполнять запросы и просматривать схему.

Поскольку GraphQL описывает данные в API, схема, отображаемая в GraphQL-эксплорере, точно представляет граф и доступные для запроса поля.

<Snippet path="metadata-api-prerequisites" />

## Авторизация

В настоящее время авторизация запросов осуществляется [с помощью токена сервиса](/docs/dbt-cloud-apis/service-tokens). Администраторы dbt Cloud могут сгенерировать токен сервиса только для метаданных, который имеет право выполнять конкретный запрос к Discovery API.

После создания токена вы можете использовать его в заголовке Authorization запросов к Discovery API dbt Cloud. Обязательно включите префикс Token в заголовок Authorization, иначе запрос завершится с ошибкой `401 Unauthorized`. Обратите внимание, что вместо `Token` в заголовке Authorization можно использовать `Bearer`. Оба синтаксиса эквивалентны.

## Доступ к Discovery API

1. Создайте [токен сервисной учетной записи](/docs/dbt-cloud-apis/service-tokens) для авторизации запросов. Администраторы dbt Cloud могут сгенерировать токен сервиса _Только для метаданных_, который можно использовать для выполнения конкретного запроса к Discovery API для авторизации запросов.

2. Найдите URL API, который нужно использовать, в таблице [конечных точек Discovery API](#discovery-api-endpoints).

3. Для конкретных точек запроса обратитесь к [документации по схеме](/docs/dbt-cloud-apis/discovery-schema-job).

## Выполнение запросов с помощью HTTP-запросов

Вы можете выполнять запросы, отправляя `POST` запрос к Discovery API, убедившись, что вы заменили:
* `YOUR_API_URL` на соответствующую [конечную точку Discovery API](#discovery-api-endpoints) для вашего региона и плана.
* `YOUR_TOKEN` в заголовке Authorization на ваш фактический токен API. Обязательно включите префикс Token.
* `QUERY_BODY` на GraphQL-запрос, например `{ "query": "<текст запроса>", "variables": "<переменные в json>" }`
* `VARIABLES` на словарь переменных вашего GraphQL-запроса, таких как ID задания или фильтр.
* `ENDPOINT` на конечную точку, к которой вы обращаетесь, например, окружение.

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

Каждый запрос потребует ID окружения или ID задания. Вы можете получить ID из URL dbt Cloud или с помощью Admin API.

На этой странице есть несколько иллюстративных примеров запросов. Для получения дополнительных примеров обратитесь к разделу [Сценарии использования и примеры для Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples).

## Конечные точки Discovery API

Следующие конечные точки доступны для доступа к Discovery API. Используйте ту, которая подходит для вашего региона и плана.

| Тип развертывания | URL Discovery API |
| ----------------- | ----------------- |
| Многоарендный для Северной Америки | https://metadata.cloud.getdbt.com/graphql |
| Многоарендный для EMEA | https://metadata.emea.dbt.com/graphql |
| Многоарендный для APAC | https://metadata.au.dbt.com/graphql |
| Многоячеечный | `https://YOUR_ACCOUNT_PREFIX.metadata.REGION.dbt.com/graphql`<br /><br /> Замените `YOUR_ACCOUNT_PREFIX` на ваш конкретный идентификатор учетной записи и `REGION` на ваше местоположение, которое может быть `us1.dbt.com`. |<br />
| Одноарендный | `https://metadata.YOUR_ACCESS_URL/graphql`<br /><br /> Замените `YOUR_ACCESS_URL` на ваш конкретный префикс учетной записи с соответствующим [Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.|

## Разумное использование

Использование Discovery (GraphQL) API подлежит ограничениям по скорости запросов и размеру ответа для поддержания производительности и стабильности платформы метаданных и предотвращения злоупотреблений.

Конечные точки на уровне задания подлежат ограничениям по сложности запросов. Вложенные узлы (например, родительские), код (например, rawCode) и столбцы каталога считаются наиболее сложными. Слишком сложные запросы следует разбивать на отдельные запросы с включением только необходимых полей. dbt Labs рекомендует использовать конечную точку окружения для большинства сценариев использования, чтобы получить последние описательные и результативные метаданные для проекта dbt Cloud.

## Ограничения хранения
Вы можете использовать Discovery API для запроса данных за последние три месяца. Например, если сегодня 1 апреля, вы можете запрашивать данные с 1 января.

## Выполнение запросов с помощью GraphQL-эксплорера

Вы можете выполнять произвольные запросы непосредственно в [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) и использовать документ-эксплорер на левой стороне, чтобы увидеть все возможные узлы и поля.

Обратитесь к [документации по Apollo explorer](https://www.apollographql.com/docs/graphos/explorer/explorer) для получения информации о настройке и авторизации.

1. Получите доступ к [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) и выберите поля, которые вы хотите запросить.

2. Выберите **Переменные** внизу эксплорера и замените любые поля `null` на ваши уникальные значения.

3. [Аутентифицируйтесь](https://www.apollographql.com/docs/graphos/explorer/connecting-authenticating#authentication) с помощью Bearer auth с `YOUR_TOKEN`. Выберите **Заголовки** внизу эксплорера и выберите **+Новый заголовок**.

4. Выберите **Authorization** в выпадающем списке **ключ заголовка** и введите ваш токен Bearer auth в поле **значение**. Не забудьте включить префикс Token. Ваш ключ заголовка должен быть в следующем формате: `{"Authorization": "Bearer <YOUR_TOKEN>}`.

<br />

<Lightbox src="/img/docs/dbt-cloud/discovery-api/graphql_header.jpg" width="85%" title="Введите значения ключа заголовка и токена Bearer auth"/>

1. Выполните ваш запрос, нажав на синюю кнопку запроса в правом верхнем углу редактора **Operation** (справа от запроса). Вы должны увидеть успешный ответ на запрос с правой стороны эксплорера.

<Lightbox src="/img/docs/dbt-cloud/discovery-api/graphql.jpg" width="85%" title="Выполнение запросов с использованием GraphQL-эксплорера Apollo"/>

### Фрагменты

Используйте нотацию [`... on`](https://www.apollographql.com/docs/react/data/fragments/) для выполнения запросов по наследованию и получения результатов от конкретных типов узлов.

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

Запрос больших наборов данных может повлиять на производительность нескольких функций в API-пайплайне. Пагинация облегчает нагрузку, возвращая меньшие наборы данных по одной странице за раз. Это полезно для возврата определенной части набора данных или всего набора данных по частям для повышения производительности. dbt Cloud использует пагинацию на основе курсоров, что упрощает возврат страниц постоянно изменяющихся данных.

Используйте объект `PageInfo`, чтобы вернуть информацию о странице. Доступные поля:

- `startCursor` строковый тип &mdash; Соответствует первому `node` в `edge`.
- `endCursor` строковый тип &mdash; Соответствует последнему `node` в `edge`.
- `hasNextPage` булевый тип &mdash; Указывает, есть ли еще `nodes` после возвращенных результатов.

При выполнении запроса доступны переменные соединения:

- `first` целочисленный тип &mdash; Возвращает первые n `nodes` для каждой страницы, до 500.
- `after` строковый тип &mdash; Устанавливает курсор для получения `nodes` после. Рекомендуется устанавливать переменную `after` с идентификатором объекта, определенным в `endCursor` предыдущей страницы.

Ниже приведен пример, который возвращает `first` 500 моделей `after` указанного идентификатора объекта в переменных. Объект `PageInfo` возвращает, где начинается идентификатор объекта, где он заканчивается и есть ли следующая страница.

<Lightbox src="/img/Paginate.png" width="75%" title="Пример пагинации"/>

Ниже приведен пример объекта `PageInfo`:

```graphql
pageInfo {
  startCursor
  endCursor
  hasNextPage
}
totalCount # Общее количество записей на всех страницах
```

### Фильтры

Фильтрация помогает сузить результаты API-запроса. Если вы хотите запросить и вернуть только модели и тесты, которые не прошли, или найти модели, которые требуют слишком много времени на выполнение, вы можете получить детали выполнения, такие как [`executionTime`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields), [`runElapsedTime`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields) или [`status`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields). Это помогает командам данных отслеживать производительность своих моделей, выявлять узкие места и оптимизировать общий процесс обработки данных.

Ниже приведен пример, который фильтрует результаты моделей, которые успешно завершили свой `lastRunStatus`:

<Lightbox src="/img/Filtering.png" width="75%" title="Пример фильтрации"/>

Ниже приведен пример, который фильтрует модели, которые имели ошибку в последнем запуске, и тесты, которые не прошли:

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

## Связанный контент

- [Сценарии использования и примеры для Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples)
- [Схема](/docs/dbt-cloud-apis/discovery-schema-job)