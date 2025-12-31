---
resource_types: [snapshots]
description: "Используйте конфигурацию `dbt_valid_to_current`, чтобы задать пользовательский индикатор для значения `dbt_valid_to` в актуальных записях снапшота"
datatype: "{<dictionary>}"
default_value: {NULL}
id: "dbt_valid_to_current"
---

<VersionCallout version="1.9" />

<File name='snapshots/schema.yml'>

```yaml
snapshots:
  - name: my_snapshot
    config:
      dbt_valid_to_current: "string"

```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{{
    config(
        unique_key='id',
        strategy='timestamp',
        updated_at='updated_at',
        dbt_valid_to_current='string'
    )
}}
```

</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +dbt_valid_to_current: "string"
```

</File>

## Description {#description}

Используйте конфигурацию `dbt_valid_to_current`, чтобы задать пользовательский индикатор для значения `dbt_valid_to` в актуальных записях снапшота (например, будущую дату). По умолчанию это значение равно `NULL`. Если параметр задан, dbt будет использовать указанное значение вместо `NULL` для поля `dbt_valid_to` у текущих записей в таблице снапшота.

Такой подход упрощает назначение пользовательской даты, использование в join-ах или выполнение фильтрации по диапазону, когда требуется дата окончания.

:::warning

Чтобы избежать непреднамеренного изменения данных, dbt _не_ будет автоматически изменять текущее значение в уже существующем столбце `dbt_valid_to`. Существующие актуальные записи по‑прежнему будут иметь `dbt_valid_to`, установленное в `NULL`.

Любые новые записи, добавленные _после_ применения конфигурации `dbt_valid_to_current`, будут иметь `dbt_valid_to`, установленное в указанное значение (например, `'9999-12-31'`), вместо значения по умолчанию `NULL`.

:::

### Considerations {#considerations}

- **Date expressions** &mdash; Указывайте жёстко заданное выражение даты, совместимое с вашей платформой данных, например `to_date('9999-12-31')`. Обратите внимание, что синтаксис может отличаться в зависимости от хранилища (например, `to_date('YYYY-MM-DD')` или `date(YYYY, MM, DD)`).

- **Jinja limitation** &mdash; `dbt_valid_to_current` принимает только статические SQL‑выражения. Jinja‑выражения (например, `{{ var('my_future_date') }}`) не поддерживаются.

- **Deferral and `state:modified`** &mdash; Изменения в `dbt_valid_to_current` совместимы с deferral и `--select state:modified`. При изменении этой конфигурации она будет попадать в выборки `state:modified`, с предупреждением о необходимости вручную выполнить соответствующие обновления снапшотов.

## Default {#default}

По умолчанию `dbt_valid_to` устанавливается в `NULL` для текущих (самых свежих) записей в таблице снапшота. Это означает, что такие записи по‑прежнему считаются актуальными и не имеют определённой даты окончания.

Если вы предпочитаете использовать конкретное значение вместо `NULL` для `dbt_valid_to` в текущих и будущих записях, вы можете использовать конфигурацию `dbt_valid_to_current`. Например, задать дату в далёком будущем — `9999-12-31`.

Значение, назначаемое `dbt_valid_to_current`, должно быть строкой, представляющей корректную дату или временную метку, в зависимости от требований вашей базы данных. Используйте выражения, которые поддерживаются вашей платформой данных.

## Impact on snapshot records {#impact-on-snapshot-records}

При задании `dbt_valid_to_current` это влияет на то, как dbt управляет столбцом `dbt_valid_to` в таблице снапшота:

- **For existing records** &mdash; Чтобы избежать непреднамеренного изменения данных, dbt _не_ будет автоматически корректировать текущее значение в уже существующем столбце `dbt_valid_to`. Существующие актуальные записи по‑прежнему будут иметь `dbt_valid_to`, установленное в `NULL`.

- **For new records** &mdash; Любые новые записи, добавленные после применения конфигурации `dbt_valid_to_current`, будут иметь `dbt_valid_to`, установленное в указанное значение (например, `'9999-12-31'`), вместо `NULL`.

Это означает, что в таблице снапшота будут текущие записи с разными значениями `dbt_valid_to`: `NULL` (из существующих данных) и новое заданное значение (из новых данных). Если вам требуется единообразие значений `dbt_valid_to` для актуальных записей, вы можете вручную обновить существующие записи в таблице снапшота (где `dbt_valid_to` равно `NULL`), чтобы они соответствовали значению `dbt_valid_to_current`.

## Example {#example}

<File name='snapshots/schema.yml'>

```yaml
snapshots:
  - name: my_snapshot
    config:
      strategy: timestamp
      updated_at: updated_at
      dbt_valid_to_current: "to_date('9999-12-31')"
    columns:
      - name: dbt_valid_from
        description: The timestamp when the record became valid.
      - name: dbt_valid_to
        description: >
          The timestamp when the record ceased to be valid. For current records,
          this is either `NULL` or the value specified in `dbt_valid_to_current`
          (like `'9999-12-31'`).
```

</File>

Итоговая таблица снапшота содержит настроенное значение в столбце `dbt_valid_to`:

| id | dbt_scd_id           |    dbt_updated_at    |       dbt_valid_from |     dbt_valid_to     |
| -- | -------------------- | -------------------- | -------------------- | -------------------- |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-02 ...       | 2024-10-02 ...       | 9999-12-31 ...       |
|  2 | b1885d098f8bcff51... | 2024-10-02 ...       | 2024-10-02 ...       | 9999-12-31 ...       |
