---
resource_types: [snapshots]
description: "Прочтите это руководство, чтобы понять конфигурацию check_cols в dbt."
datatype: "[column_name] | all"
---

<VersionBlock firstVersion="1.9">
<File name="snapshots/<filename>.yml">
  
  ```yml
  snapshots:
  - name: snapshot_name
    relation: source('my_source', 'my_table')
    config:
      schema: string
      unique_key: column_name_or_expression
      strategy: check
      check_cols:
        - column_name
  ```
  
</File>
</VersionBlock>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +strategy: check
    +check_cols: [column_name] | all

```

</File>

## Описание {#description}
Список столбцов в результатах вашего запроса снимка для проверки изменений.

В качестве альтернативы можно использовать все столбцы, используя значение `all` (однако это может быть менее производительно).

Этот параметр **обязателен, если используется [стратегия](/reference/resource-configs/strategy) `check`**.

## Значение по умолчанию {#default}
Значение по умолчанию не предоставляется.

## Примеры {#examples}

### Проверка списка столбцов на изменения {#check-a-list-of-columns-for-changes}

<VersionBlock firstVersion="1.9">

<File name="snapshots/orders_snapshot_check.yml">

```yaml
snapshots:
  - name: orders_snapshot_check
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: check
      check_cols:
        - status
        - is_cancelled
```
</File>

Чтобы выбрать из этого снимка в последующей модели: `select * from {{ ref('orders_snapshot_check') }}`
</VersionBlock>

### Проверка всех столбцов на изменения {#check-all-columns-for-changes}

<VersionBlock firstVersion="1.9">

<File name="orders_snapshot_check.yml">

```yaml
snapshots:
  - name: orders_snapshot_check
    relation: source('jaffle_shop', 'orders')
    config:
      schema: snapshots
      unique_key: id
      strategy: check
      check_cols: all
  ```
</File>

Чтобы выбрать данные из этого snapshot в downstream-модели, используйте: `select * from {{ ref('orders_snapshot_check') }}`
</VersionBlock>


