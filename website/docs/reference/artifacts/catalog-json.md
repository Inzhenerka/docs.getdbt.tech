---
title: "Файл JSON каталога"
sidebar_label: "Каталог"
---

**Текущая схема**: [`v1`](https://schemas.getdbt.com/dbt/catalog/v1.json)

**Сгенерировано с помощью:** [`docs generate`](/reference/commands/cmd-docs)

Этот файл содержит информацию из вашего <Term id="data-warehouse" /> о таблицах и <Term id="view">представлениях</Term>, созданных и определенных ресурсами в вашем проекте. В настоящее время dbt использует этот файл для заполнения метаданных, таких как типы столбцов и <Term id="table" /> статистика, на [сайте документации](/docs/collaborate/build-and-view-your-docs).

### Ключи верхнего уровня

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `nodes`: Словарь, содержащий информацию о объектах базы данных, соответствующих моделям dbt, семенам и снимкам.
- `sources`: Словарь, содержащий информацию о объектах базы данных, соответствующих источникам dbt.
- `errors`: Ошибки, полученные во время выполнения запросов метаданных при `dbt docs generate`.

### Подробности о ресурсах

Внутри `sources` и `nodes` каждый ключ словаря является `unique_id` ресурса. Каждый вложенный ресурс содержит:
- `unique_id`: `<resource_type>.<package>.<resource_name>`, такой же, как ключ словаря, соответствует `nodes` и `sources` в [манифесте](/reference/artifacts/manifest-json)
- `metadata`
    - `type`: таблица, представление и т.д.
    - `database`
    - `schema`
    - `name`
    - `comment`
    - `owner`
- `columns` (массив)
    - `name`
    - `type`: тип данных
    - `comment`
    - `index`: порядковый номер
- `stats`: различается в зависимости от типа базы данных и отношения