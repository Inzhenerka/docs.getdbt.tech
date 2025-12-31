---
title: "События и логи"
---

Во время выполнения dbt генерирует события. Наиболее распространенный способ увидеть эти события — это лог-сообщения, которые записываются в реальном времени в два места:
- Терминал командной строки (`stdout`), чтобы обеспечить интерактивную обратную связь во время выполнения dbt.
- Файл отладочного лога (`logs/dbt.log`), чтобы обеспечить детальное [отладку ошибок](/guides/debug-errors) при их возникновении. Лог-сообщения в текстовом формате в этом файле включают все события уровня `DEBUG`, а также контекстную информацию, такую как уровень лога и имя потока. Местоположение этого файла можно настроить с помощью [флага `log-path`](/reference/global-configs/logs).

<File name='CLI'>

```bash
21:35:48  6 of 7 OK created view model dbt_testing.name_list......................... [CREATE VIEW in 0.17s]
```

</File>

<File name='logs/dbt.log'>

```text
============================== 21:21:15.272780 | 48cef052-3819-4550-a83a-4a648aef5a31 ==============================
21:21:15.272780 [info ] [MainThread]: Running with dbt=1.5.0-b5
21:21:15.273802 [debug] [MainThread]: running dbt with arguments {'printer_width': '80', 'indirect_selection': 'eager', 'log_cache_events': 'False', 'write_json': 'True', 'partial_parse': 'True', 'cache_selected_only': 'False', 'warn_error': 'None', 'fail_fast': 'False', 'debug': 'False', 'log_path': '/Users/jerco/dev/scratch/testy/logs', 'profiles_dir': '/Users/jerco/.dbt', 'version_check': 'False', 'use_colors': 'False', 'use_experimental_parser': 'False', 'no_print': 'None', 'quiet': 'False', 'log_format': 'default', 'static_parser': 'True', 'introspect': 'True', 'warn_error_options': 'WarnErrorOptions(include=[], exclude=[])', 'target_path': 'None', 'send_anonymous_usage_stats': 'True'}
21:21:16.190990 [debug] [MainThread]: Partial parsing enabled: 0 files deleted, 0 files added, 0 files changed.
21:21:16.191404 [debug] [MainThread]: Partial parsing enabled, no changes found, skipping parsing
21:21:16.207330 [info ] [MainThread]: Found 2 models, 0 tests, 0 snapshots, 1 analysis, 535 macros, 0 operations, 1 seed file, 0 sources, 0 exposures, 0 metrics, 0 groups

```

</File>

## Структурированное логирование {#structured-logging}

_Для получения более подробной информации о том, как система событий была реализована в dbt-core, см. [README модуля `events`](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/events/README.md)._

