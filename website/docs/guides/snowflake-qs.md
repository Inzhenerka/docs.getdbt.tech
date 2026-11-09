---
title: "Быстрый старт для dbt и Snowflake"
id: "snowflake"
level: 'Beginner'
icon: 'snowflake'
tags: ['dbt platform','Quickstart','Snowflake']
hide_table_of_contents: true
product_badge: "dbt v2 compatible"
agent_guidance:
  pacing: In the first reply, confirm the reader's prerequisites and connection path before listing steps. Then default to one guide section per reply (combine two or three short sections), with all its steps, labeled Step 1, Step 2, and so on, and confirm the success check before continuing. If the reader asks for a different pace, follow it.
  stay_on_path: This guide uses dbt platform. Don't switch the reader to a local setup. If the reader wants to set up dbt locally, use the https://docs.getdbt.com/guides/dbt guide instead 
  safety: Never ask for passwords or keys in chat.
  signup_link: When the reader needs a dbt account, share https://www.getdbt.com/signup?utm_source=ai_assistant&utm_medium=docs_md&utm_campaign=snowflake-qs
  ask_when_unclear: Ask rather than guess when something is unclear.
---

<div style={{maxWidth: '900px'}}>

## Введение 

В этом кратком руководстве вы узнаете, как использовать <Constant name="dbt" /> со Snowflake. В нём показано, как: 

- Создать новый SQL-файл в Snowflake.
- Загрузить примеры данных в свою учётную запись Snowflake.
- Подключить <Constant name="dbt" /> к Snowflake.
- Взять пример запроса и преобразовать его в модель в своём проекте dbt. Модель в dbt — это оператор select.
- Добавить источники в свой проект dbt. Источники позволяют задавать имена и описания для необработанных данных, уже загруженных в Snowflake.
- Добавить тесты для своих моделей.
- Создать документацию для своих моделей.
- Настроить запуск задания по расписанию.

<AgentPrompt />

