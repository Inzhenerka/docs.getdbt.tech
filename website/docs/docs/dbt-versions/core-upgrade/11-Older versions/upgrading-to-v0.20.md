---
title: "Обновление до версии v0.20"
id: "upgrading-to-v0.20"
displayed_sidebar: "docs"
---

:::caution Неподдерживаемая версия
dbt Core v0.20 достиг конца критической поддержки. Новые патч-версии выпускаться не будут, и она перестанет работать в dbt Cloud 30 июня 2022 года. Прочитайте ["О версиях dbt Core"](/docs/dbt-versions/core) для получения более подробной информации.
:::

### Ресурсы

- [Discourse](https://discourse.getdbt.com/t/2621)
- [Примечания к выпуску](https://github.com/dbt-labs/dbt-core/releases/tag/v0.20.0)
- [Полный список изменений](https://github.com/dbt-labs/dbt-core/blob/0.20.latest/CHANGELOG.md)

## Изменения, нарушающие обратную совместимость

- Макросы тестов схем теперь являются блоками `test`, которые мы начнем называть "универсальными тестами". Существует обратная совместимость для макросов тестов схем с префиксом `test_`, и вы все еще можете использовать их без перехода на блоки тестов (хотя мы надеемся, что вы скоро это сделаете!). Самое большое изменение, нарушающее совместимость, заключается в том, что _все_ тесты теперь возвращают набор строк с ошибками, а не одно числовое значение. Это решило давнее несоответствие между тестами схем и тестами данных.
- **Для разработчиков пакетов (и некоторых пользователей):** Синтаксис для `adapter.dispatch()` изменился; см. связанную документацию ниже.
- **Для разработчиков плагинов адаптеров:** Диспетчеризация макросов теперь включает "родительские" реализации адаптеров перед использованием реализации по умолчанию. Если вы поддерживаете плагин адаптера, который наследуется от другого адаптера (например, `dbt-redshift` наследуется от `dbt-postgres`), `adapter.dispatch()` теперь будет искать макросы с префиксами в следующем порядке: `redshift__`, `postgres__`, `default__`.
- **Для пользователей артефактов:** [manifest](/reference/artifacts/manifest-json) и [run_results](/reference/artifacts/run-results-json) теперь используют схему v2. Что изменилось: в манифесте появилось несколько новых свойств; количество ошибок для теста было перемещено в новое свойство `failures`, чтобы `message` мог быть читаемым сообщением об ошибке.

## Новая и измененная документация

### Тесты

- [Создание проекта dbt: тесты](/docs/build/data-tests)
- [Конфигурации тестов](/reference/data-test-configs)
- [Свойства тестов](/reference/resource-properties/data-tests)
- [Выбор узлов](/reference/node-selection/syntax) (с обновленными [примерами выбора тестов](/reference/node-selection/test-selection-examples))
- [Написание пользовательских универсальных тестов](/best-practices/writing-custom-generic-tests)

### В других частях Core
- [Парсинг](/reference/parsing): переработка частичного парсинга, введение экспериментального парсера
- Переменная контекста Jinja [graph](/reference/dbt-jinja-functions/graph) включает `exposures`
- [Пакеты](/docs/build/packages) теперь могут быть установлены из git с использованием конкретного хэша коммита в качестве ревизии или через разреженную проверку, если проект dbt находится в `subdirectory`.
- [adapter.dispatch](/reference/dbt-jinja-functions/dispatch) поддерживает новые аргументы, новую [конфигурацию на уровне проекта](/reference/project-configs/dispatch-config) и включает родительские адаптеры при поиске реализаций макросов.
- [Exposures](/reference/exposure-properties) поддерживают свойства `tags` и `meta`

### Плагины
- Новые конфигурации, связанные с разделами, для [BigQuery](/reference/resource-configs/bigquery-configs#additional-partition-configs): `require_partition_filter` и `partition_expiration_days`
- В BigQuery dbt теперь может добавлять элементы [комментариев к запросам](/reference/project-configs/query-comment) в качестве меток заданий
- В Snowflake и BigQuery [инкрементальные модели](/docs/build/incremental-strategy#strategy-specific-configs), использующие стратегию `merge`, принимают новую необязательную конфигурацию, `merge_update_columns`.
- [Конфигурации Postgres](/reference/resource-configs/postgres-configs) теперь включают полноценную поддержку `indexes`