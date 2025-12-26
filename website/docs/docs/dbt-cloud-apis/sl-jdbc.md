---
title: "JDBC"
id: sl-jdbc
description: "Интеграция и использование JDBC API для запросов к вашим метрикам."
tags: [Semantic Layer, API]
---

# JDBC API <Lifecycle status="self_service,managed,managed_plus" />

Java Database Connectivity (JDBC) API для <Constant name="semantic_layer" /> позволяет пользователям выполнять запросы к метрикам и измерениям с использованием протокола JDBC, а также предоставляет стандартную функциональность работы с метаданными.

JDBC-драйвер — это программный компонент, позволяющий Java-приложению взаимодействовать с платформой данных. Вот дополнительная информация о нашем JDBC API:

- JDBC API для <Constant name="semantic_layer" /> использует open-source JDBC‑драйвер с протоколом ArrowFlight SQL.
- Вы можете скачать JDBC‑драйвер с [Maven](https://search.maven.org/remotecontent?filepath=org/apache/arrow/flight-sql-jdbc-driver/12.0.0/flight-sql-jdbc-driver-12.0.0.jar).
- <Constant name="semantic_layer" /> поддерживает ArrowFlight SQL driver версии 12.0.0 и выше.
- Вы можете встроить драйвер в стек своего приложения по мере необходимости и использовать [пример проекта от dbt Labs](https://github.com/dbt-labs/example-semantic-layer-clients) в качестве ориентира.
- Если вы партнёр или пользователь, разрабатывающий собственное (homegrown) приложение, вам потребуется установить корневой сертификат AWS (AWS root CA) в Java Trust. Подробности см. в [документации](https://www.amazontrust.com/repository/) (актуально для Java и JDBC‑вызовов).

Партнёры dbt Labs могут использовать JDBC API для создания интеграций своих инструментов с <Constant name="semantic_layer" />.

## Использование JDBC API

Если вы пользователь или партнёр dbt и у вас есть доступ к <Constant name="cloud" /> и [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), вы можете [настроить](/docs/use-dbt-semantic-layer/setup-sl) и протестировать этот API на данных из вашего собственного инстанса, сконфигурировав <Constant name="semantic_layer" /> и получив корректные параметры JDBC‑подключения, описанные в этом документе.

Вы *можете* использовать наш JDBC API и с инструментами, у которых нет официальной интеграции с <Constant name="semantic_layer" />. Если используемый вами инструмент позволяет писать SQL и либо поддерживает универсальный JDBC‑драйвер (например, DataGrip), либо поддерживает Dremio и использует драйвер ArrowFlightSQL версии 12.0.0 или выше, вы сможете получить доступ к API <Constant name="semantic_layer" />.

Дополнительную информацию см. в разделе [Get started with the <Constant name="semantic_layer" />](/guides/sl-snowflake-qs).

Обратите внимание, что GraphQL API <Constant name="semantic_layer" /> не поддерживает использование `ref` для обращения к объектам dbt. Вместо этого необходимо использовать полностью квалифицированное имя таблицы. Если вы используете макросы dbt во время выполнения запроса для расчёта метрик, такие вычисления следует перенести в определения метрик <Constant name="semantic_layer" /> в виде кода.

## Аутентификация

<Constant name="cloud" /> авторизует запросы к API <Constant name="semantic_layer" />. Вам необходимо указать Environment ID, Host и [service account tokens](/docs/dbt-cloud-apis/service-tokens) или [personal access tokens](/docs/dbt-cloud-apis/user-tokens).

## Параметры подключения

Подключение JDBC требует нескольких различных параметров подключения.

Вот пример строки подключения URL и отдельных компонентов:

```
jdbc:arrow-flight-sql://semantic-layer.cloud.getdbt.com:443?&environmentId=202339&token=AUTHENTICATION_TOKEN
```

| Параметр JDBC | Описание | Пример |
| -------------- | ----------- | ------- |
| `jdbc:arrow-flight-sql://` | Протокол для JDBC-драйвера. | `jdbc:arrow-flight-sql://` |
| `semantic-layer.cloud.getdbt.com` | [URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для региона вашего аккаунта в <Constant name="cloud" />. Перед URL доступа всегда необходимо добавлять префикс `semantic-layer`. | Для развертывания <Constant name="cloud" /> в Северной Америке используйте `semantic-layer.cloud.getdbt.com` |
| `environmentId` | Уникальный идентификатор продакшн‑окружения dbt. Его можно получить из URL <Constant name="cloud" />, когда вы переходите в раздел **Environments** в меню **Deploy**. | Если ваш URL оканчивается на `.../environments/222222`, то значение `environmentId` — `222222`<br /><br /> |
| `AUTHENTICATION_TOKEN` | Вы можете использовать либо [service token](/docs/dbt-cloud-apis/service-tokens) <Constant name="cloud" /> с правами “Semantic Layer Only” и “Metadata Only”, либо [personal access token](/docs/dbt-cloud-apis/user-tokens) <Constant name="cloud" />. Новый service token или personal token создаётся на странице **Account Settings**. | `token=AUTHENTICATION_TOKEN` |

*Примечание &mdash; Если вы тестируете локально на инструменте, таком как DataGrip, вам также может потребоваться предоставить следующую переменную в конце или начале URL JDBC `&disableCertificateVerification=true`.

## Запрос метаданных через API

JDBC API <Constant name="semantic_layer" /> имеет встроенные вызовы для работы с метаданными, которые позволяют пользователю получать информацию о своих метриках и измерениях.

Разверните следующие переключатели для примеров и команд метаданных:

<Expandable alt_header="Получить определенные метрики">

Вы можете использовать этот запрос для получения всех определенных метрик в вашем проекте dbt:

```bash
select * from {{ 
	semantic_layer.metrics() 
}}
```
</Expandable>

<Expandable alt_header="Получить измерения для метрики">

Вы можете использовать этот запрос для получения всех измерений для метрики.

Обратите внимание, что метрики — это обязательный аргумент, который перечисляет одну или несколько метрик.

```bash
select * from {{ 
    semantic_layer.dimensions(metrics=['food_order_amount'])}}
```
</Expandable>

<Expandable alt_header="Получение гранулярностей для метрик">

Вы можете использовать этот запрос для получения доступных гранулярностей для списка метрик.

Этот запрос API позволяет вам показывать только те временные гранулярности, которые имеют смысл для основной временной размерности метрик (например, metric_time), но если вы хотите получить доступные гранулярности для других временных размерностей, вы можете использовать вызов dimensions() и найти столбец queryable_granularities.

Обратите внимание, что метрики — это обязательный аргумент, который перечисляет одну или несколько метрик.
```bash
select * from {{
    semantic_layer.queryable_granularities(metrics=['food_order_amount', 'order_gross_profit'])}}
```

</Expandable>

<Expandable alt_header="Получить доступные метрики для заданных измерений">

Вы можете использовать этот запрос для получения доступных метрик для заданных измерений. Эта команда по сути является противоположностью получения измерений для списка метрик.

Обратите внимание, что group_by — это обязательный аргумент, который перечисляет одно или несколько измерений.

```bash
select * from {{
    semantic_layer.metrics_for_dimensions(group_by=['customer__customer_type'])
}}
```

</Expandable>

<Expandable alt_header="Получить гранулярности для всех временных измерений">

Вы можете использовать этот пример запроса для получения доступных гранулярностей для всех временных измерений (аналогичный вызов API queryable granularities возвращает только гранулярности для основных временных измерений для метрик).

Следующий вызов является производным от вызова dimensions() и специально выбирает поле гранулярности.

```bash
select NAME, QUERYABLE_GRANULARITIES from {{
    semantic_layer.dimensions(
        metrics=["order_total"]
    )
}}
```

</Expandable>

<Expandable alt_header="Получить имена основных временных измерений">

В вашем приложении может быть полезно отображать имена временных измерений, которые представляют metric_time или общую нить для всех метрик.

Сначала вы можете выполнить запрос аргумента metrics() для получения списка мер, затем использовать вызов measures(), который вернет имя(а) временных измерений, составляющих metric_time.

```bash
select * from {{
    semantic_layer.measures(metrics=['orders'])
}}
```

</Expandable>

<Expandable alt_header="Получить метрики по поиску подстроки">

Вы можете отфильтровать ваши метрики, чтобы включить только те, которые содержат определенную подстроку (последовательность символов, содержащаяся в более длинной строке (тексте)). Используйте аргумент `search`, чтобы указать подстроку, которую вы хотите сопоставить.

```sql
select * from {{ semantic_layer.metrics(search='order') }}
```

Если подстрока не указана, запрос возвращает все метрики.

</Expandable> 

<Expandable alt_header="Пагинация вызовов метаданных">

В случае, если вы не хотите возвращать полный набор результатов из вызова метаданных, вы можете разбить результаты на страницы как для вызовов `semantic_layer.metrics()`, так и для `semantic_layer.dimensions()` с использованием параметров `page_size` и `page_number`.

- `page_size`: Это необязательная переменная, которая устанавливает количество записей на странице. Если оставить None, ограничения на количество страниц нет.
- `page_number`: Это необязательная переменная, которая указывает номер страницы для получения. По умолчанию `1` (первая страница), если не указано.

Примеры:

```sql
-- Получает 5-ю страницу с размером страницы 10 метрик
select * from {{ semantic_layer.metrics(page_size=10, page_number=5) }}

-- Получает 1-ю страницу с размером страницы 10 метрик
select * from {{ semantic_layer.metrics(page_size=10) }}

-- Получает все метрики без пагинации
select * from {{ semantic_layer.metrics() }}
```

Вы можете использовать те же параметры пагинации для `semantic_layer.dimensions(...)`.
</Expandable> 

<Expandable alt_header="Список сохраненных запросов">

Вы можете использовать этот пример запроса, чтобы перечислить все доступные сохраненные запросы в вашем проекте dbt.

**Команда**

```bash
select * from semantic_layer.saved_queries()
```

**Вывод**

```bash
| NAME | DESCRIPTION | LABEL | METRICS | GROUP_BY | WHERE_FILTER |
```

</Expandable>

<Expandable alt_header="Fetch metric aliases">

Вы можете запрашивать метрики, используя алиасы — более простые или интуитивно понятные имена — даже если алиас не определён в конфигурации метрики. Запрос вернёт алиас в качестве имени метрики, например:

```sql
select * from {{
    semantic_layer.query(metrics=[Metric("metric_name", alias="metric_alias")])
}}
```

В этом примере, если вы зададите алиас `banana` для метрики `revenue`, запрос вернёт колонку с именем `banana`, даже если `banana` не определён в конфигурации метрики. Однако при использовании Jinja‑условий `where` необходимо ссылаться на _фактическое_ имя метрики (`revenue` в данном случае), а не на алиас.

Более подробный пример см. в разделе [Query metric alias](#query-metric-alias).
</Expandable>

## Запрос значений через API

Для запроса значений доступны следующие параметры. Ваш запрос должен содержать _либо_ параметр `metric`, **либо** параметр `group_by`, чтобы считаться валидным.

| Parameter | <div style={{width:'400px'}}>Description</div>  | <div style={{width:'100px'}}>Example</div>  |  |
| --------- | -----------| ------------ |
| `metrics`   | Имя метрики, как определено в вашей конфигурации метрик dbt   | `metrics=['revenue']` | 
| `group_by`  | Имена измерений или сущностей для группировки. Мы требуем ссылки на сущность измерения (кроме основной временной размерности), которая добавляется перед именем измерения с двойным подчеркиванием. | `group_by=['user__country', 'metric_time']`    |
| `grain`   | Параметр, специфичный для любой временной размерности, изменяющий гранулярность данных по умолчанию для метрики. | `group_by=[Dimension('metric_time')` <br/> `grain('week\|day\|month\|quarter\|year')]` | 
| `where`     | Условие where, позволяющее фильтровать по измерениям и сущностям с использованием параметров. Это принимает список фильтров ИЛИ строку. Входные данные поставляются с объектами `Dimension` и `Entity`. Гранулярность требуется, если `Dimension` является временной размерностью | `"{{ where=Dimension('customer__country') }} = 'US')"`   | 
| `limit`   | Ограничение на возвращаемые данные    | `limit=10` | 
|`order`  | Упорядочивание возвращаемых данных по определенному полю     | `order_by=['order_gross_profit']`, используйте `-` для убывания, или полную нотацию объекта, если объект подвергается операции: `order_by=[Metric('order_gross_profit').descending(True)`]   | 
| `compile`   | Если true, возвращает сгенерированный SQL для платформы данных, но не выполняет его | `compile=True`  |
| `saved_query` | Сохраненный запрос, который вы можете использовать для часто используемых запросов. | `select * from {{ semantic_layer.query(saved_query="new_customer_orders"` |

### Примечание о временных измерениях и `metric_time`

Вы заметите, что в списке измерений для всех метрик есть измерение под названием `metric_time`. `Metric_time` — это зарезервированное ключевое слово для временных измерений агрегации, специфичных для меры. Для любой временной метрики ключевое слово `metric_time` всегда должно быть доступно для использования в запросах. Это общее измерение для *всех* метрик в семантическом графе.

Вы можете рассматривать одну метрику или сотни метрик, и если вы группируете по `metric_time`, это всегда даст вам правильный временной ряд.

Кроме того, при выполнении расчетов гранулярности, которые являются глобальными (не специфичными для конкретного временного измерения), мы рекомендуем всегда работать с `metric_time`, и вы получите правильный ответ.

Обратите внимание, что `metric_time` должен быть доступен в дополнение к любым другим временным измерениям, доступным для метрики(ов). В случае, если вы рассматриваете одну метрику (или несколько метрик из одного источника данных), значения в серии для основной временной размерности и `metric_time` эквивалентны.

## Примеры

В следующих разделах приведены примеры того, как выполнять запросы к метрикам с использованием JDBC API:

<!-- no toc -->
- [Fetch metadata for metrics](#fetch-metadata-for-metrics) &mdash; Фильтрация или добавление любого SQL-кода вне шаблонного синтаксиса.
- [Query common dimensions](#query-common-dimensions) &mdash; Выбор общих измерений для нескольких метрик.
- [Query grouped by time](#query-grouped-by-time) &mdash; Получение данных о выручке и новых клиентах с группировкой по времени.
- [Query with a time grain](#query-with-a-time-grain) &mdash; Получение нескольких метрик с изменением гранулярности временного измерения.
- [Group by categorical dimension](#group-by-categorical-dimension) &mdash; Группировка по категориальному измерению.
- [Query only a dimension](#query-only-a-dimension) &mdash; Получение полного списка значений для выбранного измерения.
- [Query by all dimensions](#query-by-all-dimensions) &mdash; Выполнение запроса с использованием всех допустимых измерений.
- [Query with where filters](#query-with-where-filters) &mdash; Использование параметра `where` для фильтрации по измерениям и сущностям с помощью параметров.
- [Query with a limit](#query-with-a-limit) &mdash; Выполнение запроса с использованием `limit` или `order_by`.
- [Query with order by examples](#query-with-order-by-examples) &mdash; Запрос с использованием `order_by`, который принимает простую строку, представляющую Dimension, Metric или Entity. По умолчанию используется сортировка по возрастанию. Для сортировки по убыванию добавьте символ `-` перед объектом.
- [Query with compile keyword](#query-with-compile-keyword) &mdash; Выполнение запроса с использованием ключевого слова `compile` для предварительного просмотра итогового SQL перед выполнением.
- [Query a saved query](#query-a-saved-query) &mdash; Выполнение запроса с использованием сохранённого запроса с дополнительными параметрами, такими как `limit` или `where`.
- [Query metric alias](#query-metric-alias) &mdash; Запрос метрик с использованием алиасов, которые позволяют применять более простые или интуитивно понятные имена вместо полных определений метрик.
- [Multi-hop joins](#multi-hop-joins) &mdash; Выполнение запросов через несколько связанных таблиц (multi-hop joins) с использованием аргумента `entity_path` для указания пути между связанными сущностями.

Вы можете фильтровать/добавлять любой SQL вне синтаксиса шаблонизации. Например, вы можете использовать следующий запрос для получения имени и измерений для метрики:

```bash
select name, dimensions from {{ 
	semantic_layer.metrics() 
	}}
	WHERE name='food_order_amount'
``` 

### Запрос общих измерений

Вы можете выбрать общие измерения для нескольких метрик. Используйте следующий запрос для получения имени и измерений для нескольких метрик:

```bash
select * from {{ 
	semantic_layer.dimensions(metrics=['food_order_amount', 'order_gross_profit'])
	}}
``` 

### Запрос с группировкой по времени

Следующий пример запроса использует [сокращенный метод](#faqs) для получения дохода и новых клиентов с группировкой по времени:

```bash
select * from {{
	semantic_layer.query(metrics=['food_order_amount','order_gross_profit'], 
	group_by=['metric_time'])
	}}
``` 

### Запрос с временной гранулярностью

Используйте следующий пример запроса для получения нескольких метрик с изменением гранулярности временной размерности:

```bash
select * from {{
	semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'], 
	group_by=[Dimension('metric_time').grain('month')])
	}}
```

### Группировка по категориальному измерению

Используйте следующий запрос для группировки по категориальному измерению:

```bash
select * from {{
	semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'], 
	group_by=[Dimension('metric_time').grain('month'), 'customer__customer_type'])
	}}
``` 

### Запрос только измерения

В этом случае вы получите полный список значений измерений для выбранного измерения.

```bash
select * from {{
    semantic_layer.query(group_by=['customer__customer_type'])
                  }}
```

### Запрос по всем измерениям

Вы можете использовать endpoint `semantic_layer.query_with_all_group_bys`, чтобы выполнить запрос по всем допустимым измерениям.

```sql
select * from {{
    semantic_layer.query_with_all_group_bys(metrics =['revenue','orders','food_orders'],
    compile= True)
}}
```

В результате будут возвращены все измерения, которые являются допустимыми для набора метрик, указанных в запросе.

### Запрос с фильтрами `where`

Фильтры where в API позволяют использовать список фильтров или строку. Мы рекомендуем использовать список фильтров для производственных приложений, так как этот формат реализует все преимущества <Term id="predicate-pushdown" /> там, где это возможно.

Фильтры Where имеют несколько объектов, которые вы можете использовать:

- `Dimension()` &mdash; Используется для любых категориальных или временных измерений. `Dimension('metric_time').grain('week')` или `Dimension('customer__country')`.

- `TimeDimension()` &mdash; Используется как более явное определение для временных измерений, опционально принимает гранулярность `TimeDimension('metric_time', 'month')`.

- `Entity()` &mdash; Используется для сущностей, таких как первичные и внешние ключи - `Entity('order_id')`.

Для `TimeDimension()` гранулярность требуется в фильтре `WHERE` только в том случае, если временные измерения агрегации для мер и метрик, связанных с фильтром where, имеют разные гранулярности.

Например, рассмотрим эту конфигурацию семантической модели и метрики, которая содержит две метрики, агрегированные по разным временным гранулярностям. Этот пример показывает одну семантическую модель, но то же самое относится к метрикам в более чем одной семантической модели.

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
    description: Метрика с месячной гранулярностью.
    type: simple
    type_params:
      measure: measure_0
  - name: metric_1
    description: Метрика с годовой гранулярностью.
    type: simple
    type_params:
      measure: measure_1

```

Предположим, пользователь запрашивает `metric_0` и `metric_1` вместе в одном запросе, допустимый фильтр `WHERE` будет:

  * `"{{ TimeDimension('metric_time', 'year') }} > '2020-01-01'"`

Недопустимые фильтры будут:

  * `"{{ TimeDimension('metric_time') }} > '2020-01-01'"` &mdash; метрики в запросе определены на основе мер с разными гранулярностями.

  * `"{{ TimeDimension('metric_time', 'month') }} > '2020-01-01'"` &mdash; `metric_1` недоступна на месячной гранулярности.

- Используйте следующий пример для запроса с использованием фильтра `where` в строковом формате:

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
group_by=[Dimension('metric_time').grain('month'),'customer__customer_type'],
where="{{ Dimension('metric_time').grain('month')  }} >= '2017-03-09' AND {{ Dimension('customer__customer_type' }} in ('new') AND {{ Entity('order_id') }} = 10")
}}
```

- (Рекомендуется для лучшей производительности) Используйте следующий пример для запроса с использованием фильтра `where` в формате списка фильтров:

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
group_by=[Dimension('metric_time').grain('month'),'customer__customer_type'],
where=["{{ Dimension('metric_time').grain('month') }} >= '2017-03-09'", "{{ Dimension('customer__customer_type') }} in ('new')", "{{ Entity('order_id') }} = 10"])
}}
```

### Запрос с ограничением

Используйте следующий пример для запроса с использованием `limit` или `order_by`:

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
  group_by=[Dimension('metric_time')],
  limit=10)
  }}
```

### Примеры запросов с `order by`

Order By может принимать простую строку, которая является Dimension, Metric или Entity, и по умолчанию будет использовать порядок по возрастанию

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
  group_by=[Dimension('metric_time')],
  limit=10,
  order_by=['order_gross_profit'])
  }}
``` 

Для убывающего порядка вы можете добавить знак `-` перед объектом. Однако вы можете использовать эту сокращенную нотацию только в том случае, если вы не выполняете операции над объектом или используете полную нотацию объекта.

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
  group_by=[Dimension('metric_time')],
  limit=10,
  order_by=['-order_gross_profit'])
  }}
```

Если вы упорядочиваете по объекту, который подвергся операции (например, вы изменили гранулярность временной размерности), или вы используете полную нотацию объекта, убывающий порядок должен выглядеть так:

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
  group_by=[Dimension('metric_time').grain('week')],
  limit=10,
  order_by=[Metric('order_gross_profit').descending(True), Dimension('metric_time').grain('week').descending(True) ])
  }}
``` 

Аналогично, это приведет к порядку по возрастанию: 

```bash
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
  group_by=[Dimension('metric_time').grain('week')],
  limit=10,
  order_by=[Metric('order_gross_profit'), Dimension('metric_time').grain('week')])
  }}
``` 

### Запрос с ключевым словом compile

- Используйте следующий пример для запроса с использованием ключевого слова `compile`:
  ```sql
  select * from {{
  semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
      group_by=[Dimension('metric_time').grain('month'),'customer__customer_type'],
      compile=True)
      }}
  ```

- Используйте следующий пример для компиляции SQL с [сохраненным запросом](/docs/build/saved-queries). Вы можете использовать это для часто используемых запросов.

  ```sql
  select * from {{ semantic_layer.query(saved_query="new_customer_orders", limit=5, compile=True}}
  ```

:::info Примечание о запросе сохраненных запросов
При запросе [сохраненных запросов](/docs/build/saved-queries) вы можете использовать такие параметры, как `where`, `limit`, `order`, `compile` и так далее. Однако имейте в виду, что вы не можете получить доступ к параметрам `metric` или `group_by` в этом контексте. Это связано с тем, что они являются предопределенными и фиксированными параметрами для сохраненных запросов, и вы не можете изменить их во время выполнения запроса. Если вы хотите запросить больше метрик или измерений, вы можете построить запрос, используя стандартный формат.
:::

### Запрос сохраненного запроса

Используйте следующий пример для запроса [сохраненного запроса](/docs/build/saved-queries):

```sql
select * from {{ semantic_layer.query(saved_query="new_customer_orders", limit=5}}
```

JDBC API будет использовать сохраненный запрос (`new_customer_orders`) как определено и применит ограничение в 5 записей.

### Алиасы метрик в запросах

Вы можете запрашивать метрики, используя алиасы. Алиасы позволяют использовать более простые или более интуитивно понятные имена для метрик вместо их полных определений.

```sql
select * from {{
    semantic_layer.query(metrics=[Metric("revenue", alias="metric_alias")])
}}
```

Например, предположим, что в конфигурации метрик для метрики `order_total` задан алиас `total_revenue_global`. В этом случае вы можете запрашивать метрику, используя алиас вместо исходного имени:

```sql
select * from {{
    semantic_layer.query(metrics=[Metric("order_total", alias="total_revenue_global")], group_by=['metric_time'])
}}
```

Результат будет следующим:

```
| METRIC_TIME   | TOTAL_REVENUE_GLOBAL |
|:-------------:|:------------------:  |
| 2023-12-01    |              1500.75 |
| 2023-12-02    |              1725.50 |
| 2023-12-03    |              1850.00 |
```

:::tip
Обратите внимание, что при использовании Jinja-условий `where` необходимо указывать фактическое имя метрики. Например, если вы использовали `banana` в качестве алиаса для `revenue`, то в условии `where` нужно использовать реальное имя метрики — `revenue`, а не `banana`.

```graphql
semantic_layer.query(metrics=[Metric("revenue", alias="banana")], where="{{ Metric('revenue') }} > 0")
```

:::

### Многошаговые (multi-hop) соединения

В случаях, когда вам нужно выполнить запрос через несколько связанных таблиц (многозвенные соединения), используйте аргумент `entity_path`, чтобы указать путь между связанными сущностями. Вот примеры того, как вы можете определить эти соединения:

- В этом примере вы запрашиваете измерение `location_name`, но указываете, что оно должно быть соединено с использованием поля `order_id`.
	```sql
	{{Dimension('location__location_name', entity_path=['order_id'])}}
	```
- В этом примере измерение `salesforce_account_owner` соединено с полем `region`, с путем, проходящим через `salesforce_account`.
	```sql
	{{ Dimension('salesforce_account_owner__region',['salesforce_account']) }}
	```

## Часто задаваемые вопросы

<FAQ path="Troubleshooting/sl-alpn-error" />

<DetailsToggle alt_header="Почему некоторые измерения используют разный синтаксис, например, `metric_time` против `Dimension('metric_time')`?">
Когда вы выбираете измерение само по себе, например, `metric_time`, вы можете использовать сокращенный метод, который не требует синтаксиса “Dimension”.

Однако, когда вы выполняете операции над измерением, такие как добавление гранулярности, требуется объектный синтаксис `[Dimension('metric_time')`.
</DetailsToggle>

<DetailsToggle alt_header="Что означает синтаксис двойного подчеркивания `'__'` в измерениях?">

Синтаксис двойного подчеркивания `"__"` указывает на отображение от сущности к измерению, а также на то, где находится измерение. Например, `user__country` означает, что кто-то смотрит на измерение `country` из таблицы `user`.
</DetailsToggle>

<DetailsToggle alt_header="Каков формат вывода по умолчанию при добавлении гранулярности?">

Формат вывода по умолчанию следует формату `{{time_dimension_name}__{granularity_level}}`.

Так, например, если `time_dimension_name` — это `ds`, а уровень гранулярности — годовой, вывод будет `ds__year`.

</DetailsToggle>

## Связанная документация

- [<Constant name="semantic_layer" />: лучшие практики интеграции](/guides/sl-partner-integration-guide)

- [Лучшие практики интеграции семантического слоя dbt](/guides/sl-partner-integration-guide)