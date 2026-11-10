---
title: "Уникальные имена ресурсов проекта"
id: "require_unique_project_resource_names"
sidebar_label: "требование уникальности имён ресурсов проекта"
---

| require_unique_project_resource_names | <Constant name="dbt" /> **v1 Latest** | <Constant name="core" /> |
|---|---|---|
| Введён | 2025.12 | 1.11.0 |
| Стабилизирован (по умолчанию → `true`) | — | — |
| Удалён | — | — |

Флаг `require_unique_project_resource_names` обеспечивает уникальность имён ресурсов в пределах одного пакета. Ресурсы dbt, такие как модели, seed-файлы, снимки, анализы, тесты и функции, используют общее пространство имён. Если два ресурса в одном пакете имеют одинаковое имя, dbt должен определить, на какой из них ссылается вызов `ref()` или `source()`. Ранее эта проверка выполнялась не всегда, поэтому дублирующиеся имена могли приводить к тому, что dbt ссылался не на тот ресурс.

По умолчанию флаг `require_unique_project_resource_names` имеет значение `false`. При этом, если два неверсионируемых ресурса в одном пакете имеют одинаковое имя, dbt продолжает работу и выдаёт предупреждение [`DuplicateNameDistinctNodeTypesDeprecation`](/reference/deprecations#duplicatenamedistinctnodetypesdeprecation). Если установлено значение `true`, dbt выдаёт ошибку `DuplicateResourceNameError`.

Например, если в вашем проекте есть модель и seed-файл с именем `sales`:

```
models/sales.sql
seeds/sales.csv
```

А одна из моделей содержит:

```sql
select * from {{ ref('sales') }}
```

Если флаг имеет значение `true`, dbt выдаст ошибку:

```
DuplicateResourceNameError: Found resources with the same name 'sales' in package 'project': 'model.project.sales' and 'seed.project.sales'. Please update one of the resources to have a unique name.
```

При возникновении этой ошибки переименуйте один из ресурсов или измените структуру проекта, чтобы избежать конфликтов имён.
