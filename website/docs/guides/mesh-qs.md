---
title: "Быстрый старт с dbt Mesh"
id: "mesh-qs"
level: 'Intermediate'
icon: 'guides'
tags: ['dbt platform','Quickstart']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

<Constant name="mesh" /> — это фреймворк, который помогает организациям эффективно масштабировать команды и данные. Он продвигает лучшие практики управления (governance) и разбивает крупные проекты на управляемые части &mdash; что ускоряет разработку аналитики. <Constant name="mesh" /> доступен для аккаунтов [<Constant name="cloud" /> Enterprise](https://www.getdbt.com/).

В этом руководстве вы научитесь настраивать мультипроектную архитектуру, используя базовые концепции [<Constant name="mesh" />](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh), а также реализовывать data mesh в <Constant name="cloud" />:

- Настроите базовый (foundational) проект под названием “Jaffle | Data Analytics”
- Настроите downstream‑проект под названием “Jaffle | Finance”
- Добавите доступ к моделям, версии и контракты
- Настроите задание <Constant name="cloud" />, которое запускается после завершения upstream‑задания
 
Подробнее о том, почему data mesh важен, читайте в статье: [What is data mesh? The definition and importance of data mesh](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh).

:::tip Видео для вас
Вы можете бесплатно пройти курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals), если вам интересен формат обучения с видео.

