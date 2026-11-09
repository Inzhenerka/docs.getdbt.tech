---
title: "Файл Catalog JSON"
sidebar_label: "Каталог"
---

**Текущая схема**: [`v1`](https://schemas.getdbt.com/dbt/catalog/v1.json)
    
**Создаётся с помощью:** <VersionBlock lastVersion="1.99">[`docs generate`](/reference/commands/cmd-docs)</VersionBlock><VersionBlock firstVersion="2.0">флага [`--write-catalog`](/reference/commands/cmd-docs#--write-catalog-flag)</VersionBlock>

Этот файл содержит информацию из вашего <Term id="data-warehouse" /> о таблицах и <Term id="view">представлениях</Term>, создаваемых и определяемых ресурсами вашего проекта. <VersionBlock lastVersion="1.99">dbt использует этот файл для заполнения метаданных, таких как типы столбцов и статистика <Term id="table" />, на [сайте документации](/docs/explore/build-and-view-your-docs).</VersionBlock><VersionBlock firstVersion="2.0">[dbt Docs v2](/reference/commands/cmd-docs#dbt-docs-v2) считывает данные из [dbt Information Schema](/docs/build/dbt-information-schema), а не из этого файла. `catalog.json` остаётся доступным в качестве отдельного артефакта для [<Constant name="catalog" />](/docs/explore/explore-projects) и внешних инструментов.</VersionBlock>

### Ключи верхнего уровня {#top-level-keys}

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `nodes`: Словарь, содержащий информацию об объектах базы данных, соответствующих моделям, seed-файлам и снимкам dbt.
- `sources`: Словарь, содержащий информацию об объектах базы данных, соответствующих источникам dbt.
- `errors`: Ошибки, полученные при выполнении запросов к метаданным во время <VersionBlock lastVersion="1.99">выполнения `dbt docs generate`</VersionBlock><VersionBlock firstVersion="2.0">генерации каталога (с помощью флага `--write-catalog`)</VersionBlock>.

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