---
resource_types: [snapshots]
description: "Updated_at - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: column_name
---

<VersionBlock firstVersion="1.9">

<File name="snapshots/snapshots.yml">

```yaml
snapshots:
  - name: snapshot
    relation: source('my_source', 'my_table')
    [config](/reference/snapshot-configs):
      strategy: timestamp
      updated_at: column_name
```
</File>
</VersionBlock>


<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +strategy: timestamp
    +updated_at: column_name

```

</File>

<VersionBlock firstVersion="1.9">

:::caution

Вы получите предупреждение, если тип данных столбца `updated_at` не соответствует настроенному по умолчанию адаптеру.

:::

</VersionBlock>

## Описание {#description}
Столбец в результатах вашего снимка, который представляет, когда строка записи была обновлена в последний раз.

Этот параметр **обязателен при использовании [strategy](/reference/resource-configs/strategy) `timestamp`**. Поле `updated_at` может поддерживать строки дат в формате ISO и целые числа unix epoch — в зависимости от используемой вами платформы данных.

## По умолчанию {#default}
Значение по умолчанию не предоставляется.

## Примеры {#examples}
### Использование имени столбца `updated_at` {#use-a-column-name-updated_at}

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


### Объединение двух столбцов для создания надежного столбца `updated_at` {#coalesce-two-columns-to-create-a-reliable-updated_at-column}
Рассмотрим источник данных, в котором столбец `updated_at` заполняется только при обновлении записи (поэтому значение `null` указывает на то, что запись не была обновлена после создания).

Поскольку конфигурация `updated_at` принимает только имя столбца, а не выражение, вам следует обновить запрос снимка, чтобы включить объединенный столбец.

<VersionBlock firstVersion="1.9">

1. Создайте промежуточную модель для выполнения преобразования.
   В вашем каталоге `models/` создайте SQL-файл, который настраивает промежуточную модель для объединения столбцов `updated_at` и `created_at` в новый столбец `updated_at_for_snapshot`.

    <File name='models/staging_orders.sql'>

    ```sql
    select  * coalesce (updated_at, created_at) as updated_at_for_snapshot
    from {{ source('jaffle_shop', 'orders') }}

    ```
    </File>

2. Определите конфигурацию снимка в YAML-файле.
   В вашем каталоге `snapshots/` создайте YAML-файл, который определяет ваш снимок и ссылается на только что созданную промежуточную модель `updated_at_for_snapshot`.

    <File name="snapshots/orders_snapshot.yml">

    ```yaml
    snapshots:
      - name: orders_snapshot
        relation: ref('staging_orders')
        config:
          schema: snapshots
          unique_key: id
          strategy: timestamp
          updated_at: updated_at_for_snapshot

    ```
    </File>

3. Запустите `dbt snapshot`, чтобы выполнить снимок.

В качестве альтернативы, вы также можете создать эфемерную модель для выполнения необходимых преобразований. Затем вы ссылаетесь на эту модель в ключе `relation` вашего снимка.

</VersionBlock>

