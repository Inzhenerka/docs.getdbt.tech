---
title: "Быстрый старт с dbt и BigQuery"
id: "bigquery"
level: 'Beginner'
icon: 'bigquery'
hide_table_of_contents: true
tags: ['BigQuery', 'Platform', 'Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом кратком руководстве вы узнаете, как использовать <Constant name="cloud" /> с BigQuery. В нём показано, как:

- Создать проект в Google Cloud Platform (GCP).
- Получить доступ к примерным данным в публичном датасете.
- Подключить <Constant name="cloud" /> к BigQuery.
- Взять пример запроса и превратить его в модель в вашем dbt‑проекте. Модель в dbt — это оператор `select`.
- Добавить тесты к вашим моделям.
- Задокументировать ваши модели.
- Запланировать выполнение задания.

:::tip Видео для вас
Вы можете бесплатно ознакомиться с [Основами dbt](https://learn.getdbt.com/courses/dbt-fundamentals), если вас интересует обучение с видео.
:::

### Предварительные требования

- У вас есть [<Constant name="cloud" /> аккаунт](https://www.getdbt.com/signup/).  
- У вас есть [аккаунт Google](https://support.google.com/accounts/answer/27441?hl=en).  
- Для настройки BigQuery вы можете использовать личный или рабочий аккаунт через [Google Cloud Platform (GCP)](https://cloud.google.com/free).

### Связанные материалы

- Узнайте больше с [курсами dbt Learn](https://learn.getdbt.com)
- [CI задания](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Актуальность источников](/docs/deploy/source-freshness)

## Создание нового проекта GCP

1. Перейдите в [Консоль BigQuery](https://console.cloud.google.com/bigquery) после входа в ваш аккаунт Google. Если у вас несколько аккаунтов Google, убедитесь, что вы используете правильный.
2. Создайте новый проект на [странице управления ресурсами](https://console.cloud.google.com/projectcreate?previousPage=%2Fcloud-resource-manager%3Fwalkthrough_id%3Dresource-manager--create-project%26project%3D%26folder%3D%26organizationId%3D%23step_index%3D1&walkthrough_id=resource-manager--create-project). Для получения дополнительной информации обратитесь к [Создание проекта](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project) в документации Google Cloud. GCP автоматически заполняет поле имени проекта для вас. Вы можете изменить его на более описательное для вашего использования. Например, `dbt Learn - BigQuery Setup`.

## Создание наборов данных BigQuery

1. В [Консоли BigQuery](https://console.cloud.google.com/bigquery) нажмите **Редактор**. Убедитесь, что выбран ваш недавно созданный проект, который доступен в верхней части страницы.
1. Убедитесь, что вы можете выполнять SQL-запросы. Скопируйте и вставьте эти запросы в редактор запросов:
    ```sql
    select * from `dbt-tutorial.jaffle_shop.customers`;
    select * from `dbt-tutorial.jaffle_shop.orders`;
    select * from `dbt-tutorial.stripe.payment`;
    ```

    Нажмите **Выполнить**, затем проверьте результаты запросов. Например:
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/bigquery/query-results.png" title="Результаты запроса Bigquery" />
    </div>
2. Создайте новые наборы данных в [Консоли BigQuery](https://console.cloud.google.com/bigquery). Для получения дополнительной информации обратитесь к [Создание наборов данных](https://cloud.google.com/bigquery/docs/datasets#create-dataset) в документации Google Cloud. Наборы данных в BigQuery эквивалентны схемам в традиционной базе данных. На странице **Создать набор данных**:
    - **ID набора данных** &mdash; Введите имя, соответствующее цели. Это имя используется как схема в полностью квалифицированных ссылках на ваши объекты базы данных, такие как `database.schema.table`. В качестве примера для этого руководства создайте один для `jaffle_shop`, а затем другой для `stripe`.
    - **Расположение данных** &mdash; Оставьте пустым (по умолчанию). Это определяет местоположение GCP, где хранятся ваши данные. Текущее местоположение по умолчанию — многорегион США. Все таблицы в этом наборе данных будут использовать это местоположение.
    - **Включить истечение срока действия таблицы** &mdash; Оставьте невыбранным (по умолчанию). По умолчанию срок действия таблицы выставления счетов составляет 60 дней. Поскольку выставление счетов не включено для этого проекта, GCP по умолчанию устаревшие таблицы.
    - **Ключ шифрования, управляемый Google** &mdash; Эта опция доступна в разделе **Дополнительные параметры**. Разрешите Google управлять шифрованием (по умолчанию).
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/bigquery/create-dataset-id.png" title="Создание ID набора данных Bigquery" />
    </div>
3. После создания набора данных `jaffle_shop` создайте один для `stripe` с теми же значениями, кроме **ID набора данных**.

## Генерация учетных данных BigQuery {#generate-bigquery-credentials}
Чтобы dbt мог подключиться к вашему хранилищу, вам нужно будет сгенерировать файл ключа. Это аналогично использованию имени пользователя и пароля базы данных с большинством других <Term id="data-warehouse">хранилищ данных</Term>.

1. Запустите [мастер учетных данных GCP](https://console.cloud.google.com/apis/credentials/wizard). Убедитесь, что ваш новый проект выбран в заголовке. Если вы не видите свой аккаунт или проект, нажмите на изображение профиля справа и убедитесь, что вы используете правильный адрес электронной почты. Для **Тип учетных данных**:
    - В выпадающем списке **Выберите API** выберите **BigQuery API**
    - Выберите **Данные приложения** для типа данных, к которым вы будете получать доступ
    - Нажмите **Далее**, чтобы создать новую учетную запись службы.
2. Создайте учетную запись службы для вашего нового проекта на [странице учетных записей службы](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts?supportedpurview=project). Для получения дополнительной информации обратитесь к [Создание учетной записи службы](https://developers.google.com/workspace/guides/create-credentials#create_a_service_account) в документации Google Cloud. В качестве примера для этого руководства вы можете:
    - Введите `dbt-user` как **Имя учетной записи службы**
    - В выпадающем списке **Выберите роль** выберите роли **Пользователь заданий BigQuery** и **Редактор данных BigQuery** и нажмите **Продолжить**
    - Оставьте поля **Предоставить пользователям доступ к этой учетной записи службы** пустыми
    - Нажмите **Готово**
3. Создайте ключ учетной записи службы для вашего нового проекта на [странице учетных записей службы](https://console.cloud.google.com/iam-admin/serviceaccounts?walkthrough_id=iam--create-service-account-keys&start_index=1#step_index=1). Для получения дополнительной информации обратитесь к [Создание ключа учетной записи службы](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating) в документации Google Cloud. При загрузке файла JSON убедитесь, что используете имя файла, которое вы легко запомните. Например, `dbt-user-creds.json`. По соображениям безопасности dbt Labs рекомендует защищать этот файл JSON так же, как вы защищаете свои учетные данные; например, не добавляйте файл JSON в ваше программное обеспечение для управления версиями.

## Подключение dbt к BigQuery​
1. Создайте новый проект в [<Constant name="cloud" />](/docs/cloud/about-cloud/access-regions-ip-addresses). Перейдите в **Account settings** (кликнув по имени вашего аккаунта в левом меню) и нажмите **+ New project**.
2. Введите имя проекта и нажмите **Continue**.
3. В качестве хранилища данных выберите **BigQuery**, затем нажмите **Next**, чтобы настроить подключение.
4. В настройках нажмите **Upload a Service Account JSON File**.
5. Выберите JSON-файл, который вы скачали на шаге [Generate BigQuery credentials](#generate-bigquery-credentials), и <Constant name="cloud" /> автоматически заполнит все необходимые поля.
6. Необязательно — тарифы <Constant name="cloud" /> Enterprise могут настроить developer OAuth с BigQuery, что обеспечивает дополнительный уровень безопасности. Подробнее см. в разделе [Set up BigQuery OAuth](/docs/cloud/manage-access/set-up-bigquery-oauth).
7. Нажмите **Test Connection**. Это проверит, что <Constant name="cloud" /> имеет доступ к вашему аккаунту BigQuery.
8. Если тест прошёл успешно, нажмите **Next**. Если тест не удался, возможно, потребуется вернуться назад и заново сгенерировать учётные данные BigQuery.

## Настройка репозитория под управлением dbt
<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки
Теперь, когда у вас настроен репозиторий, вы можете инициализировать ваш проект и начать разработку в dbt Cloud:

## Инициализируйте ваш dbt‑проект и начните разработку

Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="cloud" />:

1. Нажмите **Start developing in the <Constant name="cloud_ide" />**. При первом запуске это может занять несколько минут, так как система устанавливает подключение к git, клонирует репозиторий и проверяет соединение с хранилищем данных.
2. В левой части интерфейса, над деревом файлов, нажмите **Initialize dbt project**. Это создаст структуру папок с примерами моделей.
3. Сделайте первый коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit` и нажмите **Commit**. Это создаст первый коммит в управляемом репозитории и позволит открыть ветку, в которой вы сможете добавлять новый dbt‑код.
4. Теперь вы можете напрямую выполнять запросы к вашему хранилищу данных и запускать `dbt run`. Вы можете попробовать это прямо сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить файл:
        ```sql
        select * from `dbt-tutorial.jaffle_shop.customers`
        ```
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели

У вас есть два варианта работы с файлами в <Constant name="cloud_ide" />:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку, чтобы редактировать файлы и коммитить изменения. Перейдите в раздел **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать в защищённой основной ветке &mdash; Если вы предпочитаете редактировать, форматировать или линтить файлы, а также выполнять команды dbt напрямую в вашей основной git-ветке. <Constant name="cloud_ide" /> не позволяет выполнять коммиты в защищённую ветку, поэтому вам будет предложено закоммитить изменения в новую ветку.

Назовите новую ветку `add-customers-model`.

1. Нажмите **...** рядом с директорией `models`, затем выберите **Создать файл**.
2. Назовите файл `customers.sql`, затем нажмите **Создать**.
3. Скопируйте следующий запрос в файл и нажмите **Сохранить**.

```sql
with customers as (

    select
        id as customer_id,
        first_name,
        last_name

    from `dbt-tutorial`.jaffle_shop.customers

),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from `dbt-tutorial`.jaffle_shop.orders

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

Позже вы сможете подключить ваши инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не сырые данные в вашем инструменте BI.

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

## Построение моделей на основе других моделей

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте новый SQL файл, `models/stg_customers.sql`, с SQL из CTE `customers` в нашем оригинальном запросе.
2. Создайте второй новый SQL файл, `models/stg_orders.sql`, с SQL из CTE `orders` в нашем оригинальном запросе.

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from `dbt-tutorial`.jaffle_shop.customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from `dbt-tutorial`.jaffle_shop.orders
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

## Построение моделей поверх источников данных

Источники позволяют задавать имена и описывать данные, загруженные в ваш хранилище с помощью инструментов извлечения и загрузки (extract & load). Объявляя эти таблицы как источники в dbt, вы можете:

- выбирать данные из исходных таблиц в своих моделях с помощью функции `{{ source() }}`, что помогает определить lineage (происхождение и зависимости) ваших данных  
- проверять свои предположения о данных в источниках  
- вычислять актуальность (freshness) данных в источниках  

1. Создайте новый YML-файл `models/sources.yml`.

2. Объявите источники, скопировав следующий код в файл и нажав **Save**.

    <File name='models/sources.yml'>

    ```yml

    sources:
        - name: jaffle_shop
          description: This is a replica of the Postgres database used by our app
          database: dbt-tutorial
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

5. Выполните команду `dbt run`.

    Результаты выполнения `dbt run` будут точно такими же, как и на предыдущем шаге. Модели `stg_customers` и `stg_orders`
    по‑прежнему будут обращаться к тем же самым исходным данным в BigQuery. Однако использование `source` позволяет
    тестировать и документировать «сырые» данные, а также лучше понимать lineage ваших источников данных.  


#### FAQs {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="Как я создаю больше моделей, как мне организовать мой проект? Как мне назвать мои модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />