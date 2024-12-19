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

Список доступных флагов определяется в [модуле `flags`](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/flags.py) в `dbt-core`.

Рекомендуемые случаи использования включают:
- различная логика <Term id="materialization" /> в зависимости от "режимов выполнения", таких как `flags.FULL_REFRESH` и `flags.STORE_FAILURES`
- условное выполнение хуков в зависимости от текущей команды / типа задачи с помощью `flags.WHICH`

**Примечание:** Не рекомендуется использовать флаги в качестве входных данных для конфигураций, свойств или зависимостей во время разбора (`ref` + `source`). Флаги, вероятно, будут изменяться при каждом вызове dbt, и их разобранные значения станут устаревшими (и приведут к неправильным результатам) в последующих вызовах с включенным частичным разбором. Для получения дополнительной информации смотрите [документацию по разбору](/reference/parsing).

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

Ключ `invocation_command` в `invocation_args_dict` включает всю подкоманду, когда она компилируется:

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