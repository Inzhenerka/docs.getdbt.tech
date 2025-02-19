---
title: "Материализации"
description: "Прочтите этот учебник, чтобы узнать, как использовать материализации при построении в dbt."
id: "materializations"
pagination_next: "docs/build/incremental-models"
---

## Обзор
<Term id="materialization">Материализации</Term> — это стратегии для сохранения моделей dbt в хранилище данных. В dbt встроено пять типов материализаций. Это:

- <Term id="table" />
- <Term id="view" />
- incremental
- ephemeral
- materialized view

Вы также можете настроить [пользовательские материализации](/guides/create-new-materializations?step=1) в dbt. Пользовательские материализации — это мощный способ расширить функциональность dbt для удовлетворения ваших специфических потребностей.

## Настройка материализаций
По умолчанию модели dbt материализуются как "views". Модели могут быть настроены с другой материализацией, указав параметр конфигурации [`materialized`](/reference/resource-configs/materialized), как показано в следующих вкладках.

<Tabs>

<TabItem value="Файл проекта">

<File name='dbt_project.yml'>

```yaml
# Следующий dbt_project.yml настраивает проект, который выглядит так:
# .
# └── models
#     ├── csvs
#     │   ├── employees.sql
#     │   └── goals.sql
#     └── events
#         ├── stg_event_log.sql
#         └── stg_event_sessions.sql

name: my_project
version: 1.0.0
config-version: 2

models:
  my_project:
    events:
      # материализовать все модели в models/events как таблицы
      +materialized: table
    csvs:
      # это избыточно и не требует настройки
      +materialized: view
```

</File>

</TabItem>

<TabItem value="Файл модели">

Альтернативно, материализации могут быть настроены непосредственно внутри SQL-файлов модели. Это может быть полезно, если вы также настраиваете конфигурации [оптимизации производительности] для конкретных моделей (например, [конфигурации для Redshift](/reference/resource-configs/redshift-configs) или [конфигурации для BigQuery](/reference/resource-configs/bigquery-configs)).

<File name='models/events/stg_event_log.sql'>

```sql

{{ config(materialized='table', sort='timestamp', dist='user_id') }}

select *
from ...
```

</File>

</TabItem>

<TabItem value="Файл свойств">

