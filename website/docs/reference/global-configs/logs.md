---
title: "Логи"
id: "logs"
sidebar: "logs"
---

### Форматирование логов {#log-formatting}

dbt выводит логи в два разных места: консоль CLI и файл логов.

<VersionBlock lastVersion="1.99">

Настройки `LOG_FORMAT` и `LOG_FORMAT_FILE` определяют формат логов dbt, и для каждой из них доступны одинаковые варианты: `json`, `text` и `debug`.

</VersionBlock>

<VersionBlock firstVersion="2.0">

The `LOG_FORMAT` and `LOG_FORMAT_FILE` configs specify how dbt's logs should be formatted. Shared options are `text`, `json`, and `default`. The `otel` option is available for `LOG_FORMAT` only (console output). Setting `--log-format-file otel` has no effect.

The `otel` format streams [OpenTelemetry](https://opentelemetry.io/)-style structured telemetry to the console. It uses a different schema than <Constant name="core" />'s `json` logs. For JSONL files, Parquet export, OTLP, and how this maps to <Constant name="core" /> structured logging, refer to [<Constant name="fusion" /> telemetry and observability](/reference/telemetry-observability).

<File name='Usage'>

```text
dbt build --log-format otel
```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.99">

<File name='Usage'>

```text
dbt run --log-format json
```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.99">

Формат `text` используется по умолчанию для логов в консоли и содержит сообщения в виде обычного текста, перед которыми указывается простая временная метка:

```
23:30:16  Running with dbt=1.8.0
23:30:17  Registered adapter: postgres=1.8.0
```

</VersionBlock>

<VersionBlock firstVersion="2.0">

Формат `text` используется по умолчанию для логов в консоли и выводит сообщения о ходе выполнения в виде обычного текста:

```
dbt 2.0.1
   Loading ~/.dbt/profiles.yml
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

Формат `debug` используется по умолчанию для файла логов и аналогичен формату `text`, но содержит более подробную временную метку, а также [`invocation_id`](/reference/dbt-jinja-functions/invocation_id), [`thread_id`](/reference/dbt-jinja-functions/thread_id) и [уровень логирования](/reference/global-configs/logs#log-level) каждого сообщения:

```
============================== 16:12:08.555032 | 9089bafa-4010-4f38-9b42-564ec9106e07 ==============================
16:12:08.555032 [info ] [MainThread]: Running with dbt=1.8.0
16:12:08.751069 [info ] [MainThread]: Registered adapter: postgres=1.8.0
```

</VersionBlock>

Формат `json` выводит полностью структурированные журналы в формате <Term id="json" />:

<VersionBlock firstVersion="2.0">

```json
{"data": {"log_version": 3, "version": "=2.0.0-preview.181"}, "info": {"category": "", "code": "A001", "extra": {}, "invocation_id": "019fb7d4-ce89-7712-8d06-5ad013a23be9", "level": "info", "msg": "Running with dbt-fusion=2.0.0-preview.181", "name": "MainReportVersion", "pid": 92554, "thread": "tokio-rt-worker", "ts": "2026-07-31T11:00:04.877509Z"}}
{"data": {"msg": "Loading ~/.dbt/profiles.yml"}, "info": {"category": "", "code": "", "extra": {}, "invocation_id": "019fb7d4-ce89-7712-8d06-5ad013a23be9", "level": "info", "msg": "Loading ~/.dbt/profiles.yml", "name": "Generic", "pid": 92554, "thread": "tokio-rt-worker", "ts": "2026-07-31T11:00:04.882928Z"}}
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

```json
{"data": {"log_version": 3, "version": "=1.8.0"}, "info": {"category": "", "code": "A001", "extra": {}, "invocation_id": "82131fa0-d2b4-4a77-9436-019834e22746", "level": "info", "msg": "Running with dbt=1.8.0", "name": "MainReportVersion", "pid": 7875, "thread": "MainThread", "ts": "2024-05-29T23:32:54.993336Z"}}
{"data": {"adapter_name": "postgres", "adapter_version": "=1.8.0"}, "info": {"category": "", "code": "E034", "extra": {}, "invocation_id": "82131fa0-d2b4-4a77-9436-019834e22746", "level": "info", "msg": "Registered adapter: postgres=1.8.0", "name": "AdapterRegistered", "pid": 7875, "thread": "MainThread", "ts": "2024-05-29T23:32:56.437986Z"}}
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

Если `LOG_FORMAT` задан явно, он применяется как к выводу в консоль, так и к файлам журналов, тогда как `LOG_FORMAT_FILE` влияет только на файл журнала.

</VersionBlock>

<VersionBlock firstVersion="2.0">

When the `LOG_FORMAT` is set explicitly to `text`, `json`, or `default`, it takes effect in both the console and log files. The `otel` value applies to console output only. Use `LOG_FORMAT_FILE` to set a different format for the log file (`text`, `json`, or `default`).

</VersionBlock>

<File name='Usage'>

```text
dbt run --log-format-file json
```

</File>

<VersionBlock lastVersion="1.99">

:::tip Совет: подробные структурированные логи

Используйте значение форматирования `json` вместе с конфигурацией `DEBUG`, чтобы получить богатую информацию о логах, которую можно передать в инструменты мониторинга для анализа:

```text
dbt run --debug --log-format json
```

Подробнее см. в разделе [Структурированное журналирование](/reference/events-logging#structured-logging).

:::

</VersionBlock>

<VersionBlock firstVersion="2.0">

:::tip Совет: структурированная наблюдаемость

Используйте `--log-format otel` для потокового вывода телеметрии в стиле OpenTelemetry в консоль или `--otel-file-name` и связанные флаги для записи в файлы и интеграции с платформами. См. раздел [Телеметрия и наблюдаемость <Constant name="fusion" />](/reference/telemetry-observability).

Для вывода строк журнала в формате JSON используйте `--log-format json` с настройкой `DEBUG`:

```text
dbt build --debug --log-format json
```

:::

</VersionBlock>

### Уровень журналирования {#log-level}

Конфигурация `LOG_LEVEL` устанавливает минимальную серьезность событий, фиксируемых в консоли и файлах логов. Это более гибкая альтернатива флагу `--debug`. Доступные опции для уровней логирования: `debug`, `info`, `warn`, `error` или `none`.

- Установка `--log-level` настроит логи в консоли и файлах.

  ```text
  dbt run --log-level debug
  ```

- Установка `LOG_LEVEL` в `none` отключит отправку информации как в консоль, так и в файлы логов.

  ```text
  dbt run --log-level none
  ```

- Чтобы установить уровень логирования для файла отличным от консоли, используйте флаг `--log-level-file`.

  ```text
  dbt run --log-level-file error
  ```

- Чтобы отключить запись в файл логов, но сохранить логи в консоли, установите конфигурацию `LOG_LEVEL_FILE` в none.
  ```text
  dbt run --log-level-file none
  ```

### Логирование на уровне отладки {#debug-level-logging}

Конфигурация `DEBUG` перенаправляет отладочные логи dbt на стандартный вывод. Это приводит к отображению информации об отладке в терминале в дополнение к файлу `logs/dbt.log`. Этот вывод является подробным.

Флаг `--debug` также доступен в сокращенной форме как `-d`.

<File name='Usage'>

```text
dbt run --debug
```

</File>  

### Пути для логов и целевых файлов {#log-and-target-paths}

По умолчанию, dbt будет записывать логи в директорию с именем `logs/`, а все остальные артефакты в директорию с именем `target/`. Обе эти директории расположены относительно `dbt_project.yml` активного проекта.

Как и другие глобальные конфигурации, эти значения можно переопределить для вашей среды или вызова, используя опции CLI (`--target-path`, `--log-path`) или переменные окружения (`DBT_TARGET_PATH`, `DBT_LOG_PATH`).

Как и другие глобальные настройки, эти значения можно переопределить для вашей среды или конкретного запуска с помощью параметров CLI (`--target-path`, `--log-path`) или переменных окружения (<VersionBlock lastVersion="1.10">`DBT_TARGET_PATH`, `DBT_LOG_PATH`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_TARGET_PATH`, `DBT_ENGINE_LOG_PATH`</VersionBlock>).

