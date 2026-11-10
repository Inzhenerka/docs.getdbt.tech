---
title: "Кумулятивные метрики"
id: "require_nested_cumulative_type_params"
sidebar_label: "Требовать вложенные параметры кумулятивных метрик"
---



| require_nested_cumulative_type_params | <Constant name="dbt" /> **v1 Latest** | <Constant name="core" /> |
|---|---|---|
| Введён | 2024.11 | 1.9.0 |
| Стабилизирован (по умолчанию → `true`) | 2026.09 | 1.12.0 |
| Удалён | — | — |

<br />

Параметры [кумулятивных метрик](/docs/build/cumulative#parameters) вложены в поле `cumulative_type_params` в [канале выпуска <Constant name="dbt" /> **v1 Latest**](/docs/dbt-versions/dbt-release-tracks), а также в <Constant name="dbt" /> v1.9 и новее. Начиная с <Constant name="dbt" /> v1.12, этот флаг по умолчанию имеет значение `true`, из-за чего dbt выдаёт ошибку вместо предупреждения, если кумулятивные метрики используют синтаксис без вложенности.

Рассмотрим следующую метрику, настроенную с использованием синтаксиса, применявшегося до v1.9:

```yaml
    type: cumulative
    type_params:
      measure: order_count
      window: 7 days
```

Если выполнить `dbt parse` с таким синтаксисом в <Constant name="dbt" /> v1.9 или в [канале выпуска <Constant name="dbt" /> **v1 Latest**](/docs/dbt-versions/dbt-release-tracks), появится предупреждение следующего вида:

```bash
15:36:22  [WARNING]: Cumulative fields `type_params.window` and
`type_params.grain_to_date` has been moved and will soon be deprecated. Please
nest those values under `type_params.cumulative_type_params.window` and
`type_params.cumulative_type_params.grain_to_date`. See documentation on
behavior changes:
https://docs.getdbt.com/reference/global-configs/behavior-changes
```

Поскольку `require_nested_cumulative_type_params` по умолчанию имеет значение `true`, выполнение `dbt parse` приводит к ошибке следующего вида:

```bash
21:39:18  Cumulative fields `type_params.window` and `type_params.grain_to_date` should be nested under `type_params.cumulative_type_params.window` and `type_params.cumulative_type_params.grain_to_date`. Invalid metrics: orders_last_7_days. See documentation on behavior changes: https://docs.getdbt.com/reference/global-configs/behavior-changes.
```

После обновления метрика будет работать как ожидается:

```yaml
    type: cumulative
    type_params:
      measure:
        name: order_count
      cumulative_type_params:
        window: 7 days
```

## Влияние

Если в проекте есть хотя бы одна кумулятивная метрика, всё ещё использующая синтаксис без вложенности, разбор всего проекта прерывается уже при выполнении первой команды. Поскольку разбор завершается с ошибкой, это затрагивает все команды dbt: `run`, `build`, `test`, `compile`, `docs generate`, а также <Constant name="semantic_layer" /> и другие возможности.

<Expandable alt_header="Рекомендуемые действия">

Если `dbt parse` завершается с ошибкой `Semantic Manifest validation failed`, в которой упоминаются одна или несколько кумулятивных метрик, обновите эти метрики, переместив `window` и `grain_to_date` из `type_params` в `type_params.cumulative_type_params`. В качестве альтернативы можно перейти на [последнюю спецификацию YAML](/docs/build/latest-metrics-spec#type_params), в которой `type_params` полностью удалён.

```yaml
# Legacy
metrics:
  - name: weekly_active_users
    type: cumulative
    type_params:
      measure: distinct_users
      window: 7 days

# Nested
metrics:
  - name: weekly_active_users
    type: cumulative
    type_params:
      measure: distinct_users
      cumulative_type_params:
        window: 7 days

# Latest spec
metrics:
  - name: weekly_active_users
    type: cumulative
    input_metric: distinct_users
    window: 7 days
```

Повторно выполните `dbt parse`, чтобы убедиться, что манифест проходит проверку.

Чтобы отключить это поведение, установите для флага значение `false`:

<File name='dbt_project.yml'>

```yaml
flags:
  require_nested_cumulative_type_params: false
```

</File>

</Expandable>
