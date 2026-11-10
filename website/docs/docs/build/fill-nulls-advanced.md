---
title: "Заполнение null-значений для метрик"
id: fill-nulls-advanced
description: "Узнайте о продвинутых темах, связанных с dbt Semantic Layer и MetricFlow, таких как рабочие процессы моделирования и многое другое."
sidebar_label: Заполнение значений null для метрик
availability: all_users
---

Понимание и реализация стратегий заполнения null-значений в метриках является ключевым для точной аналитики. В этом руководстве объясняются `fill_nulls_with` и `join_to_timespine`, чтобы обеспечить полноту данных, помогая конечным пользователям принимать более обоснованные решения и улучшая ваши рабочие процессы dbt.

### О null-значениях {#about-null-values}

Вы можете использовать `fill_nulls_with`, чтобы заменить null-значения в метриках на значение, например, ноль (или выбранное вами целое число). Это гарантирует, что каждая строка данных показывает числовое значение.

Это руководство объясняет, как гарантировать отсутствие null-значений в ваших метриках:

- Используйте `fill_nulls_with` для `simple`, `cumulative` и `conversion` метрик
- Используйте `join_to_timespine` и `fill_nulls_with` вместе для производных и долевых метрик, чтобы избежать появления null-значений.

### Заполнение null-значений для простых метрик {#fill-null-values-for-simple-metrics}

Например, если вы хотите обработать дни с посещениями сайта, но без лидов, вы можете использовать `fill_nulls_with`, чтобы установить значение для лидов равным нулю в дни, когда нет конверсий.

Предположим, у вас есть три метрики:

- `website_visits` и `leads`
- и производная метрика под названием `leads_to_website_visit`, которая вычисляет отношение лидов к посещениям сайта.

<VersionBlock lastVersion="1.11">

В дни, когда нет конверсий, можно задать нулевое значение для лидов, добавив параметр `fill_nulls_with` во входное определение меры в метрике лидов:

<File name='models/metrics/website_vists.yml'>

```yaml
metrics:
  - name: website_visits
    type: simple
    type_params:
      measure:
        name: bookings
  - name: leads
    type: simple
    type_params:
      measure:
        name: bookings
        fill_nulls_with: 0 # Это заполняет null-значения нулем
  - name: leads_to_website_visit
    type: derived
    type_params:
      expr: leads/website_visits
      metrics:
        - name: leads
        - name: website_visits
```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.12">

Для дней без конверсий можно задать нулевое значение метрики лидов с помощью параметра `fill_nulls_with`:

<File name='models/website_visits.yml'>

```yaml
# Define simple metrics within a semantic model
models:
  - name: website_visits_model
    semantic_model:
      enabled: true
    # ... other configs ...
    metrics:
      - name: website_visits
        type: simple
        agg: count
      - name: leads
        type: simple
        agg: count
        fill_nulls_with: 0 # This fills null values with zero
      - name: leads_to_website_visit
        type: derived
        expr: leads/website_visits
        input_metrics:
          - name: leads
          - name: website_visits
```

</File>
</VersionBlock>

Метрики `website_visits` и `leads` имеют следующие данные:

| metric_time | website_visits |
| --- | --- |
| 2024-01-01 | 50 |
| 2024-01-02 | 37 |
| 2024-01-03 | 79 |


| metric_time | leads |
| --- | --- |
| 2024-01-01 | 5 |
| 2024-01-03 | 8 |
* Обратите внимание, что в метрике `leads` нет данных за `2024-01-02`.

Хотя нет дней без посещений, есть дни без лидов. После применения `fill_nulls_with: 0` к метрике `leads`, запрос этих метрик вместе показывает ноль для лидов в дни без конверсий:

| metric_time | website_visits | leads |
| --- | --- | --- |
| 2024-01-01 | 50 | 5 |
| 2024-01-02 | 37 | 0 |
| 2024-01-03 | 79 | 8 |

### Использование join_to_timespine для производных и долевых метрик {#use-jointotimespine-for-derived-and-ratio-metrics}

<VersionBlock lastVersion="1.11">

Чтобы обеспечить полноту данных и ежедневное покрытие для метрик, вычисляемых на основе других метрик, можно использовать `join_to_timespine` для заполнения значений null в метриках типов `derived` и `ratio`. Эти метрики строятся на основе других метрик (других вычислений), а не непосредственно на основе мер (исходных данных), поэтому для формирования метрики в MetricFlow требуется дополнительный уровень подзапроса. Вложенность подзапросов выглядит следующим образом:

- Для `derived` и `ratio` метрик существует три уровня вложенности подзапросов &mdash; производная или долевая метрика → входные метрики → входные меры.
- Для `simple` и `cumulative` метрик существует только два уровня вложенности подзапросов &mdash; простая или кумулятивная метрика → входная мера.

Поскольку `coalesce` не применяется к третьему, внешнему уровню подзапроса для `derived` или `ratio` метрик, это означает, что в конечном наборе результатов все еще могут быть null-значения.

* Обратите внимание, что вы можете использовать `join_to_timespine` с метриками, которые принимают входные меры, если вы хотите включить строку для каждой даты, даже если данных нет.

</VersionBlock>

<VersionBlock firstVersion="1.12">

Чтобы обеспечить полный набор данных и ежедневное покрытие для метрик, вычисляемых на основе других метрик, можно использовать `join_to_timespine` для заполнения значений null в метриках `derived` и `ratio`. Эти метрики строятся на основе других метрик (других вычислений), а не прямых агрегаций, поэтому MetricFlow требуется дополнительный уровень подзапроса для формирования метрики. Вложенность подзапросов выглядит следующим образом:

- Для метрик `derived` и `ratio` используются три уровня вложенности подзапросов &mdash; метрика derived или ratio → входные метрики → метрики simple с агрегациями.
- Для метрик `simple` и `cumulative` используются только два уровня вложенности подзапросов &mdash; метрика simple или cumulative → агрегация.

Поскольку `coalesce` не применяется к третьему уровню подзапросов для метрик `derived` или `ratio`, в итоговом наборе результатов всё ещё могут оставаться значения null. 

Обратите внимание: `join_to_timespine` также можно использовать с метриками simple, если нужно включить строку для каждой даты, даже если данных нет.

</VersionBlock>

### Заполнение значений null для метрик derived и ratio

Чтобы заполнить значения null для метрик derived и ratio, можно связать их с временной шкалой (time spine), обеспечив ежедневное покрытие данными. Как упоминалось в [предыдущем разделе](#use-jointotimespine-for-derived-and-ratio-metrics), это связано с тем, что метрики `derived` и `ratio` принимают на вход *метрики*<VersionBlock lastVersion="1.11">, а не *меры*</VersionBlock>.

Например, следующая структура оставляет null-значения в конечных результатах (столбец `leads_to_website_visit`), потому что `COALESCE` не применяется на третьем внешнем уровне рендеринга для окончательного расчета метрики в `derived` метриках:

| metric_time | website_visits | leads | leads_to_website_visit |
| --- | --- | --- | --- |
| 2024-01-01 | 50 | 5 | .1 |
| 2024-01-02 | 37 | 0 | null |
| 2024-01-03 | 79 | 8 | .1 |

Чтобы отобразить нулевое значение `leads_to_website_visit` за `2024-01-02`, нужно соединить метрику `leads` с моделью временной шкалы (time spine), чтобы обеспечить наличие значения для каждого дня. Для этого добавьте `join_to_timespine` в <VersionBlock lastVersion="1.11">параметр `measure`</VersionBlock><VersionBlock firstVersion="1.12">простую метрику</VersionBlock> в конфигурации метрики `leads`:

<VersionBlock lastVersion="1.11">
<File name='models/metrics/leads.yml'>

```yaml
- name: leads
  type: simple
  type_params:
    measure:
      name: bookings
      fill_nulls_with: 0
      join_to_timespine: true
```
</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name='models/leads.yml'>

```yaml
models:
  - name: leads_model
    semantic_model:
      enabled: true
    # ... other configs ...
    metrics:
      - name: leads
        type: simple
        agg: count
        fill_nulls_with: 0
        join_to_timespine: true
```
</File>

</VersionBlock>

После этого при запросе метрики `leads` после соединения с временной шкалой (timespine) будет возвращаться запись для каждого дня, а все значения null будут заменены нулями.

| metric_time |  leads | leads_to_website_visit |
| --- | --- | --- |
| 2024-01-01 |  5 | .1 |
| 2024-01-02 | 0 | 0 |
| 2024-01-03 |  8 | .1 |

Теперь, если вы объедините метрики в `derived` метрике, будет нулевое значение для `leads_to_website_visit` на `2024-01-02`, и в конечном наборе результатов не будет никаких null-значений.

## Часто задаваемые вопросы {#faqs}

<Expandable alt_header="Как обрабатывать null-значения в производных метриках, определенных на основе нескольких таблиц">

Для дополнительных примеров и обсуждения того, как обрабатывать null-значения в производных метриках, использующих данные из нескольких таблиц, ознакомьтесь с [вопросом MetricFlow #1031](https://github.com/dbt-labs/metricflow/issues/1031).

</Expandable>