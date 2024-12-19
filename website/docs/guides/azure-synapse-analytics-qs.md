---
title: "Быстрый старт для dbt Cloud и Azure Synapse Analytics"
id: "azure-synapse-analytics"
level: 'Начинающий'
icon: 'azure-synapse-analytics'
hide_table_of_contents: true
tags: ['dbt Cloud','Быстрый старт']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как использовать dbt Cloud с [Azure Synapse Analytics](https://azure.microsoft.com/en-us/products/synapse-analytics/). В нем показано, как:

- Загрузить пример данных Jaffle Shop (предоставленный dbt Labs) в ваш склад данных Azure Synapse Analytics.
- Подключить dbt Cloud к Azure Synapse Analytics.
- Преобразовать пример запроса в модель в вашем проекте dbt. Модель в dbt — это оператор SELECT.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.

### Предварительные требования
- У вас есть учетная запись [dbt Cloud](https://www.getdbt.com/signup/).
- У вас есть учетная запись Azure Synapse Analytics. Для бесплатной пробной версии обратитесь к [Synapse Analytics](https://azure.microsoft.com/en-us/free/synapse-analytics/) в документации Microsoft.
- В качестве администратора Microsoft вы включили аутентификацию с помощью сервисного принципала. Вы должны добавить сервисный принципал в рабочее пространство Synapse с правами либо Члена (рекомендуется), либо Администратора. Для получения подробной информации обратитесь к [Создание сервисного принципала с помощью портала Azure](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal) в документации Microsoft. dbt Cloud нуждается в этих учетных данных для аутентификации, чтобы подключиться к Azure Synapse Analytics.

### Связанный контент
- [Курсы dbt Learn](https://learn.getdbt.com)
- [О заданиях непрерывной интеграции](/docs/deploy/continuous-integration)
- [Задания на развертывание](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источников](/docs/deploy/source-freshness)

## Загрузка данных в Azure Synapse Analytics

1. Войдите в свою учетную запись [Azure portal](https://portal.azure.com/#home).  
1. На главной странице выберите плитку **SQL базы данных**.
1. На странице **SQL базы данных** перейдите в рабочее пространство вашей организации или создайте новое рабочее пространство; для получения дополнительных сведений обратитесь к [Создание рабочего пространства Synapse](https://learn.microsoft.com/en-us/azure/synapse-analytics/quickstart-create-workspace) в документации Microsoft.
1. В боковом меню рабочего пространства выберите **Данные**. Нажмите на меню с тремя точками на вашей базе данных и выберите **Новый SQL-скрипт**, чтобы открыть редактор SQL. 
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

    <Lightbox src="/img/quickstarts/dbt-cloud/example-load-data-azure-syn-analytics.png" width="80%" title="Пример загрузки данных" />

## Подключение dbt Cloud к Azure Synapse Analytics

1. Создайте новый проект в dbt Cloud. Нажмите на имя вашей учетной записи в левом меню, выберите **Настройки учетной записи** и нажмите **+ Новый проект**.
2. Введите имя проекта и нажмите **Продолжить**.
3. Выберите **Synapse** в качестве вашего подключения и нажмите **Далее**.
4. В разделе **Настройка вашей среды** введите **Настройки** для вашего нового проекта:
    - **Сервер** — Используйте значение **имя хоста Synapse** сервисного принципала (без завершающей строки `, 1433`) для тестовой конечной точки Synapse. 
    - **Порт** — 1433 (что является значением по умолчанию).
    - **База данных** — Используйте значение **база данных** сервисного принципала для тестовой конечной точки Synapse. 
5. Введите **Учетные данные для разработки** для вашего нового проекта:
    - **Аутентификация** — Выберите **Сервисный принципал** из выпадающего списка.
    - **Идентификатор арендатора** — Используйте **идентификатор директории (арендатора)** сервисного принципала в качестве значения.
    - **Идентификатор клиента** — Используйте **идентификатор приложения (клиента)** сервисного принципала в качестве значения.
    - **Секрет клиента** — Используйте **секрет клиента** сервисного принципала (не **идентификатор секрета клиента**) в качестве значения.
6. Нажмите **Проверить соединение**. Это проверяет, что dbt Cloud может получить доступ к вашей учетной записи Azure Synapse Analytics.
7. Нажмите **Далее**, когда тест пройдет успешно. Если он не удался, вам, возможно, нужно проверить ваш сервисный принципал Microsoft.

## Настройка управляемого репозитория dbt Cloud 
<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки
Теперь, когда у вас настроен репозиторий, вы можете инициализировать ваш проект и начать разработку в dbt Cloud:

1. Нажмите **Начать разработку в IDE**. Это может занять несколько минут, чтобы ваш проект запустился в первый раз, так как устанавливается соединение с git, клонируется ваш репозиторий и проверяется соединение со складом данных.
2. Над деревом файлов слева нажмите **Инициализировать проект dbt**. Это создаст структуру папок с примерами моделей.
3. Сделайте ваш первый коммит, нажав **Коммит и синхронизация**. Используйте сообщение коммита `initial commit` и нажмите **Коммит изменений**. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, в которой вы можете добавить новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из вашего склада и выполнять `dbt run`. Попробуйте это сейчас:
    - В строке команд внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели
1. В разделе **Контроль версий** слева нажмите **Создать ветку**. Вы можете назвать ее `add-customers-model`. Вам нужно создать новую ветку, так как основная ветка установлена в режим только для чтения.
1. Нажмите на меню с тремя точками (**...**) рядом с каталогом `models`, затем выберите **Создать файл**.  
1. Назовите файл `customers.sql`, затем нажмите **Создать**.
1. Скопируйте следующий запрос в файл и нажмите **Сохранить**.

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

1. Введите `dbt run` в командной строке внизу экрана. Вы должны получить успешный результат и увидеть три модели.

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
<FAQ path="Project/structure-a-project" alt_header="Как мне организовать свой проект, когда я создаю больше моделей? Как мне называть свои модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />