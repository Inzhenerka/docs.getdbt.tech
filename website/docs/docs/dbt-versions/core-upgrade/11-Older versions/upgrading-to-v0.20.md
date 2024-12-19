---
title: "Обновление до v0.20"
id: "upgrading-to-v0.20"
displayed_sidebar: "docs"
---

:::caution Не поддерживаемая версия
dbt Core v0.20 достиг конца критической поддержки. Новые патч-версии не будут выпускаться, и он перестанет работать в dbt Cloud 30 июня 2022 года. Читайте ["О версиях dbt Core"](/docs/dbt-versions/core) для получения дополнительной информации.
:::

### Ресурсы

- [Discourse](https://discourse.getdbt.com/t/2621)
- [Примечания к выпуску](https://github.com/dbt-labs/dbt-core/releases/tag/v0.20.0)
- [Полный журнал изменений](https://github.com/dbt-labs/dbt-core/blob/0.20.latest/CHANGELOG.md)

## Ломающие изменения

- Макросы тестов схемы теперь являются блоками `test`, которые мы начнем называть "универсальными тестами". Существует обратная совместимость для макросов тестов схемы с префиксом `test_`, и вы все еще можете использовать их без перехода на блоки тестов (хотя мы надеемся, что вы сделаете это в ближайшее время!). Самое значительное ломающее изменение заключается в том, что _все_ тесты теперь возвращают набор неудачных строк, а не одно числовое значение. Это решило давнюю несоответствие между тестами схемы и тестами данных.
- **Для поддерживающих пакеты (и некоторых пользователей):** Синтаксис для `adapter.dispatch()` изменился; смотрите связанную документацию ниже.
- **Для поддерживающих плагины адаптеров:** Диспетчеризация макросов теперь включает реализации "родительского" адаптера перед использованием реализации по умолчанию. Если вы поддерживаете плагин адаптера, который наследуется от другого адаптера (например, `dbt-redshift` наследуется от `dbt-postgres`), `adapter.dispatch()` теперь будет искать префиксированные макросы в следующем порядке: `redshift__`, `postgres__`, `default__`.
- **Для пользователей артефактов:** [манифест](/reference/artifacts/manifest-json) и [run_results](/reference/artifacts/run-results-json) теперь используют схему v2. Что изменилось: в манифесте появилось несколько новых свойств; количество неудач для теста было перемещено в новое свойство `failures`, чтобы `message` мог быть читаемым сообщением об ошибке.

## Новая и измененная документация

### Тесты

- [Создание проекта dbt: тесты](/docs/build/data-tests)
- [Конфигурации тестов](/reference/data-test-configs)
- [Свойства тестов](/reference/resource-properties/data-tests)
- [Выбор узлов](/reference/node-selection/syntax) (с обновленными [примерами выбора тестов](/reference/node-selection/test-selection-examples))
- [Написание пользовательских универсальных тестов](/best-practices/writing-custom-generic-tests)

### В других частях Core
- [Парсинг](/reference/parsing): переработка частичного парсинга, введение экспериментального парсера
- Контекстная переменная [графа](/reference/dbt-jinja-functions/graph) Jinja включает `exposures`
- [Пакеты](/docs/build/packages) теперь могут устанавливаться из git с конкретным хешем коммита в качестве ревизии или через разреженную выборку, если проект dbt находится в `подкаталоге`.
- [adapter.dispatch](/reference/dbt-jinja-functions/dispatch) поддерживает новые аргументы, новую [конфигурацию на уровне проекта](/reference/project-configs/dispatch-config) и включает родительские адаптеры при поиске реализаций макросов.
- [Exposures](/reference/exposure-properties) поддерживают свойства `tags` и `meta`

### Плагины
- Новые конфигурации, связанные с разделением [BigQuery](/reference/resource-configs/bigquery-configs#additional-partition-configs): `require_partition_filter` и `partition_expiration_days`
- В BigQuery dbt теперь может добавлять [комментарии к запросам](/reference/project-configs/query-comment) в качестве меток задач
- [Инкрементальные модели](/docs/build/incremental-strategy#strategy-specific-configs) Snowflake и BigQuery, использующие стратегию `merge`, принимают новую необязательную конфигурацию `merge_update_columns`.
- [Конфигурации Postgres](/reference/resource-configs/postgres-configs) теперь включают первоклассную поддержку `indexes`