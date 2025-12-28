---
title: "dbt Model Context Protocol"
sidebar_label: "Model Context Protocol"
description: "Узнайте о сервере dbt MCP"
id: "about-mcp"
---

# О dbt Model Context Protocol (MCP)

По мере того как ИИ все глубже интегрируется в дата‑процессы, пользователям dbt необходим удобный способ доступа к структурированным метаданным dbt и контексту выполнения, а также их эффективной интеграции. На этой странице представлен обзор MCP Server от dbt, который предоставляет этот контекст и поддерживает такие сценарии использования, как диалоговый доступ к данным, агентно‑ориентированная автоматизация dbt‑воркфлоу и разработка с помощью ИИ.

[Сервер dbt Model Context Protocol (MCP)](https://github.com/dbt-labs/dbt-mcp) предоставляет стандартизированный фреймворк, который позволяет пользователям бесшовно интегрировать ИИ‑приложения с управляемыми dbt дата‑активами независимо от используемых платформ данных. Это обеспечивает единообразный и управляемый доступ к моделям, метрикам, lineage и freshness в различных ИИ‑инструментах.

MCP server предоставляет доступ к dbt CLI, [API](/docs/dbt-cloud-apis/overview), [Discovery API](/docs/dbt-cloud-apis/discovery-api) и [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). Он также обеспечивает доступ к приватным API, text‑to‑SQL и выполнению SQL.

Для получения дополнительной информации о MCP см. [Get started with the Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction).

<!--TODO need to create>
## Architecture

There are two ways to access the dbt-mcp server: locally hosted or remotely hosted on the cloud-based dbt platform.

<-->

## Доступ к серверу

Использовать dbt MCP server можно двумя способами: локально или удаленно. Выберите вариант, который лучше всего подходит под ваш рабочий процесс:

### Локальный MCP server

Локальный MCP server обеспечивает наилучший опыт для задач разработки, таких как создание dbt‑моделей, тестов и документации.

[Локальный MCP server](/docs/dbt-ai/setup-local-mcp) запускается на вашей машине и требует установки `uvx` (который устанавливает dbt-mcp локально). Этот вариант предоставляет:
- Полный доступ к командам dbt CLI (`dbt run`, `dbt build`, `dbt test` и другие)
- Поддержку <Constant name="core" />, <Constant name="cloud_cli" /> и <Constant name="fusion_engine" />
- Возможность работать с локальными dbt‑проектами без необходимости иметь учетную запись <Constant name="dbt_platform" />
- Опциональную интеграцию с API <Constant name="dbt_platform" /> для обнаружения метаданных и доступа к Semantic Layer

### Удаленный MCP server

Удаленный MCP server от dbt ориентирован на сценарии потребления данных и не требует локальной установки.

[Удаленный MCP server](/docs/dbt-ai/setup-remote-mcp) подключается к <Constant name="dbt_platform" /> по HTTP и не требует установки на локальной машине. Этот вариант полезен, если:
- Вы не хотите устанавливать дополнительное ПО или у вас есть ограничения на его установку.
- Ваш сценарий использования в основном связан с потреблением данных (например, запрос метрик, исследование метаданных, просмотр lineage).

import MCPCreditUsage from '/snippets/_mcp-credit-usage.md';

<MCPCreditUsage />

## Доступные инструменты

### Поддерживаемые
dbt MCP server имеет доступ ко многим частям экосистемы dbt, связанным с разработкой, развертыванием и исследованием данных. Ниже приведены категории инструментов, доступные в зависимости от типа MCP server, к которому вы подключаетесь, а также указано, какие инструменты доступны LLM.

| Инструменты | Local | Remote |
| --- | --- | --- |
| dbt CLI  | ✅ | ❌ |
| Semantic Layer | ✅ | ✅ |
| SQL  | ✅ | ✅ |
| Metadata Discovery| ✅ | ✅ |
| Administrative API | ✅ | ❌ |
| Fusion Tools | ✅ | ✅ |

Обратите внимание, что доступ к Discovery API и Semantic Layer API ограничен в зависимости от вашего [типа плана](https://www.getdbt.com/pricing).

### Команды dbt CLI

- `build`: Выполняет модели, тесты, snapshots и seeds в порядке зависимостей
- `compile`: Генерирует исполняемый SQL из моделей, тестов и analyses без их выполнения
- `docs`: Генерирует документацию для dbt‑проекта
- `ls` (list): Выводит список ресурсов в dbt‑проекте, таких как модели и тесты
- `parse`: Парсит и валидирует файлы проекта на корректность синтаксиса
- `run`: Выполняет модели и материализует их в базе данных
- `test`: Запускает тесты для проверки данных и целостности моделей
- `show`: Выполняет запрос к data warehouse

Разрешение клиенту использовать команды dbt через MCP‑инструменты может привести к изменениям в моделях данных, источниках и объектах хранилища. Используйте это только в том случае, если вы доверяете клиенту и понимаете потенциальные последствия.

### Semantic Layer

Чтобы узнать больше о dbt Semantic Layer, перейдите [сюда](/docs/use-dbt-semantic-layer/dbt-sl).

- `list_metrics`: Возвращает все определенные метрики
- `get_dimensions`: Возвращает измерения, связанные с указанными метриками
- `get_entities`: Возвращает сущности, связанные с указанными метриками
- `query_metrics`: Выполняет запрос метрик с опциональной группировкой, сортировкой, фильтрацией и ограничением
- `get_metrics_compiled_sql`: Возвращает скомпилированный SQL для указанных метрик и группировок без выполнения запроса

### Metadata Discovery

Чтобы узнать больше о dbt Discovery API, перейдите [сюда](/docs/dbt-cloud-apis/discovery-api).

- `get_mart_models`: Возвращает все mart‑модели
- `get_all_models`: Возвращает все модели
- `get_model_details`: Возвращает детали конкретной модели
- `get_model_parents`: Возвращает родительские узлы конкретной модели
- `get_model_children`: Возвращает дочерние модели конкретной модели
- `get_model_health`: Возвращает сигналы состояния (health) конкретной модели
- `get_all_sources`: Возвращает все source‑таблицы с метаданными и информацией о freshness
- `get_source_details`: Возвращает детали конкретного source
- `get_exposures`: Возвращает все exposures
- `get_exposure_details`: Возвращает детали конкретного exposure или списка exposures
- `get_related_models`: Использует семантический поиск для нахождения dbt‑моделей, похожих на запрос, даже если нет точного совпадения строки.
- `get_macro_details`: Возвращает детали конкретного macro
- `get_seed_details`: Возвращает детали конкретного seed
- `get_semantic_model_details`: Возвращает детали конкретной semantic‑модели
- `get_snapshot_details`: Возвращает детали конкретного snapshot
- `get_test_details`: Возвращает детали конкретного теста

### Administrative API

Чтобы узнать больше о dbt Administrative API, перейдите [сюда](/docs/dbt-cloud-apis/admin-cloud-api).

- `list_jobs`: Возвращает список всех jobs в учетной записи dbt
- `get_job_details`: Возвращает подробную информацию о конкретном job, включая конфигурацию и настройки
- `trigger_job_run`: Запускает выполнение job с опциональными переопределениями параметров, такими как Git‑ветка, схема или параметры выполнения
- `list_jobs_runs`: Возвращает список запусков в учетной записи с возможностью фильтрации по job, статусу или другим критериям
- `get_job_run_details`: Возвращает подробную информацию о запуске, включая детали выполнения, шаги, артефакты и debug‑логи
- `cancel_job_run`: Отменяет выполняющийся job
- `retry_job_run`: Повторно запускает неудавшийся job
- `list_job_run_artifacts`: Возвращает список всех доступных артефактов запуска job (manifest.json, catalog.json, логи и т.д.)
- `get_job_run_artifact`: Загружает конкретный файл артефакта запуска job для анализа или интеграции
- `get_job_run_error`: Возвращает детали ошибок для неудавшихся запусков job, чтобы упростить диагностику (включает опцию возврата предупреждений и сведений о депрекейтах)

### SQL (remote)

- `text_to_sql`: Генерирует SQL из запросов на естественном языке
- `execute_sql`: Выполняет SQL на backend‑инфраструктуре dbt platform с поддержкой синтаксиса Semantic Layer SQL. Примечание: для этого инструмента требуется использовать PAT вместо service token в `DBT_TOKEN`.

### Codegen tools

Эти инструменты помогают автоматизировать генерацию шаблонного кода для файлов dbt‑проекта. Чтобы использовать их, установите [dbt-codegen](https://hub.getdbt.com/dbt-labs/codegen/latest/) в ваш dbt‑проект. По умолчанию эти инструменты отключены. Чтобы включить их, установите переменную окружения `DISABLE_DBT_CODEGEN` в значение `false`.

- `generate_source`: Создает YAML‑описания sources на основе схем базы данных.
- `generate_model_yaml`: Генерирует YAML‑документацию для существующих dbt‑моделей, включая имена колонок, типы данных и placeholders для описаний.
- `generate_staging_model`: Создает staging SQL‑модели из sources для преобразования сырых данных в чистые staging‑модели.

### Fusion tools (remote)

Набор инструментов, использующих движок <Constant name="fusion" /> для расширенной компиляции SQL и анализа lineage на уровне колонок.

- `compile_sql`: Компилирует SQL‑выражение в контексте текущего проекта и окружения.
- `get_column_lineage`: Эксклюзивно для <Constant name="fusion" />! Возвращает информацию о lineage колонок по DAG проекта для конкретной колонки.

### Fusion tools (local)

Набор инструментов, использующих движок <Constant name="fusion" /> через локально запущенный <Constant name="fusion" /> Language Server Protocol (LSP) в VS Code или Cursor с расширением dbt для VS Code.

- `get_column_lineage`: Эксклюзивно для <Constant name="fusion" />! Возвращает информацию о lineage колонок по DAG проекта для конкретной колонки.

## MCP‑интеграции

dbt MCP server интегрируется с любым [MCP client](https://modelcontextprotocol.io/clients), который поддерживает аутентификацию по токену и использование инструментов.

Мы также подготовили гайды по интеграции для следующих клиентов:
- [Claude](/docs/dbt-ai/integrate-mcp-claude)
- [Cursor](/docs/dbt-ai/integrate-mcp-cursor)
- [VS Code](/docs/dbt-ai/integrate-mcp-vscode)

## Ресурсы
- Дополнительную информацию см. в нашем блоге: [Introducing the dbt MCP Server](/blog/introducing-dbt-mcp-server#getting-started).
