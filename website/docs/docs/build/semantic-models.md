---
title: "Семантические модели"
id: "semantic-models"
description: "Семантические модели — это абстракции в формате YAML поверх модели dbt, связанные ключами соединения, которые служат рёбрами"
keywords:
  - слой метрик dbt
sidebar_label: Семантические модели
tags: [Метрики, Семантический слой]
pagination_next: "docs/build/dimensions"
availability: all_users
---

import CopilotBeta from '/snippets/_dbt-copilot-avail.md';

<CopilotBeta resource='semantic models' />

Семантические модели являются основой для описания данных в MetricFlow, который лежит в основе <Constant name="semantic_layer" />:

<VersionBlock lastVersion="1.11">

- Представляйте семантические модели как узлы семантического графа, связанные сущностями.
- MetricFlow использует файлы конфигурации YAML для создания этого графа, который позволяет запрашивать метрики.
- Каждая семантическая модель соответствует модели dbt в вашем DAG и требует собственной конфигурации YAML.
- На основе одной модели dbt (SQL или Python) можно создать несколько семантических моделей, если каждой из них присвоено уникальное имя.
- Настраивайте семантические модели в файле YAML в каталоге вашего проекта dbt. Подробнее о структуре проекта см. в [руководстве по рекомендуемым практикам](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro).
- Размещайте их в папке `metrics:` или среди исходных файлов проекта в зависимости от ваших потребностей.

<Lightbox src="/img/docs/dbt-platform/semantic-layer/semantic_foundation.jpg" width="70%" title="Семантическая модель состоит из различных компонентов: сущностей, мер и измерений."/>
</VersionBlock>

<VersionBlock firstVersion="1.12">

