---
title: "Быстрый старт для dbt Cloud и Microsoft Fabric"
id: "microsoft-fabric"
level: 'Начинающий'
icon: 'fabric'
hide_table_of_contents: true
tags: ['dbt Cloud','Быстрый старт']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как использовать dbt Cloud с [Microsoft Fabric](https://www.microsoft.com/en-us/microsoft-fabric). Вы научитесь:

- Загружать образцы данных Jaffle Shop (предоставленные dbt Labs) в ваш склад данных Microsoft Fabric.
- Подключать dbt Cloud к Microsoft Fabric.
- Превращать пример запроса в модель в вашем проекте dbt. Модель в dbt — это оператор SELECT.
- Добавлять тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.

### Предварительные требования
- У вас есть учетная запись [dbt Cloud](https://www.getdbt.com/signup/).
- Вы начали пробный период Microsoft Fabric (Preview). Для получения подробной информации обратитесь к [пробному периоду Microsoft Fabric (Preview)](https://learn.microsoft.com/en-us/fabric/get-started/fabric-trial) в документации Microsoft.
- В качестве администратора Microsoft вы включили аутентификацию с помощью сервисного принципала. Вы должны добавить сервисный принципал в рабочее пространство Microsoft Fabric с правами либо Члена (рекомендуется), либо Администратора. Для получения подробной информации обратитесь к [включению аутентификации с помощью сервисного принципала](https://learn.microsoft.com/en-us/fabric/admin/metadata-scanning-enable-read-only-apis) в документации Microsoft. dbt Cloud нуждается в этих учетных данных для подключения к Microsoft Fabric.

### Связанный контент
- [Курсы dbt Learn](https://learn.getdbt.com)
- [О заданиях непрерывной интеграции](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источников](/docs/deploy/source-freshness)

## Загрузка данных в ваш склад данных Microsoft Fabric

1. Войдите в свою учетную запись [Microsoft Fabric](http://app.fabric.microsoft.com).  
2. На главной странице выберите плитку **Synapse Data Warehouse**.

    <Lightbox src="/img/quickstarts/dbt-cloud/example-start-fabric.png" width="80%" title="Пример плитки Synapse Data Warehouse" />

3. В разделе **Рабочие пространства** на левой боковой панели перейдите в рабочее пространство вашей организации. Или вы можете создать новое рабочее пространство; для получения подробной информации обратитесь к [Созданию рабочего пространства](https://learn.microsoft.com/en-us/fabric/get-started/create-workspaces) в документации Microsoft.
4. Выберите свой склад из таблицы. Или вы можете создать новый склад; для получения подробной информации обратитесь к [Созданию склада](https://learn.microsoft.com/en-us/fabric/data-warehouse/tutorial-create-warehouse) в документации Microsoft.
5. Откройте SQL-редактор, выбрав **Новый SQL-запрос** в верхней панели. 
6. Скопируйте следующие операторы в SQL-редактор для загрузки примерных данных Jaffle Shop:

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

## Подключение dbt Cloud к Microsoft Fabric

1. Создайте новый проект в dbt Cloud. Перейдите в **Настройки учетной записи** (нажав на имя вашей учетной записи в левом меню) и нажмите **+ Новый проект**.
2. Введите имя проекта и нажмите **Продолжить**.
3. Выберите **Fabric** в качестве вашего подключения и нажмите **Далее**.
4. В разделе **Настройка вашей среды** введите **Настройки** для вашего нового проекта:
    - **Сервер** — используйте значение **host** сервисного принципала для тестовой конечной точки Fabric. 
    - **Порт** — 1433 (что является значением по умолчанию).
    - **База данных** — используйте значение **database** сервисного принципала для тестовой конечной точки Fabric. 
5. Введите **Учетные данные для разработки** для вашего нового проекта:
    - **Аутентификация** — выберите **Service Principal** из выпадающего списка.
    - **Tenant ID** — используйте **Directory (tenant) id** сервисного принципала в качестве значения.
    - **Client ID** — используйте **application (client) ID** сервисного принципала в качестве значения.
    - **Client secret** — используйте **client secret** сервисного принципала (не **client secret id**) в качестве значения.
6. Нажмите **Проверить соединение**. Это проверяет, что dbt Cloud может получить доступ к вашей учетной записи Microsoft Fabric.
7. Нажмите **Далее**, когда тест пройдет успешно. Если он не удался, вам, возможно, нужно проверить ваш сервисный принципал Microsoft.

## Настройка управляемого репозитория dbt Cloud 
<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки
Теперь, когда у вас настроен репозиторий, вы можете инициализировать свой проект и начать разработку в dbt Cloud:

1. Нажмите **Начать разработку в IDE**. Это может занять несколько минут, чтобы ваш проект запустился в первый раз, так как устанавливается соединение с git, клонируется ваш репозиторий и проверяется соединение со складом.
2. Над деревом файлов слева нажмите **Инициализировать проект dbt**. Это создаст структуру папок с примерами моделей.
3. Сделайте свой первый коммит, нажав **Коммит и синхронизация**. Используйте сообщение коммита `initial commit` и нажмите **Коммит**. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, в которую вы можете добавить новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из вашего склада и выполнять `dbt run`. Попробуйте это сейчас:
    - В строке команд внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели

У вас есть два варианта работы с файлами в dbt Cloud IDE:

- Создать новую ветку (рекомендуется) — создайте новую ветку для редактирования и коммита ваших изменений. Перейдите в **Управление версиями** на левой боковой панели и нажмите **Создать ветку**.
- Редактировать в защищенной основной ветке — если вы предпочитаете редактировать, форматировать или проверять файлы и выполнять команды dbt непосредственно в вашей основной ветке git. dbt Cloud IDE предотвращает коммиты в защищенную ветку, поэтому вам будет предложено зафиксировать ваши изменения в новой ветке.

Назовите новую ветку `add-customers-model`.

1. Нажмите **...** рядом с директорией `models`, затем выберите **Создать файл**.  
2. Назовите файл `customers.sql`, затем нажмите **Создать**.
3. Скопируйте следующий запрос в файл и нажмите **Сохранить**.

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

4. Введите `dbt run` в командной строке внизу экрана. Вы должны получить успешный результат и увидеть три модели.

Позже вы можете подключить свои инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не сырые данные в вашем инструменте BI.

#### Часто задаваемые вопросы

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

## Изменение способа материализации вашей модели

<Snippet path="quickstarts/change-way-model-materialized" />

## Удаление примерных моделей

<Snippet path="quickstarts/delete-example-models" />

## Создание моделей на основе других моделей

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте новый SQL-файл, `models/stg_customers.sql`, с SQL из CTE `customers` в нашем оригинальном запросе.
2. Создайте второй новый SQL-файл, `models/stg_orders.sql`, с SQL из CTE `orders` в нашем оригинальном запросе.

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
<FAQ path="Project/structure-a-project" alt_header="Как мне организовать свой проект по мере создания большего количества моделей? Как мне называть свои модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />