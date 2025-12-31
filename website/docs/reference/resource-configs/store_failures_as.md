---
resource_types: [tests]
id: "store_failures_as"
---

Для типа ресурса `test`, `store_failures_as` — это необязательная конфигурация, которая определяет, как сбои тестов должны сохраняться в базе данных. Если также настроен параметр [`store_failures`](/reference/resource-configs/store_failures), то `store_failures_as` имеет приоритет.

Поддерживаются три значения:

- `ephemeral` &mdash; ничего не сохраняется в базе данных (по умолчанию)
- `table` &mdash; сбои тестов сохраняются в виде таблицы базы данных
- `view` &mdash; сбои тестов сохраняются в виде представления базы данных

Вы можете настроить это в тех же местах, что и `store_failures`, включая одиночные тесты (.sql файлы), общие тесты (.yml файлы) и dbt_project.yml.

### Примеры {#examples}

#### Одиночный тест {#singular-test}

[Singular test](/docs/build/data-tests#singular-data-tests) в файле `tests/singular/check_something.sql`

```sql
{{ config(store_failures_as="table") }}

-- пользовательский одиночный тест
select 1 as id
where 1=0
```

#### Общий тест {#generic-test}

[Generic tests](/docs/build/data-tests#generic-data-tests) в файле `models/_models.yml`

```yaml
models:
  - name: my_model
    columns:
      - name: id
        data_tests:
          - not_null:
              config:
                store_failures_as: view
          - unique:
              config:
                store_failures_as: ephemeral
```

#### Уровень проекта {#project-level}

Конфигурация в `dbt_project.yml`

```yaml
name: "my_project"
version: "1.0.0"
config-version: 2
profile: "sandcastle"

data_tests:
  my_project:
    +store_failures_as: table
    my_subfolder_1:
      +store_failures_as: view
    my_subfolder_2:
      +store_failures_as: ephemeral
```

### "Замещение" конфигураций {#clobbering-configs}

Как и в большинстве других конфигураций, `store_failures_as` "замещается" при иерархическом применении. Всякий раз, когда доступно более конкретное значение, оно полностью заменяет менее конкретное значение.

Дополнительные ресурсы:

- [Конфигурации тестов данных](/reference/data-test-configs#related-documentation)
- [Конфигурации, специфичные для тестов данных](/reference/data-test-configs#test-data-specific-configurations)
- [Настройка директорий моделей в dbt_project.yml](/reference/model-configs#configuring-directories-of-models-in-dbt_projectyml)
- [Наследование конфигураций](/reference/define-configs#config-inheritance)
