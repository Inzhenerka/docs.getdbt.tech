---
title: "Об оркестрации по состоянию"
description: "Узнайте, как state-aware orchestration автоматически определяет, какие модели нужно собирать, обнаруживая изменения в коде или данных при каждом запуске job."
id: "state-aware-about"
tags: ['scheduler','SAO']
---

# Об оркестрации по состоянию <Lifecycle status="private_preview,managed,managed_plus" /> {#about-state-aware-orchestration}

<IntroText>

При каждом запуске job state-aware orchestration автоматически определяет, какие модели нужно собрать, обнаруживая изменения в коде или данных.

</IntroText>

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

State-aware orchestration помогает экономить вычислительные ресурсы и сокращать время выполнения, потому что при запуске job она проверяет наличие новых записей и собирает только те модели, которые действительно изменятся.

<Lightbox src="/img/docs/deploy/sao.gif" title="Fusion powered state-aware orchestration" />

State-aware orchestration в <Constant name="cloud" /> построена на четырёх ключевых принципах:

- **Общее состояние в реальном времени:** Все jobs записывают состояние на уровне моделей в общее хранилище в реальном времени. Это позволяет <Constant name="cloud" /> пересобирать только изменённые модели независимо от того, в каких jobs они собираются.
- **Очереди на уровне моделей:** Jobs выстраиваются в очередь на уровне моделей, что позволяет избежать «коллизий» и предотвратить повторную сборку моделей, которые только что были обновлены другой job.
- **Поддержка state-aware и state-agnostic подходов:** Jobs можно определять динамически (state-aware) или явно (state-agnostic). Оба подхода обновляют общее состояние, благодаря чему всё остаётся синхронизированным.
- **Разумные настройки по умолчанию:** State-aware orchestration работает «из коробки» (нативно) и имеет дополнительную настройку конфигурации для более продвинутого управления. Подробнее см. в разделе [state-aware advanced configurations](/docs/deploy/state-aware-setup#advanced-configurations).

:::note
State-aware orchestration не зависит от [static analysis](/docs/fusion/new-concepts#principles-of-static-analysis) и работает даже если `static_analysis` отключён.
:::

## Оптимизация сборок с помощью state-aware orchestration {#optimizing-builds-with-state-aware-orchestration}

State-aware orchestration использует общее отслеживание состояния, чтобы определять, какие модели нужно собирать, обнаруживая изменения в коде или данных при каждом запуске job. Также поддерживаются пользовательские интервалы обновления и пользовательские настройки freshness для sources, благодаря чему <Constant name="cloud" /> пересобирает модели только тогда, когда это действительно необходимо.

Например, вы можете настроить проект так, чтобы <Constant name="cloud" /> пропускал пересборку модели dim_wizards (и её родителей), если она уже обновлялась в течение последних 4 часов, даже если сама job запускается чаще.

Без какой‑либо дополнительной настройки state-aware orchestration в <Constant name="cloud" /> автоматически понимает, что модели нужно собирать либо при изменении кода, либо при появлении новых данных в source (или в upstream‑модели в случае [dbt Mesh](/docs/mesh/about-mesh)).

## Эффективное тестирование в state-aware orchestration <Lifecycle status="private_beta" /> {#efficient-testing-in-state-aware-orchestration}

:::info Функция в private beta
Возможности state-aware orchestration в <Constant name="dbt_platform" /> доступны только в Fusion, который находится в private preview. Свяжитесь с вашим account manager, чтобы включить Fusion в вашей учётной записи. 
:::

Качество данных может ухудшаться по двум причинам:

- Новые изменения в коде меняют определения или добавляют граничные случаи.
- Новые данные, например дубликаты или неожиданные значения, делают downstream‑метрики некорректными.

Запуск стандартных [data tests](/docs/build/data-tests) dbt (`unique`, `not_null`, `accepted_values`, `relationships`) при каждой сборке помогает выявлять ошибки в данных до того, как они повлияют на бизнес‑решения. Однако для этого часто требуется несколько тестов на каждую модель и выполнение тестов даже тогда, когда в них нет необходимости. Если ничего значимого не изменилось, повторные запуски тестов не повышают покрытие и лишь увеличивают стоимость.

С Fusion dbt получает понимание SQL‑кода на основе логического плана скомпилированного кода. Это позволяет dbt определять, когда тест необходимо запустить повторно, а когда можно переиспользовать результат предыдущего upstream‑теста.

Эффективное тестирование в state-aware orchestration снижает затраты на хранилище данных за счёт исключения избыточных data tests и объединения нескольких тестов в один запуск. Эта функциональность включает две оптимизации:

- **Переиспользование тестов (Test reuse)** — тесты переиспользуются в случаях, когда ни логика кода, ни новые данные не могли повлиять на результат теста.
- **Агрегация тестов (Test aggregation)** — при наличии нескольких тестов на одной модели dbt объединяет их и выполняет одним запросом к хранилищу данных, вместо отдельных запросов для каждого теста.

### Поддерживаемые data tests {#supported-data-tests}

Следующие тесты могут быть переиспользованы при включённом Efficient testing:
- [`unique`](/reference/resource-properties/data-tests#unique)
- [`not_null`](/reference/resource-properties/data-tests#not_null)
- [`accepted_values`](/reference/resource-properties/data-tests#accepted_values)

### Включение Efficient testing {#enabling-efficient-testing}

Перед включением Efficient testing убедитесь, что у вас настроен [`static_analysis`](/docs/fusion/new-concepts#configuring-static_analysis).

Чтобы включить Efficient testing:

1. В главном меню перейдите в **Orchestration** > **Jobs**. 
2. Выберите нужную job. Перейдите в её настройки и нажмите **Edit**. 
3. В разделе **Enable Fusion cost optimization features** раскройте **More options**.
4. Выберите **Efficient testing**. По умолчанию эта функция отключена.
5. Нажмите **Save**.

### Пример {#example}

В следующем запросе выполняется join таблиц `orders` и `customers`:

```sql
with

orders as (

    select * from {{ ref('orders') }}

),

customers as (

    select * from {{ ref('customers') }}

),

joined as (

    select
        customers.customer_id as customer_id,
        orders.order_id as order_id
    from customers
    left join orders
        on orders.customer_id = customers.customer_id

)

select * from joined
```

- Тест `not_null`: `left join` может привести к появлению null‑значений для клиентов без заказов. Даже если upstream‑тесты проверили `not_null(order_id)` в orders, join может создать null‑значения downstream. Поэтому dbt всегда должен запускать тест `not_null` для `order_id` в этом результате.

- Тест `unique`: если `orders.order_id` и `customers.customer_id` уникальны upstream, уникальность `order_id` сохраняется, и можно переиспользовать результат upstream‑теста.

### Ограничение {#limitation}

Ниже приведены важные моменты, которые следует учитывать при использовании Efficient testing в state-aware orchestration:

- **Агрегированные тесты не поддерживают пользовательские конфигурации**. Тесты, в которых используются следующие [custom config options](/reference/data-test-configs), будут выполняться отдельно, а не в составе агрегированного пакета:

  ```yaml
  config:
    fail_calc: <string>
    limit: <integer>
    severity: error | warn
    error_if: <string>
    warn_if: <string>
    store_failures: true | false
    where: <string>
  ```

## Связанные материалы {#related-docs}

- [Конфигурация state-aware orchestration](/docs/deploy/state-aware-setup)
- [Артефакты](/docs/deploy/artifacts)
- [Jobs непрерывной интеграции (CI)](/docs/deploy/ci-jobs)
- [`freshness`](/reference/resource-configs/freshness)
