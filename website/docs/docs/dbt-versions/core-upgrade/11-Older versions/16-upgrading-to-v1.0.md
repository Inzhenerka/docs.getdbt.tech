---
title: "Обновление до версии v1.0"
description: Новые функции и изменения в dbt Core v1.0
id: "upgrading-to-v1.0"
displayed_sidebar: "docs"
---

### Ресурсы {#resources}

- [Discourse](https://discourse.getdbt.com/t/3180)
- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.0.latest/CHANGELOG.md)
- [Руководство по установке CLI <Constant name="core" />](/docs/core/installation-overview)
- [Руководство по обновлению Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud)

## Что нужно знать перед обновлением {#what-to-know-before-upgrading}

Мажорная версия <Constant name="core" /> 1.0 включает ряд ломающих изменений! Там, где это было возможно, мы сохранили обратную совместимость со старым поведением, а там, где это было необходимо, упростили процесс миграции.

### Переименованные поля в `dbt_project.yml` {#renamed-fields-in-dbt_projectyml}

**Эти изменения касаются всех:**
- [model-paths](/reference/project-configs/model-paths) заменили `source-paths` в `dbt-project.yml`.
- [seed-paths](/reference/project-configs/seed-paths) заменили `data-paths` в `dbt-project.yml` со значением по умолчанию `seeds`.
- [packages-install-path](/reference/project-configs/packages-install-path) был обновлен с `modules-path`. Кроме того, значение по умолчанию теперь `dbt_packages` вместо `dbt_modules`. Возможно, вам потребуется обновить это значение в [`clean-targets`](/reference/project-configs/clean-targets).
- Значение по умолчанию для `quote_columns` теперь `True` для всех адаптеров, кроме Snowflake.

**Эти изменения, вероятно, не касаются большинства:**
- Значение по умолчанию для [test-paths](/reference/project-configs/test-paths) было обновлено на множественное число `tests`.
- Значение по умолчанию для [analysis-paths](/reference/project-configs/analysis-paths) было обновлено на множественное число `analyses`.

### Тесты {#tests}

Два **типа тестов** теперь называются «singular» и «generic» (вместо «data» и «schema» соответственно). Метод выбора `test_type:` принимает значения `test_type:singular` и `test_type:generic`. (Также по соображениям обратной совместимости он принимает `test_type:schema` и `test_type:data`.) **Не обратно совместимо:** флаги `--data` и `--schema` для команды `dbt test` больше не поддерживаются, а тестам больше не назначаются теги `'data'` и `'schema'` автоматически. Обновлённая документация: [data tests](/docs/build/data-tests), [test selection](/reference/node-selection/test-selection-examples), [selection methods](/reference/node-selection/methods).

Флаг/свойство `greedy` было переименовано в **`indirect_selection`**, который теперь по умолчанию является eager. **Примечание:** Это возвращает выбор тестов к поведению до версии v0.20 по умолчанию. `dbt test -s my_model` _будет_ выбирать тесты с несколькими родителями, такие как `relationships`, которые зависят от невыбранных ресурсов. Чтобы достичь изменения поведения в v0.20 + v0.21, установите `--indirect-selection=cautious` в CLI или `indirect_selection: cautious` в YAML селекторах. Обновленная документация: [примеры выбора тестов](/reference/node-selection/test-selection-examples), [yaml селекторы](/reference/node-selection/yaml-selectors).

### Глобальные макросы {#global-macros}

Глобальные макросы проекта были реорганизованы, и некоторые старые неиспользуемые макросы были удалены: `column_list`, `column_list_for_create_table`, `incremental_upsert`. Это вряд ли повлияет на ваш проект.

### Установка {#installation}

- [Документация по установке](/docs/supported-data-platforms) отражает установки, специфичные для адаптеров
- `python -m pip install dbt` больше не поддерживается и вызовет явную ошибку. Установите нужный плагин адаптера как `python -m pip install dbt-<adapter>`.
- `brew install dbt` больше не поддерживается. Установите нужный плагин адаптера (среди Postgres, Redshift, Snowflake или BigQuery) как `brew install dbt-<adapter>`.
- Официальная поддержка python 3.6 была удалена, так как он достигает конца жизни 23 декабря 2021 года

### Для пользователей плагинов адаптеров {#for-users-of-adapter-plugins}

- **BigQuery:** Поддержка таблиц с разделением по времени загрузки официально устарела в пользу современных подходов. Используйте `partition_by` и стратегии инкрементального моделирования. Для получения дополнительной информации обратитесь к [Инкрементальные модели](/docs/build/incremental-models).

### Для разработчиков плагинов и других интеграций {#for-maintainers-of-plugins-other-integrations}

Мы представили новый [**интерфейс структурированных событий**](/reference/events-logging), и мы перевели весь журнал dbt на использование этой новой системы. **Это включает изменение, нарушающее совместимость, для плагинов адаптеров**, требующее очень простой миграции. Для получения более подробной информации см. [README модуля `events`](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/events/README.md#adapter-maintainers). Если вы поддерживаете другой тип плагина, который _нуждается_ в устаревшем журналировании, на данный момент вы можете повторно включить его с помощью переменной окружения (`DBT_ENABLE_LEGACY_LOGGER=True`); обратите внимание, что мы удалим эту возможность в будущей версии dbt Core.

[**Сервер dbt RPC**](/reference/commands/rpc) был выделен из `dbt-core` и теперь упакован отдельно. Его функциональность будет полностью устаревшей к концу 2022 года в пользу нового сервера dbt. Вместо `dbt rpc` используйте `dbt-rpc serve`.

**Артефакты:** Новые схемы (manifest v4, run results v4, sources v3). Значительные изменения: добавлены узлы `metrics`; узлы тестов схемы и данных переименованы в узлы generic test и singular test; значения по умолчанию для порогов свежести выглядят немного иначе.

### Устаревшие функции из давних версий {#deprecations-from-long-ago}

Несколько изменений под капотом из прошлых минорных версий, помеченных предупреждениями об устаревании, теперь полностью устарели.
- Аргумент `packages` в [dispatch](/reference/dbt-jinja-functions/dispatch) устарел и вызовет исключение при использовании.
- Макрос "adapter_macro" устарел. Вместо этого используйте метод [dispatch](/reference/dbt-jinja-functions/dispatch) для поиска макроса и вызова результата.
- Аргумент `release` был удален из метода `execute_macro`.

## Новые функции и измененная документация {#new-features-and-changed-documentation}

- Добавлены [метрики](/docs/build/build-metrics-intro), новый тип узла
- [Generic tests](/best-practices/writing-custom-generic-tests) могут быть определены в `tests/generic` (новое), а также в `macros/` (как и раньше)
- [Парсинг](/reference/parsing): частичный парсинг и статический парсинг теперь включены по умолчанию.
- [Глобальные конфигурации](/reference/global-configs/about-global-configs) были стандартизированы. Связанные обновления для [глобальных флагов CLI](/reference/global-configs/about-global-configs) и [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml).
- [Команда `init`](/reference/commands/init) получила совершенно новый вид и ощущения. Она больше не только для новичков.
- Добавлены подвыборки `result:<status>` для более умных повторных запусков, когда модели dbt имеют ошибки и тесты не проходят. См. примеры: [Советы для рабочих процессов](/best-practices/best-practice-workflows#pro-tips-for-workflows)
- Переменные окружения с префиксом Secret [env vars](/reference/dbt-jinja-functions/env_var) теперь разрешены только в `profiles.yml` + `packages.yml`