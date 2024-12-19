---
title: "GraphQL"
id: sl-graphql
description: "Интеграция и использование GraphQL API для запроса ваших метрик."
tags: [Semantic Layer, APIs]
---

[GraphQL](https://graphql.org/) (GQL) — это язык запросов с открытым исходным кодом для API. Он предлагает более эффективный и гибкий подход по сравнению с традиционными RESTful API.

С помощью GraphQL пользователи могут запрашивать конкретные данные с помощью одного запроса, что снижает необходимость в множественных обращениях к серверу. Это улучшает производительность и минимизирует сетевые накладные расходы.

GraphQL имеет несколько преимуществ, таких как самодокументируемость, наличие строгой системы типизации, поддержка версионирования и эволюции, возможность быстрого развития и наличие мощной экосистемы. Эти функции делают GraphQL мощным выбором для API, которые ставят на первое место гибкость, производительность и продуктивность разработчиков.

## dbt Semantic Layer GraphQL API

GraphQL API dbt Semantic Layer позволяет вам исследовать и запрашивать метрики и размеры. Благодаря своей самодокументируемой природе вы можете удобно исследовать вызовы через исследователь схемы.

URL-адреса исследователя схемы различаются в зависимости от вашего [региона развертывания](/docs/cloud/about-cloud/access-regions-ip-addresses). Используйте следующую таблицу, чтобы найти правильную ссылку для вашего региона:

| Тип развертывания | URL-адрес исследователя схемы |
| ----------------- | ------------------------------ |
| Северная Америка, многопользовательский | https://semantic-layer.cloud.getdbt.com/api/graphql |
| EMEA, многопользовательский | https://semantic-layer.emea.dbt.com/api/graphql |
| APAC, многопользовательский | https://semantic-layer.au.dbt.com/api/graphql |
| Один пользователь | `https://semantic-layer.YOUR_ACCESS_URL/api/graphql`<br /><br /> Замените `YOUR_ACCESS_URL` на ваш конкретный префикс учетной записи, за которым следует соответствующий URL-адрес доступа для вашего региона и плана. |
| Многоячеечный | `https://YOUR_ACCOUNT_PREFIX.semantic-layer.REGION.dbt.com/api/graphql`<br /><br /> Замените `YOUR_ACCOUNT_PREFIX` на ваш конкретный идентификатор учетной записи и `REGION` на ваше местоположение, которое может быть `us1.dbt.com`. |<br />

**Пример**
- Если ваш URL-адрес доступа для одного пользователя — `ABC123.getdbt.com`, ваш URL-адрес исследователя схемы будет `https://semantic-layer.ABC123.getdbt.com/api/graphql`.

Партнеры dbt могут использовать GraphQL API Semantic Layer для создания интеграции с dbt Semantic Layer.

Обратите внимание, что API dbt Semantic Layer не поддерживает `ref` для вызова объектов dbt. Вместо этого используйте полное квалифицированное имя таблицы. Если вы используете макросы dbt во время запроса для расчета ваших метрик, вам следует переместить эти расчеты в определения метрик Semantic Layer в виде кода.

## Требования для использования GraphQL API
- Проект dbt Cloud на версии dbt v1.6 или выше
- Метрики определены и настроены
- Токен [сервиса dbt Cloud](/docs/dbt-cloud-apis/service-tokens) с разрешениями "Только Semantic Layer" и "Только метаданные"
- Ваш проект dbt настроен и подключен к платформе данных

## Использование GraphQL API

Если вы являетесь пользователем или партнером dbt с доступом к dbt Cloud и [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), вы можете [настроить](/docs/use-dbt-semantic-layer/setup-sl) и протестировать этот API с данными из вашей собственной инстанции, настроив Semantic Layer и получив правильные параметры подключения GQL, описанные в этом документе.

Смотрите [Начало работы с dbt Semantic Layer](/guides/sl-snowflake-qs) для получения дополнительной информации.

### Аутентификация

Аутентификация использует [токены сервисной учетной записи dbt Cloud](/docs/dbt-cloud-apis/service-tokens), передаваемые через заголовок следующим образом. Чтобы исследовать схему, вы можете ввести эту информацию в разделе "заголовок".

```
{"Authorization": "Bearer <SERVICE TOKEN>"}
```

Каждый запрос GQL также требует `environmentId` dbt Cloud. API использует как токен сервиса в заголовке, так и `environmentId` для аутентификации.

### Вызовы метаданных

**Получить диалект платформы данных**

В некоторых случаях в вашем приложении может быть полезно знать диалект или платформу данных, которая используется для подключения к dbt Semantic Layer (например, если вы создаете фильтры `where` из пользовательского интерфейса, а не из SQL, введенного пользователем).

GraphQL API имеет простой способ получить это с помощью следующего запроса:

```graphql
{
  environmentInfo(environmentId: BigInt!) {
    dialect
  }
}
```

**Получить доступные метрики**

```graphql
metrics(environmentId: BigInt!): [Metric!]!
```

**Получить доступные размеры для метрик**

```graphql
dimensions(
  environmentId: BigInt!
  metrics: [MetricInput!]!
): [Dimension!]!
```

**Получить доступные гранулярности для заданных метрик**

Примечание: Этот вызов для `queryableGranularities` возвращает только запрашиваемые гранулярности для временной метрики - основной временной размер по всем выбранным метрикам.

```graphql
queryableGranularities(
  environmentId: BigInt!
  metrics: [MetricInput!]!
): [TimeGranularity!]!
```

Вы также можете получить запрашиваемые гранулярности для всех других размеров, используя вызов `dimensions`:

```graphql
{
  dimensions(environmentId: BigInt!, metrics:[{name:"order_total"}]) {
    name
    queryableGranularities # --> ["DAY", "WEEK", "MONTH", "QUARTER", "YEAR"]
  }
}
```

Вы также можете дополнительно получить доступ к этому из конечной точки метрик:

```graphql
{
  metrics(environmentId: BigInt!) {
    name
    dimensions {
      name
      queryableGranularities
    }
  }
}
```

**Получить меры**

```graphql
{
  measures(environmentId: BigInt!, metrics: [{name:"order_total"}]) {
    name
    aggTimeDimension
  }
}
```

`aggTimeDimension` указывает имя размера, который соответствует `metric_time` для данной меры. Вы также можете запрашивать `measures` из конечной точки `metrics`, что позволяет вам увидеть, какие размеры соответствуют `metric_time` для данной метрики:

```graphql
{
  metrics(environmentId: BigInt!) {
    measures {
      name
      aggTimeDimension
    }
  }
}
```

**Получить доступные метрики для заданного набора размеров**

```graphql
metricsForDimensions(
  environmentId: BigInt!
  dimensions: [GroupByInput!]!
): [Metric!]!
```

**Типы метрик**

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

**Параметры типа метрики**

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

**Типы размеров**

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

**Список сохраненных запросов**

```graphql
{
  savedQueries(environmentId: 200532) {
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

При запросе данных требуется _либо_ выбор `groupBy`, _либо_ выбор `metrics`.

**Создать запрос значений размеров**

```graphql
mutation createDimensionValuesQuery(
  environmentId: BigInt!
  metrics: [MetricInput!]
  groupBy: [GroupByInput!]!
): CreateDimensionValuesQueryResult!
```

**Создать запрос метрики**

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
}

GroupByInput {
  name: String!
  grain: TimeGranularity = null
}

WhereInput {
  sql: String!
}

OrderByinput { # -- передайте один и только один из metric или groupBy
  metric: MetricInput = null
  groupBy: GroupByInput = null
  descending: Boolean! = false
}
```

**Получить результат запроса**

```graphql
query(
  environmentId: BigInt!
  queryId: String!
): QueryResult!
```

GraphQL API использует процесс опроса для выполнения запросов, так как запросы могут занимать много времени в некоторых случаях. Он работает следующим образом: сначала создается запрос с помощью мутации `createQuery`, которая возвращает идентификатор запроса. Этот идентификатор затем используется для постоянной проверки (опроса) результатов и статуса вашего запроса. Типичный процесс будет выглядеть следующим образом:

1. Запустите запрос
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
3. Продолжайте опрашивать 2. с подходящим интервалом, пока статус не станет `FAILED` или `SUCCESSFUL`

### Формат вывода и пагинация

**Формат вывода**

По умолчанию вывод осуществляется в формате Arrow. Вы можете переключиться на формат JSON, используя следующий параметр. Однако из-за ограничений производительности мы рекомендуем использовать параметр JSON для тестирования и валидации. Полученный JSON является строкой, закодированной в base64. Чтобы получить к нему доступ, вы можете декодировать его с помощью декодера base64. JSON создается из pandas, что означает, что вы можете вернуть его обратно в dataframe, используя `pandas.read_json(json, orient="table")`. Либо вы можете работать с данными напрямую, используя `json["data"]`, и найти схему таблицы, используя `json["schema"]["fields"]`. В качестве альтернативы вы можете передать `encoded:false` в поле jsonResult, чтобы получить необработанную строку JSON напрямую.

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

Результаты по умолчанию возвращаются в виде таблицы, но вы можете изменить это на любое значение, поддерживаемое [pandas](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_json.html).

**Пагинация**

По умолчанию мы возвращаем 1024 строки на страницу. Если ваш набор результатов превышает это, вам нужно увеличить номер страницы, используя параметр `pageNum`.

### Выполнение запроса на Python

`arrowResult` в ответе на запрос GraphQL является дампом байтов, который не имеет визуальной полезности. Вы можете преобразовать эти байтовые данные в таблицу Arrow, используя любой язык, поддерживающий Arrow. Смотрите следующий пример на Python, который объясняет, как выполнить запрос и декодировать результат arrow:

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
  # Установите подходящий интервал между запросами опроса
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
  """Получить необработанную строку base64 и преобразовать в таблицу Arrow."""
  with pa.ipc.open_stream(base64.b64decode(byte_string)) as reader:
    return pa.Table.from_batches(reader, reader.schema)


arrow_table = to_arrow_table(gql_response.json()["data"]["query"]["arrowResult"])

# Выполните любую доступную функциональность, например, преобразуйте в таблицу pandas.
print(arrow_table.to_pandas())
"""
order_total  ordered_at
          3  2023-08-07
        112  2023-08-08
         12  2023-08-09
       5123  2023-08-10
"""
```

### Дополнительные примеры создания запросов

Следующий раздел предоставляет примеры запросов для GraphQL API, такие как запрос метрик, размеров, фильтров where и многое другое.

**Запрос двух метрик, сгруппированных по времени**

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name: "food_order_amount"}]
    groupBy: [{name: "metric_time"}, {name: "customer__customer_type"}]
  ) {
    queryId
  }
}
```

**Запрос с временной гранулярностью**

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name: "order_total"}]
    groupBy: [{name: "metric_time", grain: MONTH}] 
  ) {
    queryId
  }
}
```

Обратите внимание, что при использовании гранулярности в запросе вывод временного размера с примененной временной гранулярностью всегда принимает форму имени временного размера, добавленного с двойным подчеркиванием и уровнем гранулярности - `{time_dimension_name}__{DAY|WEEK|MONTH|QUARTER|YEAR}`. Даже если гранулярность не указана, она также всегда будет добавлена и по умолчанию будет равна самой низкой доступной (обычно ежедневной для большинства источников данных). Рекомендуется указывать гранулярность при использовании временных размеров, чтобы избежать неожиданных результатов с выходными данными.

**Запрос двух метрик с категориальным размером**

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name: "food_order_amount"}, {name: "order_gross_profit"}]
    groupBy: [{name: "metric_time", grain: MONTH}, {name: "customer__customer_type"}]
  ) {
    queryId
  }
}
```

**Запрос категориального размера отдельно**

```graphql
mutation {
  createQuery(
    environmentId: 123456
    groupBy: [{name: "customer__customer_type"}]
  ) {
    queryId
  }
}
```

**Запрос с фильтром where**

Фильтр `where` принимает список аргументов (или строку для одного ввода). В зависимости от объекта, который вы фильтруете, есть несколько параметров:

 - `Dimension()` &mdash; Используется для любых категориальных или временных размеров. Например, `Dimension('metric_time').grain('week')` или `Dimension('customer__country')`.
  
- `Entity()` &mdash; Используется для сущностей, таких как первичные и внешние ключи, например, `Entity('order_id')`.

Примечание: Если вы предпочитаете клаузу `where` с более явным путем, вы можете дополнительно использовать `TimeDimension()`, чтобы отделить категориальные размеры от временных. Вход `TimeDimension` принимает временной размер и, опционально, уровень гранулярности. `TimeDimension('metric_time', 'month')`.

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics:[{name: "order_total"}]
    groupBy:[{name: "customer__customer_type"}, {name: "metric_time", grain: month}]
    where:[{sql: "{{ Dimension('customer__customer_type') }} = 'new'"}, {sql:"{{ Dimension('metric_time').grain('month') }} > '2022-10-01'"}]
    ) {
     queryId
    }
}
```

Для обоих `TimeDimension()`, гранулярность требуется в фильтре WHERE только в том случае, если временные размеры агрегации для мер и метрик, связанных с фильтром where, имеют разные гранулярности.

Например, рассмотрим эту семантическую модель и конфигурацию метрик, которые содержат две метрики, агрегированные по различным временным гранулярностям. Этот пример показывает одну семантическую модель, но то же самое относится к метрикам более чем одной семантической модели.

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

Предположим, что пользователь запрашивает `metric_0` и `metric_1` вместе, допустимый фильтр будет:

  * `"{{ TimeDimension('metric_time', 'year') }} > '2020-01-01'"`

Недопустимые фильтры будут:

  * ` "{{ TimeDimension('metric_time') }} > '2020-01-01'"` &mdash; метрики в запросе определяются на основе мер с различными гранулярностями.

  * `"{{ TimeDimension('metric_time', 'month') }} > '2020-01-01'"` &mdash; `metric_1` недоступна на месячной гранулярности.

**Запрос с порядком**

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name: "order_total"}]
    groupBy: [{name: "metric_time", grain: MONTH}] 
    orderBy: [{metric: {name: "order_total"}}, {groupBy: {name: "metric_time", grain: MONTH}, descending:true}]
  ) {
    queryId
  }
}
```

**Запрос с ограничением**

```graphql
mutation {
  createQuery(
    environmentId: BigInt!
    metrics: [{name:"food_order_amount"}, {name: "order_gross_profit"}]
    groupBy: [{name:"metric_time", grain: MONTH}, {name: "customer__customer_type"}]
    limit: 10 
  ) {
    queryId
  }
}
```

**Запрос только для компиляции SQL**

Этот запрос принимает те же входные данные, что и мутация `createQuery`.

```graphql
mutation {
  compileSql(
    environmentId: BigInt!
    metrics: [{name:"food_order_amount"} {name:"order_gross_profit"}]
    groupBy: [{name:"metric_time", grain: MONTH}, {name:"customer__customer_type"}]
  ) {
    sql
  }
}
```

**Запрос компиляции SQL с сохраненными запросами**

Этот запрос включает поле `savedQuery` и генерирует SQL на основе предопределенного [сохраненного запроса](/docs/build/saved-queries), а не динамически строит его из списка метрик и группировок. Вы можете использовать это для часто используемых запросов.

```graphql
mutation {
  compileSql(
    environmentId: 200532
    savedQuery: "new_customer_orders" # новое поле
  ) {
    queryId
    sql
  }
}
```

:::info Примечание о запросах сохраненных запросов
При запросе [сохраненных запросов](/docs/build/saved-queries) вы можете использовать параметры, такие как `where`, `limit`, `order`, `compile` и т. д. Однако имейте в виду, что вы не можете получить доступ к параметрам `metric` или `group_by` в этом контексте. Это связано с тем, что они являются предопределенными и фиксированными параметрами для сохраненных запросов, и вы не можете изменить их во время запроса. Если вы хотите запросить больше метрик или размеров, вы можете построить запрос, используя стандартный формат.
:::

**Создать запрос с сохраненными запросами**

Этот запрос принимает те же входные данные, что и мутация `createQuery`, но включает поле `savedQuery`. Вы можете использовать это для часто используемых запросов.

```graphql
mutation {
  createQuery(
    environmentId: 200532
    savedQuery: "new_customer_orders"  # новое поле
  ) {
    queryId
  }
}
```

### Многоступенчатые соединения

В случаях, когда вам нужно выполнять запросы через несколько связанных таблиц (многоступенчатые соединения), используйте аргумент `entity_path`, чтобы указать путь между связанными сущностями. Вот примеры того, как вы можете определить эти соединения:

- В этом примере вы запрашиваете размер `location_name`, но указываете, что он должен быть соединен с использованием поля `order_id`.
	```sql
	{{Dimension('location__location_name', entity_path=['order_id'])}}
	```
- В этом примере размер `salesforce_account_owner` соединен с полем `region`, при этом путь проходит через `salesforce_account`.
	```sql
	{{ Dimension('salesforce_account_owner__region',['salesforce_account']) }}
	```