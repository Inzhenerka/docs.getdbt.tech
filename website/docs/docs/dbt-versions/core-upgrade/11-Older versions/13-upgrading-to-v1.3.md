---
title: "Обновление до версии v1.3"
description: Новые функции и изменения в dbt Core v1.3
id: "upgrading-to-v1.3"
displayed_sidebar: "docs"
---

### Ресурсы {#resources}

- [Журнал изменений](https://github.com/dbt-labs/dbt-core/blob/1.3.latest/CHANGELOG.md)
- [Руководство по установке CLI <Constant name="core" />](/docs/core/installation-overview)
- [Руководство по обновлению в Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud)

## Что нужно знать перед обновлением {#what-to-know-before-upgrading}

Мы стремимся обеспечивать обратную совместимость для всех версий 1.x. Если вы столкнетесь с ошибкой при обновлении, пожалуйста, сообщите нам, [создав задачу](https://github.com/dbt-labs/dbt-core/issues/new).

В <Constant name="core" /> v1.3 есть три изменения, которые могут потребовать действий со стороны некоторых пользователей:

1. Если у вас есть файл `profiles.yml`, расположенный в корневом каталоге, из которого вы запускаете dbt, dbt начнёт отдавать предпочтение этому файлу профилей по сравнению с расположением по умолчанию на вашей машине. [Подробнее об этом можно прочитать здесь](/docs/core/connect-data-platform/connection-profiles#advanced-customizing-a-profile-directory).
2. Если в вашем dbt‑проекте в параметре `model-paths` уже указаны файлы с расширением `.py`, dbt начнёт пытаться читать их как Python‑модели. Вы можете использовать [новый файл `.dbtignore`](/reference/dbtignore), чтобы указать dbt игнорировать такие файлы.
3. Если у вас есть пользовательский код, который обращается к свойству `raw_sql` моделей (через объекты [model](/reference/dbt-jinja-functions/model) или [graph](/reference/dbt-jinja-functions/graph)), оно было переименовано в `raw_code`. Это изменение контракта manifest, которое более подробно описано ниже.

### Для пользователей dbt Metrics {#for-users-of-dbt-metrics}

Названия свойств метрик изменились с сохранением обратной совместимости. Эти изменения:
- Переименовано `type` в `calculation_method`
- Переименовано `sql` в `expression`
- Переименовано метрики метода вычисления `expression` в метрики метода вычисления `derived`

Мы планируем сохранять обратную совместимость в течение полного минорного релиза. Определение метрик со старыми именами будет приводить к ошибке в <Constant name="core" /> v1.4.

### Для потребителей артефактов dbt (метаданных) {#for-consumers-of-dbt-artifacts-metadata}

Мы обновили версию схемы манифеста до `v7`. Это включает изменения в метриках, описанные выше, и несколько других изменений, связанных с добавлением Python моделей:
- Переименовано `raw_sql` в `raw_code`
- Переименовано `compiled_sql` в `compiled_code`
- Новое свойство узла верхнего уровня, `language` (`'sql'` или `'python'`)

Для пользователей [выбора на основе состояния](/reference/node-selection/syntax#about-node-selection): Этот выпуск включает логику, обеспечивающую обратную и прямую совместимость для старых версий манифеста. При запуске dbt Core v1.3 должно быть возможно использовать выбор `state:modified --state ...` против манифеста, созданного dbt Core v1.0 и выше.

### Для разработчиков адаптеров плагинов {#for-maintainers-of-adapter-plugins}

Обсуждение на GitHub с подробностями: [dbt-labs/dbt-core#6011](https://github.com/dbt-labs/dbt-core/discussions/6011)

## Новая и измененная документация {#new-and-changed-documentation}

- **[Python модели](/docs/build/python-models)** теперь поддерживаются нативно в `dbt-core` впервые, на хранилищах данных, поддерживающих Python среды выполнения.
- Обновления, внесенные в **[Metrics](/docs/build/build-metrics-intro)**, отражают их новый синтаксис для определения, а также дополнительные свойства, которые теперь доступны.
- Плюс, несколько связанных обновлений **[свойств экспозиции](/reference/exposure-properties)**: валидация `config`, `label` и `name`.

- **[Пользовательский `node_color`](/reference/resource-configs/docs.md)** в `dbt-docs`. Впервые вы можете контролировать цвета, отображаемые в DAG dbt. Хотите бронзовые, серебряные и золотые слои? Это в ваших руках.
- **[Порядок поиска `Profiles.yml`](/docs/core/connect-data-platform/connection-profiles#advanced-customizing-a-profile-directory)** теперь сначала проверяет текущий рабочий каталог перед `~/.dbt`.

### Быстрые изменения {#quick-hits}
- Флаг **["Полное обновление"](/reference/resource-configs/full_refresh)** поддерживает короткое имя, `-f`.
- **[Метод выбора "config"](/reference/node-selection/methods#config)** поддерживает булевы и списковые значения конфигурации, в дополнение к строкам.
- Две новые переменные контекста dbt-Jinja для доступа к метаданным вызова: [`invocation_args_dict`](/reference/dbt-jinja-functions/flags#invocation_args_dict) и [`dbt_metadata_envs`](/reference/dbt-jinja-functions/env_var#custom-metadata).