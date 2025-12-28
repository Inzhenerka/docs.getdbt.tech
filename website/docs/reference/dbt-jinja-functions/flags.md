---
title: "О переменной flags"
sidebar_label: "flags"
id: "flags"
description: "Переменная `flags` содержит значения флагов, предоставленных в командной строке."
---

Переменная `flags` содержит значения флагов, предоставленных в командной строке.

__Пример использования:__

<File name='flags.sql'>

```sql
{% if flags.FULL_REFRESH %}
drop table ...
{% else %}
-- no-op
{% endif %}
```

</File>

Список доступных флагов определен в [модуле `flags`](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/flags.py) в `dbt-core`.

Рекомендуемые случаи использования включают:
- различную логику <Term id="materialization" /> на основе "режимов выполнения", таких как `flags.FULL_REFRESH` и `flags.STORE_FAILURES`
- условное выполнение хуков на основе текущей команды/типа задачи через `flags.WHICH`

**Примечание:** Не рекомендуется использовать флаги в качестве входных данных для конфигураций, свойств или зависимостей, обрабатываемых на этапе парсинга (`ref` + `source`). Флаги, вероятно, будут изменяться при каждом вызове dbt, и их обработанные значения станут устаревшими (и приведут к неверным результатам) в последующих вызовах с включенным частичным парсингом. Для получения более подробной информации см. [документацию по парсингу](/reference/parsing).

### invocation_args_dict

Для полного набора информации, передаваемой из CLI — подкоманда, флаги, аргументы — вы можете использовать `invocation_args_dict`. Это эквивалентно словарю `args` в [`run_results.json`](/reference/artifacts/run-results-json).

<File name='models/my_model.sql'>

```sql
-- invocation_args_dict:
-- {{ invocation_args_dict }}

-- dbt_metadata_envs:
-- {{ dbt_metadata_envs }}

select 1 as id
```

</File>

Ключ `invocation_command` в `invocation_args_dict` включает всю подкоманду при компиляции:

```shell
$ DBT_ENV_CUSTOM_ENV_MYVAR=myvalue dbt compile -s my_model

12:10:22  Running with dbt=1.6.0-b8
12:10:22  Registered adapter: postgres=1.6.0-b8
12:10:22  Found 1 seed, 1 model, 349 macros
12:10:22
12:10:22  Concurrency: 5 threads (target='dev')
12:10:22
12:10:22  Compiled node 'my_model' is:
-- invocation_args_dict:
-- {'log_format_file': 'debug', 'log_level': 'info', 'exclude': (), 'send_anonymous_usage_stats': True, 'which': 'compile', 'defer': False, 'output': 'text', 'log_format': 'default', 'macro_debugging': False, 'populate_cache': True, 'static_parser': True, 'vars': {}, 'warn_error_options': WarnErrorOptions(include=[], exclude=[]), 'quiet': False, 'select': ('my_model',), 'indirect_selection': 'eager', 'strict_mode': False, 'version_check': False, 'enable_legacy_logger': False, 'log_path': '/Users/jerco/dev/scratch/testy/logs', 'profiles_dir': '/Users/jerco/.dbt', 'invocation_command': 'dbt compile -s my_model', 'log_level_file': 'debug', 'project_dir': '/Users/jerco/dev/scratch/testy', 'favor_state': False, 'use_colors_file': True, 'write_json': True, 'partial_parse': True, 'printer_width': 80, 'print': True, 'cache_selected_only': False, 'use_colors': True, 'introspect': True}

-- dbt_metadata_envs:
-- {'MYVAR': 'myvalue'}

select 1 as id
```

## flags.WHICH

`flags.WHICH` — это глобальная переменная, которая устанавливается при выполнении команды dbt. При использовании в макросе она позволяет условно изменять поведение в зависимости от команды, которая выполняется в данный момент. Например, условно изменяя SQL:

```sql
{% macro conditional_filter(table_name) %}
    {# Add a WHERE clause only during `dbt run`, not during `dbt test` or `dbt compile` #}

    select *
    from {{ table_name }}
    {% if flags.WHICH == "run" %}
        where is_active = true
    {% elif flags.WHICH == "test" %}
        -- In test runs, restrict rows to keep tests fast
        limit 10
    {% elif flags.WHICH == "compile" %}
        -- During compile, just add a harmless comment
        -- compile mode detected
    {% endif %}
{% endmacro %}
```

Поддерживаются следующие команды:

| `flags.WHICH` value | Описание                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| "build"           | Сборка и тестирование всех выбранных ресурсов.                                 |
| "clean"           | Удаление артефактов, таких как каталог target и пакеты.                 |
| "clone"           | Клонирование моделей и других ресурсов.                                                      |
| "compile"         | Компиляция SQL без выполнения.                                     |
| "debug"           | Проверка подключений и валидация конфигураций.                                 |
| "deps"            | Загрузка зависимостей пакетов.                                          |
| "docs"            | Генерация и публикация документации.                                         |
| "environment"     | Команды окружения рабочего пространства (cloud CLI).                      |
| "help"            | Отображение справки по командам и подкомандам.                                    |
| "init"            | Инициализация нового проекта.                                                |
| "invocation"      | Взаимодействие с текущим вызовом или его инспекция (cloud CLI). |
| "list"            | Вывод списка ресурсов.                                              |
| "parse"           | Разбор проекта и сообщение об ошибках без сборки/тестирования.                 |
| "retry"           | Повтор последнего вызова с места сбоя.                   |
| "run"             | Выполнение моделей.                                                          |
| "run-operation"   | Вызов произвольных макросов или SQL-операций.                            |
| "seed"            | Загрузка CSV-файлов в базу данных.                                          |
| "show"            | Просмотр определений ресурсов или материализаций.                       |
| "snapshot"        | Выполнение снапшотов.                                                  |
| "source"          | Проверка свежести и просмотр определений источников.                       |
| "test"            | Схемные и тесты данных.                                                    |
| "version"         | Отображение версии dbt.                                                 |



