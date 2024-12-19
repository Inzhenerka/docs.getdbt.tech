---
resource_types: [snapshots]
description: "Имена мета-колонок снимков"
datatype: "{<dictionary>}"
default_value: {"dbt_valid_from": "dbt_valid_from", "dbt_valid_to": "dbt_valid_to", "dbt_scd_id": "dbt_scd_id", "dbt_updated_at": "dbt_updated_at"}
id: "snapshot_meta_column_names"
---

Доступно в dbt Core версии 1.9 и выше. Выберите версию 1.9 или новее в выпадающем списке версий, чтобы просмотреть конфигурации. Попробуйте это сейчас в [последнем релизе dbt Cloud](/docs/dbt-versions/cloud-release-tracks).

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
        dbt_is_deleted: <boolean>

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
        "dbt_is_deleted": "<boolean>",
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
      dbt_is_deleted: <boolean>
```

</File>

## Описание

Для того чтобы соответствовать наименованиям, принятым в организации, конфигурация `snapshot_meta_column_names` может быть использована для настройки имен [мета-колонок](/docs/build/snapshots#snapshot-meta-fields) в каждом снимке.

## По умолчанию

По умолчанию dbt снимки используют следующие имена колонок для отслеживания истории изменений с помощью записей [Типа 2 медленно изменяющейся размерности](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row):

| Поле          | Значение | Примечания |
| -------------- | ------- | ----- |
| `dbt_valid_from` | Временная метка, когда эта строка снимка была впервые вставлена и стала действительной. | Значение зависит от [`strategy`](/reference/resource-configs/strategy). |
| `dbt_valid_to`   | Временная метка, когда эта строка больше не действительна. |  |
| `dbt_scd_id`     | Уникальный ключ, сгенерированный для каждой строки снимка. | Используется внутренне dbt. |
| `dbt_updated_at` | Временная метка `updated_at` исходной записи, когда эта строка снимка была вставлена. | Используется внутренне dbt. |
| `dbt_is_deleted` | Булевое значение, указывающее, была ли запись удалена. `True`, если удалена, `False` в противном случае. | Добавляется, когда настроено `hard_deletes='new_record'`. |

Тем не менее, эти имена колонок могут быть настроены с помощью конфигурации `snapshot_meta_column_names`.

:::warning

Чтобы избежать непреднамеренного изменения данных, dbt **не** будет автоматически применять переименования колонок. Поэтому, если пользователь применяет конфигурацию `snapshot_meta_column_names` для снимка, не обновив существующую таблицу, он получит ошибку. Мы рекомендуем использовать эти настройки только для новых снимков или организовать обновление существующих таблиц перед внесением изменений в имена колонок.

:::

## Пример

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

В результате таблица снимка содержит настроенные имена мета-колонок:

| id | scd_id               |        modified_date |           start_date |             end_date | is_deleted |
| -- | -------------------- | -------------------- | -------------------- | -------------------- | ---------- |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-02 ...       | 2024-10-02 ...       | 2024-10-03 ...       | False      |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-03 ...       | 2024-10-03 ...       |                      | True      |
|  2 | b1885d098f8bcff51... | 2024-10-02 ...       | 2024-10-02 ...       |                      | False     |