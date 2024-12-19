---
resource_types: [tests]
id: "store_failures_as"
---

Для типа ресурса `test`, `store_failures_as` является необязательной конфигурацией, которая определяет, как должны храниться сбои тестов в базе данных. Если также настроен [`store_failures`](/reference/resource-configs/store_failures), то `store_failures_as` имеет приоритет.

Поддерживаются три значения:

- `ephemeral` &mdash; ничего не сохраняется в базе данных (по умолчанию)
- `table` &mdash; сбои тестов сохраняются в виде таблицы базы данных
- `view` &mdash; сбои тестов сохраняются в виде представления базы данных

Вы можете настроить это во всех тех же местах, что и `store_failures`, включая одиночные тесты (.sql файлы), общие тесты (.yml файлы) и dbt_project.yml.

### Примеры

#### Одиночный тест

[Одиночный тест](https://docs.getdbt.com/docs/build/data-tests#singular-data-tests) в файле `tests/singular/check_something.sql`

```sql
{{ config(store_failures_as="table") }}

-- пользовательский одиночный тест
select 1 as id
where 1=0
```

#### Общий тест

[Общие тесты](https://docs.getdbt.com/docs/build/data-tests#generic-data-tests) в файле `models/_models.yml`

```yaml
models:
  - name: my_model
    columns:
      - name: id
        tests:
          - not_null:
              config:
                store_failures_as: view
          - unique:
              config:
                store_failures_as: ephemeral
```

#### Уровень проекта

Конфигурация в `dbt_project.yml`

```yaml
name: "my_project"
version: "1.0.0"
config-version: 2
profile: "sandcastle"

tests:
  my_project:
    +store_failures_as: table
    my_subfolder_1:
      +store_failures_as: view
    my_subfolder_2:
      +store_failures_as: ephemeral
```

### Конфигурации "перекрытия"

Как и в большинстве других конфигураций, `store_failures_as` "перекрывается" при иерархическом применении. Каждый раз, когда доступно более специфичное значение, оно полностью заменяет менее специфичное значение.

Дополнительные ресурсы:

- [Конфигурации тестов данных](/reference/data-test-configs#related-documentation)
- [Конфигурации, специфичные для тестов данных](/reference/data-test-configs#test-data-specific-configurations)
- [Настройка директорий моделей в dbt_project.yml](/reference/model-configs#configuring-directories-of-models-in-dbt_projectyml)
- [Наследование конфигураций](/reference/configs-and-properties#config-inheritance)