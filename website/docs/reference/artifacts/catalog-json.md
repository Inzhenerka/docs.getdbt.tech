---
title: "Файл Catalog JSON"
sidebar_label: "Каталог"
---

**Текущая схема**: [`v1`](https://schemas.getdbt.com/dbt/catalog/v1.json)
    
**Создается с помощью:** [`docs generate`](/reference/commands/cmd-docs)

Этот файл содержит информацию из вашего <Term id="data-warehouse" /> о таблицах и <Term id="view">представлениях</Term>, которые создаются и определяются ресурсами в вашем проекте. В настоящее время dbt использует этот файл для заполнения метаданных — таких как типы столбцов и статистика <Term id="table" /> — на [сайте документации](/docs/explore/build-and-view-your-docs).

### Ключи верхнего уровня {#top-level-keys}

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `nodes`: Словарь, содержащий информацию о объектах базы данных, соответствующих моделям dbt, семенам и снимкам.
- `sources`: Словарь, содержащий информацию о объектах базы данных, соответствующих источникам dbt.
- `errors`: Ошибки, полученные при выполнении запросов метаданных во время `dbt docs generate`.

### Детали ресурсов {#resource-details}

Внутри `sources` и `nodes` каждый ключ словаря является `unique_id` ресурса. Каждый вложенный ресурс содержит:
- `unique_id`: `<resource_type>.<package>.<resource_name>`, то же самое, что и ключ словаря, соответствует `nodes` и `sources` в [манифесте](/reference/artifacts/manifest-json)
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
- `stats`: различается в зависимости от базы данных и типа отношения