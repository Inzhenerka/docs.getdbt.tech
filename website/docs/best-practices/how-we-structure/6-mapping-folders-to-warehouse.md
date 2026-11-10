---
title: "Сопоставление папок проекта со схемами хранилища"
id: "6-mapping-folders-to-warehouse"
description: "Сопоставление папок проекта dbt со схемами хранилища, включая различия между средами разработки и production."
sidebar_label: "Сопоставление папок со схемами хранилища"
displayText: Сопоставление папок проекта со схемами хранилища
hoverSnippet: Сопоставьте папки проекта dbt со схемами хранилища.
availability: all_users
---

Папки упорядочивают ваш код. Схемы (или наборы данных в BigQuery) упорядочивают таблицы и представления, которые этот код создает в хранилище. Вы можете сопоставить папки со схемами, чтобы модели подготовительного слоя, промежуточного слоя и витрин было легко найти. dbt добавляет целевую схему в качестве префикса к каждой схеме, чтобы работа в среде разработки не приводила к перезаписи данных в production.

## Сопоставление папок с пользовательскими схемами

По умолчанию dbt создает все модели в целевой схеме, которая определяется [средой](/docs/dbt-platform-environments) в <Constant name="dbt_platform" /> или [профилем](/docs/local/dbt-environments) при локальном запуске (например, для разработки, CI или production). Чтобы выделить моделям в папке собственную схему, задайте `+schema` для этой папки. В dbt это называется пользовательской схемой, и она не заменяет целевую схему. Вместо этого dbt объединяет их в `<target_schema>_<custom_schema>`, поэтому в средах разработки и production модели создаются в разных схемах. Подробнее см. в разделе [Пользовательские схемы](/docs/build/custom-schemas).

Мы рекомендуем называть пользовательские схемы по именам папок проекта, чтобы модели подготовительного слоя, промежуточного слоя и витрин было легко найти в хранилище. Например, задайте `+schema: staging`, `+schema: intermediate` и `+schema: marts`. Если ваша команда уже использует другие названия, используйте их.

Например, при использовании `analytics_prod` и `alice_dev` в качестве целевых схем dbt создает модели из каждой папки в следующих схемах:

| Папка | Настройка | Production (`analytics_prod`) | Разработка (`alice_dev`) |
| --- | --- | --- | --- |
| `models/staging/` | `+schema: staging` | `analytics_prod_staging` | `alice_dev_staging` |
| `models/intermediate/` | `+schema: intermediate` | `analytics_prod_intermediate` | `alice_dev_intermediate` |
| `models/marts/` | `+schema: marts` | `analytics_prod_marts` | `alice_dev_marts` |

<br />

Источники указывают на уже существующие таблицы, обычно в `raw`. dbt читает эти таблицы, а не создает их. Подробнее см. в разделах [Подготовительный слой](/best-practices/how-we-structure/2-staging) и [Источники](/docs/build/sources).

:::note
В примере [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) можно загрузить seed-данные в `raw`, если включен параметр `load_source_data`. Эти seed-файлы используют `+schema: raw`, и их данные загружаются в схему `raw`.
:::

## Настройка пользовательских схем в `dbt_project.yml`

Когда вы задаете `+schema` для папки в `dbt_project.yml`, каждая модель в этой папке наследует эту настройку. Задавайте схему для отдельной модели только в том случае, если эта модель должна использовать другую схему.

<File name="dbt_project.yml">

```yaml
models:
  jaffle_shop:
    staging:
      +materialized: view
      +schema: staging
    intermediate:
      +materialized: view
      +schema: intermediate
    marts:
      +materialized: table
      +schema: marts
```

</File>

Ключ `jaffle_shop` должен совпадать со значением `name` в вашем `dbt_project.yml`. В примере [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) есть только `staging` и `marts`; блок `intermediate` не используется, пока вы не добавите эту папку.

В этом руководстве настройки по умолчанию задаются для папок, а не для каждой модели. Подробнее см. в разделе [Остальная часть проекта](/best-practices/how-we-structure/5-the-rest-of-the-project).

## Использование только пользовательской схемы в production

Чтобы использовать в production схему `marts` вместо `analytics_prod_marts`, воспользуйтесь встроенным подходом [`generate_schema_name_for_env`](/docs/build/custom-schemas#a-built-in-alternative-pattern-for-generating-schema-names). Он использует только пользовательскую схему, когда `target.name` равен `prod`. Во всех остальных средах он игнорирует пользовательские схемы и создает все модели в целевой схеме (`alice_dev`). Не изменяйте стандартный макрос так, чтобы он исключал целевую схему во всех средах: иначе запуски в среде разработки могут записывать данные в те же схемы, что и запуски в production.


## Использование названий схем bronze, silver и gold

Если в вашем хранилище используются названия схем bronze, silver и gold, они сопоставляются с теми же папками, которые обсуждались выше. Менять структуру проекта dbt не нужно.

В следующей таблице показано соответствие этих названий папкам из этого руководства:

| Название в хранилище | В этом руководстве |
| --- | --- |
| Bronze | Источники в `raw` (только для чтения) |
| Silver | Подготовительный и промежуточный слои |
| Gold | Витрины |

<br />

Сохраните `staging`, `intermediate` и `marts` в качестве названий пользовательских схем в этом руководстве, чтобы они совпадали с именами папок. Если ваше хранилище требует использовать `silver` и `gold` в качестве названий схем, задайте эти названия в `+schema`.

Если задать `+schema: silver` и для `staging`, и для `intermediate`, модели из этих папок будут использовать одну общую схему, и отдельной схемы для промежуточного слоя не будет. Чтобы сохранить это разделение, используйте два разных названия пользовательских схем.

## Связанная документация

- [Как мы структурируем наши проекты dbt](/best-practices/how-we-structure/1-guide-overview)
- [Пользовательские схемы](/docs/build/custom-schemas)
- [Подготовительный слой](/best-practices/how-we-structure/2-staging)
- [Промежуточный слой](/best-practices/how-we-structure/3-intermediate)
- [Витрины](/best-practices/how-we-structure/4-marts)
- [Остальная часть проекта](/best-practices/how-we-structure/5-the-rest-of-the-project)
- [Оптимизация моделей dbt в Databricks](/guides/optimize-dbt-models-on-databricks)
- [Рекомендации по работе с dbt и Unity Catalog](/best-practices/dbt-unity-catalog-best-practices)
