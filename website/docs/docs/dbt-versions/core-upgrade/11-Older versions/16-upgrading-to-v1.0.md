---
title: "Обновление до v1.0"
description: Новые функции и изменения в dbt Core v1.0
id: "upgrading-to-v1.0"
displayed_sidebar: "docs"
---


### Ресурсы

- [Discourse](https://discourse.getdbt.com/t/3180)
- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.0.latest/CHANGELOG.md)
- [Руководство по установке dbt Core CLI](/docs/core/installation-overview)
- [Руководство по обновлению в облаке](/docs/dbt-versions/upgrade-dbt-version-in-cloud)

## Что нужно знать перед обновлением

Основная версия dbt Core 1.0 включает ряд изменений, которые могут повлиять на совместимость! Где это возможно, мы предложили обратную совместимость для старого поведения и (где это необходимо) упростили миграцию.

### Переименованные поля в `dbt_project.yml`

**Это касается всех:**
- [model-paths](/reference/project-configs/model-paths) заменили `source-paths` в `dbt-project.yml`.
- [seed-paths](/reference/project-configs/seed-paths) заменили `data-paths` в `dbt-project.yml` с значением по умолчанию `seeds`.
- [packages-install-path](/reference/project-configs/packages-install-path) был обновлен с `modules-path`. Кроме того, значение по умолчанию теперь `dbt_packages` вместо `dbt_modules`. Вам может потребоваться обновить это значение в [`clean-targets`](/reference/project-configs/clean-targets).
- Значение по умолчанию для `quote_columns` теперь `True` для всех адаптеров, кроме Snowflake.

**Это, вероятно, не касается:**
- Значение по умолчанию для [test-paths](/reference/project-configs/test-paths) было обновлено на множественное число `tests`.
- Значение по умолчанию для [analysis-paths](/reference/project-configs/analysis-paths) было обновлено на множественное число `analyses`.

### Тесты

Два **типа тестов** теперь называются "единственный" и "общий" (вместо "данные" и "схема", соответственно). Метод выбора `test_type:` принимает `test_type:singular` и `test_type:generic`. (Он также будет принимать `test_type:schema` и `test_type:data` для обратной совместимости.) **Не обратная совместимость:** Флаги `--data` и `--schema` для dbt test больше не поддерживаются, и тесты больше не имеют автоматически применяемых тегов `'data'` и `'schema'`. Обновленная документация: [тесты](/docs/build/data-tests), [выбор тестов](/reference/node-selection/test-selection-examples), [методы выбора](/reference/node-selection/methods).

Флаг/свойство `greedy` был переименован в **`indirect_selection`**, который теперь по умолчанию является жадным. **Примечание:** Это возвращает выбор тестов к поведению до v0.20 по умолчанию. `dbt test -s my_model` _будет_ выбирать тесты с несколькими родителями, такие как `relationships`, которые зависят от невыбранных ресурсов. Чтобы достичь изменения поведения в v0.20 + v0.21, установите `--indirect-selection=cautious` в CLI или `indirect_selection: cautious` в YAML селекторах. Обновленная документация: [примеры выбора тестов](/reference/node-selection/test-selection-examples), [yaml селекторы](/reference/node-selection/yaml-selectors).

### Глобальные макросы

Глобальные проектные макросы были реорганизованы, и некоторые старые неиспользуемые макросы были удалены: `column_list`, `column_list_for_create_table`, `incremental_upsert`. Это вряд ли повлияет на ваш проект.

### Установка

- [Документация по установке](/docs/supported-data-platforms) отражает установки, специфичные для адаптеров.
- `python -m pip install dbt` больше не поддерживается и вызовет явную ошибку. Установите конкретный плагин адаптера, который вам нужен, как `python -m pip install dbt-<adapter>`.
- `brew install dbt` больше не поддерживается. Установите конкретный плагин адаптера, который вам нужен (среди Postgres, Redshift, Snowflake или BigQuery), как `brew install dbt-<adapter>`.
- Удалена официальная поддержка python 3.6, который достигает конца жизни 23 декабря 2021 года.

### Для пользователей плагинов адаптеров

- **BigQuery:** Поддержка таблиц с разделением по времени загрузки официально устарела в пользу современных подходов. Используйте `partition_by` и стратегии инкрементального моделирования. Для получения дополнительной информации смотрите [Инкрементальные модели](/docs/build/incremental-models).

### Для поддерживающих плагины + другие интеграции

Мы представили новый [**интерфейс структурированных событий**](/reference/events-logging) и перешли на использование этой новой системы для всех логов dbt. **Это включает в себя изменение, которое не совместимо с предыдущими версиями для плагинов адаптеров**, требующее очень простой миграции. Для получения дополнительной информации смотрите [README модуля `events`](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/events/README.md#adapter-maintainers). Если вы поддерживаете другой тип плагина, который _нуждается_ в устаревшем логировании, на данный момент вы можете повторно включить его с помощью переменной окружения (`DBT_ENABLE_LEGACY_LOGGER=True`); имейте в виду, что мы удалим эту возможность в будущей версии dbt Core.

[**Сервер dbt RPC**](/reference/commands/rpc) был выделен из `dbt-core` и теперь упакован отдельно. Его функциональность будет полностью устаревшей к концу 2022 года в пользу нового сервера dbt. Вместо `dbt rpc` используйте `dbt-rpc serve`.

**Артефакты:** Новые схемы (манифест v4, результаты выполнения v4, источники v3). Замечательные изменения: добавлены узлы `metrics`; узлы схемных тестов и тестов данных переименованы в узлы общих тестов и узлов единственного теста; значения по умолчанию для порогов свежести выглядят немного иначе.

### Устаревания из давнего прошлого

Несколько изменений под капотом из прошлых минорных версий, помеченных предупреждениями об устаревании, теперь полностью устарели.
- Аргумент `packages` функции [dispatch](/reference/dbt-jinja-functions/dispatch) устарел и вызовет исключение при использовании.
- Макрос "adapter_macro" устарел. Вместо этого используйте метод [dispatch](/reference/dbt-jinja-functions/dispatch) для поиска макроса и вызова результата.
- Аргумент `release` был удален из метода `execute_macro`.

## Новые функции и измененная документация

- Добавлены [метрики](/docs/build/build-metrics-intro), новый тип узла.
- [Общие тесты](/best-practices/writing-custom-generic-tests) могут быть определены в `tests/generic` (новый), в дополнение к `macros/` (как и прежде).
- [Парсинг](/reference/parsing): частичный парсинг и статический парсинг теперь включены по умолчанию.
- [Глобальные конфигурации](/reference/global-configs/about-global-configs) были стандартизированы. Связанные обновления для [глобальных флагов CLI](/reference/global-configs/about-global-configs) и [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml).
- [Команда `init`](/reference/commands/init) имеет совершенно новый вид и ощущение. Она больше не предназначена только для новых пользователей.
- Добавлены подвыборки `result:<status>` для более умных повторных запусков, когда модели dbt имеют ошибки и тесты не проходят. Смотрите примеры: [Советы по рабочим процессам](/best-practices/best-practice-workflows#pro-tips-for-workflows).
- Переменные окружения с префиксом secret теперь разрешены только в `profiles.yml` + `packages.yml`.