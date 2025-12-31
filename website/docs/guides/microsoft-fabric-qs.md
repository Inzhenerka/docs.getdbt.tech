---
title: "Быстрый старт для dbt и Microsoft Fabric"
id: "microsoft-fabric"
level: 'Beginner'
icon: 'fabric'
hide_table_of_contents: true
tags: ['Platform', 'Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом кратком руководстве вы узнаете, как использовать <Constant name="cloud" /> с [Microsoft Fabric](https://www.microsoft.com/en-us/microsoft-fabric). В нём показано, как:

- Загрузить пример данных Jaffle Shop (предоставляется dbt Labs) в хранилище Microsoft Fabric.  
- Подключить <Constant name="cloud" /> к Microsoft Fabric.  
- Превратить пример запроса в модель в вашем dbt‑проекте. Модель в dbt — это SQL‑выражение `SELECT`.  
- Добавить тесты к вашим моделям.  
- Задокументировать ваши модели.  
- Запланировать выполнение задания (job).

### Предварительные требования {#prerequisites}
- У вас есть аккаунт [<Constant name="cloud" />](https://www.getdbt.com/signup/).  
- Вы запустили пробный период Microsoft Fabric (Preview). Подробнее см. [Microsoft Fabric (Preview) trial](https://learn.microsoft.com/en-us/fabric/get-started/fabric-trial) в документации Microsoft.  
- Как администратор Microsoft, вы включили аутентификацию с использованием service principal. Необходимо добавить service principal в рабочее пространство Microsoft Fabric с правами Member (рекомендуется) или Admin. Также service principal должен иметь привилегии `CONNECT` к базе данных в хранилище. Подробнее см. [Enable service principal authentication](https://learn.microsoft.com/en-us/fabric/admin/metadata-scanning-enable-read-only-apis) в документации Microsoft. <Constant name="cloud" /> использует эти учётные данные аутентификации для подключения к Microsoft Fabric.

### Связанные материалы {#related-content}
- [Курсы dbt Learn](https://learn.getdbt.com)
- [О заданиях непрерывной интеграции](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Актуальность источников](/docs/deploy/source-freshness)

## Загрузка данных в ваш склад Microsoft Fabric {#load-data-into-your-microsoft-fabric-warehouse}

1. Войдите в свой аккаунт [Microsoft Fabric](http://app.fabric.microsoft.com).  
2. На главной странице выберите плитку **Synapse Data Warehouse**.

    <Lightbox src="/img/quickstarts/dbt-cloud/example-start-fabric.png" width="80%" title="Пример плитки Synapse Data Warehouse" />

3. В разделе **Workspaces** на левой боковой панели перейдите в рабочее пространство вашей организации. Или вы можете создать новое рабочее пространство; для получения подробной информации обратитесь к [Create a workspace](https://learn.microsoft.com/en-us/fabric/get-started/create-workspaces) в документации Microsoft.
4. Выберите ваш склад из таблицы. Или вы можете создать новый склад; для получения подробной информации обратитесь к [Create a warehouse](https://learn.microsoft.com/en-us/fabric/data-warehouse/tutorial-create-warehouse) в документации Microsoft.
5. Откройте SQL-редактор, выбрав **New SQL query** на верхней панели.
6. Скопируйте эти операторы в SQL-редактор, чтобы загрузить пример данных Jaffle Shop:

    ```sql
    DROP TABLE dbo.customers;

    CREATE TABLE dbo.customers
    (
        [ID] [int],
        \[FIRST_NAME] [varchar](8000),
        \[LAST_NAME] [varchar](8000)
    );

    COPY INTO [dbo].[customers]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/jaffle_shop_customers.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );

    DROP TABLE dbo.orders;

    CREATE TABLE dbo.orders
    (
        [ID] [int],
        [USER_ID] [int],
        -- [ORDER_DATE] [int],
        [ORDER_DATE] [date],
        \[STATUS] [varchar](8000)
    );

    COPY INTO [dbo].[orders]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/jaffle_shop_orders.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );

    DROP TABLE dbo.payments;

    CREATE TABLE dbo.payments
    (
        [ID] [int],
        [ORDERID] [int],
        \[PAYMENTMETHOD] [varchar](8000),
        \[STATUS] [varchar](8000),
        [AMOUNT] [int],
        [CREATED] [date]
    );

    COPY INTO [dbo].[payments]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/stripe_payments.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );
    ```

    <Lightbox src="/img/quickstarts/dbt-cloud/example-load-data-ms-fabric.png" width="80%" title="Пример загрузки данных" />

## Подключение dbt к Microsoft Fabric {#connect-dbt-to-microsoft-fabric}

1. Создайте новый проект в <Constant name="cloud" />. Перейдите в **Account settings** (кликнув по имени вашего аккаунта в меню слева) и нажмите **+ New Project**.
2. Введите имя проекта и нажмите **Continue**.
3. Выберите **Fabric** в качестве типа подключения и нажмите **Next**.
4. В разделе **Configure your environment** укажите **Settings** для нового проекта:
    - **Server** — используйте значение **host** сервисного принципала для тестового endpoint Microsoft Fabric.
    - **Port** — 1433 (значение по умолчанию).
    - **Database** — используйте значение **database** сервисного принципала для тестового endpoint Microsoft Fabric.
5. Укажите **Development credentials** для нового проекта:
    - **Authentication** — выберите **Service Principal** из выпадающего списка.
    - **Tenant ID** — используйте значение **Directory (tenant) id** сервисного принципала.
    - **Client ID** — используйте значение **application (client) ID id** сервисного принципала.
    - **Client secret** — используйте **client secret** сервисного принципала (не **client secret id**).
6. Нажмите **Test connection**. Это проверит, что <Constant name="cloud" /> может получить доступ к вашему аккаунту Microsoft Fabric.
7. Когда тест завершится успешно, нажмите **Next**. Если тест не прошёл, проверьте настройки сервисного принципала. Убедитесь, что у принципала есть привилегии `CONNECT` к базе данных в warehouse.

## Настройка управляемого репозитория dbt {#set-up-a-dbt-managed-repository}
<Snippet path="tutorial-managed-repo" />

## Инициализация проекта dbt и начало разработки {#initialize-your-dbt-project-and-start-developing}
Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="cloud" />:

1. Нажмите **Start developing in the <Constant name="cloud_ide" />**. При первом запуске это может занять несколько минут: в это время устанавливается подключение к git, клонируется репозиторий и проверяется соединение с warehouse.
2. Над деревом файлов слева нажмите **Initialize dbt project**. Это создаст структуру каталогов с примерами моделей.
3. Сделайте первый коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit` и нажмите **Commit**. Это создаст первый коммит в управляемом репозитории и позволит открыть ветку, в которой вы сможете добавлять новый dbt‑код.
4. Теперь вы можете напрямую выполнять запросы к данным в вашем warehouse и запускать `dbt run`. Можете попробовать это прямо сейчас:
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели {#build-your-first-model}

У вас есть два варианта работы с файлами в <Constant name="cloud_ide" />:

- **Create a new branch (recommended)** &mdash; Создайте новую ветку, чтобы редактировать файлы и коммитить изменения. Перейдите в **Version Control** на левой боковой панели и нажмите **Create branch**.
- **Edit in the protected primary branch** &mdash; Если вы предпочитаете редактировать, форматировать или линтить файлы, а также выполнять команды dbt напрямую в основной git-ветке. <Constant name="cloud_ide" /> не позволяет делать коммиты в защищённую ветку, поэтому вам будет предложено закоммитить изменения в новую ветку.

Назовите новую ветку `add-customers-model`.

1. Нажмите **...** рядом с каталогом `models`, затем выберите **Create file**.  
2. Назовите файл `dim_customers.sql`, затем нажмите **Create**.  
3. Скопируйте следующий запрос в файл и нажмите **Save**.

    <File name='dim_customers.sql'>

    ```sql
    with customers as (

    select
        ID as customer_id,
        FIRST_NAME as first_name,
        LAST_NAME as last_name

    from dbo.customers
    ),

    orders as (

        select
            ID as order_id,
            USER_ID as customer_id,
            ORDER_DATE as order_date,
            STATUS as status

        from dbo.orders
    ),

    customer_orders as (

        select
            customer_id,

            min(order_date) as first_order_date,
            max(order_date) as most_recent_order_date,
            count(order_id) as number_of_orders

        from orders

        group by customer_id
    ),

    final as (

        select
            customers.customer_id,
            customers.first_name,
            customers.last_name,
            customer_orders.first_order_date,
            customer_orders.most_recent_order_date,
            coalesce(customer_orders.number_of_orders, 0) as number_of_orders

        from customers

        left join customer_orders on customers.customer_id = customer_orders.customer_id
    )

    select * from final
    ```
    </File>

4. Введите `dbt run` в командной строке внизу экрана. Вы должны получить успешное выполнение и увидеть три модели.

Позже вы сможете подключить ваши инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не сырые данные в вашем инструменте BI.

#### Часто задаваемые вопросы {#faqs}

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

## Изменение способа материализации вашей модели {#change-the-way-your-model-is-materialized}

<Snippet path="quickstarts/change-way-model-materialized" />

## Удаление примерных моделей {#delete-the-example-models}

<Snippet path="quickstarts/delete-example-models" />

## Создание моделей на основе других моделей {#build-models-on-top-of-other-models}

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте новый SQL-файл, `models/stg_customers.sql`, с SQL из CTE `customers` в нашем исходном запросе.
2. Создайте второй новый SQL-файл, `models/stg_orders.sql`, с SQL из CTE `orders` в нашем исходном запросе.

    <File name='models/stg_customers.sql'>

    ```sql
    select
        ID as customer_id,
        FIRST_NAME as first_name,
        LAST_NAME as last_name

    from dbo.customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        ID as order_id,
        USER_ID as customer_id,
        ORDER_DATE as order_date,
        STATUS as status

    from dbo.orders
    ```

    </File>

3. Отредактируйте SQL в вашем файле `models/customers.sql` следующим образом:

    <File name='models/customers.sql'>

    ```sql
    with customers as (

        select * from {{ ref('stg_customers') }}

    ),

    orders as (

        select * from {{ ref('stg_orders') }}

    ),

    customer_orders as (

        select
            customer_id,

            min(order_date) as first_order_date,
            max(order_date) as most_recent_order_date,
            count(order_id) as number_of_orders

        from orders

        group by customer_id

    ),

    final as (

        select
            customers.customer_id,
            customers.first_name,
            customers.last_name,
            customer_orders.first_order_date,
            customer_orders.most_recent_order_date,
            coalesce(customer_orders.number_of_orders, 0) as number_of_orders

        from customers

        left join customer_orders on customers.customer_id = customer_orders.customer_id

    )

    select * from final
    
    ```

    </File>

4. Выполните `dbt run`.

    На этот раз, когда вы выполнили `dbt run`, были созданы отдельные представления/таблицы для `stg_customers`, `stg_orders` и `customers`. dbt определил порядок выполнения этих моделей. Поскольку `customers` зависит от `stg_customers` и `stg_orders`, dbt строит `customers` последним. Вам не нужно явно определять эти зависимости.


#### Часто задаваемые вопросы {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="Как я создаю больше моделей, как мне организовать мой проект? Как мне назвать мои модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />
