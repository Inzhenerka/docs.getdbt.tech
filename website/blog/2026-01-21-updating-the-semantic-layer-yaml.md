---
title: "Модернизация спецификации Semantic Layer"
description: "Узнайте о новой спецификации семантического слоя и о том, как она улучшает моделирование данных."
slug: modernizing-the-semantic-layer-spec
authors: [dave_connors  ]

tags: [ai, data ecosystem]
hide_table_of_contents: false

date: 2026-01-21
is_featured: true
---

## Новый движок — кто это у нас?

Вряд ли кто-то из читателей этого блога ещё не слышал о новом движке dbt Fusion — о нём говорят все в мире данных с января прошлого года, а кульминацией стала легендарная живая демонстрация Элиаса на Coalesce 2025, показавшая невероятные возможности, которые открывает встроенное понимание SQL в dbt. Если вы были на Coalesce или уже перевели свой проект на Fusion, то, скорее всего, слышали и об изменениях, которые мы внесли в средства описания проектов dbt (то есть непосредственно в код, который вы пишете в проекте). Выпуская новую мажорную версию, мы воспользовались возможностью упростить и стандартизировать язык конфигурации dbt, чтобы он был готов к масштабированию в новую эпоху аналитической инженерии.

В частности, мы хотели пересмотреть подход к определению метрик в dbt Semantic Layer. На протяжении многих лет мы слышали от участников сообщества, что определять метрики *попросту сложно*. Обсудив это с внутренними и внешними пользователями, а также с нашими новыми друзьями из SDF, мы разработали обновлённую спецификацию YAML: она проще, лучше вписывается в привычный и любимый нами подход к настройке dbt и рассчитана на будущее.

<!-- truncate -->

### Что меняется?

В структуре семантического моделирования в dbt есть три основных изменения:

- **Меры → Метрики:** Меры исключены из спецификации описания метрик. Теперь простые метрики могут включать агрегации и выражения и служат основным строительным блоком для более сложных метрик.
- **Меньше вложенности:** Мы по возможности избавились от глубокой вложенности словарей, чтобы упростить структуру и восприятие кода, а также переименовали ключи так, чтобы их названия точнее описывали их поведение.
- **Единый подход на основе YAML-записей моделей:** Семантические аннотации встроены в YAML-запись модели, поэтому для добавления семантических метаданных к моделям больше не нужно управлять множеством YAML-записей в разных файлах.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', margin: '0 -20px 20px -20px', maxWidth: 'calc(100% + 40px)'}}>

<div style={{padding: '0 12px'}}>

### Прежняя реализация

```yaml
models:
  - name: customers
    description: Customer overview data mart, offering key details for each unique customer. One row per customer.
    columns:
      - name: customer_id
        description: The unique key of the orders mart.
      - name: first_ordered_at
        description: The timestamp when a customer placed their first order.

semantic_models: 
  - name: customers: 
    model: ref('customers')
    description: Semantic Model for Customers
    defaults: 
      agg_time_dimension: first_ordered_at
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
     description: Customer's lifetime spend before tax
     label: LTV Pre-tax
     type_params:
        measure: 
          name: lifetime_spend_pretax
 
```

</div>

<div style={{padding: '0 12px'}}>

### Новая реализация

```yaml
models:
  - name: customers
    
    # enable semantic modeling on this model
    semantic_model:
      enabled: true 
    
    # set default aggregation time dimension as a model property
    agg_time_dimension: first_ordered_at
    
    description: Customer overview data mart, offering key details for each unique customer. One row per customer.
    
    columns:
      - name: customer_id
        description: The unique key of the orders mart.

        # annotate column as a primary entity
        entity:
          name: customer
          type: primary
          
      - name: first_ordered_at
        description: The timestamp when a customer placed their first order.

        # annotate column as a time dimension
        granularity: day
        dimension:
          type: time
          

    # define simple metric directly within the model's YAML
    metrics:

      - name: lifetime_spend_pretax
        type: simple
        description: Customer's lifetime spend before tax
        label: LTV Pre-tax
        agg: sum
```

</div>

</div>

У этого подхода есть несколько очевидных преимуществ:

- **Меньше повторений в коде:** Семантические аннотации теперь находятся рядом с YAML-записью модели, что сокращает дублирование работы. Теперь, если столбец модели является измерением или сущностью, вы можете настроить его соответствующим образом. Свойства столбца, например его описание, затем используются и для измерения или сущности!
- **Более аккуратный YAML:** Компактную запись метрики проще написать, прочитать и использовать для обмена контекстом внутри команды по работе с данными. Поддержка кода метрик должна быть как можно проще!

### Это спецификация OSI?

Возможно, вы слышали, что dbt присоединилась к отраслевой инициативе [Open Semantic Interchange](https://www.snowflake.com/en/blog/open-semantic-interchange-ai-standard/) и вместе с такими партнёрами, как Snowflake и Tableau, работает над открытым стандартом семантических метаданных. Но это не спецификация OSI! Это обновление существующей спецификации dbt Semantic Layer, призванное упростить пользователям dbt определение метрик и управление ими. При этом мы активно изучаем, как в будущем обеспечить совместимость со спецификацией OSI, и рассматриваем это обновление как шаг к этой цели.

### Начните уже сегодня

Новая спецификация **уже доступна в движке Fusion.** Если вы уже [перешли](/guides/upgrade-to-v2?step=1) на этот движок и хотите начать работу с dbt Semantic Layer, [загляните в нашу документацию](/docs/build/latest-metrics-spec) и приступайте к определению метрик! Новая спецификация также появится в dbt Core версии 1.12, которая выйдет в ближайшее время. Пользователи платформы dbt, работающие на движке dbt Core, смогут перейти на новую спецификацию сразу после обновления до версии dbt в канале Latest!

Кроме того, если вы уже используете семантический слой, наш [скрипт `dbt-autofix`](https://github.com/dbt-labs/dbt-autofix) теперь поддерживает миграцию с прежней реализации метрик на новую! Просто выполните `dbt-autofix deprecations --semantic-layer` локально или в dbt Studio на платформе, и подавляющая часть кода будет перенесена автоматически!

Мы очень ждём ваших отзывов! Напишите в [канал `#dbt-semantic-layer`](https://getdbt.slack.com/archives/C046L0VTVR6) в Slack сообщества dbt и расскажите, как проходит ваша миграция или начало работы!
