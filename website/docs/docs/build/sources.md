---
title: "Добавление источников в ваш DAG"  
sidebar_label: "Источники"  
description: "Определяйте таблицы источников данных при разработке в dbt."
id: "sources"
search_weight: "heavy"
---

## Связанная справочная документация {#related-reference-docs}
* [Свойства источников](/reference/source-properties)
* [Конфигурации источников](/reference/source-configs)
* [Jinja‑функция `{{ source() }}`](/reference/dbt-jinja-functions/source)
* [Команда `source freshness`](/reference/commands/source)

## Использование источников {#using-sources}
Источники позволяют задавать имена и описывать данные, которые загружаются в ваше хранилище с помощью инструментов Extract и Load. Объявив эти таблицы как источники в dbt, вы получаете возможность:

- выбирать данные из исходных таблиц в ваших моделях с помощью функции [`{{ source() }}`](/reference/dbt-jinja-functions/source), что помогает определить происхождение (lineage) ваших данных
- проверять предположения о ваших исходных данных с помощью тестов
- рассчитывать актуальность (freshness) ваших исходных данных

### Объявление источника {#declaring-a-source}

Источники определяются в файлах `.yml`, вложенных под ключом `sources:`.

<File name='models/<filename>.yml'>

```yaml

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

*По умолчанию, `schema` будет таким же, как и `name`. Добавьте `schema` только если вы хотите использовать имя источника, отличающееся от существующей схемы.

Если вы еще не знакомы с этими файлами, обязательно ознакомьтесь с [документацией по файлам properties.yml](/reference/configs-and-properties) перед продолжением.

### Выборка из источника {#selecting-from-a-source}

После того как источник был определен, его можно ссылаться из модели, используя [функцию `{{ source()}}`](/reference/dbt-jinja-functions/source).

<File name='models/orders.sql'>

```sql
select
  ...

from {{ source('jaffle_shop', 'orders') }}

left join {{ source('jaffle_shop', 'customers') }} using (customer_id)

```

</File>

dbt скомпилирует это в полное имя <Term id="table" />:

<File name='target/compiled/jaffle_shop/models/my_model.sql'>

```sql

select
  ...

from raw.jaffle_shop.orders

left join raw.jaffle_shop.customers using (customer_id)

```

</File>

Использование функции `{{ source () }}` также создает зависимость между моделью и исходной таблицей.

<Lightbox src="/img/docs/building-a-dbt-project/sources-dag.png" title="Функция source сообщает dbt, что модель зависит от источника"/>

### Тестирование и документирование источников {#testing-and-documenting-sources}
Вы также можете:
- Добавлять тесты данных к источникам
- Добавлять описания к источникам, которые будут отображаться как часть вашего сайта документации

Эти концепции должны быть вам уже знакомы, если вы ранее добавляли тесты данных и описания к своим моделям (если нет — ознакомьтесь с руководствами по [тестированию](/docs/build/data-tests) и [документации](/docs/build/documentation)).

<File name='models/<filename>.yml'>

```yaml

sources:
  - name: jaffle_shop
    description: Это реплика базы данных Postgres, используемой нашим приложением
    tables:
      - name: orders
        database: raw
        description: >
          Одна запись на заказ. Включает отмененные и удаленные заказы.
        columns:
          - name: id
            description: Первичный ключ таблицы orders
            data_tests:
              - unique
              - not_null
          - name: status
            description: Обратите внимание, что статус может изменяться со временем

      - name: ...

  - name: ...
```

</File>

Вы можете найти больше деталей о доступных свойствах для источников в [справочном разделе](/reference/source-properties).

### Часто задаваемые вопросы {#faqs}
<FAQ path="Project/source-has-bad-name" />
<FAQ path="Project/source-in-different-database" />
<FAQ path="Models/source-quotes" />
<FAQ path="Tests/testing-sources" />
<FAQ path="Runs/running-models-downstream-of-source" />

## Актуальность данных источника {#source-data-freshness}
С помощью нескольких дополнительных конфигураций dbt может опционально фиксировать "актуальность" данных в ваших исходных таблицах. Это полезно для понимания, находятся ли ваши конвейеры данных в здоровом состоянии, и является критическим компонентом определения SLA для вашего хранилища.

### Объявление актуальности источника {#declaring-source-freshness}
Чтобы настроить информацию об актуальности источника, добавьте блок `freshness` к вашему источнику и `loaded_at_field` к объявлению вашей таблицы:

<File name='models/<filename>.yml'>

```yaml

