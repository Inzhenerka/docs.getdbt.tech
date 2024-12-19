---
title: "Обновление до v1.3"
description: Новые функции и изменения в dbt Core v1.3
id: "upgrading-to-v1.3"
displayed_sidebar: "docs"
---

### Ресурсы

- [Журнал изменений](https://github.com/dbt-labs/dbt-core/blob/1.3.latest/CHANGELOG.md)
- [Руководство по установке dbt Core CLI](/docs/core/installation-overview)
- [Руководство по обновлению в облаке](/docs/dbt-versions/upgrade-dbt-version-in-cloud)

## Что нужно знать перед обновлением

Мы стремимся обеспечить обратную совместимость для всех версий 1.x. Если вы столкнулись с ошибкой при обновлении, пожалуйста, дайте нам знать, [открыв проблему](https://github.com/dbt-labs/dbt-core/issues/new).

В dbt Core v1.3 есть три изменения, которые могут потребовать действий от некоторых пользователей:
1. Если у вас есть файл `profiles.yml`, расположенный в корневом каталоге, где вы запускаете dbt, dbt начнет предпочитать этот файл профилей вместо стандартного местоположения на вашем компьютере. [Вы можете прочитать больше деталей здесь](/docs/core/connect-data-platform/connection-profiles#advanced-customizing-a-profile-directory).
2. Если у вас уже есть файлы `.py`, определенные в `model-paths` вашего проекта dbt, dbt начнет пытаться читать их как модели Python. Вы можете использовать [новый файл `.dbtignore`](/reference/dbtignore), чтобы указать dbt игнорировать эти файлы.
3. Если у вас есть пользовательский код, обращающийся к свойству `raw_sql` моделей (с объектами [model](/reference/dbt-jinja-functions/model) или [graph](/reference/dbt-jinja-functions/graph)), оно было переименовано в `raw_code`. Это изменение в контракте манифеста, описанное более подробно ниже.

### Для пользователей dbt Metrics

Названия свойств метрик изменились, при этом обеспечена обратная совместимость. Эти изменения:
- Переименован `type` в `calculation_method`
- Переименован `sql` в `expression`
- Переименованы метрики метода расчета `expression` в метрики метода расчета `derived`

Мы планируем сохранить обратную совместимость на протяжении целой минорной версии. Определение метрик с использованием старых названий вызовет ошибку в dbt Core v1.4.

### Для потребителей артефактов dbt (метаданные)

Мы обновили версию схемы манифеста до `v7`. Это включает изменения в метриках, описанные выше, и несколько других изменений, связанных с добавлением моделей Python:
- Переименован `raw_sql` в `raw_code`
- Переименован `compiled_sql` в `compiled_code`
- Новое свойство верхнего уровня, `language` (`'sql'` или `'python'`)

Для пользователей [выбора на основе состояния](/reference/node-selection/syntax#about-node-selection): Это обновление включает логику, обеспечивающую обратную и прямую совместимость для более старых версий манифеста. При запуске dbt Core v1.3 должно быть возможно использовать выбор `state:modified --state ...` по отношению к манифесту, созданному dbt Core v1.0 и выше.

### Для поддерживающих адаптеры плагинов

Обсуждение на GitHub с деталями: [dbt-labs/dbt-core#6011](https://github.com/dbt-labs/dbt-core/discussions/6011)

## Новая и измененная документация

- **[Модели Python](/docs/build/python-models)** впервые нативно поддерживаются в `dbt-core` для дата-складов, которые поддерживают Python-окружения.
- Обновления, внесенные в **[Метрики](/docs/build/build-metrics-intro)**, отражают их новый синтаксис для определения, а также дополнительные свойства, которые теперь доступны.
- Кроме того, несколько связанных обновлений для **[свойств экспозиции](/reference/exposure-properties)**: валидация `config`, `label` и `name`.

- **[Пользовательский `node_color`](/reference/resource-configs/docs.md)** в `dbt-docs`. Впервые вы можете контролировать цвета, отображаемые в DAG dbt. Хотите бронзовые, серебряные и золотые слои? Это у вас под рукой.
- **[`Profiles.yml`](/docs/core/connect-data-platform/connection-profiles#advanced-customizing-a-profile-directory)** порядок поиска теперь сначала проверяет текущий рабочий каталог, а затем `~/.dbt`.

### Быстрые обновления
- **["Полное обновление"](/reference/resource-configs/full_refresh)** флаг поддерживает короткое имя `-f`.
- **[Метод выбора "config"](/reference/node-selection/methods#config)** поддерживает булевы и списковые значения конфигурации, помимо строк.
- Две новые переменные контекста dbt-Jinja для доступа к метаданным вызова: [`invocation_args_dict`](/reference/dbt-jinja-functions/flags#invocation_args_dict) и [`dbt_metadata_envs`](/reference/dbt-jinja-functions/env_var#custom-metadata).