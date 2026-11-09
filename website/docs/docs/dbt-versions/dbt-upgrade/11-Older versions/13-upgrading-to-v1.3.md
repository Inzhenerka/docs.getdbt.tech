---
title: "Обновление до v1.3"
description: Новые возможности и изменения в dbt v1.3
id: "upgrading-to-v1.3"
displayed_sidebar: "docs"
availability:
  engine: v1
  access: free
---

import CoreVersionDeprecation from '/snippets/_core-version-deprecation-callout.md';

<CoreVersionDeprecation />

### Ресурсы

- [Журнал изменений](https://github.com/dbt-labs/dbt/blob/1.3.latest/CHANGELOG.md)
- [Руководство по установке CLI <Constant name="core" />](/docs/local/install-dbt)
- [Руководство по обновлению Cloud](/docs/dbt-versions/upgrade-dbt-platform-version)

## Что нужно знать перед обновлением

Мы стремимся обеспечивать обратную совместимость для всех версий 1.x. Если при обновлении вы столкнётесь с ошибкой, сообщите нам об этом, [создав issue](https://github.com/dbt-labs/dbt/issues/new).

В <Constant name="dbt" /> v1.3 есть три изменения, которые могут потребовать действий от некоторых пользователей:
1. Если в корневом каталоге, из которого вы запускаете dbt, находится файл `profiles.yml`, dbt начнёт отдавать ему предпочтение перед файлом профилей в стандартном расположении на вашем компьютере. [Подробнее об этом можно прочитать здесь](/docs/local/connection-profiles#advanced-customizing-a-profile-directory).
2. Если в каталогах, указанных в `model-paths` вашего проекта dbt, уже есть файлы `.py`, dbt начнёт пытаться читать их как модели Python. Вы можете использовать [новый файл `.dbtignore`](/reference/dbtignore), чтобы указать dbt игнорировать эти файлы.
3. Если ваш пользовательский код обращается к свойству моделей `raw_sql` (через объекты [model](/reference/dbt-jinja-functions/model) или [graph](/reference/dbt-jinja-functions/graph)), учтите, что оно переименовано в `raw_code`. Это изменение контракта манифеста, подробнее описанное ниже.

### Для пользователей метрик dbt

Названия свойств метрик изменились с сохранением обратной совместимости. Изменения следующие:
- `type` переименовано в `calculation_method`
- `sql` переименовано в `expression`
- Метод вычисления метрик `expression` переименован в `derived`

Мы планируем сохранять обратную совместимость в течение одного полного минорного релиза. Определение метрик с использованием старых названий будет вызывать ошибку в <Constant name="dbt" /> v1.4.

### Для пользователей артефактов dbt (метаданных)

Мы обновили версию схемы манифеста до `v7`. Она включает описанные выше изменения метрик и несколько других изменений, связанных с добавлением моделей Python:
- `raw_sql` переименовано в `raw_code`
- `compiled_sql` переименовано в `compiled_code`
- Добавлено новое свойство узла верхнего уровня — `language` (`'sql'` или `'python'`)

Для пользователей [выбора на основе состояния](/reference/node-selection/syntax#how-does-selection-work): этот релиз включает логику, обеспечивающую обратную и прямую совместимость со старыми версиями манифеста. При работе с <Constant name="dbt" /> v1.3 можно использовать выбор `state:modified --state ...` с манифестом, созданным в <Constant name="dbt" /> v1.0 и выше.

### Для разработчиков плагинов адаптеров

Обсуждение на GitHub с подробностями: [dbt-labs/dbt#6011](https://github.com/dbt-labs/dbt/discussions/6011)

## Новая и обновлённая документация {#new-and-changed-documentation}

- **[Модели Python](/docs/build/python-models)** впервые получили встроенную поддержку в `dbt-core` для хранилищ данных, поддерживающих среды выполнения Python.
- Обновления раздела **[Метрики](/docs/build/build-metrics-intro)** отражают новый синтаксис их определения, а также дополнительные свойства, которые теперь доступны.
- Кроме того, внесено несколько связанных обновлений в **[свойства экспозиций](/reference/exposure-properties)**: `config`, `label` и проверку `name`.

- **[Настраиваемый `node_color`](/reference/resource-configs/docs.md)** в `dbt-docs`. Теперь вы впервые можете управлять цветами, отображаемыми в DAG dbt. Хотите бронзовый, серебряный и золотой слои? Всё в ваших руках.
- При поиске **[`Profiles.yml`](/docs/local/connection-profiles#advanced-customizing-a-profile-directory)** теперь сначала проверяется текущий рабочий каталог, а затем `~/.dbt`.


### Кратко о других изменениях
- Флаг **[«Полное обновление»](/reference/resource-configs/full_refresh)** поддерживает короткую форму `-f`.
- **[Метод выбора «config»](/reference/node-selection/methods#config)** поддерживает не только строки, но и логические значения и списки в конфигурации.
- Добавлены две новые переменные контекста dbt-Jinja для доступа к метаданным вызова: [`invocation_args_dict`](/reference/dbt-jinja-functions/flags#invocation_args_dict) и [`dbt_metadata_envs`](/reference/dbt-jinja-functions/env_var#custom-metadata).
