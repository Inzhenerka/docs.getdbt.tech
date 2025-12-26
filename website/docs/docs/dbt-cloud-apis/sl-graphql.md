---
title: "GraphQL"
id: sl-graphql
description: "Интеграция и использование GraphQL API для запросов ваших метрик."
tags: [Semantic Layer, APIs]
---

# GraphQL <Lifecycle status="self_service,managed,managed_plus" />

[GraphQL](https://graphql.org/) (GQL) — это open-source язык запросов для API. Он предлагает более эффективный и гибкий подход по сравнению с традиционными RESTful API.

С помощью GraphQL пользователи могут запрашивать конкретные данные с помощью одного запроса, что уменьшает необходимость в многочисленных обращениях к серверу. Это улучшает производительность и минимизирует сетевые издержки.

GraphQL имеет несколько преимуществ, таких как самодокументируемость, наличие системы строгой типизации, поддержка версионирования и эволюции, возможность быстрого развития и наличие мощной экосистемы. Эти функции делают GraphQL мощным выбором для API, которые придают приоритет гибкости, производительности и продуктивности разработчиков.

## GraphQL API семантического слоя dbt

GraphQL API <Constant name="semantic_layer" /> позволяет исследовать и запрашивать метрики и измерения. Благодаря своей самодокументируемости вы можете удобно изучать доступные вызовы с помощью обозревателя схемы.

URL-адреса проводника схемы варьируются в зависимости от вашего [региона развертывания](/docs/cloud/about-cloud/access-regions-ip-addresses). Используйте следующую таблицу, чтобы найти правильную ссылку для вашего региона:

| Тип развертывания | URL проводника схемы |
| ----------------- | -------------------- |
| Северная Америка, мультиарендатор | https://semantic-layer.cloud.getdbt.com/api/graphql |
| EMEA, мультиарендатор | https://semantic-layer.emea.dbt.com/api/graphql |
| APAC, мультиарендатор | https://semantic-layer.au.dbt.com/api/graphql |
| Одноарендатор | `https://semantic-layer.YOUR_ACCESS_URL/api/graphql`<br /><br /> Замените `YOUR_ACCESS_URL` на ваш конкретный префикс аккаунта, за которым следует соответствующий URL доступа для вашего региона и плана.|
| Мультиячейка | `https://YOUR_ACCOUNT_PREFIX.semantic-layer.REGION.dbt.com/api/graphql`<br /><br /> Замените `YOUR_ACCOUNT_PREFIX` на ваш конкретный идентификатор аккаунта и `REGION` на ваше местоположение, например, `us1.dbt.com`. |<br />

**Пример**
- Если ваш URL доступа для одноарендатора `ABC123.getdbt.com`, ваш URL проводника схемы будет `https://semantic-layer.ABC123.getdbt.com/api/graphql`.

Партнёры dbt могут использовать GraphQL API <Constant name="semantic_layer" /> для создания интеграций с <Constant name="semantic_layer" />.

Обратите внимание, что GraphQL API <Constant name="semantic_layer" /> не поддерживает `ref` для обращения к объектам dbt. Вместо этого необходимо использовать полностью квалифицированное имя таблицы. Если вы используете макросы dbt во время выполнения запроса для расчёта метрик, эти вычисления следует перенести в определения метрик <Constant name="semantic_layer" /> в виде кода.

## Требования для использования GraphQL API

- Проект <Constant name="cloud" /> на dbt версии 1.6 или выше  
- Метрики определены и настроены  
- [Сервисный токен](/docs/dbt-cloud-apis/service-tokens) <Constant name="cloud" /> с правами доступа «<Constant name="semantic_layer" /> Only» и «Metadata Only» или [персональный токен доступа](/docs/dbt-cloud-apis/user-tokens)

Если вы пользователь dbt или партнер с доступом к dbt Cloud и [семантическому слою dbt](/docs/use-dbt-semantic-layer/dbt-sl), вы можете [настроить](/docs/use-dbt-semantic-layer/setup-sl) и протестировать этот API с данными из вашей собственной инстанции, настроив семантический слой и получив правильные параметры подключения GQL, описанные в этом документе.

Если вы пользователь или партнёр dbt и имеете доступ к <Constant name="cloud" /> и [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), вы можете [настроить](/docs/use-dbt-semantic-layer/setup-sl) и протестировать этот API с данными из вашего собственного инстанса, сконфигурировав <Constant name="semantic_layer" /> и получив корректные параметры GQL‑подключения, описанные в этом документе.

Дополнительную информацию см. в руководстве [Get started with the <Constant name="semantic_layer" />](/guides/sl-snowflake-qs).

Аутентификация выполняется с использованием либо <Constant name="cloud" /> [service account token](/docs/dbt-cloud-apis/service-tokens), либо [personal access token](/docs/dbt-cloud-apis/user-tokens), передаваемого через HTTP‑заголовок следующим образом. Для изучения схемы вы можете указать эти данные в разделе **header**.

```shell
{"Authorization": "Bearer <AUTHENTICATION TOKEN>"}
```

Каждый GQL‑запрос также требует указания <Constant name="cloud" /> `environmentId`. Для аутентификации API использует как service token или personal token, переданный в заголовке, так и значение `environmentId`.

### Вызовы метаданных

#### Получение диалекта платформы данных

В некоторых случаях в вашем приложении может быть полезно знать диалект или платформу данных, которая используется внутри соединения <Constant name="semantic_layer" /> (например, если вы формируете фильтры `where` на основе пользовательского интерфейса, а не SQL, введённого пользователем).

GraphQL API имеет простой способ получить это с помощью следующего запроса:

```graphql
{
  environmentInfo(environmentId: BigInt!) {
    dialect
  }
}
```

#### Получение доступных метрик

<!-- removing non-paginated sample
```graphql
metrics(environmentId: BigInt!): [Metric!]!
```-->

```graphql
metricsPaginated(
  environmentId: BigInt!
  search: String = null
  groupBy: [GroupByInput!] = null
  pageNum: Int! = 1
  pageSize: Int = null
): MetricResultPage! {
  items: [Metric!]!
  pageNum: Int!
  pageSize: Int
  totalItems: Int!
  totalPages: Int!
}
```

#### Получение доступных измерений для метрик

<!-- removing non-paginated sample
```graphql
dimensions(
  environmentId: BigInt!
  metrics: [MetricInput!]!
): [Dimension!]!
```-->

```graphql
dimensionsPaginated(
    environmentId: BigInt!
    metrics: [MetricInput!]!
    search: String = null
    pageNum: Int! = 1
    pageSize: Int = null
): DimensionResultPage! {
    items: [Dimension!]!
    pageNum: Int!
    pageSize: Int
    totalItems: Int!
    totalPages: Int!
}
```

#### Получение доступных гранулярностей для заданных метрик

Примечание: Этот вызов для `queryableGranularities` возвращает только запрашиваемые гранулярности для времени метрики - основного временного измерения для всех выбранных метрик.

```graphql
queryableGranularities(
  environmentId: BigInt!
  metrics: [MetricInput!]!
): [TimeGranularity!]!
```

Вы также можете получить запрашиваемые гранулярности для всех других измерений, используя вызов `dimensions`:

```graphql
{
  dimensionsPaginated(environmentId: BigInt!, metrics:[{name:"order_total"}]) {
    items {
      name
      queryableGranularities # --> ["DAY", "WEEK", "MONTH", "QUARTER", "YEAR"]
    }
  }
}
```

Вы также можете опционально получить доступ к этому из конечной точки метрик:

```graphql
{
  metricsPaginated(environmentId: BigInt!) {
    items {
      name
      dimensions {
        name
        queryableGranularities
      }
    }
  }
}
```

#### Получение показателей

```graphql
{
  measures(environmentId: BigInt!, metrics: [{name:"order_total"}]) {
    name
    aggTimeDimension
  }
}
```

`aggTimeDimension` сообщает вам имя измерения, которое соответствует `metric_time` для данной меры. Вы также можете запросить `measures` из конечной точки `metrics`, что позволяет вам увидеть, какие измерения соответствуют `metric_time` для данной метрики:

```graphql
{
  metricsPaginated(environmentId: BigInt!) {
    items {
      measures {
        name
        aggTimeDimension
      }
    }
  }
}
```

#### Получение сущностей

```graphql
entitiesPaginated(
    environmentId: BigInt!
    metrics: [MetricInput!] = null
    search: String = null
    pageNum: Int! = 1
    pageSize: Int = null
): EntityResultPage! {
    items: [Entity!]!
    pageNum: Int!
    pageSize: Int
    totalItems: Int!
    totalPages: Int!
}
```

#### Получение сущностей и измерений для группировки метрик

```graphql
groupBysPaginated(
    environmentId: BigInt!
    metrics: [MetricInput!] = null
    search: String = null
    pageNum: Int! = 1
    pageSize: Int = null
): EntityDimensionResultPage! {
    items: [EntityDimension!]!
    pageNum: Int!
    pageSize: Int
    totalItems: Int!
    totalPages: Int!
}
```

#### Типы метрик

```graphql
Metric {
  name: String!
  description: String
  type: MetricType!
  typeParams: MetricTypeParams!
  filter: WhereFilter
  dimensions: [Dimension!]!
  queryableGranularities: [TimeGranularity!]!
}
```

```
MetricType = [SIMPLE, RATIO, CUMULATIVE, DERIVED]
```

#### Параметры типа метрики

```graphql
MetricTypeParams {
  measure: MetricInputMeasure
  inputMeasures: [MetricInputMeasure!]!
  numerator: MetricInput
  denominator: MetricInput
  expr: String
  window: MetricTimeWindow
  grainToDate: TimeGranularity
  metrics: [MetricInput!]
}
```

#### Типы измерений

```graphql
Dimension {
  name: String!
  description: String
  type: DimensionType!
  typeParams: DimensionTypeParams
  isPartition: Boolean!
  expr: String
  queryableGranularities: [TimeGranularity!]!
}
```

```
DimensionType = [CATEGORICAL, TIME]
```

#### Список сохранённых запросов

Получить список всех сохранённых запросов для указанного окружения:

<!-- removing non-paginated sample
```graphql
{
savedQueries(environmentId: "123") {
  name
  description
  label
  queryParams {
    metrics {
      name
    }
    groupBy {
      name
      grain
      datePart
    }
    where {
      whereSqlTemplate
    }
  }
}
}
```-->

```graphql
savedQueriesPaginated(
    environmentId: BigInt!
    search: String = null
    pageNum: Int! = 1
    pageSize: Int = null
): SavedQueryResultPage! {
    items: [SavedQuery!]!
    pageNum: Int!
    pageSize: Int
    totalItems: Int!
    totalPages: Int!
}
```

#### List a saved query

List a single saved query using environment ID and query name:

```graphql

{
savedQuery(environmentId: "123", savedQueryName: "query_name") {
  name
  description
  label
  queryParams {
    metrics {
      name
    }
    groupBy {
      name
      grain
      datePart
    }
    where {
      whereSqlTemplate
    }
  }
}
}
```

### Запросы

При выполнении запросов к данным необходимо указать _либо_ `groupBy`, _либо_ выборку `metrics`. В следующем разделе приведены примеры того, как выполнять запросы к метрикам:

- [Create query](#create-metric-query)
- [Fetch query result](#fetch-query-result)

#### Create query

```graphql
createQuery(
  environmentId: BigInt!
  metrics: [MetricInput!]!
  groupBy: [GroupByInput!] = null
  limit: Int = null
  where: [WhereInput!] = null
  order: [OrderByInput!] = null
): CreateQueryResult
```

```graphql
MetricInput {
  name: String!
  alias: String!
}

GroupByInput {
  name: String!
  grain: TimeGranularity = null
}

WhereInput {
  sql: String!
}

OrderByinput { # -- передайте только один из metric или groupBy
  metric: MetricInput = null
  groupBy: GroupByInput = null
  descending: Boolean! = false
}
```

#### Получение результата запроса

```graphql
query(
  environmentId: BigInt!
  queryId: String!
): QueryResult!
```

GraphQL API использует процесс опроса для запросов, так как запросы могут быть долгими в некоторых случаях. Это работает путем создания запроса с мутацией `createQuery`, которая возвращает идентификатор запроса. Этот идентификатор затем используется для непрерывной проверки (опроса) результатов и статуса вашего запроса. Типичный поток будет выглядеть следующим образом:

1. Запуск запроса
```graphql
mutation {
  createQuery(
    environmentId: 123456
    metrics: [{name: "order_total"}]
    groupBy: [{name: "metric_time"}]
  ) {
    queryId  # => Возвращает 'QueryID_12345678'
  }
}
```
2. Опрос результатов
```graphql
{
  query(environmentId: 123456, queryId: "QueryID_12345678") {
    sql
    status
    error
    totalPages
    jsonResult
    arrowResult
  }
}
```
3. Продолжайте выполнять запрос 2. с соответствующим интервалом, пока статус не станет `FAILED` или `SUCCESSFUL`

### Формат вывода и пагинация

#### Формат вывода

По умолчанию результат возвращается в формате Arrow. Вы можете переключиться на формат JSON с помощью соответствующего параметра. Однако из‑за ограничений производительности мы рекомендуем использовать параметр JSON только для тестирования и валидации.

Получаемый JSON представляет собой строку, закодированную в base64. Чтобы получить доступ к данным, вы можете декодировать её с помощью base64‑декодера. JSON формируется на основе pandas, что означает, что вы можете преобразовать его обратно в dataframe с помощью `pandas.read_json(json, orient="table")`. Либо вы можете работать с данными напрямую через `json["data"]`, а схему таблицы получить из `json["schema"]["fields"]`.

В качестве альтернативы вы можете передать `encoded:false` в поле `jsonResult`, чтобы сразу получить «сырой» JSON‑строку без кодирования.

По умолчанию вывод осуществляется в формате Arrow. Вы можете переключиться на формат JSON, используя следующий параметр. Однако из-за ограничений производительности мы рекомендуем использовать параметр JSON для тестирования и валидации. Полученный JSON является строкой, закодированной в base64. Чтобы получить к нему доступ, вы можете декодировать его с помощью декодера base64. JSON создается из pandas, что означает, что вы можете преобразовать его обратно в dataframe, используя `pandas.read_json(json, orient="table")`. Или вы можете работать с данными напрямую, используя `json["data"]`, и найти схему таблицы, используя `json["schema"]["fields"]`. В качестве альтернативы, вы можете передать `encoded:false` в поле jsonResult, чтобы получить необработанную строку JSON напрямую.

```graphql
{
  query(environmentId: BigInt!, queryId: Int!, pageNum: Int! = 1) {
    sql
    status
    error
    totalPages
    arrowResult
    jsonResult(orient: PandasJsonOrient! = TABLE, encoded: Boolean! = true)
  }
}
```

Результаты по умолчанию выводятся в таблицу, но вы можете изменить это на любое значение, поддерживаемое [pandas](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html).

#### Пагинация

По умолчанию мы возвращаем 1024 строки на страницу. Если ваш набор результатов превышает это значение, вам нужно увеличить номер страницы, используя опцию `pageNum`.

### Запуск запроса на Python

`arrowResult` в ответе на GraphQL-запрос является дампом байтов, который не является визуально полезным. Вы можете преобразовать эти байтовые данные в таблицу Arrow, используя любой язык, поддерживающий Arrow. Обратитесь к следующему примеру на Python, объясняющему, как запросить и декодировать результат arrow:

```python
import base64
import pyarrow as pa
import time

headers = {"Authorization":"Bearer <token>"}
query_result_request = """
{
  query(environmentId: 70, queryId: "12345678") {
    sql
    status
    error
    arrowResult
  }
}
"""

while True:
  gql_response = requests.post(
    "https://semantic-layer.cloud.getdbt.com/api/graphql",
    json={"query": query_result_request},
    headers=headers,
  )
  if gql_response.json()["data"]["status"] in ["FAILED", "SUCCESSFUL"]:
    break
  # Установите соответствующий интервал между запросами опроса
  time.sleep(1)

"""
gql_response.json() => 
{
  "data": {
    "query": {
      "sql": "SELECT\n  ordered_at AS metric_time__day\n  , SUM(order_total) AS order_total\nFROM semantic_layer.orders orders_src_1\nGROUP BY\n  ordered_at",
      "status": "SUCCESSFUL",
      "error": null,
      "arrowResult": "arrow-byte-data"
    }
  }
}
"""

def to_arrow_table(byte_string: str) -> pa.Table:
  """Получите необработанную строку base64 и преобразуйте в таблицу Arrow."""
  with pa.ipc.open_stream(base64.b64decode(byte_string)) as reader:
    return pa.Table.from_batches(reader, reader.schema)


arrow_table = to_arrow_table(gql_response.json()["data"]["query"]["arrowResult"])

# Выполните любую доступную функциональность, например, преобразование в таблицу pandas.
print(arrow_table.to_pandas())
"""
order_total  ordered_at
          3  2023-08-07
        112  2023-08-08
         12  2023-08-09
       5123  2023-08-10
"""
```

### Дополнительные примеры create-запросов

В этом разделе приведены примеры запросов для GraphQL API — например, как выполнять запросы метрик, измерений (dimensions), where-фильтров и других возможностей:

<!-- no toc -->
- [Query metric alias](#query-metric-alias) &mdash; Запрос с использованием псевдонима метрики, который позволяет использовать более простые или интуитивно понятные имена для метрик вместо их полных определений.
- [Query with a time grain](#query-with-a-time-grain)  &mdash; Получение нескольких метрик с изменением гранулярности временного измерения.
- [Query multiple metrics and multiple dimensions](#query-multiple-metrics-and-multiple-dimensions) &mdash; Выбор общих измерений для нескольких метрик.
- [Query a categorical dimension on its own](#query-a-categorical-dimension-on-its-own) &mdash; Группировка по категориальному измерению.
- [Query with a where filter](#query-with-a-where-filter)  &mdash; Использование параметра `where` для фильтрации по измерениям и сущностям с помощью параметров.
- [Query with order](#query-with-order) &mdash; Запрос с использованием `orderBy`, принимает простую строку, соответствующую Dimension, Metric или Entity. По умолчанию используется сортировка по возрастанию.
- [Query with limit](#query-with-limit) &mdash; Запрос с использованием условия `limit`.
- [Query saved queries](#query-saved-queries) &mdash; Запрос с использованием сохранённого запроса через параметр `savedQuery` для часто используемых запросов.
- [Query with just compiling SQL](#query-with-just-compiling-sql) &mdash; Запрос, использующий ключевое слово compile через мутацию `compileSql`.
- [Query records](#query-records) &mdash; Просмотр всех запросов, выполненных в вашем проекте.

#### Query metric alias

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics: [{name: "metric_name", alias: "metric_alias"}]
  ) {
    ...
  }
}
```

#### Запрос с временной гранулярностью

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics: [{name: "order_total"}]
    groupBy: [{name: "metric_time", grain: MONTH}] 
  ) {
    queryId
  }
}
```

Обратите внимание, что при использовании гранулярности в запросе вывод временного измерения с примененной к нему временной зернистостью всегда принимает форму имени измерения, дополненного двойным подчеркиванием и уровнем гранулярности - `{time_dimension_name}__{DAY|WEEK|MONTH|QUARTER|YEAR}`. Даже если гранулярность не указана, она также всегда будет иметь добавленную гранулярность и по умолчанию будет самой низкой доступной (обычно ежедневной для большинства источников данных). Рекомендуется указывать гранулярность при использовании временных измерений, чтобы не было неожиданных результатов с выходными данными.

#### Запрос нескольких метрик и нескольких измерений

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics: [{name: "food_order_amount"}, {name: "order_gross_profit"}]
    groupBy: [{name: "metric_time", grain: MONTH}, {name: "customer__customer_type"}]
  ) {
    queryId
  }
}
```

#### Запрос по категориальному измерению отдельно

```graphql
mutation {
  createQuery(
    environmentId: "123"
    groupBy: [{name: "customer__customer_type"}]
  ) {
    queryId
  }
}
```

#### Запрос с фильтром `where`

Фильтр `where` принимает аргумент списка (или строку для одного ввода). В зависимости от объекта, который вы фильтруете, есть несколько параметров:

- `Dimension()` &mdash; Используется для любых категориальных или временных измерений. Например, `Dimension('metric_time').grain('week')` или `Dimension('customer__country')`.

- `Entity()` &mdash; Используется для сущностей, таких как первичные и внешние ключи, например, `Entity('order_id')`.

Примечание: Если вы предпочитаете `where`-условие с более явным путем, вы можете опционально использовать `TimeDimension()` для разделения категориальных измерений от временных. Ввод `TimeDimension` принимает временное измерение и, опционально, уровень гранулярности. `TimeDimension('metric_time', 'month')`.

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics:[{name: "order_total"}]
    groupBy:[{name: "customer__customer_type"}, {name: "metric_time", grain: month}]
    where:[{sql: "{{ Dimension('customer__customer_type') }} = 'new'"}, {sql:"{{ Dimension('metric_time').grain('month') }} > '2022-10-01'"}]
    ) {
     queryId
    }
}
```

Для обоих `TimeDimension()` указание grain в фильтре `where` требуется только в том случае, если временные зерна агрегации у мер и метрик, связанных с этим фильтром `where`, различаются.

#### Example

Например, рассмотрим следующую конфигурацию семантической модели и метрик, которая содержит две метрики, агрегированные по разным временным зернам. В примере показана одна семантическая модель, но то же самое применимо и к метрикам, определённым в нескольких семантических моделях.

```yaml
semantic_model:
  name: my_model_source

defaults:
  agg_time_dimension: created_month
  measures:
    - name: measure_0
      agg: sum
    - name: measure_1
      agg: sum
      agg_time_dimension: order_year
  dimensions:
    - name: created_month
      type: time
      type_params:
        time_granularity: month
    - name: order_year
      type: time
      type_params:
        time_granularity: year

metrics:
  - name: metric_0
    description: A metric with a month grain.
    type: simple
    type_params:
      measure: measure_0
  - name: metric_1
    description: A metric with a year grain.
    type: simple
    type_params:
      measure: measure_1
```

Предполагая, что пользователь запрашивает `metric_0` и `metric_1` вместе, ниже приведены примеры допустимых и недопустимых фильтров:

| <div style={{width:'200px'}}>Пример</div> | <div style={{width:'250px'}}>Фильтр</div> |
| ------- | ------ |
| ✅ <br />   Допустимый фильтр | `"{{ TimeDimension('metric_time', 'year') }} > '2020-01-01'"`  |
| ❌ <br /> Недопустимый фильтр | ` "{{ TimeDimension('metric_time') }} > '2020-01-01'"`  <br /><br /> Метрики в запросе определены на основе мер с разной гранулярностью. |
| ❌ <br /> Недопустимый фильтр | `"{{ TimeDimension('metric_time', 'month') }} > '2020-01-01'"` <br /><br />  `metric_1` недоступна на уровне гранулярности «месяц». |



#### Многошаговые соединения

В случаях, когда вам нужно выполнить запрос через несколько связанных таблиц (многопереходные соединения), используйте аргумент `entity_path`, чтобы указать путь между связанными сущностями. Вот примеры того, как вы можете определить эти соединения:

- В этом примере вы запрашиваете измерение `location_name`, но указываете, что оно должно быть соединено, используя поле `order_id`.
	```sql
	{{Dimension('location__location_name', entity_path=['order_id'])}}
	```
- В этом примере измерение `salesforce_account_owner` соединено с полем `region`, с путем, проходящим через `salesforce_account`.
	```sql
	{{ Dimension('salesforce_account_owner__region',['salesforce_account']) }}
```
#### Запрос с сортировкой

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics: [{name: "order_total"}]
    groupBy: [{name: "metric_time", grain: MONTH}] 
    orderBy: [{metric: {name: "order_total"}}, {groupBy: {name: "metric_time", grain: MONTH}, descending:true}]
  ) {
    queryId
  }
}
```

#### Запрос с ограничением (limit)

```graphql
mutation {
  createQuery(
    environmentId: "123"
    metrics: [{name:"food_order_amount"}, {name: "order_gross_profit"}]
    groupBy: [{name:"metric_time", grain: MONTH}, {name: "customer__customer_type"}]
    limit: 10 
  ) {
    queryId
  }
}
```

#### Запрос сохранённых запросов

Этот вариант принимает те же входные параметры, что и мутация `createQuery`, но дополнительно включает поле `savedQuery`. Вы можете использовать его для часто используемых запросов.

```graphql
mutation {
  createQuery(
    environmentId: "123"
    savedQuery: "new_customer_orders"
  ) {
    queryId
  }
}
```

:::info Примечание о выполнении сохранённых запросов
При выполнении [сохранённых запросов](/docs/build/saved-queries) вы можете использовать такие параметры, как `where`, `limit`, `order`, `compile` и другие. Однако имейте в виду, что в этом контексте нельзя обращаться к параметрам `metric` или `group_by`. Это связано с тем, что они являются предопределёнными и фиксированными параметрами для сохранённых запросов, и их нельзя изменить во время выполнения запроса. Если вам нужно запрашивать дополнительные метрики или измерения, вы можете построить запрос, используя стандартный формат.
:::

#### Запрос только с компиляцией SQL

Этот вариант принимает те же входные параметры, что и мутация `createQuery`.

```graphql
mutation {
  compileSql(
    environmentId: "123"
    metrics: [{name:"food_order_amount"} {name:"order_gross_profit"}]
    groupBy: [{name:"metric_time", grain: MONTH}, {name:"customer__customer_type"}]
  ) {
    sql
  }
}
```

#### История запросов

Используйте этот endpoint, чтобы просмотреть все запросы, выполненные в вашем проекте. Сюда входят как запросы Insights, так и запросы <Constant name="semantic_layer" />.

```graphql
{
  queryRecords(
    environmentId:123
  ) {
    items {
      queryId
      status
      startTime
      endTime
      connectionDetails
      sqlDialect
      connectionSchema
      error
      queryDetails {
        ... on SemanticLayerQueryDetails {
          params {
            type
            metrics {
              name
            }
            groupBy {
              name
              grain
            }
            limit
            where {
              sql
            }
            orderBy {
              groupBy {
                name
                grain
              }
              metric {
                name
              }
              descending
            }
            savedQuery
          }
        }
        ... on RawSqlQueryDetails {
          queryStr
          compiledSql
          numCols
          queryDescription
          queryTitle
        }
      }
    }
    totalItems
    pageNum
    pageSize
  }
}
```
