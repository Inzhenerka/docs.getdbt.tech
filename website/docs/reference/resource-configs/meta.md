---
description: "Добавляйте метаданные в виде пар «ключ — значение» к моделям, источникам, seeds и снимкам dbt."
resource_types: all
datatype: "{<словарь>}"
default_value: {}
---

<Tabs
  defaultValue="models"
  values={[
{ label: 'Модели', value: 'models', },
    { label: 'Источники', value: 'sources', },
    { label: 'Сиды', value: 'seeds', },
    { label: 'Снимки', value: 'snapshots', },
    { label: 'Тесты', value: 'tests', },
    { label: 'Модульные тесты', value: 'unit tests', },
    { label: 'Анализы', value: 'analyses', },
    { label: 'Макросы', value: 'macros', },
    { label: 'Экспозиции', value: 'exposures', },
    { label: 'Семантические модели', value: 'semantic models', },
    { label: 'Метрики', value: 'metrics', },
    { label: 'Сохранённые запросы', value: 'saved queries', },
    { label: 'Функции', value: 'functions', },
  ]
}>
<TabItem value="models">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}

```

</File>

<File name='models/schema.yml'>

```yml

models:
  - name: model_name
    config:
      meta: {<словарь>}

    columns:
      - name: column_name
        config:
          meta: {<dictionary>} # изменено на config в версии v1.10 и затем портировано обратно в 1.9

```

</File>

Конфигурацию `meta` можно определить следующими способами:
- В разделе `models` конфигурации в файле проекта (как показано в предыдущем примере `models/schema.yml`)
- В разделе `models` конфигурации в файле проекта (`dbt_project.yml`)
- В Jinja‑макросе `config()` внутри SQL‑файла модели

Смотрите [конфигурации и свойства](/reference/configs-and-properties) для получения подробной информации.

</TabItem>

<TabItem value="sources">

<File name='dbt_project.yml'>

```yml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='models/schema.yml'>

```yml

[источники](/reference/source-properties):
  - name: model_name
    config:
      meta: {<словарь>}

    tables:
      - name: table_name
        config:
          meta: {<словарь>}

        columns:
          - name: column_name
            config:
              meta: {<dictionary>} # переименовано в config в версии v1.10 и портировано обратно в 1.9

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='seeds/schema.yml'>

```yml

seeds:
  - name: seed_name
    config:
      meta: {<словарь>}

    columns:
      - name: column_name
        config:
          meta: {<dictionary>} # изменено на config в версии v1.10 и бэкпортировано в 1.9

```

</File>

Конфигурацию `meta` можно определить:
- В разделе `seeds` в файле свойств (как показано в предыдущем примере 'seeds/schema.yml') 
- В разделе `seeds` в файле проекта (`dbt_project.yml`). Подробнее см. в разделе [Конфигурации и свойства](/reference/configs-and-properties).

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='snapshots/schema.yml'>

```yml

snapshots:
  - name: snapshot_name
    config:
      [meta](/reference/snapshot-properties): {<словарь>}

    columns:
      - name: column_name
        config:
          meta: {<dictionary>} # изменено на config в версии v1.10 и портировано обратно в 1.9

```

</File>

Конфигурация `meta` может быть определена:

- в разделе `snapshots` файла свойств (как показано в предыдущем примере `snapshots/schema.yml`)
- в разделе `snapshots` файла проекта (`dbt_project.yml`)
- внутри Jinja‑макроса `config()` в SQL‑блоке snapshot’а

Смотрите [конфигурации и свойства](/reference/configs-and-properties) для получения подробной информации.

</TabItem>

<TabItem value="tests">

Используйте поле `meta`, чтобы добавить метаданные к [универсальным](/docs/build/data-tests#generic-data-tests) или [единичным тестам](/docs/build/data-tests#singular-data-tests). Поле `meta` принимает пары «ключ — значение», включается в `manifest.json` при компиляции и отображается в автоматически создаваемой документации.

**Универсальные тесты данных**

Добавьте `meta` в блок `config` в файле `properties.yml`:

<File name="models/properties.yml">
  
```yaml
models:
  - name: my_model
    columns:
      - name: my_column
        data_tests:
          - unique:
              config:
                meta:
                  owner: "docs team"
 ```
</File>

Или задайте значения по умолчанию в `dbt_project.yml`:

<File name="dbt_project.yml">

```yaml
data_tests:
  my_project:
    +meta:
      owner: "docs team"
 ```
</File>

**Единичные тесты данных**

Добавьте `meta` в SQL-файл теста с помощью `config()`:

<File name="tests/my_singular_test.sql">

```sql
{{ config(meta={'owner': 'docs team'}) }}

