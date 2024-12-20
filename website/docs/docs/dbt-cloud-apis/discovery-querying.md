---
title: "Запрос к Discovery API"
id: "discovery-querying"
sidebar_label: "Запрос к Discovery API"
pagination_next: "docs/dbt-cloud-apis/discovery-schema-environment"
---

Discovery API поддерживает произвольные запросы и интеграции. Если вы новичок в работе с API, обратитесь к разделу [О Discovery API](/docs/dbt-cloud-apis/discovery-api) для введения.

Используйте Discovery API для оценки состояния здоровья конвейера данных и состояния проекта в разных запусках или в конкретный момент времени. dbt Labs предоставляет [GraphQL-эксплорер](https://metadata.cloud.getdbt.com/graphql) для этого API, позволяя вам выполнять запросы и просматривать схему.

Поскольку GraphQL описывает данные в API, схема, отображаемая в GraphQL-эксплорере, точно представляет граф и поля, доступные для запроса.

<Snippet path="metadata-api-prerequisites" />

## Авторизация

В настоящее время авторизация запросов осуществляется [с использованием сервисного токена](/docs/dbt-cloud-apis/service-tokens). Администраторы dbt Cloud могут сгенерировать сервисный токен только для метаданных, который авторизован для выполнения конкретного запроса к Discovery API.

После создания токена вы можете использовать его в заголовке Authorization запросов к dbt Cloud Discovery API. Обязательно включите префикс Token в заголовок Authorization, иначе запрос завершится ошибкой `401 Unauthorized`. Обратите внимание, что вместо `Token` в заголовке Authorization можно использовать `Bearer`. Оба синтаксиса эквивалентны.

## Доступ к Discovery API

1. Создайте [токен сервисного аккаунта](/docs/dbt-cloud-apis/service-tokens) для авторизации запросов. Администраторы dbt Cloud могут сгенерировать токен _только для метаданных_, который можно использовать для выполнения конкретного запроса к Discovery API для авторизации запросов.

2. Найдите URL API для использования в таблице [конечных точек Discovery API](#discovery-api-endpoints).

3. Для конкретных точек запроса обратитесь к [документации по схеме](/docs/dbt-cloud-apis/discovery-schema-job).

## Выполнение запросов с использованием HTTP-запросов

Вы можете выполнять запросы, отправляя `POST` запрос к Discovery API, убедившись, что заменили:
* `YOUR_API_URL` на соответствующую [конечную точку Discovery API](#discovery-api-endpoints) для вашего региона и плана.
* `YOUR_TOKEN` в заголовке Authorization на ваш фактический API токен. Обязательно включите префикс Token.
* `QUERY_BODY` на GraphQL-запрос, например `{ "query": "<текст запроса>", "variables": "<переменные в формате json>" }`
* `VARIABLES` на словарь ваших переменных GraphQL-запроса, таких как ID задания или фильтр.
* `ENDPOINT` на конечную точку, к которой вы обращаетесь, например, environment.

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

Каждый запрос будет требовать ID окружения или ID задания. Вы можете получить ID из URL dbt Cloud или используя Admin API.

На этой странице представлено несколько иллюстративных примеров запросов. Для получения дополнительных примеров обратитесь к [Примеры использования и примеры для Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples).

## Конечные точки Discovery API

Ниже приведены конечные точки для доступа к Discovery API. Используйте ту, которая подходит для вашего региона и плана.

| Тип развертывания |	Discovery API URL |
| --------------- | ------------------- |
| Северная Америка, многопользовательский |	https://metadata.cloud.getdbt.com/graphql |
| EMEA, многопользовательский |	https://metadata.emea.dbt.com/graphql |
| APAC, многопользовательский |	https://metadata.au.dbt.com/graphql |
| Мульти-клетка | `https://YOUR_ACCOUNT_PREFIX.metadata.REGION.dbt.com/graphql`<br /><br />  Замените `YOUR_ACCOUNT_PREFIX` на ваш конкретный идентификатор аккаунта и `REGION` на ваше местоположение, например, `us1.dbt.com`. |<br />
| Однопользовательский | `https://metadata.YOUR_ACCESS_URL/graphql`<br /><br />  Замените `YOUR_ACCESS_URL` на ваш конкретный префикс аккаунта с соответствующим [URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.|

## Разумное использование

Использование Discovery (GraphQL) API подлежит ограничениям на частоту запросов и размер ответа для поддержания производительности и стабильности платформы метаданных и предотвращения злоупотреблений.

Конечные точки на уровне заданий подлежат ограничениям по сложности запросов. Вложенные узлы (например, родители), код (например, rawCode) и столбцы каталога считаются наиболее сложными. Чрезмерно сложные запросы следует разбивать на отдельные запросы с включением только необходимых полей. dbt Labs рекомендует использовать конечную точку окружения вместо большинства случаев использования для получения последних описательных и результативных метаданных для проекта dbt Cloud.

## Ограничения на хранение
Вы можете использовать Discovery API для запроса данных за последние три месяца. Например, если сегодня 1 апреля, вы можете запросить данные до 1 января.

## Выполнение запросов с помощью GraphQL-эксплорера

Вы можете выполнять произвольные запросы непосредственно в [GraphQL API эксплорере](https://metadata.cloud.getdbt.com/graphql) и использовать эксплорер документов на левой стороне, чтобы увидеть все возможные узлы и поля.

Обратитесь к [документации Apollo эксплорера](https://www.apollographql.com/docs/graphos/explorer/explorer) для получения информации о настройке и авторизации.

1. Доступ к [GraphQL API эксплореру](https://metadata.cloud.getdbt.com/graphql) и выберите поля, которые вы хотите запросить.

2. Выберите **Variables** внизу эксплорера и замените любые поля `null` на ваши уникальные значения.

3. [Аутентифицируйтесь](https://www.apollographql.com/docs/graphos/explorer/connecting-authenticating#authentication) с использованием Bearer auth с `YOUR_TOKEN`. Выберите **Headers** внизу эксплорера и выберите **+New header**.

4. Выберите **Authorization** в выпадающем списке **header key** и введите ваш Bearer auth токен в поле **value**. Не забудьте включить префикс Token. Ваш ключ заголовка должен быть в этом формате: `{"Authorization": "Bearer <YOUR_TOKEN>}`.

<br />

<Lightbox src="/img/docs/dbt-cloud/discovery-api/graphql_header.jpg" width="85%" title="Введите ключ заголовка и значения Bearer auth токена"/>

1. Выполните ваш запрос, нажав синюю кнопку запроса в правом верхнем углу редактора **Operation** (справа от запроса). Вы должны увидеть успешный ответ на запрос справа от эксплорера.

<Lightbox src="/img/docs/dbt-cloud/discovery-api/graphql.jpg" width="85%" title="Выполнение запросов с использованием GraphQL эксплорера Apollo Server"/>

### Фрагменты

Используйте нотацию [`... on`](https://www.apollographql.com/docs/react/data/fragments/) для запроса по всей линии и получения результатов от конкретных типов узлов.

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

Запрос больших наборов данных может повлиять на производительность нескольких функций в API-конвейере. Пагинация облегчает нагрузку, возвращая меньшие наборы данных по одной странице за раз. Это полезно для возврата определенной части набора данных или всего набора данных по частям для повышения производительности. dbt Cloud использует пагинацию на основе курсора, что упрощает возврат страниц постоянно изменяющихся данных.

Используйте объект `PageInfo` для возврата информации о странице. Доступные поля:

- `startCursor` строковый тип &mdash; Соответствует первому `node` в `edge`.
- `endCursor` строковый тип &mdash; Соответствует последнему `node` в `edge`.
- `hasNextPage` булевый тип &mdash; Есть ли еще `nodes` после возвращенных результатов.

При выполнении запроса доступны переменные соединения:

- `first` целочисленный тип &mdash; Возвращает первые n `nodes` для каждой страницы, до 500.
- `after` строковый тип &mdash; Устанавливает курсор для получения `nodes` после. Рекомендуется устанавливать переменную `after` с ID объекта, определенным в `endCursor` предыдущей страницы.

Ниже приведен пример, который возвращает первые 500 моделей после указанного ID объекта в переменных. Объект `PageInfo` возвращает, где начинается ID объекта, где он заканчивается и есть ли следующая страница.

<Lightbox src="/img/Paginate.png" width="75%" title="Пример пагинации"/>

Ниже приведен пример кода объекта `PageInfo`:

```graphql
pageInfo {
  startCursor
  endCursor
  hasNextPage
}
totalCount # Общее количество записей на всех страницах
```

### Фильтры

Фильтрация помогает сузить результаты запроса API. Если вы хотите запросить и вернуть только модели и тесты, которые не прошли, или найти модели, которые занимают слишком много времени на выполнение, вы можете получить данные о выполнении, такие как [`executionTime`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields), [`runElapsedTime`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields) или [`status`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields). Это помогает командам данных отслеживать производительность своих моделей, выявлять узкие места и оптимизировать общий конвейер данных.

Ниже приведен пример, который фильтрует результаты моделей, которые успешно завершились по их `lastRunStatus`:

<Lightbox src="/img/Filtering.png" width="75%" title="Пример фильтрации"/>

Ниже приведен пример, который фильтрует модели, у которых возникла ошибка при последнем запуске, и тесты, которые не прошли:

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

- [Примеры использования и примеры для Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples)
- [Схема](/docs/dbt-cloud-apis/discovery-schema-job)