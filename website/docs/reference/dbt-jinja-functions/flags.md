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

Список доступных флагов определён в [модуле `flags`](https://github.com/dbt-labs/dbt/blob/HEAD/crates/dbt-jinja-utils/src/flags.rs) в репозитории `dbt-labs/dbt`.

Рекомендуемые варианты использования:
- изменение логики <Term id="materialization" /> в зависимости от «режимов запуска», таких как `flags.FULL_REFRESH`, `flags.STORE_FAILURES` и `flags.EMPTY`
- условный запуск хуков в зависимости от текущей команды / типа задачи с помощью `flags.WHICH`

**Примечание:** Не рекомендуется использовать флаги в качестве входных данных для конфигураций, свойств или зависимостей, обрабатываемых на этапе парсинга (`ref` + `source`). Флаги, вероятно, будут изменяться при каждом вызове dbt, и их обработанные значения станут устаревшими (и приведут к неверным результатам) в последующих вызовах с включенным частичным парсингом. Для получения более подробной информации см. [документацию по парсингу](/reference/parsing).

<a id="invocation_args_dict" />

### invocation_args_dict {#invocationargsdict}

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

## flags.EMPTY

`flags.EMPTY` возвращает `True`, когда команде dbt передан [флаг `--empty`](/docs/build/empty-flag), и `False` в противном случае. Это полезно, когда нужно настроить логику материализации или поведение макроса в зависимости от того, выполняется ли dbt в пустом режиме (только схема).

```sql
{% macro my_custom_ref(model_name) %}
    {% if flags.EMPTY %}
        {# Return zero rows when running with --empty #}
        (select * from {{ ref(model_name) }} where 1=0)
    {% else %}
        {{ ref(model_name) }}
    {% endif %}
{% endmacro %}
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
| `"build"`           | Сборка и тестирование всех выбранных ресурсов.                                 |
| `"clean"`           | Удаление артефактов, таких как каталог target и пакеты.                 |
| `"clone"`           | Клонирование моделей и других ресурсов.                                                      |
| `"compile"`         | Компиляция SQL без выполнения.                                     |
| `"debug"`           | Проверка подключений и конфигураций.                                 |
| `"deps"`            | Загрузка зависимостей пакетов.                                          |
| `"docs"`            | Генерация документации и запуск сервера для её просмотра.                                         |
| `"environment"`     | Команды для управления окружением рабочего пространства (<Constant name="platform_cli" />).                      |
| `"help"`            | Вывод справки по командам и подкомандам.                                    |
| `"init"`            | Инициализация нового проекта.                                                |
| `"invocation"`      | Взаимодействие с текущим вызовом или просмотр сведений о нём (<Constant name="platform_cli" />). |
| `"list"`            | Вывод списка ресурсов.                                              |
| `"parse"`           | Разбор проекта и вывод ошибок без сборки и тестирования.                 |
| `"retry"`           | Повтор последнего вызова с места сбоя.                   |
| `"run"`             | Выполнение моделей.                                                          |
| `"run-operation"`   | Вызов произвольных макросов или операций SQL.                            |
| `"seed"`            | Загрузка CSV-файлов в базу данных.                                          |
| `"show"`            | Просмотр определений ресурсов или результатов их материализации.                       |
| `"snapshot"`        | Выполнение снимков.                                                  |
| `"source"`          | Проверка актуальности данных и просмотр определений источников.                       |
| `"test"`            | Тестирование схемы и данных.                                                    |
| `"version"`         | Вывод версии dbt.                                                 |



