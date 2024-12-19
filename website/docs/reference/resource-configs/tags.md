---
sidebar_label: "теги"
resource_types: all
datatype: string | [string]
---

<Tabs
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Свойство конфигурации', value: 'other-yaml', },
    { label: 'Блок конфигурации', value: 'config', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yml

models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

```

</File>
</TabItem>

<TabItem value="other-yaml">

<File name='models/resources.yml'>

```yml
version: 2

models:
  - name: model_name
    config:
      tags: <string> | [<string>]

    columns:
      - name: column_name
        tags: [<string>]
        tests:
          <test-name>:
            config:
              tags: <string> | [<string>]
```

</File>
</TabItem>


<TabItem value="config">

```jinja

{{ config(
    tags="<string>" | ["<string>"]
) }}

```

</TabItem>

</Tabs>

## Определение
Примените тег (или список тегов) к ресурсу.

Эти теги могут использоваться как часть [синтаксиса выбора ресурсов](/reference/node-selection/syntax) при выполнении следующих команд:
- `dbt run --select tag:my_tag`
- `dbt seed --select tag:my_tag`
- `dbt snapshot --select tag:my_tag`
- `dbt test --select tag:my_tag` (косвенно запускает все тесты, связанные с моделями, которые имеют теги)

## Примеры
### Используйте теги для запуска частей вашего проекта

Примените теги в вашем `dbt_project.yml` как одно значение или строку:

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

Вы также можете применить теги к отдельным ресурсам, используя блок конфигурации:

<File name='models/staging/stg_payments.sql'>

```sql
{{ config(
    tags=["finance"]
) }}

select ...

```

</File>

Затем выполните часть вашего проекта следующим образом:

```
# Запустите все модели с тегом "daily"
$ dbt run --select tag:daily

# Запустите все модели с тегом "daily", кроме тех, которые имеют тег hourly
$ dbt run --select tag:daily --exclude tag:hourly
```

### Примените теги к семенам

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

## Примечания по использованию

### Теги являются аддитивными
Теги накапливаются иерархически. Приведенный выше пример приведет к следующему:

| Модель                            | Теги                                  |
| -------------------------------- | ------------------------------------- |
| models/staging/stg_customers.sql | `contains_pii`, `hourly`              |
| models/staging/stg_payments.sql  | `contains_pii`, `hourly`, `finance`   |
| models/marts/dim_customers.sql   | `contains_pii`, `hourly`, `published` |
| models/metrics/daily_metrics.sql | `contains_pii`, `daily`, `published`  |

### Другие типы ресурсов

Теги также могут применяться к источникам, экспозициям и даже _конкретным столбцам_ в ресурсе.
Эти ресурсы пока не поддерживают свойство `config`, поэтому вам нужно будет указать
теги как ключ верхнего уровня.

<File name='models/schema.yml'>

```yml
version: 2

exposures:
  - name: my_exposure
    tags: ['exposure_tag']
    ...

sources:
  - name: source_name
    tags: ['top_level']

    tables:
      - name: table_name
        tags: ['table_level']

        columns:
          - name: column_name
            tags: ['column_level']
            tests:
              - unique:
                  tags: ['test_level']
```

</File>

В приведенном выше примере тест `unique` будет выбран любым из этих четырех тегов:
```bash
$ dbt test --select tag:top_level
$ dbt test --select tag:table_level
$ dbt test --select tag:column_level
$ dbt test --select tag:test_level
```