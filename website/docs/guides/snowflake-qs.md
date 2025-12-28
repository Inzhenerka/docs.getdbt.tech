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

В этом руководстве быстрого старта вы узнаете, как использовать <Constant name="cloud" /> со Snowflake. В нем показано, как:

- Создать новый worksheet в Snowflake.
- Загрузить пример данных в ваш аккаунт Snowflake.
- Подключить <Constant name="cloud" /> к Snowflake.
- Взять пример запроса и превратить его в модель в вашем dbt‑проекте. Модель в dbt — это SQL‑запрос `select`.
- Добавить источники (sources) в ваш dbt‑проект. Источники позволяют именовать и описывать сырые данные, уже загруженные в Snowflake.
- Добавить тесты к вашим моделям.
- Задокументировать ваши модели.
- Запланировать выполнение job.

Snowflake также предоставляет собственный quickstart, который поможет вам изучить использование <Constant name="cloud" />. В нем используется другой публичный датасет (Knoema Economy Data Atlas), отличный от того, что показан в этом руководстве. Подробнее см. [Accelerating Data Teams with <Constant name="cloud" /> & Snowflake](https://quickstarts.snowflake.com/guide/accelerating_data_teams_with_snowflake_and_dbt_cloud_hands_on_lab/) в документации Snowflake.

:::tip Видео для вас
Вы можете бесплатно пройти курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals), если вам интересен формат обучения с видео.

Также вы можете посмотреть [видео на YouTube про dbt и Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::
 
### Предварительные требования​

- У вас есть [аккаунт <Constant name="cloud" />](https://www.getdbt.com/signup/). 
- У вас есть [trial‑аккаунт Snowflake](https://signup.snowflake.com/). При создании trial‑аккаунта обязательно выберите редакцию Snowflake **Enterprise**, чтобы у вас был доступ `ACCOUNTADMIN`. Для полноценного внедрения стоит учитывать организационные вопросы при выборе облачного провайдера. Подробнее см. [Introduction to Cloud Platforms](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms.html) в документации Snowflake. Для целей этой настройки подойдут любые облачные провайдеры и регионы — выбирайте любой удобный.

### Связанные материалы

- Узнайте больше с помощью [курсов dbt Learn](https://learn.getdbt.com)
- [Как мы настраиваем Snowflake](https://blog.getdbt.com/how-we-configure-snowflake/)
- [CI jobs](/docs/deploy/continuous-integration)
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [Уведомления о job](/docs/deploy/job-notifications)
- [Актуальность источников (Source freshness)](/docs/deploy/source-freshness)

## Создание нового Snowflake worksheet 
1. Войдите в ваш trial‑аккаунт Snowflake. 
2. В интерфейсе Snowflake нажмите **+ Create** в левом верхнем углу под логотипом Snowflake — откроется выпадающее меню. Выберите первый пункт **SQL Worksheet**. 

## Загрузка данных 

import LoadData from '/snippets/_load-data.md';

<LoadData/>

## Подключение dbt к Snowflake

Существует два способа подключить <Constant name="cloud" /> к Snowflake. Первый — Partner Connect, который предоставляет упрощенную настройку и позволяет создать аккаунт <Constant name="cloud" /> прямо из вашего нового trial‑аккаунта Snowflake. Второй — создать аккаунт <Constant name="cloud" /> отдельно и настроить подключение к Snowflake вручную. Если вы хотите начать как можно быстрее, dbt Labs рекомендует использовать Partner Connect. Если же вы хотите с самого начала кастомизировать настройку и лучше разобраться в процессе конфигурации <Constant name="cloud" />, dbt Labs рекомендует ручное подключение.

<Tabs>
<TabItem value="partner-connect" label="Использовать Partner Connect" default>

Использование Partner Connect позволяет создать полноценный dbt‑аккаунт с [подключением к Snowflake](/docs/cloud/connect-data-platform/connect-snowflake), [управляемым репозиторием](/docs/cloud/git/managed-repository), [окружениями](/docs/build/custom-schemas#managing-environments) и учетными данными.

1. В интерфейсе Snowflake нажмите на иконку «домой» в левом верхнем углу. В левой боковой панели выберите **Data Products**, затем — **Partner Connect**. Найдите плитку dbt, прокрутив список или воспользовавшись поиском. Нажмите на плитку, чтобы подключиться к dbt.

    <Lightbox src="/img/snowflake_tutorial/snowflake_partner_connect_box.png" width="60%" title="Snowflake Partner Connect Box" />

    Если вы используете классическую версию интерфейса Snowflake, нажмите кнопку **Partner Connect** в верхней панели аккаунта. Затем нажмите на плитку dbt, чтобы открыть окно подключения.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_partner_connect.png" title="Snowflake Classic UI - Partner Connect" />

2. Во всплывающем окне **Connect to dbt** найдите опцию **Optional Grant** и выберите базы данных **RAW** и **ANALYTICS**. Это предоставит доступ новой роли пользователя dbt к каждой базе данных. Затем нажмите **Connect**.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_connection_box.png" title="Snowflake Classic UI - Connection Box" />

    <Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_connection_box.png" title="Snowflake New UI - Connection Box" />

3. Когда появится всплывающее окно, нажмите **Activate**: 

<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_activation_window.png" title="Snowflake Classic UI - Actviation Window" />

<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_activation_window.png" title="Snowflake New UI - Activation Window" />

4. После загрузки новой вкладки вы увидите форму. Если вы уже создавали аккаунт <Constant name="cloud" />, вас попросят указать имя аккаунта. Если аккаунт еще не создан — потребуется указать имя аккаунта и пароль.

5. После заполнения формы и нажатия **Complete Registration** вы будете автоматически авторизованы в <Constant name="cloud" />.

6. В левом меню нажмите на имя аккаунта, затем выберите **Account settings**, выберите проект "Partner Connect Trial" и в таблице overview выберите **snowflake**. Нажмите edit и обновите поля **Database** и **Warehouse**, установив значения `analytics` и `transforming` соответственно.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_project_overview.png" title="dbt - Snowflake Project Overview" />

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_update_database_and_warehouse.png" title="dbt - Update Database and Warehouse" />

</TabItem>
<TabItem value="manual-connect" label="Подключить вручную">

1. Создайте новый проект в <Constant name="cloud" />. Перейдите в **Account settings** (нажав на имя аккаунта в левом меню) и нажмите **+ New Project**.
2. Введите имя проекта и нажмите **Continue**.
3. В разделе **Configure your development environment** откройте выпадающее меню **Connection** и выберите **Add new connection**. Это перенаправит вас к настройкам подключения.
4. В разделе **Type** выберите **Snowflake**.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_setup_snowflake_connection_start.png" title="dbt - Choose Snowflake Connection" />

5. Укажите **Settings** для Snowflake:
    * **Account** &mdash; Найдите ваш аккаунт, используя URL trial‑аккаунта Snowflake, удалив из него `snowflakecomputing.com`. Порядок информации в аккаунте зависит от версии Snowflake. Например, URL классической консоли может выглядеть так: `oq65696.west-us-2.azure.snowflakecomputing.com`. URL AppUI или Snowsight может выглядеть так: `snowflakecomputing.com/west-us-2.azure/oq65696`. В обоих случаях значением аккаунта будет: `oq65696.west-us-2.azure`. Подробнее см. [Account Identifiers](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html) в документации Snowflake.  

        <Snippet path="snowflake-acct-name" />
    
    * **Role** &mdash; Пока оставьте пустым. Позже вы сможете задать роль Snowflake по умолчанию.
    * **Database** &mdash; `analytics`. Это указывает dbt создавать новые модели в базе данных analytics.
    * **Warehouse** &mdash; `transforming`. Это указывает dbt использовать warehouse transforming, созданный ранее.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_account_settings.png" title="dbt - Snowflake Account Settings" />

6. Нажмите **Save**.
7. Настройте персональные учетные данные для разработки, перейдя в **Your profile** > **Credentials**.
8. Выберите проект, использующий подключение к Snowflake.
9. Нажмите ссылку **configure your development environment and add a connection**. Вы перейдете на страницу ввода персональных учетных данных.
10. Введите **Development credentials** для Snowflake:
    * **Username** &mdash; Имя пользователя, созданное в Snowflake. Обычно это не email, а имя и фамилия, объединенные в одно слово.
    * **Password** &mdash; Пароль, заданный при создании аккаунта Snowflake.
    * **Schema** &mdash; Обратите внимание, что имя схемы было создано автоматически. По соглашению это `dbt_<first-initial><last-name>`. Эта схема напрямую связана с вашим окружением разработки, и именно здесь будут создаваться модели при запуске dbt в <Constant name="cloud_ide" />.
    * **Target name** &mdash; Оставьте значение по умолчанию.
    * **Threads** &mdash; Оставьте значение 4. Это количество одновременных подключений, которые <Constant name="cloud" /> будет использовать для параллельной сборки моделей.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt - Snowflake Development Credentials" />

11. Нажмите **Test connection**. Это проверит, что <Constant name="cloud" /> может получить доступ к вашему аккаунту Snowflake.
12. Если тест прошел успешно, нажмите **Save**, чтобы завершить настройку. Если тест не прошел, проверьте настройки Snowflake и учетные данные.

</TabItem>
</Tabs>

## Настройка управляемого репозитория dbt
Если вы использовали Partner Connect, можете перейти сразу к разделу [инициализация dbt‑проекта](#initialize-your-dbt-project-and-start-developing), так как Partner Connect уже предоставляет управляемый репозиторий. В противном случае вам потребуется создать подключение к репозиторию вручную.

<Snippet path="tutorial-managed-repo" />

## Инициализация dbt‑проекта и начало разработки
Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="cloud" />:

1. Нажмите **Start developing in the <Constant name="cloud_ide" />**. При первом запуске это может занять несколько минут, так как настраивается git‑подключение, клонируется репозиторий и проверяется соединение с warehouse.
2. Над деревом файлов слева нажмите **Initialize your project**. Это создаст структуру папок с примерами моделей.
3. Сделайте первый коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit`. Это создаст первый коммит в управляемом репозитории и позволит открыть новую ветку для добавления dbt‑кода.
4. Теперь вы можете напрямую выполнять запросы к warehouse и запускать `dbt run`. Попробуйте сделать это сейчас:
    - Нажмите **+ Create new file**, добавьте следующий запрос в новый файл и нажмите **Save as**:
        ```sql
        select * from raw.jaffle_shop.customers
        ```
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

:::info
Если на этом этапе вы получаете ошибку недостаточных прав доступа (insufficient privileges) в Snowflake, возможно, роль Snowflake не имеет разрешений на доступ к сырым данным, на создание целевых таблиц и представлений, или и на то и на другое.

Для устранения проблемы используйте роль с достаточными правами (например, `ACCOUNTADMIN`) и выполните следующие команды в Snowflake.

**Примечание**: Замените `snowflake_role_name` на роль, которую вы планируете использовать. Если вы запускали <Constant name="cloud" /> через Snowflake Partner Connect, используйте роль `pc_dbt_role`.

```
grant all on database raw to role snowflake_role_name;
grant all on database analytics to role snowflake_role_name;

grant all on schema raw.jaffle_shop to role snowflake_role_name;
grant all on schema raw.stripe to role snowflake_role_name;

grant all on all tables in database raw to role snowflake_role_name;
grant all on future tables in database raw to role snowflake_role_name;
```

:::

## Создание первой модели

В <Constant name="cloud_ide" /> есть два варианта работы с файлами:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку для редактирования и коммита изменений. Перейдите в **Version Control** в левом сайдбаре и нажмите **Create branch**.
- Редактировать в защищенной основной ветке &mdash; Если вы предпочитаете редактировать, форматировать или линтить файлы и выполнять dbt‑команды прямо в основной git‑ветке. <Constant name="cloud_ide" /> не позволяет делать коммиты в защищенную ветку, поэтому вам будет предложено закоммитить изменения в новую ветку.

Назовите новую ветку `add-customers-model`.

1. Нажмите **...** рядом с директорией `models`, затем выберите **Create file**.  
2. Назовите файл `customers.sql` и нажмите **Create**.
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

4. Введите `dbt run` в командной строке внизу экрана. Запуск должен завершиться успешно, и вы увидите три модели.

Позже вы сможете подключить инструменты бизнес‑аналитики (BI) к этим представлениям и таблицам, чтобы они читали уже очищенные данные, а не сырые.

## Изменение способа материализации модели

<Snippet path="quickstarts/change-way-model-materialized" />

## Удаление примерных моделей

<Snippet path="quickstarts/delete-example-models" />

## Построение моделей поверх других моделей

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте новый SQL‑файл `models/stg_customers.sql` с SQL из CTE `customers` в нашем исходном запросе.
2. Создайте второй SQL‑файл `models/stg_orders.sql` с SQL из CTE `orders` в нашем исходном запросе.

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

3. Отредактируйте SQL в файле `models/customers.sql` следующим образом:

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

    В этот раз при выполнении `dbt run` были созданы отдельные представления/таблицы для `stg_customers`, `stg_orders` и `customers`. dbt самостоятельно определил порядок выполнения моделей. Поскольку `customers` зависит от `stg_customers` и `stg_orders`, dbt собирает `customers` последней. Явно определять зависимости не требуется.

#### Часто задаваемые вопросы {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="По мере создания новых моделей, как лучше организовать проект? Как называть модели?" />

## Построение моделей поверх источников

Источники (sources) позволяют именовать и описывать данные, загруженные в ваш warehouse инструментами извлечения и загрузки. Объявляя эти таблицы как источники в dbt, вы можете:
- выбирать данные из source‑таблиц в моделях с помощью функции `{{ source() }}`, определяя lineage данных;
- проверять ваши предположения о качестве исходных данных;
- рассчитывать актуальность (freshness) исходных данных.

1. Создайте новый YML‑файл `models/sources.yml`.
2. Объявите источники, скопировав следующий код в файл и нажав **Save**.

    <File name='models/sources.yml'>

    ```yml

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

3. Отредактируйте файл `models/stg_customers.sql`, чтобы выбирать данные из таблицы `customers` источника `jaffle_shop`.

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from {{ source('jaffle_shop', 'customers') }}
    ```

    </File>

4. Отредактируйте файл `models/stg_orders.sql`, чтобы выбирать данные из таблицы `orders` источника `jaffle_shop`.

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

    Результаты `dbt run` будут точно такими же, как и на предыдущем шаге. Модели `stg_customers` и `stg_orders`
    по‑прежнему будут обращаться к тем же сырым данным в Snowflake. Используя `source`, вы можете
    тестировать и документировать сырые данные, а также понимать lineage ваших источников. 

</div> 

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />
