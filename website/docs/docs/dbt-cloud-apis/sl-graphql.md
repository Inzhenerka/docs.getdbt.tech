---
title: "GraphQL"
id: sl-graphql
description: "Интеграция и использование GraphQL API для запросов ваших метрик."
tags: [Semantic Layer, APIs]
---

[GraphQL](https://graphql.org/) (GQL) — это язык запросов с открытым исходным кодом для API. Он предлагает более эффективный и гибкий подход по сравнению с традиционными RESTful API.

С помощью GraphQL пользователи могут запрашивать конкретные данные с помощью одного запроса, что уменьшает необходимость в многочисленных обращениях к серверу. Это улучшает производительность и минимизирует сетевые издержки.

GraphQL имеет несколько преимуществ, таких как самодокументируемость, наличие системы строгой типизации, поддержка версионирования и эволюции, возможность быстрого развития и наличие мощной экосистемы. Эти функции делают GraphQL мощным выбором для API, которые придают приоритет гибкости, производительности и продуктивности разработчиков.

## GraphQL API семантического слоя dbt

GraphQL API семантического слоя dbt позволяет вам исследовать и запрашивать метрики и измерения. Благодаря своей самодокументируемой природе, вы можете удобно исследовать вызовы через проводник схемы.

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

Партнеры dbt могут использовать GraphQL API семантического слоя для создания интеграции с семантическим слоем dbt.

Обратите внимание, что API семантического слоя dbt не поддерживает `ref` для вызова объектов dbt. Вместо этого используйте полное квалифицированное имя таблицы. Если вы используете макросы dbt во время запроса для вычисления ваших метрик, вы должны перенести эти вычисления в определения метрик вашего семантического слоя в виде кода.

## Требования для использования GraphQL API
- Проект dbt Cloud на dbt версии 1.6 или выше
- Метрики определены и настроены
- [Сервисный токен](/docs/dbt-cloud-apis/service-tokens) dbt Cloud с разрешениями "Только семантический слой" и "Только метаданные"
- Ваш проект dbt настроен и подключен к платформе данных

## Использование GraphQL API

Если вы пользователь dbt или партнер с доступом к dbt Cloud и [семантическому слою dbt](/docs/use-dbt-semantic-layer/dbt-sl), вы можете [настроить](/docs/use-dbt-semantic-layer/setup-sl) и протестировать этот API с данными из вашей собственной инстанции, настроив семантический слой и получив правильные параметры подключения GQL, описанные в этом документе.

Обратитесь к [Начало работы с семантическим слоем dbt](/guides/sl-snowflake-qs) для получения дополнительной информации.

### Аутентификация

Аутентификация использует [токены сервисного аккаунта](/docs/dbt-cloud-apis/service-tokens) dbt Cloud, передаваемые через заголовок следующим образом. Чтобы исследовать схему, вы можете ввести эту информацию в разделе "header".

```
{"Authorization": "Bearer <SERVICE TOKEN>"}
```

Каждый запрос GQL также требует `environmentId` dbt Cloud. API использует как сервисный токен в заголовке, так и `environmentId` для аутентификации.

### Вызовы метаданных

**Получение диалекта платформы данных**

В некоторых случаях в вашем приложении может быть полезно знать диалект или платформу данных, которая используется для подключения к семантическому слою dbt (например, если вы строите фильтры `where` из пользовательского интерфейса, а не из введенного пользователем SQL).

GraphQL API имеет простой способ получить это с помощью следующего запроса:

```graphql
{
  environmentInfo(environmentId: BigInt!) {
    dialect
  }
}
```

**Получение доступных метрик**

```graphql
metrics(environmentId: BigInt!): [Metric!]!
```

**Получение доступных измерений для метрик**

```graphql
dimensions(
  environmentId: BigInt!
  metrics: [MetricInput!]!
): [Dimension!]!
```

**Получение доступных гранулярностей для метрик**

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
  dimensions(environmentId: BigInt!, metrics:[{name:"order_total"}]) {
    name
    queryableGranularities # --> ["DAY", "WEEK", "MONTH", "QUARTER", "YEAR"]
  }
}
```

Вы также можете опционально получить доступ к этому из конечной точки метрик:

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

**Получение мер**

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
  metrics(environmentId: BigInt!) {
    measures {
      name
      aggTimeDimension
    }
  }
}
```

**Получение доступных метрик для набора измерений**

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

**Параметры типа метрик**

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

**Типы измерений**

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

При запросе данных требуется _либо_ выбор `groupBy`, _либо_ `metrics`.

**Создание запроса значений измерений**

```graphql
mutation createDimensionValuesQuery(
  environmentId: BigInt!
  metrics: [MetricInput!]
  groupBy: [GroupByInput!]!
): CreateDimensionValuesQueryResult!
```

**Создание запроса метрик**

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

OrderByinput { # -- передайте только один из metric или groupBy
  metric: MetricInput = null
  groupBy: GroupByInput = null
  descending: Boolean! = false
}
```

**Получение результата запроса**

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

**Формат вывода**

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

**Пагинация**

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

### Дополнительные примеры создания запросов

Следующий раздел предоставляет примеры запросов для GraphQL API, такие как запросы метрик, измерений, фильтров where и многое другое.

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

**Запрос с временной зернистостью**

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

Обратите внимание, что при использовании гранулярности в запросе вывод временного измерения с примененной к нему временной зернистостью всегда принимает форму имени измерения, дополненного двойным подчеркиванием и уровнем гранулярности - `{time_dimension_name}__{DAY|WEEK|MONTH|QUARTER|YEAR}`. Даже если гранулярность не указана, она также всегда будет иметь добавленную гранулярность и по умолчанию будет самой низкой доступной (обычно ежедневной для большинства источников данных). Рекомендуется указывать гранулярность при использовании временных измерений, чтобы не было неожиданных результатов с выходными данными.

**Запрос двух метрик с категорическим измерением**

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

**Запрос категорического измерения отдельно**

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

Фильтр `where` принимает аргумент списка (или строку для одного ввода). В зависимости от объекта, который вы фильтруете, есть несколько параметров:

- `Dimension()` &mdash; Используется для любых категориальных или временных измерений. Например, `Dimension('metric_time').grain('week')` или `Dimension('customer__country')`.

- `Entity()` &mdash; Используется для сущностей, таких как первичные и внешние ключи, например, `Entity('order_id')`.

Примечание: Если вы предпочитаете `where`-условие с более явным путем, вы можете опционально использовать `TimeDimension()` для разделения категориальных измерений от временных. Ввод `TimeDimension` принимает временное измерение и, опционально, уровень гранулярности. `TimeDimension('metric_time', 'month')`.

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

Для обоих `TimeDimension()`, зернистость требуется в фильтре WHERE только в том случае, если измерения времени агрегации для мер и метрик, связанных с фильтром where, имеют разные зернистости.

Например, рассмотрим эту конфигурацию семантической модели и метрики, которая содержит две метрики, агрегированные по разным временным зернистостям. Этот пример показывает одну семантическую модель, но то же самое относится к метрикам в более чем одной семантической модели.

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

Предположим, что пользователь запрашивает `metric_0` и `metric_1` вместе, допустимым фильтром будет:

* `"{{ TimeDimension('metric_time', 'year') }} > '2020-01-01'"`

Недопустимые фильтры будут:

* `"{{ TimeDimension('metric_time') }} > '2020-01-01'"` &mdash; метрики в запросе определены на основе мер с разными зернистостями.

* `"{{ TimeDimension('metric_time', 'month') }} > '2020-01-01'"` &mdash; `metric_1` недоступна на уровне месячной зернистости.

**Запрос с сортировкой**

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

**Запрос с только компиляцией SQL**

Это принимает те же входные данные, что и мутация `createQuery`.

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

:::info Примечание о запросе сохраненных запросов
При запросе [сохраненных запросов](/docs/build/saved-queries) вы можете использовать такие параметры, как `where`, `limit`, `order`, `compile` и так далее. Однако имейте в виду, что вы не можете получить доступ к параметрам `metric` или `group_by` в этом контексте. Это связано с тем, что они являются предопределенными и фиксированными параметрами для сохраненных запросов, и вы не можете изменить их во время запроса. Если вы хотите запросить больше метрик или измерений, вы можете построить запрос, используя стандартный формат.
:::

**Создание запроса с сохраненными запросами**

Это принимает те же входные данные, что и мутация `createQuery`, но включает поле `savedQuery`. Вы можете использовать это для часто используемых запросов.

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

### Многопереходные соединения

В случаях, когда вам нужно выполнить запрос через несколько связанных таблиц (многопереходные соединения), используйте аргумент `entity_path`, чтобы указать путь между связанными сущностями. Вот примеры того, как вы можете определить эти соединения:

- В этом примере вы запрашиваете измерение `location_name`, но указываете, что оно должно быть соединено, используя поле `order_id`.
	```sql
	{{Dimension('location__location_name', entity_path=['order_id'])}}
	```
- В этом примере измерение `salesforce_account_owner` соединено с полем `region`, с путем, проходящим через `salesforce_account`.
	```sql
	{{ Dimension('salesforce_account_owner__region',['salesforce_account']) }}
	```