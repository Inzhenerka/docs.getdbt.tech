---
title: "Настройка `severity` теста"
id: "severity"
description: "Вы можете использовать пороги ошибок для настройки серьезности результатов тестов и определения, когда следует выдавать ошибку или предупреждение на основе количества неудачных тестов."
resource_types: [tests]
datatype: string
---

Тесты возвращают количество неудач — чаще всего это количество строк, возвращаемых запросом теста, но это может быть и [пользовательский расчет](/reference/resource-configs/fail_calc). Как правило, если количество неудач не равно нулю, тест возвращает ошибку. Это логично, так как тестовые запросы предназначены для возврата всех строк, которые вы _не_ хотите видеть: дублирующиеся записи, нулевые значения и т.д.

Можно настроить тесты так, чтобы они возвращали предупреждения вместо ошибок, или сделать статус теста условным в зависимости от количества неудач. Возможно, 1 дублирующая запись может считаться предупреждением, но 10 дублирующих записей должны считаться ошибкой.

Соответствующие настройки:
- `severity`: `error` или `warn` (по умолчанию: `error`)
- `error_if`: условное выражение (по умолчанию: `!=0`)
- `warn_if`: условное выражение (по умолчанию: `!=0`)

Условные выражения могут быть любой логикой сравнения, поддерживаемой вашим SQL-синтаксисом с целым числом неудач: `> 5`, `= 0`, `between 5 and 10` и так далее.

Вот как это работает на практике:
- Если `severity: error`, dbt сначала проверит условие `error_if`. Если условие ошибки выполнено, тест возвращает ошибку. Если оно не выполнено, dbt затем проверит условие `warn_if` (по умолчанию `!=0`). Если оно не указано или условие предупреждения выполнено, тест выдает предупреждение; если не выполнено, тест проходит.
- Если `severity: warn`, dbt полностью пропустит условие `error_if` и сразу перейдет к условию `warn_if`. Если условие предупреждения выполнено, тест выдает предупреждение; если не выполнено, тест проходит.

Обратите внимание, что статусы предупреждений теста будут возвращать ошибки, если передан флаг [`--warn-error`](/reference/global-configs/warnings). Если dbt не указано обрабатывать предупреждения как ошибки, тест с серьезностью `warn` никогда не вернет ошибку.

<Tabs
  defaultValue="generic"
  values={[
    { label: 'Готовые универсальные тесты', value: 'generic', },
    { label: 'Единичные тесты', value: 'singular', },
    { label: 'Пользовательские универсальные тесты', value: 'custom-generic', },
    { label: 'Уровень проекта', value: 'project', },
  ]
}>

<TabItem value="generic">

Настройка конкретного экземпляра готового универсального теста:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: large_table
    columns:
      - name: slightly_unreliable_column
        tests:
          - unique:
              config:
                severity: error
                error_if: ">1000"
                warn_if: ">10"
```

</File>

</TabItem>

<TabItem value="singular">

Настройка единичного теста:

<File name='tests/<filename>.sql'>

```sql
{{ config(error_if = '>50') }}

select ...
```

</File>

</TabItem>

<TabItem value="custom-generic">

Установка значения по умолчанию для всех экземпляров пользовательского универсального теста, путем настройки внутри блока теста (определение):

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(severity = 'warn') }}

select ...

{% endtest %}
```

</File>

</TabItem>

<TabItem value="project">

Установка значения по умолчанию для всех тестов в пакете или проекте:

<File name='dbt_project.yml'>

```yaml
tests:
  +severity: warn  # все тесты

  <package_name>:
    +warn_if: >10 # тесты в <package_name>
```

</File>

</TabItem>

</Tabs>