---
title: "О команде dbt parse"
sidebar_label: "parse"
description: "Прочтите это руководство, чтобы узнать, как команда dbt parse может быть использована для разбора вашего проекта dbt и записи детальной информации о времени выполнения."
id: "parse"
---

Команда `dbt parse` разбирает и проверяет содержимое вашего проекта dbt. Если ваш проект содержит ошибки синтаксиса Jinja или YAML, команда завершится с ошибкой.

Она также создаст артефакт с детальной информацией о времени выполнения, что полезно для понимания времени разбора для больших проектов. Обратитесь к [Разбор проекта](/reference/parsing) для получения дополнительной информации.

Начиная с версии v1.5, команда `dbt parse` будет записывать или возвращать [manifest](/reference/artifacts/manifest-json), позволяя вам исследовать то, как dbt «видит» все ресурсы в вашем проекте. Поскольку `dbt parse` не подключается к вашему хранилищу данных, [этот manifest не будет содержать скомпилированного кода](/faqs/Warehouse/db-connection-dbt-compile).

По умолчанию <Constant name="cloud_ide" /> пытается выполнить «частичный» парсинг, то есть проверяет только изменения с момента последнего запуска парсинга (новые или обновлённые части проекта, которые вы изменяли). Так как <Constant name="cloud_ide" /> автоматически выполняет парсинг в фоновом режиме каждый раз, когда вы сохраняете свою работу, ручной запуск `dbt parse` обычно будет быстрым, поскольку он анализирует только последние изменения.

В качестве опции, вы можете указать dbt проверить весь проект с нуля, используя флаг `--no-partial-parse`. Это заставит dbt выполнить полный повторный разбор проекта, а не только последние изменения.

```
$ dbt parse
13:02:52  Running with dbt=1.5.0
13:02:53  Performance info: target/perf_info.json
```

<File name='target/perf_info.json'>

```json
{
    "path_count": 7,
    "is_partial_parse_enabled": false,
    "parse_project_elapsed": 0.20151838900000008,
    "patch_sources_elapsed": 0.00039490800000008264,
    "process_manifest_elapsed": 0.029363873999999957,
    "load_all_elapsed": 0.240095269,
    "projects": [
        {
            "project_name": "my_project",
            "elapsed": 0.07518750299999999,
            "parsers": [
                {
                    "parser": "model",
                    "elapsed": 0.04545303199999995,
                    "path_count": 1
                },
                {
                    "parser": "operation",
                    "elapsed": 0.0006415469999998535,
                    "path_count": 1
                },
                {
                    "parser": "seed",
                    "elapsed": 0.026538173000000054,
                    "path_count": 2
                }
            ],
            "path_count": 4
        },
        {
            "project_name": "dbt_postgres",
            "elapsed": 0.0016448299999998195,
            "parsers": [
                {
                    "parser": "operation",
                    "elapsed": 0.00021672399999994596,
                    "path_count": 1
                }
            ],
            "path_count": 1
        },
        {
            "project_name": "dbt",
            "elapsed": 0.006580432000000025,
            "parsers": [
                {
                    "parser": "operation",
                    "elapsed": 0.0002488560000000195,
                    "path_count": 1
                },
                {
                    "parser": "docs",
                    "elapsed": 0.002500640000000054,
                    "path_count": 1
                }
            ],
            "path_count": 2
        }
    ]
}
```

</File>