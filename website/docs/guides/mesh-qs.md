---
title: "Быстрый старт с dbt Mesh"
id: "mesh-qs"
level: 'Intermediate'
icon: 'guides'
tags: ['dbt platform','Quickstart']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Введение

<Constant name="mesh" /> — это фреймворк, который помогает организациям эффективно масштабировать команды и данные. Он продвигает лучшие практики управления (governance) и разбивает крупные проекты на управляемые части, обеспечивая более быструю разработку аналитики. <Constant name="mesh" /> доступен для аккаунтов [<Constant name="cloud" /> Enterprise](https://www.getdbt.com/).

В этом руководстве вы узнаете, как настроить многопроектную архитектуру с использованием базовых концепций [<Constant name="mesh" />](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh) и как реализовать data mesh в <Constant name="cloud" />:

- Создать базовый (foundational) проект под названием «Jaffle | Data Analytics»
- Создать downstream‑проект под названием «Jaffle | Finance»
- Добавить доступ к моделям, версии и контракты
- Настроить задание <Constant name="cloud" />, которое запускается после завершения upstream‑задания

Подробнее о том, почему data mesh важен, читайте в статье: [What is data mesh? The definition and importance of data mesh](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh).

:::tip Видео для вас
Вы можете бесплатно пройти курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals), если вам удобнее обучение с видео.

