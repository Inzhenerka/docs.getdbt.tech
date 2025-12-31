---
title: "Обновление до версии v1.7"
id: upgrading-to-v1.7
description: Новые функции и изменения в dbt Core v1.7
displayed_sidebar: "docs"
---

## Ресурсы {#resources}

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.7.latest/CHANGELOG.md)
- [Руководство по установке CLI <Constant name="core" />](/docs/core/installation-overview)
- [Руководство по обновлению Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud)
- [График релизов](https://github.com/dbt-labs/dbt-core/issues/8260)

## Что нужно знать перед обновлением {#what-to-know-before-upgrading}

dbt Labs стремится обеспечить обратную совместимость для всех версий 1.x, за исключением изменений, явно указанных ниже. Если вы столкнетесь с ошибкой при обновлении, пожалуйста, сообщите нам, [создав задачу](https://github.com/dbt-labs/dbt-core/issues/new).

### Изменения в поведении {#behavior-changes}

dbt Core v1.7 расширяет количество источников, для которых вы можете настроить свежесть. Ранее свежесть была ограничена источниками с `loaded_at_field`; теперь свежесть может генерироваться из таблиц метаданных хранилища, когда они доступны.

В рамках этого изменения `loaded_at_field` больше не требуется для генерации свежести источника. Если у источника есть блок `freshness:`, dbt попытается вычислить свежесть для этого источника:
- Если `loaded_at_field` предоставлен, dbt вычислит свежесть через запрос select (предыдущее поведение).
- Если `loaded_at_field` _не_ предоставлен, dbt вычислит свежесть через таблицы метаданных хранилища, когда это возможно (новое поведение).

Это относительно небольшое изменение в поведении, но о нём стоит упомянуть на случай, если вы заметите, что dbt рассчитывает freshness для _большего_ количества источников, чем раньше. Чтобы исключить источник из расчётов freshness, явно укажите `freshness: null`.

Начиная с версии v1.7, выполнение [`dbt deps`](/reference/commands/deps) создает или обновляет файл `package-lock.yml` в _project_root_, где записан `packages.yml`. Файл `package-lock.yml` содержит запись обо всех установленных пакетах, и если последующие запуски `dbt deps` не содержат обновленных пакетов в `dependencies.yml` или `packages.yml`, dbt-core устанавливает из `package-lock.yml`.

Чтобы сохранить поведение до v1.7, есть два основных варианта:
1. Используйте `dbt deps --upgrade` везде, где ранее использовался `dbt deps`.
2. Добавьте `package-lock.yml` в ваш файл `.gitignore`.

## Новые и измененные функции и функциональность {#new-and-changed-features-and-functionality}

- [`dbt docs generate`](/reference/commands/cmd-docs) теперь поддерживает опцию `--select`, которая позволяет генерировать [метаданные каталога](/reference/artifacts/catalog-json) только для подмножества вашего проекта.  
- [Свежесть источников](/docs/deploy/source-freshness) теперь может вычисляться на основе таблиц метаданных хранилища данных.

### Улучшения MetricFlow {#metricflow-enhancements}

- Автоматическое создание метрик на основе мер с [`create_metric: true`](/docs/build/semantic-models).
- Необязательное поле [`label`](/docs/build/semantic-models) в `semantic_models`, `measures`, `dimensions` и `entities`.
- Новые конфигурации для семантических моделей — [enable/disable](/reference/resource-configs/enabled), [group](/reference/resource-configs/group) и [meta](/reference/resource-configs/meta).
- Поддержка `fill_nulls_with` и `join_to_timespine` для узлов метрик.
- `saved_queries` расширяет управление и контроль (governance) за пределы семантических объектов, включая их использование.

### Для потребителей артефактов dbt (метаданные) {#for-consumers-of-dbt-artifacts-metadata}

- Версия схемы [manifest](/reference/artifacts/manifest-json) обновлена до v11.
- Версия схемы [run_results](/reference/artifacts/run-results-json) обновлена до v5.
- Есть несколько конкретных изменений в [catalog.json](/reference/artifacts/catalog-json):
    - Добавлены [атрибуты узлов](/reference/artifacts/run-results-json), связанные с компиляцией (`compiled`, `compiled_code`, `relation_name`) в `catalog.json`.
    - Словарь узлов в `catalog.json` теперь может быть "частичным", если `dbt docs generate` выполняется с селектором.

### Управление моделями {#model-governance}

<Constant name="core" /> v1.5 представил модельное управление (model governance), которое мы продолжаем дорабатывать. В v1.7 добавлены следующие возможности и улучшения:

- **[Обнаружение критических изменений](/reference/resource-properties/versions#detecting-breaking-changes) для моделей с включёнными контрактами:** Когда dbt обнаруживает критическое изменение модели с принудительно применяемым контрактом во время сравнения состояния (state comparison), он теперь будет выбрасывать ошибку для версионированных моделей и предупреждение — для моделей без версий.
- **[Задание `access` как конфига](/reference/resource-configs/access):** Теперь вы можете задавать `access` модели внутри config-блоков в SQL-файле модели или в YAML-файле проекта (`dbt_project.yml`) сразу для всей подпапки.
- **[Алиасы типов для контрактов моделей](/reference/resource-configs/contract):** dbt будет использовать встроенные в адаптер алиасы типов данных для типов, указанных пользователем. Это означает, что теперь можно всегда писать `string`, а dbt автоматически преобразует его, например, в `text` для Postgres/Redshift. Эта функциональность включена по умолчанию, но при необходимости её можно отключить.
- **[Предупреждение для числовых типов](/reference/resource-configs/contract):** Из‑за проблем, возникающих при использовании `numeric` в контрактах моделей без учёта того, что значения по умолчанию (например, `numeric(38,0)`) могут округлять дробные числа, dbt теперь будет выдавать предупреждение, если обнаружит числовой тип без явно заданной precision/scale.

### dbt clean {#dbt-clean}

Команда [dbt clean](/reference/commands/clean) очищает только пути внутри текущей рабочей директории. Флаг `--no-clean-project-files-only` удалит все пути, указанные в разделе `clean-targets` файла `dbt_project.yml`, даже если они находятся за пределами проекта dbt.

Поддерживаемые флаги:
-  `--clean-project-files-only` (по умолчанию)
-  `--no-clean-project-files-only`

### Дополнительные атрибуты в run_results.json {#additional-attributes-in-run_resultsjson}

Теперь run_results.json включает три атрибута, связанные с состоянием `applied`, которые дополняют `unique_id`:

- `compiled`: Логическая запись статуса компиляции узла (`False` после разбора, но `True` после компиляции).
- `compiled_code`: Отображаемая строка кода, который был скомпилирован (пустая после разбора, но полная строка после компиляции).
- `relation_name`: Полностью квалифицированное имя объекта, который был (или будет) создан/обновлен в базе данных.

### Устаревшая функциональность {#deprecated-functionality}

Возможность для установленных пакетов переопределять встроенные материализации без явного согласия пользователя устаревает.

- Переопределение встроенной материализации из установленного пакета вызывает предупреждение об устаревании.
- Использование пользовательской материализации из установленного пакета не вызывает предупреждение об устаревании.
- Использование переопределения встроенной материализации из корневого проекта через оберточную материализацию все еще поддерживается. Например:

  ```
  {% materialization view, default %}
  {{ return(my_cool_package.materialization_view_default()) }}
  {% endmaterialization %}
  ```

### Быстрые изменения {#quick-hits}

С этими быстрыми изменениями вы теперь можете:
- Настроить [`delimiter`](/reference/resource-configs/delimiter) для файла seed.
- Использовать пакеты с тем же git-репозиторием и уникальной поддиректорией.
- Получить доступ к макросу `date_spine` напрямую из dbt-core (перемещен из dbt-utils).
- Синтаксис для `DBT_ENV_SECRET_` изменен на `DBT_ENV_SECRET` и больше не требует завершающего подчеркивания.