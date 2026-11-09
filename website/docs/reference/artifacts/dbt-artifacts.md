---
title: "Об артефактах dbt"
sidebar_label: "Об артефактах dbt"
---

<VersionBlock lastVersion="1.11">

При каждом вызове dbt создает и сохраняет один или несколько *артефактов*. Некоторые из них — файлы <Term id="json" /> (`semantic_manifest.json`, `manifest.json`, `catalog.json`, `run_results.json` и `sources.json`), которые используются для следующих возможностей:

</VersionBlock>

<VersionBlock firstVersion="1.12">

При каждом вызове dbt создает и сохраняет один или несколько *артефактов*. Некоторые из них — файлы <Term id="json" /> (`semantic_manifest.json`, `osi_document.json`, `manifest.json`, `catalog.json`, `run_results.json` и `sources.json`), которые используются для следующих возможностей:

</VersionBlock>

- [документация](/docs/explore/build-and-view-your-docs)
- [состояние](/reference/node-selection/syntax#how-does-selection-work)
- [визуализация актуальности данных источников](/docs/build/sources#source-data-freshness)

Они также могут быть использованы для:

- получать инсайты о вашем [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl)
- рассчитывать покрытие тестами на уровне проекта
- выполнять продольный анализ времени выполнения запусков
- выявлять исторические изменения в структуре <Term id="table" />
- и делать многое, многое другое

### Когда создаются артефакты? <Lifecycle status="self_service,managed" /> {#when-are-artifacts-produced}

Большинство команд dbt (и соответствующих методов RPC) создают артефакты:
- [семантический манифест](/reference/artifacts/sl-manifest): создаётся при каждом разборе вашего проекта dbt
<VersionBlock firstVersion="1.12">

- [документ Apache Ossie](/reference/artifacts/sl-manifest#apache-ossie-document): создаётся при каждом разборе вашего проекта dbt

</VersionBlock>
- [манифест](/reference/artifacts/manifest-json): создаётся командами, которые читают и анализируют ваш проект
- [результаты выполнения](/reference/artifacts/run-results-json): создаются командами, которые выполняют, компилируют или каталогизируют узлы вашего DAG
- [каталог](/reference/artifacts/catalog-json): создаётся командой `docs generate`
<VersionBlock lastVersion="1.99">

- [источники](/reference/artifacts/sources-json): создаётся командой `dbt source freshness`

</VersionBlock>
<VersionBlock firstVersion="2.0">

- [источники](/reference/artifacts/sources-json): создаётся командой `dbt freshness`, если включены источники; сохраняется для обратной совместимости
- [актуальность данных](/reference/artifacts/freshness-json): создаётся командой [`dbt freshness`](/reference/commands/freshness); охватывает как источники, так и модели с настроенной проверкой актуальности данных; поле `resource_type` в каждой записи позволяет различать их

</VersionBlock>

При выполнении команд из [<Constant name="dbt" /> CLI](/docs/platform/dbt-cli-installation) все артефакты скачиваются по умолчанию. Если вы хотите изменить это поведение, см. раздел [Как отключить скачивание артефактов](/docs/platform/configure-dbt-cli#considerations-1).

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

В манифесте `metadata` также может содержать:
- `send_anonymous_usage_stats`: Отправлялась ли [анонимная статистика использования](/reference/global-configs/usage-stats) во время выполнения этого вызова.
- `project_name`: Значение `name`, определённое в файле `dbt_project.yml` корневого проекта. (Добавлено в манифесте v10 / <Constant name="dbt" /> v1.6)
- `project_id`: Идентификатор проекта, полученный хешированием `project_name`; отправляется вместе с анонимной статистикой использования, если её отправка включена.
- `user_id`: Идентификатор пользователя, по умолчанию хранящийся в `~/dbt/.user.yml`; отправляется вместе с анонимной статистикой использования, если её отправка включена.

#### Примечания: {#notes}

- Структура dbt артефактов канонизирована с помощью [JSON схем](https://json-schema.org/), которые размещены на [schemas.getdbt.com](https://schemas.getdbt.com/).
- Версии артефактов могут изменяться в любой минорной версии dbt (`v1.x.0`). Каждый артефакт версионируется независимо.

## Связанные документы {#related-docs}
- [Другие артефакты](/reference/artifacts/other-artifacts) файлы, такие как `index.html` или `graph_summary.json`.