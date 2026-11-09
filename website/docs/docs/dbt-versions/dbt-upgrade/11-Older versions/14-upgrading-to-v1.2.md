---
title: "Обновление до v1.2"
description: Новые возможности и изменения в dbt v1.2
id: "upgrading-to-v1.2"
displayed_sidebar: "docs"
availability:
  engine: v1
  access: free
---

### Ресурсы

- [Журнал изменений](https://github.com/dbt-labs/dbt/blob/1.2.latest/CHANGELOG.md)
- [Руководство по установке CLI <Constant name="core" />](/docs/local/install-dbt)
- [Руководство по обновлению Cloud](/docs/dbt-versions/upgrade-dbt-platform-version)

## Что нужно знать перед обновлением

В этой версии нет изменений, нарушающих совместимость кода в проектах и пакетах dbt. Мы стремимся обеспечивать обратную совместимость для всех версий 1.x. Если после обновления вы столкнётесь с ошибкой, сообщите нам об этом, [создав issue](https://github.com/dbt-labs/dbt/issues/new).

### Для пользователей артефактов dbt (метаданных)

Версия схемы манифеста обновлена до `v6`. Соответствующие изменения:
- Изменено значение `config` по умолчанию: теперь оно включает новое свойство `grants` со значением по умолчанию `{}`
- Добавлено свойство `metrics` для всех узлов, которые могут ссылаться на метрики с помощью функции `metric()`

Для пользователей [выбора на основе состояния](/reference/node-selection/syntax#how-does-selection-work): этот выпуск также включает новую логику, обеспечивающую совместимость старых версий манифеста с новой версией dbt. При работе с <Constant name="dbt" /> v1.2 можно использовать выбор `state:modified --state ...` с манифестом, созданным в <Constant name="dbt" /> v1.0 или v1.1.

## Для разработчиков плагинов адаптеров

Подробную информацию см. в обсуждении на GitHub [dbt-labs/dbt#5468](https://github.com/dbt-labs/dbt/discussions/5468)

## Новые и изменённые возможности

- **[Права доступа (grants)](/reference/resource-configs/grants)** впервые получили встроенную поддержку в `dbt-core`. Эта поддержка распространяется на все стандартные материализации и наиболее популярные адаптеры. Если вы уже используете хуки для назначения простых прав доступа, рекомендуем вместо них использовать встроенную настройку `grants` для моделей, seed-файлов и снимков. Это позволит вам применить принцип [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) и избавиться от дублирующегося или шаблонного кода.
- **[Метрики](/docs/build/build-metrics-intro)** теперь поддерживают тип `expression` (метрики на основе метрик), а также функцию `metric()` для ссылок на метрики из моделей, макросов или метрик типа `expression`. Подробнее об использовании метрик на основе выражений см. в документации [**пакета `dbt_metrics`**](https://github.com/dbt-labs/dbt_metrics)
- **[Функции dbt-Jinja](/reference/dbt-jinja-functions-context-variables)** теперь включают [модуль Python `itertools`](/reference/dbt-jinja-functions/modules#itertools), а также функции [set](/reference/dbt-jinja-functions/set) и [zip](/reference/dbt-jinja-functions/zip).
- **[Выбор узлов](/reference/node-selection/syntax)** включает [метод выбора по файлу](/reference/node-selection/methods#file) (`-s model.sql`) и наследование [селекторов YAML](/reference/node-selection/yaml-selectors).
- **[Глобальные настройки](/reference/global-configs/about-global-configs)** теперь включают флаги CLI и переменные окружения для [`target-path`](/reference/global-configs/json-artifacts) и [`log-path`](/reference/global-configs/logs), которые можно использовать для переопределения значений, заданных в `dbt_project.yml`

### Отдельные адаптеры

- Профили [Postgres](/docs/local/connect-data-platform/postgres-setup) и [Redshift](/docs/local/connect-data-platform/redshift-setup) поддерживают настройку `retries` для повторных попыток подключения, если при открытии соединения dbt сталкивается с операционной ошибкой или превышением времени ожидания. По умолчанию выполняется 1 повторная попытка.
