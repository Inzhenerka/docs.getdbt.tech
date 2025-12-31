---
title: "Об артефактах dbt"
sidebar_label: "Об артефактах dbt"
---

При каждом запуске dbt генерирует и сохраняет один или несколько *артефактов*. Несколько из них представляют собой <Term id="json" /> файлы (`semantic_manifest.json`, `manifest.json`, `catalog.json`, `run_results.json` и `sources.json`), которые используются для:

- [документация](/docs/explore/build-and-view-your-docs)
- [состояние](/reference/node-selection/syntax#about-node-selection)
- [визуализация актуальности источников](/docs/build/sources#source-data-freshness)

Они также могут быть использованы для:

- получать инсайты о вашем [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl)
- рассчитывать покрытие тестами на уровне проекта
- выполнять продольный анализ времени выполнения запусков
- выявлять исторические изменения в структуре <Term id="table" />
- и делать многое, многое другое

### Когда создаются артефакты? <Lifecycle status="self_service,managed" /> {#when-are-artifacts-produced}

Большинство команд dbt (и соответствующих RPC методов) создают артефакты:
- [семантический манифест](/reference/artifacts/sl-manifest): создается всякий раз, когда ваш dbt проект анализируется
- [манифест](/reference/artifacts/manifest-json): создается командами, которые читают и понимают ваш проект
- [результаты выполнения](/reference/artifacts/run-results-json): создается командами, которые выполняют, компилируют или каталогизируют узлы в вашем DAG
- [каталог](/reference/artifacts/catalog-json): создается командой `docs generate`
- [источники](/reference/artifacts/sources-json): создается командой `source freshness`

При запуске команд из [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation) по умолчанию загружаются все артефакты. Если вы хотите изменить это поведение, обратитесь к разделу [How to skip artifacts from being downloaded](/docs/cloud/configure-cloud-cli#how-to-skip-artifacts-from-being-downloaded).

## Где создаются артефакты? {#where-are-artifacts-produced}

По умолчанию артефакты записываются в директорию `/target` вашего dbt проекта. Вы можете настроить расположение с помощью флага [`target-path`](/reference/global-configs/json-artifacts).

## Общие метаданные {#common-metadata}

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

#### Примечания: {#notes}

- Структура dbt артефактов канонизирована с помощью [JSON схем](https://json-schema.org/), которые размещены на [schemas.getdbt.com](https://schemas.getdbt.com/).
- Версии артефактов могут изменяться в любой минорной версии dbt (`v1.x.0`). Каждый артефакт версионируется независимо.

## Связанные документы {#related-docs}
- [Другие артефакты](/reference/artifacts/other-artifacts) файлы, такие как `index.html` или `graph_summary.json`.