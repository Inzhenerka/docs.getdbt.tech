---
sidebar_label: "docs"
resource_types: models
description: "Документация - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: "{dictionary}"
default_value: {show: true}
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Analyses', value: 'analyses', },
    { label: 'Macros', value: 'macros', },
  ]
}>

<TabItem value="models">

Вы можете настроить поведение `docs` для многих ресурсов сразу, задав его в `dbt_project.yml`. Вы также можете использовать конфигурацию `docs` в файлах `properties.yaml`, чтобы задать или переопределить поведение документации для конкретных ресурсов:

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +docs:
      show: true | false
      node_color: color_id # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")

```

</File>

<File name='models/schema.yml'>

  ```yml
version: 2

models:
  - name: model_name
    docs:
      show: true | false
      node_color: color_id # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
```
</File>

</TabItem>

<TabItem value="sources">

Это свойство не реализовано для источников.

</TabItem>

<TabItem value="seeds">

Вы можете использовать свойство docs в YAML-файлах, включая `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +docs:
      show: true | false
      node_color: color_id # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
```

</File>

<File name='seeds/schema.yml'>

```yml
version: 2

seeds:
  - name: seed_name
    docs:
      show: true | false
      node_color: color_id # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
```
</File>

</TabItem>

<TabItem value="snapshots">

Вы можете использовать свойство docs в YAML-файлах, включая `dbt_project.yml`:

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +docs:
      show: true | false
      node_color: color_id # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")

```

</File>

<File name='snapshots/schema.yml'>

```yml
version: 2

snapshots:
  - name: snapshot_name
    docs:
      show: true | false
      node_color: color_id # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
```
</File>

</TabItem>

<TabItem value="analyses">

Вы можете использовать свойство docs в YAML-файлах, _кроме_ `dbt_project.yml`. Обратитесь к [Свойства анализа](/reference/analysis-properties) для получения дополнительной информации.

<File name='analysis/schema.yml'>

```yml
version: 2

analyses:
  - name: analysis_name
    docs:
      show: true | false
      node_color: color_id # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
```
</File>

</TabItem>

<TabItem value="macros">

Вы можете использовать свойство docs в YAML-файлах, _кроме_ `dbt_project.yml`. Обратитесь к [Свойства макросов](/reference/macro-properties) для получения дополнительной информации.

<File name='macros/schema.yml'>

```yml
version: 2

macros:
  - name: macro_name
    docs:
      show: true | false
```
</File>

</TabItem>

</Tabs>

## Определение
Свойство `docs` может быть использовано для предоставления конфигурации, специфичной для документации, для моделей. Оно поддерживает атрибут `show`, который контролирует, отображаются ли узлы на автоматически сгенерированном сайте документации. Также поддерживается `node_color` для моделей, семян, снимков и анализов. Другие типы узлов не поддерживаются.

**Примечание:** Скрытые модели все равно будут отображаться в визуализации DAG dbt, но будут обозначены как "скрытые".

## Значение по умолчанию
Значение по умолчанию для `show` — `true`.

## Примеры
### Пометить модель как скрытую

```yml
models:
  - name: sessions__tmp
    docs:
      show: false
```

### Пометить подкаталог моделей как скрытый

**Примечание:** Это также может скрыть пакеты dbt.

<File name='dbt_project.yml'>

```yml
models:
  # скрытие моделей в подкаталоге staging
  tpch:
    staging:
      +materialized: view
      +docs:
        show: false
  
  # скрытие пакета dbt
  dbt_artifacts:
    +docs:
      show: false
```

</File>

## Пользовательские цвета узлов

Атрибут `docs` теперь поддерживает `node_color` для настройки цвета отображения некоторых типов узлов в DAG в рамках dbt docs. Вы можете определить цвета узлов в следующих файлах и применять переопределения, где это необходимо. Обратите внимание, что вам нужно запустить или перезапустить команду `dbt docs generate`.

Иерархия `node_color`:

`<example-sql-file.sql>` переопределяет `schema.yml`, который переопределяет `dbt_project.yml`

## Примеры

Добавьте пользовательские `node_colors` к моделям, которые поддерживают это в подкаталогах, используя шестнадцатеричные коды или простое имя цвета.

![Пример](../../../../website/static/img/node_color_example.png)

`marts/core/fct_orders.sql` с `node_color: red` переопределяет `dbt_project.yml` с `node_color: gold`

`marts/core/schema.yml` с `node_color: #000000` переопределяет `dbt_project.yml` с `node_color: gold`
<File name='dbt_project.yml'>

```yml
models:
  tpch:
    staging:
      +materialized: view
      +docs:
        node_color: "#cd7f32"

    marts:
      core:
        materialized: table
        +docs:
          node_color: "gold"
```

</File>

<File name='marts/core/schema.yml'>

```yml
models:
  - name: dim_customers
    description: Таблица измерений клиентов
    docs:
      node_color: '#000000'
```

</File>

<File name='marts/core/fct_orders.sql'>

```sql
{{
    config(
        materialized = 'view',
        tags=['finance'],
        docs={'node_color': 'red'}
    )
}}

with orders as (
    
    select * from {{ ref('stg_tpch_orders') }} 

),
order_item as (
    
    select * from {{ ref('order_items') }}

),
order_item_summary as (

    select 
        order_key,
        sum(gross_item_sales_amount) as gross_item_sales_amount,
        sum(item_discount_amount) as item_discount_amount,
        sum(item_tax_amount) as item_tax_amount,
        sum(net_item_sales_amount) as net_item_sales_amount
    from order_item
    group by
        1
),
final as (

    select 

        orders.order_key, 
        orders.order_date,
        orders.customer_key,
        orders.status_code,
        orders.priority_code,
        orders.clerk_name,
        orders.ship_priority,
                
        1 as order_count,                
        order_item_summary.gross_item_sales_amount,
        order_item_summary.item_discount_amount,
        order_item_summary.item_tax_amount,
        order_item_summary.net_item_sales_amount
    from
        orders
        inner join order_item_summary
            on orders.order_key = order_item_summary.order_key
)
select 
    *
from
    final

order by
    order_date

```

</File>

Если `node_color` несовместим с dbt docs, вы увидите ошибку компиляции, как в примере ниже.

```shell
Invalid color name for docs.node_color: aweioohafio23f. It is neither a valid HTML color name nor a valid HEX code.
```

<File name='dbt_project.yml'>

```yml
models:
  tpch:
    marts:
      core:
        materialized: table
        +docs:
          node_color: "aweioohafio23f"
```

</File>