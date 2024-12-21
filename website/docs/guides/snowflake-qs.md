---
title: "Быстрый старт для dbt Cloud и Snowflake"
id: "snowflake"
level: 'Beginner'
icon: 'snowflake'
tags: ['dbt Cloud','Quickstart','Snowflake']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как использовать dbt Cloud с Snowflake. Оно покажет вам, как:

- Создать новый рабочий лист Snowflake.
- Загрузить пример данных в ваш аккаунт Snowflake.
- Подключить dbt Cloud к Snowflake.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавить источники в ваш проект dbt. Источники позволяют вам именовать и описывать необработанные данные, уже загруженные в Snowflake.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.

Snowflake также предоставляет руководство по быстрому старту, чтобы вы могли научиться использовать dbt Cloud. Оно использует другой публичный набор данных (Knoema Economy Data Atlas), чем тот, что показан в этом руководстве. Для получения дополнительной информации обратитесь к [Ускорение работы команд данных с dbt Cloud и Snowflake](https://quickstarts.snowflake.com/guide/accelerating_data_teams_with_snowflake_and_dbt_cloud_hands_on_lab/) в документации Snowflake.

:::tip Видео для вас
Вы можете бесплатно ознакомиться с [Основами dbt](https://learn.getdbt.com/courses/dbt-fundamentals), если вас интересует обучение с видео.

Вы также можете посмотреть [видео на YouTube о dbt и Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::

### Предварительные требования

- У вас есть [аккаунт dbt Cloud](https://www.getdbt.com/signup/).
- У вас есть [пробный аккаунт Snowflake](https://signup.snowflake.com/). При создании пробного аккаунта убедитесь, что выбрали издание **Enterprise** Snowflake, чтобы у вас был доступ `ACCOUNTADMIN`. Для полной реализации вам следует учитывать организационные вопросы при выборе облачного провайдера. Для получения дополнительной информации см. [Введение в облачные платформы](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms.html) в документации Snowflake. Для целей этой настройки все облачные провайдеры и регионы будут работать, так что выберите любой, который вам нравится.

### Связанные материалы

- Узнайте больше с [курсами dbt Learn](https://learn.getdbt.com)
- [Как мы настраиваем Snowflake](https://blog.getdbt.com/how-we-configure-snowflake/)
- [CI задания](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источников](/docs/deploy/source-freshness)

## Создание нового рабочего листа Snowflake
1. Войдите в свой пробный аккаунт Snowflake.
2. В интерфейсе Snowflake нажмите **+ Worksheet** в правом верхнем углу, чтобы создать новый рабочий лист.

## Загрузка данных
Данные, используемые здесь, хранятся в виде CSV-файлов в публичном S3-бакете, и следующие шаги помогут вам подготовить ваш аккаунт Snowflake для этих данных и загрузить их.

1. Создайте новый виртуальный склад, две новые базы данных (одну для необработанных данных, другую для будущей разработки dbt) и две новые схемы (одну для данных `jaffle_shop`, другую для данных `stripe`).

    Для этого выполните эти SQL-команды, введя их в редакторе вашего нового рабочего листа Snowflake и нажав **Run** в правом верхнем углу интерфейса:
    ```sql
    create warehouse transforming;
    create database raw;
    create database analytics;
    create schema raw.jaffle_shop;
    create schema raw.stripe;
    ```

2. В базе данных `raw` и схемах `jaffle_shop` и `stripe` создайте три таблицы и загрузите в них соответствующие данные:

    - Сначала удалите все содержимое (очистите) в редакторе рабочего листа Snowflake. Затем выполните эту SQL-команду, чтобы создать таблицу `customer`:

        ```sql 
        create table raw.jaffle_shop.customers 
        ( id integer,
          first_name varchar,
          last_name varchar
        );
        ```

    - Удалите все содержимое в редакторе, затем выполните эту команду, чтобы загрузить данные в таблицу `customer`:

        ```sql 
        copy into raw.jaffle_shop.customers (id, first_name, last_name)
        from 's3://dbt-tutorial-public/jaffle_shop_customers.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            ); 
        ```
    - Удалите все содержимое в редакторе (очистите), затем выполните эту команду, чтобы создать таблицу `orders`:
        ```sql
        create table raw.jaffle_shop.orders
        ( id integer,
          user_id integer,
          order_date date,
          status varchar,
          _etl_loaded_at timestamp default current_timestamp
        );
        ```

    - Удалите все содержимое в редакторе, затем выполните эту команду, чтобы загрузить данные в таблицу `orders`:
        ```sql
        copy into raw.jaffle_shop.orders (id, user_id, order_date, status)
        from 's3://dbt-tutorial-public/jaffle_shop_orders.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            );
        ```
    - Удалите все содержимое в редакторе (очистите), затем выполните эту команду, чтобы создать таблицу `payment`:
        ```sql
        create table raw.stripe.payment 
        ( id integer,
          orderid integer,
          paymentmethod varchar,
          status varchar,
          amount integer,
          created date,
          _batched_at timestamp default current_timestamp
        );
        ```
    - Удалите все содержимое в редакторе, затем выполните эту команду, чтобы загрузить данные в таблицу `payment`:
        ```sql
        copy into raw.stripe.payment (id, orderid, paymentmethod, status, amount, created)
        from 's3://dbt-tutorial-public/stripe_payments.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            );
        ```
3. Проверьте, что данные загружены, выполнив эти SQL-запросы. Убедитесь, что вы видите вывод для каждого из них.
    ```sql
    select * from raw.jaffle_shop.customers;
    select * from raw.jaffle_shop.orders;
    select * from raw.stripe.payment;   
    ```

## Подключение dbt Cloud к Snowflake

Существует два способа подключения dbt Cloud к Snowflake. Первый вариант — это Partner Connect, который предоставляет упрощенную настройку для создания вашего аккаунта dbt Cloud из вашего нового пробного аккаунта Snowflake. Второй вариант — создать ваш аккаунт dbt Cloud отдельно и самостоятельно настроить подключение к Snowflake (подключение вручную). Если вы хотите начать быстро, dbt Labs рекомендует использовать Partner Connect. Если вы хотите настроить свою установку с самого начала и ознакомиться с процессом настройки dbt Cloud, dbt Labs рекомендует подключаться вручную.

<Tabs>
<TabItem value="partner-connect" label="Использовать Partner Connect" default>

Использование Partner Connect позволяет вам создать полный аккаунт dbt с вашим [подключением Snowflake](/docs/cloud/connect-data-platform/connect-snowflake), [управляемым репозиторием](/docs/collaborate/git/managed-repository), [средами](/docs/build/custom-schemas#managing-environments) и учетными данными.

1. В интерфейсе Snowflake нажмите на значок дома в левом верхнем углу. В левой боковой панели выберите **Data Products**. Затем выберите **Partner Connect**. Найдите плитку dbt, прокручивая или используя поиск по dbt в строке поиска. Нажмите на плитку, чтобы подключиться к dbt.

    <Lightbox src="/img/snowflake_tutorial/snowflake_partner_connect_box.png" title="Snowflake Partner Connect Box" />

    Если вы используете классическую версию интерфейса Snowflake, вы можете нажать кнопку **Partner Connect** в верхней панели вашего аккаунта. Оттуда нажмите на плитку dbt, чтобы открыть окно подключения.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_partner_connect.png" title="Snowflake Classic UI - Partner Connect" />

2. В всплывающем окне **Connect to dbt** найдите опцию **Optional Grant** и выберите базы данных **RAW** и **ANALYTICS**. Это предоставит доступ для вашей новой роли пользователя dbt к каждой базе данных. Затем нажмите **Connect**.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_connection_box.png" title="Snowflake Classic UI - Connection Box" />

    <Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_connection_box.png" title="Snowflake New UI - Connection Box" />

3. Нажмите **Activate**, когда появится всплывающее окно:

<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_activation_window.png" title="Snowflake Classic UI - Actviation Window" />

<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_activation_window.png" title="Snowflake New UI - Activation Window" />

4. После загрузки новой вкладки вы увидите форму. Если вы уже создали аккаунт dbt Cloud, вас попросят указать имя аккаунта. Если вы не создали аккаунт, вас попросят указать имя аккаунта и пароль.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_account_info.png" title="dbt Cloud - Account Info" />

5. После заполнения формы и нажатия **Complete Registration** вы автоматически войдете в dbt Cloud.

6. Перейдите в меню слева и нажмите на имя вашего аккаунта, затем выберите **Account settings**, выберите проект "Partner Connect Trial" и выберите **snowflake** в таблице обзора. Выберите редактирование и обновите поля **Database** и **Warehouse** на `analytics` и `transforming` соответственно.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_project_overview.png" title="dbt Cloud - Snowflake Project Overview" />

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_update_database_and_warehouse.png" title="dbt Cloud - Update Database and Warehouse" />

</TabItem>
<TabItem value="manual-connect" label="Подключение вручную">

1. Создайте новый проект в dbt Cloud. Перейдите в **Account settings** (нажав на имя вашего аккаунта в меню слева) и нажмите **+ New Project**.
2. Введите имя проекта и нажмите **Continue**.
3. Для склада нажмите **Snowflake**, затем **Next**, чтобы настроить ваше подключение.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_setup_snowflake_connection_start.png" title="dbt Cloud - Choose Snowflake Connection" />

4. Введите ваши **Settings** для Snowflake с:
    * **Account** &mdash; Найдите ваш аккаунт, используя URL пробного аккаунта Snowflake и удалив `snowflakecomputing.com`. Порядок информации вашего аккаунта будет варьироваться в зависимости от версии Snowflake. Например, URL классической консоли Snowflake может выглядеть так: `oq65696.west-us-2.azure.snowflakecomputing.com`. URL AppUI или Snowsight может выглядеть более так: `snowflakecomputing.com/west-us-2.azure/oq65696`. В обоих примерах ваш аккаунт будет: `oq65696.west-us-2.azure`. Для получения дополнительной информации см. [Идентификаторы аккаунтов](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html) в документации Snowflake.

        <Snippet path="snowflake-acct-name" />
    
    * **Role** &mdash; Оставьте пустым на данный момент. Вы можете обновить это до роли по умолчанию в Snowflake позже.
    * **Database** &mdash; `analytics`. Это указывает dbt создавать новые модели в базе данных analytics.
    * **Warehouse** &mdash; `transforming`. Это указывает dbt использовать склад transforming, который был создан ранее.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_account_settings.png" title="dbt Cloud - Snowflake Account Settings" />

5. Введите ваши **Development Credentials** для Snowflake с:
    * **Username** &mdash; Имя пользователя, которое вы создали для Snowflake. Имя пользователя не является вашим адресом электронной почты и обычно представляет собой ваше имя и фамилию, написанные слитно.
    * **Password** &mdash; Пароль, который вы установили при создании вашего аккаунта Snowflake.
    * **Schema** &mdash; Вы заметите, что имя схемы было автоматически создано для вас. По соглашению, это `dbt_<первая буква имени><фамилия>`. Это схема, напрямую связанная с вашей средой разработки, и именно здесь ваши модели будут создаваться при запуске dbt в облачной IDE.
    * **Target name** &mdash; Оставьте по умолчанию.
    * **Threads** &mdash; Оставьте как 4. Это количество одновременных подключений, которые dbt Cloud будет делать для одновременного создания моделей.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt Cloud - Snowflake Development Credentials" />

6. Нажмите **Test Connection**. Это проверяет, может ли dbt Cloud получить доступ к вашему аккаунту Snowflake.
7. Если тест подключения прошел успешно, нажмите **Next**. Если он не удался, возможно, вам нужно проверить настройки и учетные данные Snowflake.

</TabItem>
</Tabs>

## Настройка управляемого репозитория dbt Cloud
Если вы использовали Partner Connect, вы можете перейти к [инициализации вашего проекта dbt](#initialize-your-dbt-project-and-start-developing), так как Partner Connect предоставляет вам управляемый репозиторий. В противном случае вам нужно будет создать подключение к вашему репозиторию.

<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки
Теперь, когда у вас настроен репозиторий, вы можете инициализировать ваш проект и начать разработку в dbt Cloud:

1. Нажмите **Start developing in the IDE**. Это может занять несколько минут, чтобы ваш проект впервые запустился, так как он устанавливает ваше git-подключение, клонирует ваш репозиторий и тестирует подключение к складу.
2. Над деревом файлов слева нажмите **Initialize your project**. Это создаст структуру папок с примерами моделей.
3. Сделайте ваш начальный коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit`. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, где вы можете добавить новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из вашего склада и выполнять `dbt run`. Вы можете попробовать это сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить новый файл:
        ```sql
        select * from raw.jaffle_shop.customers
        ```
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

:::info
Если вы получаете ошибку недостаточных привилегий в Snowflake на этом этапе, это может быть связано с тем, что ваша роль в Snowflake не имеет разрешения на доступ к исходным данным, создание целевых таблиц и представлений или и то, и другое.

Чтобы устранить неполадки, используйте роль с достаточными привилегиями (например, `ACCOUNTADMIN`) и выполните следующие команды в Snowflake.

**Примечание**: Замените `snowflake_role_name` на роль, которую вы собираетесь использовать. Если вы запустили dbt Cloud с помощью Snowflake Partner Connect, используйте `pc_dbt_role` в качестве роли.

```
grant all on database raw to role snowflake_role_name;
grant all on database analytics to role snowflake_role_name;

grant all on schema raw.jaffle_shop to role snowflake_role_name;
grant all on schema raw.stripe to role snowflake_role_name;

grant all on all tables in database raw to role snowflake_role_name;
grant all on future tables in database raw to role snowflake_role_name;
```

:::

## Создание вашей первой модели

У вас есть два варианта работы с файлами в IDE dbt Cloud:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку, чтобы редактировать и фиксировать ваши изменения. Перейдите в **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать в защищенной основной ветке &mdash; Если вы предпочитаете редактировать, форматировать или проверять файлы и выполнять команды dbt непосредственно в вашей основной ветке git. IDE dbt Cloud предотвращает коммиты в защищенную ветку, поэтому вам будет предложено зафиксировать ваши изменения в новой ветке.

Назовите новую ветку `add-customers-model`.

1. Нажмите **...** рядом с директорией `models`, затем выберите **Create file**.
2. Назовите файл `customers.sql`, затем нажмите **Create**.
3. Скопируйте следующий запрос в файл и нажмите **Save**.

```sql
with customers as (

    select
        id as customer_id,
        first_name,
        last_name

    from raw.jaffle_shop.customers

),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from raw.jaffle_shop.orders

),

customer_orders as (

    select
        customer_id,

        min(order_date) as first_order_date,
        max(order_date) as most_recent_order_date,
        count(order_id) as number_of_orders

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
        coalesce(customer_orders.number_of_orders, 0) as number_of_orders

    from customers

    left join customer_orders using (customer_id)

)

select * from final
```

4. Введите `dbt run` в командной строке внизу экрана. Вы должны получить успешное выполнение и увидеть три модели.

Позже вы сможете подключить ваши инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не необработанные данные в вашем инструменте BI.

## Изменение способа материализации вашей модели

<Snippet path="quickstarts/change-way-model-materialized" />

## Удаление примерных моделей

<Snippet path="quickstarts/delete-example-models" />

## Создание моделей на основе других моделей

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте новый SQL-файл `models/stg_customers.sql` с SQL из CTE `customers` в нашем исходном запросе.
2. Создайте второй новый SQL-файл `models/stg_orders.sql` с SQL из CTE `orders` в нашем исходном запросе.

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from raw.jaffle_shop.customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from raw.jaffle_shop.orders
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

        group by 1

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

        left join customer_orders using (customer_id)

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

## Создание моделей на основе источников

Источники позволяют именовать и описывать данные, загруженные в ваш склад вашими инструментами извлечения и загрузки. Объявляя эти таблицы как источники в dbt, вы можете:
- выбирать из исходных таблиц в ваших моделях, используя функцию `{{ source() }}`, что помогает определить происхождение ваших данных
- тестировать ваши предположения о ваших исходных данных
- рассчитывать свежесть ваших исходных данных

1. Создайте новый YML-файл `models/sources.yml`.
2. Объявите источники, скопировав следующее в файл и нажав **Save**.

    <File name='models/sources.yml'>

    ```yml
    version: 2

    sources:
        - name: jaffle_shop
          description: Это реплика базы данных Postgres, используемой нашим приложением
          database: raw
          schema: jaffle_shop
          tables:
              - name: customers
                description: Одна запись на клиента.
              - name: orders
                description: Одна запись на заказ. Включает отмененные и удаленные заказы.
    ```

    </File>

3. Отредактируйте файл `models/stg_customers.sql`, чтобы выбирать из таблицы `customers` в источнике `jaffle_shop`.

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from {{ source('jaffle_shop', 'customers') }}
    ```

    </File>

4. Отредактируйте файл `models/stg_orders.sql`, чтобы выбирать из таблицы `orders` в источнике `jaffle_shop`.

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from {{ source('jaffle_shop', 'orders') }}
    ```

    </File>

5. Выполните `dbt run`.

    Результаты вашего `dbt run` будут точно такими же, как и на предыдущем шаге. Ваши модели `stg_customers` и `stg_orders` все еще будут запрашивать из того же источника необработанных данных в Snowflake. Используя `source`, вы можете тестировать и документировать ваши необработанные данные, а также понимать происхождение ваших источников.

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />