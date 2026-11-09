---
title: "Обновление до v1.0"
description: Новые возможности и изменения в dbt v1.0
id: "upgrading-to-v1.0"
displayed_sidebar: "docs"
availability:
  engine: v1
  access: free
---


### Ресурсы

- [Discourse](https://discourse.getdbt.com/t/3180)
- [Журнал изменений](https://github.com/dbt-labs/dbt/blob/1.0.latest/CHANGELOG.md)
- [Руководство по установке CLI <Constant name="core" />](/docs/local/install-dbt)
- [Руководство по обновлению Cloud](/docs/dbt-versions/upgrade-dbt-platform-version)

## Что нужно знать перед обновлением

Мажорная версия 1.0 <Constant name="core" /> включает ряд изменений, нарушающих обратную совместимость! По возможности мы сохранили обратную совместимость с прежним поведением, а там, где это необходимо, упростили миграцию.

### Переименованные поля в `dbt_project.yml`

**Эти изменения затрагивают всех:**
- [model-paths](/reference/project-configs/model-paths) заменяет `source-paths` в `dbt-project.yml`.
- [seed-paths](/reference/project-configs/seed-paths) заменяет `data-paths` в `dbt-project.yml`; значение по умолчанию — `seeds`.
- Параметр `modules-path` переименован в [packages-install-path](/reference/project-configs/packages-install-path).  Кроме того, значение по умолчанию теперь `dbt_packages`, а не `dbt_modules`.  Возможно, вам потребуется обновить это значение в [`clean-targets`](/reference/project-configs/clean-targets).
- Значение по умолчанию для `quote_columns` теперь `True` для всех адаптеров, кроме Snowflake.

**А эти, скорее всего, вас не затронут:**
- Значение по умолчанию для [test-paths](/reference/project-configs/test-paths) изменено на форму множественного числа — `tests`.
- Значение по умолчанию для [analysis-paths](/reference/project-configs/analysis-paths) изменено на форму множественного числа — `analyses`.

### Тесты

Два **типа тестов** теперь называются «singular» (единичные) и «generic» (универсальные) вместо «data» и «schema» соответственно. Метод выбора `test_type:` принимает значения `test_type:singular` и `test_type:generic`. (Для обратной совместимости он также принимает `test_type:schema` и `test_type:data`.) **Без обратной совместимости:** флаги `--data` и `--schema` команды dbt test больше не поддерживаются, а теги `'data'` и `'schema'` больше не присваиваются тестам автоматически. Обновлённая документация: [тесты данных](/docs/build/data-tests), [выбор тестов](/reference/node-selection/test-selection-examples), [методы выбора](/reference/node-selection/methods).

Флаг/свойство `greedy` переименован в **`indirect_selection`**, значение которого по умолчанию теперь `eager`. **Примечание:** это возвращает выбор тестов по умолчанию к поведению, которое было до v0.20. Команда `dbt test -s my_model` _будет_ выбирать тесты с несколькими родительскими ресурсами, например `relationships`, которые зависят от невыбранных ресурсов. Чтобы получить поведение, введённое в v0.20 и v0.21, задайте `--indirect-selection=cautious` в CLI или `indirect_selection: cautious` в селекторах YAML. Обновлённая документация: [примеры выбора тестов](/reference/node-selection/test-selection-examples), [селекторы YAML](/reference/node-selection/yaml-selectors).

### Глобальные макросы

Глобальные макросы проекта реорганизованы, а некоторые старые неиспользуемые макросы удалены: `column_list`, `column_list_for_create_table`, `incremental_upsert`. Это вряд ли повлияет на ваш проект.

### Установка {#installation}

- [Документация по установке](/docs/supported-data-platforms) отражает особенности установки отдельных адаптеров
- Команда `python -m pip install dbt` больше не поддерживается и будет выдавать явную ошибку. Установите нужный плагин адаптера с помощью `python -m pip install dbt-<adapter>`.
- Команда `brew install dbt` больше не поддерживается. Установите нужный плагин адаптера (Postgres, Redshift, Snowflake или BigQuery) с помощью `brew install dbt-<adapter>`.
- Прекращена официальная поддержка Python 3.6, жизненный цикл которого заканчивается 23 декабря 2021 года

### Для пользователей плагинов адаптеров

- **BigQuery:** поддержка таблиц, секционированных по времени загрузки данных, официально объявлена устаревшей в пользу современных подходов. Вместо этого используйте `partition_by` и стратегии инкрементального моделирования. Дополнительные сведения см. в разделе [Инкрементальные модели](/docs/build/incremental-models).

### Для разработчиков плагинов и других интеграций

Мы представили новый [**интерфейс структурированных событий**](/reference/events-logging) и перевели всё журналирование dbt на эту новую систему. **Это включает изменение, нарушающее обратную совместимость плагинов адаптеров**, для которого потребуется очень простая миграция. Подробнее см. в [README модуля `events`](https://github.com/dbt-labs/dbt/blob/HEAD/core/dbt/events/README.md#adapter-maintainers). Если вы поддерживаете плагин другого типа, которому _необходимо_ прежнее журналирование, пока что вы можете снова включить его с помощью переменной окружения (`DBT_ENABLE_LEGACY_LOGGER=True`); учтите, что мы удалим эту возможность в одной из будущих версий dbt.

[**dbt RPC Server**](/reference/commands/rpc) выделен из `dbt-core` и теперь поставляется отдельным пакетом. Его функциональность будет полностью выведена из эксплуатации к концу 2022 года в пользу нового dbt Server. Вместо `dbt rpc` используйте `dbt-rpc serve`.

**Артефакты:** новые схемы (manifest v4, run results v4, sources v3). Основные изменения: добавлены узлы `metrics`; узлы schema test и data test переименованы в узлы generic test и singular test; значения порогов свежести по умолчанию выглядят немного иначе.

### Прекращение поддержки давно устаревших возможностей

Ряд внутренних механизмов из предыдущих минорных версий, для которых выводились предупреждения об устаревании, теперь окончательно выведен из эксплуатации.
- Аргумент `packages` функции [dispatch](/reference/dbt-jinja-functions/dispatch) больше не поддерживается, и его использование приведёт к исключению.
- Макрос "adapter_macro" больше не поддерживается. Вместо него используйте метод [dispatch](/reference/dbt-jinja-functions/dispatch), чтобы найти макрос и вызвать полученный результат.
- Аргумент `release` удалён из метода `execute_macro`.

## Новые возможности и изменения в документации

- Добавлен новый тип узлов — [метрики](/docs/build/build-metrics-intro)
- [Универсальные тесты](/best-practices/writing-custom-generic-tests) можно определять в `tests/generic` (новая возможность), а также в `macros/` (как и прежде)
- [Парсинг](/reference/parsing): частичный и статический парсинг теперь включены по умолчанию.
- [Глобальные настройки](/reference/global-configs/about-global-configs) стандартизированы. Соответствующие обновления внесены в документацию по [глобальным флагам CLI](/reference/global-configs/about-global-configs) и [`profiles.yml`](/docs/local/profiles.yml).
- [Команда `init`](/reference/commands/init) получила совершенно новый интерфейс и принципы взаимодействия. Теперь она предназначена не только для начинающих пользователей.
- Добавлены подселекторы `result:<status>` для более гибких повторных запусков при ошибках в моделях dbt и сбоях тестов. См. примеры: [Профессиональные советы по рабочим процессам](/best-practices/best-practice-workflows#pro-tips-for-workflows)
- [Переменные окружения](/reference/dbt-jinja-functions/env_var) с префиксом для секретов теперь разрешены только в `profiles.yml` и `packages.yml`
