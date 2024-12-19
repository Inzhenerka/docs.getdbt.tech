---
resource_types: all
description: "Включено - Прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: boolean
default_value: true
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Модели', value: 'models', },
    { label: 'Сиды', value: 'seeds', },
    { label: 'Снимки', value: 'snapshots', },
    { label: 'Тесты', value: 'tests', },
    { label: 'Источники', value: 'sources', },
    { label: 'Метрики', value: 'metrics', },
    { label: 'Экспозиции', value: 'exposures', },
    { label: 'Семантические модели', value: 'semantic models', },
    { label: 'Сохраненные запросы', value: 'saved queries', },
  ]
}>
<TabItem value="models">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
  enabled=true | false
) }}

select ...


```

</File>

</TabItem>


<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  enabled=true | false
) }}

select ...

{% endsnapshot %}

```

</File>

</TabItem>

<TabItem value="tests">

<File name='dbt_project.yml'>

```yml
tests:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

<File name='tests/<filename>.sql'>

```sql
{% test <testname>() %}

{{ config(
  enabled=true | false
) }}

select ...

{% endtest %}

```

</File>

<File name='tests/<filename>.sql'>

```sql
{{ config(
  enabled=true | false
) }}
```

</File>

</TabItem>

<TabItem value="sources">

<File name='dbt_project.yml'>

```yaml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false

```

</File>


<File name='models/properties.yml'>

```yaml
version: 2

sources:
  - name: [<source-name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
    tables:
      - name: [<source-table-name>]
        [config](/reference/resource-properties/config):
          enabled: true | false

```

</File>


</TabItem>

<TabItem value="metrics">

<File name='dbt_project.yml'>

```yaml
metrics:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='models/metrics.yml'>

```yaml
version: 2

metrics:
  - name: [<metric-name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

<TabItem value="exposures">

<File name='dbt_project.yml'>

```yaml
exposures:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='models/exposures.yml'>

```yaml
version: 2

exposures:
  - name: [<exposure-name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

<TabItem value="semantic models">

<File name='dbt_project.yml'>

```yaml
semantic-models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='models/semantic_models.yml'>

```yaml
semantic_models:
  - name: [<semantic_model_name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

<TabItem value="saved queries">

<File name='dbt_project.yml'>

```yaml
saved-queries:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='models/semantic_models.yml'>

```yaml
saved_queries:
  - name: [<saved_query_name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

</Tabs>

## Определение

Необязательная конфигурация для включения или отключения ресурса.

* По умолчанию: true

Когда ресурс отключен, dbt не будет рассматривать его как часть вашего проекта. Обратите внимание, что это может вызвать ошибки компиляции.

Если вы хотите исключить модель из конкретного запуска, рассмотрите возможность использования параметра `--exclude` в рамках [синтаксиса выбора модели](/reference/node-selection/syntax).

Если вы отключаете модели, потому что они больше не используются, но хотите контролировать версию их SQL, рассмотрите возможность преобразования их в [анализ](/docs/build/analyses).

## Примеры
### Отключение модели в пакете, чтобы использовать свою версию модели.
Это может быть полезно, если вы хотите изменить логику модели в пакете. Например, если вам нужно изменить логику в `segment_web_page_views` из пакета `segment` ([оригинальная модель](https://github.com/dbt-labs/segment/blob/a8ff2f892b009a69ec36c3061a87e437f0b0ea93/models/base/segment_web_page_views.sql)):
1. Добавьте модель с именем `segment_web_page_views` (то же имя) в свой проект.
2. Чтобы избежать ошибки компиляции из-за дублирующихся моделей, отключите версию модели из пакета segment следующим образом:

<File name='dbt_project.yml'>

```yml
models:
  segment:
    base:
      segment_web_page_views:
        +enabled: false
```

</File>