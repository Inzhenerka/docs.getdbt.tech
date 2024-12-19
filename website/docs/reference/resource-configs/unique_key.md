---
resource_types: [snapshots, models]
description: "Узнайте больше о конфигурациях unique_key в dbt."
datatype: column_name_or_expression
---


<Tabs>

<TabItem value="models" label="Модели">

Настройте `unique_key` в блоке `config` вашего SQL файла [инкрементальной модели](/docs/build/incremental-models), в вашем файле `models/properties.yml` или в вашем файле `dbt_project.yml`.

<File name='models/my_incremental_model.sql'>

```sql
{{
    config(
        materialized='incremental',
        unique_key='id'
    )
}}

```

</File>

<File name='models/properties.yml'>

```yaml
models:
  - name: my_incremental_model
    description: "Пример инкрементальной модели с уникальным ключом."
    config:
      materialized: incremental
      unique_key: id

```

</File>

<File name='dbt_project.yml'>

```yaml
name: jaffle_shop

models:
  jaffle_shop:
    staging:
      +unique_key: id
```

</File>

</TabItem>

<TabItem value="snapshots" label="Снимки">

<VersionBlock firstVersion="1.9">

Для [снимков](/docs/build/snapshots) настройте `unique_key` в вашем файле `snapshot/filename.yml` или в вашем файле `dbt_project.yml`.

<File name='snapshots/<filename>.yml'>

```yaml
snapshots:
  - name: orders_snapshot
    relation: source('my_source', 'my_table')
    [config](/reference/snapshot-configs):
      unique_key: order_id

```

</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

Настройте `unique_key` в блоке `config` вашего SQL файла снимка или в вашем файле `dbt_project.yml`.

import SnapshotYaml from '/snippets/_snapshot-yaml-spec.md';

<SnapshotYaml/>

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  unique_key="column_name"
) }}

```
</File>
</VersionBlock>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +unique_key: column_name_or_expression

```

</File>

</TabItem>
</Tabs>

## Описание
Имя столбца или выражение, которое уникально для входных данных снимка или инкрементальной модели. dbt использует это для сопоставления записей между набором результатов и существующим снимком или инкрементальной моделью, чтобы изменения могли быть правильно зафиксированы.

В треке "Latest" dbt Cloud и начиная с версии dbt v1.9, [снимки](/docs/build/snapshots) определяются и настраиваются в YAML файлах в вашем каталоге `snapshots/`. Вы можете указать одно или несколько значений `unique_key` в ключе `config` вашего YAML файла снимка.

:::caution 

Предоставление неуникального ключа приведет к неожиданным результатам снимка. dbt **не будет** проверять уникальность этого ключа, рассмотрите возможность [тестирования](/blog/primary-key-testing#how-to-test-primary-keys-with-dbt) исходных данных, чтобы убедиться, что этот ключ действительно уникален.

:::

## По умолчанию
Это **обязательный параметр**. Значение по умолчанию не предоставляется.


## Примеры
### Использование столбца `id` в качестве уникального ключа

<Tabs>

<TabItem value="models" label="Модели">

В этом примере столбец `id` является уникальным ключом для инкрементальной модели.

<File name='models/my_incremental_model.sql'>

```sql
{{
    config(
        materialized='incremental',
        unique_key='id'
    )
}}

select * from ..
```

</File>
</TabItem>

<TabItem value="snapshots" label="Снимки">

В этом примере столбец `id` используется в качестве уникального ключа для снимка.

<VersionBlock firstVersion="1.9">

<File name="snapshots/orders_snapshot.yml">

```yaml
snapshots:
  - name: orders_snapshot
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: timestamp
      updated_at: updated_at

```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">
<File name='snapshots/<filename>.sql'>

```jinja2
{{
    config(
      unique_key="id"
    )
}}

```

</File>

Вы также можете записать это в yaml. Это может быть хорошей идеей, если несколько снимков используют один и тот же `unique_key` (хотя мы предпочитаем применять эту конфигурацию в блоке config, как указано выше).
</VersionBlock>

Вы также можете указать конфигурации в вашем файле `dbt_project.yml`, если несколько снимков используют один и тот же `unique_key`:
<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +unique_key: id

```

</File>

</TabItem>
</Tabs>

<VersionBlock firstVersion="1.9">

### Использование нескольких уникальных ключей

<Tabs>
<TabItem value="models" label="Модели">

Настройте несколько уникальных ключей для инкрементальной модели в виде строки, представляющей один столбец, или списка имен столбцов в одинарных кавычках, которые могут использоваться вместе, например, `['col1', 'col2', …]`. 

Столбцы не должны содержать значения null, иначе инкрементальная модель не сможет сопоставить строки и сгенерирует дублирующиеся строки. Смотрите [Определение уникального ключа](/docs/build/incremental-models#defining-a-unique-key-optional) для получения дополнительной информации.

<File name='models/my_incremental_model.sql'>

```sql
{{ config(
    materialized='incremental',
    unique_key=['order_id', 'location_id']
) }}

with...

```

</File>

</TabItem>

<TabItem value="snapshots" label="Снимки">

Вы можете настроить снимки для использования нескольких уникальных ключей для столбцов `primary_key`.

<File name='snapshots/transaction_items_snapshot.yml'>

```yaml
snapshots:
  - name: orders_snapshot
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: 
        - order_id
        - product_id
      strategy: timestamp
      updated_at: updated_at
      
```

</File>
</TabItem>
</Tabs>
</VersionBlock>

<VersionBlock lastVersion="1.8">

### Использование комбинации двух столбцов в качестве уникального ключа

<Tabs>
<TabItem value="models" label="Модели">

<File name='models/my_incremental_model.sql'>

```sql
{{ config(
    materialized='incremental',
    unique_key=['order_id', 'location_id']
) }}

with...

```

</File>

</TabItem>

<TabItem value="snapshots" label="Снимки">

Эта конфигурация принимает допустимое выражение столбца. Таким образом, вы можете объединить два столбца вместе в качестве уникального ключа, если это необходимо. Хорошей идеей будет использовать разделитель (например, `'-'`), чтобы обеспечить уникальность.

<File name='snapshots/transaction_items_snapshot.sql'>

```jinja2
{% snapshot transaction_items_snapshot %}

    {{
        config(
          unique_key="transaction_id||'-'||line_item_id",
          ...
        )
    }}

select
    transaction_id||'-'||line_item_id as id,
    *
from {{ source('erp', 'transactions') }}

{% endsnapshot %}

```

</File>

Тем не менее, вероятно, лучше создать этот столбец в вашем запросе и использовать его в качестве `unique_key`:

<File name='models/transaction_items_ephemeral.sql'>

```sql
{{ config(materialized='ephemeral') }}

select
  transaction_id || '-' || line_item_id as id,
  *
from {{ source('erp', 'transactions') }}

```

</File>

В этом примере мы создаем эфемерную модель `transaction_items_ephemeral`, которая создает столбец `id`, который может быть использован в качестве `unique_key` в нашей конфигурации снимка.

<File name='snapshots/transaction_items_snapshot.sql'>

```jinja2

{% snapshot transaction_items_snapshot %}

    {{
        config(
          unique_key="id",
          ...
        )
    }}

select
    transaction_id || '-' || line_item_id as id,
    *
from {{ source('erp', 'transactions') }}

{% endsnapshot %}


```

</File>
</TabItem>
</Tabs>
</VersionBlock>