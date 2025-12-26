---
title: "Быстрый старт для dbt Semantic Layer и Snowflake"
id: sl-snowflake-qs
description: "Используйте это руководство, чтобы создавать и определять метрики, настраивать dbt Semantic Layer и выполнять запросы к ним с помощью Google Sheets."
sidebar_label: "Быстрый старт с dbt Semantic Layer и Snowflake"
meta:
  api_name: dbt Semantic Layer APIs
icon: 'guides'
hide_table_of_contents: true
tags: ['Semantic Layer', 'Snowflake', 'dbt platform', 'Quickstart']
keywords: ['dbt Semantic Layer','Metrics','dbt platform', 'Snowflake', 'Google Sheets']
level: 'Intermediate'
---

<!-- The below snippets (or reusables) can be found in the following file locations in the docs code repository) -->
import CreateModel from '/snippets/_sl-create-semanticmodel.md';
import DefineMetrics from '/snippets/_sl-define-metrics.md';
import ConfigMetric from '/snippets/_sl-configure-metricflow.md';
import TestQuery from '/snippets/_sl-test-and-query-metrics.md';
import ConnectQueryAPI from '/snippets/_sl-connect-and-query-api.md';
import RunProdJob from '/snippets/_sl-run-prod-job.md';
import SlSetUp from '/snippets/_new-sl-setup.md'; 

## Введение

[<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), работающий на базе [MetricFlow](/docs/build/about-metricflow), упрощает настройку ключевых бизнес-метрик. Он централизует определения, помогает избегать дублирования кода и обеспечивает простой доступ к метрикам в downstream-инструментах. MetricFlow упрощает управление метриками компании, позволяя определять метрики в вашем dbt-проекте и выполнять к ним запросы в <Constant name="cloud" /> с помощью [команд MetricFlow](/docs/build/metricflow-commands).

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

Этот quickstart рассчитан на пользователей <Constant name="cloud" />, которые используют Snowflake в качестве платформы данных. Он сосредоточен на создании и определении метрик, настройке <Constant name="semantic_layer" /> в проекте <Constant name="cloud" /> и запросах к метрикам в Google Sheets.

