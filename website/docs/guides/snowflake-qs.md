---
title: "Быстрый старт для dbt Cloud и Snowflake"
id: "snowflake"
level: 'Начинающий'
icon: 'snowflake'
tags: ['dbt Cloud','Быстрый старт','Snowflake']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как использовать dbt Cloud с Snowflake. Оно покажет вам, как: 

- Создать новый рабочий лист Snowflake.
- Загрузить образцы данных в вашу учетную запись Snowflake.
- Подключить dbt Cloud к Snowflake.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавить источники в ваш проект dbt. Источники позволяют вам называть и описывать необработанные данные, уже загруженные в Snowflake.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.

Snowflake также предоставляет быстрый старт, чтобы вы могли узнать, как использовать dbt Cloud. Он использует другой публичный набор данных (Knoema Economy Data Atlas), чем тот, что показан в этом руководстве. Для получения дополнительной информации обратитесь к [Ускорению команд данных с помощью dbt Cloud и Snowflake](https://quickstarts.snowflake.com/guide/accelerating_data_teams_with_snowflake_and_dbt_cloud_hands_on_lab/) в документации Snowflake.

:::tip Видео для вас
Если вам интересно обучение с помощью видео, вы можете бесплатно ознакомиться с [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).

Вы также можете посмотреть [видео на YouTube о dbt и Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::
 
### Предварительные требования

- У вас есть [учетная запись dbt Cloud](https://www.getdbt.com/signup/). 
- У вас есть [пробная учетная запись Snowflake](https://signup.snowflake.com/). При создании пробной учетной записи убедитесь, что выбрали издание Snowflake **Enterprise**, чтобы получить доступ `ACCOUNTADMIN`. Для полноценной реализации вам следует учитывать организационные вопросы при выборе облачного провайдера. Для получения дополнительной информации смотрите [Введение в облачные платформы](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms.html) в документации Snowflake. Для целей этой настройки подойдут все облачные провайдеры и регионы, поэтому выбирайте любой, который вам нравится.

### Связанный контент

- Узнайте больше с помощью [курсов dbt Learn](https://learn.getdbt.com)
- [Как мы настраиваем Snowflake](https://blog.getdbt.com/how-we-configure-snowflake/)
- [CI задания](/docs/deploy/continuous-integration)
- [Задания на развертывание](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источников](/docs/deploy/source-freshness)

## Создание нового рабочего листа Snowflake 
1. Войдите в свою пробную учетную запись Snowflake. 
2. В интерфейсе Snowflake нажмите **+ Worksheet** в правом верхнем углу, чтобы создать новый рабочий лист.

## Загрузка данных 
Данные, используемые здесь, хранятся в виде CSV файлов в публичном S3 бакете, и следующие шаги помогут вам подготовить вашу учетную запись Snowflake для этих данных и загрузить их.

1. Создайте новый виртуальный склад, две новые базы данных (одну для необработанных данных, другую для будущей разработки dbt) и две новые схемы (одну для данных `jaffle_shop`, другую для данных `stripe`). 

    Для этого выполните следующие SQL команды, введя их в редакторе вашего нового рабочего листа Snowflake и нажав **Run** в правом верхнем углу интерфейса:
    ```sql
    create warehouse transforming;
    create database raw;
    create database analytics;
    create schema raw.jaffle_shop;
    create schema raw.stripe;
    ```

2. В базе данных `raw` и схемах `jaffle_shop` и `stripe` создайте три таблицы и загрузите в них соответствующие данные: 

    - Сначала удалите все содержимое (очистите) в редакторе рабочего листа Snowflake. Затем выполните эту SQL команду для создания таблицы `customer`:

        ```sql 
        create table raw.jaffle_shop.customers 
        ( id integer,
          first_name varchar,
          last_name varchar
        );
        ```

    - Удалите все содержимое в редакторе, затем выполните эту команду для загрузки данных в таблицу `customer`: 

        ```sql 
        copy into raw.jaffle_shop.customers (id, first_name, last_name)
        from 's3://dbt-tutorial-public/jaffle_shop_customers.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            ); 
        ```
    - Удалите все содержимое в редакторе (очистите), затем выполните эту команду для создания таблицы `orders`:
        ```sql
        create table raw.jaffle_shop.orders
        ( id integer,
          user_id integer,
          order_date date,
          status varchar,
          _etl_loaded_at timestamp default current_timestamp
        );
        ```

    - Удалите все содержимое в редакторе, затем выполните эту команду для загрузки данных в таблицу `orders`:
        ```sql
        copy into raw.jaffle_shop.orders (id, user_id, order_date, status)
        from 's3://dbt-tutorial-public/jaffle_shop_orders.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            );
        ```
    - Удалите все содержимое в редакторе (очистите), затем выполните эту команду для создания таблицы `payment`:
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
    - Удалите все содержимое в редакторе, затем выполните эту команду для загрузки данных в таблицу `payment`:
        ```sql
        copy into raw.stripe.payment (id, orderid, paymentmethod, status, amount, created)
        from 's3://dbt-tutorial-public/stripe_payments.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            );
        ```
3. Убедитесь, что данные загружены, выполнив эти SQL запросы. Подтвердите, что вы видите вывод для каждого из них. 
    ```sql
    select * from raw.jaffle_shop.customers;
    select * from raw.jaffle_shop.orders;
    select * from raw.stripe.payment;   
    ```

## Подключение dbt Cloud к Snowflake

Существует два способа подключения dbt Cloud к Snowflake. Первый вариант — Partner Connect, который предоставляет упрощенную настройку для создания вашей учетной записи dbt Cloud из вашей новой пробной учетной записи Snowflake. Второй вариант — создать учетную запись dbt Cloud отдельно и самостоятельно настроить подключение к Snowflake (подключение вручную). Если вы хотите быстро начать, dbt Labs рекомендует использовать Partner Connect. Если вы хотите настроить свою конфигурацию с самого начала и ознакомиться с процессом настройки dbt Cloud, dbt Labs рекомендует подключение вручную.

<Tabs>
<TabItem value="partner-connect" label="Использовать Partner Connect" default>

Использование Partner Connect позволяет вам создать полноценную учетную запись dbt с вашим [подключением Snowflake](/docs/cloud/connect-data-platform/connect-snowflake), [управляемым репозиторием](/docs/collaborate/git/managed-repository), [окружениями](/docs/build/custom-schemas#managing-environments) и учетными данными.

1. В интерфейсе Snowflake нажмите на значок дома в верхнем левом углу. В левой боковой панели выберите **Data Products**. Затем выберите **Partner Connect**. Найдите плитку dbt, прокручивая или используя строку поиска. Нажмите на плитку, чтобы подключиться к dbt.

    <Lightbox src="/img/snowflake_tutorial/snowflake_partner_connect_box.png" title="Плитка Partner Connect Snowflake" />

    Если вы используете классическую версию интерфейса Snowflake, вы можете нажать кнопку **Partner Connect** в верхней панели вашей учетной записи. Оттуда нажмите на плитку dbt, чтобы открыть окно подключения. 

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_partner_connect.png" title="Классический интерфейс Snowflake - Partner Connect" />

2. В всплывающем окне **Подключиться к dbt** найдите опцию **Дополнительные права** и выберите базы данных **RAW** и **ANALYTICS**. Это предоставит доступ вашей новой роли пользователя dbt к каждой базе данных. Затем нажмите **Connect**.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_connection_box.png" title="Классический интерфейс Snowflake - Окно подключения" />

    <Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_connection_box.png" title="Новый интерфейс Snowflake - Окно подключения" />

3. Нажмите **Activate**, когда появится всплывающее окно: 

<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_activation_window.png" title="Классический интерфейс Snowflake - Окно активации" />

<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_activation_window.png" title="Новый интерфейс Snowflake - Окно активации" />

4. После загрузки новой вкладки вы увидите форму. Если вы уже создали учетную запись dbt Cloud, вам будет предложено ввести имя учетной записи. Если вы еще не создали учетную запись, вам будет предложено ввести имя учетной записи и пароль.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_account_info.png" title="dbt Cloud - Информация об учетной записи" />

5. После заполнения формы и нажатия **Complete Registration** вы автоматически войдете в dbt Cloud.

6. Перейдите в меню слева и нажмите на имя вашей учетной записи, затем выберите **Account settings**, выберите проект "Partner Connect Trial" и выберите **snowflake** в таблице обзора. Выберите редактирование и обновите поля **Database** и **Warehouse** на `analytics` и `transforming`, соответственно.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_project_overview.png" title="dbt Cloud - Обзор проекта Snowflake" />

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_update_database_and_warehouse.png" title="dbt Cloud - Обновление базы данных и склада" />

</TabItem>
<TabItem value="manual-connect" label="Подключить вручную">


1. Создайте новый проект в dbt Cloud. Перейдите в **Account settings** (нажав на имя вашей учетной записи в левой боковой панели) и нажмите **+ New Project**.
2. Введите имя проекта и нажмите **Continue**.
3. Для склада нажмите **Snowflake**, затем **Next**, чтобы настроить ваше подключение.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_setup_snowflake_connection_start.png" title="dbt Cloud - Выбор подключения Snowflake" />

4. Введите ваши **Настройки** для Snowflake: 
    * **Account** &mdash; Найдите вашу учетную запись, используя URL пробной учетной записи Snowflake и удалив `snowflakecomputing.com`. Порядок информации о вашей учетной записи может варьироваться в зависимости от версии Snowflake. Например, URL классической консоли Snowflake может выглядеть так: `oq65696.west-us-2.azure.snowflakecomputing.com`. URL AppUI или Snowsight может выглядеть более так: `snowflakecomputing.com/west-us-2.azure/oq65696`. В обоих примерах ваша учетная запись будет: `oq65696.west-us-2.azure`. Для получения дополнительной информации смотрите [Идентификаторы учетной записи](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html) в документации Snowflake.  

        <Snippet path="snowflake-acct-name" />
    
    * **Role** &mdash; Оставьте пустым на данный момент. Вы можете обновить это до роли по умолчанию Snowflake позже.
    * **Database** &mdash; `analytics`. Это указывает dbt создавать новые модели в базе данных аналитики.
    * **Warehouse** &mdash; `transforming`. Это указывает dbt использовать склад transforming, который был создан ранее.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_account_settings.png" title="dbt Cloud - Настройки учетной записи Snowflake" />

5. Введите ваши **Учетные данные для разработки** для Snowflake: 
    * **Username** &mdash; Имя пользователя, которое вы создали для Snowflake. Имя пользователя не является вашим адресом электронной почты и обычно состоит из вашего имени и фамилии, объединенных в одно слово. 
    * **Password** &mdash; Пароль, который вы установили при создании учетной записи Snowflake.
    * **Schema** &mdash; Вы заметите, что имя схемы было автоматически создано для вас. По умолчанию это `dbt_<первая_буква_имени><фамилия>`. Это схема, подключенная непосредственно к вашей среде разработки, и именно здесь будут создаваться ваши модели при выполнении dbt в Cloud IDE.
    * **Target name** &mdash; Оставьте по умолчанию.
    * **Threads** &mdash; Оставьте 4. Это количество одновременных подключений, которые dbt Cloud будет делать для одновременного создания моделей.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt Cloud - Учетные данные разработки Snowflake" />

6. Нажмите **Test Connection**. Это проверяет, что dbt Cloud может получить доступ к вашей учетной записи Snowflake.
7. Если тест подключения прошел успешно, нажмите **Next**. Если он не удался, вам может потребоваться проверить настройки и учетные данные Snowflake.

</TabItem>
</Tabs>

## Настройка управляемого репозитория dbt Cloud 
Если вы использовали Partner Connect, вы можете перейти к [инициализации вашего проекта dbt](#initialize-your-dbt-project-and-start-developing), так как Partner Connect предоставляет вам управляемый репозиторий. В противном случае вам нужно будет создать подключение к вашему репозиторию. 

<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки
Теперь, когда у вас настроен репозиторий, вы можете инициализировать ваш проект и начать разработку в dbt Cloud:

1. Нажмите **Start developing in the IDE**. Это может занять несколько минут, чтобы ваш проект запустился в первый раз, так как устанавливается ваше git-соединение, клонируется ваш репозиторий и проверяется соединение со складом.
2. Над деревом файлов слева нажмите **Initialize your project**. Это создаст вашу структуру папок с примерами моделей.
3. Сделайте ваш первый коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit`. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, в которой вы можете добавить новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из вашего склада и выполнять `dbt run`. Попробуйте это сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить новый файл: 
        ```sql
        select * from raw.jaffle_shop.customers
        ```
    - В строке команд внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

:::info
Если вы получите ошибку недостаточных привилегий в Snowflake на этом этапе, это может быть связано с тем, что ваша роль Snowflake не имеет разрешения на доступ к необработанным исходным данным, для создания целевых таблиц и представлений, или к обоим.

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

У вас есть два варианта работы с файлами в dbt Cloud IDE:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку, чтобы редактировать и коммитить ваши изменения. Перейдите в **Version Control** в левой боковой панели и нажмите **Create branch**.
- Редактировать в защищенной основной ветке &mdash; Если вы предпочитаете редактировать, форматировать или проверять файлы и выполнять команды dbt непосредственно в вашей основной git-ветке. dbt Cloud IDE предотвращает коммиты в защищенной ветке, поэтому вам будет предложено коммитить ваши изменения в новую ветку.

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

4. Введите `dbt run` в командной строке внизу экрана. Вы должны получить успешный запуск и увидеть три модели.

Позже вы можете подключить свои инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не необработанные данные в вашем инструменте BI.

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

    На этот раз, когда вы выполнили `dbt run`, были созданы отдельные представления/таблицы для `stg_customers`, `stg_orders` и `customers`. dbt определил порядок выполнения этих моделей. Поскольку `customers` зависит от `stg_customers` и `stg_orders`, dbt создает `customers` последним. Вам не нужно явно определять эти зависимости.

#### Часто задаваемые вопросы {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="Как мне организовать свой проект, когда я создаю больше моделей? Как мне называть свои модели?" />

## Создание моделей на основе источников

Источники позволяют называть и описывать данные, загруженные в ваш склад вашими инструментами извлечения и загрузки. Объявляя эти таблицы как источники в dbt, вы можете:
- выбирать из таблиц источников в ваших моделях, используя функцию `{{ source() }}`, что помогает определить происхождение ваших данных
- тестировать ваши предположения о ваших исходных данных
- вычислять свежесть ваших исходных данных

1. Создайте новый YML файл `models/sources.yml`.
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
                description: Одна запись на каждого клиента.
              - name: orders
                description: Одна запись на каждый заказ. Включает отмененные и удаленные заказы.
    ```

    </File>

3. Отредактируйте файл `models/stg_customers.sql`, чтобы выбрать из таблицы `customers` в источнике `jaffle_shop`.

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from {{ source('jaffle_shop', 'customers') }}
    ```

    </File>

4. Отредактируйте файл `models/stg_orders.sql`, чтобы выбрать из таблицы `orders` в источнике `jaffle_shop`.

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

    Результаты вашего `dbt run` будут точно такими же, как на предыдущем шаге. Ваши модели `stg_customers` и `stg_orders` по-прежнему будут запрашивать одни и те же необработанные данные в Snowflake. Используя `source`, вы можете тестировать и документировать ваши необработанные данные, а также понимать происхождение ваших источников. 

</div> 

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />

