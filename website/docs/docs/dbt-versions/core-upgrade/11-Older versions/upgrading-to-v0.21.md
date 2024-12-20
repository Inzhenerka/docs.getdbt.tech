---
title: "Обновление до версии v0.21"
id: "upgrading-to-v0.21"
displayed_sidebar: "docs"

---

:::caution Неподдерживаемая версия
dbt Core v0.21 достиг конца критической поддержки. Новые патч-версии выпускаться не будут, и она перестанет работать в dbt Cloud 30 июня 2022 года. Прочитайте ["О версиях dbt Core"](/docs/dbt-versions/core) для получения более подробной информации.
:::

### Ресурсы

- [Discourse](https://discourse.getdbt.com/t/3077)
- [Примечания к выпуску](https://github.com/dbt-labs/dbt-core/releases/tag/v0.21.0)
- [Полный список изменений](https://github.com/dbt-labs/dbt-core/blob/0.21.latest/CHANGELOG.md)

## Критические изменения

- `dbt source snapshot-freshness` был переименован в `dbt source freshness`. Логика выбора узлов теперь согласована с другими задачами. Чтобы проверить свежесть для конкретного источника, вы должны добавить префикс `source:`.
- **Snowflake:** По умолчанию отключены транзакции и включен `autocommit`. Внутри материализаций dbt оберните [DML-операторы](https://stackoverflow.com/a/44796508) в явные `begin` и `commit`. Обратите внимание, что не рекомендуется выполнять <Term id="dml" /> операторы вне логики <Term id="materialization" /> dbt. Если вы все же это делаете, несмотря на наши рекомендации, вам нужно будет обернуть эти операторы в явные `begin` и `commit`. Также обратите внимание, что это может повлиять на код, зависящий от транзакций, например, на pre-hooks и post-hooks, которые указывают `transaction: true` или `transaction: false`. Мы рекомендуем удалить эти ссылки на транзакции.
- **Артефакты:**
    - [`manifest.json`](/reference/artifacts/manifest-json) использует схему `v3`, которая включает дополнительные свойства узлов (изменений в существующих свойствах нет)
    - [`run_results.json`](/reference/artifacts/run-results-json) использует схему `v3`, в которой добавлено `skipped` как возможный `TestResult`
    - [`sources.json`](/reference/artifacts/sources-json) имеет новую схему `v2`, в которой добавлены детали времени и потоков

## Новая и измененная документация

### Задачи
- [Команды](/reference/dbt-commands), [`build`](/reference/commands/build), [rpc](/reference/commands/rpc): Добавлена команда `dbt build`
- [Команды: `source`](/reference/commands/source): Переименована в `dbt source freshness`.
- [`deps`](/reference/commands/deps): Добавлено логирование `dbt deps` для устаревших пакетов
- [`list`](/reference/commands/list): Добавлен флаг `--output-keys` и параметр RPC

## Выбор
- [Команды: `source`](/reference/commands/source): Обновлена логика выбора, чтобы соответствовать другим задачам. При выборе конкретного источника для проверки свежести вы должны добавить префикс `source:`.
- [Синтаксис выбора узлов](/reference/node-selection/syntax), [команды](/reference/dbt-commands): Замените `--models` на `--select` повсеместно. (Команды, которые ранее использовали флаг `--models`, все еще поддерживают его для обратной совместимости.)
- [YAML селекторы](/reference/node-selection/yaml-selectors#default) теперь поддерживают необязательное свойство `default`. Если оно установлено, dbt будет использовать пользовательские критерии выбора для команд, которые не указывают свои собственные флаги выбора/исключения.
- [Методы выбора](/reference/node-selection/methods) и [предостережения по сравнению состояний](/reference/node-selection/state-comparison-caveats): Добавлены подвыборки `state:modified`, и отражено, что теперь они включают изменения в вышестоящих макросах.
- [Примеры выбора тестов](/reference/node-selection/test-selection-examples) включают больше обсуждений косвенного выбора (изменение в v0.20) и необязательного флага/свойства "greedy" (новое в v0.21), которое вы можете установить, чтобы включить тесты, имеющие смесь выбранных и невыбранных родителей.

### В других частях Core
- [Конфигурации и свойства ресурсов](/reference/configs-and-properties) были объединены и согласованы. Новое свойство `config`, которое позволяет настраивать модели, семена, снимки и тесты во всех YAML-файлах.
- [Настройка инкрементальных моделей](/docs/build/incremental-models): Новая необязательная конфигурация для инкрементальных моделей, `on_schema_change`.
- [Переменные окружения](/reference/dbt-jinja-functions/env_var): Добавлен префикс для очистки логов, `DBT_ENV_SECRET_`
- [Конфигурация `where` для тестов](/reference/resource-configs/where) была реализована как макрос (`get_where_subquery`), который вы также можете переопределить
- [`dispatch`](/reference/dbt-jinja-functions/dispatch) теперь поддерживает переопределение глобальных макросов, находящихся в пространстве имен макросов `dbt`, с помощью версий из установленных пакетов, используя `search_order` в [конфигурации проекта `dispatch`](/reference/project-configs/dispatch-config)

### Плагины
- **Postgres** [профиль](/docs/core/connect-data-platform/postgres-setup) свойство `connect_timeout` теперь настраиваемо. Также применимо к дочерним плагинам (например, `dbt-redshift`)
- **Redshift**: [профиль](/docs/core/connect-data-platform/redshift-setup) свойство `ra3_node: true` для поддержки определений источников между базами данных и запросов только для чтения
- **BigQuery**: [профиль](/docs/core/connect-data-platform/bigquery-setup) свойство `execution_project` теперь настраиваемо. [Снимки](/docs/build/snapshots) поддерживают псевдонимы конфигурации `target_project` и `target_dataset`.