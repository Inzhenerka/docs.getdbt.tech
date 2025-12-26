---
title: "Запрос к Discovery API"
id: "discovery-querying"
sidebar_label: "Запрос к Discovery API"
pagination_next: "docs/dbt-cloud-apis/discovery-schema-environment"
---

Discovery API поддерживает произвольные запросы и интеграции. Если вы новичок в работе с API, обратитесь к разделу [О Discovery API](/docs/dbt-cloud-apis/discovery-api) для введения.

Используйте Discovery API для оценки состояния конвейеров данных и состояния проекта — как в разрезе нескольких запусков, так и на конкретный момент времени. dbt Labs предоставляет стандартный [GraphQL explorer](https://metadata.cloud.getdbt.com/graphql) для этого API, который позволяет выполнять запросы и просматривать схему. Однако вы также можете использовать любой GraphQL‑клиент по своему выбору для работы с этим API.

Поскольку GraphQL описывает данные в API, схема, отображаемая в GraphQL-эксплорере, точно представляет граф и поля, доступные для запроса.

<Snippet path="metadata-api-prerequisites" />

## Авторизация

В настоящее время авторизация запросов выполняется [с использованием service token](/docs/dbt-cloud-apis/service-tokens). Пользователи с правами администратора <Constant name="cloud" /> могут сгенерировать service token с доступом только к метаданным (Metadata Only), который будет авторизован на выполнение конкретного запроса к Discovery API.

После создания токена вы можете использовать его в заголовке Authorization при выполнении запросов к <Constant name="cloud" /> Discovery API. Обязательно укажите префикс Token в заголовке Authorization, иначе запрос завершится с ошибкой `401 Unauthorized`. Обратите внимание, что вместо `Token` в заголовке Authorization можно использовать `Bearer`. Оба варианта синтаксиса эквивалентны.

## Доступ к Discovery API

1. Создайте [service account token](/docs/dbt-cloud-apis/service-tokens) для авторизации запросов. Пользователи с ролью <Constant name="cloud" /> Admin могут сгенерировать сервисный токен типа _Metadata Only_, который можно использовать для выполнения конкретного запроса к Discovery API с целью авторизации запросов.

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

Каждый запрос будет требовать идентификатор окружения (environment ID) или идентификатор задания (job ID). Вы можете получить этот идентификатор из URL <Constant name="cloud" /> или с помощью Admin API.

На этой странице представлено несколько иллюстративных примеров запросов. Для получения дополнительных примеров обратитесь к [Примеры использования и примеры для Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples).

## Эндпоинты Discovery API

| Тип развертывания |	Discovery API URL |
| --------------- | ------------------- |
| Северная Америка, многопользовательский |	https://metadata.cloud.getdbt.com/graphql |
| EMEA, многопользовательский |	https://metadata.emea.dbt.com/graphql |
| APAC, многопользовательский |	https://metadata.au.dbt.com/graphql |
| Мульти-клетка | `https://YOUR_ACCOUNT_PREFIX.metadata.REGION.dbt.com/graphql`<br /><br />  Замените `YOUR_ACCOUNT_PREFIX` на ваш конкретный идентификатор аккаунта и `REGION` на ваше местоположение, например, `us1.dbt.com`. |<br />
| Однопользовательский | `https://metadata.YOUR_ACCESS_URL/graphql`<br /><br />  Замените `YOUR_ACCESS_URL` на ваш конкретный префикс аккаунта с соответствующим [URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.|

## Разумное использование

Использование Discovery (GraphQL) API подлежит ограничениям на частоту запросов и размер ответа для поддержания производительности и стабильности платформы метаданных и предотвращения злоупотреблений.

Эндпоинты уровня job подпадают под ограничения на сложность запросов. Вложенные узлы (например, `parents`), код (например, `rawCode`) и колонки каталога считаются наиболее сложными элементами. Слишком сложные запросы следует разбивать на несколько отдельных запросов, включая в каждом только необходимые поля. dbt Labs рекомендует для большинства сценариев использовать эндпоинт environment, чтобы получать актуальные описательные данные и метаданные результатов для проекта <Constant name="cloud" />.

## Retention limits
Вы можете использовать Discovery API для запроса данных за предыдущие два месяца. Например, если сегодня 1 апреля, вы сможете запросить данные, начиная с 1 февраля.

## Выполнение запросов с помощью GraphQL-эксплорера

Вы можете выполнять произвольные запросы непосредственно в [GraphQL API эксплорере](https://metadata.cloud.getdbt.com/graphql) и использовать эксплорер документов на левой стороне, чтобы увидеть все возможные узлы и поля.

См. [документацию Apollo Explorer](https://www.apollographql.com/docs/graphos/explorer/explorer) для получения информации о настройке и авторизации GraphQL.

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

Запросы к большим наборам данных могут негативно сказываться на производительности сразу нескольких функций в API‑конвейере. Пагинация снижает эту нагрузку, возвращая данные небольшими порциями — по одной странице за раз. Это полезно как для получения определённой части набора данных, так и для последовательного получения всего набора данных, что позволяет повысить производительность. <Constant name="cloud" /> использует курсорную пагинацию, благодаря чему удобно возвращать страницы с постоянно изменяющимися данными.

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