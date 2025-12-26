---
title: "Конфигурации материализации"
description: "Конфигурации материализации - прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
id: "materialize-configs"
---

## Оптимизация производительности

### Кластеры

Включите конфигурацию [кластеров](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize/CHANGELOG.md#120---2022-08-31).

Кластер по умолчанию, который используется для поддержки материализованных представлений или индексов, может быть настроен в вашем [профиле](/docs/core/connect-data-platform/profiles.yml) с использованием параметра подключения `cluster`. Чтобы переопределить кластер, используемый для конкретных моделей (или групп моделей), используйте параметр конфигурации `cluster`.

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

Materialize, в своей основе, является базой данных реального времени, которая обеспечивает инкрементальные обновления представлений без ущерба для задержки или корректности. Используйте [материализованные представления](https://materialize.com/docs/overview/key-concepts/#materialized-views) для вычисления и инкрементального обновления результатов вашего запроса.

### Индексы

Включите дополнительную конфигурацию для [индексов](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize/CHANGELOG.md#120---2022-08-31).

Как и в любой стандартной реляционной базе данных, вы можете использовать [индексы](https://materialize.com/docs/overview/key-concepts/#indexes) для оптимизации производительности запросов в Materialize. Улучшения могут быть значительными, сокращая время отклика до однозначных миллисекунд.

Материализованные представления (`materializedview`), представления (`view`) и источники (`source`) могут иметь список определенных `индексов`. Каждый [индекс Materialize](https://materialize.com/docs/sql/create-index/) может иметь следующие компоненты:

- `columns` (список, обязательный): один или несколько столбцов, по которым определяется индекс. Чтобы создать индекс, использующий _все_ столбцы, используйте компонент `default`.
- `name` (строка, необязательный): имя для индекса. Если не указано, Materialize использует имя материализации и предоставленные имена столбцов.
- `cluster` (строка, необязательный): кластер, который будет использоваться для создания индекса. Если не указано, индексы будут созданы в кластере, используемом для создания материализации.
- `default` (логический, необязательный): По умолчанию: `False`. Если установлено в `True`, создает индекс по умолчанию, использующий все столбцы.

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

### Тесты данных

<File name='dbt_project.yml'>

```yaml
data_tests:
  project_name:
    +store_failures: true
    +schema: test
```

</File>