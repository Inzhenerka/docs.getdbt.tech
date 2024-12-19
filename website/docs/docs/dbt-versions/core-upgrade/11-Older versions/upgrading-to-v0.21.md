---
title: "Обновление до v0.21"
id: "upgrading-to-v0.21"
displayed_sidebar: "docs"

---

:::caution Не поддерживаемая версия
dbt Core v0.21 достиг конца критической поддержки. Новые патч-версии не будут выпускаться, и он перестанет работать в dbt Cloud 30 июня 2022 года. Читайте ["О версиях dbt Core"](/docs/dbt-versions/core) для получения дополнительной информации.
:::

### Ресурсы

- [Discourse](https://discourse.getdbt.com/t/3077)
- [Примечания к выпуску](https://github.com/dbt-labs/dbt-core/releases/tag/v0.21.0)
- [Полный журнал изменений](https://github.com/dbt-labs/dbt-core/blob/0.21.latest/CHANGELOG.md)

## Ломающие изменения

- `dbt source snapshot-freshness` был переименован в `dbt source freshness`. Логика выбора узлов теперь согласована с другими задачами. Чтобы проверить свежесть для конкретного источника, необходимо предварить его `source:`.
- **Snowflake:** По умолчанию отключены транзакции и включен `autocommit`. Внутри материализаций dbt оборачивайте [DML-операторы](https://stackoverflow.com/a/44796508) в явные `begin` и `commit`. Обратите внимание, что не рекомендуется выполнять <Term id="dml" /> операторы вне логики <Term id="materialization" /> dbt. Если вы это сделаете, несмотря на наши рекомендации, вам нужно будет обернуть эти операторы в явные `begin` и `commit`. Также обратите внимание, что это может повлиять на код пользовательского пространства, который зависит от транзакций, например, на пред- и пост-хуки, которые указывают `transaction: true` или `transaction: false`. Мы рекомендуем удалить эти ссылки на транзакции.
- **Артефакты:**
    - [`manifest.json`](/reference/artifacts/manifest-json) использует схему `v3`, которая включает дополнительные свойства узлов (без изменений в существующих свойствах)
    - [`run_results.json`](/reference/artifacts/run-results-json) использует схему `v3`, в которой добавлено `skipped` как потенциальный `TestResult`
    - [`sources.json`](/reference/artifacts/sources-json) имеет новую схему `v2`, в которой добавлены детали времени и потока

## Новая и измененная документация

### Задачи
- [Команды](/reference/dbt-commands), [`build`](/reference/commands/build), [rpc](/reference/commands/rpc): Добавлена команда `dbt build`
- [Команды: `source`](/reference/commands/source): Переименована в `dbt source freshness`.
- [`deps`](/reference/commands/deps): Добавлен логгинг для устаревших пакетов в `dbt deps`
- [`list`](/reference/commands/list): Добавлен флаг `--output-keys` и параметр RPC

## Выбор
- [Команды: `source`](/reference/commands/source): Обновлена логика выбора, чтобы соответствовать другим задачам. При выборе конкретного источника для проверки свежести, необходимо предварить его `source:`.
- [Синтаксис выбора узлов](/reference/node-selection/syntax), [команды](/reference/dbt-commands): Замените `--models` на `--select` повсеместно. (Команды, которые ранее использовали флаг `--models`, по-прежнему поддерживают его для обратной совместимости.)
- [YAML селекторы](/reference/node-selection/yaml-selectors#default) теперь поддерживают необязательное свойство `default`. Если оно установлено, dbt будет использовать пользовательские критерии выбора для команд, которые не указывают свои собственные флаги выбора/исключения.
- [Методы выбора](/reference/node-selection/methods) и [предостережения по сравнению состояний](/reference/node-selection/state-comparison-caveats): Добавлены подселекторы `state:modified`, и отражено, что теперь они включают изменения в верхних макросах.
- [Примеры выбора тестов](/reference/node-selection/test-selection-examples) содержат больше обсуждений о косвенном выборе (изменение в v0.20) и необязательном флаге/свойстве "жадный" (новое в v0.21), который вы можете установить, чтобы включить тесты, имеющие смесь выбранных и невыбранных родителей.

### В других частях Core
- Документация по [конфигурациям ресурсов и свойствам](/reference/configs-and-properties) была консолидирована и согласована. Новое свойство `config`, которое позволяет настраивать модели, семена, снимки и тесты во всех YAML файлах.
- [Конфигурирование инкрементальных моделей](/docs/build/incremental-models): Новая необязательная конфигурация для инкрементальных моделей, `on_schema_change`.
- [Переменные окружения](/reference/dbt-jinja-functions/env_var): Добавлен префикс для очистки логов, `DBT_ENV_SECRET_`
- Конфигурация `where` для тестов (/reference/resource-configs/where) была реализована заново как макрос (`get_where_subquery`), который вы также можете переопределить.
- [`dispatch`](/reference/dbt-jinja-functions/dispatch) теперь поддерживает переопределение глобальных макросов, находящихся в пространстве имен макросов `dbt`, с версиями из установленных пакетов, используя `search_order` в [конфигурации проекта `dispatch`](/reference/project-configs/dispatch-config).

### Плагины
- **Postgres** свойство [профиля](/docs/core/connect-data-platform/postgres-setup) `connect_timeout` теперь настраиваемое. Также применимо к дочерним плагинам (например, `dbt-redshift`).
- **Redshift**: свойство [профиля](/docs/core/connect-data-platform/redshift-setup) `ra3_node: true` для поддержки определения источников из разных баз данных и запросов только для чтения.
- **BigQuery**: свойство [профиля](/docs/core/connect-data-platform/bigquery-setup) `execution_project` теперь настраиваемое. [Снимки](/docs/build/snapshots) поддерживают конфигурационные псевдонимы `target_project` и `target_dataset`.
