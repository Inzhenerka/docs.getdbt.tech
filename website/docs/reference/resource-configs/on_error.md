---
title: on_error
description: "Используйте конфигурацию `on_error`, чтобы управлять пропуском нижестоящих моделей при сбое модели."
id: "on_error"
resource_types: [models]
datatype: string
---

<VersionCallout version="1.12" /> 

# on_error

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация SQL', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)on_error: skip_children | continue
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
models:
  - name: [<model-name>]
    config:
      on_error: skip_children | continue
```

</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

```sql
{{ config(
    on_error="skip_children" | "continue"
) }}
```

</File>

</TabItem>

</Tabs>

## Определение

Конфигурация `on_error` определяет, что происходит с нижестоящими (дочерними) моделями, если во время запуска модель завершается с ошибкой. Эта конфигурация применяется только к моделям и не влияет на тесты. Чтобы управлять выполнением нижестоящих моделей после сбоя теста, используйте конфигурацию [`severity`](/reference/resource-configs/severity) для тестов.

`on_error` принимает два значения:

- `skip_children` (по умолчанию): все нижестоящие модели пропускаются, если модель завершается с ошибкой.
- `continue`: нижестоящие модели продолжают выполняться, если модель завершается с ошибкой, а не пропускаются.

## Пример

Задайте `on_error: continue`, если нижестоящие модели могут корректно выполняться даже при сбое вышестоящей модели (например, если в них предусмотрена резервная логика или используются независимые источники данных).

<File name='models/my_model.sql'>

```sql
{{ config(
    materialized='table',
    on_error='continue'
) }}

select 1 as id
```

</File>

Если для модели, завершившейся с ошибкой, задано `on_error: continue`, dbt выполняет нижестоящие модели, а не пропускает их. Модель, завершившаяся с ошибкой, по-прежнему отмечается как ошибочная в результатах запуска, а сам запуск считается неудачным, даже если все нижестоящие модели выполнены успешно.

Флаг [`--fail-fast`](/reference/global-configs/failing-fast) имеет приоритет над `on_error: continue`. Если задан `--fail-fast`, dbt останавливается при первом сбое и пропускает все оставшиеся модели независимо от их конфигурации `on_error`. 

## Поведение при наличии нескольких вышестоящих моделей

Если у модели несколько вышестоящих моделей, `skip_children` имеет приоритет над `continue`. Если хотя бы одна из вышестоящих моделей, завершившихся с ошибкой, использует `skip_children`, нижестоящая модель пропускается &mdash; даже если другие вышестоящие модели, завершившиеся с ошибкой, используют `continue`.

Например, рассмотрим DAG, в котором `model_c` зависит и от `model_a`, и от `model_b`:

- `model_a` использует `on_error: skip_children`
- `model_b` использует `on_error: continue`

В следующей таблице показано поведение `model_c` в зависимости от результатов выполнения вышестоящих моделей:

<SimpleTable>

| Результат `model_a` (`skip_children`) | Результат `model_b` (`continue`) | Поведение `model_c` |
|---|---|---|
| Успешно | Успешно | Выполняется |
| Ошибка | Успешно | Пропускается |
| Успешно | Ошибка | Выполняется |
| Ошибка | Ошибка | Пропускается |

</SimpleTable>
<br/>

Если `model_a` завершается с ошибкой, `model_c` всегда пропускается, поскольку `model_a` использует `skip_children`. Если с ошибкой завершается только `model_b`, `model_c` всё равно выполняется, поскольку `model_b` использует `continue`, что не блокирует выполнение нижестоящих моделей.
