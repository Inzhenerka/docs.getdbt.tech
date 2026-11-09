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

<VersionBlock firstVersion="2.0">

<Constant name="fusion_engine" /> формирует структурированную телеметрию выполнения в соответствии с соглашениями [OpenTelemetry](https://opentelemetry.io/), а не журналы событий в формате JSON, как <Constant name="core" />. Для локального просмотра используйте `--log-format otel` или параметры, описанные в разделе [Телеметрия и наблюдаемость <Constant name="fusion" />](/reference/telemetry-observability#available-output-formats).

В <Constant name="dbt_platform" /> можно [скачать журналы OTel](/docs/deploy/run-visibility#access-logs) для запусков заданий <Constant name="fusion" />.

Сведения о `--log-format`, `--log-level` и связанных параметрах CLI см. в разделе [Журналы](/reference/global-configs/logs).

</VersionBlock>

<VersionBlock lastVersion="1.99">

_Подробнее о реализации системы событий в dbt см. в [README модуля `events`](https://github.com/dbt-labs/dbt/blob/HEAD/core/dbt/events/README.md)._

Структура каждого события в `dbt-core` задаётся схемой, определённой с помощью [Protocol Buffers](https://developers.google.com/protocol-buffers). Все схемы определены в файле [`types.proto`](https://github.com/dbt-labs/dbt/blob/3bf148c443e6b1da394b62e88a08f1d7f1d8ccaa/core/dbt/events/core_types.proto) в кодовой базе `dbt-labs/dbt`.

Каждое событие имеет два одинаковых ключа верхнего уровня:
- `info`: Информация, общая для всех событий. См. таблицу ниже для разбивки.
- `data`: Дополнительные структурированные данные, специфичные для этого события. Если это событие связано с конкретным узлом в вашем проекте dbt, оно будет содержать словарь `node_info` с общими атрибутами.

### Поля `info` {#info-fields}

| Поле        | Описание      |
|-------------|---------------|
| `category` | Зарезервировано для будущего использования (см. [dbt-labs/dbt#5958](https://github.com/dbt-labs/dbt/issues/5958)) |
| `code` | Уникальный краткий идентификатор этого типа события, например `A123` |
| `extra` | Словарь пользовательских метаданных окружения, сформированный на основе переменных окружения с префиксом `DBT_ENV_CUSTOM_ENV_` |
| [`invocation_id`](/reference/dbt-jinja-functions/invocation_id) | Уникальный идентификатор этого вызова dbt |
| `level` | Строковое представление уровня логирования (`debug`, `info`, `warn`, `error`) |
| `log_version` | Целое число, обозначающее версию |
| `msg` | Сообщение лога, предназначенное для чтения человеком и сформированное из структурированных данных `data`. **Примечание**: это сообщение не предназначено для машинной обработки. Сообщения логов могут изменяться в будущих версиях dbt. |
| `name` | Уникальное имя этого типа события, совпадающее с именем в схеме proto |
| `pid` | Идентификатор процесса выполняющегося вызова dbt, который сформировал это сообщение лога |
| `thread_name` | Поток, в котором было сформировано сообщение лога; помогает отслеживать запросы при запуске dbt в нескольких потоках |
| `ts` | Время вывода строки лога |

### Поля `node_info` {#node_info-fields}

Многие события генерируются при компиляции или выполнении конкретного узла DAG (модель, seed, тест и т.д.). Когда это доступно, объект `node_info` будет включать:

| Поле        | Описание      |
|-------------|---------------|
| `materialized` | view, table, incremental и т. д. |
| `meta` | Настроенный пользователем [словарь `meta`](/reference/resource-configs/meta) для этого узла |
| `node_finished_at` | Временная метка завершения обработки узла |
| `node_name` | Имя этой модели/seed/теста/и т. д. |
| `node_path` | Путь к файлу, в котором определён этот ресурс |
| `node_relation` | Вложенный объект, содержащий представление этого узла в базе данных: `database`, `schema`, `alias` и полное имя `relation_name` с применёнными правилами заключения идентификаторов в кавычки и включения компонентов имени |
| `node_started_at` | Временная метка начала обработки узла |
| `node_status` | Текущий статус узла: `RunningStatus` (во время выполнения) или `NodeStatus` (после завершения), как определено в [контракте результатов](https://github.com/dbt-labs/dbt/blob/eba90863ed4043957330ea44ca267db1a2d81fcd/core/dbt/contracts/results.py#L75-L88) |
| `resource_type` | `model`, `test`, `seed`, `snapshot` и т. д. |
| `unique_id` | Уникальный идентификатор этого ресурса, по которому можно найти дополнительную контекстную информацию в [манифесте](/reference/artifacts/manifest-json) |

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

</VersionBlock>

## Интерфейс Python

<VersionBlock firstVersion="2.0">

<Constant name="fusion_engine" /> не поддерживает интерфейс событий Python, доступный в <Constant name="core" />.

Сейчас мы [разрабатываем](https://github.com/dbt-labs/dbt/issues/13102) API на Python с привязками к Rust для программного запуска.

</VersionBlock>

<VersionBlock lastVersion="1.99">

В старых версиях `dbt-core` полная история событий, возникавших во время запуска, была доступна в виде объекта `EVENT_HISTORY`.

При [программном вызове dbt](/reference/programmatic-invocations#registering-callbacks) возможно зарегистрировать обратный вызов на `EventManager` dbt. Это позволяет получить доступ к структурированным событиям как к объектам Python, чтобы обеспечить пользовательское логирование и интеграцию с другими системами.

Интерфейс Python для работы с событиями значительно менее зрелый, чем интерфейс структурированного логирования. Для всех стандартных сценариев использования мы рекомендуем разбирать логи в формате JSON.

</VersionBlock>
