---
title: Настройки dbt State
description: "Справочник по всем настройкам dbt State — настройкам состояния на уровне узлов и параметрам на уровне профиля."
id: "dbt-state-configs"
tags: ['dbt State']
---

Когда вы выполняете команду dbt с включённым [dbt State](/docs/deploy/dbt-state-about), dbt сравнивает логику и данные узла с предыдущими сборками и выбирает наиболее эффективный вариант:

- **Повторное использование** — если объект существует в целевой схеме, его логика не изменилась и время для повторной сборки в соответствии с `lag_tolerance` ещё не наступило (последняя сборка всё ещё находится в пределах допустимого интервала или данные вышестоящих узлов не изменились), узел используется повторно.
- **Клонирование** — если повторное использование невозможно, но объект существует в окружении, используемом для отложенного разрешения ссылок (deferral), с той же логикой и достаточно свежими данными, dbt State клонирует его.
- **Обычная сборка** — если ни повторное использование, ни клонирование невозможны, узел собирается как обычно, с использованием deferral для всех невыбранных вышестоящих узлов.

Используйте следующие настройки, чтобы управлять тем, как dbt State принимает эти решения.

<Tabs>
<TabItem value="project" label="YAML-файл проекта">

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: <duration>
    compare_unrendered_code: true | false
    require_fresh_data_from: any | all
    evaluate_volatile_sql: true | false
    pre_clone: never | if_missing | always
    execute_hooks_on_any_reuse: true | false
```

</File>
</TabItem>

<TabItem value="property" label="YAML-файл свойств">

<File name="models/schema.yml">

```yaml
models:
  - name: <model_name>
    config:
      state:
        lag_tolerance: <duration>
        compare_unrendered_code: true | false
        require_fresh_data_from: any | all
        evaluate_volatile_sql: true | false
        pre_clone: never | if_missing | always
        execute_hooks_on_any_reuse: true | false
```

</File>
</TabItem>

<TabItem value="sql" label="Настройка в SQL-файле">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
        "lag_tolerance": "<duration>",
        "compare_unrendered_code": true | false,
        "require_fresh_data_from": "any" | "all",
        "evaluate_volatile_sql": true | false,
        "pre_clone": "never" | "if_missing" | "always",
        "execute_hooks_on_any_reuse": true | false
    }
) }}
```

</File>
</TabItem>
</Tabs>

Параметры уровня профиля задаются в `profiles.yml` и применяются к определённому целевому окружению:

<File name="profiles.yml">

```yaml
my_project:
  outputs:
    dev:
      type: snowflake
      # ... настройки подключения к dev
      defer_to_target: prod  # только для самостоятельно управляемых окружений
    prod:
      type: snowflake
      # ... настройки подключения к prod
      allow_clones: true | false
      metadata_warehouse: <warehouse_name>  # только для Snowflake
  target: dev
```
</File>

| Настройка | По умолчанию | Область действия | Описание |
|--------|---------|-------|-------------|
| [`lag_tolerance`](/reference/resource-configs/lag-tolerance) | `45m` | Уровень узла, папки или проекта через конфигурацию модели | Задаёт время ожидания dbt State перед повторной сборкой узла после изменения данных вышестоящих узлов. Узел пересобирается только тогда, когда с момента его последней сборки прошло больше указанного времени и данные вышестоящих узлов изменились. Этот интервал служит буфером для экономии вычислительных ресурсов и помогает согласовать сборки с SLA по свежести данных. Применяется только к свежести данных; изменения SQL всегда вызывают повторную сборку независимо от этой настройки. |
| [`compare_unrendered_code`](/reference/resource-configs/compare-unrendered-code) | `false` | Уровень узла, папки или проекта через конфигурацию модели | Определяет, проверяет ли dbt State при обнаружении изменений кода как шаблон Jinja (код до рендеринга), так и SQL после рендеринга. Полезно для моделей с недетерминированными макросами или переменными окружения, из-за которых при каждом запуске получается разный SQL после рендеринга. |
| [`require_fresh_data_from`](/reference/resource-configs/require-fresh-data-from) | `any` | Уровень узла, папки или проекта через конфигурацию модели | Определяет, должны ли свежие данные появиться у любого (`any`) или у всех (`all`) непосредственных родительских узлов, прежде чем узел сможет быть пересобран. |
| [`pre_clone`](/reference/resource-configs/pre-clone) | `if_missing` | Уровень узла, папки или проекта через конфигурацию модели | Определяет, заполняет ли dbt State инкрементальные модели и снимки перед запуском, клонируя объекты из производственного окружения. |
| [`execute_hooks_on_any_reuse`](/reference/resource-configs/execute-hooks-on-any-reuse) | `false` | Уровень узла, папки или проекта через конфигурацию модели | Определяет, выполняются ли хуки pre-hook и post-hook, когда узел используется повторно без пересборки. |
| [`evaluate_volatile_sql`](/reference/resource-configs/evaluate-volatile-sql) | `false` | Уровень узла, папки или проекта через конфигурацию модели | Определяет, сохраняет и сравнивает ли dbt State результаты выполнения волатильных SQL-функций при принятии решения о повторной сборке. |
| [`defer_to_target`](/reference/resource-configs/defer-to-target) | `prod` | Профиль | (Только для самостоятельно управляемых окружений) Указывает целевое окружение профиля, которое dbt State использует для deferral. |
| [`allow_clones`](/reference/resource-configs/allow-clones) | `true` | Профиль | Определяет, может ли dbt State клонировать таблицы в целевое окружение. Например, установите `false` для `prod`, чтобы запретить dbt State клонировать таблицы из dev в производственное окружение. |
| [`metadata_warehouse`](/reference/resource-configs/metadata-warehouse) | `warehouse` из профиля | Профиль | (Только для Snowflake) Отдельный вычислительный склад для запросов метаданных dbt State. Если он задан, dbt выполняет несколько отдельных запросов (по одному на схему) вместо одного объединённого запроса. |

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
