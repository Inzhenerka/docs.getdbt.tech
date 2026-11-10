---
title: "Создание определений Semantic Layer с помощью dbt Wizard"
id: "wizard-7-semantic-layer"
description: "Используйте dbt Wizard для планирования, написания и проверки сущностей, измерений, метрик и сохранённых запросов Semantic Layer."
sidebar_label: "Создание определений Semantic Layer"
tags: [AI, Wizard, Semantic Layer]
---

<IntroText>
Используйте <Constant name="wizard" />, чтобы преобразовать бизнес-вопрос или существующую модель dbt в определения <Constant name="semantic_layer" />, совместимые с вашей версией. Прежде чем предложить сущности, измерения и метрики, <Constant name="wizard" /> изучает уровень детализации модели, столбцы, цепочку зависимостей и связанные YAML-файлы.
</IntroText>

В этом рабочем процессе для выполнения задач используются файлы вашего проекта и доступные метаданные dbt. Вы также можете добавить навык `building-dbt-semantic-layer` из [репозитория dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills), чтобы использовать готовые рекомендации по работе с Semantic Layer.

Промпты на этой странице работают таким же образом в <Constant name="dbt_platform" />.

## Прежде чем начать

Прежде чем просить <Constant name="wizard" /> редактировать файлы, определите следующее:

- Бизнес-вопрос или метрику, для которых нужно подготовить определения.
- Модель или набор подходящих моделей, содержащих нужные данные.
- Уровень детализации каждой модели, если он вам уже известен.
- Соглашения об именовании, сертификации и назначении ответственных, принятые в вашей команде.

Если вы не знаете, какую модель использовать, начните с бизнес-вопроса. Например:

```text
We need to report gross revenue and order count by customer segment and month.
Find the best models to build on, explain your choices, and propose the Semantic
Layer definitions before editing files.
```

## Попросите Wizard спланировать определения

Укажите для <Constant name="wizard" /> конкретную модель, если знаете, с чего начать:

```text
Build Semantic Layer definitions for fct_orders. First determine the dbt version
and inspect the model grain, columns, lineage, and existing YAML. Propose the
entities, dimensions, and metrics before making changes. Include total revenue,
order count, and a monthly time dimension.
```

Перед редактированием <Constant name="wizard" /> должен выполнить следующие шаги планирования:

1. Определить версию dbt по установленному исполняемому файлу, `require-dbt-version` или метаданным манифеста.
2. Изучить SQL-код целевой модели, её столбцы, а также вышестоящие и нижестоящие зависимости.
3. Проверить связанные YAML-файлы и существующие семантические определения, чтобы новое содержимое соответствовало соглашениям проекта.
4. Определить уровень детализации модели и хотя бы одну первичную сущность.
5. Предложить временные и категориальные измерения, а также метрики, агрегации которых имеют смысл для исходных данных.

Просите <Constant name="wizard" /> делать выборку данных только тогда, когда названия, типы и SQL-код не позволяют определить смысл столбца. Проверьте и одобрите запрос к хранилищу данных перед его выполнением.

## Проверьте сгенерированный YAML

Правильная структура YAML зависит от версии dbt в вашем проекте. Проверьте сгенерированный файл на соответствие шаблонам для вашей версии, приведённым в следующей таблице.

<SimpleTable>

| Версия проекта | Ожидаемая структура |
|---|---|
| [<Constant name="dbt" /> 1.12 и более поздние версии](/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.12?version=2.0#new-semantic-layer-yaml-spec), а также [<Constant name="fusion_engine" />](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2?version=2.0) | Настройте `semantic_model` на уровне модели, добавьте аннотации сущностей и измерений к столбцам и определите метрики на уровне модели. Не используйте блок `semantic_models:` верхнего уровня для новых определений. |
| [<Constant name="dbt" /> с 1.6 по 1.11](/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.11?version=2.0) | Определяйте семантические модели в блоке `semantic_models:` верхнего уровня, а метрики — с помощью `type_params`, ссылающихся на меры. |

</SimpleTable>

Для <Constant name="dbt" /> 1.12 и более поздних версий, а также <Constant name="fusion_engine" /> сгенерированное определение может выглядеть следующим образом:

```yaml
models:
  - name: fct_orders
    semantic_model:
      enabled: true
    agg_time_dimension: ordered_at
    columns:
      - name: order_id
        entity:
          type: primary
          name: order
      - name: customer_id
        entity:
          type: foreign
          name: customer
      - name: ordered_at
        granularity: day
        dimension:
          type: time
      - name: order_status
        dimension:
          type: categorical
    metrics:
      - name: total_revenue
        type: simple
        label: Total Revenue
        agg: sum
        expr: order_total
      - name: order_count
        type: simple
        label: Order Count
        agg: count_distinct
        expr: order_id
```

Для <Constant name="dbt" /> с 1.6 по 1.11 ожидается шаблон с семантической моделью верхнего уровня:

```yaml
semantic_models:
  - name: orders
    model: ref('fct_orders')
    defaults:
      agg_time_dimension: ordered_at
    entities:
      - name: order
        type: primary
        expr: order_id
    dimensions:
      - name: ordered_at
        type: time
        type_params:
          time_granularity: day
    measures:
      - name: total_revenue
        agg: sum
        expr: order_total

metrics:
  - name: total_revenue
    type: simple
    label: Total Revenue
    type_params:
      measure: total_revenue
```

Убедитесь, что каждое сгенерированное определение имеет ясный бизнес-смысл. Числовой столбец не обязательно является полезной метрикой, а идентификатор не обязательно подходит в качестве первичной сущности.

## Проверьте определения

После одобрения YAML попросите <Constant name="wizard" /> выполнить проверку:

```text
Validate the Semantic Layer changes. Parse the project, run the supported
Semantic Layer validation for this environment, and report errors, warnings,
and any checks you couldn't complete. Don't change the definitions to silence
an error without explaining the root cause.
```

Как минимум, проверка должна подтвердить следующее:

- Проект успешно проходит разбор.
- Ссылки на модели, столбцы, сущности, меры и метрики разрешаются.
- Временное измерение агрегации указывает на объявленное временное измерение.
- Выбранная агрегация метрики соответствует уровню детализации модели.
- Проверка Semantic Layer проходит успешно, если среда выполнения dbt в проекте её поддерживает.

Если команда проверки недоступна в текущей среде, <Constant name="wizard" /> должен сообщить об этом ограничении, а не считать работу полностью проверенной. Более подробная процедура проверки описана в разделе [Проверка изменений dbt с помощью <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-3-validate-changes).

## Дополните первоначальные определения

После успешной проверки первоначальных определений продолжайте работу с помощью целевых промптов, а не просите преобразовать весь проект сразу. Например:

```text
Add a derived average order value metric using the existing revenue and order
count metrics. Explain how the metric joins and time grain will behave before
editing the YAML.
```

```text
Create a saved query for monthly revenue and order count grouped by customer
segment. Reuse existing entities and dimensions, and validate every reference.
```

## Связанная документация

- [Семантические модели](/docs/build/semantic-models)
- [Обзор метрик](/docs/build/metrics-overview)
- [Сценарии использования и примеры](/docs/dbt-ai/wizard-use-cases)
- [Использование навыков с CLI <Constant name="wizard" />](/docs/dbt-ai/wizard-skills)
- [Проверка изменений dbt с помощью <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-3-validate-changes)
