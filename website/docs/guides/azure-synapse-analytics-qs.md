---
title: "Быстрый старт для dbt и Azure Synapse Analytics"
id: "azure-synapse-analytics"
level: 'Beginner'
icon: 'azure-synapse-analytics-2'
hide_table_of_contents: true
tags: ['dbt platform','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом кратком руководстве вы узнаете, как использовать <Constant name="dbt" /> с [Azure Synapse Analytics](https://azure.microsoft.com/en-us/products/synapse-analytics/). В нём показано, как:

- Загрузить демонстрационные данные Jaffle Shop (предоставленные dbt Labs) в ваше хранилище Azure Synapse Analytics. 
- Подключить <Constant name="dbt" /> к Azure Synapse Analytics.
- Преобразовать пример запроса в модель в вашем проекте dbt. Модель в dbt — это SQL-запрос SELECT.
- Добавить тесты для ваших моделей.
- Добавить документацию к вашим моделям.
- Настроить запуск задания по расписанию.

### Предварительные требования {#prerequisites}
- У вас есть аккаунт [dbt Cloud](https://www.getdbt.com/signup/).
- У вас есть аккаунт Azure Synapse Analytics. Для бесплатной пробной версии обратитесь к [Synapse Analytics](https://azure.microsoft.com/en-us/free/synapse-analytics/) в документации Microsoft.
- Как администратор Microsoft, вы включили аутентификацию с использованием служебного принципала. Вы должны добавить служебный принципал в рабочее пространство Synapse с правами Участника (рекомендуется) или Администратора. Для получения подробной информации обратитесь к [Создание служебного принципала с использованием портала Azure](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal) в документации Microsoft. dbt Cloud нужны эти учетные данные для подключения к Azure Synapse Analytics.

### Предварительные требования
- У вас есть учетная запись [<Constant name="dbt" />](https://www.getdbt.com/signup/).
- У вас есть учетная запись Azure Synapse Analytics. Чтобы воспользоваться бесплатной пробной версией, обратитесь к разделу [Synapse Analytics](https://azure.microsoft.com/en-us/free/synapse-analytics/) в документации Microsoft.
- Вы, как администратор Microsoft, включили аутентификацию с помощью субъекта-службы (service principal). Необходимо добавить субъект-службу в рабочую область Synapse с набором разрешений Member (рекомендуется) или Admin. Подробные сведения см. в разделе [Создание субъекта-службы с помощью портала Azure](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal) в документации Microsoft. Эти учетные данные необходимы <Constant name="dbt" /> для подключения к Azure Synapse Analytics.

## Загрузка данных в Azure Synapse Analytics {#load-data-into-your-azure-synapse-analytics}

1. Войдите в свой [аккаунт Azure portal](https://portal.azure.com/#home).  
1. На главной странице выберите плитку **SQL databases**.
1. На странице **SQL databases** перейдите в рабочее пространство вашей организации или создайте новое; для получения более подробной информации обратитесь к [Создание рабочего пространства Synapse](https://learn.microsoft.com/en-us/azure/synapse-analytics/quickstart-create-workspace) в документации Microsoft.
1. В боковой панели рабочего пространства выберите **Data**. Нажмите на меню с тремя точками на вашей базе данных и выберите **New SQL script**, чтобы открыть редактор SQL.
1. Скопируйте эти операторы в редактор SQL, чтобы загрузить пример данных Jaffle Shop:

    ```sql
    CREATE TABLE dbo.customers
    (
        [ID] [bigint],
        \[FIRST_NAME] [varchar](8000),
        \[LAST_NAME] [varchar](8000)
    );

    COPY INTO [dbo].[customers]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/jaffle_shop_customers.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );

    CREATE TABLE dbo.orders
    (
        [ID] [bigint],
        [USER_ID] [bigint],
        [ORDER_DATE] [date],
        \[STATUS] [varchar](8000)
    );

    COPY INTO [dbo].[orders]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/jaffle_shop_orders.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );

    CREATE TABLE dbo.payments
    (
        [ID] [bigint],
        [ORDERID] [bigint],
        \[PAYMENTMETHOD] [varchar](8000),
        \[STATUS] [varchar](8000),
        [AMOUNT] [bigint],
        [CREATED] [date]
    );

    COPY INTO [dbo].[payments]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/stripe_payments.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );
    ```

<Lightbox src="/img/quickstarts/dbt-platform/example-load-data-azure-syn-analytics.png" width="80%" title="Пример загрузки данных" />

## Подключение dbt к Azure Synapse Analytics {#connect-dbt-to-azure-synapse-analytics}

1. Создайте новый проект в <Constant name="dbt" />. Нажмите на имя своей учетной записи в меню слева, выберите **Account settings** и нажмите **+ New Project**.
2. Введите имя проекта и нажмите **Continue**.
3. Выберите **Synapse** в качестве подключения и нажмите **Next**.
4. В разделе **Configure your environment** укажите настройки (**Settings**) нового проекта:
    - **Server** &mdash; Используйте значение **Synapse host name** субъекта-службы (без строки `, 1433` в конце) для тестовой конечной точки Synapse. 
    - **Port** &mdash; 1433 (значение по умолчанию).
    - **Database** &mdash; Используйте значение **database** субъекта-службы для тестовой конечной точки Synapse. 
5. Укажите учетные данные пользователя (**User credentials**) для нового проекта:
    - **Authentication** &mdash; Выберите **Service Principal** в раскрывающемся списке.
    - **Tenant ID** &mdash; Используйте значение **Directory (tenant) id** субъекта-службы.
    - **Client ID** &mdash; Используйте значение **application (client) ID** субъекта-службы.
    - **Client secret** &mdash; Используйте значение **client secret** субъекта-службы (не **client secret id**).
6. Нажмите **Test connection**. Эта проверка позволяет убедиться, что <Constant name="dbt" /> может получить доступ к вашей учетной записи Azure Synapse Analytics.
7. После успешной проверки нажмите **Next**. Если проверка завершилась неудачно, возможно, потребуется проверить настройки субъекта-службы Microsoft.

## Настройка управляемого репозитория dbt {#set-up-a-dbt-managed-repository}
<Snippet path="tutorial-managed-repo" />

## Инициализируйте проект dbt​ и начните разработку
Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="dbt" />:

1. Нажмите **Start developing in the <Constant name="studio_ide" />**. Первый запуск проекта может занять несколько минут: за это время устанавливается подключение к git, клонируется репозиторий и проверяется подключение к хранилищу данных.
2. Над деревом файлов слева нажмите **Initialize dbt project**. Это создаст структуру папок с примерами моделей.
3. Создайте первый коммит, нажав **Commit and sync**. Укажите сообщение коммита `initial commit` и нажмите **Commit Changes**. Это создаст первый коммит в вашем управляемом репозитории и позволит создать ветку, в которую можно добавлять новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из хранилища и выполнять `dbt run`. Попробуйте сделать это прямо сейчас:
    - В строке команд внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создайте свою первую модель

Если вы хотите использовать ИИ для создания первой модели, ознакомьтесь с разделом <a id="qs-jump-to-build-with-ai" href="#build-it-with-ai-using-dbt-wizard">«Создайте модель с помощью dbt Wizard»</a> ниже.
1. В разделе **Version Control** слева нажмите **Create branch**. Ветку можно назвать `add-customers-model`. Необходимо создать новую ветку, поскольку основная ветка доступна только для чтения.
1. Нажмите меню с тремя точками (**...**) рядом с каталогом `models`, затем выберите **Create file**.  
1. Назовите файл `customers.sql`, затем нажмите **Create**.
1. Скопируйте следующий запрос в файл и нажмите **Save**.

    <File name='customers.sql'>

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

1. Введите `dbt run` в командной строке внизу экрана. Вы должны получить успешное выполнение и увидеть три модели.

Позже вы сможете подключить свои инструменты бизнес-аналитики (BI), например [dbt Charts](https://dbtcharts.com/), к этим представлениям и таблицам, чтобы они считывали только очищенные данные, а не необработанные.

#### Часто задаваемые вопросы {#faqs}

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

<Snippet path="quickstarts/build-first-model-with-wizard" />

## Измените способ материализации вашей модели

<Snippet path="quickstarts/change-way-model-materialized" />

## Удаление примерных моделей {#delete-the-example-models}

<Snippet path="quickstarts/delete-example-models" />

## Создание моделей на основе других моделей {#build-models-on-top-of-other-models}

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте новый SQL файл, `models/stg_customers.sql`, с SQL из CTE `customers` в нашем оригинальном запросе.
2. Создайте второй новый SQL файл, `models/stg_orders.sql`, с SQL из CTE `orders` в нашем оригинальном запросе.

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

3. Измените SQL в вашем файле `models/customers.sql` следующим образом:

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
<FAQ path="Project/structure-a-project" alt_header="Как я должен организовать свой проект по мере создания большего количества моделей? Как я должен называть свои модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />

<Snippet path="quickstarts/connect-your-ai" />
