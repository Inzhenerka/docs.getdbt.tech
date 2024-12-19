---
title: "Поддерживаемые форматы данных для модульных тестов"
sidebar_label: "Форматы данных"
---

В настоящее время для создания тестовых данных для модульного тестирования в dbt поддерживаются три формата:

- `dict` (по умолчанию): Встроенные значения словаря.
- `csv`: Встроенные значения CSV или файл CSV.
- `sql`: Встроенный SQL-запрос или файл SQL. Примечание: Для этого формата необходимо предоставить тестовые данные для _всех строк_.

## dict

Формат данных `dict` является форматом по умолчанию, если не задан `format`.

`dict` требует встроенный словарь для `rows`:

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: dict
        rows:
          - {id: 1, name: gerda}
          - {id: 2, b: michelle}    

```

## csv

При использовании формата `csv` вы можете использовать либо встроенную строку CSV для `rows`:

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: csv
        rows: |
          id,name
          1,gerda
          2,michelle

```

Или вы можете указать имя файла CSV в директории `tests/fixtures` (или в настроенной директории `test-paths`) вашего проекта для `fixture`: 

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: csv
        fixture: my_model_a_fixture

```

## sql

Использование этого формата:
- Обеспечивает большую гибкость для типов данных, которые вы можете тестировать
- Позволяет тестировать модель, которая зависит от эфемерной модели

Однако при использовании `format: sql` необходимо предоставить тестовые данные для _всех строк_.

При использовании формата `sql` вы можете использовать либо встроенный SQL-запрос для `rows`:

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: sql
        rows: |
          select 1 as id, 'gerda' as name, null as loaded_at union all
          select 2 as id, 'michelle', null as loaded_at as name

```

Или вы можете указать имя файла SQL в директории `tests/fixtures` (или в настроенной директории `test-paths`) вашего проекта для `fixture`: 

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: sql
        fixture: my_model_a_fixture

```

**Примечание:** Jinja не поддерживается в SQL-файлах для модульных тестов.