---
title: pre_clone
description: "Настройте, когда dbt State предварительно заполняет инкрементальные модели и снимки в среде разработки, клонируя их аналоги из рабочей среды."
id: "pre-clone"
tags: ['dbt State']
---

# pre_clone

<Tabs>
<TabItem value="project" label="YAML-файл проекта">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      pre_clone: never | if_missing | always

snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      pre_clone: never | if_missing | always
```

</File>
</TabItem>

<TabItem value="property" label="YAML-файл свойств">

<File name="models/<filename>.yml">

```yaml
models:
  - name: my_model
    config:
      state:
        pre_clone: never | if_missing | always
```

</File>
<File name="snapshots/<filename>.yml">

```yaml
snapshots:
  - name: my_snapshot
    relation: source('my_source', 'my_table')
    config:
      state:
        pre_clone: never | if_missing | always
```

</File>
</TabItem>

<TabItem value="sql" label="Конфигурация в SQL-файле">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "pre_clone": "never" | "if_missing" | "always"
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Определение

`pre_clone` определяет, будет ли dbt State предварительно заполнять инкрементальные модели и снимки в вашей среде разработки, клонируя их аналоги из рабочей среды перед запуском, и когда это будет происходить.

| Значение | Поведение |
|-------|----------|
| `never` | Никогда не выполнять предварительное клонирование. Инкрементальные модели и снимки используют в качестве исходного состояния то, что уже существует в среде разработки. Если соответствующего объекта ещё нет, он создаётся с нуля. |
| `if_missing` (по умолчанию) | Клонировать только в том случае, если целевая таблица ещё не существует в среде разработки. После первого клонирования последующие запуски инкрементально обновляют клонированные данные. |
| `always` | Клонировать перед каждым запуском независимо от того, существует ли уже таблица в среде разработки. Гарантирует, что при каждом запуске исходное состояние для инкрементального обновления в среде разработки соответствует рабочей среде. |

:::note
Неинкрементальные материализации никогда не клонируются предварительно. Эта настройка на них не влияет.
:::

## Примеры

### Всегда синхронизировать среду разработки с рабочей средой

Используйте `always`, если хотите, чтобы перед каждым запуском среда разработки отражала текущее состояние рабочей среды:

<File name="models/fct_orders.yml">

```yaml
models:
  - name: fct_orders
    config:
      state:
        pre_clone: always
```

</File>

### Изолировать состояние среды разработки от рабочей среды

Используйте `never`, если хотите, чтобы среда разработки была полностью независима от рабочей среды:

<File name="dbt_project.yml">

```yaml
models:
  +state:
    pre_clone: never
```

</File>

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