Материализации также могут быть настроены в файле `properties.yml` модели. Следующий пример показывает тип материализации `table`. Для полного списка типов материализаций обратитесь к [материализациям](/docs/build/materializations#materializations).

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: events
    config:
      materialized: table
```

</File>

</TabItem>

</Tabs>

## Материализации

### View
При использовании материализации `view`, ваша модель пересоздается как представление при каждом запуске с помощью оператора `create view as`.
* **Плюсы:** Дополнительные данные не сохраняются, представления на основе исходных данных всегда будут содержать последние записи.
* **Минусы:** Представления, выполняющие значительные преобразования или построенные на других представлениях, медленно запрашиваются.
* **Советы:**
    * Обычно начинайте с представлений для ваших моделей и меняйте на другую материализацию только при возникновении проблем с производительностью.
    * Представления лучше всего подходят для моделей, которые не выполняют значительных преобразований, например, переименование или изменение типа столбцов.

### Table
При использовании материализации `table`, ваша модель пересоздается как <Term id="table" /> при каждом запуске с помощью оператора `create table as`.
* **Плюсы:** Таблицы быстро запрашиваются.
* **Минусы:**
    * Таблицы могут долго пересоздаваться, особенно для сложных преобразований.
    * Новые записи в исходных данных не добавляются автоматически в таблицу.
* **Советы:**
  * Используйте материализацию таблицы для любых моделей, запрашиваемых BI-инструментами, чтобы обеспечить более быстрый опыт для конечного пользователя.
  * Также используйте материализацию таблицы для любых медленных преобразований, которые используются многими последующими моделями.

### Incremental
`incremental` модели позволяют dbt вставлять или обновлять записи в таблице с момента последнего запуска этой модели.
* **Плюсы:** Вы можете значительно сократить время сборки, просто преобразовывая новые записи.
* **Минусы:** Инкрементальные модели требуют дополнительной настройки и являются продвинутым использованием dbt. Подробнее о использовании инкрементальных моделей читайте [здесь](/docs/build/incremental-models).
* **Советы:**
    * Инкрементальные модели лучше всего подходят для данных в стиле событий.
    * Используйте инкрементальные модели, когда ваши `dbt run` становятся слишком медленными (т.е. не начинайте с инкрементальных моделей).

### Ephemeral
`ephemeral` модели не строятся напрямую в базе данных. Вместо этого dbt будет интерполировать код из эфемерной модели в ее зависимые модели, используя общее табличное выражение (<Term id="cte" />). Вы можете управлять идентификатором для этого CTE, используя [псевдоним модели](/docs/build/custom-aliases), но dbt всегда будет добавлять префикс к идентификатору модели `__dbt__cte__`.

* **Плюсы:**
    * Вы все еще можете писать переиспользуемую логику.
  - Эфемерные модели могут помочь сохранить ваш <Term id="data-warehouse" /> чистым, уменьшая беспорядок (также рассмотрите возможность разделения ваших моделей по нескольким схемам, [используя пользовательские схемы](/docs/build/custom-schemas)).
* **Минусы:**
    * Вы не можете выбирать напрямую из этой модели.
    * [Операции](/docs/build/hooks-operations#about-operations) (например, макросы, вызываемые с помощью [`dbt run-operation`](/reference/commands/run-operation) не могут `ref()` эфемерные узлы).
    * Чрезмерное использование эфемерной материализации также может усложнить отладку запросов.
    * Эфемерная материализация не поддерживает [контракты моделей](/docs/collaborate/govern/model-contracts#where-are-contracts-supported).
* **Советы:** Используйте эфемерную материализацию для:
    * очень легких преобразований, которые находятся в начале вашего DAG,
    * используются только в одной или двух последующих моделях, и
    * не нуждаются в прямом запросе.

### Materialized View

Материализация `materialized_view` позволяет создавать и поддерживать материализованные представления в целевой базе данных.
Материализованные представления представляют собой комбинацию представления и таблицы и служат для случаев использования, аналогичных инкрементальным моделям.

* **Плюсы:**
  * Материализованные представления сочетают в себе производительность запросов таблицы с актуальностью данных представления.
  * Материализованные представления работают аналогично инкрементальным материализациям, однако они обычно могут обновляться без ручного вмешательства на регулярной основе (в зависимости от базы данных), обходя регулярное обновление dbt, требуемое для инкрементальных материализаций.
  * `dbt run` на материализованных представлениях соответствует развертыванию кода, как и представления.
* **Минусы:**
  * Из-за того, что материализованные представления являются более сложными объектами базы данных, платформы баз данных, как правило, имеют меньше доступных опций конфигурации; см. документацию вашей платформы базы данных для получения более подробной информации.
  * Материализованные представления могут не поддерживаться каждой платформой базы данных.
* **Советы:**
  * Рассмотрите возможность использования материализованных представлений для случаев, когда инкрементальные модели достаточны, но вы хотите, чтобы платформа данных управляла инкрементальной логикой и обновлением.

#### Мониторинг изменения конфигурации

Эта материализация использует конфигурацию [`on_configuration_change`](/reference/resource-configs/on_configuration_change), которая соответствует инкрементальной природе одноименного объекта базы данных. Эта настройка указывает dbt попытаться внести изменения конфигурации непосредственно в объект, когда это возможно, вместо полного пересоздания объекта для реализации обновленной конфигурации. Используя `dbt-postgres` в качестве примера, индексы могут быть удалены и созданы на материализованном представлении без необходимости пересоздания самого материализованного представления.

#### Запланированные обновления

В контексте команды `dbt run` материализованные представления следует рассматривать как аналогичные представлениям. Например, команда `dbt run` требуется только в случае потенциального изменения конфигурации или SQL; это фактически действие развертывания. В отличие от этого, команда `dbt run` требуется для таблицы в тех же сценариях *и когда данные в таблице нуждаются в обновлении*. Это также верно для инкрементальных и снимочных моделей, чьи базовые отношения являются таблицами. В случае таблиц механизм планирования — это либо dbt Cloud, либо ваш локальный планировщик; нет встроенной функциональности для автоматического обновления данных за таблицей. Однако большинство платформ (за исключением Postgres) предоставляют функциональность для настройки автоматического обновления материализованного представления. Таким образом, материализованные представления работают аналогично инкрементальным моделям с преимуществом отсутствия необходимости запускать dbt для обновления данных. Это, конечно, предполагает, что автоматическое обновление включено и настроено в модели.

:::info
`dbt-snowflake` _не поддерживает_ материализованные представления, вместо этого он использует динамические таблицы. Для получения подробной информации обратитесь к [конфигурациям для Snowflake](/reference/resource-configs/snowflake-configs#dynamic-tables).
:::

## Материализации Python

Модели Python поддерживают две материализации:
- `table`
- `incremental`

Инкрементальные модели Python поддерживают все те же [инкрементальные стратегии](/docs/build/incremental-strategy), что и их SQL-аналоги. Конкретные поддерживаемые стратегии зависят от вашего адаптера.

Модели Python не могут быть материализованы как `view` или `ephemeral`. Python не поддерживается для типов ресурсов, отличных от моделей (например, тестов и снимков).

Для инкрементальных моделей, как и для SQL-моделей, вам нужно будет фильтровать входящие таблицы только на новые строки данных:

<WHCode>

<div warehouse="Snowpark">

<File name='models/my_python_model.py'>

```python
import snowflake.snowpark.functions as F

def model(dbt, session):
    dbt.config(materialized = "incremental")
    df = dbt.ref("upstream_table")

    if dbt.is_incremental:

        # только новые строки по сравнению с максимумом в текущей таблице
        max_from_this = f"select max(updated_at) from {dbt.this}"
        df = df.filter(df.updated_at >= session.sql(max_from_this).collect()[0][0])

        # или только строки за последние 3 дня
        df = df.filter(df.updated_at >= F.dateadd("day", F.lit(-3), F.current_timestamp()))

    ...

    return df
```

</File>

</div>

<div warehouse="PySpark">

<File name='models/my_python_model.py'>

```python
import pyspark.sql.functions as F

def model(dbt, session):
    dbt.config(materialized = "incremental")
    df = dbt.ref("upstream_table")

    if dbt.is_incremental:

        # только новые строки по сравнению с максимумом в текущей таблице
        max_from_this = f"select max(updated_at) from {dbt.this}"
        df = df.filter(df.updated_at >= session.sql(max_from_this).collect()[0][0])

        # или только строки за последние 3 дня
        df = df.filter(df.updated_at >= F.date_add(F.current_timestamp(), F.lit(-3)))

    ...

    return df
```

</File>

</div>

</WHCode>

**Примечание:** Инкрементальные модели поддерживаются на BigQuery/Dataproc для инкрементальной стратегии `merge`. Стратегия `insert_overwrite` пока не поддерживается.

<Snippet path="discourse-help-feed-header" />
<DiscourseHelpFeed tags="materialization"/>