---
title: require_fresh_data_from
description: "Настройте, сколько непосредственных родительских узлов должны иметь свежие данные, прежде чем dbt State пересоберёт узел."
id: "require-fresh-data-from"
tags: ['dbt State']
---

# require_fresh_data_from

<Tabs>
<TabItem value="project" label="YAML-файл проекта">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      require_fresh_data_from: any | all
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
        require_fresh_data_from: any | all
```

</File>
</TabItem>

<TabItem value="sql" label="Конфигурация в SQL-файле">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "require_fresh_data_from": "any" | "all"
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Определение

`require_fresh_data_from` определяет, сколько непосредственных родительских узлов должны иметь свежие данные, прежде чем dbt State сочтёт этот узел готовым к пересборке. Прежде чем фактически запустить пересборку, dbt State всё равно ищет объект для повторного использования.

| Значение | Поведение |
|-------|----------|
| `any` (по умолчанию) | Узел становится готовым к пересборке, когда у _любого_ непосредственного родительского узла появляются свежие данные. Пересборки выполняются чаще; затраты могут увеличиться. |
| `all` | Узел становится готовым к пересборке, только когда у _всех_ непосредственных родительских узлов появляются свежие данные. Пересборки выполняются реже; затраты снижаются. |

## Значение по умолчанию

`any`

## Примеры

### Требовать свежие данные у всех родительских узлов

Используйте `all` для модели, которая объединяет несколько источников и должна пересобираться только после обновления каждой вышестоящей зависимости:

<File name="models/fct_orders.yml">

```yaml
models:
  - name: fct_orders
    config:
      state:
        require_fresh_data_from: all
```

</File>

### Задать значение по умолчанию для всего проекта

<File name="dbt_project.yml">

```yaml
models:
  +state:
    require_fresh_data_from: all
```

</File>

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