Также вы можете посмотреть [видео на YouTube про dbt и Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::

### Связанные материалы: {#related-content}
- [Концепции data mesh: что это и как начать](https://www.getdbt.com/blog/data-mesh-concepts-what-it-is-and-how-to-get-started)
- [Как выбрать структуру для вашего <Constant name="mesh" />](/best-practices/how-we-mesh/mesh-3-structures)
- [Руководство по лучшим практикам <Constant name="mesh" />](/best-practices/how-we-mesh/mesh-4-implementation)
- [Часто задаваемые вопросы по <Constant name="mesh" />](/best-practices/how-we-mesh/mesh-5-faqs)

## Предварительные требования​ {#prerequisites}

Чтобы использовать <Constant name="mesh" />, необходимо следующее:

- У вас должен быть аккаунт [<Constant name="cloud" /> уровня Enterprise](https://www.getdbt.com/get-started/enterprise-contact-pricing) <Lifecycle status="managed,managed_plus" />
- У вас есть доступ к облачной платформе данных, права на загрузку примеров таблиц и разрешения в <Constant name="cloud" /> на создание новых проектов. 
- В этом руководстве используются примерные данные Jaffle Shop, включая таблицы `customers`, `orders` и `payments`. Следуйте инструкциям, чтобы загрузить эти данные в вашу платформу данных:
  - [Snowflake](/guides/snowflake?step=3)
  - [Databricks](/guides/databricks?step=3)
  - [Redshift](/guides/redshift?step=3)
  - [BigQuery](/guides/bigquery?step=3)
  - [Fabric](/guides/microsoft-fabric?step=2)
  - [Starburst Galaxy](/guides/starburst-galaxy?step=2)

Также предполагается, что у вас уже есть опыт работы с dbt или базовые знания. Если вы только начинаете, сначала пройдите курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).

## Создание и настройка двух проектов {#create-and-configure-two-projects}

В этом разделе вы создадите два новых пустых проекта в <Constant name="cloud" />, которые будут использоваться как базовый и downstream‑проекты:

- **Базовые проекты** (или upstream‑проекты) обычно содержат основные модели и датасеты, которые служат фундаментом для дальнейшей аналитики и отчетности.
- **Downstream‑проекты** строятся поверх этого фундамента и часто добавляют более специфичные трансформации или бизнес‑логику для отдельных команд или задач. 

Например, вымышленная, но всегда предприимчивая компания “Jaffle Labs” создаст два проекта для команд аналитики данных и финансов: Jaffle | Data Analytics и Jaffle | Finance.

<Lightbox src="/img/guides/dbt-mesh/project_names.png" width="50%" title="Создайте два новых dbt‑проекта с именами 'Jaffle | Data Analytics' и 'Jaffle Finance'" />

Чтобы [создать](/docs/cloud/about-cloud-setup) новый проект в <Constant name="cloud" />:

1. В **Account settings** перейдите в **Projects**. Нажмите **New project**.
2. Введите имя проекта и нажмите **Continue**.
   - Используйте "Jaffle | Data Analytics" для одного проекта
   - Используйте "Jaffle | Finance" для второго проекта
3. Выберите вашу платформу данных и нажмите **Next** для настройки подключения.
4. В разделе **Configure your environment** введите **Settings** для нового проекта.
5. Нажмите **Test Connection**, чтобы проверить доступ <Constant name="cloud" /> к вашей платформе данных.
6. Нажмите **Next**, если тест прошел успешно. Если нет — вернитесь и перепроверьте настройки.
   - Для этого руководства убедитесь, что в каждом проекте создано по одному [development](/docs/dbt-cloud-environments#create-a-development-environment) и [Deployment](/docs/deploy/deploy-environments) окружению.
     - Для "Jaffle | Data Analytics" установите базу данных по умолчанию `jaffle_da`.
     - Для "Jaffle | Finance" установите базу данных по умолчанию `jaffle_finance`.
7. Продолжайте следовать подсказкам до завершения настройки проекта. В итоге каждый проект должен иметь:
    - Подключение к платформе данных
    - Новый git‑репозиторий
    - Одно или несколько [окружений](/docs/deploy/deploy-environments) (например, development, deployment)

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/1-settings-gear-icon.png" width="90%" title="Перейдите в Account settings." />

<Lightbox src="/img/guides/dbt-mesh/select_projects.png" width="30%" title="Выберите Projects в меню." />

<Lightbox src="/img/guides/dbt-mesh/create_a_new_project.png" width="95%" title="Создание нового проекта в Studio IDE." />

<Lightbox src="/img/guides/dbt-mesh/enter_project_name.png" width="95%" title="Задайте имя проекта." />

<Lightbox src="/img/guides/dbt-mesh/select_a_connection.png" width="95%" title="Выберите соответствующее подключение для проектов." />

</DocCarousel>


### Создание production‑окружения {#create-a-production-environment}
В <Constant name="cloud" /> каждый проект может иметь одно deployment‑окружение, назначенное как “Production”. Для каждого проекта, который вы хотите объединить в mesh, необходимо настроить ["Production" или "Staging" deployment‑окружение](/docs/deploy/deploy-environments). Это позволит использовать <Constant name="explorer" /> на [последующих шагах](/guides/mesh-qs?step=5#create-and-run-a-dbt-cloud-job) данного руководства.

Чтобы настроить production‑окружение:
1. Перейдите в **Deploy** -> **Environments** и нажмите **Create New Environment**.
2. Выберите тип окружения **Deployment**.
3. В разделе **Set deployment type** выберите **Production**.
4. Выберите версию dbt.
5. Заполните необходимые поля в разделах **Deployment connection** и **Deployment credentials**.
6. Нажмите **Test Connection**, чтобы проверить подключение.
6. Нажмите **Save**, чтобы создать production‑окружение.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/prod-settings-1.png" width="100%" title="Назначьте production‑окружение окружением по умолчанию в настройках Environment Settings"/>


## Настройка базового проекта {#set-up-a-foundational-project}

Этот upstream‑проект — место, где вы создаете ключевые дата‑ассеты. Он будет содержать исходные источники данных, staging‑модели и основную бизнес‑логику.

<Constant name="cloud" /> позволяет специалистам по данным разрабатывать в привычных инструментах и предоставляет как локальный [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation), так и браузерный [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio).

В этом разделе вы настроите проект “Jaffle | Data Analytics” как базовый, используя <Constant name="cloud_ide" />.

1. Сначала перейдите на страницу **Develop**, чтобы проверить настройку.
2. Нажмите **Initialize dbt project**, если вы начали с пустого репозитория.
3. Удалите папку `models/example`.  
4. Перейдите к файлу `dbt_project.yml` и переименуйте проект (строка 5) с `my_new_project` на `analytics`.
5. В файле `dbt_project.yml` удалите строки 39–42 (ссылку на модель `my_new_project`).
6. В **File <Constant name="explorer" />** наведите курсор на директорию проекта, нажмите **...** и выберите **Create file**.
7. Создайте две новые папки: `models/staging` и `models/core`.

### Staging‑слой {#staging-layer}
Теперь, когда базовый проект настроен, начнем создавать дата‑ассеты. Настройте staging‑слой следующим образом:

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

3. Создайте файл `models/staging/stg_customers.sql`, чтобы выбрать данные из таблицы `customers` источника `jaffle_shop`.

<File name='models/staging/stg_customers.sql'>

```sql
select
    id as customer_id,
    first_name,
    last_name

from {{ source('jaffle_shop', 'customers') }}
```

</File>

4. Создайте файл `models/staging/stg_orders.sql`, чтобы выбрать данные из таблицы `orders` источника `jaffle_shop`.

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

5. Создайте файл `models/core/fct_orders.sql` для построения факт‑таблицы с данными о клиентах и заказах.

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

Прежде чем downstream‑команда сможет использовать ассеты из этого базового проекта, необходимо:
- [Создать и определить](/docs/mesh/govern/model-access) как минимум одну модель с доступом “public”
- Успешно выполнить [deployment‑задание](/docs/deploy/deploy-jobs)
  - Обратите внимание: включите переключатель **Generate docs on run** для этого задания, чтобы обновить <Constant name="explorer" />. После выполнения вы сможете открыть Explore в верхнем меню и увидеть lineage, тесты и документацию.

## Определение публичной модели и запуск первого задания {#define-a-public-model-and-run-first-job}

В предыдущем разделе вы подготовили базовые строительные блоки, теперь интегрируем <Constant name="mesh" />.

Хотя команде Finance требуется модель `fct_orders` для анализа платежных трендов, другие модели — особенно staging‑слой, используемый для очистки и объединения данных — downstream‑командам не нужны.

Чтобы сделать `fct_orders` публично доступной:

1. В файле `models/core/core.yml` добавьте параметр `access: public` для нужной модели, вставив и сохранив следующее:

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

Примечание: по умолчанию доступ моделей установлен как “protected”, что означает, что на них можно ссылаться только внутри того же проекта. Подробнее о типах доступа и группах моделей читайте [здесь](/docs/mesh/govern/model-access#access-modifiers).

2. Перейдите во вкладку **Lineage** в <Constant name="cloud_ide" />, чтобы увидеть модель, помеченную как **Public**, под ее именем.

<Lightbox src="/img/guides/dbt-mesh/da_lineage.png" title="Lineage проекта Jaffle | Data Analytics" />

3. Перейдите в **Version control** и нажмите **Commit and Sync**, чтобы закоммитить изменения.
4. Слейте изменения в основную или production‑ветку.

### Создание и запуск dbt‑задания {#create-and-run-a-dbt-job}

Прежде чем downstream‑команда сможет использовать ассеты из этого базового проекта, необходимо [создать production‑окружение](/guides/mesh-qs?step=3#create-a-production-environment) и успешно выполнить [deployment‑задание](/docs/deploy/deploy-jobs).

Чтобы запустить первое deployment‑задание <Constant name="cloud" />, создайте новое задание:
1. Перейдите в **Orchestration** > **Jobs**. 
2. Нажмите **Create job**, затем **Deploy job**.
3. Выберите опцию **Generate docs on run**, чтобы наполнить метаданные в <Constant name="explorer"/>.

<Lightbox src="/img/guides/dbt-mesh/generate_docs_on_run.png" width="75%" title="Выберите опцию 'Generate docs on run' при настройке dbt‑задания." />

4. Нажмите **Save**.
5. Нажмите **Run now**, чтобы запустить задание.
6. После завершения перейдите в <Constant name="explorer"/>. Теперь вы должны видеть lineage, тесты и документацию.

Подробнее о том, как <Constant name="cloud" /> использует метаданные из Staging‑окружения для разрешения ссылок в downstream‑проектах, читайте в разделе [Staging with downstream dependencies](/docs/mesh/govern/project-dependencies#staging-with-downstream-dependencies).

## Ссылка на публичную модель в downstream‑проекте {#reference-a-public-model-in-your-downstream-project}

В этом разделе вы настроите downstream‑проект “Jaffle | Finance” и выполните [межпроектную ссылку](/docs/mesh/govern/project-dependencies) на модель `fct_orders` из базового проекта. Перейдите на страницу **Develop**, чтобы настроить проект:

1. Если вы также начали с нового git‑репозитория, нажмите **Initialize dbt project** в разделе **Version control**.
2. Удалите папку `models/example`.
3. Перейдите к файлу `dbt_project.yml` и переименуйте проект (строка 5) с `my_new_project` на `finance`.
4. В файле `dbt_project.yml` удалите строки 39–42 (ссылку на модель `my_new_project`).
5. В **File <Constant name="explorer" />** наведите курсор на директорию проекта, нажмите **...** и выберите **Create file**.
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

### Staging‑слой {#staging-layer-1}

Теперь, когда базовый проект настроен, начнем создавать дата‑ассеты. Настройте staging‑слой следующим образом:

1. Создайте новый файл свойств `models/staging/sources.yml` и объявите источники, скопировав следующий код и нажав **Save**.

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

2. Создайте `models/staging/stg_payments.sql`, чтобы выбрать данные из таблицы `payment` источника `stripe`.

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

### Ссылка на публичную модель {#reference-the-public-model}

Теперь вы готовы добавить модель, которая анализирует, как типы платежей меняются на протяжении пути клиента. Это помогает определить, уменьшается ли использование купонных подарочных карт при повторных покупках, как ожидает маркетинговая команда, или остается стабильным.

1. Чтобы сослаться на модель, используйте следующую логику:

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

2. Обратите внимание, как работает межпроектный `ref`! При добавлении `ref` автодополнение в <Constant name="cloud_ide" /> распознает публичную модель как доступную.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_autocomplete.png" title="Автодополнение межпроектного ref в Studio IDE" />

3. Это автоматически разрешает (связывает) правильные базу данных, схему и таблицу/представление, заданные в upstream‑проекте.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_compile.png" title="Компиляция межпроектного ref" />

4. Вы также можете увидеть эту связь во вкладке **Lineage** в реальном времени.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_lineage.png" title="Lineage межпроектного ref" />

## Добавление версий моделей и контрактов {#add-model-versions-and-contracts}

Как повысить устойчивость и добавить защитные механизмы в таких межпроектных связях? Вы можете заимствовать лучшие практики из разработки ПО:

1. Определение контрактов моделей &mdash; настройте [model contracts](/docs/mesh/govern/model-contracts) в dbt, чтобы задать набор гарантий, описывающих структуру модели. При сборке dbt проверяет, что результат соответствует контракту; если нет — сборка завершается ошибкой.
2. Определение версий моделей &mdash; используйте [model versions](/docs/mesh/govern/model-versions) для управления обновлениями и систематической обработки breaking‑changes.

### Настройка контрактов моделей {#set-up-model-contracts}
Как часть команды Data Analytics, вы можете захотеть обеспечить надежность модели `fct_orders` для downstream‑пользователей, таких как команда Finance.

1. Перейдите к `models/core/core.yml` и в описании модели `fct_orders` перед разделом `columns:` добавьте контракт данных:

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
   - При нарушении контракта сборка завершится ошибкой, что видно в истории командной строки.
    <Lightbox src="/img/guides/dbt-mesh/break_contract.png" title="Контракт данных нарушен, сборка dbt завершилась ошибкой." />

### Настройка версий моделей {#set-up-model-versions}
В этом разделе вы настроите версии моделей: команда Data Analytics обновляет модель `fct_orders`, сохраняя обратную совместимость и уведомляя downstream‑команду Finance о миграции.

1. Переименуйте существующий файл модели `models/core/fct_orders.sql` в `models/core/fct_orders_v1.sql`.
2. Создайте новый файл `models/core/fct_orders_v2.sql` и измените схему:
   - Закомментируйте `o.status` в CTE `final`.
   - Добавьте новое поле `case when o.status = 'returned' then true else false end as is_return`, указывающее, был ли заказ возвращен.
3. Затем добавьте в файл `models/core/core.yml`:
   - колонку `is_return`
   - две версии модели
   - `latest_version`, чтобы указать актуальную версию (используется по умолчанию)
   - `deprecation_date` для версии 1, чтобы указать дату вывода из эксплуатации.

4. В итоге файл должен выглядеть так:

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

    # Declare the versions, and highlight the diffs
    versions:
    
      - v: 1
        deprecation_date: 2024-06-30 00:00:00.00+00:00
        columns:
          # This means: use the 'columns' list from above, but exclude is_return
          - include: all
            exclude: [is_return]
        
      - v: 2
        columns:
          # This means: use the 'columns' list from above, but exclude status
          - include: all
            exclude: [status]
```

</File>

5. Проверьте, как dbt компилирует `ref` с учетом обновлений. Откройте новый файл, добавьте следующие запросы и нажмите **Compile**. Обратите внимание, что каждый `ref` компилируется в указанную версию (или в последнюю, если версия не указана).

```sql
select * from {{ ref('fct_orders', v=1) }}
select * from {{ ref('fct_orders', v=2) }}
select * from {{ ref('fct_orders') }}
```

## Добавление dbt‑задания в downstream‑проект {#add-a-dbt-job-in-the-downstream-project}
Перед продолжением убедитесь, что вы закоммитили и смержили изменения в обоих проектах — “Jaffle | Data Analytics” и “Jaffle | Finance”.

Участник команды Finance хочет запланировать задание <Constant name="cloud" /> для анализа пути клиента по платежам сразу после обновления пайплайнов командой аналитики.

1. В проекте “Jaffle | Finance” перейдите на страницу **Jobs** через **Orchestration** > **Jobs**. 
2. Нажмите **Create job**, затем **Deploy job**.
3. Задайте имя задания и прокрутите вниз до раздела **Job completion**.  
4. В разделе **Triggers** настройте **Run when another job finishes** и выберите upstream‑задание из проекта “Jaffle | Data Analytics”.
<Lightbox src="/img/guides/dbt-mesh/trigger_on_completion.png" title="Запуск задания по завершению другого задания" />

5. Нажмите **Save** и убедитесь, что задание настроено корректно.
6. Перейдите на страницу заданий “Jaffle | Data Analytics”. Выберите **Daily job** и нажмите **Run now**. 
7. После успешного завершения вернитесь на страницу заданий “Jaffle | Finance”. Вы увидите, что задание команды Finance было запущено автоматически.

Это упрощает синхронизацию с upstream‑таблицами и устраняет необходимость в более сложной оркестрации, например, координации заданий между проектами через внешний оркестратор.

## Просмотр предупреждения о выводе версии из эксплуатации {#view-deprecation-warning}

Чтобы узнать, сколько времени у команды Finance есть на миграцию с `fct_orders_v1` на `fct_orders_v2`, выполните следующие шаги:

1. В проекте “Jaffle | Finance” перейдите на страницу **Develop**.
2. Отредактируйте межпроектный `ref`, указав `v=1` в `models/marts/agg_customer_payment_journey.sql`:

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

3. В <Constant name="cloud_ide" /> перейдите в **Version control**, чтобы закоммитить и смержить изменения.
4. Перейдите в **Deploy**, затем на страницу **Jobs**.
5. Нажмите **Run now**, чтобы запустить задание Finance. Модель `agg_customer_payment_journey` будет собрана, и вы увидите предупреждение о дате вывода версии из эксплуатации.

<Lightbox src="/img/guides/dbt-mesh/deprecation_date_warning.png" title="Модель отображает предупреждение о дате вывода версии из эксплуатации." />

## Просмотр lineage с помощью dbt Catalog {#view-lineage-with-dbt-catalog}

Используйте [<Constant name="explorer" />](/docs/explore/explore-projects), чтобы просмотреть lineage между проектами в <Constant name="cloud" />. Перейдите на страницу **Explore** каждого проекта &mdash; теперь вы увидите [lineage, непрерывно связанный между проектами](/docs/explore/explore-multiple-projects).

<Lightbox src="/img/guides/dbt-mesh/jaffle_da_final_lineage.png" width="85%" title="Просмотр lineage проекта 'Jaffle | Data Analytics' в dbt Catalog" />

## Что дальше {#whats-next}

<ConfettiTrigger>

Поздравляем 🎉! Вы готовы внедрять преимущества <Constant name="mesh" /> в вашей организации. Вы узнали:

- Как создать базовый проект “Jaffle | Data Analytics”
- Как создать downstream‑проект “Jaffle | Finance”
- Как реализовать доступ к моделям, версии и контракты
- Как настроить задания <Constant name="cloud" />, запускаемые после завершения upstream‑заданий

Вот несколько дополнительных ресурсов, которые помогут продолжить путь:

- [Как мы строим наши проекты dbt mesh](/best-practices/how-we-mesh/mesh-1-intro)
- [Часто задаваемые вопросы по <Constant name="mesh" />](/best-practices/how-we-mesh/mesh-5-faqs)
- [Реализация <Constant name="mesh" /> с использованием <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs#how-can-i-implement-dbt-mesh-with-the-dbt-semantic-layer)
- [Межпроектные ссылки](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref)
- [<Constant name="explorer" />](/docs/explore/explore-projects)

</ConfettiTrigger>

</div>
