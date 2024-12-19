---
title: "Обновление до v1.2"
description: Новые функции и изменения в dbt Core v1.2
id: "upgrading-to-v1.2"
displayed_sidebar: "docs"
---

### Ресурсы

- [Журнал изменений](https://github.com/dbt-labs/dbt-core/blob/1.2.latest/CHANGELOG.md)
- [Руководство по установке dbt Core CLI](/docs/core/installation-overview)
- [Руководство по обновлению в облаке](/docs/dbt-versions/upgrade-dbt-version-in-cloud)

## Что нужно знать перед обновлением

Нет никаких разрушающих изменений для кода в проектах и пакетах dbt. Мы стремимся обеспечить обратную совместимость для всех версий 1.x. Если вы столкнетесь с ошибкой после обновления, пожалуйста, дайте нам знать, [открыв проблему](https://github.com/dbt-labs/dbt-core/issues/new).

### Для пользователей артефактов dbt (метаданные)

Версия схемы манифеста была обновлена до `v6`. Соответствующие изменения:
- Изменение значения по умолчанию для `config`, которое включает новое свойство `grants` со значением по умолчанию `{}`
- Добавление свойства `metrics` к любому узлу, который может ссылаться на метрики с помощью функции `metric()`

Для пользователей [выбора на основе состояния](/reference/node-selection/syntax#about-node-selection): Это обновление также включает новую логику, объявляющую обратную совместимость для более старых версий манифеста. При запуске dbt Core v1.2 должно быть возможно использовать выбор `state:modified --state ...` по отношению к манифесту, созданному dbt Core v1.0 или v1.1.

## Для поддерживающих адаптеры плагинов

Смотрите обсуждение на GitHub [dbt-labs/dbt-core#5468](https://github.com/dbt-labs/dbt-core/discussions/5468) для получения подробной информации.

## Новая и измененная функциональность

- **[Grants](/reference/resource-configs/grants)** впервые нативно поддерживаются в `dbt-core`. Эта поддержка распространяется на все стандартные материализации и самые популярные адаптеры. Если вы уже используете хуки для применения простых грантов, мы рекомендуем вам использовать встроенные `grants` для настройки ваших моделей, семян и снимков. Это позволит вам [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) ваш дублирующийся или шаблонный код.
- **[Metrics](/docs/build/build-metrics-intro)** теперь поддерживают тип `expression` (метрики на метриках), а также функцию `metric()`, которую можно использовать при ссылке на метрики из моделей, макросов или метрик типа `expression`. Для получения дополнительной информации о том, как использовать метрики выражений, ознакомьтесь с [**пакетом `dbt_metrics`**](https://github.com/dbt-labs/dbt_metrics).
- **[Функции dbt-Jinja](/reference/dbt-jinja-functions)** теперь включают [модуль Python `itertools`](/reference/dbt-jinja-functions/modules#itertools), а также функции [set](/reference/dbt-jinja-functions/set) и [zip](/reference/dbt-jinja-functions/zip).
- **[Выбор узлов](/reference/node-selection/syntax)** включает [метод выбора файла](/reference/node-selection/methods#file) (`-s model.sql`) и наследование [yaml селекторов](/reference/node-selection/yaml-selectors).
- **[Глобальные конфигурации](/reference/global-configs/about-global-configs)** теперь включают настройки флагов CLI и переменных окружения для [`target-path`](/reference/global-configs/json-artifacts) и [`log-path`](/reference/global-configs/logs), которые могут использоваться для переопределения значений, установленных в `dbt_project.yml`.

### Конкретные адаптеры

Профили [Postgres](/docs/core/connect-data-platform/postgres-setup) и [Redshift](/docs/core/connect-data-platform/redshift-setup) поддерживают конфигурацию `retries`, если dbt сталкивается с операционной ошибкой или тайм-аутом при открытии соединения. Значение по умолчанию — 1 повторная попытка.