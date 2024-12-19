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
    { label: 'Анализы', value: 'analyses', },
    { label: 'Макросы', value: 'macros', },
    { label: 'Экспозиции', value: 'exposures', },
    { label: 'Семантические модели', value: 'semantic models', },
    { label: 'Метрики', value: 'metrics', },
    { label: 'Сохраненные запросы', value: 'saved queries', },
  ]
}>
<TabItem value="models">

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: model_name
    config:
      meta: {<словарь>}

    columns:
      - name: column_name
        meta: {<словарь>}

```

</File>

Конфигурация `meta` также может быть определена:
- в блоке конфигурации `models` в `dbt_project.yml`
- в макросе `config()` Jinja внутри SQL файла модели

Смотрите [конфигурации и свойства](/reference/configs-and-properties) для получения подробной информации.

</TabItem>

<TabItem value="sources">

<File name='models/schema.yml'>

```yml
version: 2

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
            meta: {<словарь>}

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/schema.yml'>

```yml
version: 2

seeds:
  - name: seed_name
    config:
      meta: {<словарь>}

    columns:
      - name: column_name
        meta: {<словарь>}

```

</File>

Конфигурация `meta` также может быть определена в блоке конфигурации `seeds` в `dbt_project.yml`. Смотрите [конфигурации и свойства](/reference/configs-and-properties) для получения подробной информации.

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/schema.yml'>

```yml
version: 2

snapshots:
  - name: snapshot_name
    config:
      [meta](/reference/snapshot-properties): {<словарь>}

    columns:
      - name: column_name
        meta: {<словарь>}

```

</File>

Конфигурация `meta` также может быть определена:
- в блоке конфигурации `snapshots` в `dbt_project.yml`
- в макросе `config()` Jinja внутри SQL блока снимка

Смотрите [конфигурации и свойства](/reference/configs-and-properties) для получения подробной информации.

</TabItem>

<TabItem value="tests">

Вы не можете добавлять YAML конфигурации `meta` для [общих тестов](/docs/build/data-tests#generic-data-tests). Однако вы можете добавлять свойства `meta` к [единичным тестам](/docs/build/data-tests#singular-data-tests) с помощью `config()` в начале файла теста. 

</TabItem>

<TabItem value="analyses">

Конфигурация `meta` в настоящее время не поддерживается для анализов.

</TabItem>

<TabItem value="macros">

<File name='macros/schema.yml'>

```yml
version: 2

[макросы](/reference/macro-properties):
  - name: macro_name
    meta: {<словарь>}

    arguments:
      - name: argument_name

```

</File>

</TabItem>

<TabItem value="exposures">

<File name='models/exposures.yml'>

```yml
version: 2

exposures:
  - name: exposure_name
    meta: {<словарь>}

```

</File>

</TabItem>

<TabItem value="semantic models">

<File name='models/semantic_models.yml'>

```yml
semantic_models:
  - name: semantic_model_name
    config:
      meta: {<словарь>}

```

</File>

Конфигурация `meta` также может быть определена в блоке конфигурации `semantic-models` в `dbt_project.yml`. Смотрите [конфигурации и свойства](/reference/configs-and-properties) для получения подробной информации.

</TabItem>

<TabItem value="metrics">

<VersionBlock lastVersion="1.7">

<File name='models/metrics.yml'>

```yml
metrics:
  - name: number_of_people
    label: "Количество людей"
    description: Общее количество людей
    type: simple
    type_params:
      measure: people
    meta:
      my_meta_direct: 'direct'
```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.8"> 
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

</TabItem>

<TabItem value="saved queries">

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

## Определение
Поле `meta` может использоваться для установки метаданных для ресурса. Эти метаданные компилируются в файл `manifest.json`, генерируемый dbt, и доступны в автоматически сгенерированной документации.

В зависимости от ресурса, который вы настраиваете, `meta` может быть доступно в свойстве `config` и/или в качестве ключа верхнего уровня. (Для обратной совместимости `meta` часто (но не всегда) поддерживается в качестве ключа верхнего уровня, хотя без возможностей наследования конфигурации.)


## Примеры
### Назначение владельца модели
Кроме того, укажите зрелость модели, используя ключ `model_maturity:`.

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: users
    meta:
      owner: "@alice"
      model_maturity: in dev

```

</File>


### Назначение столбца источника как содержащего PII

<File name='models/schema.yml'>

```yml
version: 2

[источники](/reference/source-properties):
  - name: salesforce

    tables:
      - name: account
        meta:
          contains_pii: true
        columns:
          - name: email
            meta:
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