select * from {{ ref('my_model') }}
where my_column is null
```
</File>

Или укажите метаданные в `tests/properties.yml`:

<File name="tests/properties.yml">

```yaml
data_tests:
  - name: my_singular_test
    config:
      meta:
        owner: "analytics_team"
```
</File>

</TabItem>

<TabItem value="unit tests">

<VersionCallout version="1.8" />

<File name='dbt_project.yml'>

```yml
[unit_tests](/reference/resource-properties/unit-tests):
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='models/<filename>.yml'>

```yml
unit_tests:
  - name: <test-name>
    config:
      [meta](/reference/snapshot-properties): {<dictionary>}

```

</File>

</TabItem>

<TabItem value="analyses">

Конфигурация `meta` в настоящее время не поддерживается для анализов.

</TabItem>

<TabItem value="macros">

<File name='dbt_project.yml'>

```yml
macros:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='macros/schema.yml'>

```yml
[macros](/reference/macro-properties):
  - name: macro_name
    config: 
      meta: {<dictionary>} # перенесено в config в v1.11
    arguments:
      - name: argument_name
```

</File>

</TabItem>

<TabItem value="exposures">

<File name='dbt_project.yml'>

```yml
exposures:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='models/exposures.yml'>

```yml

exposures:
  - name: exposure_name
    config:
      meta: {<dictionary>} # изменено на config в версии v1.10

```

</File>

</TabItem>

<TabItem value="semantic models">
<VersionBlock lastVersion="1.11">

Настройте `meta` в YAML-файле ваших [семантических моделей](/docs/build/semantic-models) или в блоке конфигурации `semantic-models` в файле `dbt_project.yml`.

<File name='dbt_project.yml'>

```yml
semantic-models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>


<File name='models/semantic_models.yml'>

```yml
semantic_models:
  - name: semantic_model_name
    config:
      meta: {<dictionary>}

```
</File>
</VersionBlock>

<VersionBlock firstVersion="1.12">

Задайте `meta` для [семантических моделей](/docs/build/semantic-models) в YAML-файле модели или в блоке конфигурации `semantic-models` в `dbt_project.yml`.

<File name='dbt_project.yml'>

```yml
semantic-models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='models/file_name.yml'>

```yml
models:
  - name: model_name
    semantic_model:
      enabled: true
      config:
        meta: {<dictionary>}

```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.11">

[Dimensions](/docs/build/dimensions), [entities](/docs/build/entities) и [measures](/docs/build/measures) также могут иметь собственные конфигурации `meta`.

<File name='models/semantic_models.yml'>

```yml
semantic_models:
  - name: semantic_model_name
    config:
      meta: {<dictionary>}

    dimensions:
      - name: dimension_name
        config:
          meta: {<dictionary>}

    entities:
      - name: entity_name
        config:
          meta: {<dictionary>}

    measures:
      - name: measure_name
        config:
          meta: {<dictionary>}

```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.12">

У [измерений](/docs/build/dimensions), [сущностей](/docs/build/entities) и метрик могут быть собственные настройки `meta`.

<File name='models/file_name.yml'>

```yml
models:
  - name: model_name
    semantic_model:
      enabled: true
      config:
        meta: {<dictionary>}

    agg_time_dimension: your_time_dimension_name

    columns:
      - name: entity_column_name
        entity:
          type: primary
          name: entity_name
          config:
            meta: {<dictionary>}

      - name: dimension_column_name
        dimension:
          type: categorical
          name: dimension_name
          config:
            meta: {<dictionary>}

    metrics:
      - name: simple_metric_name
        description: "Description of the metric"
        type: simple
        agg: sum  
        expr: column_name 
        config:
          meta: {<dictionary>}
```

