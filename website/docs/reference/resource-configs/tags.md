---
description: "Настройка тегов для маркировки и организации моделей и других ресурсов dbt."
sidebar_label: "теги"
resource_types: all
datatype: string | [string]
---

<Tabs
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'other-yaml', },
    { label: 'Конфигурация SQL-файла', value: 'config', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml

[models](/reference/model-configs):
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>] # Supports single strings or list of strings

[snapshots](/reference/snapshot-configs):
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

[seeds](/reference/seed-configs):
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

[saved-queries:](/docs/build/saved-queries)
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

```
</VersionBlock>


</File>
</TabItem>

<TabItem value="other-yaml">

<VersionBlock firstVersion="1.9">

Следующие примеры показывают, как добавлять теги к ресурсам dbt в YAML-файлах. Замените `resource_type` на `exposures`, `models`, `snapshots`, `seeds` или `saved_queries` по мере необходимости.
</VersionBlock>

<File name='resource_type/properties.yml'>

```yaml
resource_type:
  - name: resource_name
    config:
      tags: <string> | [<string>] # Supports single strings or list of strings
    # Optional: Add the following specific properties for models
    columns:
      - name: column_name
        config:
          tags: <string> | [<string>] # changed to config in v1.10 and backported to 1.9
        data_tests:
          test-name:
            config:
              tags: "single-string" # Supports single string 
              tags: ["string-1", "string-2"] # Supports list of strings
```

</File>

Чтобы применить теги к модели в вашем каталоге `models/`, добавьте свойство `config`, аналогично следующему примеру:

<File name='models/model.yml'>

```yaml
models:
  - name: my_model
    description: A model description
    config:
      tags: ['example_tag']
```

</File>

</TabItem>

<TabItem value="config">

<File name='models/model.sql'>
```sql
{{ config(
    tags="<string>" | ["<string>"]
) }}
```
</File>

</TabItem>
</Tabs>
Обратите внимание, что для обратной совместимости `tags` поддерживается как ключ верхнего уровня, но без возможностей наследования конфигурации.

## Определение {#definition}
Примените тег (или список тегов) к ресурсу.

Эти теги можно использовать как часть [синтаксиса выбора ресурсов](/reference/node-selection/syntax) при выполнении следующих команд:
- `dbt run --select tag:my_tag` &mdash; Запускает все модели, помеченные указанным тегом.
- `dbt build --select tag:my_tag` &mdash; Собирает все ресурсы, помеченные указанным тегом.
- `dbt seed --select tag:my_tag` &mdash; Загружает (seed) все ресурсы, помеченные указанным тегом.
- `dbt snapshot --select tag:my_tag` &mdash; Создаёт snapshot для всех ресурсов, помеченных указанным тегом.
- `dbt test --select tag:my_tag` &mdash; Косвенно запускает все тесты, связанные с моделями, которые помечены этим тегом.

#### Использование тегов с оператором `+` {#using-tags-with-the-operator}
Вы можете использовать [оператор `+`](/reference/node-selection/graph-operators#the-plus-operator), чтобы включать восходящие или нисходящие зависимости при выборе по `tag`:
- `dbt run --select tag:my_tag+` &mdash; Запускает модели, помеченные `my_tag`, и все их нисходящие зависимости.
- `dbt run --select +tag:my_tag` &mdash; Запускает модели, помеченные `my_tag`, и все их восходящие зависимости.
- `dbt run --select +tag:my_tag+` &mdash; Запускает модели, помеченные `my_tag`, а также их восходящие и нисходящие зависимости.
- `dbt run --select tag:my_tag+ --exclude tag:exclude_tag` &mdash; Запускает модели, помеченные `my_tag`, и их нисходящие зависимости, и исключает модели, помеченные `exclude_tag`, независимо от их зависимостей.

:::tip Примечания по использованию тегов

При работе с тегами учитывайте следующее:

- Каждый отдельный тег должен быть строкой.
- Теги являются аддитивными по иерархии проекта.
- Для некоторых типов ресурсов (например, sources, exposures) теги необходимо задавать на верхнем уровне.

Подробнее см. в разделе [примечания по использованию](#usage-notes).
:::

## Примеры {#examples}

Следующие примеры показывают, как применять теги к ресурсам в вашем проекте. Вы можете настраивать теги в файлах `dbt_project.yml`, `schema.yml` или в SQL-файлах.

### Использование тегов для запуска частей проекта {#use-tags-to-run-parts-of-your-project}

Применяйте теги в `dbt_project.yml` как одиночное значение или как строку. В следующем примере одна из моделей — модель `jaffle_shop` — помечена тегом `contains_pii`.

<File name='dbt_project.yml'>

```yml
models:
  jaffle_shop:
    +tags: "contains_pii"

    staging:
      +tags:
        - "hourly"

    marts:
      +tags:
        - "hourly"
        - "published"

    metrics:
      +tags:
        - "daily"
        - "published"

```
</File>


### Apply tags to models {#apply-tags-to-models}

This section demonstrates applying tags to models in the `dbt_project.yml`, `schema.yml`, and SQL files. 

To apply tags to a model in your `dbt_project.yml` file, you would add the following:

<File name='dbt_project.yml'>

```yaml
models:
  jaffle_shop:
    +tags: finance # jaffle_shop model is tagged with 'finance'.
