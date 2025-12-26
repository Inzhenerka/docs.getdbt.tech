## Описание

<VersionCallout version="1.9" />

## По умолчанию

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

| Поле            | Значение | Примечания |
| --------------- | -------- | ---------- |
| `dbt_valid_from` | Временная метка, когда эта строка снимка была впервые вставлена и стала действительной. | Значение зависит от [`стратегии`](/reference/resource-configs/strategy). |
| `dbt_valid_to`   | Временная метка, когда эта строка больше не действительна. |  |
| `dbt_scd_id`     | Уникальный ключ, сгенерированный для каждой строки снимка. | Используется внутренне dbt. |
| `dbt_updated_at` | Временная метка `updated_at` исходной записи, когда эта строка снимка была вставлена. | Используется внутренне dbt. |
| `dbt_is_deleted` | Логическое значение, указывающее, была ли запись удалена. `True`, если удалена, `False` в противном случае. | Добавляется, когда настроено `hard_deletes='new_record'`. |

## Description

Чтобы привести имена колонок в соответствие с принятыми в организации соглашениями об именовании, можно использовать конфигурацию `snapshot_meta_column_names`. Она позволяет настраивать названия [метаданных колонок](/docs/build/snapshots#snapshot-meta-fields) внутри каждого snapshot.

## Default

По умолчанию snapshots в dbt используют следующие имена колонок для отслеживания истории изменений с помощью записей [медленно изменяющегося измерения типа 2 (Type 2 SCD)](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row):

| Field              | <div style={{width:'250px'}}>Значение</div> | Notes | Example |
| ------------------ | ------------------------------------------ | ----- | ------- |
| `dbt_valid_from`   | Временная метка, когда эта строка snapshot была впервые вставлена и стала валидной. | Значение зависит от конфигурации [`strategy`](/reference/resource-configs/strategy). | `snapshot_meta_column_names: {dbt_valid_from: start_date}` |
| `dbt_valid_to`     | Временная метка, когда эта строка перестает быть валидной. |  | `snapshot_meta_column_names: {dbt_valid_to: end_date}` |
| `dbt_scd_id`       | Уникальный ключ, сгенерированный для каждой строки snapshot. | Используется dbt для внутренних целей. | `snapshot_meta_column_names: {dbt_scd_id: scd_id}` |
| `dbt_updated_at`   | Временная метка `updated_at` исходной записи на момент вставки этой строки snapshot. | Используется dbt для внутренних целей. | `snapshot_meta_column_names: {dbt_updated_at: modified_date}` |
| `dbt_is_deleted`   | Строковое значение, указывающее, была ли запись удалена (`True` — удалена, `False` — не удалена). | Добавляется, если настроен `hard_deletes='new_record'`. | `snapshot_meta_column_names: {dbt_is_deleted: is_deleted}` |

Все эти имена колонок можно переопределить с помощью конфигурации `snapshot_meta_column_names`. Подробнее см. в разделе [Example](#example).

:::warning  

Чтобы избежать непреднамеренного изменения данных, dbt **не** будет автоматически применять переименования столбцов. Поэтому, если пользователь применяет конфигурацию `snapshot_meta_column_names` для снимка без обновления уже существующей таблицы, он получит ошибку. Мы рекомендуем либо использовать эти настройки только для новых снимков, либо организовать обновление уже существующих таблиц перед внесением изменений в имена столбцов.

:::

## Как рассчитывается [`dbt_scd_id`](/reference/resource-configs/snapshot_meta_column_names#default)

`dbt_scd_id` — это уникальный идентификатор, который генерируется для каждой строки в snapshot. dbt использует этот идентификатор, чтобы обнаруживать изменения в исходных записях и управлять версионированием в snapshot’ах медленно изменяющихся измерений (SCD).

Логика работы с `dbt_scd_id` реализована в snapshot‑макросе dbt в репозитории [dbt-adapters](https://github.com/dbt-labs/dbt-adapters/blob/b12c9870d6134905ab09bfda609ce8f81bc4b40a/dbt/include/global_project/macros/materializations/snapshots/strategies.sql#L38).

Хеш вычисляется путём конкатенации значений [`unique_key`](/reference/resource-configs/unique_key) snapshot’а и либо значения временной метки `updated_at` (для стратегии `timestamp`), либо значений колонок из `check_cols` (для стратегии `check`). Затем получившаяся строка хешируется с помощью функции `md5`. Это позволяет dbt отслеживать, изменилось ли содержимое строки между запусками.

Ниже приведён пример пользовательского расчёта хеша, который объединяет несколько полей в одну строку и хеширует результат с помощью `md5`:

```sql
md5(
  coalesce(cast(unique_key1 as string), '') || '|' ||
  coalesce(cast(unique_key2 as string), '') || '|' ||
  coalesce(cast(updated_at as string), '')
)
```

Точный набор полей, включаемых в хеш, зависит от стратегии snapshot’а:

- [Стратегия `timestamp`](/reference/resource-configs/strategy#use-the-timestamp-strategy): хеш обычно объединяет колонки [`unique_key`](/reference/resource-configs/unique_key) и значение `updated_at`.
- [Стратегия `check`](/reference/resource-configs/strategy#use-the-check-strategy): хеш объединяет колонки `unique_key` и значения колонок, перечисленных в [`check_cols`](/reference/resource-configs/check_cols).

Если вы не хотите использовать `md5`, вы можете настроить соответствующий [dispatched macro](https://github.com/dbt-labs/dbt-adapters/blob/4b3966efc50b1d013907a88bee4ab8ebd022d17a/dbt-adapters/src/dbt/include/global_project/macros/materializations/snapshots/strategies.sql#L42-L47).

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