Структура каждого события в `dbt-core` поддерживается схемой, определенной с использованием [протоколов буферов](https://developers.google.com/protocol-buffers). Все схемы определены в файле [`types.proto`](https://github.com/dbt-labs/dbt-core/blob/3bf148c443e6b1da394b62e88a08f1d7f1d8ccaa/core/dbt/events/core_types.proto) в кодовой базе `dbt-core`.

Каждое событие имеет два одинаковых ключа верхнего уровня:
- `info`: Информация, общая для всех событий. См. таблицу ниже для разбивки.
- `data`: Дополнительные структурированные данные, специфичные для этого события. Если это событие связано с конкретным узлом в вашем проекте dbt, оно будет содержать словарь `node_info` с общими атрибутами.

### Поля `info` {#info-fields}

| Поле       | Описание   |
|------------|------------|
| `category` | Зарезервировано для будущего использования (см. [dbt-labs/dbt-core#5958](https://github.com/dbt-labs/dbt-core/issues/5958)) |
| `code` | Уникальный сокращенный идентификатор для этого типа события, например, `A123` |
| `extra` | Словарь пользовательских метаданных окружения, основанный на переменных окружения с префиксом `DBT_ENV_CUSTOM_ENV_` |
| [`invocation_id`](/reference/dbt-jinja-functions/invocation_id) | Уникальный идентификатор для этого вызова dbt |
| `level` | Строковое представление уровня лога (`debug`, `info`, `warn`, `error`) |
| `log_version` | Целое число, указывающее версию |
| `msg` | Понятное человеку сообщение лога, составленное из структурированных `data`. **Примечание**: Это сообщение не предназначено для машинного потребления. Лог-сообщения могут изменяться в будущих версиях dbt. |
| `name` | Уникальное имя для этого типа события, соответствующее имени схемы proto |
| `pid` | Идентификатор процесса для выполняемого вызова dbt, который создал это лог-сообщение |
| `thread_name` | Поток, в котором было создано лог-сообщение, полезно для отслеживания запросов, когда dbt выполняется с несколькими потоками |
| `ts` | Время, когда строка лога была напечатана |

### Поля `node_info` {#node_info-fields}

Многие события генерируются при компиляции или выполнении конкретного узла DAG (модель, seed, тест и т.д.). Когда это доступно, объект `node_info` будет включать:

| Поле       | Описание   |
|------------|------------|
| `materialized` | view, table, incremental и т.д. |
| `meta` | Пользовательски настроенный [`meta` словарь](/reference/resource-configs/meta) для этого узла |
| `node_finished_at` | Временная метка, когда обработка узла завершена |
| `node_name` | Имя этой модели/seed/теста и т.д. |
| `node_path` | Путь к файлу, где определен этот ресурс |
| `node_relation` | Вложенный объект, содержащий представление базы данных этого узла: `database`, `schema`, `alias` и полное `relation_name` с примененными политиками цитирования и включения |
| `node_started_at` | Временная метка, когда началась обработка узла |
| `node_status` | Текущий статус узла, либо `RunningStatus` (во время выполнения), либо `NodeStatus` (завершено), как определено в [контракте результата](https://github.com/dbt-labs/dbt-core/blob/eba90863ed4043957330ea44ca267db1a2d81fcd/core/dbt/contracts/results.py#L75-L88) |
| `resource_type` | `model`, `test`, `seed`, `snapshot` и т.д. |
| `unique_id` | Уникальный идентификатор для этого ресурса, который можно использовать для поиска более контекстной информации в [манифесте](/reference/artifacts/manifest-json) |

### Пример {#example}

```json
{
  "data": {
    "description": "sql view model dbt_jcohen.my_model",
    "index": 1,
    "node_info": {
      "materialized": "view",
      "meta": {
        "first": "some_value",
        "second": "1234"
      },
      "node_finished_at": "",
      "node_name": "my_model",
      "node_path": "my_model.sql",
      "node_relation": {
        "alias": "my_model",
        "database": "my_database",
        "relation_name": "\"my_database\".\"my_schema\".\"my_model\"",
        "schema": "my_schema"
      },
      "node_started_at": "2023-04-12T19:27:27.435364",
      "node_status": "started",
      "resource_type": "model",
      "unique_id": "model.my_dbt_project.my_model"
    },
    "total": 1
  },
  "info": {
    "category": "",
    "code": "Q011",
    "extra": {
      "my_custom_env_var": "my_custom_value"
    },
    "invocation_id": "206b4e61-8447-4af7-8035-b174ab3ac991",
    "level": "info",
    "msg": "1 of 1 START sql view model my_database.my_model ................................ [RUN]",
    "name": "LogStartLine",
    "pid": 95894,
    "thread": "Thread-1",
    "ts": "2023-04-12T19:27:27.436283Z"
  }
}
```

## Интерфейс Python {#python-interface}

Более старые версии `dbt-core` предоставляли полную историю событий, сгенерированных во время вызова, в виде объекта `EVENT_HISTORY`.

При [программном вызове dbt](/reference/programmatic-invocations#registering-callbacks) возможно зарегистрировать обратный вызов на `EventManager` dbt. Это позволяет получить доступ к структурированным событиям как к объектам Python, чтобы обеспечить пользовательское логирование и интеграцию с другими системами.

Интерфейс Python для работы с событиями значительно менее зрелый, чем интерфейс структурированного логирования. Для всех стандартных случаев использования мы рекомендуем разбирать логи в формате JSON.