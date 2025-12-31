---
title: "Обновление до версии v1.6"
description: Новые функции и изменения в dbt Core v1.6
id: "upgrading-to-v1.6"
displayed_sidebar: "docs"
---

В версии <Constant name="core" /> v1.6 есть три ключевые области фокуса:

1. Следующий этап развития [multi-project deployments](https://github.com/dbt-labs/dbt-core/discussions/6725): улучшения контрактов, групп и управления доступом, версий, а также базовые строительные блоки для межпроектного `ref`
2. Перезапуск семантического слоя: интеграция <Constant name="core" /> и [MetricFlow](/docs/build/about-metricflow)
3. Механизмы для поддержки зрелых развертываний в масштабе (`dbt clone` и `dbt retry`)

## Ресурсы {#resources}

- [Журнал изменений](https://github.com/dbt-labs/dbt-core/blob/1.6.latest/CHANGELOG.md)
- [Руководство по установке <Constant name="core" />](/docs/core/installation-overview)
- [Руководство по обновлению Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud)
- [График релизов](https://github.com/dbt-labs/dbt-core/issues/7481)

## Что нужно знать перед обновлением {#what-to-know-before-upgrading}

dbt Labs стремится обеспечить обратную совместимость для всех версий 1.x, за исключением изменений, явно указанных ниже. Если вы столкнетесь с ошибкой при обновлении, пожалуйста, сообщите нам, [создав проблему](https://github.com/dbt-labs/dbt-core/issues/new).

### Изменения в поведении {#behavior-changes}

:::info Требуется действие, если ваш проект определяет `metrics`

[Спецификация для метрик](https://github.com/dbt-labs/dbt-core/discussions/7456) изменилась и теперь использует [MetricFlow](/docs/build/about-metricflow).

:::

Если ваш проект dbt определяет метрики, вам необходимо перейти на dbt v1.6, так как спецификация YAML переместилась из dbt_metrics в MetricFlow. Любые тесты, которые у вас есть, не будут компилироваться на v1.5 или более старых версиях.

- <Constant name="core" /> v1.6 не поддерживает Python 3.7, срок поддержки которого (End Of Life) закончился 23 июня. Поддерживаемые версии Python: 3.8, 3.9, 3.10 и 3.11.
- В рамках перезапуска (в статусе beta) [dbt Semantic layer](/docs/use-dbt-semantic-layer/dbt-sl) спецификация `metrics` была существенно изменена. Подробнее о том, как выполнить миграцию на обновлённый dbt Semantic Layer, см. [руководство по миграции](/guides/sl-migration).
- Версия схемы manifest теперь — v10.
- dbt Labs прекращает поддержку установки <Constant name="core" /> и адаптеров через Homebrew. Подробнее см. [обсуждение](https://github.com/dbt-labs/dbt-core/discussions/8277).

### Для потребителей артефактов dbt (метаданные) {#for-consumers-of-dbt-artifacts-metadata}

Версия схемы [манифеста](/reference/artifacts/manifest-json) обновлена до `v10`. Конкретные изменения:
- Добавление `semantic_models` и изменения в атрибутах `metrics`
- Добавление `deprecation_date` как свойства модели
- Добавление `on_configuration_change` как конфигурации узла по умолчанию (для поддержки материализованных представлений)
- Небольшие изменения типов в `contracts` и `constraints`
- Манифест `metadata` включает `project_name`

### Для разработчиков плагинов адаптеров {#for-maintainers-of-adapter-plugins}

Для получения более подробной информации и возможности задать вопросы, пожалуйста, ознакомьтесь с обсуждением и оставьте комментарий в GH: [dbt-labs/<Constant name="core" />#7958](https://github.com/dbt-labs/dbt-core/discussions/7958).

## Новая и измененная документация {#new-and-changed-documentation}

### MetricFlow {#metricflow}

- [**Создавайте свои метрики**](/docs/build/build-metrics-intro) с помощью MetricFlow — ключевого компонента <Constant name="semantic_layer" />. Вы можете определять метрики и строить семантические модели с помощью MetricFlow, доступного в командной строке (CLI) для <Constant name="core" /> версии v1.6 beta и выше.

### Материализованные представления {#materialized-views}

Поддерживается на:
- [Postgres](/reference/resource-configs/postgres-configs#materialized-view)
- [Redshift](/reference/resource-configs/redshift-configs#materialized-view)
- [Snowflake](/reference/resource-configs/snowflake-configs#dynamic-tables)
- [Databricks](/reference/resource-configs/databricks-configs#materialized-views-and-streaming-tables)


### Новые команды для зрелого развертывания {#new-commands-for-mature-deployment}

[`dbt retry`](/reference/commands/retry) выполняет ранее запущенную команду с точки сбоя. Перестройте только те узлы, которые завершились ошибкой или были пропущены в предыдущем запуске/сборке/тесте, вместо того чтобы начинать с нуля.

[`dbt clone`](/reference/commands/clone) использует функциональность каждой платформы данных для создания легковесных копий моделей dbt из одной среды в другую. Полезно при быстром развертывании новой среды разработки или продвижении конкретных моделей из промежуточной среды в производственную.

### Многопроектное сотрудничество {#multi-project-collaboration}

[**Дата устаревания**](/reference/resource-properties/deprecation_date): Модели могут объявлять дату устаревания, которая будет предупреждать производителей моделей и потребителей ниже по потоку. Это позволяет установить четкие окна миграции для версионных моделей и предоставляет механизм для удаления незрелых или малоиспользуемых моделей, помогая избежать разрастания проекта.

[Названия моделей](/faqs/Project/unique-resource-names) могут дублироваться в разных пространствах имен (проектах/пакетах), если они уникальны в каждом проекте/пакете. Мы настоятельно рекомендуем использовать [двухаргументный `ref`](/reference/dbt-jinja-functions/ref#ref-project-specific-models) при ссылке на модель из другого пакета/проекта.

Больше согласованности и гибкости вокруг пакетов. Ресурсы, определенные в пакете, будут учитывать определения переменных и глобальных макросов в рамках этого пакета.
- `vars`, определенные в `dbt_project.yml` пакета, теперь доступны в порядке разрешения при компиляции узлов в этом пакете, хотя CLI `--vars` и `vars` корневого проекта все еще будут иметь приоритет. Подробнее см. ["Приоритет переменных"](/docs/build/project-variables#variable-precedence).
- Макросы `generate_x_name` (определяющие пользовательские правила для именования базы данных, схемы, псевдонимов) следуют той же схеме, что и другие "глобальные" макросы для переопределений в рамках пакета. См. [макросы диспетчеризации](/reference/dbt-jinja-functions/dispatch) для обзора возможных схем.

:::caution Closed Beta - <Constant name="cloud" /> Enterprise
[**Project dependencies**](/docs/mesh/govern/project-dependencies): Представляет файл `dependencies.yml` и зависимые `projects` как функциональность <Constant name="cloud" /> Enterprise. Позволяет принудительно применять правила доступа к моделям (public vs. protected/private) на границах проектов и пакетов. Обеспечивает кросс‑проектный `ref` к публичным моделям без необходимости устанавливать исходный код вышестоящего проекта.
:::
:::

### Устаревший функционал {#deprecated-functionality}

Возможность для установленных пакетов переопределять встроенные материализации без явного согласия пользователя устаревает.

- Переопределение встроенной материализации из установленного пакета вызывает предупреждение об устаревании.
- Использование пользовательской материализации из установленного пакета не вызывает предупреждения об устаревании.
- Использование переопределения встроенной материализации из корневого проекта через оберточную материализацию все еще поддерживается. Например:

  ```
  {% materialization view, default %}
  {{ return(my_cool_package.materialization_view_default()) }}
  {% endmaterialization %}
  ```

### Быстрые изменения {#quick-hits}

- [`state:unmodified` и `state:old`](/reference/node-selection/methods#state) для [MECE](https://en.wikipedia.org/wiki/MECE_principle) выборки по состоянию
- [`invocation_args_dict`](/reference/dbt-jinja-functions/flags#invocation_args_dict) включает полную `invocation_command` как строку
- [`dbt debug --connection`](/reference/commands/debug) для тестирования только подключения к платформе данных, указанного в профиле
- [`dbt docs generate --empty-catalog`](/reference/commands/cmd-docs) для пропуска заполнения каталога при генерации документации
- [`--defer-state`](/reference/node-selection/defer) позволяет более детально управлять
- [`dbt ls`](/reference/commands/list) добавляет метод выбора семантической модели, позволяя использовать `dbt ls -s "semantic_model:*"` и возможность выполнять `dbt ls --resource-type semantic_model`.
- Синтаксис для `DBT_ENV_SECRET_` изменен на `DBT_ENV_SECRET` и больше не требует завершающего подчеркивания.