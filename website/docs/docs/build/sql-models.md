---
title: "SQL модели"
description: "Прочитайте этот учебник, чтобы узнать, как использовать SQL модели при работе с dbt."
id: "sql-models"
---

## Связанные справочные документы
* [Конфигурации моделей](/reference/model-configs)
* [Свойства моделей](/reference/model-properties)
* [`run` команда](/reference/commands/run)
* [`ref` функция](/reference/dbt-jinja-functions/ref)

## Начало работы

:::info Создание ваших первых моделей

Если вы новичок в dbt, мы рекомендуем вам прочитать [руководство по быстрому старту](/guides), чтобы создать ваш первый проект dbt с моделями.

:::

Возможности Python в dbt являются расширением его возможностей с SQL моделями. Если вы новичок в dbt, мы рекомендуем вам сначала прочитать эту страницу, прежде чем переходить к: ["Python Модели"](/docs/build/python-models)

SQL модель — это оператор `select`. Модели определяются в `.sql` файлах (обычно в директории `models`):
- Каждый `.sql` файл содержит одну модель / оператор `select`
- Имя модели наследуется от имени файла.
- Мы настоятельно рекомендуем использовать подчеркивания для имен моделей, а не точки. Например, используйте `models/my_model.sql`, а не `models/my.model.sql`.
- Модели могут быть вложены в подкаталоги внутри директории `models`.

Смотрите [Как мы стилизуем наши dbt модели](/best-practices/how-we-style/1-how-we-style-our-dbt-models) для получения подробной информации о том, как мы рекомендуем называть ваши модели.

Когда вы выполняете [`dbt run` команду](/reference/commands/run), dbt создаст эту модель <Term id="data-warehouse" /> обернув её в оператор `create view as` или `create table as`.

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
* Строить модели в целевой схеме, которую вы определяете
* Использовать ваше имя файла в качестве имени представления или <Term id="table" /> в базе данных

Вы можете использовать _конфигурации_, чтобы изменить любое из этих поведений — подробнее об этом позже.

### Часто задаваемые вопросы
<FAQ path="Runs/checking-logs" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />
<FAQ path="Models/sql-dialect" />

## Конфигурирование моделей
Конфигурации — это "настройки модели", которые могут быть установлены в вашем файле `dbt_project.yml`, _и_ в вашем файле модели с использованием блока `config`. Некоторые примеры конфигураций включают:

* Изменение <Term id="materialization" /> модели — [материализация](/docs/build/materializations) определяет SQL, который dbt использует для создания модели в вашем хранилище данных.
* Создание моделей в отдельных [схемах](/docs/build/custom-schemas).
* Применение [тегов](/reference/resource-configs/tags) к модели.

Вот пример конфигурации модели:

<File name='dbt_project.yml'>

```yaml
name: jaffle_shop
config-version: 2
...

models:
  jaffle_shop: # это соответствует конфигурации `name:`
    +materialized: view # это применяется ко всем моделям в текущем проекте
    marts:
      +materialized: table # это применяется ко всем моделям в директории `marts/`
      marketing:
        +schema: marketing # это применяется ко всем моделям в директории `marts/marketing/`

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

Вы можете узнать больше о конфигурациях в [справочных документах](/reference/model-configs).

### Часто задаваемые вопросы
<FAQ path="Models/available-materializations" />
<FAQ path="Models/available-configurations" />


## Создание зависимостей между моделями
Вы можете создавать зависимости между моделями, используя [`ref` функцию](/reference/dbt-jinja-functions/ref) вместо имен таблиц в запросе. Используйте имя другой модели в качестве аргумента для `ref`.

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


dbt использует функцию `ref`, чтобы:
* Определить порядок выполнения моделей, создавая ациклический граф зависимостей (DAG).
<Lightbox src="/img/dbt-dag.png" title="DAG для нашего проекта dbt" />

* Управлять отдельными средами — dbt заменит модель, указанную в функции `ref`, на имя базы данных для <Term id="table" /> (или представления). Важно, что это учитывает среду — если вы запускаете dbt с целевой схемой, названной `dbt_alice`, он будет выбирать из таблицы верхнего уровня в той же схеме. Ознакомьтесь с вкладками выше, чтобы увидеть это в действии.

Кроме того, функция `ref` побуждает вас писать модульные преобразования, чтобы вы могли повторно использовать модели и уменьшать повторяющийся код.

## Тестирование и документирование моделей

Вы также можете документировать и тестировать модели — перейдите к разделу о [тестировании](/docs/build/data-tests) и [документации](/docs/build/documentation) для получения дополнительной информации.

## Дополнительные часто задаваемые вопросы
<FAQ path="Project/example-projects" alt_header="Есть ли примеры моделей dbt?" />
<FAQ path="Models/configurable-model-path" />
<FAQ path="Models/model-custom-schemas" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Models/removing-deleted-models" />
<FAQ path="Project/structure-a-project" alt_header="Как мне организовать свой проект по мере создания большего количества моделей? Как мне называть свои модели?" />
<FAQ path="Models/insert-records" />
<FAQ path="Project/why-not-write-dml" />
<FAQ path="Models/specifying-column-types" />