Также вы можете посмотреть [видео на YouTube про dbt и Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::

### Связанные материалы:
- [Концепции data mesh: что это такое и как начать](https://www.getdbt.com/blog/data-mesh-concepts-what-it-is-and-how-to-get-started)
- [Как выбрать структуру для вашего <Constant name="mesh" />](/best-practices/how-we-mesh/mesh-3-structures)
- [Руководство по лучшим практикам <Constant name="mesh" />](/best-practices/how-we-mesh/mesh-4-implementation)
- [Вопросы и ответы по <Constant name="mesh" />](/best-practices/how-we-mesh/mesh-5-faqs)

## Предварительные требования​

Чтобы использовать <Constant name="mesh" />, вам потребуется:

- Аккаунт уровня [<Constant name="cloud" /> Enterprise](https://www.getdbt.com/get-started/enterprise-contact-pricing) <Lifecycle status="managed,managed_plus" />
- Доступ к облачной платформе данных, права на загрузку примерных таблиц данных и права в <Constant name="cloud" /> на создание новых проектов.
- В этом руководстве используется пример данных Jaffle Shop, включая таблицы `customers`, `orders` и `payments`. Следуйте инструкциям, чтобы загрузить эти данные в вашу платформу данных:
  - [Snowflake](/guides/snowflake?step=3)
  - [Databricks](/guides/databricks?step=3)
  - [Redshift](/guides/redshift?step=3)
  - [BigQuery](/guides/bigquery?step=3)
  - [Fabric](/guides/microsoft-fabric?step=2)
  - [Starburst Galaxy](/guides/starburst-galaxy?step=2)

Предполагается, что у вас уже есть опыт работы с dbt или базовые знания. Если вы только начинаете знакомство с dbt, сначала пройдите курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).

## Создание и настройка двух проектов

В этом разделе вы создадите два новых пустых проекта в <Constant name="cloud" />, которые будут использоваться как базовый (foundational) и downstream‑проекты:

- **Базовые проекты** (или upstream‑проекты) обычно содержат ключевые модели и наборы данных, которые служат основой для дальнейшей аналитики и отчетности.
- **Downstream‑проекты** строятся поверх этой основы и часто добавляют более специфичные трансформации или бизнес‑логику для отдельных команд или задач.

Например, вымышленная, но весьма предприимчивая компания «Jaffle Labs» создаст два проекта для команды аналитики данных и финансов: Jaffle | Data Analytics и Jaffle | Finance.

<Lightbox src="/img/guides/dbt-mesh/project_names.png" width="50%" title="Создайте два новых dbt‑проекта с именами 'Jaffle | Data Analytics' и 'Jaffle Finance'" />

Чтобы [создать](/docs/cloud/about-cloud-setup) новый проект в <Constant name="cloud" />:

1. В **Account settings** перейдите в **Projects** и нажмите **New project**.
2. Введите имя проекта и нажмите **Continue**.
   - Используйте «Jaffle | Data Analytics» для одного проекта
   - Используйте «Jaffle | Finance» для второго проекта
3. Выберите платформу данных и нажмите **Next**, чтобы настроить подключение.
4. В разделе **Configure your environment** укажите **Settings** для нового проекта.
5. Нажмите **Test Connection**, чтобы проверить доступ <Constant name="cloud" /> к вашей платформе данных.
6. Если проверка прошла успешно, нажмите **Next**. Если нет — вернитесь и перепроверьте настройки.
   - В рамках этого руководства убедитесь, что вы создали по одной среде [development](/docs/dbt-cloud-environments#create-a-development-environment) и [Deployment](/docs/deploy/deploy-environments) для каждого проекта.
     - Для «Jaffle | Data Analytics» установите базу данных по умолчанию `jaffle_da`.
     - Для «Jaffle | Finance» установите базу данных по умолчанию `jaffle_finance`.
7. Продолжайте следовать подсказкам, чтобы завершить настройку проекта. После настройки в каждом проекте должно быть:
    - Подключение к платформе данных
    - Новый git‑репозиторий
    - Одна или несколько [сред](/docs/deploy/deploy-environments) (например, development и deployment)

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/1-settings-gear-icon.png" width="90%" title="Перейдите в Account settings." />

<Lightbox src="/img/guides/dbt-mesh/select_projects.png" width="30%" title="Выберите Projects в меню." />

<Lightbox src="/img/guides/dbt-mesh/create_a_new_project.png" width="95%" title="Создание нового проекта в Studio IDE." />

<Lightbox src="/img/guides/dbt-mesh/enter_project_name.png" width="95%" title="Задайте имя проекта." />

<Lightbox src="/img/guides/dbt-mesh/select_a_connection.png" width="95%" title="Выберите соответствующее подключение для ваших проектов." />

</DocCarousel>

### Создание production‑среды
В <Constant name="cloud" /> каждый проект может иметь одну deployment‑среду, назначенную как «Production». Для каждого проекта, который вы хотите объединить через mesh, необходимо настроить среду развертывания типа ["Production" или "Staging"](/docs/deploy/deploy-environments). Это позволит использовать <Constant name="explorer" /> на [последующих шагах](/guides/mesh-qs?step=5#create-and-run-a-dbt-cloud-job) данного руководства.

Чтобы настроить production‑среду:
1. Перейдите в **Deploy** → **Environments** и нажмите **Create New Environment**.
2. Выберите тип среды **Deployment**.
3. В разделе **Set deployment type** выберите **Production**.
4. Выберите версию dbt.
5. Заполните необходимые поля в разделах **Deployment connection** и **Deployment credentials**.
6. Нажмите **Test Connection**, чтобы проверить подключение.
6. Нажмите **Save**, чтобы создать production‑среду.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/prod-settings-1.png" width="100%" title="Установите production‑среду как среду по умолчанию в настройках Environment Settings"/>

## Настройка базового проекта

Этот upstream‑проект — место, где вы создаете основные data‑активы. Он будет содержать сырые источники данных, staging‑модели и ключевую бизнес‑логику.

<Constant name="cloud" /> позволяет специалистам по данным разрабатывать в привычных инструментах и включает локальный [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation) или браузерный [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio).

В этом разделе вы настроите проект «Jaffle | Data Analytics» как базовый, используя <Constant name="cloud_ide" />.

1. Перейдите на страницу **Develop**, чтобы проверить настройки.
2. Нажмите **Initialize dbt project**, если репозиторий пустой.
3. Удалите папку `models/example`.
4. Откройте файл `dbt_project.yml` и переименуйте проект (строка 5) с `my_new_project` на `analytics`.
5. В файле `dbt_project.yml` удалите строки 39–42 (ссылку на модели `my_new_project`).
6. В **File <Constant name="explorer" />** наведите курсор на каталог проекта, нажмите **...** и выберите **Create file**.
7. Создайте две новые папки: `models/staging` и `models/core`.

### Staging‑слой
Теперь, когда базовый проект настроен, начнем создавать data‑активы. Настройте staging‑слой следующим образом:

1. Создайте новый YAML‑файл свойств `models/staging/sources.yml`.
2. Объявите источники, скопировав следующий код в файл и нажав **Save**.

<File name='models/staging/sources.yml'>

```yaml
sources:
  - name: jaffle_shop
    description: This is a replica of the Postgres database used by our app
    database: raw
    schema: jaffle_shop
    tables:
      - name: customers
        description: One record per customer.
      - name: orders
        description: One record per order. Includes cancelled and deleted orders.
```

</File>

3. Создайте файл `models/staging/stg_customers.sql`, который выбирает данные из таблицы `customers` источника `jaffle_shop`.

<File name='models/staging/stg_customers.sql'>

```sql
select
    id as customer_id,
    first_name,
    last_name

from {{ source('jaffle_shop', 'customers') }}
```

</File>

4. Создайте файл `models/staging/stg_orders.sql`, который выбирает данные из таблицы `orders` источника `jaffle_shop`.

<File name='models/staging/stg_orders.sql'>

```sql
select
    id as order_id,
    user_id as customer_id,
    order_date,
    status

from {{ source('jaffle_shop', 'orders') }}
```

</File>

5. Создайте файл `models/core/fct_orders.sql`, чтобы построить факт‑таблицу с данными о клиентах и заказах.

<File name='models/core/fct_orders.sql'>

```sql
with customers as (
    select * 
    from {{ ref('stg_customers') }}
),

orders as (
    select * 
    from {{ ref('stg_orders') }}
),

customer_orders as (
    select
        customer_id,
        min(order_date) as first_order_date
    from orders
    group by customer_id
),

final as (
    select
        o.order_id,
        o.order_date,
        o.status,
        c.customer_id,
        c.first_name,
        c.last_name,
        co.first_order_date,
        -- Note that we've used a macro for this so that the appropriate DATEDIFF syntax is used for each respective data platform
        {{ datediff('first_order_date', 'order_date', 'day') }} as days_as_customer_at_purchase
    from orders o
    left join customers c using (customer_id)
    left join customer_orders co using (customer_id)
)

select * from final
```

</File>

6. Перейдите в **Command bar** и выполните `dbt build`.

Прежде чем downstream‑команда сможет использовать активы из этого базового проекта, необходимо:
- [Создать и определить](/docs/mesh/govern/model-access) как минимум одну модель с доступом “public”
- Успешно выполнить [deployment‑задание](/docs/deploy/deploy-jobs)
  - Обратите внимание: включите переключатель **Generate docs on run**, чтобы обновить <Constant name="explorer" />. После выполнения вы сможете перейти в Explore и увидеть lineage, тесты и документацию.

## Определение публичной модели и запуск первого задания

В предыдущем разделе вы подготовили базовые строительные блоки. Теперь интегрируем <Constant name="mesh" />.

Хотя финансовой команде требуется модель `fct_orders` для анализа платежей, другие модели, особенно staging‑слой для очистки и объединения данных, downstream‑командам не нужны.

Чтобы сделать `fct_orders` публичной:

1. В файле `models/core/core.yml` добавьте параметр `access: public` для соответствующей модели:

<File name='models/core/core.yml'>

```yaml
models:
  - name: fct_orders
    config:
      access: public # changed to config in v1.10
    description: "Customer and order details"
    columns:
      - name: order_id
        data_type: number
        description: ""

      - name: order_date
        data_type: date
        description: ""

      - name: status
        data_type: varchar
        description: "Indicates the status of the order"

      - name: customer_id
        data_type: number
        description: ""

      - name: first_name
        data_type: varchar
        description: ""

      - name: last_name
        data_type: varchar
        description: ""

      - name: first_order_date
        data_type: date
        description: ""

      - name: days_as_customer_at_purchase
        data_type: number
        description: "Days between this purchase and customer's first purchase"
```

</File>

Примечание: по умолчанию доступ к моделям установлен как “protected”, то есть они могут использоваться только внутри одного проекта. Подробнее о типах доступа и группах моделей читайте [здесь](/docs/mesh/govern/model-access#access-modifiers).

2. Перейдите на вкладку **Lineage** в <Constant name="cloud_ide" />, чтобы увидеть пометку **Public** под именем модели.

<Lightbox src="/img/guides/dbt-mesh/da_lineage.png" title="Lineage проекта Jaffle | Data Analytics" />

3. Перейдите в **Version control** и нажмите **Commit and Sync**, чтобы закоммитить изменения.
4. Смерджите изменения в основную или production‑ветку.

### Создание и запуск dbt‑задания

Прежде чем downstream‑команда сможет использовать активы из базового проекта, необходимо [создать production‑среду](/guides/mesh-qs?step=3#create-a-production-environment) и успешно запустить [deployment‑задание](/docs/deploy/deploy-jobs).

Чтобы запустить первое deployment‑задание <Constant name="cloud" />, создайте новое задание:
1. Перейдите в **Orchestration** > **Jobs**.
2. Нажмите **Create job**, затем **Deploy job**.
3. Включите опцию **Generate docs on run**, чтобы наполнить метаданные в <Constant name="explorer"/>.

<Lightbox src="/img/guides/dbt-mesh/generate_docs_on_run.png" width="75%" title="Выберите опцию 'Generate docs on run' при настройке dbt‑задания." />

4. Нажмите **Save**.
5. Нажмите **Run now**, чтобы запустить задание.
6. После завершения перейдите в <Constant name="explorer"/> — вы увидите lineage, тесты и документацию.

Подробнее о том, как <Constant name="cloud" /> использует метаданные из staging‑среды для разрешения ссылок в downstream‑проектах, читайте в разделе [Staging with downstream dependencies](/docs/mesh/govern/project-dependencies#staging-with-downstream-dependencies).

## Использование публичной модели в downstream‑проекте

В этом разделе вы настроите downstream‑проект «Jaffle | Finance» и выполните [межпроектную ссылку](/docs/mesh/govern/project-dependencies) на модель `fct_orders` из базового проекта. Перейдите на страницу **Develop**, чтобы настроить проект:

1. Если репозиторий новый, нажмите **Initialize dbt project** в разделе **Version control**.
2. Удалите папку `models/example`.
3. Откройте `dbt_project.yml` и переименуйте проект (строка 5) с `my_new_project` на `finance`.
4. В `dbt_project.yml` удалите строки 39–42 (ссылку на модели `my_new_project`).
5. В **File <Constant name="explorer" />** наведите курсор на каталог проекта, нажмите **...** и выберите **Create file**.
6. Назовите файл `dependencies.yml`.
7. Добавьте upstream‑проект `analytics` и пакет `dbt_utils`. Нажмите **Save**.

<File name='dependencies.yml'>

```yaml
packages:
  - package: dbt-labs/dbt_utils
    version: 1.1.1

projects:
  - name: analytics
```

</File>

### Staging‑слой

Теперь настройте staging‑слой downstream‑проекта:

1. Создайте файл `models/staging/sources.yml` и объявите источники:

<File name='models/staging/sources.yml'>

```yml
sources:
  - name: stripe
    database: raw
    schema: stripe 
    tables:
      - name: payment
```

</File>

2. Создайте файл `models/staging/stg_payments.sql` для выборки данных из таблицы `payment`.

<File name='models/staging/stg_payments.sql'>

```sql
with payments as (
    select * from {{ source('stripe', 'payment') }}
),

final as (
    select 
        id as payment_id,
        orderID as order_id,
        paymentMethod as payment_method,
        amount,
        created as payment_date 
    from payments
)

select * from final
```

</File>

### Использование публичной модели

Теперь вы готовы добавить модель, которая анализирует, как способы оплаты меняются на протяжении жизненного цикла клиента.

1. Используйте следующую логику:

<File name='models/core/agg_customer_payment_journey.sql'>

```sql
with stg_payments as (
    select * from {{ ref('stg_payments') }}
),

fct_orders as (
    select * from {{ ref('analytics', 'fct_orders') }}
),

final as (
    select 
        days_as_customer_at_purchase,
        -- we use the pivot macro in the dbt_utils package to create columns that total payments for each method
        {{ dbt_utils.pivot(
            'payment_method',
            dbt_utils.get_column_values(ref('stg_payments'), 'payment_method'),
            agg='sum',
            then_value='amount',
            prefix='total_',
            suffix='_amount'
        ) }}, 
        sum(amount) as total_amount
    from fct_orders
    left join stg_payments using (order_id)
    group by 1
)

select * from final
```

</File>

2. Обратите внимание, как работает межпроектная ссылка: автодополнение в <Constant name="cloud_ide" /> распознает публичную модель.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_autocomplete.png" title="Автодополнение межпроектной ссылки в Studio IDE" />

3. Ссылка автоматически разрешается в корректные database, schema и table/view, заданные upstream‑проектом.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_compile.png" title="Компиляция межпроектной ссылки" />

4. Это соединение также отображается во вкладке **Lineage**.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_lineage.png" title="Lineage межпроектной ссылки" />

## Добавление версий и контрактов моделей

Как повысить надежность и добавить защитные механизмы в таких межпроектных связях? Можно использовать лучшие практики из разработки ПО:

1. **Контракты моделей** — настройте [model contracts](/docs/mesh/govern/model-contracts), чтобы заранее зафиксировать форму данных. Если результат трансформации не соответствует контракту, сборка завершается с ошибкой.
2. **Версии моделей** — используйте [model versions](/docs/mesh/govern/model-versions) для управления изменениями и обработкой breaking changes.

### Настройка контрактов моделей

Команда Data Analytics может захотеть гарантировать надежность модели `fct_orders` для downstream‑пользователей.

1. В файле `models/core/core.yml` добавьте контракт перед секцией `columns:`:

```yaml
models:
  - name: fct_orders
    description: “Customer and order details”
    config:
      access: public # changed to config in v1.10
      contract:
        enforced: true
    columns:
      - name: order_id
        .....
```

2. Проверьте, что произойдет при нарушении контракта. В `models/core/fct_orders.sql` закомментируйте колонку `orders.status` и нажмите **Build**.
   - При нарушении контракта сборка завершится с ошибкой.
<Lightbox src="/img/guides/dbt-mesh/break_contract.png" title="Контракт данных нарушен, выполнение dbt build завершилось с ошибкой." />

### Настройка версий моделей

В этом разделе команда Data Analytics обновит модель `fct_orders`, сохранив обратную совместимость.

1. Переименуйте файл `models/core/fct_orders.sql` в `models/core/fct_orders_v1.sql`.
2. Создайте файл `models/core/fct_orders_v2.sql` и измените схему:
   - Закомментируйте `o.status` в CTE `final`.
   - Добавьте поле `case when o.status = 'returned' then true else false end as is_return`.
3. Затем обновите `models/core/core.yml`:
   - Добавьте колонку `is_return`
   - Определите две версии модели
   - Укажите `latest_version`
   - Добавьте `deprecation_date` для версии 1

4. Итоговый файл должен выглядеть так:

<File name='models/core/core.yml'>

```yaml
models:
  - name: fct_orders
    description: "Customer and order details"
    latest_version: 2
    config:
      access: public # changed to config in v1.10
      contract:
        enforced: true
    columns:
      - name: order_id
        data_type: number
        description: ""

      - name: order_date
        data_type: date
        description: ""

      - name: status
        data_type: varchar
        description: "Indicates the status of the order"

      - name: is_return
        data_type: boolean
        description: "Indicates if an order was returned"

      - name: customer_id
        data_type: number
        description: ""

      - name: first_name
        data_type: varchar
        description: ""

      - name: last_name
        data_type: varchar
        description: ""

      - name: first_order_date
        data_type: date
        description: ""

      - name: days_as_customer_at_purchase
        data_type: number
        description: "Days between this purchase and customer's first purchase"

    versions:
      - v: 1
        deprecation_date: 2024-06-30 00:00:00.00+00:00
        columns:
          - include: all
            exclude: [is_return]
        
      - v: 2
        columns:
          - include: all
            exclude: [status]
```

</File>

5. Проверьте, как dbt компилирует `ref` с учетом версий:

```sql
select * from {{ ref('fct_orders', v=1) }}
select * from {{ ref('fct_orders', v=2) }}
select * from {{ ref('fct_orders') }}
```

## Добавление dbt‑задания в downstream‑проекте

Перед продолжением убедитесь, что вы закоммитили и смерджили изменения в проектах «Jaffle | Data Analytics» и «Jaffle | Finance».

Финансовая команда хочет запускать свое <Constant name="cloud" />‑задание сразу после обновления данных в проекте аналитики.

1. В проекте «Jaffle | Finance» перейдите в **Orchestration** > **Jobs**.
2. Нажмите **Create job**, затем **Deploy job**.
3. Задайте имя задания и прокрутите до секции **Job completion**.
4. В разделе **Triggers** настройте **Run when another job finishes** и выберите upstream‑задание из проекта «Jaffle | Data Analytics».
<Lightbox src="/img/guides/dbt-mesh/trigger_on_completion.png" title="Запуск задания по завершению другого задания" />

5. Нажмите **Save** и проверьте настройки.
6. Перейдите на страницу заданий «Jaffle | Data Analytics», выберите **Daily job** и нажмите **Run now**.
7. После успешного завершения вернитесь к заданиям «Jaffle | Finance» — задание должно запуститься автоматически.

## Просмотр предупреждения о деприкации

Чтобы узнать, сколько времени у команды Finance есть на миграцию с `fct_orders_v1` на `fct_orders_v2`:

1. В проекте «Jaffle | Finance» перейдите на страницу **Develop**.
2. Измените межпроектную ссылку, указав `v=1`:

<File name='models/core/agg_customer_payment_journey.sql'>

```sql
with stg_payments as (
    select * from {{ ref('stg_payments') }}
),

fct_orders as (
    select * from {{ ref('analytics', 'fct_orders', v=1) }}
),

final as (
    select 
        days_as_customer_at_purchase,
        {{ dbt_utils.pivot(
            'payment_method',
            dbt_utils.get_column_values(ref('stg_payments'), 'payment_method'),
            agg='sum',
            then_value='amount',
            prefix='total_',
            suffix='_amount'
        ) }}, 
        sum(amount) as total_amount
    from fct_orders
    left join stg_payments using (order_id)
    group by 1
)

select * from final
```

</File>

3. В <Constant name="cloud_ide" /> закоммитьте и смерджите изменения.
4. Перейдите в **Deploy** → **Jobs**.
5. Нажмите **Run now**. Модель отобразит предупреждение с датой деприкации.

<Lightbox src="/img/guides/dbt-mesh/deprecation_date_warning.png" title="Модель отображает предупреждение о дате деприкации." />

## Просмотр lineage в dbt Catalog

Используйте [<Constant name="explorer" />](/docs/explore/explore-projects), чтобы просмотреть lineage между проектами в <Constant name="cloud" />. Перейдите на страницу **Explore** каждого проекта — вы увидите [единый lineage между проектами](/docs/explore/explore-multiple-projects).

<Lightbox src="/img/guides/dbt-mesh/jaffle_da_final_lineage.png" width="85%" title="Lineage проекта 'Jaffle | Data Analytics' в dbt Catalog" />

## Что дальше

<ConfettiTrigger>

Поздравляем 🎉! Вы готовы использовать преимущества <Constant name="mesh" /> в вашей организации. Вы узнали:

- Как создать базовый проект «Jaffle | Data Analytics»
- Как создать downstream‑проект «Jaffle | Finance»
- Как реализовать доступ к моделям, версии и контракты
- Как настраивать задания <Constant name="cloud" />, запускаемые после upstream‑заданий

Дополнительные ресурсы для дальнейшего изучения:

- [Как мы строим dbt mesh‑проекты](/best-practices/how-we-mesh/mesh-1-intro)
- [Вопросы и ответы по <Constant name="mesh" />](/best-practices/how-we-mesh/mesh-5-faqs)
- [Реализация <Constant name="mesh" /> с <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs#how-can-i-implement-dbt-mesh-with-the-dbt-semantic-layer)
- [Межпроектные ссылки](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref)
- [<Constant name="explorer" />](/docs/explore/explore-projects)

</ConfettiTrigger>

</div>
