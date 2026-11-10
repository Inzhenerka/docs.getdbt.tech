---
description: "Настройка тегов для маркировки и организации моделей и других ресурсов dbt."
sidebar_label: "теги"
resource_types: all
datatype: string | [string]
---

<Tabs
  defaultValue="models"
  values={[
{ label: 'Модели', value: 'models', },
    { label: 'Seed-файлы', value: 'seeds', },
    { label: 'Снимки', value: 'snapshots', },
    { label: 'Сохранённые запросы', value: 'saved queries', },
    { label: 'Источники', value: 'sources', },
    { label: 'Экспозиции', value: 'exposures', },
    { label: 'Тесты', value: 'tests', },
    { label: 'Функции', value: 'functions', },
  ]
}>
<TabItem value="models">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='models/properties.yml'>

```yaml
models:
  - name: model_name
    config:
      tags: <string> | [<string>]
    columns:
      - name: column_name
        config:
          tags: <string> | [<string>] # changed to config in v1.10 and backported to 1.9
        data_tests:
          - test_name:
              config:
                tags: <string> | [<string>]
```

</File>

<File name='models/<modelname>.sql'>

```sql
{{ config(
    tags="<string>" | ["<string>"]
) }}

select ...
```

</File>

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='seeds/properties.yml'>

```yaml
seeds:
  - name: seed_name
    config:
      tags: <string> | [<string>]
    columns:
      - name: column_name
        config:
          tags: <string> | [<string>] # changed to config in v1.10 and backported to 1.9
        data_tests:
          - test_name:
              config:
                tags: <string> | [<string>]
```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<VersionBlock firstVersion="1.9">

<File name='snapshots/properties.yml'>

```yaml
snapshots:
  - name: snapshot_name
    config:
      tags: <string> | [<string>]
```

</File>

</VersionBlock>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot snapshot_name %}

{{ config(
    tags="<string>" | ["<string>"]
) }}

select ...

{% endsnapshot %}
```

</File>

</TabItem>

<TabItem value="saved queries">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
saved-queries:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='models/semantic_models.yml'>

```yaml
saved_queries:
  - name: saved_query_name
    config:
      tags: <string> | [<string>]
```

</File>

</TabItem>

<TabItem value="sources">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='models/properties.yml'>

```yaml
sources:
  - name: source_name
    config:
      tags: <string> | [<string>] # changed to config in v1.10
    tables:
      - name: table_name
        config:
          tags: <string> | [<string>] # changed to config in v1.10
        columns:
          - name: column_name
            config:
              tags: <string> | [<string>] # changed to config in v1.10 and backported to 1.9
            data_tests:
              - test_name:
                  config:
                    tags: <string> | [<string>]
```

</File>

Для обратной совместимости у источников поддерживается ключ `tags` верхнего уровня. Он не наследует настройки конфигурации.

</TabItem>

<TabItem value="exposures">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
exposures:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='models/exposures.yml'>

```yaml
exposures:
  - name: exposure_name
    config:
      tags: <string> | [<string>] # changed to config in v1.10
```

</File>

Для обратной совместимости у экспозиций поддерживается ключ `tags` верхнего уровня. Он не наследует настройки конфигурации.

</TabItem>

<TabItem value="tests">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
data_tests:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='models/properties.yml'>

```yaml
models:
  - name: model_name
    columns:
      - name: column_name
        data_tests:
          - test_name:
              config:
                tags: <string> | [<string>]
```

</File>

<File name='tests/<filename>.sql'>

```sql
{% test test_name() %}

{{ config(
    tags="<string>" | ["<string>"]
) }}

select ...

{% endtest %}
```

</File>

</TabItem>

<TabItem value="functions">

<File name='dbt_project.yml'>

```yml
functions:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)tags: <string> | [<string>]
```

</File>

<File name='functions/properties.yml'>

```yaml
functions:
  - name: function_name
    config:
      tags: <string> | [<string>]
