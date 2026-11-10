---
title: "Переход на последнюю версию спецификации YAML"
id: "latest-metrics-spec"
description: "Узнайте, как перейти с устаревшей спецификации метрик на последнюю версию."
sidebar_label: Переход на последнюю версию спецификации YAML 
tags: [Metrics, Semantic Layer, dbt v2]
availability: all_users
---


Последняя версия спецификации Semantic Layer задаёт открытый стандарт определения метрик и измерений, который работает на разных платформах. Она упрощает создание определений: семантические аннотации размещаются непосредственно в каждой модели, меры заменяются простыми метриками, а часто используемые параметры выносятся в ключи верхнего уровня. 

Новая спецификация упрощает настройку без потери гибкости, ускоряет адаптацию новых участников и помогает внедрить согласованные метрики с централизованным управлением во всей организации. 

import LatestYamlSpecAvailability from '/snippets/_latest-yaml-spec-availability.md';

<LatestYamlSpecAvailability />

## Изменения в последней версии спецификации 

В этом разделе описаны ключевые обновления последней версии спецификации метрик и приведено сравнение с устаревшей спецификацией.

- [Семантические модели](#semantic-models): определяют бизнес-логику метрик, задавая сущности, измерения и их связь с моделями данных. В новой спецификации `semantic_model` вложен непосредственно в каждую модель в `models:`, а не является ключом верхнего уровня.
- [Сущности и измерения](#entities-and-dimensions): сущности — это люди, места или объекты, по которым вы хотите группировать метрики или выполнять соединения (например, `user_id` или `order_id`), а измерения — атрибуты, используемые для фильтрации данных или получения срезов (например, `status` или `region`). В новой спецификации и те и другие определяются непосредственно в `columns:`.
- [Временное измерение](#time-dimension): временные измерения — это столбцы с датами или временными метками, которые позволяют анализировать метрики во времени (например, `order_date` или `created_at`). В новой спецификации задайте `agg_time_dimension` на уровне модели как временное измерение по умолчанию для всех метрик; при необходимости его можно переопределить для отдельной метрики. Задавайте `granularity` на уровне столбца вместо устаревшего `time_granularity`.
- [Простые метрики](#simple-metrics): метрики, которые напрямую ссылаются на выражение с одним столбцом в семантической модели, без участия дополнительных столбцов. В новой спецификации простые метрики заменяют меры. Для замены мер используйте метрики с `type: simple`, определённые непосредственно в модели.
- [Сложные метрики](#advanced-metrics): метрики, которые объединяют другие метрики или строятся на их основе, например отношения, конверсии или производные вычисления. В новой спецификации определяйте простые метрики внутри модели, а метрики, использующие несколько моделей, — в блоке `metrics` верхнего уровня. Ключ верхнего уровня обязателен для любой метрики, которая зависит от метрик или измерений, определённых в другой семантической модели.
- [`type_params`](#type_params): ключ-обёртка в устаревшей спецификации, содержащий настройки, специфичные для метрики (например, `expr`, `join_to_timespine`). В новой спецификации `type_params` устарел, а эти параметры вынесены в ключи верхнего уровня в определении каждой метрики.

### Семантические модели {#semantic-models}

Ключ `semantic_model` вложен в `models`.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Новая спецификация</h4>

```yml
models:
  - name: fct_orders
    semantic_model:
      enabled: true # обязательно
      name: fct_orders_semantic_model # необязательное переопределение; по умолчанию используется значение model.name
```
</div>

<div>

<h4 style={{marginTop: 0}}>Устаревшая спецификация</h4>

```yml
semantic_models:
  - name: orders
     model: ref('orders')
```

</div>

</div>

import SLMeshLatestSpec from '/snippets/_sl-mesh-latest-spec.md';

<SLMeshLatestSpec/>

### Сущности и измерения {#entities-and-dimensions}

Сущности и измерения определяются непосредственно в столбцах, создавая связь 1:1 между физическими столбцами и их семантическими определениями.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Новая спецификация</h4>

```yml
models:
  - name: orders
    semantic_model:
      enabled: true
    agg_time_dimension: ordered_at
    columns:
      # сущности
      - name: order_id
        entity:
          type: primary
          name: order
      - name: customer_id
        entity:
          type: foreign
          name: customer

      # временное измерение
      - name: ordered_at
        granularity: day
        dimension:
          type: time

      # категориальное измерение
      - name: order_status
        dimension:
          type: categorical
```

</div>

<div>

<h4 style={{marginTop: 0}}>Устаревшая спецификация</h4>

```yml
semantic_models:
  - name: orders
    model: ref('orders')
    entities:
      - name: order
        type: primary
        expr: order_id
      - name: customer
        type: foreign
        expr: customer_id
    dimensions:
      - name: ordered_at
        type: time
        type_params:
          time_granularity: day
      - name: status
        type: categorical
        expr: order_status
```

</div>

</div>


### Временное измерение {#time-dimension}

- `agg_time_dimension`: задаётся один раз на уровне модели как временное измерение по умолчанию для всех метрик в этой семантической модели. Его по-прежнему можно переопределить для отдельной метрики с помощью `agg_time_dimension`.
- `time granularity`: устарело в новой спецификации. Задавайте исходную детализацию в столбце временного измерения с помощью `granularity` (например, `hour`, `day`).

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Новая спецификация</h4>

```yml
models:
  - name: subscriptions
    semantic_model:
      enabled: true

    # временное измерение агрегации по умолчанию для метрик этой модели
    agg_time_dimension: activated_at

    columns:
      - name: activated_at
        granularity: day # исходная детализация столбца
        dimension:
          type: time

      - name: created_at
        granularity: hour # другой временной столбец с иной исходной детализацией
        dimension:
          type: time

    metrics:
      - name: active_subscriptions
        type: simple
        agg: count
        expr: 1 # наследует agg_time_dimension: activated_at

      - name: signups_by_created_day
        type: simple
        agg: count
        expr: 1
        agg_time_dimension: created_at # переопределение для использования created_at в качестве временного измерения
```

</div>

<div>

<h4 style={{marginTop: 0}}>Устаревшая спецификация</h4>

```yml
semantic_models:
  - name: subscriptions
    model: ref('subscriptions')

    defaults:
      agg_time_dimension: activated_at

    dimensions:
      - name: activated_at
        type: time
        type_params:
          time_granularity: day
      - name: created_at
        type: time
        type_params:
          time_granularity: hour

    measures:
      - name: active_subscriptions
        agg: count

metrics:
  - name: active_subscriptions
    type: simple
    type_params:
      measure: active_subscriptions
```

</div>

</div>

### Простые метрики {#simple-metrics}

В новой спецификации меры устарели и заменены простыми метриками.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Новая спецификация</h4>

```yml
models:
  - name: customers
    semantic_model:
      enabled: true
    agg_time_dimension: first_ordered_at
    columns:
      - name: customer_id
        entity:
          name: customer
          type: primary
      - name: first_ordered_at
        dimension:
          type: time
        granularity: day
    metrics:
      - name: lifetime_spend_pretax
        type: simple # простые метрики
        agg: sum
        expr: amount_pretax
```

</div>

<div>

<h4 style={{marginTop: 0}}>Устаревшая спецификация</h4>

```yml
semantic_models:
  - name: customers
    model: ref('customers')
    entities:
      - name: customer
        type: primary
        expr: customer_id
    dimensions:
      - name: first_ordered_at
        type: time
        type_params:
          time_granularity: day
    measures:
      - name: lifetime_spend_pretax
        agg: sum

metrics:
  - name: lifetime_spend_pretax
    type: simple
    type_params:
      measure: lifetime_spend_pretax
```

</div>

</div>


### Сложные метрики {#advanced-metrics}

Определяйте простые метрики внутри модели, а метрики, использующие несколько моделей, — в блоке `metrics` верхнего уровня. Ключ верхнего уровня обязателен для любой метрики, которая зависит от метрик или измерений, определённых в другой семантической модели.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Новая спецификация</h4>

```yml
# определяйте простые метрики там, где находятся данные
models:
  - name: orders
    ...
    semantic_model:
      enabled: true
    metrics:
      - name: orders
        type: simple
        agg: count
        expr: 1

  - name: website
    semantic_model:
      enabled: true
    metrics:
      - name: sessions
        type: simple
        agg: count
        expr: 1

# сложные метрики в ключе metrics верхнего уровня
metrics:
  - name: orders_per_session
    type: ratio
    numerator: orders
    denominator: sessions
```

</div>

<div>

<h4 style={{marginTop: 0}}>Устаревшая спецификация</h4>

```yml
semantic_models:
  - name: orders
    model: ref('orders')
    measures:
      - name: orders
        agg: count
  - name: website
    model: ref('website')
    measures:
      - name: sessions
        agg: count

metrics:
  - name: orders_per_session
    type: ratio
    type_params:
      numerator: { measure: orders }
      denominator: { measure: sessions }
```

</div>

</div>

### `type_params`

Ключ `type_params` устарел. Следующие ключи теперь задаются непосредственно в определении метрики:

- `expr`
- `percentile`
- `percentile_type`
- `non_additive_dimension: { name, window_agg, group_by }`
- `join_to_timespine`
- `fill_nulls_with`

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Новая спецификация</h4>

```yml
models:
  - name: payments
    semantic_model:
      enabled: true
    metrics:
      - name: revenue_p95
        type: simple
        agg: percentile
        expr: amount
        percentile: 95.0
        percentile_type: discrete
```

</div>

<div>

<h4 style={{marginTop: 0}}>Устаревшая спецификация</h4>

```yml
metrics:
  - name: revenue_p95
    type: simple
    type_params:
      expr: amount
      percentile: 95.0
      percentile_type: discrete
```

</div>

</div>

Для [производных метрик](/docs/build/derived) `type_params.metrics` переименован в `input_metrics`.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Новая спецификация</h4>

```yaml
metrics:
  - name: d7_booking_change
    description: Разница между текущим числом бронирований и числом бронирований 7 дней назад
    type: derived
    label: Изменение числа бронирований за 7 дней
    expr: current_bookings - bookings_7_days_ago
    input_metrics:
      - name: bookings
        alias: current_bookings
      - name: bookings
        offset_window: 7 days
        alias: bookings_7_days_ago
```

</div>

<div>

<h4 style={{marginTop: 0}}>Устаревшая спецификация</h4>

```yaml
- name: d7_booking_change
  description: Разница между текущим числом бронирований и числом бронирований 7 дней назад
  type: derived
  label: Изменение числа бронирований за 7 дней
  type_params:
    expr: bookings - bookings_7_days_ago
    metrics:
      - name: bookings
        alias: current_bookings
      - name: bookings
        offset_window: 7 days
        alias: bookings_7_days_ago
```

</div>

</div>

Для [метрик-отношений](/docs/build/ratio) `numerator` и `denominator` теперь задаются непосредственно в определении метрики.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Новая спецификация</h4>

```yaml
metrics:
  - name: conversion_rate
    type: ratio
    numerator: conversions
    denominator: sessions
```

</div>

<div>

<h4 style={{marginTop: 0}}>Устаревшая спецификация</h4>

```yaml
metrics:
  - name: conversion_rate
    type: ratio
    type_params:
      numerator: conversions
      denominator: sessions
```

</div>

</div>

Для [накопительных метрик](/docs/build/cumulative):
- `type_params.measure` переименован в `input_metric` и должен ссылаться на метрику.
- Параметры из `type_params.cumulative_type_params` теперь задаются непосредственно в определении метрики: `window`, `grain_to_date` и `period_agg`.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Новая спецификация</h4>

```yaml
metrics:
  - name: revenue_mtd_cumulative
    type: cumulative
    input_metric: revenue_daily
    window: 30d
    grain_to_date: month
    period_agg: sum
```

</div>

<div>

<h4 style={{marginTop: 0}}>Устаревшая спецификация</h4>

```yaml
metrics:
  - name: revenue_mtd_cumulative
    type: cumulative
    type_params:
      measure: revenue_daily  
      cumulative_type_params:
        window: 30d
        grain_to_date: month
        period_agg: sum
```

</div>

</div>

Для [метрик конверсии](/docs/build/conversion) следующие параметры из `type_params.conversion_type_params` теперь задаются непосредственно в определении метрики: 
- `entity`
- `calculation`
- `base_metric` (ранее `base_measure`)
- `conversion_metric` (ранее `conversion_measure`)
- `constant_properties`

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px'}}>

<div>

<h4 style={{marginTop: 0}}>Новая спецификация</h4>

```yaml
metrics:
  - name: paid_signup_conversion
    type: conversion
    entity: user_id
    calculation: conversion_rate
    base_metric: signups
    conversion_metric: paid_signups
    constant_properties:
      - base_property: plan
        conversion_property: plan
```

</div>

<div>

<h4 style={{marginTop: 0}}>Устаревшая спецификация</h4>

```yaml
metrics:
  - name: paid_signup_conversion
    type: conversion
    type_params:
      conversion_type_params:
        entity: user_id
        calculation: conversion_rate
        base_measure: signups            
        conversion_measure: paid_signups
        constant_properties:
          plan: pro
```

</div>

</div>

## Переход на последнюю версию спецификации

:::note Проверка YAML в Studio IDE
<Constant name="studio_ide" /> проверяет YAML-файлы dbt с помощью JSON Schema из проекта [dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema). Эти определения согласованы с <Constant name="fusion_engine" /> и применяются ко всем [каналам выпуска <Constant name="dbt_platform" />](/docs/dbt-versions/dbt-release-tracks), даже если ваша среда разработки всё ещё работает на <Constant name="core" />.

Если <Constant name="studio_ide" /> помечает ваш YAML как некорректный, но команды <Constant name="dbt" /> выполняются успешно, ориентируйтесь на результаты выполнения. Отправьте примеры в [службу поддержки dbt](mailto:support@getdbt.com) или команде по работе с вашей учётной записью, чтобы схему можно было обновить.
:::

Переведите устаревшие метрики на последнюю версию спецификации YAML с помощью инструмента dbt-autofix в CLI, [расширении dbt для VS Code](/docs/about-dbt-extension) или <Constant name="studio_ide" /> на платформе <Constant name="dbt_platform"/>.

import CopilotLimitation from '/snippets/_copilot-limitation.md';

<CopilotLimitation />

### Совместимость пакетов

Если ваш проект использует пакеты dbt (перечисленные в `packages.yml`), в которых определены метрики или семантические модели, сопровождающий этих пакетов должен обновить их для использования последней версии спецификации YAML.

[Инструмент dbt-autofix](https://github.com/dbt-labs/dbt-autofix) обновляет только файлы в текущем проекте dbt (например, модели, витрины данных и т. д.) и не обновляет установленные пакеты в `dbt_packages/`. Если установленный пакет всё ещё использует устаревшую спецификацию метрик, после миграции dbt может выдавать ошибки разбора или проверки.

Чтобы обновить пакеты, сопровождающему пакета следует:

1. Выполнить `dbt-autofix deprecations --semantic-layer` в репозитории пакета.

2. Проверить изменения, выполнив следующие команды:

  - Для пользователей <Constant name="fusion" /> и dbt в <Constant name="platform_cli" /> или локально с корректным файлом [`dbt_cloud.yml`](/reference/dbt_cloud.yml):

    ```bash
    dbt parse
    dbt sl validate
    ```

    При локальном использовании `dbt sl validate` команда проверяет локальный семантический манифест, а не манифест платформы. Это означает, что проверка учитывает ваши локальные изменения, ещё не включённые в коммит.

  - Для пользователей dbt v2 CLI, не подключённых к платформе dbt и использующих локальный MetricFlow:

    ```bash
    dbt parse
    mf validate-configs
    ```

3. Выпустить новую версию пакета с обновлёнными определениями метрик.

После выпуска совместимой версии обновите проект, [установив новую версию пакета](/docs/build/packages). Затем вы сможете перевести метрики на последнюю версию спецификации, выполнив следующие действия в зависимости от используемого инструмента.

<!--no toc-->
- [Использование CLI или расширения VS Code](#using-the-cli-or-vs-code-extension)
- [Использование Studio IDE](#using-the-studio-ide)

### Использование CLI или расширения VS Code {#using-the-cli-or-vs-code-extension}

[Инструмент dbt-autofix](https://github.com/dbt-labs/dbt-autofix) преобразует YAML-файлы метрик из устаревшего формата в новейший и создаёт понятный набор изменений для проверки в системе контроля версий. Прежде чем переходить на новую спецификацию с помощью CLI или расширения dbt для VS Code, убедитесь, что установлена последняя версия инструмента autofix.

1. В CLI или расширении VS Code выполните следующую команду:

    ```bash
    dbt-autofix deprecations --semantic-layer
    ```

2. Просмотрите изменения и устраните все отмеченные проблемы.

3. Выполните разбор и проверки:

    ```bash
    dbt parse
    mf validate-configs
    ```

### Использование Studio IDE {#using-the-studio-ide}

Преобразуйте метрики в <Constant name="studio_ide" /> на платформе <Constant name="dbt_platform" /> без необходимости устанавливать инструмент `dbt-autofix`.

1. Перейдите в <Constant name="studio_ide" />, нажав **Studio** в левом меню.
2. Прежде чем продолжить, обязательно сохраните свою работу и создайте коммит. Команда autofix может перезаписать все несохранённые изменения.
3. В <Constant name="studio_ide" /> выполните следующую команду:

    ```bash
    dbt-autofix deprecations --semantic-layer
    ```
4. Нажмите **Commit and sync** в левом верхнем углу <Constant name="studio_ide" />, чтобы зафиксировать эти изменения в репозитории проекта.
