## Описание

Для того чтобы соответствовать соглашениям об именовании в организации, конфигурация `snapshot_meta_column_names` может быть использована для настройки имен [метаданных столбцов](/docs/build/snapshots#snapshot-meta-fields) в каждом снимке.

## По умолчанию

По умолчанию, dbt-снимки используют следующие имена столбцов для отслеживания истории изменений с использованием записей [Типа 2 медленно изменяющихся измерений](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row):

| Поле            | Значение | Примечания |
| --------------- | -------- | ---------- |
| `dbt_valid_from` | Временная метка, когда эта строка снимка была впервые вставлена и стала действительной. | Значение зависит от [`стратегии`](/reference/resource-configs/strategy). |
| `dbt_valid_to`   | Временная метка, когда эта строка больше не действительна. |  |
| `dbt_scd_id`     | Уникальный ключ, сгенерированный для каждой строки снимка. | Используется внутренне dbt. |
| `dbt_updated_at` | Временная метка `updated_at` исходной записи, когда эта строка снимка была вставлена. | Используется внутренне dbt. |
| `dbt_is_deleted` | Логическое значение, указывающее, была ли запись удалена. `True`, если удалена, `False` в противном случае. | Добавляется, когда настроено `hard_deletes='new_record'`. |

Однако, эти имена столбцов могут быть настроены с помощью конфигурации `snapshot_meta_column_names`.

:::warning

Чтобы избежать непреднамеренного изменения данных, dbt **не** будет автоматически применять переименования столбцов. Поэтому, если пользователь применяет конфигурацию `snapshot_meta_column_names` для снимка без обновления уже существующей таблицы, он получит ошибку. Мы рекомендуем либо использовать эти настройки только для новых снимков, либо организовать обновление уже существующих таблиц перед внесением изменений в имена столбцов.

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

Полученная таблица снимков содержит настроенные имена мета-столбцов:

| id | scd_id               |        modified_date |           start_date |             end_date | is_deleted |
| -- | -------------------- | -------------------- | -------------------- | -------------------- | ---------- |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-02 ...       | 2024-10-02 ...       | 2024-10-03 ...       | False      |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-03 ...       | 2024-10-03 ...       |                      | True      |
|  2 | b1885d098f8bcff51... | 2024-10-02 ...       | 2024-10-02 ...       |                      | False     |