Snowflake также предлагает краткое руководство, которое поможет вам научиться использовать <Constant name="dbt" />. В нём используется другой общедоступный набор данных (Knoema Economy Data Atlas), отличающийся от представленного в этом руководстве. Подробнее см. в руководстве [Ускорение работы команд по обработке данных с помощью <Constant name="dbt" /> и Snowflake](https://quickstarts.snowflake.com/guide/accelerating_data_teams_with_snowflake_and_dbt_cloud_hands_on_lab/) в документации Snowflake.
 
### Предварительные требования​ {#prerequisites}

- У вас есть [учетная запись <Constant name="dbt" />](https://www.getdbt.com/signup/). 
- У вас есть [пробная учетная запись Snowflake](https://signup.snowflake.com/). При создании пробной учетной записи обязательно выберите редакцию Snowflake **Enterprise**, чтобы получить доступ с ролью `ACCOUNTADMIN`. Для полноценного внедрения при выборе облачного провайдера следует учитывать организационные вопросы. Подробнее см. раздел [Введение в облачные платформы](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms.html) в документации Snowflake. Для этой настройки подойдут любые облачные провайдеры и регионы, поэтому выбирайте те, которые вам удобны.

### Связанные материалы {#related-content}

- Узнайте больше с помощью [курсов dbt Learn](https://learn.getdbt.com)
- [Как мы настраиваем Snowflake](https://blog.getdbt.com/how-we-configure-snowflake/)
- [CI jobs](/docs/deploy/continuous-integration)
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [Уведомления о job](/docs/deploy/job-notifications)
- [Актуальность источников (Source freshness)](/docs/deploy/source-freshness)

:::tip Видео для вас
Если вам интересно обучение с помощью видеокурсов, вы можете бесплатно пройти курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).

Вы также можете посмотреть [видео о dbt и Snowflake на YouTube](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::

## Создайте новый SQL-файл в Snowflake

import CreateSnowflakeSqlFile from '/snippets/_create-snowflake-sql-file.md';

<CreateSnowflakeSqlFile />

## Загрузка данных {#load-data}

import LoadData from '/snippets/_load-data.md';

<LoadData/>

Вы должны увидеть строки в результатах всех трёх запросов. Если инструкция `create` или `copy into` завершается ошибкой из-за недостаточных прав доступа, убедитесь, что ваша пробная учётная запись Snowflake использует редакцию **Enterprise** и что вы работаете с ролью `ACCOUNTADMIN`. Продолжайте, когда все три таблицы будут возвращать данные.

## Подключение dbt к Snowflake

Есть два способа подключить <Constant name="dbt" /> к Snowflake. Первый вариант — Partner Connect: он упрощает настройку и позволяет создать учётную запись <Constant name="dbt" /> прямо из вашей новой пробной учётной записи Snowflake. Второй вариант — создать учётную запись <Constant name="dbt" /> отдельно и самостоятельно настроить подключение к Snowflake (подключиться вручную). Если вы хотите быстро начать работу, dbt Labs рекомендует использовать Partner Connect. Если вы хотите с самого начала настроить всё под свои потребности и познакомиться с процессом настройки <Constant name="dbt" />, dbt Labs рекомендует подключиться вручную.

<Tabs>
<TabItem value="partner-connect" label="Использовать Partner Connect" default>

Partner Connect позволяет создать полноценный аккаунт dbt с [подключением к Snowflake](/docs/platform/connect-data-platform/connect-snowflake), [управляемым репозиторием](/docs/platform/git/managed-repository), [окружениями](/docs/build/custom-schemas#managing-environments) и учётными данными.

1. В левой боковой панели интерфейса Snowflake перейдите в **Admin > Partner Connect**. Найдите плитку dbt в разделе **Data Integration** или воспользуйтесь строкой поиска. Нажмите на плитку, чтобы подключиться к dbt.

    <Lightbox src="/img/snowflake_tutorial/snowflake_partner_connect_box.png" width="60%" title="Snowflake Partner Connect Box" />

    Если вы используете классическую версию интерфейса Snowflake, нажмите кнопку **Partner Connect** в верхней панели аккаунта. Затем нажмите на плитку dbt, чтобы открыть окно подключения.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_partner_connect.png" title="Snowflake Classic UI - Partner Connect" />

2. Во всплывающем окне **Connect to dbt** найдите опцию **Optional Grant** и выберите базы данных **RAW** и **ANALYTICS**. Это предоставит доступ новой роли пользователя dbt к каждой базе данных. Затем нажмите **Connect**.

    <DocCarousel slidesPerView={1}>

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_connection_box.png" title="Snowflake Classic UI - Connection Box" />

    <Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_connection_box.png" title="Snowflake New UI - Connection Box" />

    </DocCarousel>

3. Нажмите **Activate**, когда появится всплывающее окно:

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_activation_window.png" title="Snowflake Classic UI - Actviation Window" />

<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_activation_window.png" title="Snowflake New UI - Activation Window" />

</DocCarousel>

4. Когда новая вкладка загрузится, вы увидите форму. Если вы уже создали учетную запись <Constant name="dbt" />, вам будет предложено указать имя учетной записи. Если вы еще не создали учетную запись, вам будет предложено указать имя учетной записи и пароль.

5. После заполнения формы и нажатия **Complete Registration** вы будете автоматически авторизованы в <Constant name="cloud" />.

5. После того как вы заполните форму и нажмёте **Complete Registration**, вы автоматически войдёте в <Constant name="dbt" />.

6. В меню слева нажмите на название своей учётной записи, затем выберите **Account settings**, выберите проект "Partner Connect Trial" и нажмите **snowflake** в обзорной таблице. Нажмите кнопку редактирования и укажите в полях **Database** и **Warehouse** значения `analytics` и `transforming` соответственно.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_project_overview.png" title="dbt - Snowflake Project Overview" />

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_update_database_and_warehouse.png" title="dbt - Update Database and Warehouse" />

</DocCarousel>

You should now be logged into <Constant name="dbt" /> with a project that has a Snowflake connection using the `analytics` database and `transforming` warehouse. Partner Connect also created a managed repository for you, so skip to [Initialize your dbt project and start developing](#initialize-your-dbt-project-and-start-developing).

</TabItem>
<TabItem value="manual-connect" label="Подключить вручную">

1. Создайте новый проект в <Constant name="dbt" />. Перейдите в **Account settings** (нажав на название своей учетной записи в меню слева) и нажмите **+ New Project**.
2. Введите название проекта и нажмите **Continue**.
3. В разделе **Configure your development environment** откройте раскрывающееся меню **Connection** и выберите **Add new connection**. Вы перейдете к настройкам подключения. 
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
7. Настройте свои учетные данные пользователя, перейдя в **Your profile** > **Credentials**.
8. Выберите проект, который использует подключение к Snowflake. 
9. Нажмите ссылку **configure your development environment and add a connection**. Откроется страница, на которой можно ввести свои учетные данные пользователя.
10. Введите свои учетные данные (**User credentials**) для Snowflake: 
    * **Username** &mdash; Имя пользователя, которое вы создали для Snowflake. Это не адрес электронной почты; обычно оно состоит из имени и фамилии, записанных слитно. 
    * **Password** &mdash; Пароль, который вы задали при создании учетной записи Snowflake.
    * **Schema** &mdash; Обратите внимание, что имя схемы уже создано автоматически. По принятому соглашению оно имеет вид `dbt_<first-initial><last-name>`. Эта схема напрямую связана с вашей средой разработки, и именно в ней будут создаваться ваши модели при запуске dbt в <Constant name="studio_ide" />.
    * **Target name** &mdash; Оставьте значение по умолчанию.
    * **Threads** &mdash; Оставьте значение 4. Это количество одновременных подключений, которые <Constant name="dbt" /> будет устанавливать для параллельного построения моделей.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt - Snowflake User credentials" />

11. Нажмите **Test connection**. Это позволит проверить, может ли <Constant name="dbt" /> получить доступ к вашей учетной записи Snowflake.
12. Если проверка прошла успешно, нажмите **Save**, чтобы завершить настройку. Если проверка не удалась, проверьте настройки Snowflake и учетные данные. Чаще всего ошибка возникает из-за того, что значение поля **Account** по-прежнему содержит `snowflakecomputing.com`.

</TabItem>
</Tabs>

## Настройка управляемого репозитория dbt {#set-up-a-dbt-managed-repository}
Если вы использовали Partner Connect, можете перейти сразу к разделу [инициализация dbt‑проекта](#initialize-your-dbt-project-and-start-developing), так как Partner Connect уже предоставляет управляемый репозиторий. В противном случае вам потребуется создать подключение к репозиторию вручную.

<Snippet path="tutorial-managed-repo" />

## Инициализируйте проект dbt и начните разработку {#initialize-your-dbt-project-and-start-developing}
Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="dbt" />:

1. Нажмите **Start developing in the <Constant name="studio_ide" />**. Первый запуск проекта может занять несколько минут: за это время устанавливается соединение с Git, клонируется репозиторий и проверяется подключение к хранилищу данных.
2. Над деревом файлов слева нажмите **Initialize your project**. Это создаст структуру папок с примерами моделей.
3. Создайте первый коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit`. Это создаст первый коммит в вашем управляемом репозитории и позволит создать ветку, в которой вы сможете добавлять новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из хранилища и выполнять `dbt run`. Попробуйте сделать это прямо сейчас:
    - Нажмите **+ Create new file**, добавьте в новый файл этот запрос и нажмите **Save as**, чтобы сохранить новый файл: 
        ```sql
        select * from raw.jaffle_shop.customers
        ```
    - В строке команд внизу введите `dbt run` и нажмите **Enter**. Должно появиться сообщение `dbt run succeeded`. Если возникнет ошибка из-за недостаточных прав доступа, прежде чем продолжить, выполните действия, описанные в следующем примечании.

:::info
Если на этом этапе вы получаете ошибку недостаточных прав доступа (insufficient privileges) в Snowflake, возможно, роль Snowflake не имеет разрешений на доступ к сырым данным, на создание целевых таблиц и представлений, или и на то и на другое.

Для устранения проблемы используйте роль с достаточными правами (например, `ACCOUNTADMIN`) и выполните следующие команды в Snowflake.

**Примечание**: Замените `snowflake_role_name` на роль, которую вы планируете использовать. Если вы запустили <Constant name="dbt" /> через Snowflake Partner Connect, используйте роль `pc_dbt_role`.

```
grant all on database raw to role snowflake_role_name;
grant all on database analytics to role snowflake_role_name;

grant all on schema raw.jaffle_shop to role snowflake_role_name;
grant all on schema raw.stripe to role snowflake_role_name;

grant all on all tables in database raw to role snowflake_role_name;
grant all on future tables in database raw to role snowflake_role_name;
```

:::

## Создание первой модели {#build-your-first-model}

Если вы хотите использовать ИИ для создания своей первой модели, ознакомьтесь с подразделом <a id="qs-jump-to-build-with-ai" href="#build-it-with-ai-using-dbt-wizard">создания модели с помощью dbt Wizard</a> в следующем разделе.

У вас есть два варианта работы с файлами в <Constant name="studio_ide" />:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку для редактирования файлов и фиксации изменений. Перейдите в раздел **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать файлы в защищённой основной ветке &mdash; Если вы предпочитаете редактировать, форматировать файлы, проверять их линтером и выполнять команды dbt непосредственно в основной ветке git. <Constant name="studio_ide" /> не позволяет фиксировать изменения в защищённой ветке, поэтому вам будет предложено зафиксировать изменения в новой ветке.

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

Позже вы сможете подключить свои инструменты бизнес-аналитики (BI), например [dbt Charts](https://dbtcharts.com/), к этим представлениям и таблицам, чтобы они считывали только очищенные, а не сырые данные.

<Snippet path="quickstarts/build-first-model-with-wizard" />

## Изменение способа материализации модели {#change-the-way-your-model-is-materialized}

<Snippet path="quickstarts/change-way-model-materialized" />

## Удаление примерных моделей {#delete-the-example-models}

<Snippet path="quickstarts/delete-example-models" />

## Построение моделей поверх других моделей {#build-models-on-top-of-other-models}

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

## Построение моделей поверх источников {#build-models-on-top-of-sources}

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

5. Выполните `dbt run`. Выполнение должно завершиться успешно и включать модели `stg_customers`, `stg_orders` и `customers`.

    Результаты `dbt run` будут точно такими же, как и на предыдущем шаге. Модели `stg_customers` и `stg_orders`
    по‑прежнему будут обращаться к тем же сырым данным в Snowflake. Используя `source`, вы можете
    тестировать и документировать сырые данные, а также понимать lineage ваших источников. 

</div> 

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />
<Snippet path="quickstarts/connect-your-ai" />
