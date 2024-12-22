---
resource_types: [models, seeds, snapshots, tests, analyses, metrics]
id: "group"
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Модели', value: 'models', },
    { label: 'Семена', value: 'seeds', },
    { label: 'Снимки', value: 'snapshots', },
    { label: 'Тесты', value: 'tests', },
    { label: 'Анализы', value: 'analyses', },
    { label: 'Метрики', value: 'metrics', },
    { label: 'Семантические модели', value: 'semantic models', },
    { label: 'Сохраненные запросы', value: 'saved queries',} ,
  ]
}>
<TabItem value="models">
 
<File name='dbt_project.yml'>

```yml
models:

  [<resource-path>](resource-path):
    +group: GROUP_NAME

```


</File>

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: MODEL_NAME
    group: GROUP

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
  group='GROUP_NAME'
) }}

select ...

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](resource-path):
    +group: GROUP_NAME
```

</File>

<File name='seeds/properties.yml'>

```yml
seeds:
  - name: [SEED_NAME]
    group: GROUP_NAME
```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](resource-path):
    +group: GROUP_NAME
```

</File>

<VersionBlock firstVersion="1.9">
<File name='snapshots/properties.yml'>

```yaml
version: 2

snapshots:
  - name: snapshot_name
    [config](/reference/resource-properties/config):
      group: GROUP_NAME
```

</File>
</VersionBlock>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  group='GROUP_NAME'
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
  [<resource-path>](resource-path):
    +group: GROUP_NAME
```

</File>

<File name='tests/properties.yml'>

```yml
version: 2

<resource_type>:
  - name: <resource_name>
    tests:
      - <test_name>:
          config:
            group: GROUP_NAME
```

</File>

<File name='tests/<filename>.sql'>

```sql
{% test <testname>() %}

{{ config(
  group='GROUP_NAME'
) }}

select ...

{% endtest %}
```

</File>

<File name='tests/<filename>.sql'>


```sql
{{ config(
  group='GROUP_NAME'
) }}
```

</File>

</TabItem>

<TabItem value="analyses">

<File name='analyses/<filename>.yml'>

```yml
version: 2

analyses:
  - name: ANALYSIS_NAME
    group: GROUP_NAME
```

</File>

</TabItem>


<TabItem value="metrics">

<File name='dbt_project.yml'>

```yaml
metrics:
  [<resource-path>](resource-path):
    [+](plus-prefix)group: GROUP_NAME
```

</File>

<File name='models/metrics.yml'>

```yaml
version: 2

metrics:
  - name: [METRIC_NAME]
    config:
      group: GROUP_NAME

```

</File>

</TabItem>


<TabItem value="semantic models">

<File name='dbt_project.yml'>

```yaml
semantic-models:
  [<resource-path>](resource-path):
    [+](plus-prefix)group: GROUP_NAME
```

</File>

<File name='models/semantic_models.yml'>

```yaml
semantic_models:
  - name: SEMANTIC_MODEL_NAME
    config:
      group: GROUP_NAME
```

</File>

</TabItem>

<TabItem value="saved queries">

<File name='dbt_project.yml'>

```yaml
saved-queries:
  [<resource-path>](resource-path):
    [+](plus-prefix)group: GROUP_NAME
```

</File>

<File name='models/semantic_models.yml'>

```yaml
saved_queries:
  - name: SAVED_QUERY_NAME
    config:
      group: GROUP_NAME
```

</File>

</TabItem>

</Tabs>

## Определение
Необязательная конфигурация для назначения группы ресурсу. Когда ресурс сгруппирован, dbt позволит ему ссылаться на приватные модели в той же группе.

Для получения дополнительной информации о доступе к ссылкам между ресурсами в группах, ознакомьтесь с [доступом к моделям](/docs/collaborate/govern/model-access#groups).

## Примеры
### Запретить модели группы 'маркетинг' ссылаться на приватную модель группы 'финансы'
Это полезно, если вы хотите предотвратить возможность другим группам строить на основе моделей, которые быстро меняются, являются экспериментальными или иначе внутренними для группы или команды. 

<File name='models/schema.yml'>

```yml
models:
  - name: finance_model
    access: private
    group: finance
  - name: marketing_model
    group: marketing
```
</File>

<File name='models/marketing_model.sql'>

```sql
select * from {{ ref('finance_model') }}
```
</File>

```shell
$ dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Ошибка разбора
  Узел model.jaffle_shop.marketing_model попытался сослаться на узел model.jaffle_shop.finance_model, 
  что не разрешено, поскольку ссылающийся узел является приватным для группы финансов.
```

## Связанные документы

* [Доступ к моделям](/docs/collaborate/govern/model-access#groups)
* [Определение групп](/docs/build/groups)