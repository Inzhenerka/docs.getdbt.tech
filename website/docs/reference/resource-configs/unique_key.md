---
resource_types: [snapshots, models]
description: "Узнайте больше о конфигурациях unique_key в dbt."
datatype: column_name_or_expression
intro_text: "unique_key identifies records for incremental models or snapshots, ensuring changes are captured or updated correctly."
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
Имя столбца или выражение, которое однозначно идентифицирует каждую запись во входных данных snapshot или инкрементальной модели. dbt использует этот ключ для сопоставления входящих записей с существующими записями в целевой таблице (будь то snapshot или инкрементальная модель), чтобы изменения могли быть корректно зафиксированы или обновлены:
* В инкрементальной модели dbt заменяет старую строку (аналогично merge key или upsert).
* В snapshot dbt сохраняет историю, храня несколько строк для одного и того же `unique_key` по мере его изменения во времени.

В треке релизов <Constant name="cloud" /> «Latest» и начиная с dbt v1.9, [snapshots](/docs/build/snapshots) определяются и настраиваются в YAML-файлах внутри вашего каталога `snapshots/`. Вы можете указать одно или несколько значений `unique_key` в ключе `config` YAML-файла snapshot.

:::caution 

Предоставление неуникального ключа приведет к неожиданным результатам снимка. dbt **не будет** проверять уникальность этого ключа, рассмотрите возможность [тестирования](/blog/primary-key-testing#how-to-test-primary-keys-with-dbt) исходных данных, чтобы убедиться, что этот ключ действительно уникален.

:::

## Значение по умолчанию

Этот параметр является необязательным. Если вы не укажете `unique_key`, адаптер по умолчанию будет использовать `incremental_strategy: append`.

Если параметр `unique_key` не задан и используются такие стратегии, как `merge`, `insert_overwrite`, `delete+insert` или `microbatch`, адаптер выполнит откат к использованию `incremental_strategy: append`.

Для BigQuery поведение отличается:
- Для `incremental_strategy = merge` необходимо указать `unique_key`; его отсутствие приводит к неоднозначному или ошибочному поведению.
- Для `insert_overwrite` или `microbatch` параметр `unique_key` не требуется, так как эти стратегии работают за счёт замены партиций, а не обновлений на уровне строк.

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

В этом примере столбец `id` используется как уникальный ключ для снимка.

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

Вы также можете задать конфигурации в файле `dbt_project.yml`, если несколько snapshot используют один и тот же `unique_key`:
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

Столбцы не должны содержать значения null, иначе инкрементальная модель не сможет сопоставить строки и создаст дублирующиеся строки. Обратитесь к [Определение уникального ключа](/docs/build/incremental-models#defining-a-unique-key-optional) для получения дополнительной информации.

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

