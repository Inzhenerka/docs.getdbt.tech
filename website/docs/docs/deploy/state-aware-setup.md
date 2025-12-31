---
title: "Настройка оркестрации по состоянию"
sidebar_label: "Настройка оркестрации по состоянию"
description: "Настройте state-aware orchestration, чтобы автоматически определять, какие модели нужно собирать, обнаруживая изменения в коде или данных при каждом запуске job."
id: "state-aware-setup"
tags: ['scheduler']
---

# Настройка оркестрации по состоянию <Lifecycle status="private_preview,managed,managed_plus" /> {#setting-up-state-aware-orchestration}

<IntroText>

Настройте state-aware orchestration, чтобы автоматически определять, какие модели нужно собирать, обнаруживая изменения в коде или данных и собирая только изменившиеся модели при каждом запуске задания.

</IntroText>

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

## Предварительные требования {#prerequisites}

Чтобы использовать state-aware orchestration, убедитесь, что выполнены следующие требования:

- У вас есть аккаунт <Constant name="cloud" /> уровня [Enterprise или Enterprise+](https://www.getdbt.com/signup/) и [лицензия Developer seat](/docs/cloud/manage-access/seats-and-users).
- Среда, в которой будет запускаться state-aware orchestration, обновлена до движка dbt Fusion. Подробнее см. [Upgrading to dbt Fusion engine](/docs/dbt-versions/core-upgrade/upgrading-to-fusion).
- У вас есть dbt‑проект, подключенный к [платформе данных](/docs/cloud/connect-data-platform/about-connections).
- У вас есть [права доступа](/docs/cloud/manage-access/about-user-access) для просмотра, создания, изменения или запуска заданий.
- У вас настроена [deployment environment](/docs/deploy/deploy-environments) типа production или staging.
- (Необязательно) Для кастомизации поведения вы настроили модели или исходные данные с помощью [advanced configurations](#advanced-configurations).

:::info

State-aware orchestration доступна только для SQL‑моделей. Python‑модели не поддерживаются.

:::

## Настройки по умолчанию {#default-settings}

По умолчанию, для аккаунта уровня Enterprise, обновлённого до движка dbt Fusion, любое вновь созданное задание автоматически является state-aware. «Из коробки», без пользовательских настроек, при запуске задания будут собираться только те модели, в которых изменился код или появились новые данные в источниках.

## Создание задания {#create-a-job}

:::info Новые задания являются state-aware по умолчанию
Для существующих заданий включите state-aware orchestration, выбрав **Enable Fusion cost optimization features** на странице **Job settings**.
:::

Чтобы создать state-aware задание:

1. На странице deployment environment нажмите **Create job** и выберите **Deploy job**.
2. Параметры в разделе **Job settings**:
    - **Job name**: Укажите имя, например `Daily build`.
    - (Необязательно) **Description**: Опишите, что делает задание (например, какие данные оно использует и что создаёт).
    - **Environment**: По умолчанию установлена та deployment environment, из которой вы создаёте задание.
3. Параметры в разделах **Execution settings** и **Triggers**:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-triggers-section.png" width="90%" title="Пример Triggers на странице Deploy Job"/>

- Раздел **Execution settings**:
     - **Commands**: По умолчанию включает команду `dbt build`. Нажмите **Add command**, чтобы добавить другие [команды](/docs/deploy/job-commands), которые должны выполняться при запуске задания.
     - **Generate docs on run**: Включите, если хотите [генерировать документацию проекта](/docs/build/documentation) при запуске этого deploy‑задания.
     - **Enable Fusion cost optimization features**: Выберите этот пункт, чтобы включить **State-aware orchestration**. **Efficient testing** по умолчанию отключён. В разделе **More options** можно включать или отключать отдельные настройки.
- Раздел **Triggers**:
    - **Run on schedule**: Запускать deploy‑задание по расписанию.
      - **Timing**: Укажите, как именно планировать запуск: **Intervals** (каждые N часов), **Specific hours** (в определённые часы суток) или **Cron schedule** (по расписанию в формате [cron](#cron-schedule)).
      - **Days of the week**: По умолчанию — каждый день, если выбран **Intervals** или **Specific hours**.
    - **Run when another job finishes**: Запускать deploy‑задание, когда завершается другое _upstream_ deploy‑[задание](#trigger-on-job-completion).
        - **Project**: Укажите родительский проект, в котором находится upstream deploy‑задание.
        - **Job**: Укажите upstream deploy‑задание.
        - **Completes on**: Выберите статусы выполнения, при которых deploy‑задание будет поставлено в очередь ([enqueue](/docs/deploy/job-scheduler#scheduler-queue)).

6. (Необязательно) Параметры в разделе **Advanced settings**:
    - **Environment variables**: Определите [переменные окружения](/docs/build/environment-variables), чтобы настроить поведение проекта при запуске deploy‑задания.
    - **Target name**: Определите [target name](/docs/build/custom-target-names) для настройки поведения проекта при запуске. Переменные окружения и target name часто используются взаимозаменяемо.
    - **Run timeout**: Отменить deploy‑задание, если время выполнения превысит заданный лимит.
    - **Compare changes against**: По умолчанию установлено **No deferral**. Выберите **Environment** или **This Job**, чтобы указать <Constant name="cloud" />, с чем сравнивать изменения.

7. Нажмите **Save**.

В логах сводки запуска вы можете увидеть, какие модели dbt собирал. Модели, которые не были пересобраны, помечаются как **Reused** с пояснением, почему dbt пропустил их пересборку (и тем самым сэкономил вычислительные ресурсы). Также переиспользованные модели отображаются во вкладке **Reused**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/SAO_logs_view.png" width="90%" title="Пример логов для state-aware orchestration"/>

## Удаление job {#delete-a-job}

import DeleteJob from '/snippets/_delete-job.md';

<DeleteJob/>

## Расширенные конфигурации {#advanced-configurations}

По умолчанию dbt использует метаданные хранилища данных, чтобы проверять свежесть источников (или upstream‑моделей в случае Mesh). Для более сложных сценариев dbt предоставляет дополнительные возможности, позволяющие точно указать, что именно должно запускаться в рамках state-aware orchestration.

Вы можете настроить следующее:
- `loaded_at_field`: указать конкретный столбец в данных, который следует использовать.
- `loaded_at_query`: определить пользовательское SQL‑условие свежести, например, для частичных загрузок или потоковых данных.

Если источник является представлением (view) в хранилище данных, dbt не может отслеживать его обновления через метаданные хранилища при изменении представления. Без `loaded_at_field` или `loaded_at_query` dbt считает такой источник «всегда свежим» и выдаёт предупреждение при проверке свежести. Чтобы проверять свежесть источников‑представлений, добавьте `loaded_at_field` или `loaded_at_query` в конфигурацию.

:::note 
Можно определить либо `loaded_at_field`, либо `loaded_at_query`, но не оба одновременно.
:::

Также можно настроить:
- `updates_on`: изменить значение по умолчанию с `any` на `all`, чтобы модель не собиралась, пока все upstream‑зависимости не будут свежими, что ещё сильнее снижает вычислительные затраты.
- `build_after`: ограничить частоту сборки модели — не чаще, чем раз в указанный период, если данные нужны реже, чем обновляются источники.

Подробнее о свежести моделей и `build_after` см. [model `freshness` config](/reference/resource-configs/freshness). О настройках свежести источников и upstream‑моделей см. [resource `freshness` config](/reference/resource-properties/freshness).

## Кастомизация поведения {#customizing-behavior}

При необходимости вы можете дополнительно настроить state-aware orchestration, чтобы более точно управлять поведением оркестрации:

- **Определение свежести источников**

  По умолчанию dbt использует метаданные хранилища данных. Вместо этого вы можете:
  * Указать пользовательский столбец, и dbt будет ориентироваться на него
  * Задать пользовательский SQL‑запрос, определяющий, что считается свежими данными

  Свежесть источников может существенно различаться — особенно при частичных пайплайнах загрузки. Возможно, вам нужно отложить сборку модели до тех пор, пока в источники не поступит больший объём данных или пока не пройдёт определённое время.

  Вы можете определить понятие «свежести» отдельно для каждого источника с помощью пользовательского запроса, что позволяет:
  - Учитывать задержки поступления данных
  - Откладывать определение свежести до достижения порога (например, по количеству записей или часов данных)

- **Снижение частоты сборки моделей**

  Некоторым моделям не требуется пересборка при каждом обновлении источников. Для этого можно:
  - Задать интервал обновления для моделей, папок или всего проекта
  - Избежать избыточных сборок и снизить затраты, запуская только действительно нужные процессы

- **Изменение поведения с `any` на `all`**

  В зависимости от upstream‑зависимостей модели может быть предпочтительно дождаться обновления всех upstream‑моделей, а не начинать сборку при появлении любых новых данных.
  - Измените ожидание оркестрации с `any` на `all` для моделей, папок или всего проекта
  - Это помогает избежать лишних сборок и снижает затраты

  Настройки с использованием `build_after` можно задавать в следующих местах:
  - `dbt_project.yml` — на уровне проекта (YAML)
  - `model/properties.yml` — на уровне модели (YAML)
  - `model/model.sql` — на уровне модели (SQL)

Эти настройки удобны тем, что позволяют задать разумное значение по умолчанию для проекта или папок моделей и при необходимости переопределить его для отдельных моделей или групп.

## Пример {#example}

Рассмотрим пример, показывающий, как настроить проект так, чтобы модель и её родительская модель пересобирались только в том случае, если они не обновлялись в течение последних 4 часов — даже если задание запускается чаще.

Магазин Jaffle недавно расширился на глобальный рынок и решил сократить расходы. Чтобы снизить затраты, команда узнала о state-aware orchestration в <Constant name="cloud" /> и решила пересобирать модели только при необходимости. Maggie — analytics engineer — хочет настроить dbt‑проект `jaffle_shop` так, чтобы определённые модели пересобирались только если они не обновлялись последние 4 часа, даже если задание запускается чаще.

Для этого она использует конфигурацию `freshness` у модели. Эта настройка помогает state-aware orchestration определить, _когда_ модель должна быть пересобрана.

Обратите внимание: для каждой настройки `freshness` необходимо указать оба значения — `count` и `period`. Это относится ко всем типам `freshness`: `freshness.warn_after`, `freshness.error_after` и `freshness.build_after`.

Ниже приведены примеры использования `freshness` в файле модели, в YAML‑файле проекта и в блоке `config` внутри `model.sql`:

<Tabs>
<TabItem value="project" label="Model YAML">

<File name="models/model.yml">

```yaml
models:
  - name: dim_wizards
    config:
      freshness: 
        build_after:
          count: 4         # сколько ждать перед пересборкой
          period: hour     # единица времени
          updates_on: all  # пересобирать только если у всех upstream-зависимостей есть новые данные
  - name: dim_worlds
    config:
      freshness:
        build_after:
          count: 4
          period: hour
          updates_on: all
```
</File>

</TabItem>
<TabItem value="yml" label="Project YAML file">

<File name="dbt_project.yml">
  
```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-properties/freshness):
      build_after: 
        count: 4
        period: hour
        updates_on: all 
```
</File>

</TabItem>
<TabItem value="sql" label="SQL file config">

<File name="models/<filename>.sql">
  
```jinja
{{
    config(
        freshness={
            "build_after": {
                "count": 4,
                "period": "hour",
                "updates_on": "all"
            }
        }
    )
}}
```

</File>
</TabItem>
</Tabs>

С такой конфигурацией dbt:

- Проверяет наличие новых данных в upstream‑источниках
- Проверяет, когда `dim_wizards` и `dim_worlds` собирались в последний раз

Если есть новые данные _и_ прошло не менее 4 часов, <Constant name="cloud" /> пересобирает модели.

Вы можете переопределять правила свежести, заданные на более высоком уровне проекта. Например, если в YAML‑файле проекта указано:

<File name="dbt_project.yml">
```yml
models:
  +freshness:
    build_after:
      count: 4
      period: hour
  jaffle_shop: # this needs to match your project `name:` in dbt_project.yml
    staging:
      +materialized: view
    marts:
      +materialized: table
```
</File>

Это означает, что для каждой модели в проекте установлен `build_after` равный 4 часам. Чтобы изменить это для отдельных моделей или групп, можно задать:

<File name="dbt_project.yml">
```yml
models:
  +freshness:
    build_after:
      count: 4
      period: hour
  marts: # only applies to models inside the marts folder
    +freshness:
      build_after:
        count: 1
        period: hour
```
</File>

Если вы хотите исключить модель из правила свежести, заданного на более высоком уровне, установите `freshness: null` для этой модели. При отключённой свежести state-aware orchestration возвращается к поведению по умолчанию и собирает модель при любом изменении кода или данных upstream.

### Различия между `all` и `any` {#differences-between-all-and-any}

- Так как Maggie настроила `updates_on: all`, это означает, что _обе_ модели должны иметь новые upstream‑данные, чтобы запустить пересборку. Если свежие данные есть только у одной модели, сборка не произойдёт — что значительно снижает вычислительные затраты и экономит время.

- Если бы Maggie хотела пересобирать модели чаще (например, когда _любой_ upstream‑источник обновился), она могла бы использовать `updates_on: any`:

<File name="models/model.yml">

```yaml
    freshness:
      build_after:
        count: 1
        period: hour
        updates_on: any
```
</File>

В этом случае, если у `dim_wizards` или `dim_worlds` появятся свежие upstream‑данные и пройдёт достаточно времени, dbt пересоберёт модели. Такой подход полезен, когда актуальность данных важнее стоимости вычислений.

## Ограничения {#limitation}

Ниже перечислены ограничения и особенности использования state-aware orchestration:

### Удалённые таблицы {#deleted-tables}

Если таблица была удалена в хранилище данных, а код модели и данные, от которых она зависит, не изменились, state-aware orchestration не обнаружит изменений и не пересоберёт таблицу. Это связано с тем, что dbt определяет, что нужно собирать, на основе изменений кода и данных, а не проверяет существование каждой таблицы. Чтобы пересобрать таблицу, можно:

- **Clear cache and rebuild**: Перейдите в **Orchestration** > **Environments** и нажмите **Clear cache**. Следующий запуск пересоберёт все модели с чистого состояния.

- **Temporarily disable state-aware orchestration**: Перейдите в **Orchestration** > **Jobs**, выберите задание и нажмите **Edit**. В разделе **Enable Fusion cost optimization features** отключите **State-aware orchestration** и нажмите **Save**. Запустите задание для полной сборки, затем снова включите эту функцию.

## Связанные материалы {#related-docs}

- [Конфигурация state-aware orchestration](/docs/deploy/state-aware-about)
- [Артефакты](/docs/deploy/artifacts)
- [Jobs непрерывной интеграции (CI)](/docs/deploy/ci-jobs)
- [`freshness`](/reference/resource-configs/freshness)
