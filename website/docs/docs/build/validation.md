---
title: Валидации
id: validation
description: "Семантический слой, работающий на базе MetricFlow, включает три типа встроенных валидаций: валидация синтаксиса, семантическая валидация и валидация на уровне платформы данных, которые выполняются последовательно и блокирующим образом."
sidebar_label: "Валидации"
tags: [Metrics, Semantic Layer]
availability: all_users
---

Валидации — это процесс проверки того, что система или конфигурация соответствует ожидаемым требованиям или ограничениям. В случае с <Constant name="semantic_layer" />, работающим на базе MetricFlow, предусмотрены три встроенные валидации — [parsing](#parsing), [semantic](#semantic-syntax) и [data platform](#data-platform).

Эти проверки гарантируют, что файлы конфигурации соответствуют ожидаемой схеме, семантический граф не нарушает никаких ограничений, а семантические определения в графе существуют в физической таблице &mdash; обеспечивая эффективную поддержку управления данными. Эти три этапа проверки выполняются последовательно, и каждый из них должен завершиться успешно, прежде чем можно будет перейти к следующему.

Код, который обрабатывает валидацию, [можно найти здесь](https://github.com/dbt-labs/dbt-semantic-interfaces/tree/main/dbt_semantic_interfaces/validations) для тех, кто хочет углубиться в эту тему.

## Команда валидации {#validations-command}

Вы можете запускать проверки из <Constant name="dbt_platform" /> или из командной строки с помощью следующих [команд MetricFlow](/docs/build/metricflow-commands). В <Constant name="dbt" /> для запуска `dbt sl validate` в IDE или CLI необходимо настроить учетные данные пользователя в настройках вашей учетной записи, а для запуска в CI — учетные данные развертывания.

- For <Constant name="fusion" /> and dbt users in the <Constant name="platform_cli" /> or locally with a valid [`dbt_cloud.yml`](/reference/dbt_cloud.yml):

  ```bash
  dbt sl validate
  ```

  This runs parsing, semantic, and (where supported) data platform validations.

  When using `dbt sl validate` locally, the command validates your local semantic manifest, and not the platform's manifest. This means your uncommitted local changes are included in the validation.

- For <Constant name="core" /> (open source) users or v2 CLI users not connected to dbt platform and using local MetricFlow:

  ```bash
  mf validate-configs
  ```
  
  This runs parsing and semantic validations.

## Availability by environment

Validation behavior and availability differ depending on your environment and setup:

| Environment | Who can use | Parsing | Semantic syntax | Data platform | How to run |
| --- | --- | --- | --- | --- | --- |
| <Constant name="fusion_engine"/>  | <Constant name="dbt_platform"/> users for full <Constant name="semantic_layer" /> features | ✅ | ✅ * | ✅ | - Parsing validations run automatically while generating the semantic manifest. <br></br> - When running in development, semantic syntax validations run automatically on <Constant name="dbt_platform"/> if [`dbt_cloud.yml`](/reference/dbt_cloud.yml) is configured. If not, run manually using `mf validate-configs`. <br></br> - Data platform validations don't run automatically for <Constant name="fusion" />. You must run `dbt sl validate` to run data platform validations.|
| <Constant name="platform_cli"/>  | <Constant name="dbt_platform"/>  users | ✅ | ✅ | ✅ | Run any <Constant name="platform_cli"/>  command; validations execute automatically except data platform validations. You must run `dbt sl validate` to run data platform validations.|
| <Constant name="core"/>  | Open source users | ✅ | ✅ | ❌ | Use <Constant name="core"/>  for parsing/builds. Run additional validation manually with the MetricFlow CLI. |
| MetricFlow CLI | Open source users | ✅ | ✅ | ✅ | Run `mf validate-configs` locally to validate and test metrics. |

*Jobs run in **Orchestration** or **Studio IDE** run this validation automatically.

## Синтаксическая валидация {#parsing}

На этом этапе валидации мы проверяем, что ваши файлы конфигурации соответствуют заданной схеме для каждого объекта семантического графа и могут быть успешно разобраны. На этом этапе проверяются схемы следующих основных объектов:
<VersionBlock lastVersion="1.11">

* Семантические модели
* Идентификаторы
* Меры
* Измерения
* Метрики
</VersionBlock>
<VersionBlock firstVersion="1.12">
* Семантические модели
* Идентификаторы
* Простые метрики
* Измерения
* Метрики
</VersionBlock>

## Семантический синтаксис {#semantic-syntax}

Этот этап синтаксической проверки выполняется после построения вашего семантического графа. <Constant name="semantic_layer" /> на базе MetricFlow выполняет набор тестов, чтобы убедиться, что ваш семантический граф не нарушает никаких ограничений. Например, мы проверяем, уникальны ли имена <VersionBlock lastVersion="1.11">мер</VersionBlock><VersionBlock firstVersion="1.12">простых метрик</VersionBlock> и существуют ли метрики, на которые ссылается материализация. Сейчас мы проверяем следующие семантические правила:

<VersionBlock lastVersion="1.11">
1. Проверка наличия корректного временного измерения в семантических моделях с мерами
2. Проверка того, что в каждой семантической модели определён только один первичный идентификатор
3. Согласованность измерений
4. Уникальность мер в семантических моделях
5. Корректность мер в метриках
7. Правильность настройки накопительных метрик
</VersionBlock>

<VersionBlock firstVersion="1.12">
1. Проверка наличия корректного временного измерения в семантических моделях с простыми метриками
2. Проверка того, что в каждой семантической модели определён только один первичный идентификатор
3. Согласованность измерений
4. Уникальность простых метрик в семантических моделях
5. Корректность простых метрик
7. Правильность настройки накопительных метрик
</VersionBlock>

## Платформа данных {#data-platform}

Этот тип валидации проверяет, существуют ли семантические определения из вашего семантического графа в базовой физической таблице. Для этого мы выполняем запросы к вашей платформе данных, чтобы убедиться, что сгенерированный SQL для семантических моделей, измерений и метрик выполняется без ошибок.

Мы выполняем следующие проверки:

<VersionBlock lastVersion="1.11">
* Меры и измерения существуют
* Базовые таблицы источников данных существуют
* Сгенерированный SQL для метрик выполняется без ошибок
</VersionBlock>

<VersionBlock firstVersion="1.12">
* Простые метрики и измерения существуют
* Базовые таблицы источников данных существуют
* Сгенерированный SQL для метрик выполняется без ошибок
</VersionBlock>

Вы можете запускать семантические валидации (против вашего семантического слоя) в CI задаче, чтобы гарантировать, что любые изменения кода, внесенные в модели dbt, не нарушают эти метрики. Для получения дополнительной информации обратитесь к [семантической валидации в CI](/docs/deploy/ci-jobs#semantic-validations-in-ci).