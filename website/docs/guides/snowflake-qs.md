---
title: "Быстрый старт для dbt и Snowflake"
id: "snowflake"
level: 'Beginner'
icon: 'snowflake'
tags: ['dbt platform','Quickstart','Snowflake']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом кратком руководстве вы узнаете, как использовать <Constant name="cloud" /> с Snowflake. В нём показано, как:

- Создать новый worksheet в Snowflake.
- Загрузить пример данных в ваш аккаунт Snowflake.
- Подключить <Constant name="cloud" /> к Snowflake.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор `select`.
- Добавить источники (sources) в ваш проект dbt. Sources позволяют именовать и описывать «сырые» данные, которые уже загружены в Snowflake.
- Добавить тесты к вашим моделям.
- Задокументировать ваши модели.
- Запланировать выполнение job.

Snowflake также предоставляет собственное quickstart‑руководство, которое помогает познакомиться с использованием <Constant name="cloud" />. В нём используется другой публичный набор данных (Knoema Economy Data Atlas), отличный от того, который показан в этом руководстве. Подробнее см. в документации Snowflake:  
[Accelerating Data Teams with <Constant name="cloud" /> & Snowflake](https://quickstarts.snowflake.com/guide/accelerating_data_teams_with_snowflake_and_dbt_cloud_hands_on_lab/).

:::tip Видео для вас
Вы можете бесплатно ознакомиться с [Основами dbt](https://learn.getdbt.com/courses/dbt-fundamentals), если вас интересует обучение с видео.

Вы также можете посмотреть [видео на YouTube о dbt и Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::

- У вас есть аккаунт [<Constant name="cloud" />](https://www.getdbt.com/signup/).  
- У вас есть [пробный аккаунт Snowflake](https://signup.snowflake.com/). При создании пробного аккаунта обязательно выберите редакцию Snowflake **Enterprise**, чтобы у вас был доступ `ACCOUNTADMIN`. Для полноценной реализации стоит учитывать организационные вопросы при выборе облачного провайдера. Подробнее см. раздел [Introduction to Cloud Platforms](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms.html) в документации Snowflake. В рамках данной настройки подойдут любые облачные провайдеры и регионы, поэтому вы можете выбрать любой вариант.

- У вас есть [аккаунт dbt Cloud](https://www.getdbt.com/signup/).
- У вас есть [пробный аккаунт Snowflake](https://signup.snowflake.com/). При создании пробного аккаунта убедитесь, что выбрали издание **Enterprise** Snowflake, чтобы у вас был доступ `ACCOUNTADMIN`. Для полной реализации вам следует учитывать организационные вопросы при выборе облачного провайдера. Для получения дополнительной информации см. [Введение в облачные платформы](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms.html) в документации Snowflake. Для целей этой настройки все облачные провайдеры и регионы будут работать, так что выберите любой, который вам нравится.

### Связанные материалы

## Create a new Snowflake worksheet  
1. Войдите в свою пробную учетную запись Snowflake.  
2. В интерфейсе Snowflake нажмите **+ Create** в левом верхнем углу под логотипом Snowflake — откроется выпадающее меню. Выберите первый пункт **SQL Worksheet**.  

## Load data  

import LoadData from '/snippets/_load-data.md';

<LoadData/>

## Connect dbt to Snowflake  

Существует два способа подключить <Constant name="cloud" /> к Snowflake. Первый вариант — Partner Connect, который предоставляет упрощенный процесс настройки и позволяет создать учетную запись <Constant name="cloud" /> прямо из вашей новой пробной учетной записи Snowflake. Второй вариант — создать учетную запись <Constant name="cloud" /> отдельно и самостоятельно настроить подключение к Snowflake (ручное подключение). Если вы хотите начать как можно быстрее, dbt Labs рекомендует использовать Partner Connect. Если же вы хотите с самого начала гибко настроить окружение и лучше разобраться в процессе настройки <Constant name="cloud" />, dbt Labs рекомендует выполнять подключение вручную.

<Tabs>
<TabItem value="partner-connect" label="Использовать Partner Connect" default>

Использование Partner Connect позволяет создать полноценную учётную запись dbt, включающую [подключение к Snowflake](/docs/cloud/connect-data-platform/connect-snowflake), [управляемый репозиторий](/docs/cloud/git/managed-repository), [окружения](/docs/build/custom-schemas#managing-environments) и учётные данные.

1. В интерфейсе Snowflake нажмите на значок дома в левом верхнем углу. В левой боковой панели выберите **Data Products**. Затем выберите **Partner Connect**. Найдите плитку dbt, прокручивая или используя поиск по dbt в строке поиска. Нажмите на плитку, чтобы подключиться к dbt.

    <Lightbox src="/img/snowflake_tutorial/snowflake_partner_connect_box.png" width="60%" title="Snowflake Partner Connect Box" />

    Если вы используете классическую версию интерфейса Snowflake, вы можете нажать кнопку **Partner Connect** в верхней панели вашего аккаунта. Оттуда нажмите на плитку dbt, чтобы открыть окно подключения.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_partner_connect.png" title="Snowflake Classic UI - Partner Connect" />

2. В всплывающем окне **Connect to dbt** найдите опцию **Optional Grant** и выберите базы данных **RAW** и **ANALYTICS**. Это предоставит доступ для вашей новой роли пользователя dbt к каждой базе данных. Затем нажмите **Connect**.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_connection_box.png" title="Snowflake Classic UI - Connection Box" />

    <Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_connection_box.png" title="Snowflake New UI - Connection Box" />

3. Нажмите **Activate**, когда появится всплывающее окно:

<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_activation_window.png" title="Snowflake Classic UI - Actviation Window" />

<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_activation_window.png" title="Snowflake New UI - Activation Window" />

4. После загрузки новой вкладки вы увидите форму. Если вы уже создали аккаунт <Constant name="cloud" />, вам будет предложено указать имя аккаунта. Если вы ещё не создали аккаунт, вам будет предложено указать имя аккаунта и пароль.


5. После того как вы заполните форму и нажмёте **Complete Registration**, вы автоматически войдёте в <Constant name="cloud" />.

6. Перейдите в меню слева и нажмите на имя вашего аккаунта, затем выберите **Account settings**, выберите проект "Partner Connect Trial" и выберите **snowflake** в таблице обзора. Выберите редактирование и обновите поля **Database** и **Warehouse** на `analytics` и `transforming` соответственно.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_project_overview.png" title="dbt - Snowflake Project Overview" />

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_update_database_and_warehouse.png" title="dbt - Update Database and Warehouse" />

</TabItem>
<TabItem value="manual-connect" label="Подключение вручную">

1. Создайте новый проект в <Constant name="cloud" />. Перейдите в **Account settings** (нажав на имя своей учетной записи в меню слева) и нажмите **+ New Project**.
2. Введите имя проекта и нажмите **Continue**.
3. В разделе **Configure your development environment** нажмите на выпадающее меню **Connection** и выберите **Add new connection**. Вы будете перенаправлены на страницу настройки подключения.
4. В разделе **Type** выберите **Snowflake**.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_setup_snowflake_connection_start.png" title="dbt - Choose Snowflake Connection" />

5. Введите ваши **Settings** для Snowflake:
    * **Account** — Найдите идентификатор вашей учетной записи, используя URL пробной учетной записи Snowflake и удалив `snowflakecomputing.com`. Порядок элементов в идентификаторе учетной записи может отличаться в зависимости от версии Snowflake. Например, URL классической консоли Snowflake может выглядеть так: `oq65696.west-us-2.azure.snowflakecomputing.com`. URL AppUI или Snowsight может выглядеть примерно так: `snowflakecomputing.com/west-us-2.azure/oq65696`. В обоих примерах идентификатор вашей учетной записи будет: `oq65696.west-us-2.azure`. Подробнее см. раздел [Account Identifiers](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html) в документации Snowflake.

        <Snippet path="snowflake-acct-name" />
    
    * **Role** &mdash; Оставьте пустым на данный момент. Вы можете обновить это до роли по умолчанию в Snowflake позже.
    * **Database** &mdash; `analytics`. Это указывает dbt создавать новые модели в базе данных analytics.
    * **Warehouse** &mdash; `transforming`. Это указывает dbt использовать склад transforming, который был создан ранее.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_account_settings.png" title="dbt - Snowflake Account Settings" />

6. Нажмите **Save**.
7. Настройте свои персональные учётные данные для разработки, перейдя в **Your profile** > **Credentials**.
8. Выберите проект, который использует подключение Snowflake.
9. Нажмите ссылку **configure your development environment and add a connection**. Вы будете перенаправлены на страницу, где можно ввести персональные учётные данные для разработки.
10. Введите свои **Development credentials** для Snowflake:
    * **Username** &mdash; Имя пользователя, которое вы создали в Snowflake. Это не адрес электронной почты; обычно это имя и фамилия, объединённые в одно слово.
    * **Password** &mdash; Пароль, который вы задали при создании учётной записи Snowflake.
    * **Schema** &mdash; Обратите внимание, что имя схемы было создано автоматически. По соглашению об именовании это `dbt_<first-initial><last-name>`. Эта схема напрямую связана с вашей средой разработки, и именно в ней будут создаваться модели при запуске dbt в <Constant name="cloud_ide" />.
    * **Target name** &mdash; Оставьте значение по умолчанию.
    * **Threads** &mdash; Оставьте значение 4. Это количество одновременных подключений, которые <Constant name="cloud" /> будет использовать для параллельной сборки моделей.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt - Snowflake Development Credentials" />

11. Нажмите **Test connection**. Это проверяет, что <Constant name="cloud" /> может получить доступ к вашему аккаунту Snowflake.  
12. Если тест прошёл успешно, нажмите **Save**, чтобы завершить настройку. Если тест завершился с ошибкой, возможно, вам нужно проверить настройки Snowflake и учётные данные.

</TabItem>
</Tabs>

## Настройка управляемого репозитория dbt
Если вы использовали Partner Connect, вы можете перейти сразу к разделу [инициализация вашего dbt‑проекта](#initialize-your-dbt-project-and-start-developing), так как Partner Connect уже предоставляет вам управляемый репозиторий. В противном случае вам потребуется самостоятельно создать подключение к репозиторию.

<Snippet path="tutorial-managed-repo" />

## Инициализация вашего dbt‑проекта и начало разработки
Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="cloud" />:

1. Нажмите **Start developing in the <Constant name="cloud_ide" />**. При первом запуске это может занять несколько минут, так как система устанавливает git‑подключение, клонирует репозиторий и проверяет соединение с хранилищем данных.
2. Над деревом файлов слева нажмите **Initialize your project**. Это создаст структуру папок с примерами моделей.
3. Сделайте первый коммит, нажав **Commit and sync**. В качестве сообщения коммита используйте `initial commit`. Это создаст первый коммит в вашем управляемом репозитории и позволит открыть ветку, в которой вы сможете добавлять новый dbt‑код.
4. Теперь вы можете напрямую выполнять запросы к вашему хранилищу данных и запускать `dbt run`. Вы можете попробовать это прямо сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить новый файл.
        ```sql
        select * from raw.jaffle_shop.customers
        ```
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

:::info
Если вы получаете ошибку недостаточных привилегий в Snowflake на этом этапе, это может быть связано с тем, что ваша роль в Snowflake не имеет разрешения на доступ к исходным данным, создание целевых таблиц и представлений или и то, и другое.

Чтобы устранить неполадки, используйте роль с достаточными привилегиями (например, `ACCOUNTADMIN`) и выполните следующие команды в Snowflake.

**Примечание**: Замените `snowflake_role_name` на роль, которую вы планируете использовать. Если вы запустили <Constant name="cloud" /> через Snowflake Partner Connect, используйте роль `pc_dbt_role`.

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

У вас есть два варианта работы с файлами в <Constant name="cloud_ide" />:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку, чтобы редактировать файлы и коммитить изменения. Перейдите в **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать в защищённой основной ветке &mdash; Если вы предпочитаете редактировать, форматировать или выполнять линтинг файлов, а также запускать команды dbt напрямую в вашей основной git-ветке. <Constant name="cloud_ide" /> не позволяет выполнять коммиты в защищённую ветку, поэтому вам будет предложено закоммитить изменения в новую ветку.

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

Позже вы сможете подключить к этим представлениям и таблицам инструменты бизнес-аналитики (BI), чтобы они читали уже очищенные данные, а не сырые исходные данные.

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