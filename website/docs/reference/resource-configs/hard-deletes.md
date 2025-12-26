---
title: hard_deletes
resource_types: [snapshots]
description: "Используйте конфигурацию `hard_deletes`, чтобы контролировать, как удаленные строки отслеживаются в вашей таблице снимков."
datatype: "boolean"
default_value: {ignore}
id: "hard-deletes"
sidebar_label: "hard_deletes"
---

<VersionCallout version="1.9" />

<File name='snapshots/schema.yml'>

```yaml
snapshots:
  - name: <snapshot_name>
    config:
      hard_deletes: 'ignore' | 'invalidate' | 'new_record'
```
</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +hard_deletes: "ignore" | "invalidate" | "new_record"
```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{{
    config(
        unique_key='id',
        strategy='timestamp',
        updated_at='updated_at',
        hard_deletes='ignore' | 'invalidate' | 'new_record'
    )
}}
```

</File>

## Описание

## Description

Конфигурация `hard_deletes` дает вам больше контроля над тем, как обрабатывать строки, удалённые из источника. Поддерживаются следующие варианты: `ignore` (по умолчанию), `invalidate` (заменяет устаревший параметр `invalidate_hard_deletes=true`) и `new_record`. Обратите внимание, что `new_record` создаст новый служебный столбец с метаданными в таблице snapshot.

Параметр `hard_deletes` можно использовать с адаптерами dbt-postgres, dbt-bigquery, dbt-snowflake и dbt-redshift.

import HardDeletes from '/snippets/_hard-deletes.md';

<HardDeletes />

:::warning

Если вы обновляете существующий снимок для использования конфигурации `hard_deletes`, dbt _не будет_ автоматически обрабатывать миграции. Мы рекомендуем использовать эти настройки только для новых снимков или [организовать обновление](/reference/snapshot-configs#snapshot-configuration-migration) существующих таблиц перед включением этой настройки.
:::

## По умолчанию

По умолчанию, если вы не указываете `hard_deletes`, он автоматически будет установлен в `ignore`. Удаленные строки не будут отслеживаться, и их столбец `dbt_valid_to` останется `NULL`.

Конфигурация `hard_deletes` имеет три метода:

| Методы | Описание |
| --------- | ----------- |
| `ignore` (по умолчанию) | Нет действий для удаленных записей. |
| `invalidate` | Ведет себя так же, как существующая `invalidate_hard_deletes=true`, где удаленные записи аннулируются путем установки `dbt_valid_to` на текущее время. Этот метод заменяет конфигурацию `invalidate_hard_deletes`, чтобы дать вам больше контроля над тем, как обрабатывать удаленные строки из источника. |
| `new_record` | Отслеживает удаленные записи как новые строки, используя метаполе `dbt_is_deleted`, когда записи удаляются. |

## Соображения
- **Обратная совместимость**: Конфигурация `invalidate_hard_deletes` все еще поддерживается для существующих снимков, но не может использоваться вместе с `hard_deletes`.
- **Новые снимки**: Для новых снимков мы рекомендуем использовать `hard_deletes` вместо `invalidate_hard_deletes`.
- **Миграция**: Если вы переключаете существующий снимок на использование `hard_deletes` без миграции ваших данных, вы можете столкнуться с несоответствующими или некорректными результатами, такими как смешение старых и новых форматов данных.

## Пример

<File name='snapshots/schema.yml'>

```yaml
snapshots:
  - name: my_snapshot
    config:
      hard_deletes: new_record  # варианты: 'ignore', 'invalidate', или 'new_record'
      strategy: timestamp
      updated_at: updated_at
    columns:
      - name: dbt_valid_from
        description: Временная метка, когда запись стала действительной.
      - name: dbt_valid_to
        description: Временная метка, когда запись перестала быть действительной.
      - name: dbt_is_deleted
        description: Указывает, была ли запись удалена.
```

</File>

Полученная таблица снимков содержит конфигурацию `hard_deletes: new_record`. Если запись удалена и позже восстановлена, полученная таблица снимков может выглядеть следующим образом:

| id | dbt_scd_id           |   Статус | dbt_updated_at       |   dbt_valid_from    |     dbt_valid_to     | dbt_is_deleted | 
| -- | -------------------- | -----    | -------------------- | --------------------| -------------------- | ----------- |
|  1 | 60a1f1dbdf899a4dd... | pending  | 2024-10-02 ...       | 2024-05-19...       | 2024-05-20 ...       | False       | 
|  1 | b1885d098f8bcff51... | pending  | 2024-10-02 ...       | 2024-05-20 ...      | 2024-06-03 ...       | True        | 
|  1 | b1885d098f8bcff53... | shipped  | 2024-10-02 ...       | 2024-06-03 ...      |                      | False       | 
|  2 | b1885d098f8bcff55... | active   | 2024-10-02 ...       | 2024-05-19 ...      |                      | False       | 
 
В этом примере столбец `dbt_is_deleted` устанавливается в `True`, когда запись удалена. Когда запись восстанавливается, столбец `dbt_is_deleted` устанавливается в `False`.