Если вы используете другую платформу данных, вы также можете следовать этому руководству — но потребуется адаптировать настройку под конкретную платформу. Подробнее см. в разделе [для пользователей на других платформах](#for-users-on-different-data-platforms).

### Предварительные требования

- Для всех деплоев вам нужна учетная запись [<Constant name="cloud" />](https://www.getdbt.com/signup/) уровня Trial, Starter или Enterprise.
- Убедитесь, что у вас корректная [лицензия <Constant name="cloud" />](/docs/cloud/manage-access/seats-and-users) и [права доступа](/docs/cloud/manage-access/enterprise-permissions) согласно вашему тарифу:
  <DetailsToggle alt_header="Подробнее о лицензии и правах доступа">  
  
  - Enterprise-tier &mdash; Лицензия Developer с правами Account Admin. Либо роль "Owner" с лицензией Developer и назначенными правами Project Creator, Database Admin или Admin.
  - Starter &mdash; Доступ "Owner" с лицензией Developer.
  - Trial &mdash; Автоматический доступ "Owner" в рамках пробного периода тарифа Starter.
  
  </DetailsToggle>

- Создайте [пробный аккаунт Snowflake](https://signup.snowflake.com/):
  - Выберите редакцию Snowflake Enterprise с доступом ACCOUNTADMIN. При выборе облачного провайдера учитывайте вопросы вашей организации и см. Snowflake: [Introduction to Cloud Platforms](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms).
  - Выберите облачного провайдера и регион. Подойдут любые провайдеры и регионы — выбирайте удобные вам.
- Пройдите руководство [Quickstart для <Constant name="cloud" /> и Snowflake](snowflake-qs.md).
- Базовое понимание SQL и dbt. Например, вы уже использовали dbt или прошли курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).


### Для пользователей других платформ данных

Если вы используете платформу данных, отличную от Snowflake, это руководство также применимо. Вы можете адаптировать настройку под свою платформу, следуя инструкциям по созданию учетной записи и загрузке данных, приведенным во вкладках ниже для каждой конкретной платформы.

Остальная часть руководства универсальна для всех поддерживаемых платформ и позволяет в полной мере использовать <Constant name="semantic_layer" />.

<Tabs>

<TabItem value="bq" label="BigQuery">

Откройте новую вкладку и выполните следующие быстрые шаги по настройке учетной записи и загрузке данных:

- [Step 2: Create a new GCP project](/guides/bigquery?step=2)
- [Step 3: Create BigQuery dataset](/guides/bigquery?step=3)
- [Step 4: Generate BigQuery credentials](/guides/bigquery?step=4)
- [Step 5: Connect <Constant name="cloud" /> to BigQuery](/guides/bigquery?step=5)

</TabItem>

<TabItem value="databricks" label="Databricks">

Откройте новую вкладку и выполните следующие быстрые шаги по настройке учетной записи и загрузке данных:

- [Step 2: Create a Databricks workspace](/guides/databricks?step=2)
- [Step 3: Load data](/guides/databricks?step=3)
- [Step 4: Connect <Constant name="cloud" /> to Databricks](/guides/databricks?step=4)

</TabItem>

<TabItem value="msfabric" label="Microsoft Fabric">

Откройте новую вкладку и выполните следующие быстрые шаги по настройке учетной записи и загрузке данных:

- [Step 2: Load data into your Microsoft Fabric warehouse](/guides/microsoft-fabric?step=2)
- [Step 3: Connect <Constant name="cloud" /> to Microsoft Fabric](/guides/microsoft-fabric?step=3)

</TabItem>

<TabItem value="redshift" label="Redshift">

Откройте новую вкладку и выполните следующие быстрые шаги по настройке учетной записи и загрузке данных:

- [Step 2: Create a Redshift cluster](/guides/redshift?step=2)
- [Step 3: Load data](/guides/redshift?step=3)
- [Step 4: Connect <Constant name="cloud" /> to Redshift](/guides/redshift?step=3)

</TabItem>

<TabItem value="starburst" label="Starburst Galaxy">

Откройте новую вкладку и выполните следующие быстрые шаги по настройке учетной записи и загрузке данных:

- [Step 2: Load data to an Amazon S3 bucket](/guides/starburst-galaxy?step=2)
- [Step 3: Connect Starburst Galaxy to Amazon S3 bucket data](/guides/starburst-galaxy?step=3)
- [Step 4: Create tables with Starburst Galaxy](/guides/starburst-galaxy?step=4)
- [Step 5: Connect <Constant name="cloud" /> to Starburst Galaxy](/guides/starburst-galaxy?step=5)

</TabItem>

</Tabs>

## Создайте новый worksheet в Snowflake и настройте окружение

1. Войдите в свой [пробный аккаунт Snowflake](https://signup.snowflake.com).
2. В пользовательском интерфейсе Snowflake (UI) нажмите **+ Worksheet** в правом верхнем углу.
3. Выберите **SQL Worksheet**, чтобы создать новый рабочий лист.

### Настройка и загрузка данных в Snowflake

import LoadData from '/snippets/_load-data.md';

<LoadData/>

  <Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-snowflake-confirm.jpg" width="90%" title="Изображение показывает вывод подтверждения Snowflake, когда данные загружены правильно в редакторе." />

## Подключение dbt к Snowflake

Есть два способа подключить <Constant name="cloud" /> к Snowflake. Первый — Partner Connect, который обеспечивает упрощенную настройку и позволяет создать учетную запись <Constant name="cloud" /> прямо из вашего нового пробного аккаунта Snowflake. Второй — создать учетную запись <Constant name="cloud" /> отдельно и настроить подключение к Snowflake самостоятельно (ручное подключение). Если вы хотите начать как можно быстрее, dbt Labs рекомендует использовать Partner Connect. Если вы хотите с самого начала кастомизировать настройку и лучше познакомиться с процессом настройки <Constant name="cloud" />, dbt Labs рекомендует подключаться вручную.

<Tabs>
<TabItem value="partner-connect" label="Использовать Partner Connect" default>

Использование Partner Connect позволяет создать полноценный аккаунт dbt с вашим [подключением к Snowflake](/docs/cloud/connect-data-platform/connect-snowflake), [managed repository](/docs/cloud/git/managed-repository), [окружениями](/docs/build/custom-schemas#managing-environments) и учетными данными.

1. В интерфейсе Snowflake нажмите на значок Home в левом верхнем углу. В левой боковой панели выберите **Data Products**. Затем выберите **Partner Connect**. Найдите плитку dbt, прокрутив список или выполнив поиск по dbt в строке поиска. Нажмите плитку, чтобы подключиться к dbt.

    <Lightbox src="/img/snowflake_tutorial/snowflake_partner_connect_box.png" width="60%" title="Snowflake Partner Connect Box" />

    Если вы используете классическую версию интерфейса Snowflake, вы можете нажать кнопку **Partner Connect** в верхней панели аккаунта. Затем нажмите плитку dbt, чтобы открыть окно подключения.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_partner_connect.png" title="Snowflake Classic UI - Partner Connect" />

2. Во всплывающем окне **Connect to dbt** найдите опцию **Optional Grant** и выберите базы данных **RAW** и **ANALYTICS**. Это предоставит доступ новой роли пользователя dbt к каждой выбранной базе данных. Затем нажмите **Connect**.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_connection_box.png" title="Snowflake Classic UI - Connection Box" />

    <Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_connection_box.png" title="Snowflake New UI - Connection Box" />

3. Когда появится всплывающее окно, нажмите **Activate**:

<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_activation_window.png" title="Snowflake Classic UI - Actviation Window" />

<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_activation_window.png" title="Snowflake New UI - Activation Window" />

4. После загрузки новой вкладки вы увидите форму. Если вы уже создали учетную запись <Constant name="cloud" />, вас попросят указать имя аккаунта. Если учетная запись еще не создана, вас попросят указать имя аккаунта и пароль.

5. После того как вы заполните форму и нажмете **Complete Registration**, вы автоматически войдете в <Constant name="cloud" />.

6. Нажмите на имя аккаунта в левом меню и выберите **Account settings**, выберите проект "Partner Connect Trial" и в таблице overview выберите **snowflake**. Нажмите **Edit** и обновите поле **Database** на `analytics`, а поле **Warehouse** на `transforming`.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_project_overview.png" title="dbt - Snowflake Project Overview" />

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_update_database_and_warehouse.png" title="dbt - Update Database and Warehouse" />

</TabItem>
<TabItem value="manual-connect" label="Подключить вручную">


1. Создайте новый проект в <Constant name="cloud" />. Перейдите в **Account settings** (нажав на имя аккаунта в левом меню) и нажмите **+ New Project**.
2. Введите имя проекта и нажмите **Continue**.
3. В разделе **Configure your development environment** откройте выпадающее меню **Connection** и выберите **Add new connection**. Это перенаправит вас в настройки конфигурации подключения.
4. В разделе **Type** выберите **Snowflake**.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_setup_snowflake_connection_start.png" title="dbt - Choose Snowflake Connection" />

5. Введите **Settings** для Snowflake:
    * **Account** &mdash; Найдите идентификатор аккаунта, используя URL пробного аккаунта Snowflake и убрав `snowflakecomputing.com`. Порядок частей идентификатора зависит от версии Snowflake. Например, URL Classic Console может выглядеть так: `oq65696.west-us-2.azure.snowflakecomputing.com`. URL AppUI или Snowsight может выглядеть скорее так: `snowflakecomputing.com/west-us-2.azure/oq65696`. В обоих примерах идентификатор аккаунта будет: `oq65696.west-us-2.azure`. Подробнее см. [Account Identifiers](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html) в документации Snowflake.

        <Snippet path="snowflake-acct-name" />
    
    * **Role** &mdash; Пока оставьте пустым. Позже вы можете указать здесь роль Snowflake по умолчанию.
    * **Database** &mdash; `analytics`. Это сообщает dbt, что новые модели нужно создавать в базе данных analytics.
    * **Warehouse** &mdash; `transforming`. Это сообщает dbt, что нужно использовать warehouse transforming, созданный ранее.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_account_settings.png" title="dbt - Snowflake Account Settings" />

6. Нажмите **Save**.
7. Настройте ваши персональные учетные данные для разработки, перейдя в **Your profile** > **Credentials**.
8. Выберите проект, который использует подключение к Snowflake.
9. Нажмите ссылку **configure your development environment and add a connection**. Она перенаправит вас на страницу, где можно ввести персональные учетные данные для разработки.
10. Введите **Development credentials** для Snowflake:
    * **Username** &mdash; Имя пользователя, которое вы создали в Snowflake. Это не ваш email; обычно это имя и фамилия, объединенные в одно слово.
    * **Password** &mdash; Пароль, который вы задали при создании аккаунта Snowflake.
    * **Schema** &mdash; Вы заметите, что имя схемы было создано автоматически. По соглашению это `dbt_<первая-буква-имени><фамилия>`. Это схема, напрямую связанная с вашим окружением разработки, и именно в ней будут собираться ваши модели при запуске dbt в <Constant name="cloud_ide" />.
    * **Target name** &mdash; Оставьте значение по умолчанию.
    * **Threads** &mdash; Оставьте 4. Это количество одновременных подключений, которые <Constant name="cloud" /> будет использовать для параллельной сборки моделей.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt - Snowflake Development Credentials" />

11. Нажмите **Test connection**. Это проверит, что <Constant name="cloud" /> может подключиться к вашему аккаунту Snowflake.
12. Если тест прошел успешно, нажмите **Save**, чтобы завершить настройку. Если он не прошел, возможно, нужно проверить настройки Snowflake и учетные данные.

</TabItem>
</Tabs>

## Настройка dbt‑проекта

В этом разделе вы настроите управляемый репозиторий <Constant name="cloud" /> и инициализируете dbt‑проект, чтобы начать разработку.

### Настройка управляемого репозитория dbt
Если вы использовали Partner Connect, можете перейти сразу к разделу [инициализация dbt‑проекта](#initialize-your-dbt-project-and-start-developing), так как Partner Connect автоматически предоставляет вам [managed repository](/docs/cloud/git/managed-repository). В противном случае вам потребуется создать подключение к репозиторию самостоятельно.

<Snippet path="tutorial-managed-repo" />

### Инициализируйте ваш dbt-проект
В этом руководстве предполагается, что вы используете [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) для разработки dbt-проекта, определения метрик, а также для запросов и предпросмотра метрик с помощью [команд MetricFlow](/docs/build/metricflow-commands).

Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="cloud" /> через <Constant name="cloud_ide" />:

1. Нажмите **Start developing in the <Constant name="cloud_ide" />**. При первом запуске проект может подниматься несколько минут: настраивается подключение к git, клонируется репозиторий и проверяется соединение с warehouse.
2. Слева, над деревом файлов, нажмите **Initialize your project**. Это создаст структуру папок с примерами моделей.
3. Сделайте первый коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit`. Это создаст первый коммит в managed repo и позволит открыть ветку, в которую можно добавлять новый dbt-код.
4. Теперь вы можете выполнять запросы напрямую к вашему warehouse и запускать `dbt run`. Можете попробовать прямо сейчас:
    - Удалите папку `models/examples` в **File <Constant name="explorer" />**.
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить файл:
      ```sql
      select * from raw.jaffle_shop.customers
      ```
    - В командной строке внизу введите `dbt run` и нажмите Enter. Вы должны увидеть сообщение, что `dbt run` завершился успешно.

## Сборка dbt-проекта
Следующий шаг — собрать ваш проект. Это включает добавление sources, staging-моделей, бизнес-определенных сущностей и пакетов в проект.

### Добавьте источники

[Sources](/docs/build/sources) в dbt — это таблицы с сырыми данными, которые вы будете преобразовывать. Организуя определения sources, вы документируете происхождение данных. Это также делает проект и трансформации более надежными, структурированными и понятными.

У вас есть два варианта работы с файлами в <Constant name="cloud_ide" />:

- **Create a new branch (recommended)** &mdash; Создайте новую ветку, чтобы редактировать файлы и коммитить изменения. Перейдите в **Version Control** в левой боковой панели и нажмите **Create branch**.
- **Edit in the protected primary branch** &mdash; Если вы предпочитаете редактировать, форматировать или линтить файлы и выполнять команды dbt прямо в основной git-ветке, используйте этот вариант. <Constant name="cloud_ide" /> не позволяет делать коммиты в защищенную ветку, поэтому вам предложат закоммитить изменения в новую ветку.

Назовите новую ветку `build-project`.

1. Наведите курсор на директорию `models` и нажмите меню с тремя точками (**...**), затем выберите **Create file**.
2. Назовите файл `staging/jaffle_shop/src_jaffle_shop.yml`, затем нажмите **Create**.
3. Скопируйте следующий текст в файл и нажмите **Save**.

<File name='models/staging/jaffle_shop/src_jaffle_shop.yml'>

```yaml

sources:
 - name: jaffle_shop
   database: raw
   schema: jaffle_shop
   tables:
     - name: customers
     - name: orders
```

</File>

:::tip
В source-файле вы также можете использовать кнопку **Generate model**, чтобы создать отдельный файл модели для каждого source. Это создаст новый файл в директории `models` с указанным именем source и заполнит его SQL-кодом определения source.
:::

4. Наведите курсор на директорию `models` и нажмите меню с тремя точками (**...**), затем выберите **Create file**.
5. Назовите файл `staging/stripe/src_stripe.yml`, затем нажмите **Create**.
6. Скопируйте следующий текст в файл и нажмите **Save**.

<File name='models/staging/stripe/src_stripe.yml'>

```yaml

sources:
 - name: stripe
   database: raw
   schema: stripe
   tables:
     - name: payment
```
</File>

### Добавьте staging-модели
[Staging models](/best-practices/how-we-structure/2-staging) — это первый шаг трансформации в dbt. Они очищают и подготавливают сырые данные, чтобы они были готовы для более сложных трансформаций и аналитики. Следуйте этим шагам, чтобы добавить staging-модели в ваш проект.

1. В подкаталоге `jaffle_shop` создайте файл `stg_customers.sql`. Либо вы можете использовать кнопку **Generate model**, чтобы создать отдельный файл модели для каждого source.
2. Скопируйте следующий запрос в файл и нажмите **Save**.

<File name='models/staging/jaffle_shop/stg_customers.sql'>

```sql
  select
   id as customer_id,
   first_name,
   last_name
from {{ source('jaffle_shop', 'customers') }}
```

</File>

3. В том же подкаталоге `jaffle_shop` создайте файл `stg_orders.sql`.
4. Скопируйте следующий запрос в файл и нажмите **Save**.

<File name='models/staging/jaffle_shop/stg_orders.sql'>

```sql
  select
    id as order_id,
    user_id as customer_id,
    order_date,
    status
  from {{ source('jaffle_shop', 'orders') }}
```

</File>

5. В подкаталоге `stripe` создайте файл `stg_payments.sql`.
6. Скопируйте следующий запрос в файл и нажмите **Save**.

<File name='models/staging/stripe/stg_payments.sql'>

```sql
select
   id as payment_id,
   orderid as order_id,
   paymentmethod as payment_method,
   status,
   -- amount is stored in cents, convert it to dollars
   amount / 100 as amount,
   created as created_at


from {{ source('stripe', 'payment') }}
```

</File>

7. Enter `dbt run` in the command prompt at the bottom of the screen. You should get a successful run and see the three models.

### Добавьте бизнес-определенные сущности

Этот этап включает создание [моделей, которые служат entity layer (слоем сущностей) или concept layer (концептуальным слоем) вашего dbt-проекта](/best-practices/how-we-structure/4-marts), подготавливая данные для отчетности и анализа. Также он включает добавление [пакетов](/docs/build/packages) и [time spine MetricFlow](/docs/build/metricflow-time-spine), которые расширяют функциональность dbt.

Этот этап — [слой marts](/best-practices/how-we-structure/1-guide-overview#guide-structure-overview), который объединяет модульные части в широкое, насыщенное представление сущностей, важных для организации.

1. Создайте файл `models/marts/fct_orders.sql`.
2. Скопируйте следующий запрос в файл и нажмите **Save**.

<File name='models/marts/fct_orders.sql'>

```sql
with orders as  (
   select * from {{ ref('stg_orders' )}}
),


payments as (
   select * from {{ ref('stg_payments') }}
),


order_payments as (
   select
       order_id,
       sum(case when status = 'success' then amount end) as amount


   from payments
   group by 1
),


final as (


   select
       orders.order_id,
       orders.customer_id,
       orders.order_date,
       coalesce(order_payments.amount, 0) as amount


   from orders
   left join order_payments using (order_id)
)


select * from final

```

</File>

3. В директории `models/marts` создайте файл `dim_customers.sql`.
4. Скопируйте следующий запрос в файл и нажмите **Save**.

<File name='models/marts/dim_customers.sql'>

```sql
with customers as (
   select * from {{ ref('stg_customers')}}
),
orders as (
   select * from {{ ref('fct_orders')}}
),
customer_orders as (
   select
       customer_id,
       min(order_date) as first_order_date,
       max(order_date) as most_recent_order_date,
       count(order_id) as number_of_orders,
       sum(amount) as lifetime_value
   from orders
   group by 1
),
final as (
   select
       customers.customer_id,
       customers.first_name,
       customers.last_name,
       customer_orders.first_order_date,
       customer_orders.most_recent_order_date,
       coalesce(customer_orders.number_of_orders, 0) as number_of_orders,
       customer_orders.lifetime_value
   from customers
   left join customer_orders using (customer_id)
)
select * from final
```

</File>

5. Создайте модель time spine для MetricFlow, следуя руководству [MetricFlow time spine guide](/guides/mf-time-spine?step=1). В этом руководстве показано, как создать и SQL-модель, и YAML-конфигурацию, необходимые для вычисления метрик на основе времени.

6. Введите `dbt run` в командной строке внизу экрана. Вы должны увидеть сообщение об успешном выполнении, а в деталях запуска — что dbt успешно собрал ваши модели.

## Создайте семантические модели

В этом разделе вы узнаете о [semantic model](/guides/sl-snowflake-qs?step=6#about-semantic-models), [их компонентах](/guides/sl-snowflake-qs?step=6#semantic-model-components) и [о том, как настроить time spine](/guides/sl-snowflake-qs?step=6#configure-a-time-spine).


### О семантических моделях

[Semantic models](/docs/build/semantic-models) содержат множество типов объектов (например, entities, measures и dimensions), которые позволяют MetricFlow формировать запросы для определений метрик.

- Каждая semantic model находится в соотношении 1:1 с dbt-моделью SQL/Python.
- Каждая semantic model содержит (максимум) 1 primary или natural entity.
- Каждая semantic model содержит ноль, одну или несколько foreign или unique entities, используемых для связей с другими сущностями.
- Каждая semantic model также может содержать dimensions, measures и metrics. Именно это затем передается и запрашивается вашим downstream BI-инструментом.

В следующих шагах semantic models помогут вам определить, как интерпретировать данные, связанные с заказами (orders). Это включает entities (например, ID-колонки, которые служат ключами для объединения данных), dimensions (для группировки или фильтрации данных) и measures (для агрегаций данных).

1. В подкаталоге `metrics` создайте новый файл `fct_orders.yml`.

:::tip 
Убедитесь, что вы сохраняете все semantic models и metrics в директории, указанной в [`model-paths`](/reference/project-configs/model-paths) (или в ее поддиректории, например `models/semantic_models/`). Если сохранить их вне этого пути, файл `semantic_manifest.json` окажется пустым, и ваши semantic models или metrics не будут распознаны.
:::

2. Добавьте следующий код в только что созданный файл:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
```

</File>

### Компоненты семантической модели

В следующих разделах более подробно объясняются [dimensions](/docs/build/dimensions), [entities](/docs/build/entities) и [measures](/docs/build/measures), а также показано, какую роль каждый из них играет в семантических моделях.

- [Entities](#entities) выступают уникальными идентификаторами (например, ID-колонками), которые связывают данные из разных таблиц.
- [Dimensions](#dimensions) классифицируют и фильтруют данные, упрощая их организацию.
- [Measures](#measures) вычисляют показатели по данным, предоставляя ценные инсайты через агрегации.


### Entities

[Entities](/docs/build/semantic-models#entities) — это понятие из реального мира бизнеса, которое служит основой вашей семантической модели. В наших semantic models это будут ID-колонки (например, `order_id`). Они будут выступать ключами для join с другими semantic models.

Добавьте entities в файл семантической модели `fct_orders.yml`:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
    # Newly added
    entities: 
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
```

</File>

### Dimensions

[Dimensions](/docs/build/semantic-models#entities) — это способ группировать или фильтровать информацию по категориям или по времени.

Добавьте dimensions в файл семантической модели `fct_orders.yml`:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
    entities:
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
    # Newly added
    dimensions:   
      - name: order_date
        type: time
        type_params:
          time_granularity: day
```

</File>

### Measures

[Measures](/docs/build/semantic-models#measures) — это агрегации, выполняемые над колонками в вашей модели. Часто вы будете использовать их как конечные метрики. Measures также могут служить строительными блоками для более сложных метрик.

Добавьте measures в файл семантической модели `fct_orders.yml`:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
    entities:
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
    dimensions:
      - name: order_date
        type: time
        type_params:
          time_granularity: day
    # Newly added      
    measures:   
      - name: order_total
        description: The total amount for each order including taxes.
        agg: sum
        expr: amount
      - name: order_count
        expr: 1
        agg: sum
      - name: customers_with_orders
        description: Distinct count of customers placing orders
        agg: count_distinct
        expr: customer_id
      - name: order_value_p99 ## The 99th percentile order value
        expr: amount
        agg: percentile
        agg_params:
          percentile: 0.99
          use_discrete_percentile: True
          use_approximate_percentile: False
```

</File>

### Настройте time spine

Чтобы обеспечить точные агрегации по времени, необходимо настроить [time spine](/docs/build/metricflow-time-spine). Time spine позволяет корректно рассчитывать метрики на разных временных гранулярностях.

Следуйте руководству [MetricFlow time spine guide](/guides/mf-time-spine?step=1) с полными пошаговыми инструкциями по созданию и настройке модели time spine. В этом руководстве приведены актуальные best practices и исключены устаревшие конфигурации.

## Определите метрики и добавьте вторую семантическую модель

В этом разделе вы [определите метрики](#define-metrics) и [добавите в проект вторую семантическую модель](#add-second-semantic-model-to-your-project).

### Определите метрики

[Metrics](/docs/build/metrics-overview) — это язык, на котором говорят бизнес-пользователи, и способ измерять эффективность бизнеса. Метрика — это агрегация над колонкой в вашем warehouse, которую вы обогащаете измерениями (dimensional cuts).

Существует несколько типов метрик, которые можно настроить:

- [Conversion metrics](/docs/build/conversion) &mdash; Отслеживают, когда для сущности происходит базовое событие и последующее событие-конверсия в пределах заданного периода времени.
- [Cumulative metrics](/docs/build/cumulative) &mdash; Агрегируют measure в рамках заданного окна. Если окно не задано, окно будет накапливать measure за весь зафиксированный период. Обратите внимание: перед добавлением cumulative metrics необходимо создать модель time spine.
- [Derived metrics](/docs/build/metrics-overview#derived-metrics) &mdash; Позволяют выполнять вычисления поверх метрик.
- [Simple metrics](/docs/build/metrics-overview#simple-metrics) &mdash; Напрямую ссылаются на один measure без дополнительных measures.
- [Ratio metrics](/docs/build/metrics-overview#ratio-metrics) &mdash; Состоят из метрики-числителя и метрики-знаменателя. Constraint string можно применить и к числителю, и к знаменателю, либо отдельно к числителю или знаменателю.

После того как вы создали semantic models, пора начать использовать созданные вами measures, чтобы определить метрики:

1. Добавьте metrics в файл семантической модели `fct_orders.yml`:

:::tip 
Убедитесь, что вы сохраняете все semantic models и metrics в директории, указанной в [`model-paths`](/reference/project-configs/model-paths) (или в ее поддиректории, например `models/semantic_models/`). Если сохранить их вне этого пути, файл `semantic_manifest.json` окажется пустым, и ваши semantic models или metrics не будут распознаны.
:::

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order
    model: ref('fct_orders')
    entities:
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
    dimensions:
      - name: order_date
        type: time
        type_params:
          time_granularity: day
    measures:
      - name: order_total
        description: The total amount for each order including taxes.
        agg: sum
        expr: amount
      - name: order_count
        expr: 1
        agg: sum
      - name: customers_with_orders
        description: Distinct count of customers placing orders
        agg: count_distinct
        expr: customer_id
      - name: order_value_p99
        expr: amount
        agg: percentile
        agg_params:
          percentile: 0.99
          use_discrete_percentile: True
          use_approximate_percentile: False
# Newly added          
metrics: 
  # Simple type metrics
  - name: "order_total"
    description: "Sum of orders value"
    type: simple
    label: "order_total"
    type_params:
      measure:
        name: order_total
  - name: "order_count"
    description: "number of orders"
    type: simple
    label: "order_count"
    type_params:
      measure:
        name: order_count
  - name: large_orders
    description: "Count of orders with order total over 20."
    type: simple
    label: "Large Orders"
    type_params:
      measure:
        name: order_count
    filter: |
      {{ Metric('order_total', group_by=['order_id']) }} >=  20
  # Ratio type metric
  - name: "avg_order_value"
    label: "avg_order_value"
    description: "average value of each order"
    type: ratio
    type_params:
      numerator: 
        name: order_total
      denominator: 
        name: order_count
  # Cumulative type metrics
  - name: "cumulative_order_amount_mtd"
    label: "cumulative_order_amount_mtd"
    description: "The month to date value of all orders"
    type: cumulative
    type_params:
      measure:
        name: order_total
      cumulative_type_params:
        grain_to_date: month
  # Derived metric
  - name: "pct_of_orders_that_are_large"
    label: "pct_of_orders_that_are_large"
    description: "percent of orders that are large"
    type: derived
    type_params:
      expr: large_orders/order_count
      metrics:
        - name: large_orders
        - name: order_count
```

</File>

### Добавьте в проект вторую семантическую модель

Отлично — вы успешно создали свою первую семантическую модель! В ней есть все необходимые элементы: entities, dimensions, measures и metrics.

Давайте расширим аналитические возможности проекта, добавив еще одну семантическую модель для другой модели слоя marts, например `dim_customers.yml`.

После настройки модели orders:

1. В подкаталоге `metrics` создайте файл `dim_customers.yml`.
2. Скопируйте следующий запрос в файл и нажмите **Save**.

<File name='models/metrics/dim_customers.yml'>

```yaml
semantic_models:
  - name: customers
    defaults:
      agg_time_dimension: most_recent_order_date
    description: |
      semantic model for dim_customers
    model: ref('dim_customers')
    entities:
      - name: customer
        expr: customer_id
        type: primary
    dimensions:
      - name: customer_name
        type: categorical
        expr: first_name
      - name: first_order_date
        type: time
        type_params:
          time_granularity: day
      - name: most_recent_order_date
        type: time
        type_params:
          time_granularity: day
    measures:
      - name: count_lifetime_orders
        description: Total count of orders per customer.
        agg: sum
        expr: number_of_orders
      - name: lifetime_spend
        agg: sum
        expr: lifetime_value
        description: Gross customer lifetime spend inclusive of taxes.
      - name: customers
        expr: customer_id
        agg: count_distinct

metrics:
  - name: "customers_with_orders"
    label: "customers_with_orders"
    description: "Unique count of customers placing orders"
    type: simple
    type_params:
      measure:
        name: customers
```

</File>

Эта семантическая модель использует простые метрики, чтобы сфокусироваться на метриках клиентов, и делает акцент на клиентских измерениях, таких как имя, тип и даты заказов. Она позволяет детально анализировать поведение клиентов, lifetime value и паттерны заказов.

## Тестируйте и запрашивайте метрики

<!-- Приведенные ниже snippets (или reusables) можно найти в репозитории документации по следующим путям:

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-test-and-query-metrics.md
-->

<TestQuery />

## Запустите production job

<!-- Приведенные ниже snippets (или reusables) можно найти в репозитории документации по следующим путям:

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-run-prod-job.md
-->

<RunProdJob/>


## Администрирование Semantic Layer

В этом разделе вы узнаете, как добавить учетные данные и создать service tokens, чтобы начать выполнять запросы к dbt <Constant name="semantic_layer" />. Раздел охватывает следующие темы:

- [Выбор окружения](#1-select-environment)
- [Настройка учетных данных и создание токенов](#2-configure-credentials-and-create-tokens)
- [Просмотр деталей подключения](#3-view-connection-detail)
- [Добавление дополнительных учетных данных](#4-add-more-credentials)
- [Удаление конфигурации](#delete-configuration)

<!-- Приведенные ниже snippets (или reusables) можно найти в репозитории документации по следующим путям:

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_new-sl-setup.md
-->

<SlSetUp/>

## Запросы к Semantic Layer

Эта страница подскажет, как подключиться и использовать следующие интеграции для выполнения запросов к вашим метрикам:

- [Подключение и запросы через Google Sheets](#connect-and-query-with-google-sheets)
- [Подключение и запросы через Hex](#connect-and-query-with-hex)
- [Подключение и запросы через Sigma](#connect-and-query-with-sigma)
  
<Constant name="semantic_layer" /> позволяет подключаться и выполнять запросы к метрикам с помощью различных инструментов, например [PowerBI](/docs/cloud-integrations/semantic-layer/power-bi), [Google Sheets](/docs/cloud-integrations/semantic-layer/gsheets), [Hex](https://learn.hex.tech/docs/connect-to-data/data-connections/dbt-integration#dbt-semantic-layer-integration), [Microsoft Excel](/docs/cloud-integrations/semantic-layer/excel), [Tableau](/docs/cloud-integrations/semantic-layer/tableau) и других.

Выполняйте запросы к метрикам и через другие инструменты, такие как [first-class integrations](/docs/cloud-integrations/avail-sl-integrations), [API <Constant name="semantic_layer" />](/docs/dbt-cloud-apis/sl-api-overview) и [exports](/docs/use-dbt-semantic-layer/exports), чтобы публиковать таблицы метрик и измерений в вашей платформе данных и создавать кастомные интеграции.

 ### Подключение и запросы через Google Sheets

<!-- Приведенный ниже snippet для gsheets (или reusables) можно найти в репозитории документации по следующему пути:

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-connect-and-query-api.md
-->

<ConnectQueryAPI/>

### Подключение и запросы через Hex
В этом разделе описано, как использовать интеграцию Hex для запросов к вашим метрикам через Hex. Выберите подходящую вкладку в зависимости от способа подключения:

<Tabs>
<TabItem value="partner-connect" label="Запросы к Semantic Layer через Hex" default>

1. Перейдите на [страницу входа Hex](https://app.hex.tech/login).
2. Войдите или зарегистрируйтесь (если у вас еще нет аккаунта).
  - Можно создать бесплатный пробный аккаунт Hex, используя рабочую почту или адрес с доменом .edu.
3. В левом верхнем углу страницы нажмите на иконку **HEX**, чтобы перейти на главную страницу.
4. Затем нажмите кнопку **+ New project** в правом верхнем углу.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_new.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>
5. В меню слева выберите **Data browser**. Затем выберите **Add a data connection**.
6. Нажмите **Snowflake**. Укажите имя и описание подключения. Вам не нужны учетные данные к data warehouse, чтобы использовать <Constant name="semantic_layer" />.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_new_data_connection.png" width="50%" title="Выберите 'Data browser', затем 'Add a data connection', чтобы подключиться к Snowflake."/>
7. В разделе **Integrations** переведите переключатель dbt вправо, чтобы включить интеграцию dbt.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_dbt_toggle.png" width="50%" title="Нажмите переключатель dbt, чтобы включить интеграцию."/>

8. Введите следующую информацию:
   * Выберите версию dbt 1.6 или выше
   * Введите ваш Environment ID
   * Введите ваш service token или personal token
   * Обязательно включите переключатель **Use <Constant name="semantic_layer" />** — так все запросы будут маршрутизироваться через dbt
   * Нажмите **Create connection** в правом нижнем углу
9. Наведите курсор на **More** в меню, показанном на изображении ниже, и выберите **<Constant name="semantic_layer" />**.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_make_sl_cell.png" width="90%" title="Наведите курсор на 'More' и выберите 'dbt Semantic Layer'."/>

10. Теперь вы можете выполнять запросы к метрикам в Hex! Попробуйте:
    - Создайте новую ячейку и выберите метрику.
    - Отфильтруйте ее по одному или нескольким измерениям.
    - Создайте визуализацию.

</TabItem>
<TabItem value="manual-connect" label="Воркшоп Getting started with the Semantic Layer">

1. Нажмите на ссылку, которую вам дали в чате воркшопа.
   - Если сразу не видите, проверьте раздел **Pinned message** в чате.
2. Введите ваш email в поле ввода. Затем выберите **SQL and Python**, чтобы перейти на главную страницу Hex.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/welcome_to_hex.png" width="70%" title="Главная страница 'Welcome to Hex'."/>

3. Затем нажмите фиолетовую кнопку Hex в левом верхнем углу.
4. В меню слева нажмите **Collections**.
5. Выберите коллекцию **<Constant name="semantic_layer" /> Workshop**.
6. Откройте коллекцию проектов **Getting started with the <Constant name="semantic_layer" />**.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_collections.png" width="80%" title="Нажмите 'Collections', чтобы выбрать коллекцию 'Semantic Layer Workshop'."/>

7. Чтобы редактировать этот ноутбук Hex, нажмите **Duplicate** в выпадающем меню проекта (как показано на изображении). Это создаст новую копию ноутбука Hex, которой вы будете владеть.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_duplicate.png" width="80%" title="Нажмите 'Duplicate' в меню проекта, чтобы создать копию ноутбука Hex."/>

8. Чтобы копию было проще найти, переименуйте ее, добавив ваше имя.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_rename.png" width="60%" title="Переименуйте Hex-проект, добавив ваше имя."/>

9. Теперь вы можете выполнять запросы к метрикам в Hex! Попробуйте на примерах:

   - В первой ячейке показана таблица метрики `order_total` по времени. Добавьте в эту таблицу метрику `order_count`.
   - Во второй ячейке показан линейный график метрики `order_total` по времени. Поэкспериментируйте с графиком — попробуйте изменить time grain с помощью выпадающего меню **Time unit**.
   - Следующая таблица в ноутбуке с названием “Example_query_2” показывает количество клиентов, сделавших свой первый заказ в определенный день. Создайте новую chart-ячейку. Постройте линейный график `first_ordered_at` vs `customers`, чтобы увидеть, как меняется число новых клиентов по дням.
   - Создайте новую ячейку semantic layer и выберите одну или несколько метрик. Отфильтруйте метрику(и) по одному или нескольким измерениям.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_make_sl_cell.png" width="90%" title="Запрос метрик через Hex"/>

</TabItem>
</Tabs>

### Подключение и запросы через Sigma
В этом разделе показано, как использовать интеграцию Sigma для запросов к вашим метрикам через Sigma. Если у вас уже есть аккаунт Sigma, просто войдите и перейдите к шагу 6. В противном случае вы будете использовать аккаунт Sigma, который создадите через Snowflake Partner Connect.

1. Вернитесь в ваш аккаунт Snowflake. В интерфейсе Snowflake нажмите на значок Home в левом верхнем углу. В левой боковой панели выберите **Data Products**. Затем выберите **Partner Connect**. Найдите плитку Sigma, прокрутив список или выполнив поиск по Sigma в строке поиска. Нажмите плитку, чтобы подключиться к Sigma.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-sigma-partner-connect.png" width="25%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

2. Выберите плитку Sigma из списка. Откройте выпадающее меню **Optional Grant**. Введите **RAW** и **ANALYTICS** в текстовое поле, затем нажмите **Connect**.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-sigma-optional-grant.png" width="60%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

3. Придумайте название компании и URL. Какой именно URL — не важно, главное, чтобы он был уникальным.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-sigma-company-name.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

4. Введите ваше имя и email. Задайте пароль для аккаунта.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-sigma-create-profile.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

5. Отлично! Теперь у вас есть аккаунт Sigma. Прежде чем начать, вернитесь в Snowflake и откройте пустой worksheet. Выполните следующие строки:
- `grant all privileges on all views in schema analytics.SCHEMA to role pc_sigma_role;`
- `grant all privileges on all tables in schema analytics.SCHEMA to role pc_sigma_role;`

6. Нажмите на вашу иконку (bubble) в правом верхнем углу. В выпадающем меню выберите **Administration**.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-sigma-admin.png" width="40%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

7. Прокрутите вниз до раздела integrations и нажмите **Add** рядом с интеграцией dbt.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-sigma-add-integration.png" width="70%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

8. В разделе **dbt Integration** заполните обязательные поля и нажмите save:
- Ваш dbt [service account token](/docs/dbt-cloud-apis/service-tokens) или [personal access tokens](/docs/dbt-cloud-apis/user-tokens).
- Ваш access URL для существующей интеграции Sigma с dbt. Используйте `cloud.getdbt.com` как access URL.
- Ваш dbt Environment ID.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-sigma-add-info.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

9. Вернитесь на главную страницу Sigma. Создайте новый workbook.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-sigma-make-workbook.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

10. Нажмите **Table**, затем нажмите **SQL**. Выберите Snowflake `PC_SIGMA_WH` в качестве подключения к данным.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-sigma-make-table.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

11. Теперь выполните запрос к рабочей метрике в вашем проекте! Например, допустим, у вас есть метрика, которая измеряет различные значения, связанные с заказами. Вот как вы могли бы выполнить запрос:

```sql
select * from
  {{ semantic_layer.query (
    metrics = ['order_total', 'order_count', 'large_orders', 'customers_with_orders', 'avg_order_value', 'pct_of_orders_that_are_large'],
    group_by = 
    [Dimension('metric_time').grain('day') ]
) }}
```

## Что дальше

<ConfettiTrigger>

Отличная работа — вы завершили подробное руководство по <Constant name="semantic_layer" />! Надеемся, теперь у вас есть четкое понимание того, что такое <Constant name="semantic_layer" />, зачем он нужен и когда его использовать в ваших проектах.

Вы научились:

- Настраивать окружение Snowflake и <Constant name="cloud" />, включая создание worksheets и загрузку данных.
- Подключать и настраивать <Constant name="cloud" /> для работы со Snowflake.
- Собирать, тестировать и управлять проектами <Constant name="cloud" />, уделяя внимание метрикам и семантическому слою.
- Запускать production jobs и выполнять запросы к метрикам через доступные интеграции.

В качестве следующих шагов вы можете начать определять собственные метрики и изучить дополнительные опции конфигурации, такие как [exports](/docs/use-dbt-semantic-layer/exports), [заполнение null-значений](/docs/build/advanced-topics), [внедрение <Constant name="mesh" /> с помощью <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs#how-can-i-implement-dbt-mesh-with-the-dbt-semantic-layer) и другие.

Вот несколько дополнительных ресурсов, которые помогут вам продолжить путь:

- [FAQ по <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs)
- [Доступные интеграции](/docs/cloud-integrations/avail-sl-integrations)
- Демо: [как определять метрики и выполнять к ним запросы с MetricFlow](https://www.loom.com/share/60a76f6034b0441788d73638808e92ac?sid=861a94ac-25eb-4fd8-a310-58e159950f5a)
- [Присоединяйтесь к нашим live-демо](https://www.getdbt.com/resources/webinars/dbt-cloud-demos-with-experts)

</ConfettiTrigger>