### Подавление неошибочных логов в выводе {#dbt-list-logging}

По умолчанию dbt выводит все логи в стандартный поток вывода (stdout). Вы можете использовать конфигурацию `QUIET`, чтобы в stdout отображались только логи с ошибками. При этом логи по‑прежнему будут включать вывод всего, что передаётся в макрос [`print()`](/reference/dbt-jinja-functions/print). Например, вы можете подавить все логи, кроме ошибок, чтобы проще находить и отлаживать ошибку в Jinja.

<File name='profiles.yml'>

```yaml
config:
  quiet: true
```

</File>

Передайте флаг `-q` или `--quiet` в `dbt run`, чтобы показывать только логи ошибок и подавлять логи без ошибок.

```text
dbt run --quiet
```

### Логирование списка dbt {#logging-relational-cache-events}

В [dbt версии 1.5](/docs/dbt-versions/dbt-upgrade/Older%20versions/upgrading-to-v1.5#behavior-changes) мы изменили поведение команды [dbt list](/reference/commands/list) при ведении журнала: теперь по умолчанию в него включаются сообщения уровня `INFO`.


### Логирование событий реляционного кэша {#color}

import LogLevel from '/snippets/_log-relational-cache.md';

<LogLevel
event={<a href="https://docs.getdbt.tech/reference/global-configs/cache">реляционный кэш</a>}
/>

### Цвет

Вы можете установить цветовые предпочтения для файлов логов только в `profiles.yml` или используя флаги `--use-colors-file / --no-use-colors-file`.

<File name='profiles.yml'>

```yaml
config:
  use_colors_file: False
```

</File>

```text
```bash
dbt run --use-colors-file
dbt run --no-use-colors-file
```
