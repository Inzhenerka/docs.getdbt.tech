---
title: "SQL-модели"
description: "SQL-модели — это строительные блоки вашего проекта dbt."
id: "sql-models"
---

## Связанные справочные документы {#related-reference-docs}
* [Конфигурации моделей](/reference/model-configs)
* [Свойства моделей](/reference/model-properties)
* [Команда `run`](/reference/commands/run)
* [Функция `ref`](/reference/dbt-jinja-functions/ref)

## Начало работы {#getting-started}

:::info Создание ваших первых моделей

Если вы новичок в dbt, мы рекомендуем вам прочитать [руководство по быстрому старту](/guides), чтобы создать ваш первый проект dbt с моделями.

:::

Возможности Python в dbt являются расширением его возможностей с SQL моделями. Если вы новичок в dbt, мы рекомендуем сначала прочитать эту страницу, прежде чем переходить к: ["Python модели"](/docs/build/python-models).

SQL модель — это оператор `select`. Модели определяются в файлах `.sql` (обычно в вашем каталоге `models`):
- Каждый файл `.sql` содержит одну модель / оператор `select`.
- Имя модели наследуется от имени файла.
- Мы настоятельно рекомендуем использовать подчеркивания в именах моделей, а не точки. Например, используйте `models/my_model.sql` вместо `models/my.model.sql`.
- Модели могут быть вложены в подкаталоги внутри каталога `models`.

SQL‑модель — это `select`‑запрос. Модели определяются в файлах `.sql` (как правило, в директории `models`):

- Каждый файл `.sql` содержит одну модель / один `select`‑запрос
- Имя модели наследуется от имени файла и **должно** совпадать с _именем файла_ модели — с учётом регистра. Несовпадение регистра может помешать dbt корректно применять конфигурации и повлиять на метаданные в [<Constant name="explorer" />](/docs/explore/explore-projects).
- Мы настоятельно рекомендуем использовать подчёркивания в именах моделей, а не точки. Например, используйте `models/my_model.sql` вместо `models/my.model.sql`.
- Модели могут быть вложены в поддиректории внутри директории `models`.

Когда вы выполняете [команду `dbt run`](/reference/commands/run), dbt создаст эту модель <Term id="data-warehouse" /> обернув её в оператор `create view as` или `create table as`.

Например, рассмотрим эту модель `customers`:

<File name='models/customers.sql'>

```sql
with customer_orders as (
    select
        customer_id,
        min(order_date) as first_order_date,
        max(order_date) as most_recent_order_date,
        count(order_id) as number_of_orders

    from jaffle_shop.orders

    group by 1
)

select
    customers.customer_id,
    customers.first_name,
    customers.last_name,
    customer_orders.first_order_date,
    customer_orders.most_recent_order_date,
    coalesce(customer_orders.number_of_orders, 0) as number_of_orders

from jaffle_shop.customers

left join customer_orders using (customer_id)
```

</File>

Когда вы выполняете `dbt run`, dbt создаст это как _представление_ с именем `customers` в вашей целевой схеме:

```sql
create view dbt_alice.customers as (
    with customer_orders as (
        select
            customer_id,
            min(order_date) as first_order_date,
            max(order_date) as most_recent_order_date,
            count(order_id) as number_of_orders

        from jaffle_shop.orders

        group by 1
    )

    select
        customers.customer_id,
        customers.first_name,
        customers.last_name,
        customer_orders.first_order_date,
        customer_orders.most_recent_order_date,
        coalesce(customer_orders.number_of_orders, 0) as number_of_orders

    from jaffle_shop.customers

    left join customer_orders using (customer_id)
)
```

Почему _представление_ с именем `dbt_alice.customers`? По умолчанию dbt будет:
* Создавать модели как <Term id="view">представления</Term>
* Создавать модели в целевой схеме, которую вы определяете
* Использовать имя вашего файла как имя представления или <Term id="table" /> в базе данных

Вы можете использовать _конфигурации_, чтобы изменить любое из этих поведений — об этом позже.

### Часто задаваемые вопросы {#faqs}
<FAQ path="Runs/checking-logs" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />
<FAQ path="Models/sql-dialect" />

## Настройка моделей {#configuring-models}
Конфигурации — это «настройки моделей», которые вы можете задавать в файле `dbt_project.yml`, а также непосредственно в файле модели с помощью блока `config`. Примеры таких конфигураций включают:

