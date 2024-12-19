---
title: "Добавление источников в ваш DAG"
sidebar_label: "Источники"
description: "Прочитайте этот учебник, чтобы узнать, как использовать источники при работе с dbt."
id: "sources"
search_weight: "heavy"
---

## Связанные справочные документы
* [Свойства источников](/reference/source-properties)
* [Конфигурации источников](/reference/source-configs)
* [`{{ source() }}` функция jinja](/reference/dbt-jinja-functions/source)
* [`команда source freshness`](/reference/commands/source)

## Использование источников
Источники позволяют называть и описывать данные, загруженные в ваш хранилище с помощью инструментов извлечения и загрузки. Объявив эти таблицы как источники в dbt, вы можете:
- выбирать данные из таблиц источников в ваших моделях, используя функцию `{{ source() }}`, что помогает определить происхождение ваших данных
- проверять свои предположения о данных источников
- вычислять свежесть ваших данных источников

### Объявление источника

Источники определяются в `.yml` файлах, вложенных под ключом `sources:`.

<File name='models/<filename>.yml'>

```yaml
version: 2

sources:
  - name: jaffle_shop
    database: raw  
    schema: jaffle_shop  
    tables:
      - name: orders
      - name: customers

  - name: stripe
    tables:
      - name: payments
```

</File>

*По умолчанию `schema` будет таким же, как и `name`. Добавьте `schema`, только если вы хотите использовать имя источника, отличное от существующей схемы.

Если вы еще не знакомы с этими файлами, обязательно ознакомьтесь с [документацией по файлам properties.yml](/reference/configs-and-properties) перед тем, как продолжить.

### Выбор из источника

После того как источник был определен, его можно использовать в модели с помощью функции [`{{ source()}}` ](/reference/dbt-jinja-functions/source).

<File name='models/orders.sql'>

```sql
select
  ...

from {{ source('jaffle_shop', 'orders') }}

left join {{ source('jaffle_shop', 'customers') }} using (customer_id)

```

</File>

dbt скомпилирует это в полное <Term id="table" /> имя:

<File name='target/compiled/jaffle_shop/models/my_model.sql'>

```sql

select
  ...

from raw.jaffle_shop.orders

left join raw.jaffle_shop.customers using (customer_id)

```

</File>

Использование функции `{{ source () }}` также создает зависимость между моделью и таблицей источника.

<Lightbox src="/img/docs/building-a-dbt-project/sources-dag.png" title="Функция source сообщает dbt, что модель зависит от источника"/>

### Тестирование и документирование источников
Вы также можете:
- Добавлять тесты данных к источникам
- Добавлять описания к источникам, которые будут отображаться как часть вашего сайта документации

Эти концепции должны быть вам знакомы, если вы уже добавляли тесты и описания к вашим моделям (если нет, ознакомьтесь с руководствами по [тестированию](/docs/build/data-tests) и [документации](/docs/build/documentation)).

<File name='models/<filename>.yml'>

```yaml
version: 2

sources:
  - name: jaffle_shop
    description: Это реплика базы данных Postgres, используемой нашим приложением
    tables:
      - name: orders
        description: >
          Один запись на заказ. Включает отмененные и удаленные заказы.
        columns:
          - name: id
            description: Первичный ключ таблицы заказов
            tests:
              - unique
              - not_null
          - name: status
            description: Обратите внимание, что статус может изменяться со временем

      - name: ...

  - name: ...
```

</File>

Вы можете найти больше деталей о доступных свойствах для источников в [разделе справки](/reference/source-properties).

### Часто задаваемые вопросы
<FAQ path="Project/source-has-bad-name" />
<FAQ path="Project/source-in-different-database" />
<FAQ path="Models/source-quotes" />
<FAQ path="Tests/testing-sources" />
<FAQ path="Runs/running-models-downstream-of-source" />

## Свежесть данных источника
С помощью нескольких дополнительных конфигураций dbt может опционально захватывать "свежесть" данных в ваших таблицах источников. Это полезно для понимания, находятся ли ваши конвейеры данных в здоровом состоянии, и является критически важным компонентом определения SLA для вашего хранилища.

### Объявление свежести источника
Чтобы настроить информацию о свежести источника, добавьте блок `freshness` к вашему источнику и `loaded_at_field` к объявлению вашей таблицы:

<File name='models/<filename>.yml'>

```yaml
version: 2

sources:
  - name: jaffle_shop
    database: raw
    freshness: # свежесть по умолчанию
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}
    loaded_at_field: _etl_loaded_at

    tables:
      - name: orders
        freshness: # сделаем это немного строже
          warn_after: {count: 6, period: hour}
          error_after: {count: 12, period: hour}

      - name: customers # это наследует свежесть по умолчанию, определенную в блоке источника jaffle_shop в начале


      - name: product_skus
        freshness: null # не проверять свежесть для этой таблицы
```

</File>

В блоке `freshness` можно указать один или оба параметра `warn_after` и `error_after`. Если ни один из них не указан, dbt не будет вычислять свежесть для таблиц в этом источнике.

Кроме того, `loaded_at_field` необходим для вычисления свежести для таблицы. Если `loaded_at_field` не указан, dbt не будет вычислять свежесть для таблицы.

Эти конфигурации применяются иерархически, поэтому значения `freshness` и `loaded_at_field`, указанные для `source`, будут переданы всем `tables`, определенным в этом источнике. Это полезно, когда все таблицы в источнике имеют одно и то же `loaded_at_field`, так как конфигурацию можно указать один раз в определении верхнего уровня источника.

### Проверка свежести источника
Чтобы получить информацию о свежести ваших источников, используйте команду `dbt source freshness` ([справочные документы](/reference/commands/source)):

```
$ dbt source freshness
```

Внутри dbt использует свойства свежести для построения запроса `select`, показанного ниже. Вы можете найти этот запрос в [логах запросов](/faqs/Runs/checking-logs).

```sql
select
  max(_etl_loaded_at) as max_loaded_at,
  convert_timezone('UTC', current_timestamp()) as calculated_at
from raw.jaffle_shop.orders

```

Результаты этого запроса используются для определения, свеж ли источник или нет:

<Lightbox src="/img/docs/building-a-dbt-project/snapshot-freshness.png" title="Ой! Не все так свежо, как нам хотелось бы!"/>

### Фильтр

Некоторые базы данных могут иметь таблицы, для которых требуется фильтр по определенным столбцам, чтобы предотвратить полное сканирование таблицы, что может быть дорого. Чтобы выполнить проверку свежести для таких таблиц, можно добавить аргумент `filter` к конфигурации, например `filter: _etl_loaded_at >= date_sub(current_date(), interval 1 day)`. Для приведенного выше примера результирующий запрос будет выглядеть так:

```sql
select
  max(_etl_loaded_at) as max_loaded_at,
  convert_timezone('UTC', current_timestamp()) as calculated_at
from raw.jaffle_shop.orders
where _etl_loaded_at >= date_sub(current_date(), interval 1 day)
```

### Часто задаваемые вопросы
<FAQ path="Project/exclude-table-from-freshness" />
<FAQ path="Snapshots/snapshotting-freshness-for-one-source" />
<FAQ path="Project/dbt-source-freshness" />