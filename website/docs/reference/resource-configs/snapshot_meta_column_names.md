---
resource_types: [snapshots]
description: "Имена мета-колонок snapshot"
datatype: "{<dictionary>}"
default_value: {"dbt_valid_from": "dbt_valid_from", "dbt_valid_to": "dbt_valid_to", "dbt_scd_id": "dbt_scd_id", "dbt_updated_at": "dbt_updated_at"}
id: "snapshot_meta_column_names"
---

<VersionCallout version="1.9" />

<File name='snapshots/schema.yml'>

```yaml
snapshots:
  - name: <snapshot_name>
    config:
      snapshot_meta_column_names:
        dbt_valid_from: <string>
        dbt_valid_to: <string>
        dbt_scd_id: <string>
        dbt_updated_at: <string>
        dbt_is_deleted: <string>

```

</File>

<File name='snapshots/<filename>.sql'>

```jinja2
{{
    config(
      snapshot_meta_column_names={
        "dbt_valid_from": "<string>",
        "dbt_valid_to": "<string>",
        "dbt_scd_id": "<string>",
        "dbt_updated_at": "<string>",
        "dbt_is_deleted": "<string>",
      }
    )
}}

```

</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +snapshot_meta_column_names:
      dbt_valid_from: <string>
      dbt_valid_to: <string>
      dbt_scd_id: <string>
      dbt_updated_at: <string>
      dbt_is_deleted: <string>
```

</File>

## Описание {#description}

Чтобы привести имена колонок в соответствие с соглашениями об именовании, принятыми в организации, можно использовать конфигурацию `snapshot_meta_column_names`. Она позволяет настраивать имена [метаданных колонок](/docs/build/snapshots#snapshot-meta-fields) внутри каждого snapshot.

## Значения по умолчанию {#default}

По умолчанию snapshots в dbt используют следующие имена колонок для отслеживания истории изменений с помощью записей [медленно изменяющегося измерения типа 2](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row):

| Field            | <div style={{width:'250px'}}>Назначение</div> | Примечания | Пример |
| ---------------- | -------------------------------------------- | ---------- | ------ |
| `dbt_valid_from` | Временная метка, когда эта строка snapshot была впервые вставлена и стала валидной. | Значение зависит от конфигурации [`strategy`](/reference/resource-configs/strategy). | `snapshot_meta_column_names: {dbt_valid_from: start_date}` |
| `dbt_valid_to`   | Временная метка, когда эта строка перестает быть валидной. |  | `snapshot_meta_column_names: {dbt_valid_to: end_date}` |
| `dbt_scd_id`     | Уникальный ключ, сгенерированный для каждой строки snapshot. | Используется dbt внутренне. | `snapshot_meta_column_names: {dbt_scd_id: scd_id}` |
| `dbt_updated_at` | Значение `updated_at` исходной записи на момент вставки этой строки snapshot. | Используется dbt внутренне. | `snapshot_meta_column_names: {dbt_updated_at: modified_date}` |
| `dbt_is_deleted` | Строковое значение, указывающее, была ли запись удалена (`True` — удалена, `False` — не удалена). | Добавляется, когда настроен `hard_deletes='new_record'`. | `snapshot_meta_column_names: {dbt_is_deleted: is_deleted}` |

Все эти имена колонок можно настроить с помощью конфигурации `snapshot_meta_column_names`. Подробнее см. в разделе [Пример](#example).

:::warning  

Чтобы избежать непреднамеренных изменений данных, dbt **не** применяет переименование колонок автоматически. Поэтому, если пользователь задает конфигурацию `snapshot_meta_column_names` для snapshot, не обновив существующую таблицу, возникнет ошибка. Мы рекомендуем либо использовать эти настройки только для новых snapshot, либо заранее выполнить обновление существующих таблиц перед фиксацией изменения имен колонок.

:::

## Как вычисляется [`dbt_scd_id`](/reference/resource-configs/snapshot_meta_column_names#default) {#how-dbtscdid-is-calculated}

`dbt_scd_id` — это уникальный идентификатор, генерируемый для каждой строки snapshot. dbt использует его для определения изменений в исходных записях и управления версионированием в snapshot на основе медленно изменяющихся измерений (SCD).

Макрос snapshot в dbt обрабатывает `dbt_scd_id` в [репозитории dbt-adapters](https://github.com/dbt-labs/dbt-adapters/blob/b12c9870d6134905ab09bfda609ce8f81bc4b40a/dbt/include/global_project/macros/materializations/snapshots/strategies.sql#L38).

Хеш вычисляется путем конкатенации значений [`unique_key`](/reference/resource-configs/unique_key) snapshot и либо временной метки `updated_at` (для стратегии timestamp), либо значений из `check_cols` (для стратегии check). Затем полученная строка хешируется с помощью функции `md5`. Это позволяет dbt отслеживать, изменилось ли содержимое строки между запусками.

Ниже приведен пример пользовательского вычисления хеша, который объединяет несколько полей в одну строку и хеширует результат с помощью `md5`.

```sql
md5(
  coalesce(cast(unique_key1 as string), '') || '|' ||
  coalesce(cast(unique_key2 as string), '') || '|' ||
  coalesce(cast(updated_at as string), '')
)
```

Точный набор полей, участвующих в хеше, зависит от стратегии snapshot:

- [Стратегия `timestamp`](/reference/resource-configs/strategy#use-the-timestamp-strategy): хеш, как правило, объединяет колонки [`unique_key`](/reference/resource-configs/unique_key) и значение `updated_at`.
- [Стратегия `check`](/reference/resource-configs/strategy#use-the-check-strategy): хеш объединяет колонки `unique_key` и значения колонок, перечисленных в [`check_cols`](/reference/resource-configs/check_cols).

Если вы не хотите использовать `md5`, можно переопределить [dispatched macro](https://github.com/dbt-labs/dbt-adapters/blob/4b3966efc50b1d013907a88bee4ab8ebd022d17a/dbt-adapters/src/dbt/include/global_project/macros/materializations/snapshots/strategies.sql#L42-L47).

## Пример {#example}

<File name='snapshots/schema.yml'>

```yaml
snapshots:
  - name: orders_snapshot
    relation: ref("orders")
    config:
      unique_key: id
      strategy: check
      check_cols: all
      hard_deletes: new_record
      snapshot_meta_column_names:
        dbt_valid_from: start_date
        dbt_valid_to: end_date
        dbt_scd_id: scd_id
        dbt_updated_at: modified_date
        dbt_is_deleted: is_deleted
```

</File>

В результате таблица snapshot содержит настроенные имена мета-колонок:

| id | scd_id               |        modified_date |           start_date |             end_date | is_deleted |
| -- | -------------------- | -------------------- | -------------------- | -------------------- | ---------- |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-02 ...       | 2024-10-02 ...       | 2024-10-03 ...       | False      |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-03 ...       | 2024-10-03 ...       |                      | True       |
|  2 | b1885d098f8bcff51... | 2024-10-02 ...       | 2024-10-02 ...       |                      | False      |
