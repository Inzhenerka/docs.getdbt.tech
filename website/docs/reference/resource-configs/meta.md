---
resource_types: all
datatype: "{<словарь>}"
default_value: {}
hide_table_of_contents: true
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
    { label: 'Аналитика', value: 'analyses', },
    { label: 'Макросы', value: 'macros', },
    { label: 'Экспозиции', value: 'exposures', },
    { label: 'Семантические модели', value: 'semantic models', },
    { label: 'Метрики', value: 'metrics', },
    { label: 'Сохранённые запросы', value: 'saved queries', },
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

Конфигурация `meta` может быть задана:

- В разделе `seeds` в файле свойств (показано в предыдущем примере `seeds/schema.yml`)
- В разделе `seeds` в файле проекта (`dbt_project.yml`). Подробнее см. [configs and properties](/reference/configs-and-properties).

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

Вы не можете добавлять YAML конфигурации `meta` для [общих тестов](/docs/build/data-tests#generic-data-tests). Однако вы можете добавлять свойства `meta` к [единичным тестам](/docs/build/data-tests#singular-data-tests) с помощью `config()` в начале файла теста. 

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

[макросы](/reference/macro-properties):
  - name: macro_name
    config:
      meta: {<dictionary>} # изменено на config в v1.10

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

Configure `meta` in the your [semantic models](/docs/build/semantic-models) property file or under the `semantic-models` config in the project file (`dbt_project.yml`). 

<VersionBlock lastVersion="1.9">

<File name='models/semantic_models.yml'>

```yml
semantic_models:
  - name: semantic_model_name
    config:
      meta: {<словарь>}

```

</File>

<File name='dbt_project.yml'>

```yml
semantic-models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.9">

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

Конфигурацию `meta` можно определить:

- В разделе `semantic-models` файла свойств (как показано в предыдущем примере `models/semantic_models.yml`)
- В разделе `semantic-models` файла проекта (`dbt_project.yml`). Подробнее см. в разделе [configs and properties](/reference/configs-and-properties).

</TabItem>

<TabItem value="metrics">

<File name='dbt_project.yml'>

```yml
metrics:
[<resource-path>](/reference/resource-configs/resource-path):
  +meta: {<dictionary>}
```
</File>

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
</Tabs>

## Definition
Поле `meta` можно использовать для задания метаданных ресурса и оно принимает любые пары «ключ-значение». Эти метаданные компилируются в файл `manifest.json`, который генерируется dbt, и отображаются в автоматически сгенерированной документации.

В зависимости от ресурса, который вы настраиваете, `meta` может быть доступно в свойстве `config` и/или в качестве ключа верхнего уровня. (Для обратной совместимости `meta` часто (но не всегда) поддерживается в качестве ключа верхнего уровня, хотя без возможностей наследования конфигурации.)


## Примеры
Чтобы показать, как использовать конфигурацию `meta`, приведём несколько примеров:

<!-- no toc -->
  - [Назначить владельца модели](#designate-a-model-owner)
  - [Обозначить столбец источника как содержащий PII](#designate-a-source-column-as-containing-pii)
  - [Настроить один атрибут meta для всех seeds](#configure-one-meta-attribute-for-all-seeds)
  - [Переопределить один атрибут meta для одной модели](#override-one-meta-attribute-for-a-single-model)
  - [Задать owner и favorite\_color в dbt\_project.yml как свойство config](#assign-owner-and-favorite_color-in-the-dbt_projectyml-as-a-config-property)
  - [Назначить meta для semantic model](#assign-meta-to-semantic-model)
  - [Назначить meta для dimensions, measures, entities](#assign-meta-to-dimensions-measures-entities)
  - [Доступ к значениям meta в Python-моделях](#access-meta-values-in-python-models)


### Назначить владельца модели
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


### Назначение столбца источника как содержащего PII

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

### Настройка одного атрибута meta для всех сидов

<File name='dbt_project.yml'>

```yml
seeds:
  +meta:
    favorite_color: red
```

</File>

### Переопределение одного атрибута meta для одной модели

<File name='models/my_model.sql'>

```sql
{{ config(meta = {
    'single_key': 'override'
}) }}

select 1 as id
```

</File><br />

### Назначение владельца и favorite_color в dbt_project.yml как свойства конфигурации

<File name='dbt_project.yml'>

```yml
models:
  jaffle_shop:
    +meta:
      owner: "@alice"
      favorite_color: red
```

</File>

### Назначение meta для семантической модели

Следующий пример показывает, как назначить значение `meta` для [семантической модели](/docs/build/semantic-models) в файлах `semantic_model.yml` и `dbt_project.yml`:

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

### Назначение meta для измерений, метрик и сущностей

<VersionBlock firstVersion="1.9">

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

### Доступ к значениям meta в Python-моделях

Чтобы получить доступ к пользовательским значениям `meta` в [Python-моделях](/docs/build/python-models), сначала извлеките объект `meta` с помощью метода `dbt.config.get()`, а затем обращайтесь к нужным пользовательским значениям.

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
    # First, get the meta object
    meta = dbt.config.get("meta")
    
    # Then access your custom values from meta
    batch_size = meta.get("batch_size")
    processing_mode = meta.get("processing_mode")
    
    # Use the meta values in your model logic
    df = dbt.ref("upstream_model")
    
    if processing_mode == "incremental":
        df = df.limit(batch_size)
    
    return df
```

</File>
