---
title: "Порядок поиска ref в пакетах"
id: "require_ref_searches_node_package_before_root"
sidebar_label: "Поиск ref сначала в пакете узла, затем в корневом проекте"
---

| require_ref_searches_node_package_before_root | <Constant name="dbt" /> **v1 Latest** | <Constant name="core" /> |
|---|---|---|
| Введён | 2025.12 | 1.11.0 |
| Стабилизирован (значение по умолчанию → `true`) | — | — |
| Удалён | — | — |

Флаг `require_ref_searches_node_package_before_root` управляет порядком поиска при разрешении dbt вызовов `ref()`, определённых внутри пакета.

По умолчанию флаг имеет значение `false` в **v1 Latest** и <Constant name="dbt" /> v1.11. При разрешении `ref()` в модели пакета dbt _сначала_ ищет модель, на которую указывает ссылка, в корневом проекте, а затем — в пакете, где определена модель.

Например, следующая модель из пакета `my_package` импортируется проектом `my_project`:

<File name='my_package/model_downstream.sql'>

```sql
select * from {{ ref('model_upstream') }}
```
</File>

По умолчанию dbt ищет `model_upstream` в следующем порядке:
1. Сначала в `my_project` (корневом проекте)
2. Затем в `my_package` (где определена модель)

Если установить флаг `require_ref_searches_node_package_before_root` в `true`, dbt будет искать в пакете, где определена модель, _прежде чем_ искать в корневом проекте.

В том же примере dbt ищет `model_upstream` в следующем порядке:
1. Сначала в `my_package` (где определена модель)
2. Затем в `my_project` (корневом проекте)

Текущее поведение по умолчанию считается [ошибкой в dbt](https://github.com/dbt-labs/dbt/issues/11351), поскольку оно может приводить к неожиданным циклическим зависимостям. Однако это поведение существует уже давно, поэтому для изменения порядка поиска требуется установить `require_ref_searches_node_package_before_root` в `true`, чтобы не нарушить работу существующих проектов.