* Изменение <Term id="materialization" /> используемого моделью &mdash; [материализация](/docs/build/materializations) определяет SQL, который dbt использует для создания модели в вашем хранилище данных.
* Создание моделей в отдельных [схемах](/docs/build/custom-schemas).
* Применение [тегов](/reference/resource-configs/tags) к модели.

Следующая диаграмма показывает пример структуры каталогов папки `models`:

```
models
├── staging
└── marts
    └── marketing
```

Ниже приведён пример конфигурации модели:

<File name='dbt_project.yml'>

```yaml
name: jaffle_shop
config-version: 2
...

models:
  jaffle_shop: # это соответствует `name:`` конфигурации
    +materialized: view # это применяется ко всем моделям в текущем проекте
    marts:
      +materialized: table # это применяется ко всем моделям в каталоге `marts/`
      marketing:
        +schema: marketing # это применяется ко всем моделям в каталоге `marts/marketing/`

```

</File>


<File name='models/customers.sql'>

```sql

{{ config(
    materialized="view",
    schema="marketing"
) }}

with customer_orders as ...

```

</File>

Важно отметить, что конфигурации применяются иерархически — конфигурация, примененная к подкаталогу, переопределит любые общие конфигурации.

Вы можете узнать больше о конфигурациях в [справочной документации](/reference/model-configs).

### Часто задаваемые вопросы {#faqs-1}
<FAQ path="Models/available-materializations" />
<FAQ path="Models/available-configurations" />


## Построение зависимостей между моделями {#building-dependencies-between-models}
Вы можете строить зависимости между моделями, используя функцию [`ref`](/reference/dbt-jinja-functions/ref) вместо имен таблиц в запросе. Используйте имя другой модели в качестве аргумента для `ref`.

<Tabs
  defaultValue="model"
  values={[
    {label: 'Модель', value: 'model'},
    {label: 'Скомпилированный код в dev', value: 'dev'},
    {label: 'Скомпилированный код в prod', value: 'prod'},
  ]}>
  <TabItem value="model">


  <File name='models/customers.sql'>

  ```sql
  with customers as (

      select * from {{ ref('stg_customers') }}

  ),

  orders as (

      select * from {{ ref('stg_orders') }}

  ),

  ...

  ```

  </File>


  </TabItem>

  <TabItem value="dev">

```sql
create view dbt_alice.customers as (
  with customers as (

      select * from dbt_alice.stg_customers

  ),

  orders as (

      select * from dbt_alice.stg_orders

  ),

  ...
)

...

```


  </TabItem>

  <TabItem value="prod">

```sql
create view analytics.customers as (
  with customers as (

      select * from analytics.stg_customers

  ),

  orders as (

      select * from analytics.stg_orders

  ),

  ...
)

...

  ```

  </TabItem>
</Tabs>


dbt использует функцию `ref` для:
* Определения порядка выполнения моделей, создавая ориентированный ациклический граф (DAG).
<Lightbox src="/img/dbt-dag.png" title="DAG для нашего dbt проекта" />

* Управления отдельными средами &mdash; dbt заменит модель, указанную в функции `ref`, на имя базы данных для <Term id="table" /> (или представления). Важно, что это учитывает среду &mdash; если вы запускаете dbt с целевой схемой, названной `dbt_alice`, он будет выбирать из вышестоящей таблицы в той же схеме. Посмотрите на вкладки выше, чтобы увидеть это в действии.

Кроме того, функция `ref` поощряет вас писать модульные преобразования, чтобы вы могли повторно использовать модели и уменьшить повторяющийся код.

## Тестирование и документирование моделей {#testing-and-documenting-models}

Вы также можете документировать и тестировать модели &mdash; перейдите к разделу о [тестировании](/docs/build/data-tests) и [документировании](/docs/build/documentation) для получения дополнительной информации.

## Дополнительные часто задаваемые вопросы {#additional-faqs}
<FAQ path="Project/example-projects" alt_header="Есть ли примеры dbt моделей?" />
<FAQ path="Models/configurable-model-path" />
<FAQ path="Models/model-custom-schemas" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Models/removing-deleted-models" />
<FAQ path="Project/structure-a-project" alt_header="Как я должен организовать свой проект, когда создаю больше моделей? Как я должен называть свои модели?" />
<FAQ path="Models/insert-records" />
<FAQ path="Project/why-not-write-dml" />
<FAQ path="Models/specifying-column-types" />