</File>
</VersionBlock>

Конфигурацию `meta` можно определить:
- В разделе `semantic-models` файла свойств (как показано в предыдущем примере `models/semantic_models.yml`) 
- В разделе `semantic-models` файла проекта (`dbt_project.yml`). Подробнее см. в разделе [Конфигурации и свойства](/reference/configs-and-properties).

</TabItem>

<TabItem value="metrics">

<File name='dbt_project.yml'>

```yml
metrics:
[<resource-path>](/reference/resource-configs/resource-path):
  +meta: {<dictionary>}
```
</File>

<VersionBlock lastVersion="1.11">
<File name='models/metrics.yml'>

```yml
metrics:
  - name: number_of_people
    label: "Количество людей"
    description: Общее количество людей
    type: simple
    type_params:
      measure: people
    config:
      meta:
        my_meta_config: 'config_value'
```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.12">
<File name='models/file_name.yml'>

```yml
models:
  - name: model_name 
    semantic_model:
      enabled: true
    agg_time_dimension: your_time_dimension
    columns:
      - name: column_name
        dimension:
          type: time
        granularity: day
    metrics:
      - name: number_of_people
        type: simple
        description: Total count of people
        agg: count
        expr: people
        config:
          meta:
            my_meta_config: 'config_value'
```

</File>
</VersionBlock>

</TabItem>

<TabItem value="saved queries">

<File name='dbt_project.yml'>

```yml
saved-queries:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='models/semantic_models.yml'>

```yml
saved_queries:
  - name: saved_query_name
    config:
      meta: {<словарь>}
```

</File>
</TabItem>

<TabItem value="functions">

<File name='dbt_project.yml'>

```yml
functions:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)meta: {<dictionary>}
```

</File>

<File name='functions/properties.yml'>

```yaml
functions:
  - name: function_name
    config:
      meta: {<dictionary>}
```

</File>

</TabItem>
</Tabs>

## Определение
Конфигурация `meta` задаёт метаданные ресурса и принимает любые пары «ключ — значение». Эти метаданные включаются в файл `manifest.json`, создаваемый dbt, и отображаются в автоматически сгенерированной документации.

В зависимости от ресурса, который вы настраиваете, `meta` может быть доступно в свойстве `config` и/или в качестве ключа верхнего уровня. (Для обратной совместимости `meta` часто (но не всегда) поддерживается в качестве ключа верхнего уровня, хотя без возможностей наследования конфигурации.)

:::note Влияние на сравнение состояния
Изменения `meta`, в том числе на уровне столбца, не приводят к выбору ресурса через [`state:modified`](/reference/node-selection/methods#state). Для dbt параметры `meta` и `tags` — метаданные: они не влияют на материализацию. Подробнее см. [Особенности сравнения состояния](/reference/node-selection/state-comparison-caveats#tags-and-meta).
:::


## Примеры {#examples}
Чтобы показать, как использовать конфигурацию `meta`, приведём несколько примеров:

<!-- no toc -->
- [Назначить владельца модели](#designate-a-model-owner)
  - [Указать, что столбец источника содержит персональные данные (PII)](#designate-a-source-column-as-containing-pii)
  - [Настроить один атрибут meta для всех seed-файлов](#configure-one-meta-attribute-for-all-seeds)
  - [Переопределить один атрибут meta для отдельной модели](#override-one-meta-attribute-for-a-single-model)
  - [Задать owner и favorite\_color в dbt\_project.yml как свойство конфигурации](#assign-owner-and-favoritecolor-in-the-dbtprojectyml-as-a-config-property)
  - [Задать meta для семантической модели](#assign-meta-to-semantic-model)
  - [Задать meta для измерений, мер и сущностей](#assign-meta-to-dimensions-measures-entities)
  - [Добавить meta к универсальным и единичным тестам данных](#add-meta-to-generic-and-singular-data-tests)
  - [Получить доступ к значениям meta в моделях Python](#access-meta-values-in-python-models)


### Назначить владельца модели {#designate-a-model-owner}
Дополнительно можно указать уровень зрелости модели, используя ключ `model_maturity:`.

<File name='models/schema.yml'>

```yml

