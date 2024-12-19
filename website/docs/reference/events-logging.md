---
title: "События и логи"
---

В процессе выполнения dbt генерируются события. Наиболее распространенный способ увидеть эти события — это сообщения в логах, которые записываются в реальном времени в два места:
- В терминал командной строки (`stdout`), чтобы предоставить интерактивную обратную связь во время выполнения dbt.
- В файл отладочного лога (`logs/dbt.log`), чтобы обеспечить детальную [отладку ошибок](/guides/debug-errors) при их возникновении. Текстовые сообщения лога в этом файле включают все события уровня `DEBUG`, а также контекстную информацию, такую как уровень лога и имя потока. Местоположение этого файла можно настроить с помощью [флага `log-path`](/reference/global-configs/logs).

<File name='CLI'>

```bash
21:35:48  6 из 7 OK создано представление модели dbt_testing.name_list......................... [CREATE VIEW за 0.17с]
```

</File>

<File name='logs/dbt.log'>

```text
============================== 21:21:15.272780 | 48cef052-3819-4550-a83a-4a648aef5a31 ==============================
21:21:15.272780 [info ] [MainThread]: Запуск с dbt=1.5.0-b5
21:21:15.273802 [debug] [MainThread]: запуск dbt с аргументами {'printer_width': '80', 'indirect_selection': 'eager', 'log_cache_events': 'False', 'write_json': 'True', 'partial_parse': 'True', 'cache_selected_only': 'False', 'warn_error': 'None', 'fail_fast': 'False', 'debug': 'False', 'log_path': '/Users/jerco/dev/scratch/testy/logs', 'profiles_dir': '/Users/jerco/.dbt', 'version_check': 'False', 'use_colors': 'False', 'use_experimental_parser': 'False', 'no_print': 'None', 'quiet': 'False', 'log_format': 'default', 'static_parser': 'True', 'introspect': 'True', 'warn_error_options': 'WarnErrorOptions(include=[], exclude=[])', 'target_path': 'None', 'send_anonymous_usage_stats': 'True'}
21:21:16.190990 [debug] [MainThread]: Включен частичный парсинг: 0 файлов удалено, 0 файлов добавлено, 0 файлов изменено.
21:21:16.191404 [debug] [MainThread]: Включен частичный парсинг, изменений не найдено, пропуск парсинга
21:21:16.207330 [info ] [MainThread]: Найдено 2 модели, 0 тестов, 0 снимков, 1 анализ, 535 макросов, 0 операций, 1 seed файл, 0 источников, 0 экспозиций, 0 метрик, 0 групп

```

</File>

## Структурированное логирование

_Для получения более подробной информации о том, как была реализована система событий в dbt-core, смотрите [README модуля `events`](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/events/README.md)._

Структура каждого события в `dbt-core` основана на схеме, определенной с использованием [протокольных буферов](https://developers.google.com/protocol-buffers). Все схемы определены в файле [`types.proto`](https://github.com/dbt-labs/dbt-core/blob/3bf148c443e6b1da394b62e88a08f1d7f1d8ccaa/core/dbt/events/core_types.proto) в кодовой базе `dbt-core`.

Каждое событие имеет два верхних ключа:
- `info`: Информация, общая для всех событий. См. таблицу ниже для разбивки.
- `data`: Дополнительные структурированные данные, специфичные для этого события. Если это событие связано с конкретным узлом в вашем проекте dbt, оно будет содержать словарь `node_info` с общими атрибутами.

### Поля `info`

| Поле       | Описание   |
|-------------|---------------|
| `category` | Заполнитель для будущего использования (см. [dbt-labs/dbt-core#5958](https://github.com/dbt-labs/dbt-core/issues/5958)) |
| `code` | Уникальный сокращенный идентификатор для этого типа события, например, `A123` |
| `extra` | Словарь пользовательских метаданных окружения, основанный на переменных окружения с префиксом `DBT_ENV_CUSTOM_ENV_` |
| [`invocation_id`](/reference/dbt-jinja-functions/invocation_id) | Уникальный идентификатор для этого вызова dbt |
| `level` | Строковое представление уровня лога (`debug`, `info`, `warn`, `error`) |
| `log_version` | Целое число, указывающее версию |
| `msg` | Человекочитаемое сообщение лога, составленное из структурированных `data`. **Примечание**: Это сообщение не предназначено для машинного восприятия. Сообщения лога могут изменяться в будущих версиях dbt. |
| `name` | Уникальное имя для этого типа события, соответствующее имени схемы proto |
| `pid` | Идентификатор процесса для выполняемого вызова dbt, который сгенерировал это сообщение лога |
| `thread_name` | Поток, в котором было сгенерировано сообщение лога, полезно для отслеживания запросов, когда dbt выполняется с несколькими потоками |
| `ts` | Время, когда была напечатана строка лога |

### Поля `node_info`

Многие события возникают во время компиляции или выполнения конкретного узла DAG (модель, seed, тест и т.д.). Когда это возможно, объект `node_info` будет включать:

| Поле       | Описание   |
|-------------|---------------|
| `materialized` | view, table, incremental и т.д. |
| `meta` | Пользовательский [`meta` словарь](/reference/resource-configs/meta) для этого узла |
| `node_finished_at` | Временная метка, когда завершилась обработка узла |
| `node_name` | Имя этой модели/seed/test и т.д. |
| `node_path` | Путь к файлу, где определен этот ресурс |
| `node_relation` | Вложенный объект, содержащий представление этого узла в базе данных: `database`, `schema`, `alias` и полное `relation_name` с примененными правилами кавычек и включения |
| `node_started_at` | Временная метка, когда началась обработка узла |
| `node_status` | Текущий статус узла, либо `RunningStatus` (в процессе выполнения), либо `NodeStatus` (завершен), как определено в [контракте результата](https://github.com/dbt-labs/dbt-core/blob/eba90863ed4043957330ea44ca267db1a2d81fcd/core/dbt/contracts/results.py#L75-L88) |
| `resource_type` | `model`, `test`, `seed`, `snapshot` и т.д. |
| `unique_id` | Уникальный идентификатор для этого ресурса, который можно использовать для поиска дополнительной контекстной информации в [манифесте](/reference/artifacts/manifest-json) |

### Пример

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
    "msg": "1 из 1 НАЧАЛО sql view model my_database.my_model ................................ [RUN]",
    "name": "LogStartLine",
    "pid": 95894,
    "thread": "Thread-1",
    "ts": "2023-04-12T19:27:27.436283Z"
  }
}
```

## Python интерфейс

Старые версии `dbt-core` предоставляли полную историю событий, сгенерированных во время вызова, в виде объекта `EVENT_HISTORY`.

При [программном вызове dbt](programmatic-invocations#registering-callbacks) можно зарегистрировать обратный вызов в `EventManager` dbt. Это позволяет получить доступ к структурированным событиям в виде объектов Python, чтобы обеспечить пользовательское логирование и интеграцию с другими системами.

Python интерфейс для событий значительно менее развит, чем интерфейс структурированного логирования. Для всех стандартных случаев использования мы рекомендуем парсить логи в формате JSON.