```

</File>

<File name='functions/<filename>.sql'>

```sql
{{ config(
    tags="<string>" | ["<string>"]
) }}
```

</File>

</TabItem>

</Tabs>

## Определение {#definition}
Примените тег (или список тегов) к ресурсу.

Эти теги можно использовать как часть [синтаксиса выбора ресурсов](/reference/node-selection/syntax) при выполнении следующих команд:
- `dbt run --select tag:my_tag` &mdash; Запускает все модели, помеченные указанным тегом.
- `dbt build --select tag:my_tag` &mdash; Собирает все ресурсы, помеченные указанным тегом.
- `dbt seed --select tag:my_tag` &mdash; Загружает (seed) все ресурсы, помеченные указанным тегом.
- `dbt snapshot --select tag:my_tag` &mdash; Создаёт snapshot для всех ресурсов, помеченных указанным тегом.
- `dbt test --select tag:my_tag` &mdash; Косвенно запускает все тесты, связанные с моделями, которые помечены этим тегом.

:::note Влияние на сравнение состояний
Изменения в `tags`, в том числе на уровне столбцов, не приводят к включению ресурса в выборку [`state:modified`](/reference/node-selection/methods#state). dbt рассматривает `tags` (и `meta`) исключительно как метаданные, поскольку они не влияют на способ материализации ресурса. Подробнее см. в разделе [«Ограничения сравнения состояний»](/reference/node-selection/state-comparison-caveats#tags-and-meta).
:::

#### Использование тегов с оператором `+`
Вы можете использовать [оператор `+`](/reference/node-selection/graph-operators#the-plus-operator), чтобы включить вышестоящие или нижестоящие зависимости в выборку по `tag`:
- `dbt run --select tag:my_tag+` &mdash; Запустить модели с тегом `my_tag` и все их нижестоящие зависимости.
- `dbt run --select +tag:my_tag` &mdash; Запустить модели с тегом `my_tag` и все их вышестоящие зависимости.
- `dbt run --select +tag:my_tag+` &mdash; Запустить модели с тегом `my_tag`, их вышестоящие и нижестоящие зависимости.
- `dbt run --select tag:my_tag+ --exclude tag:exclude_tag` &mdash; Запустить модели с тегом `my_tag` и их нижестоящие зависимости, исключив модели с тегом `exclude_tag` независимо от их зависимостей.

:::tip Примечания по использованию тегов

При работе с тегами учитывайте следующее:

- Каждый отдельный тег должен быть строкой.
- Теги являются аддитивными по иерархии проекта.
- Для некоторых типов ресурсов (например, sources, exposures) теги необходимо задавать на верхнем уровне.

Подробнее см. в разделе [примечания по использованию](#usage-notes).
:::

## Примеры {#examples}

Следующие примеры показывают, как применять теги к ресурсам в вашем проекте. Вы можете настроить теги в файле `dbt_project.yml`, файлах свойств или SQL-файлах.

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


### Назначение тегов моделям {#apply-tags-to-models}

В этом разделе показано, как назначать теги моделям в `dbt_project.yml`, `schema.yml` и SQL-файлах.

Чтобы задать теги для модели в `dbt_project.yml`, добавьте:

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
saved-queries:
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

### Применение тегов к отдельным столбцам и тестам

Вы также можете применять теги к отдельным столбцам ресурса и к тестам.

<File name='models/properties.yml'>

```yml
models:
  - name: my_model
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

В приведённом выше примере тест `unique` будет выбран по любому из этих тегов:
```bash
dbt test --select tag:column_level
dbt test --select tag:test_level
```

### Обратная совместимость для источников и экспозиций {#backwards-compatibility-for-sources-and-exposures}

Для обратной совместимости у источников и экспозиций поддерживается ключ `tags` верхнего уровня, как до dbt v1.10. Он не наследует настройки конфигурации.

<File name='models/properties.yml'>

```yml
exposures:
  - name: my_exposure
    tags: ['exposure_tag'] # top-level key (legacy)
    # OR use config (v1.10+)
    config:
      tags: ['exposure_tag']

sources:
  - name: source_name
    tags: ['top_level'] # top-level key (legacy)
    # OR use config (v1.10+)
    config:
      tags: ['top_level']
    tables:
      - name: table_name
        tags: ['table_level'] # top-level key (legacy)
        # OR use config (v1.10+)
        config:
          tags: ['table_level']
        columns:
          - name: column_name
            config:
              tags: ['column_level'] # changed to config in v1.10 and backported to 1.9
```

</File>
