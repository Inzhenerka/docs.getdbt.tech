---
title: "О команде dbt invocation"
sidebar_label: "invocation"
id: invocation
---

Команда `dbt invocation` доступна в [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) и позволяет:
- Выводить список активных вызовов для отладки длительно выполняющихся или зависших вызовов.
- Выявлять и исследовать сеансы, вызывающие ошибку `Session occupied`.
- Отслеживать выполняющиеся команды dbt (например, `run`, `build`) в реальном времени.

Команда `dbt invocation` отображает **только активные invocation**. Если в данный момент ни одна сессия не запущена, список будет пустым. Завершённые сессии в вывод не включаются.

## Использование {#usage}

На этой странице перечислены команды и флаги, которые можно использовать с `dbt invocation`. Для их применения добавьте команду или опцию в таком виде: `dbt invocation [command]`.

Доступные флаги в интерфейсе командной строки (CLI): [`help`](#dbt-invocation-help) и [`list`](#dbt-invocation-list).

### dbt invocation help {#dbt-invocation-help}

Команда `help` выводит справочную информацию по команде `invocation` в CLI, включая список доступных флагов.

```shell
dbt invocation help
```

или

```shell
dbt help invocation
```

Команда возвращает следующую информацию:

```bash
dbt invocation help
Manage invocations

Usage:
  dbt invocation [command]

Available Commands:
  list        List active invocations

Flags:
  -h, --help   help for invocation

Global Flags:
      --log-format LogFormat   The log format, either json or plain. (default plain)
      --log-level LogLevel     The log level, one of debug, info, warning, error or fatal. (default info)
      --no-color               Disables colorization of the output.
  -q, --quiet                  Suppress all non-error logging to stdout.

Use "dbt invocation [command] --help" for more information about a command.
```

### dbt invocation list {#dbt-invocation-list}

Команда `list` выводит список активных вызовов в <Constant name="platform_cli" />. Если активен длительный сеанс, вы можете выполнить эту команду в отдельном окне терминала, чтобы просмотреть активный сеанс и упростить диагностику проблемы.

```shell
dbt invocation list
```

Команда возвращает следующую информацию, включая `ID`, `status`, `type`, `arguments` и время `started at` для активной сессии:

```bash
dbt invocation list

Active Invocations:
  ID                             6dcf4723-e057-48b5-946f-a4d87e1d117a
  Status                         running
  Type                           cli
  Args                           [run --select test.sql]
  Started At                     2025-01-24 11:03:19

➜  jaffle-shop git:(test-cli) ✗ 
```

:::tip

Чтобы отменить активную сессию в терминале, используйте сочетание клавиш `Ctrl + Z`.

:::

## Связанная документация

- [Установка CLI <Constant name="dbt" />](/docs/platform/dbt-cli-installation)
- [Устранение ошибки 'Session occupied' в CLI <Constant name="dbt" />](/faqs/Troubleshooting/long-sessions-dbt-cli)

- [Установка <Constant name="cloud" /> CLI](/docs/platform/dbt-cli-installation)
- [Устранение ошибки 'Session occupied' в <Constant name="cloud" /> CLI](/faqs/Troubleshooting/long-sessions-dbt-cli)
