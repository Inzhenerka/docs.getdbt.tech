---
title: "Добавление источников в ваш DAG"  
sidebar_label: "Источники"  
description: "Определяйте таблицы источников данных при разработке в dbt."
id: "sources"
search_weight: "heavy"
availability: all_users
---

## Связанная справочная документация
* [Свойства источников](/reference/source-properties)
* [Конфигурации источников](/reference/source-configs)
* [Jinja-функция `{{ source() }}`](/reference/dbt-jinja-functions/source)

<VersionBlock firstVersion="2.0">

* [Команда `dbt freshness`](/reference/commands/freshness)

</VersionBlock>

<VersionBlock lastVersion="1.99">

* [Команда `source freshness`](/reference/commands/source)

</VersionBlock>

## Использование источников {#using-sources}
Источники позволяют задавать имена и описания для данных, загружаемых в ваше хранилище инструментами извлечения и загрузки данных. Объявив эти таблицы в качестве источников в dbt, вы сможете
- выбирать данные из таблиц-источников в своих моделях с помощью [функции `{{ source() }}`,](/reference/dbt-jinja-functions/source) что помогает определить происхождение и путь преобразования данных
- проверять свои предположения об исходных данных с помощью тестов
- рассчитывать свежесть исходных данных

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

## Свежесть исходных данных {#source-data-freshness}
С помощью нескольких дополнительных настроек dbt может отслеживать «свежесть» данных в ваших исходных таблицах. Это помогает понять, исправно ли работают ваши конвейеры данных, и является важнейшей составляющей при определении соглашений об уровне обслуживания (SLA) для вашего хранилища данных.

### <Constant name="fusion" /> и dbt State

import SaoDeprecated from '/snippets/_sao-deprecated.md';

<SaoDeprecated />

Если вы используете <Constant name="fusion_engine" /> с [dbt State](/docs/deploy/dbt-state-about), dbt автоматически отслеживает свежесть источников с помощью метаданных хранилища. Чтобы dbt обнаруживал изменения исходных данных, вам не нужно настраивать `warn_after` или `error_after`.

Если вы используете [dbt State](/docs/deploy/dbt-state-about), задайте [`lag_tolerance`](/reference/resource-configs/lag-tolerance), чтобы управлять частотой перестроения моделей при изменении данных в вышестоящих источниках. Для более точного определения свежести также можно настроить `loaded_at_field` или `loaded_at_query` для источника (например, для потоковых данных или записей, поступающих с задержкой).

Однако вам всё равно следует настроить проверку свежести источников, если вы хотите:
- Получать оповещения о нарушении SLA, когда источники не обновляются в ожидаемые сроки.
- Определять собственную логику проверки свежести с помощью `loaded_at_field` или `loaded_at_query` (например, для потоковых данных или частичных загрузок).
- Отслеживать свежесть представлений-источников. <Constant name="fusion" /> считает представления «всегда свежими», поскольку не может определить свежесть по метаданным представлений.

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

### Проверка свежести источников {#evaluate-source-freshness}

<VersionBlock firstVersion="2.0">

Чтобы проверить свежесть источников, используйте [`dbt freshness`](/reference/commands/freshness) с `--resource-type source`:

```shell
dbt freshness --resource-type source
```

При запуске `dbt freshness` без указания типа ресурса проверяются все источники _и_ модели, для которых задана конфигурация `freshness`.

</VersionBlock>

<VersionBlock lastVersion="1.99">

Чтобы получить информацию о свежести источников, используйте команду `dbt source freshness` ([справочная документация](/reference/commands/source)):

```shell
dbt source freshness
```

</VersionBlock>

За кулисами dbt использует свойства актуальности для построения запроса `select`, показанного ниже. Вы можете найти этот запрос в [журналах запросов](/faqs/Runs/checking-logs).

```sql
select
  max(_etl_loaded_at) as max_loaded_at,
  convert_timezone('UTC', current_timestamp()) as calculated_at
from raw.jaffle_shop.orders

```

Результаты этого запроса используются для определения, является ли источник актуальным или нет:

<VersionBlock firstVersion="2.0">

```text
$ dbt freshness --resource-type source

    Passed source jaffle_shop.orders (last updated 32m 14s ago) [0.42s]
     Stale source jaffle_shop.customers (last updated 2days 6h 18m ago) [0.39s]

[error] [StaleSource (dbt1063)]: Stale source source.jaffle_shop.jaffle_shop.customers
  --> models/<filename>.yml
```

</VersionBlock>

<VersionBlock lastVersion="1.99">

<Lightbox src="/img/docs/building-a-dbt-project/snapshot-freshness.png" title="Ой! Не все данные настолько свежие, как хотелось бы!"/>

</VersionBlock>

### Построение моделей с учетом свежести источников

Мы рекомендуем использовать [проверку свежести источников данных](/docs/build/sources#declaring-source-freshness), настроенную в ваших файлах `.yml` с помощью параметра [`freshness`](/reference/resource-configs/freshness).

Чтобы собирать модели на основе свежести источников в dbt:

1. <VersionBlock firstVersion="2.0">Выполните [`dbt freshness --resource-type source`](/reference/commands/freshness), чтобы проверить свежесть данных в источниках.</VersionBlock><VersionBlock lastVersion="1.99">Выполните `dbt source freshness`, чтобы проверить свежесть данных в источниках.</VersionBlock>
2. Используйте команду `dbt build --select source_status:fresher+`, чтобы построить и протестировать модели, зависящие от источников с более свежими данными.

Последовательное выполнение этих команд гарантирует, что модели обновляются с использованием самых свежих данных. Это исключает ненужные затраты вычислительных ресурсов на неизменившиеся данные и позволяет строить модели _только_ при необходимости.

Установите интервал [проверок свежести источников](/docs/deploy/source-freshness#enabling-source-freshness-checks) в 30 минут, а затем запускайте задание, которое перестраивает модели каждый час. Такая настройка позволяет за один запуск получить все модели и перестроить их, если срок свежести данных в их источниках истёк. Подробнее см. в разделе [Частота проверок свежести источников](/docs/deploy/source-freshness#source-freshness-check-frequency).

:::tip
Для этого сценария также можно использовать [dbt State](/docs/deploy/dbt-state-about). Задайте параметр [`lag_tolerance`](/reference/resource-configs/lag-tolerance), чтобы управлять тем, сколько времени должно пройти с момента последнего изменения данных в вышестоящих ресурсах, прежде чем dbt запустит перестроение, без необходимости вручную выстраивать цепочку команд.
:::

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