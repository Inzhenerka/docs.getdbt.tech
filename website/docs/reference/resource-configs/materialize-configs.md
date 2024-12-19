---
title: "Конфигурации материализации"
description: "Конфигурации материализации - прочитайте это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "materialize-configs"
---

## Оптимизация производительности

### Кластеры

Включите конфигурацию [кластеров](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize/CHANGELOG.md#120---2022-08-31).

По умолчанию [кластер](https://materialize.com/docs/overview/key-concepts/#clusters), который используется для поддержания материализованных представлений или индексов, можно настроить в вашем [профиле](/docs/core/connect-data-platform/profiles.yml) с помощью параметра подключения `cluster`. Чтобы переопределить кластер, используемый для конкретных моделей (или групп моделей), используйте параметр конфигурации `cluster`.

<File name='my_view_cluster.sql'>

```sql
{{ config(materialized='materializedview', cluster='not_default') }}

select ...
```

</File>

<File name='dbt_project.yml'>

```yaml
models:
  project_name:
    +materialized: materializedview
    +cluster: not_default
```

</File>

### Инкрементальные модели: Материализованные представления

Materialize, по своей сути, является базой данных в реальном времени, которая предоставляет инкрементальные обновления представлений без компромиссов по задержке или корректности. Используйте [материализованные представления](https://materialize.com/docs/overview/key-concepts/#materialized-views) для вычисления и инкрементального обновления результатов вашего запроса.

### Индексы

Включите дополнительную конфигурацию для [индексов](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize/CHANGELOG.md#120---2022-08-31).

Как и в любой стандартной реляционной базе данных, вы можете использовать [индексы](https://materialize.com/docs/overview/key-concepts/#indexes) для оптимизации производительности запросов в Materialize. Улучшения могут быть значительными, сокращая время отклика до единичных миллисекунд.

Материализованные представления (`materializedview`), представления (`view`) и источники (`source`) могут иметь определенный список `indexes`. Каждый [индекс Materialize](https://materialize.com/docs/sql/create-index/) может иметь следующие компоненты:

- `columns` (список, обязательный): один или несколько столбцов, на которых определяется индекс. Чтобы создать индекс, использующий _все_ столбцы, используйте компонент `default`.
- `name` (строка, необязательный): имя для индекса. Если не указано, Materialize будет использовать имя материализации и предоставленные имена столбцов.
- `cluster` (строка, необязательный): кластер, который будет использоваться для создания индекса. Если не указано, индексы будут созданы в кластере, используемом для создания материализации.
- `default` (логическое, необязательный): По умолчанию: `False`. Если установлено в `True`, создается индекс по умолчанию, который использует все столбцы.

<File name='my_view_index.sql'>

```sql
{{ config(materialized='view',
          indexes=[{'columns': ['col_a'], 'cluster': 'cluster_a'}]) }}
          indexes=[{'columns': ['symbol']}]) }}

select ...
```

</File>

<File name='my_view_default_index.sql'>

```sql
{{ config(materialized='view',
    indexes=[{'default': True}]) }}

select ...
```

</File>

### Тесты

Если вы установите необязательный флаг `--store-failures` или конфигурацию [`store_failures`](/reference/resource-configs/store_failures), dbt создаст материализованное представление для каждого настроенного теста, которое может отслеживать сбои с течением времени. По умолчанию тестовые представления создаются в схеме с суффиксом `dbt_test__audit`. Чтобы указать пользовательский суффикс, используйте конфигурацию `schema`.
<File name='dbt_project.yml'>

```yaml
tests:
  project_name:
    +store_failures: true
    +schema: test
```

</File>