- Представляйте семантические модели как узлы семантического графа, связанные сущностями. Этот граф можно настроить, добавив к моделям dbt аннотации метаданных, описывающие их использование при вычислении метрик. 
- MetricFlow использует файлы конфигурации YAML для создания этого графа, который позволяет запрашивать метрики.
- Каждая семантическая модель соответствует модели dbt в вашем DAG и требует собственной конфигурации YAML.
- В каждой модели dbt можно определить одну семантическую модель с помощью блока `semantic_model`. Используйте необязательное поле `name`, если нужно задать другое отображаемое имя.
- Настраивайте семантические модели в файле YAML в каталоге вашего проекта dbt, встраивая их в определения моделей, а не создавая отдельные конфигурации.
- Вы также можете определять семантические модели с помощью документов [Apache Ossie](https://github.com/apache/ossie) — альтернативы встроенной конфигурации YAML в dbt. Подробнее см. в разделе [Документы семантического слоя Ossie](/docs/build/ossie-semantic-models).

</VersionBlock>

import SLCourses from '/snippets/\_sl-course.md';

<SLCourses/>

Здесь мы описываем компоненты семантической модели с примерами:

<VersionBlock lastVersion="1.11">

| Компонент    | Описание      | Обязательность     |  Тип     | 
| ------------ | ---------------- | -------- | -------- | 
| [Имя](#name)     | Выберите уникальное имя для семантической модели. Не используйте двойные подчёркивания (\_\_) в имени, так как они не поддерживаются.   | Обязательно | String |
| [Описание](#description)    | 	Укажите важные сведения в описании.   | Необязательно | String |
| [Модель](#model)     | Указывает модель dbt для семантической модели с помощью функции `ref`.    | Обязательно | String |
| [Значения по умолчанию](#defaults)      | Значения по умолчанию для модели; в настоящее время поддерживается только `agg_time_dimension`.    | Обязательно |  Dict |
| [Сущности](#entities)         | Использует столбцы сущностей в качестве ключей соединения и указывает их тип — первичный, внешний или уникальный ключ — с помощью параметра `type`.  | Обязательно | List | 
| [Первичная сущность](#primary-entity) | Если первичная сущность существует, этот компонент необязателен. Если у семантической модели нет первичной сущности, это свойство обязательно.    | Необязательно | String | 
| [Измерения](#dimensions)     | Различные способы группировки данных или формирования срезов данных для метрики; могут иметь тип `time` или `categorical`.  | Обязательно | List |
| [Меры](/docs/build/semantic-models?version=1.11#measures)     | Агрегации, применяемые к столбцам вашей модели данных. Они могут выступать в качестве итоговой метрики или использоваться как составные элементы более сложных метрик.  | Необязательно | List |
| [Отображаемое имя](/reference/semantic-model-properties)     | Отображаемое имя для `node`, `dimension`, `entity` и/или `measures` вашей семантической модели.   | Необязательно | String |
| `config`   | Используйте свойство [`config`](/reference/resource-properties/config), чтобы задать настройки вашей метрики. Поддерживает настройки [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group) и [`enabled`](/reference/resource-configs/enabled). | Необязательно | Dict |
</VersionBlock>

<VersionBlock firstVersion="1.12">

| Компонент    | Описание      | Обязательность     |  Тип     | 
| ------------ | ---------------- | -------- | -------- | 
| [Имя](#name)     | Выберите имя для семантической модели. Не используйте двойные подчёркивания (\_\_) в имени, так как они не поддерживаются. По умолчанию используется имя модели.  | Необязательно | String |
| [Временное измерение](#time-dimension) | Поддерживается только `agg_time_dimension`.    | Обязательно |  Dict |
| [Сущности](#entities)         | Определяйте сущности на уровне столбцов. Для каждого столбца, который служит ключом соединения, добавьте блок entity в описание столбца, задав для `type` значение primary, foreign, unique или natural. При необходимости добавьте name, description, label, config или используйте expr, если ключ соединения отличается от столбца. | Обязательно | List | 
| [Первичная сущность](#primary-entity) | Если в столбце объявлена сущность с `type: primary`, свойство `primary_entity` не требуется. Если ни один столбец не является первичным, задайте свойство верхнего уровня `primary_entity`, чтобы указать имя первичной сущности модели. | Необязательно | String | 
| [Измерения](#dimensions)     | Различные способы группировки данных или формирования срезов данных для метрики; могут иметь тип `time` или `categorical`.  | Обязательно | List |
| [Производные семантические элементы](#derived_semantics-in-dimensions-and-entities) | Используйте для создания измерений и сущностей, которые не соответствуют одному физическому столбцу. Поле `expr` обязательно. | Необязательно | List |
| [Простые метрики](/docs/build/semantic-models?version=1.11#measures)     | Агрегации, применяемые к столбцам вашей модели данных. Они могут выступать в качестве итоговой метрики или использоваться как составные элементы более сложных метрик.  | Необязательно | List |
| [Отображаемое имя](/reference/semantic-model-properties)     | Отображаемое имя для `node`, `dimension`, `entity` и/или простых метрик вашей семантической модели.   | Необязательно | String |
| `config`   | Используйте свойство [`config`](/reference/resource-properties/config), чтобы задать настройки вашей метрики. Поддерживает настройки [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group) и [`enabled`](/reference/resource-configs/enabled). | Необязательно | Dict |

</VersionBlock>

## Компоненты семантических моделей {#semantic-models-components}

Полная спецификация для семантических моделей приведена ниже:

<VersionBlock lastVersion="1.11">

```yaml
semantic_models:
  - name: the_name_of_the_semantic_model ## Обязательный
    description: same as always ## Необязательный
    model: ref('some_model') ## Обязательный
    defaults: ## Обязательный
      agg_time_dimension: dimension_name ## Обязательный, если модель содержит меры
    entities: ## Обязательный
      - see more information in entities
    measures: ## Необязательный
      - see more information in the measures section
    dimensions: ## Обязательный
      - see more information in the dimensions section
    primary_entity: >-
      if the semantic model has no primary entity, then this property is required. #Необязательный, если существует первичная сущность, в противном случае Обязательный
```

Дополнительную информацию о структуре проекта можно найти в [руководстве по лучшим практикам](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro).
</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
models:
  - name: the_name_of_the_model # Model name
    semantic_model:
      enabled: true
      name: the_name_of_the_semantic_model # Optional: semantic model name, defaults to model name

    agg_time_dimension: dimension_name # Required

    # Entities, dimensions defined at column level
    columns:
      - name: entity_column_name
        entity:
          type: primary # or foreign
          name: entity_name
          description: entity description

      - name: dimension_column_name
        dimension:
          type: categorical # or time
          name: dimension_name
          description: dimension description

    # Simple metrics replace measures
    metrics:
      - name: metric_name
        description: metric description
        type: simple
        label: Metric Label
        agg: sum # Required
        expr: column_name # Optional, defaults to metric name
        # Other properties like fill_nulls_with, join_to_timespine can go here
```

</VersionBlock>

Следующий пример демонстрирует полную конфигурацию и подробные описания каждого поля:

<VersionBlock lastVersion="1.11">

```yaml
semantic_models:
  - name: transaction # Семантическая модель с именем Transactions
    model: ref('fact_transactions') # Ссылается на модель dbt с именем `fact_transactions`
    description: "Таблица фактов транзакций на уровне транзакции. Эта таблица содержит одну строку на транзакцию и включает временную метку транзакции."
    defaults:
      agg_time_dimension: transaction_date

    entities: # Сущности, включенные в таблицу, определены здесь. MetricFlow будет использовать эти столбцы в качестве ключей соединения.
      - name: transaction
        type: primary
        expr: transaction_id
      - name: customer
        type: foreign
        expr: customer_id

    dimensions: # Измерения — это качественные значения, такие как имена, даты или географические данные. Они предоставляют контекст для метрик и позволяют "разбивать метрику по группам".
      - name: transaction_date
        type: time
        type_params:
          time_granularity: day

      - name: transaction_location
        type: categorical
        expr: order_country

    measures: # Меры — это столбцы, по которым мы выполняем агрегацию. Меры являются входными данными для метрик.
      - name: transaction_total
        description: "Общая стоимость транзакции."
        agg: sum

      - name: sales
        description: "Общая продажа по транзакции."
        agg: sum
        expr: transaction_total

      - name: median_sales
        description: "Медианная продажа по транзакции."
        agg: median
        expr: transaction_total

  - name: customers # Другая семантическая модель с именем customers.
    model: ref('dim_customers')
    description: "Таблица измерений клиентов."

    entities: 
      - name: customer
        type: primary
        expr: customer_id

    dimensions:
      - name: first_name
        type: categorical
```

</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
models:
  - name: fact_transactions # Имя модели
    description: "Таблица фактов транзакций с детализацией до отдельной транзакции. Эта таблица содержит одну строку на транзакцию и включает временную метку транзакции."
    semantic_model:
      enabled: true

    agg_time_dimension: transaction_date

    columns:
      - name: transaction_id
        entity: # Здесь определяются сущности, включённые в таблицу. MetricFlow будет использовать эти столбцы в качестве ключей соединения.
          type: primary
          name: transaction

      - name: customer_id
        entity:
          type: foreign
          name: customer

      - name: transaction_date
        granularity: day
        dimension: # Измерения — это качественные значения, такие как имена, даты или географические данные. Они задают контекст для метрик и позволяют получать срезы данных «метрика по группам».
          type: time

      - name: order_country
        dimension:
          type: categorical
          name: transaction_location

    metrics: # Простые метрики — это столбцы, по которым выполняется агрегация. Они служат входными данными для метрик.
      - name: transaction_total
        description: "Общая сумма транзакции."
        type: simple
        label: Общая сумма транзакции
        agg: sum
        expr: transaction_total

      - name: average_transaction_total
        description: "Средняя общая сумма продажи в транзакции."
        type: simple
        label: Средняя общая сумма транзакции
        agg: average
        expr: average_transaction_total

      - name: median_sales
        description: "Медианная сумма продажи в транзакции."
        type: simple
        label: Медианная сумма продаж
        agg: median
        expr: transaction_total

  - name: dim_customers # Другая модель
    description: "Таблица измерения клиентов."
    semantic_model:
      enabled: true

    columns:
      - name: customer_id
        entity:
          type: primary
          name: customer

      - name: first_name
        dimension:
          type: categorical
          name: first_name
```

</VersionBlock>

<VersionBlock lastVersion="1.11">

Семантические модели поддерживают параметры [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group) и [`enabled`](/reference/resource-configs/enabled) в свойстве [`config`](/reference/resource-properties/config), которые можно задавать как в файле схемы, так и на уровне проекта:

- Конфигурация семантической модели в `models/semantic.yml`:


  ```yml
  semantic_models:
    - name: orders
      config:
        enabled: true | false
        group: some_group
        meta:
          some_key: some_value
  ```

- Конфигурация семантической модели в `dbt_project.yml`:

  ```yml
  semantic-models:
    my_project_name:
      +enabled: true | false
      +group: some_group
      +meta:
        some_key: some_value
  ```

Для получения дополнительной информации о `dbt_project.yml` и соглашениях об именах конфигураций, см. [страницу справки по dbt_project.yml](/reference/dbt_project.yml#naming-convention).

</VersionBlock>

<VersionBlock firstVersion="1.12">

Семантические модели поддерживают свойства [`config`](/reference/resource-properties/config) — [`meta`](/reference/resource-configs/meta), [`group`](/reference/resource-configs/group) и [`enabled`](/reference/resource-configs/enabled) — в файле схемы: <!--проверить, поддерживается ли по-прежнему уровень проекта-->

```yml
models:
  - name: orders
    semantic_model:
    enabled: true | false
      group: some_group
      config:
        meta:
          some_key: some_value
```

</VersionBlock>

<VersionBlock lastVersion="1.11">

### Имя {#name}

Задайте имя семантической модели. Для семантической модели необходимо задать уникальное имя. Семантический граф будет использовать это имя для идентификации модели, и вы можете изменить его в любой момент. Избегайте двойных подчёркиваний (\_\_) в имени, поскольку они не поддерживаются.
</VersionBlock>

<VersionBlock firstVersion="1.12">

<a id="name" />

### Имя

Задайте имя семантической модели. Если оно не указано, по умолчанию используется имя модели. Избегайте двойных подчёркиваний (\_\_) в имени, поскольку они не поддерживаются.
</VersionBlock>

<VersionBlock lastVersion="1.11">

### Описание {#description}

Содержит важные сведения о семантической модели. Это описание предназначено в первую очередь для других участников, работающих над конфигурацией. Вы можете использовать оператор вертикальной черты `(|)`, чтобы включить в описание несколько строк.

### Модель {#model}

Укажите модель dbt для семантической модели с помощью [функции `ref`](/reference/dbt-jinja-functions/ref).
</VersionBlock>

<VersionBlock lastVersion="1.11">

### Значения по умолчанию {#defaults}

Значения по умолчанию для семантической модели. В настоящее время доступен только `agg_time_dimension`. `agg_time_dimension` задаёт временные измерения по умолчанию для мер. Это значение можно переопределить, добавив ключ `agg_time_dimension` непосредственно в меру — примеры см. в разделе [Измерения](/docs/build/dimensions).
</VersionBlock>

<VersionBlock firstVersion="1.12">

### Временное измерение {#time-dimension}

`agg_time_dimension` задаёт временные измерения по умолчанию для простых метрик. Это значение можно переопределить, добавив ключ `agg_time_dimension` непосредственно в простую метрику — примеры см. в разделе [Измерения](/docs/build/dimensions).
</VersionBlock>

<VersionBlock lastVersion="1.11">

### Сущности {#entities}

Чтобы указать [сущности](/docs/build/entities) в модели, используйте их столбцы в качестве ключей соединения и задайте их `type` с помощью параметра type, указав, являются ли они первичными (primary), внешними (foreign) или уникальными (unique) ключами.
</VersionBlock>

<VersionBlock firstVersion="1.12">

<a id="entities" />

### Сущности

Чтобы указать [сущности](/docs/build/entities) в модели, добавьте блок `entity` на уровне столбца и задайте для `type` значение primary, foreign, unique или natural. При необходимости укажите `name` и `expr`, если имя ключа соединения отличается от имени столбца.

</VersionBlock>

### Основная сущность {#primary-entity}

<VersionBlock lastVersion="1.11">

MetricFlow требует, чтобы все измерения были привязаны к сущности. Это гарантирует уникальность имён измерений. Если у вашего источника данных нет первичной сущности, необходимо задать ей имя с помощью ключа `primary_entity: entity_name`. Эта сущность не обязательно должна соответствовать столбцу в таблице, а присвоение имени не влияет на генерацию запросов.

</VersionBlock>

<VersionBlock firstVersion="1.12">

MetricFlow требует, чтобы все измерения были привязаны к сущности, что гарантирует уникальность имён измерений. Если у вашего источника данных нет первичной сущности, необходимо указать сущность в конфигурации столбца, который служит ключом, добавив `type: primary`. Если ни один столбец не помечен как первичный, задайте параметр `primary_entity` на верхнем уровне, чтобы указать имя первичной сущности модели. Первичная сущность не обязательно должна соответствовать столбцу в таблице, а присвоение имени не влияет на генерацию запросов.

</VersionBlock>

Вы можете определить первичную сущность с помощью следующих конфигураций:

<VersionBlock lastVersion="1.11">

```yaml
semantic_model:
  name: bookings_monthly_source
  description: bookings_monthly_source
  defaults:
    agg_time_dimension: ds
  model: ref('bookings_monthly_source')
  measures:
    - name: bookings_monthly
      agg: sum
      create_metric: true
  primary_entity: booking_id
```

</VersionBlock>

<VersionBlock firstVersion="1.12">

```yaml
models:
  - name: bookings_monthly_source
    semantic_model:
      enabled: true

    agg_time_dimension: ds

    columns:
      - name: booking_id
        entity:
          type: primary
          name: booking_id

      - name: ds
        dimension:
          type: time
          name: ds

    metrics:
      - name: bookings_monthly
        description: "Sum of bookings monthly"
        type: simple
        label: "Bookings Monthly"
        agg: sum
        expr: bookings_monthly
```

</VersionBlock>

<Tabs>

<TabItem value="entitytypes" value="Типы сущностей">

Вот типы ключей:

- **Primary** &mdash; Только одна запись на строку в таблице, и она включает каждую запись в платформе данных.
- **Unique** &mdash; Только одна запись на строку в таблице, но она может содержать подмножество записей в платформе данных. Также могут присутствовать нулевые значения.
- **Foreign** &mdash; Может иметь ноль, одну или несколько экземпляров одной и той же записи. Также могут присутствовать нулевые значения.
- **Natural** &mdash; Столбец или комбинация столбцов в таблице, которые уникально идентифицируют запись на основе реальных данных. Например, `sales_person_id` может служить естественным ключом в таблице измерений `sales_person_department`.

</TabItem>
<TabItem value="sample" label="Пример конфигурации">

Этот пример показывает семантическую модель с тремя сущностями и их типами: `transaction` (первичная), `order` (внешняя) и `user` (внешняя).

Чтобы сослаться на нужный столбец, используйте фактическое имя столбца из модели в параметре `name`. Вы также можете использовать `name` как псевдоним для переименования столбца, а параметр `expr` для ссылки на оригинальное имя столбца или SQL-выражение столбца.

```yaml
entity:
  - name: transaction
    type: primary
  - name: order
    type: foreign
    expr: id_order
  - name: user
    type: foreign
    expr: substring(id_order FROM 2)
```

Вы можете ссылаться на сущности (ключи соединения) в семантической модели с помощью параметра `name`. Имена сущностей должны быть уникальными в пределах семантической модели, а имена идентификаторов могут повторяться в разных семантических моделях, поскольку MetricFlow использует их для [соединений](/docs/build/join-logic). <!--Вы также можете создавать [составные ключи](/docs/build/entities#composite-keys), например в журналах событий, где уникальный идентификатор представляет собой комбинацию временной метки, ключей типов событий и идентификаторов машин.-->

</TabItem>
</Tabs>

### Измерения {#dimensions}

[Измерения](/docs/build/dimensions) — это различные способы организации или просмотра данных. Они фактически являются параметрами группировки для метрик. Например, вы можете группировать данные по таким вещам, как регион, страна или должность.

<VersionBlock lastVersion="1.11">

MetricFlow использует динамический подход к обеспечению доступности измерений для метрик. Вместо того чтобы заранее определять все возможные группировки, MetricFlow позволяет запрашивать нужные измерения и во время выполнения запроса формирует все соединения, необходимые для доступа к ним. Преимущество этого подхода в том, что вам не нужно настраивать систему, которая заранее материализует все возможные варианты группировки данных: это может отнимать много времени и приводить к ошибкам. Вместо этого вы определяете интересующие вас измерения (параметры группировки) в семантической модели, и они автоматически становятся доступны для метрик, с которыми их можно использовать.

Измерения имеют следующие характеристики:

- Существует два типа измерений: категориальные и временные. Категориальные измерения предназначены для вещей, которые нельзя измерить в числах, в то время как временные измерения представляют даты и временные метки.
- Измерения привязаны к первичной сущности семантической модели, в которой они определены. Например, если измерение с именем `full_name` определено в модели с `user` в качестве первичной сущности, то `full_name` относится к сущности `user`. Чтобы сослаться на это измерение, вы бы использовали полное имя измерения `user__full_name`.
- Имена измерений должны быть уникальными в каждой семантической модели с одной и той же первичной сущностью. Имена измерений могут повторяться, если они определены в семантических моделях с другой первичной сущностью.

:::info Для временных групп

В семантических моделях с мерой должна быть [основная временная группа](/docs/build/dimensions#time).
:::

</VersionBlock>


<VersionBlock firstVersion="1.12">

MetricFlow использует динамический подход к обеспечению доступности измерений для метрик. Вместо того чтобы заранее определять все возможные группировки, MetricFlow позволяет запрашивать нужные измерения и во время выполнения запроса формирует все соединения, необходимые для доступа к запрошенным измерениям. Преимущество этого подхода в том, что вам не нужно настраивать систему, которая заранее материализует все возможные варианты группировки данных: это может отнимать много времени и приводить к ошибкам. Вместо этого вы определяете измерения в семантической модели, вкладывая их в определения столбцов, и они автоматически становятся доступны для подходящих метрик.

Измерения имеют следующие характеристики:

- Существует два типа измерений: категориальные и временные. Категориальные измерения предназначены для характеристик, которые нельзя измерить численно, а временные измерения представляют даты и временные метки. Для временных измерений необходимо указать гранулярность на уровне столбца.
- Измерения привязаны к основной сущности семантической модели, в которой они определены. Например, если измерение `full_name` определено в модели, где основной сущностью является `user`, то область действия `full_name` ограничена сущностью `user`. Для обращения к этому измерению используется полное имя измерения `user__full_name`.
- Имена измерений должны быть уникальными во всех семантических моделях с одной и той же основной сущностью. Имена измерений могут повторяться, если они определены в семантических моделях с разными основными сущностями.

:::info Для временных групп

В семантических моделях, в которых определены метрики, добавьте хотя бы один столбец временного измерения с параметром `granularity` и задайте параметр модели `agg_time_dimension`. При необходимости измерение времени агрегации можно переопределить для отдельных метрик.
:::
</VersionBlock>

<VersionBlock lastVersion="1.11">

### Меры {#measures}

[Меры](/docs/build/measures) — это агрегации, применяемые к столбцам в вашей модели данных. Они могут использоваться как основные строительные блоки для более сложных метрик или быть конечной метрикой сами по себе.

Меры имеют различные параметры, которые перечислены в таблице вместе с их описаниями и типами.

import MeasuresParameters from '/snippets/\_sl-measures-parameters.md';

<MeasuresParameters />

</VersionBlock>

<VersionBlock firstVersion="1.12">

### `derived_semantics` in dimensions and entities

Use the `derived_semantics` key in the model YAML entry when you want to create dimensions and entities that don’t match a single, physical column. The `expr` field is required when using `derived_semantics`. For more information, see [Dimensions](/docs/build/dimensions#derived_semantics-in-dimensions) and [Entities](/docs/build/entities#derived_semantics-in-entities).

### Simple metrics

Simple metrics are direct aggregations over columns in your data warehouse using different aggregation types. They serve as building blocks for more complex metrics and can be filtered by dimensions.

Simple metrics have various parameters which are listed in a table along with their descriptions and types. For more information, see [Simple metrics](/docs/build/simple).

</VersionBlock>

import SetUpPages from '/snippets/\_metrics-dependencies.md';

<SetUpPages />

## Связанные документы {#related-docs}

<VersionBlock lastVersion="1.11">

- [О MetricFlow](/docs/build/about-metricflow)
- [Измерения](/docs/build/dimensions)
- [Сущности](/docs/build/entities)
- [Меры](/docs/build/measures)
- [Руководство по лучшим практикам работы с <Constant name="semantic_layer" />](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro)
</VersionBlock>

<VersionBlock firstVersion="1.12">

- [О MetricFlow](/docs/build/about-metricflow)
- [Измерения](/docs/build/dimensions)
- [Сущности](/docs/build/entities)
- [Простые метрики](/docs/build/simple)
- [Руководство по лучшим практикам работы с <Constant name="semantic_layer" />](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro)
</VersionBlock>
