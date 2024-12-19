---
title: "Файл JSON с результатами выполнения"
sidebar_label: "Результаты выполнения"
---

**Текущая схема**: [`v5`](https://schemas.getdbt.com/dbt/run-results/v5/index.html)

**Сгенерировано с помощью:**
[`build`](/reference/commands/build)  
[`compile`](/reference/commands/compile)  
[`docs generate`](/reference/commands/cmd-docs)  
[`run`](/reference/commands/run)  
[`seed`](/reference/commands/seed)  
[`snapshot`](/reference/commands/snapshot)  
[`test`](/reference/commands/test)  
[`run-operation`](/reference/commands/run-operation)  

Этот файл содержит информацию о завершенном вызове dbt, включая информацию о времени и статусе для каждого узла (модель, тест и т.д.), который был выполнен. В совокупности несколько `run_results.json` могут быть объединены для расчета среднего времени выполнения модели, коэффициента неудач тестов, количества изменений записей, зафиксированных снимками и т.д.

Обратите внимание, что в результатах выполнения отображаются только выполненные узлы. Если у вас есть несколько шагов выполнения или тестирования с различными критериями, каждый из них будет генерировать разные результаты выполнения.

Примечание: `dbt source freshness` создает другой артефакт, [`sources.json`](/reference/artifacts/sources-json), с аналогичными атрибутами.

### Ключи верхнего уровня

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `args`: Словарь аргументов, переданных в команду CLI или метод RPC, который создал этот артефакт. Наиболее полезным является `which` (команда) или `rpc_method`. Этот словарь исключает нулевые значения и включает значения по умолчанию, если они не равны нулю. Эквивалентно [`invocation_args_dict`](/reference/dbt-jinja-functions/flags#invocation_args_dict) в контексте dbt-Jinja.
- `elapsed_time`: Общее время вызова в секундах.
- `results`: Массив деталей выполнения узлов.

Каждая запись в `results` является [`объектом Result`](/reference/dbt-classes#result-objects) с одним отличием: вместо включения всего объекта `node` включен только `unique_id`. (Полный объект `node` записывается в [`manifest.json`](/reference/artifacts/manifest-json).)

- `unique_id`: Уникальный идентификатор узла, который сопоставляет результаты с `nodes` в [манифесте](/reference/artifacts/manifest-json)
- `status`: Интерпретация dbt успеха, неудачи или ошибки выполнения
- `thread_id`: Какой поток выполнил этот узел? Например, `Thread-1`
- `execution_time`: Общее время, затраченное на выполнение этого узла
- `timing`: Массив, который разбивает время выполнения на этапы (часто `compile` + `execute`)
- `message`: Как dbt будет сообщать этот результат в CLI, основываясь на информации, возвращенной из базы данных

import RowsAffected from '/snippets/_run-result.md';

<RowsAffected/>

<!-- этот фрагмент взят из https://github.com/dbt-labs/docs.getdbt.com/tree/current/website/snippets/_run-result-->

Файл run_results.json включает три атрибута, относящихся к состоянию `applied`, которые дополняют `unique_id`:

- `compiled`: Логическое значение статуса компиляции узла (`False` после разбора, но `True` после компиляции).
- `compiled_code`: Сформированная строка кода, который был скомпилирован (пустая после разбора, но полная строка после компиляции).
- `relation_name`: Полностью квалифицированное имя объекта, который был (или будет) создан/обновлен в базе данных.

Продолжайте искать дополнительную информацию о `logical` состоянии узлов, используя полный объект узла в manifest.json через `unique_id`.

## Примеры

Вот несколько примеров и соответствующий вывод в файл `run_results.json`.

### Результаты компиляции модели

Предположим, у вас есть модель, которая выглядит так:

<File name='models/my_model.sql'>

```sql
select {{ dbt.current_timestamp() }} as created_at
```

</File>

Скомпилируйте модель:

```shell
dbt compile -s my_model
```

Вот фрагмент из `run_results.json`:

```json
    {
      "status": "success",
      "timing": [
        {
          "name": "compile",
          "started_at": "2023-10-12T16:35:28.510434Z",
          "completed_at": "2023-10-12T16:35:28.519086Z"
        },
        {
          "name": "execute",
          "started_at": "2023-10-12T16:35:28.521633Z",
          "completed_at": "2023-10-12T16:35:28.521641Z"
        }
      ],
      "thread_id": "Thread-2",
      "execution_time": 0.0408780574798584,
      "adapter_response": {},
      "message": null,
      "failures": null,
      "unique_id": "model.my_project.my_model",
      "compiled": true,
      "compiled_code": "select now() as created_at",
      "relation_name": "\"postgres\".\"dbt_dbeatty\".\"my_model\""
    }
```

### Запуск общих тестов данных

Используйте конфигурацию [`store_failures_as`](/reference/resource-configs/store_failures_as), чтобы хранить неудачи только для одного теста данных в базе данных:

<File name='models/_models.yml'>

```yaml
models:
  - name: my_model
    columns:
      - name: created_at
        tests:
          - not_null:
              config:
                store_failures_as: view
          - unique:
              config:
                store_failures_as: ephemeral
```

</File>

Запустите встроенный тест `unique` и сохраните неудачи в виде таблицы:

```shell
dbt test -s my_model
```

Вот фрагмент из `run_results.json`:

```json
  "results": [
    {
      "status": "pass",
      "timing": [
        {
          "name": "compile",
          "started_at": "2023-10-12T17:20:51.279437Z",
          "completed_at": "2023-10-12T17:20:51.317312Z"
        },
        {
          "name": "execute",
          "started_at": "2023-10-12T17:20:51.319812Z",
          "completed_at": "2023-10-12T17:20:51.441967Z"
        }
      ],
      "thread_id": "Thread-2",
      "execution_time": 0.1807551383972168,
      "adapter_response": {
        "_message": "SELECT 1",
        "code": "SELECT",
        "rows_affected": 1
      },
      "message": null,
      "failures": 0,
      "unique_id": "test.my_project.unique_my_model_created_at.a9276afbbb",
      "compiled": true,
      "compiled_code": "\n    \n    \n\nselect\n    created_at as unique_field,\n    count(*) as n_records\n\nfrom \"postgres\".\"dbt_dbeatty\".\"my_model\"\nwhere created_at is not null\ngroup by created_at\nhaving count(*) > 1\n\n\n",
      "relation_name": null
    },
    {
      "status": "pass",
      "timing": [
        {
          "name": "compile",
          "started_at": "2023-10-12T17:20:51.274049Z",
          "completed_at": "2023-10-12T17:20:51.295237Z"
        },
        {
          "name": "execute",
          "started_at": "2023-10-12T17:20:51.296361Z",
          "completed_at": "2023-10-12T17:20:51.491327Z"
        }
      ],
      "thread_id": "Thread-1",
      "execution_time": 0.22345590591430664,
      "adapter_response": {
        "_message": "SELECT 1",
        "code": "SELECT",
        "rows_affected": 1
      },
      "message": null,
      "failures": 0,
      "unique_id": "test.my_project.not_null_my_model_created_at.9b412fbcc7",
      "compiled": true,
      "compiled_code": "\n    \n    \n\n\n\nselect *\nfrom \"postgres\".\"dbt_dbeatty\".\"my_model\"\nwhere created_at is null\n\n\n",
      "relation_name": "\"postgres\".\"dbt_dbeatty_dbt_test__audit\".\"not_null_my_model_created_at\""
    }
  ],
```