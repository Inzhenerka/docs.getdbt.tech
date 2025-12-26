---
title: "О команде dbt rpc"
sidebar_label: "rpc"
id: "rpc"
description: "Сервер удаленного вызова процедур (rpc) dbt компилирует и выполняет запросы, а также предоставляет методы, которые позволяют перечислять и завершать выполняющиеся процессы."
---

:::caution Плагин dbt-rpc устарел

dbt Labs активно поддерживала `dbt-rpc` для совместимости с версиями dbt-core до v1.5. Начиная с dbt-core v1.6 (выпущенной в июле 2023 года), `dbt-rpc` больше не поддерживается для дальнейшей совместимости.

В это время dbt Labs будет выполнять только критическое обслуживание для `dbt-rpc`, пока последняя совместимая версия dbt-core не достигнет [конца официальной поддержки](/docs/dbt-versions/core#latest-releases). В этот момент dbt Labs архивирует этот репозиторий, сделав его доступным только для чтения.

:::

### Обзор

Вы можете использовать плагин `dbt-rpc` для запуска сервера удаленного вызова процедур (rpc) dbt. Этот сервер компилирует и выполняет запросы в контексте проекта dbt. Кроме того, RPC-сервер предоставляет методы, которые позволяют перечислять и завершать выполняющиеся процессы. Мы рекомендуем запускать rpc-сервер из каталога, содержащего проект dbt. Сервер скомпилирует проект в память, а затем будет принимать запросы для работы с контекстом dbt этого проекта.

:::caution Запуск на Windows
Мы не рекомендуем запускать rpc-сервер на Windows из-за проблем с надежностью. Контейнер Docker может предоставить полезное решение, если это необходимо.
:::

Для получения более подробной информации смотрите исходный код [репозитория `dbt-rpc`](https://github.com/dbt-labs/dbt-rpc).

**Запуск сервера:**

```
$ dbt-rpc serve
Running with dbt=1.5.0

16:34:31 | Concurrency: 8 threads (target='dev')
16:34:31 |
16:34:31 | Done.
Serving RPC server at 0.0.0.0:8580
Send requests to http://localhost:8580/jsonrpc
```

**Настройка сервера**

* `--host`: Укажите хост для прослушивания (по умолчанию=`0.0.0.0`)
* `--port`: Укажите порт для прослушивания (по умолчанию=`8580`)

**Отправка запросов на сервер:**
rpc-сервер ожидает запросы в следующем формате:

<File name='rpc-spec.json'>

```json
{
    "jsonrpc": "2.0",
    "method": "{ a valid rpc server command }",
    "id": "{ a unique identifier for this query }",
    "params": {
        "timeout": { timeout for the query in seconds, optional },
    }
}
```

</File>

## Встроенные методы

### status

Метод `status` возвращает статус rpc-сервера. Ответ этого метода включает в себя общий статус, такой как `ready`, `compiling` или `error`, а также набор логов, накопленных во время начальной компиляции проекта. Когда rpc-сервер находится в состоянии `compiling` или `error`, принимаются только встроенные методы RPC-сервера.

**Пример запроса**

```json
{
    "jsonrpc": "2.0",
    "method": "status",
    "id": "2db9a2fe-9a39-41ef-828c-25e04dd6b07d"
}
```

**Пример ответа**

```json
{
    "result": {
        "status": "ready",
        "error": null,
        "logs": [..],
        "timestamp": "2019-10-07T16:30:09.875534Z",
        "pid": 76715
    },
    "id": "2db9a2fe-9a39-41ef-828c-25e04dd6b07d",
    "jsonrpc": "2.0"
}
```

### poll

Конечная точка `poll` возвращает статус, логи и результаты (если доступны) для выполняющейся или завершенной задачи. Метод `poll` требует параметр `request_token`, который указывает задачу, для которой нужно получить ответ. `request_token` возвращается в ответе на задачи dbt, такие как `compile`, `run` и `test`.

**Параметры**:

- `request_token`: Токен для получения ответов
- `logs`: Логический флаг, указывающий, должны ли логи быть возвращены в ответе (по умолчанию=false)
- `logs_start`: Нулевая индексированная строка лога, с которой нужно начать получение логов (по умолчанию=0)

**Пример запроса**

```json
{
    "jsonrpc": "2.0",
    "method": "poll",
    "id": "2db9a2fe-9a39-41ef-828c-25e04dd6b07d",
    "params": {
        "request_token": "f86926fa-6535-4891-8d24-2cfc65d2a347",
        "logs": true,
        "logs_start": 0
    }
}
```

**Пример ответа**

```json
{
    "result": {
        "results": [],
        "generated_at": "2019-10-11T18:25:22.477203Z",
        "elapsed_time": 0.8381369113922119,
        "logs": [],
        "tags": {
            "command": "run --select my_model",
            "branch": "abc123"
        },
        "status": "success"
    },
    "id": "2db9a2fe-9a39-41ef-828c-25e04dd6b07d",
    "jsonrpc": "2.0"
}
```

### ps

Метод `ps` перечисляет выполняющиеся и завершенные процессы, выполненные RPC-сервером.

**Параметры**

- `completed`: Если true, также возвращает завершенные задачи (по умолчанию=false)

**Пример запроса:**
```json
{
    "jsonrpc": "2.0",
    "method": "ps",
    "id": "2db9a2fe-9a39-41ef-828c-25e04dd6b07d",
    "params": {
        "completed": true
    }
}
```

**Пример ответа:**
```json
{
    "result": {
        "rows": [
            {
                "task_id": "561d4a02-18a9-40d1-9f01-cd875c3ec56d",
                "request_id": "3db9a2fe-9a39-41ef-828c-25e04dd6b07d",
                "request_source": "127.0.0.1",
                "method": "run",
                "state": "success",
                "start": "2019-10-07T17:09:49.865976Z",
                "end": null,
                "elapsed": 1.107261,
                "timeout": null,
                "tags": {
                    "command": "run --select my_model",
                    "branch": "feature/add-models"
                }
            }
        ]
    },
    "id": "2db9a2fe-9a39-41ef-828c-25e04dd6b07d",
    "jsonrpc": "2.0"
}
```

### kill

Метод `kill` завершает выполняющуюся задачу. Вы можете найти `task_id` для выполняющейся задачи либо в исходном ответе, который вызвал эту задачу, либо в результатах метода `ps`.

**Пример запроса**
```json
{
    "jsonrpc": "2.0",
    "method": "kill",
    "id": "2db9a2fe-9a39-41ef-828c-25e04dd6b07d",
    "params": {
        "task_id": "{ the task id to terminate }"
    }
}
```

## Запуск проектов dbt

Следующие методы позволяют запускать проекты dbt через RPC-сервер.

### Общие параметры

Все запросы RPC принимают следующие параметры в дополнение к перечисленным параметрам:
- `timeout`: Максимальное время ожидания перед отменой запроса.
- `task_tags`: Произвольные пары ключ/значение для прикрепления к этой задаче. Эти теги будут возвращены в выводе методов `poll` и `ps` (необязательно).

### Запуск задачи с использованием синтаксиса CLI

**Параметры:**
 - `cli`: Команда dbt (например, `run --select abc+ --exclude +def`) для выполнения (обязательно)

```json
{
    "jsonrpc": "2.0",
    "method": "cli_args",
    "id": "<request id>",
    "params": {
        "cli": "run --select abc+ --exclude +def",
        "task_tags": {
            "branch": "feature/my-branch",
            "commit": "c0ff33b01"
        }
    }
}
```

Несколько следующих типов запросов принимают эти дополнительные параметры:
- `threads`: Количество [потоков](/docs/core/connect-data-platform/connection-profiles#understanding-threads) для использования при компиляции (необязательно)
- `select`: Набор ресурсов, разделенных пробелами, для выполнения (необязательно). (`models` также поддерживается для некоторых типов запросов для обратной совместимости.)
- `selector`: Имя предопределенного [YAML-селектора](/reference/node-selection/yaml-selectors), который определяет набор ресурсов для выполнения (необязательно)
- `exclude`: Набор ресурсов, разделенных пробелами, для исключения из компиляции, выполнения, тестирования, загрузки или создания снимков (необязательно)
- `state`: Путь к артефактам для использования при установлении [состояния](/reference/node-selection/syntax#about-node-selection) (необязательно)

### Компиляция проекта ([документация](/reference/commands/compile))

```json
{
	"jsonrpc": "2.0",
	"method": "compile",
	"id": "<request id>",
	"params": {
            "threads": "<int> (optional)",
            "select": "<str> (optional)",
            "exclude": "<str> (optional)",
            "selector": "<str> (optional)",
            "state": "<str> (optional)"
        }
}
```

### Запуск моделей ([документация](/reference/commands/run))

**Дополнительные параметры:**
- `defer`: Откладывать ли ссылки на вышестоящие, невыбранные ресурсы (необязательно, требует `state`)

```json
{
	"jsonrpc": "2.0",
	"method": "run",
	"id": "<request id>",
	"params": {
            "threads": "<int> (optional)",
            "select": "<str> (optional)",
            "exclude": "<str> (optional)",
            "selector": "<str> (optional)",
            "state": "<str> (optional)",
            "defer": "<bool> (optional)"
        }
}
```

### Запуск тестов ([документация](/reference/commands/test))

**Дополнительные параметры:**
 - `data`: Если True, запускать тесты данных (необязательно, по умолчанию=true)
 - `schema`: Если True, запускать тесты схемы (необязательно, по умолчанию=true)

```json
{
	"jsonrpc": "2.0",
	"method": "test",
	"id": "<request id>",
	"params": {
            "threads": "<int> (optional)",
            "select": "<str> (optional)",
            "exclude": "<str> (optional)",
            "selector": "<str> (optional)",
            "state": "<str> (optional)",
            "data": "<bool> (optional)",
            "schema": "<bool> (optional)"
        }
}
```

### Запуск загрузки данных ([документация](/reference/commands/seed))

**Параметры:**
 - `show`: Если True, показать образец загруженных данных в ответе (необязательно, по умолчанию=false)

```json
{
	"jsonrpc": "2.0",
	"method": "seed",
	"id": "<request id>",
	"params": {
            "threads": "<int> (optional)",
            "select": "<str> (optional)",
            "exclude": "<str> (optional)",
            "selector": "<str> (optional)",
            "show": "<bool> (optional)",
            "state": "<str> (optional)"
        }
}
```

### Запуск создания снимков ([документация](/docs/build/snapshots))

```json
{
	"jsonrpc": "2.0",
	"method": "snapshot",
	"id": "<request id>",
	"params": {
            "threads": "<int> (optional)",
            "select": "<str> (optional)",
            "exclude": "<str> (optional)",
            "selector": "<str> (optional)",
            "state": "<str> (optional)"
        }
}
```

### Сборка ([документация](/reference/commands/build))

```json
{
	"jsonrpc": "2.0",
	"method": "build",
	"id": "<request id>",
	"params": {
            "threads": "<int> (optional)",
            "select": "<str> (optional)",
            "exclude": "<str> (optional)",
            "selector": "<str> (optional)",
            "state": "<str> (optional)",
            "defer": "<str> (optional)"
        }
}
```

### Перечисление ресурсов проекта ([документация](cmd-docs#dbt-docs-generate))

**Дополнительные параметры:**
 - `resource_types`: Фильтрация выбранных ресурсов по типу
 - `output_keys`: Укажите, какие свойства узла включить в вывод

 ```json
 {
 	"jsonrpc": "2.0",
 	"method": "ls",
 	"id": "<request id>",
 	"params": {
         "select": "<str> (optional)",
         "exclude": "<str> (optional)",
         "selector": "<str> (optional)",
         "resource_types": ["<list> (optional)"],
         "output_keys": ["<list> (optional)"],
     }
 }
 ```

### Генерация документации ([документация](cmd-docs#dbt-docs-generate))

**Дополнительные параметры:**
 - `compile`: Если True, скомпилировать проект перед генерацией каталога (необязательно, по умолчанию=false)

```json
{
	"jsonrpc": "2.0",
	"method": "docs.generate",
	"id": "<request id>",
	"params": {
            "compile": "<bool> (optional)",
            "state": "<str> (optional)"
        }
}
```

## Компиляция и выполнение SQL-запросов

### Компиляция запроса

Этот запрос компилирует SQL `select {{ 1 + 1 }} as id` (закодированный в base64) и отправляет его на rpc‑сервер:

<File name='rpc-spec.json'>

```json
{
    "jsonrpc": "2.0",
    "method": "compile_sql",
    "id": "2db9a2fe-9a39-41ef-828c-25e04dd6b07d",
    "params": {
        "timeout": 60,
        "sql": "c2VsZWN0IHt7IDEgKyAxIH19IGFzIGlk",
        "name": "my_first_query"
    }
}
```

</File>

Результирующий ответ будет включать ключ `compiled_sql` со значением `'select 2'`.

### Выполнение запроса

Этот запрос выполняет SQL `select {{ 1 + 1 }} as id` (закодированный в base64) на RPC‑сервере:

<File name='rpc-run.json'>

```json
{
    "jsonrpc": "2.0",
    "method": "run_sql",
    "id": "2db9a2fe-9a39-41ef-828c-25e04dd6b07d",
    "params": {
        "timeout": 60,
        "sql": "c2VsZWN0IHt7IDEgKyAxIH19IGFzIGlk",
        "name": "my_first_query"
    }
}
```

</File>

Результирующий ответ будет включать ключ `table` со значением `{'column_names': ['?column?'], 'rows': [[2.0]]}`.

## Перезагрузка RPC-сервера

Когда сервер dbt RPC запускается, он загружает проект dbt в память, используя файлы, присутствующие на диске при запуске. Если файлы в проекте dbt изменяются (либо во время разработки, либо при развертывании), сервер dbt RPC может быть обновлен в реальном времени без перезапуска процесса сервера. Чтобы перезагрузить файлы, присутствующие на диске, отправьте сигнал "hangup" работающему процессу сервера, используя идентификатор процесса (pid) работающего процесса.

### Поиск PID сервера

Чтобы найти PID сервера, либо получите значение `.result.pid` из ответа метода `status` на сервере, либо используйте `ps`:

```
# Найдите PID сервера, используя `ps`:
ps aux | grep 'dbt-rpc serve' | grep -v grep
```

После нахождения PID для процесса (например, 12345), отправьте сигнал работающему серверу, используя команду `kill`:

```
kill -HUP 12345
```

Когда сервер получает сигнал HUP (hangup), он повторно анализирует файлы на диске и использует обновленный код проекта при обработке последующих запросов.