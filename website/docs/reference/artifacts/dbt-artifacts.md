---
title: "О dbt артефактах"
sidebar_label: "О dbt артефактах"
---

При каждом запуске dbt генерирует и сохраняет один или несколько *артефактов*. Несколько из них представляют собой <Term id="json" /> файлы (`semantic_manifest.json`, `manifest.json`, `catalog.json`, `run_results.json` и `sources.json`), которые используются для:

- [документации](/docs/collaborate/build-and-view-your-docs)
- [состояния](/reference/node-selection/syntax#about-node-selection)
- [визуализации свежести источников](/docs/build/sources#source-data-freshness)

Они также могут быть использованы для:

- получения информации о вашем [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl)
- расчета покрытия тестами на уровне проекта
- выполнения продольного анализа времени выполнения
- выявления исторических изменений в структуре <Term id="table" />
- и многого другого

dbt создает артефакты с момента выпуска dbt-docs в версии v0.11.0. Начиная с dbt v0.19.0, мы обязуемся поддерживать стабильный и устойчивый способ версионирования, документирования и валидации dbt артефактов.

### Когда создаются артефакты? <Lifecycle status="team,enterprise"/>

Большинство команд dbt (и соответствующих RPC методов) создают артефакты:
- [семантический манифест](/reference/artifacts/sl-manifest): создается всякий раз, когда ваш dbt проект анализируется
- [манифест](/reference/artifacts/manifest-json): создается командами, которые читают и понимают ваш проект
- [результаты выполнения](/reference/artifacts/run-results-json): создается командами, которые выполняют, компилируют или каталогизируют узлы в вашем DAG
- [каталог](catalog-json): создается командой `docs generate`
- [источники](/reference/artifacts/sources-json): создается командой `source freshness`

При запуске команд из [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) все артефакты загружаются по умолчанию. Если вы хотите изменить это поведение, обратитесь к [Как пропустить загрузку артефактов](/docs/cloud/configure-cloud-cli#how-to-skip-artifacts-from-being-downloaded).

## Где создаются артефакты?

По умолчанию артефакты записываются в директорию `/target` вашего dbt проекта. Вы можете настроить расположение с помощью флага [`target-path`](/reference/global-configs/json-artifacts).

## Общие метаданные

Все артефакты, создаваемые dbt, включают словарь `metadata` с такими свойствами:

- `dbt_version`: Версия dbt, которая создала этот артефакт. Для получения подробной информации о версионировании релизов обратитесь к [Версионирование](/reference/commands/version#versioning).
- `dbt_schema_version`: URL схемы этого артефакта. См. примечания ниже.
- `generated_at`: Временная метка в UTC, когда этот артефакт был создан.
- `adapter_type`: Адаптер (база данных), например, `postgres`, `spark` и т.д.
- `env`: Любые переменные окружения с префиксом `DBT_ENV_CUSTOM_ENV_` будут включены в словарь, где имя переменной без префикса будет ключом.
- [`invocation_id`](/reference/dbt-jinja-functions/invocation_id): Уникальный идентификатор для этого вызова dbt

В манифесте `metadata` также может включать:
- `send_anonymous_usage_stats`: Отправлял ли этот вызов [анонимную статистику использования](/reference/global-configs/usage-stats) во время выполнения.
- `project_name`: `name`, определенное в корневом проекте `dbt_project.yml`. (Добавлено в манифесте v10 / dbt Core v1.6)
- `project_id`: Идентификатор проекта, хешированный из `project_name`, отправляется с анонимной статистикой использования, если она включена.
- `user_id`: Идентификатор пользователя, по умолчанию хранится в `~/dbt/.user.yml`, отправляется с анонимной статистикой использования, если она включена.

#### Примечания:

- Структура dbt артефактов канонизирована с помощью [JSON схем](https://json-schema.org/), которые размещены на [schemas.getdbt.com](https://schemas.getdbt.com/).
- Версии артефактов могут изменяться в любой минорной версии dbt (`v1.x.0`). Каждый артефакт версионируется независимо.

## Связанные документы
- [Другие артефакты](/reference/artifacts/other-artifacts) файлы, такие как `index.html` или `graph_summary.json`.