models:
  - name: users
    config:
      meta:
        owner: "@alice"
        model_maturity: in dev

```

</File>


### Назначение столбца источника как содержащего PII {#designate-a-source-column-as-containing-pii}

<File name='models/schema.yml'>

```yml

Похоже, вы прислали только фрагмент `sources:` без содержимого.

Пожалуйста, пришлите полный текст markdown‑файла (или хотя бы раздел целиком), который нужно перевести. Тогда я смогу корректно перевести описания и пояснения, сохранить форматирование Docusaurus и не затронуть технические элементы dbt.
  - name: salesforce
    tables:
      - name: account
        config:
          meta:
            contains_pii: true
        columns:
          - name: email
            config:
              meta: # changed to config in v1.10 and backported to 1.9
                contains_pii: true

```

</File>

### Настройка одного атрибута meta для всех сидов {#configure-one-meta-attribute-for-all-seeds}

<File name='dbt_project.yml'>

```yml
seeds:
  +meta:
    favorite_color: red
```

</File>

### Переопределение одного атрибута meta для одной модели {#override-one-meta-attribute-for-a-single-model}

<File name='models/my_model.sql'>

```sql
{{ config(meta = {
    'single_key': 'override'
}) }}

select 1 as id
```

</File><br />

### Назначение владельца и favorite_color в dbt_project.yml как свойства конфигурации {#assign-owner-and-favoritecolor-in-the-dbtprojectyml-as-a-config-property}

<File name='dbt_project.yml'>

```yml
models:
  jaffle_shop:
    +meta:
      owner: "@alice"
      favorite_color: red
```

</File>

### Назначение meta для семантической модели {#assign-meta-to-semantic-model}

<VersionBlock lastVersion="1.11">

В следующем примере показано, как задать значение `meta` для [семантической модели](/docs/build/semantic-models) в файлах `semantic_model.yml` и `dbt_project.yml`:

<Tabs>
<TabItem value="semantic_model" label="Semantic model">

```yaml
semantic_models:
  - name: transaction 
    model: ref('fact_transactions')
    description: "Transaction fact table at the transaction level. This table contains one row per transaction and includes the transaction timestamp."
    defaults:
      agg_time_dimension: transaction_date
    config:
      meta:
        data_owner: "Finance team"
        used_in_reporting: true
```

</TabItem>

<TabItem value="project.yml" label="dbt_project.yml">

```yaml
semantic-models:
  jaffle_shop:
    +meta:
      used_in_reporting: true
```
</TabItem>
</Tabs>
</VersionBlock>


<VersionBlock firstVersion="1.12">

Ниже показано, как задать `meta` для [семантической модели](/docs/build/semantic-models) в YAML-файле модели и в `dbt_project.yml`:

<Tabs>
<TabItem value="semantic_model" label="Semantic model">

```yaml
models:
  - name: fact_transactions
    description: "Transaction fact table at the transaction level. This table contains one row per transaction and includes the transaction timestamp."
    semantic_model:
      enabled: true
      name: transaction
      config:
        meta:
          data_owner: "Finance team"
          used_in_reporting: true

    agg_time_dimension: transaction_date
```

</TabItem>

<TabItem value="project.yml" label="dbt_project.yml">

```yaml
semantic-models:
  jaffle_shop:
    +meta:
      used_in_reporting: true
```
</TabItem>
</Tabs>
</VersionBlock>

### Назначение meta для измерений, метрик и сущностей {#assign-meta-to-dimensions-measures-entities}

<VersionBlock lastVersion="1.11">

<Tabs>
<TabItem value="semantic_model" label="Semantic model">

Следующий пример показывает, как назначить значение `meta` для [измерения](/docs/build/dimensions), [сущности](/docs/build/entities) и [метрики](/docs/build/measures) в семантической модели:

<File name='semantic_model.yml'>

```yml
semantic_models:
  - name: semantic_model
    ...
    dimensions:
      - name: order_date
        type: time
        config:
          meta:
            data_owner: "Finance team"
            used_in_reporting: true
    entities:
      - name: customer_id
        type: primary
        config:
          meta:
            description: "Unique identifier for customers"
            data_owner: "Sales team"
            used_in_reporting: false
    measures:
      - name: count_of_users
        expr: user_id
        config:
          meta:
            used_in_reporting: true
```

</File>
</TabItem>

<TabItem value="project.yml" label="dbt_project.yml">

Во втором примере показано, как назначить значение `data_owner` и дополнительные метаданные для измерения в файле `dbt_project.yml` с использованием синтаксиса `+meta`. Аналогичный синтаксис можно использовать для сущностей и метрик.

<File name='dbt_project.yml'>

```yml
semantic-models:
  jaffle_shop:
    ...
    [dimensions](/docs/build/dimensions):
      - name: order_date
        config:
          meta:
            data_owner: "Finance team"
            used_in_reporting: true
```

</File>
</TabItem>
</Tabs>
</VersionBlock>

<VersionBlock firstVersion="1.12">

<Tabs>
<TabItem value="semantic_model" label="Семантическая модель">

В следующем примере показано, как задать значение `meta` для [измерения](/docs/build/dimensions), [сущности](/docs/build/entities) и [простых метрик](/docs/build/simple) в семантической модели:

<File name='model_name.yml'>

```yml
models:
  - name: model_name
    semantic_model:
      enabled: true
      name: semantic_model

    agg_time_dimension: order_date

    columns:
      - name: order_date
        dimension:
          type: time
          config:
            meta:
              data_owner: "Finance team"
              used_in_reporting: true

      - name: customer_id
        entity:
          type: primary
          config:
            meta:
              description: "Unique identifier for customers"
              data_owner: "Sales team"
              used_in_reporting: false

    metrics:
      - name: count_of_users
        type: simple
        agg: count_distinct
        expr: user_id
        config:
          meta:
            used_in_reporting: true
```

</File>
</TabItem>

<TabItem value="project.yml" label="dbt_project.yml">

Во втором примере показано, как задать `data_owner` и дополнительные метаданные для измерения в файле `dbt_project.yml` с помощью синтаксиса `+meta`. Аналогичный синтаксис можно использовать для сущностей и простых метрик.

<File name='dbt_project.yml'>

```yml
semantic-models:
  jaffle_shop:
    ...
    [dimensions](/docs/build/dimensions):
      - name: order_date
        config:
          meta:
            data_owner: "Finance team"
            used_in_reporting: true
```


</File>
</TabItem>
</Tabs>
</VersionBlock>

### Добавление meta в обобщённые и единичные тесты данных {#add-meta-to-generic-and-singular-data-tests}

В следующих примерах показано, как добавить `meta` в [обобщённые тесты данных](/docs/build/data-tests#generic-data-tests) в файле `properties.yml` и в [единичные тесты данных](/docs/build/data-tests#singular-data-tests) с помощью `config()`. Также можно задать значения по умолчанию в `dbt_project.yml` или `tests/properties.yml`.

<Tabs>
<TabItem value="generic" label="Обобщённый тест данных">

<File name='models/properties.yml'>

```yaml
models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - not_null:
              config:
                meta:
                  owner: "@data_team"
```

</File>

</TabItem>

<TabItem value="singular" label="Единичный тест данных">

<File name='tests/assert_order_ids.sql'>

```sql
{{ config(meta={'owner': '@data_team'}) }}

select *
from {{ ref('orders') }}
where order_id is null
```

</File>

</TabItem>
</Tabs>

### Доступ к значениям meta в моделях Python {#access-meta-values-in-python-models}

Для доступа к пользовательским значениям `meta` в [моделях Python](/docs/build/python-models) используйте метод `dbt.config.meta_get()`.

Например, если у вас есть модель с именем `my_python_model` и вы хотите сохранить в ней пользовательские значения, можно сделать следующее:

<File name='models/schema.yml'>

```yml
models:
  - name: my_python_model
    config:
      meta:
        batch_size: 1000
        processing_mode: "incremental"
```

</File>

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    # Access custom values stored in meta directly
    batch_size = dbt.config.meta_get("batch_size")
    processing_mode = dbt.config.meta_get("processing_mode")
    
    # Use the meta values in your model logic
    df = dbt.ref("upstream_model")
    
    if processing_mode == "incremental":
        df = df.limit(batch_size)
    
    return df
```

</File>
