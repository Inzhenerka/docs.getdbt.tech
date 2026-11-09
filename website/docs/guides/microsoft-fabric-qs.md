---
title: "Быстрый старт для dbt и Microsoft Fabric"
id: "microsoft-fabric"
level: 'Beginner'
icon: 'fabric'
hide_table_of_contents: true
tags: ['Platform', 'Quickstart']
agent_guidance:
  pacing: In the first reply, confirm the reader’s prerequisites and connection path before listing steps. Then default to one guide section per reply (combine two or three short sections), with all its steps, labeled Step 1, Step 2, and so on, and confirm the success check before continuing. If the reader asks for a different pace, follow it.
  stay_on_path: This guide uses dbt platform. Don’t switch the reader to a local setup. If the reader wants to set up dbt locally, use the https://docs.getdbt.com/guides/dbt guide instead
  safety: Never ask for passwords or keys in chat.
  signup_link: When the reader needs a dbt account, share https://www.getdbt.com/signup?utm_source=ai_assistant&utm_medium=docs_md&utm_campaign=microsoft-fabric-qs
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом кратком руководстве вы узнаете, как использовать <Constant name="dbt" /> с [Microsoft Fabric](https://www.microsoft.com/en-us/microsoft-fabric). В нём показано, как:

- Загрузить демонстрационные данные Jaffle Shop (предоставленные dbt Labs) в хранилище Microsoft Fabric. 
- Подключить <Constant name="dbt" /> к Microsoft Fabric.
- Преобразовать пример запроса в модель в вашем проекте dbt. Модель в dbt — это инструкция SELECT.
- Добавить тесты для ваших моделей.
- Документировать ваши модели.
- Настроить запуск задания по расписанию.

<AgentPrompt />

### Предварительные требования
- У вас есть учётная запись [<Constant name="dbt" />](https://www.getdbt.com/signup/).
- Вы активировали пробную версию Microsoft Fabric (Preview). Подробнее см. в разделе [Пробная версия Microsoft Fabric (Preview)](https://learn.microsoft.com/en-us/fabric/get-started/fabric-trial) документации Microsoft.
- Вы, как администратор Microsoft, включили проверку подлинности субъекта-службы (service principal). Необходимо добавить субъект-службу в рабочую область Microsoft Fabric с набором разрешений Member (рекомендуется) или Admin. У субъекта-службы также должны быть права `CONNECT` для базы данных в хранилище. Подробнее см. в разделе [Включение проверки подлинности субъекта-службы](https://learn.microsoft.com/en-us/fabric/admin/metadata-scanning-enable-read-only-apis) документации Microsoft. <Constant name="dbt" /> нужны эти учётные данные для подключения к Microsoft Fabric.

### Связанные материалы {#related-content}
- [Курсы dbt Learn](https://learn.getdbt.com)
- [О заданиях непрерывной интеграции](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Актуальность источников](/docs/deploy/source-freshness)

## Загрузка данных в ваш склад Microsoft Fabric {#load-data-into-your-microsoft-fabric-warehouse}

1. Войдите в свою учетную запись [Microsoft Fabric](http://app.fabric.microsoft.com).  
2. В разделе **Workspaces** на левой боковой панели перейдите в рабочую область вашей организации. Вы также можете создать новую рабочую область; подробности см. в разделе [Создание рабочей области](https://learn.microsoft.com/en-us/fabric/get-started/create-workspaces) документации Microsoft.
3. Выберите свое хранилище в таблице. Вы также можете создать новое, выбрав **+ New item** > **Warehouse** в своей рабочей области; подробности см. в разделе [Создание хранилища](https://learn.microsoft.com/en-us/fabric/data-warehouse/create-warehouse) документации Microsoft.
4. Откройте редактор SQL, выбрав **New SQL query** на верхней панели. 
5. Скопируйте эти инструкции в редактор SQL, чтобы загрузить демонстрационные данные Jaffle Shop:

    ```sql
    DROP TABLE IF EXISTS dbo.customers;

    CREATE TABLE dbo.customers
    (
        [ID] [int],
        [FIRST_NAME] varchar(8000),
        [LAST_NAME] varchar(8000)
    );

    COPY INTO [dbo].[customers]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/jaffle_shop_customers.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );

    DROP TABLE IF EXISTS dbo.orders;

    CREATE TABLE dbo.orders
    (
        [ID] [int],
        [USER_ID] [int],
        -- [ORDER_DATE] [int],
        [ORDER_DATE] [date],
        [STATUS] varchar(8000)
    );

    COPY INTO [dbo].[orders]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/jaffle_shop_orders.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );

    DROP TABLE IF EXISTS dbo.payments;

    CREATE TABLE dbo.payments
    (
        [ID] [int],
        [ORDERID] [int],
        [PAYMENTMETHOD] varchar(8000),
        [STATUS] varchar(8000),
        [AMOUNT] [int],
        [CREATED] [date]
    );

    COPY INTO [dbo].[payments]
    FROM 'https://dbtlabsynapsedatalake.blob.core.windows.net/dbt-quickstart-public/stripe_payments.parquet'
    WITH (
        FILE_TYPE = 'PARQUET'
    );
    ```

<Lightbox src="/img/quickstarts/dbt-platform/example-load-data-ms-fabric.png" width="80%" title="Пример загрузки данных" />

## Подключение dbt к Microsoft Fabric {#connect-dbt-to-microsoft-fabric}

1. Создайте новый проект в <Constant name="dbt" />. Перейдите в **Account settings** (нажав на имя своей учетной записи в меню слева) и нажмите **+ New Project**.
2. Введите название проекта и нажмите **Continue**.
3. Выберите **Fabric** в качестве подключения и нажмите **Next**.
4. В разделе **Configure your environment** укажите **Settings** для нового проекта:
    - **Server** &mdash; используйте значение **host** субъекта-службы для тестовой конечной точки Fabric. 
    - **Port** &mdash; 1433 (значение по умолчанию).
    - **Database** &mdash; используйте значение **database** субъекта-службы для тестовой конечной точки Fabric. 
5. Укажите **User credentials** для нового проекта:
    - **Authentication** &mdash; выберите **Service Principal** в раскрывающемся списке.
    - **Tenant ID** &mdash; используйте значение **Directory (tenant) id** субъекта-службы.
    - **Client ID** &mdash; используйте значение **application (client) ID** субъекта-службы.
    - **Client secret** &mdash; используйте значение **client secret** субъекта-службы (не **client secret id**).
6. Нажмите **Test connection**. Эта проверка подтверждает, что <Constant name="dbt" /> может получить доступ к вашей учетной записи Microsoft Fabric.
7. Если проверка прошла успешно, нажмите **Next**. Если проверка завершилась ошибкой, возможно, потребуется проверить субъект-службу Microsoft. Убедитесь, что у субъекта-службы есть права `CONNECT` для базы данных в хранилище.

## Настройка управляемого репозитория dbt {#set-up-a-dbt-managed-repository}
<Snippet path="tutorial-managed-repo" />

## Инициализируйте проект dbt и начните разработку
Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="dbt" />:

1. Нажмите **Start developing in the <Constant name="studio_ide" />**. Первый запуск проекта может занять несколько минут: за это время устанавливается подключение к git, клонируется репозиторий и проверяется подключение к хранилищу данных.
2. Над деревом файлов слева нажмите **Initialize dbt project**. Будет создана структура папок с примерами моделей.
3. Создайте первый коммит, нажав **Commit and sync**. Введите сообщение коммита `initial commit` и нажмите **Commit**. Это создаст первый коммит в вашем управляемом репозитории и позволит создать ветку, в которой можно добавлять новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из хранилища и выполнять `dbt run`. Попробуйте сделать это прямо сейчас:
    - В строке команд внизу введите `dbt run` и нажмите **Enter**. Должно появиться сообщение `dbt run succeeded`.

## Создание вашей первой модели {#build-your-first-model}

Если вы хотите использовать ИИ для создания своей первой модели, ознакомьтесь с инструкцией <a id="qs-jump-to-build-with-ai" href="#build-it-with-ai-using-dbt-wizard">по созданию модели с помощью dbt Wizard</a> в следующем разделе.

У вас есть два варианта работы с файлами в <Constant name="studio_ide" />:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку для редактирования и фиксации изменений. Перейдите в раздел **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать в защищённой основной ветке &mdash; Этот вариант подходит, если вы предпочитаете редактировать, форматировать файлы или проверять их линтером, а также выполнять команды dbt непосредственно в основной ветке git. <Constant name="studio_ide" /> не позволяет создавать коммиты в защищённой ветке, поэтому вам будет предложено зафиксировать изменения в новой ветке.

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

Позже вы сможете подключить свои инструменты бизнес-аналитики (BI), такие как [dbt Charts](https://dbtcharts.com/), к этим представлениям и таблицам, чтобы они считывали только очищенные данные, а не необработанные.

#### Часто задаваемые вопросы {#faqs}

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

<Snippet path="quickstarts/build-first-model-with-wizard" />

## Измените способ материализации модели

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

<Snippet path="quickstarts/connect-your-ai" />