```

</File>

Чтобы применить теги к модели в YAML-файле свойств, расположенном в каталоге `models/`, нужно добавить следующее, используя свойство `config`:

<File name='models/stg_customers.yml'>

```yaml
models:
  - name: stg_customers
    description: Customer data with basic cleaning and transformation applied, one row per customer.
    config:
      tags: ['santi'] # stg_customers.yml model is tagged with 'santi'.
    columns:
      - name: customer_id
        description: The unique key for each customer.
        data_tests:
          - not_null
          - unique
```

</File>

Чтобы применить теги к модели в SQL‑файле, необходимо добавить следующее:

<File name='models/staging/stg_payments.sql'>

```sql
{{ config(
    tags=["finance"] # stg_payments.sql model is tagged with 'finance'.
) }}

select ...

```

</File>

Запускать ресурсы с определёнными тегами (или, наоборот, исключать ресурсы с определёнными тегами) можно с помощью следующих команд:

```shell
# Run all models tagged "daily"
  dbt run --select tag:daily

# Run all models tagged "daily", except those that are tagged hourly
  dbt run --select tag:daily --exclude tag:hourly
```

### Примените теги к семенам {#apply-tags-to-seeds}

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    utm_mappings:
      +tags: marketing
```

</File>

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    utm_mappings:
      +tags:
        - marketing
        - hourly
```

</File>

### Применение тегов к сохранённым запросам {#apply-tags-to-saved-queries}

В следующем примере показано, как применить тег к сохранённому запросу в файле `dbt_project.yml`. В результате сохранённый запрос будет помечен тегом `order_metrics`.

<File name='dbt_project.yml'>

```yml
[saved-queries](/docs/build/saved-queries):
  jaffle_shop:
    customer_order_metrics:
      +tags: order_metrics
```

</File>

Затем запустите ресурсы с определённым тегом, используя следующую команду:

```shell
# Запустить все ресурсы с тегом "order_metrics"
  dbt run --select tag:order_metrics
```

Во втором примере показано, как применить несколько тегов к сохранённому запросу в файле `semantic_model.yml`. В этом случае сохранённый запрос помечается тегами `order_metrics` и `hourly`.

<File name='semantic_model.yml'>

```yaml
saved_queries:
  - name: test_saved_query
    description: "{{ doc('saved_query_description') }}"
    label: Test saved query
    config:
      tags: 
        - order_metrics
        - hourly
```
</File>

Запуск ресурсов с несколькими тегами выполняется следующей командой:

```shell
# Запустить все ресурсы с тегами "order_metrics" и "hourly"
  dbt build --select tag:order_metrics tag:hourly
```

## Примечания по использованию {#usage-notes}

### Теги должны быть строками {#tags-must-be-strings}

Каждый отдельный тег должен быть строковым значением (например, `marketing` или `daily`).

В следующем примере `my_tag: "my_value"` является недопустимым, поскольку это пара ключ–значение.

```yml
sources:
  - name: ecom
    schema: raw
    description: E-commerce data for the Jaffle Shop
    config:
      tags:
        my_tag: "my_value". # invalid
    tables:
      - name: raw_customers
        config:
          tags:
            my_tag: "my_value". # invalid
```

Предупреждение возникает в том случае, если значение `tags` не является строкой. Например:

```
Field config.tags: {'my_tag': 'my_value'} is not valid for source (ecom)
```

### Теги являются аддитивными {#tags-are-additive}

Теги накапливаются и применяются иерархически. [Пример выше](/reference/resource-configs/tags#use-tags-to-run-parts-of-your-project) приведёт к следующему результату:

| Модель                            | Теги                                  |
| -------------------------------- | ------------------------------------- |
| models/staging/stg_customers.sql | `contains_pii`, `hourly`              |
| models/staging/stg_payments.sql  | `contains_pii`, `hourly`, `finance`   |
| models/marts/dim_customers.sql   | `contains_pii`, `hourly`, `published` |
| models/metrics/daily_metrics.sql | `contains_pii`, `daily`, `published`  |

### Другие типы ресурсов {#other-resource-types}

Теги также можно применять к [sources](/docs/build/sources), [exposures](/docs/build/exposures) и даже к _отдельным столбцам_ ресурса.  
Эти ресурсы пока не поддерживают свойство `config`, поэтому теги нужно указывать как ключ верхнего уровня.

<File name='models/schema.yml'>

```yml

exposures:
  - name: my_exposure
    config:
      tags: ['exposure_tag'] # changed to config in v1.10
    ...

sources:
  - name: source_name
    config:
      tags: ['top_level'] # changed to config in v1.10

    tables:
      - name: table_name
        config:
          tags: ['table_level'] # changed to config in v1.10

        columns:
          - name: column_name
            config:
              tags: ['column_level'] # changed to config in v1.10 and backported to 1.9
            data_tests:
              - unique:
                config:
                  tags: ['test_level'] # changed to config in v1.10
```

</File>

В приведённом выше примере тест `unique` будет выбран при использовании любого из этих четырёх тегов:
```bash
dbt test --select tag:top_level
dbt test --select tag:table_level
dbt test --select tag:column_level
dbt test --select tag:test_level
```
