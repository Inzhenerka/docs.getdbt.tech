---
title: "Логи"
id: "logs"
sidebar: "logs"
---

### Форматирование логов

dbt выводит логи в два разных места: консоль CLI и файл логов.

Конфигурации `LOG_FORMAT` и `LOG_FORMAT_FILE` определяют, как должны быть отформатированы логи dbt, и у них есть одинаковые опции: `json`, `text` и `debug`.

<File name='Usage'>

```text
dbt --log-format json run
```

</File>

Формат `text` является стандартным для логов в консоли и содержит сообщения в простом текстовом формате с префиксом в виде простого временного штампа:

```
23:30:16  Running with dbt=1.8.0
23:30:17  Registered adapter: postgres=1.8.0
```

Формат `debug` является стандартным для файла логов и аналогичен формату `text`, но с более детализированным временным штампом, а также включает [`invocation_id`](/reference/dbt-jinja-functions/invocation_id), [`thread_id`](/reference/dbt-jinja-functions/thread_id) и [уровень логирования](/reference/global-configs/logs#log-level) каждого сообщения:

```
============================== 16:12:08.555032 | 9089bafa-4010-4f38-9b42-564ec9106e07 ==============================
16:12:08.555032 [info ] [MainThread]: Running with dbt=1.8.0
16:12:08.751069 [info ] [MainThread]: Registered adapter: postgres=1.8.0
```

Формат `json` выводит полностью структурированные логи в формате <Term id="json" />:

```json
{"data": {"log_version": 3, "version": "=1.8.0"}, "info": {"category": "", "code": "A001", "extra": {}, "invocation_id": "82131fa0-d2b4-4a77-9436-019834e22746", "level": "info", "msg": "Running with dbt=1.8.0", "name": "MainReportVersion", "pid": 7875, "thread": "MainThread", "ts": "2024-05-29T23:32:54.993336Z"}}
{"data": {"adapter_name": "postgres", "adapter_version": "=1.8.0"}, "info": {"category": "", "code": "E034", "extra": {}, "invocation_id": "82131fa0-d2b4-4a77-9436-019834e22746", "level": "info", "msg": "Registered adapter: postgres=1.8.0", "name": "AdapterRegistered", "pid": 7875, "thread": "MainThread", "ts": "2024-05-29T23:32:56.437986Z"}}
```

Когда `LOG_FORMAT` установлен явно, он будет применяться как в консоли, так и в файлах логов, тогда как `LOG_FORMAT_FILE` влияет только на файл логов.

<File name='Usage'>

```text
dbt --log-format-file json run
```

</File>

:::tip Совет: подробные структурированные логи

Используйте значение форматирования `json` вместе с конфигурацией `DEBUG`, чтобы получить богатую информацию о логах, которую можно передать в инструменты мониторинга для анализа:

```text
dbt --debug --log-format json run
```

Смотрите [структурированное логирование](/reference/events-logging#structured-logging) для более подробной информации.

:::

### Уровень логирования

Конфигурация `LOG_LEVEL` устанавливает минимальную серьезность событий, фиксируемых в консоли и файлах логов. Это более гибкая альтернатива флагу `--debug`. Доступные опции для уровней логирования: `debug`, `info`, `warn`, `error` или `none`.

- Установка `--log-level` настроит логи в консоли и файлах.

  ```text
  dbt --log-level debug run
  ```

- Установка `LOG_LEVEL` в `none` отключит отправку информации как в консоль, так и в файлы логов.

  ```text
  dbt --log-level none
  ```

- Чтобы установить уровень логирования для файла отличным от консоли, используйте флаг `--log-level-file`.

  ```text
  dbt --log-level-file error run
  ```

- Чтобы отключить запись в файл логов, но сохранить логи в консоли, установите конфигурацию `LOG_LEVEL_FILE` в none.
  ```text
  dbt --log-level-file none
  ```

### Логирование на уровне отладки

Конфигурация `DEBUG` перенаправляет отладочные логи dbt на стандартный вывод. Это приводит к отображению информации об отладке в терминале в дополнение к файлу `logs/dbt.log`. Этот вывод является подробным.

Флаг `--debug` также доступен в сокращенной форме как `-d`.

<File name='Usage'>

```text
dbt --debug run
...

```

</File>  

### Пути для логов и целевых файлов

По умолчанию, dbt будет записывать логи в директорию с именем `logs/`, а все остальные артефакты в директорию с именем `target/`. Обе эти директории расположены относительно `dbt_project.yml` активного проекта.

Как и другие глобальные конфигурации, эти значения можно переопределить для вашей среды или вызова, используя опции CLI (`--target-path`, `--log-path`) или переменные окружения (`DBT_TARGET_PATH`, `DBT_LOG_PATH`).

### Подавление логов без ошибок в выводе

По умолчанию, dbt показывает все логи в стандартном выводе (stdout). Вы можете использовать конфигурацию `QUIET`, чтобы показывать только логи ошибок в stdout. Логи все равно будут включать вывод всего, что передано в макрос [`print()`](/reference/dbt-jinja-functions/print). Например, вы можете подавить все, кроме логов ошибок, чтобы легче находить и исправлять ошибки jinja.

<File name='profiles.yml'>

```yaml
config:
  quiet: true
```

</File>

Передайте флаг `-q` или `--quiet` в `dbt run`, чтобы показывать только логи ошибок и подавлять логи без ошибок.

```text
dbt --quiet run
...
```

### Логирование списка dbt

В [версии dbt 1.5](/docs/dbt-versions/core-upgrade/upgrading-to-v1.5#behavior-changes) мы обновили поведение логирования команды [dbt list](/reference/commands/list), чтобы по умолчанию включать логи уровня `INFO`.

Вы можете использовать любой из этих параметров, чтобы обеспечить чистый вывод, совместимый с последующими процессами, такими как передача результатов в [`jq`](https://jqlang.github.io/jq/manual/), файл или другой процесс:

- `dbt --log-level warn list` (рекомендуется; эквивалентно предыдущему значению по умолчанию)
- `dbt --quiet list` (подавляет все логи ниже уровня `ERROR`, кроме "напечатанных" сообщений и вывода списка)

### Логирование событий кэширования реляционных данных

import LogLevel from '/snippets/_log-relational-cache.md';

<LogLevel
event={<a href="https://docs.getdbt.com/reference/global-configs/cache">реляционный кэш</a>}
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
dbt --use-colors-file run
dbt --no-use-colors-file run
```