sources:
  - name: jaffle_shop
    database: raw
    config: 
      freshness: # значения freshness по умолчанию
        # перенесено в config в версии v1.9
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}
      loaded_at_field: _etl_loaded_at # перенесено в config в версии v1.10

    tables:
      - name: orders
        config:
          freshness: # делаем требования немного строже
            warn_after: {count: 6, period: hour}
            error_after: {count: 12, period: hour}

      - name: customers # это наследует актуальность по умолчанию, определенную в блоке источника jaffle_shop в начале


      - name: product_skus
        config:
          freshness: null # не проверять свежесть для этой таблицы
```

</File>

В блоке `freshness` можно указать одно или оба из `warn_after` и `error_after`. Если ни одно из них не указано, то dbt не будет рассчитывать актуальность для таблиц в этом источнике.

Кроме того, поле `loaded_at_field` требуется для расчёта свежести таблицы (за исключением случаев, когда dbt может использовать метаданные хранилища для расчёта свежести). Если `loaded_at_field` или жизнеспособная альтернатива не указаны, dbt не будет рассчитывать свежесть для этой таблицы.

Эти конфигурации применяются иерархически, поэтому значения `freshness` и `loaded_at_field`, указанные для `source`, будут применяться ко всем `tables`, определенным в этом источнике. Это полезно, когда все таблицы в источнике имеют одинаковый `loaded_at_field`, так как конфигурацию можно указать один раз в определении источника верхнего уровня.

### Проверка актуальности источника {#checking-source-freshness}
Чтобы получить информацию об актуальности ваших источников, используйте команду `dbt source freshness` ([справочная документация](/reference/commands/source)):

```
$ dbt source freshness
```

За кулисами dbt использует свойства актуальности для построения запроса `select`, показанного ниже. Вы можете найти этот запрос в [журналах запросов](/faqs/Runs/checking-logs).

```sql
select
  max(_etl_loaded_at) as max_loaded_at,
  convert_timezone('UTC', current_timestamp()) as calculated_at
from raw.jaffle_shop.orders

```

Результаты этого запроса используются для определения, является ли источник актуальным или нет:

<Lightbox src="/img/docs/building-a-dbt-project/snapshot-freshness.png" title="Ой! Не все так свежо, как хотелось бы!"/>

### Сборка моделей на основе свежести источников {#build-models-based-on-source-freshness}

В качестве лучшей практики мы рекомендуем использовать [freshness источников данных](/docs/build/sources#declaring-source-freshness). Это позволяет перенести настройки в файл `.yml`, где свежесть источника определяется на [уровне модели](/reference/resource-properties/freshness).

Чтобы собирать модели на основе свежести источников в dbt:

1. Запустите `dbt source freshness`, чтобы проверить свежесть ваших источников.
2. Используйте команду `dbt build --select source_status:fresher+`, чтобы собрать и протестировать модели, расположенные ниже по цепочке от более свежих источников.

Использование этих команд в указанном порядке гарантирует, что модели будут обновляться с использованием самых актуальных данных. Это устраняет лишние вычислительные затраты на неизменившиеся данные и обеспечивает сборку моделей _только_ тогда, когда это действительно необходимо.

Установите [source freshness snapshots](/docs/deploy/source-freshness#enabling-source-freshness-snapshots) на 30 минут для проверки свежести источников, а затем настройте задание, которое будет запускаться каждый час для пересборки моделей. Такая конфигурация получает все модели и пересобирает их за один запуск, если срок свежести их источников истёк. Подробнее см. [Частота snapshot’ов свежести источников](/docs/deploy/source-freshness#source-freshness-snapshot-frequency).

### Фильтр {#filter}

В некоторых базах данных могут быть таблицы, для которых требуется применять фильтр по определённым колонкам, чтобы избежать полного сканирования таблицы, что может быть дорогостоящим. Чтобы выполнить проверку свежести для таких таблиц, в конфигурацию можно добавить аргумент `filter`, например: `filter: _etl_loaded_at >= date_sub(current_date(), interval 1 day)`. В приведённом выше примере итоговый запрос будет выглядеть следующим образом

```sql
select
  max(_etl_loaded_at) as max_loaded_at,
  convert_timezone('UTC', current_timestamp()) as calculated_at
from raw.jaffle_shop.orders
where _etl_loaded_at >= date_sub(current_date(), interval 1 day)
```

### Часто задаваемые вопросы {#faqs-1}
<FAQ path="Project/exclude-table-from-freshness" />
<FAQ path="Snapshots/snapshotting-freshness-for-one-source" />
<FAQ path="Project/dbt-source-freshness" />