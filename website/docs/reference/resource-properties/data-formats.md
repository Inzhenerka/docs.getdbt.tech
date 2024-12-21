---
title: "Поддерживаемые форматы данных для модульных тестов"
sidebar_label: "Форматы данных"
---

В настоящее время фиктивные данные для модульного тестирования в dbt поддерживают три формата:

- `dict` (по умолчанию): Встроенные значения словаря.
- `csv`: Встроенные значения CSV или CSV-файл.
- `sql`: Встроенный SQL-запрос или SQL-файл. Примечание: Для этого формата вы должны предоставить фиктивные данные для _всех строк_.

## dict

Формат данных `dict` используется по умолчанию, если `format` не определен.

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

Или вы можете указать имя CSV-файла в каталоге `tests/fixtures` (или в настроенном местоположении `test-paths`) вашего проекта для `fixture`:

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

Однако при использовании `format: sql` вы должны предоставить фиктивные данные для _всех строк_.

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

Или вы можете указать имя SQL-файла в каталоге `tests/fixtures` (или в настроенном местоположении `test-paths`) вашего проекта для `fixture`:

```yml

unit_tests:
  - name: test_my_model
    model: my_model
    given:
      - input: ref('my_model_a')
        format: sql
        fixture: my_model_a_fixture

```

**Примечание:** Jinja не поддерживается в SQL-фикстурах для модульных тестов.