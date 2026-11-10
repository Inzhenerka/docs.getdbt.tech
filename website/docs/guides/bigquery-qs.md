---
title: "Быстрый старт с dbt и BigQuery"
id: "bigquery"
level: 'Beginner'
icon: 'bigquery'
hide_table_of_contents: true
tags: ['BigQuery', 'Platform', 'Quickstart']
product_badge: "dbt v2 compatible"
agent_guidance:
  pacing: In the first reply, confirm the reader’s prerequisites and connection path before listing steps. Then default to one guide section per reply (combine two or three short sections), with all its steps, labeled Step 1, Step 2, and so on, and confirm the success check before continuing. If the reader asks for a different pace, follow it.
  stay_on_path: This guide uses dbt platform. Don’t switch the reader to a local setup. If the reader wants to set up dbt locally, use the https://docs.getdbt.com/guides/dbt guide instead
  safety: Never ask for passwords or keys in chat.
  signup_link: When the reader needs a dbt account, share https://www.getdbt.com/signup?utm_source=ai_assistant&utm_medium=docs_md&utm_campaign=bigquery-qs
---

<div style={{maxWidth: '900px'}}>

## Введение 

В этом кратком руководстве вы узнаете, как использовать <Constant name="dbt" /> с BigQuery. В нём показано, как: 

- Создать проект в Google Cloud Platform (GCP).
- Получить доступ к демонстрационным данным в общедоступном наборе данных.
- Подключить <Constant name="dbt" /> к BigQuery.
- Преобразовать пример запроса в модель в вашем проекте dbt. Модель в dbt — это SQL-запрос SELECT.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Настроить запуск задания по расписанию.

<AgentPrompt />

### Предварительные требования {#prerequisites}

- У вас есть [учетная запись <Constant name="dbt" />](https://www.getdbt.com/signup/). 
- У вас есть [учетная запись Google](https://support.google.com/accounts/answer/27441?hl=en).
- Вы можете использовать личную или рабочую учетную запись, чтобы настроить BigQuery через [Google Cloud Platform (GCP)](https://cloud.google.com/free).

### Связанные материалы {#related-content}

- Узнайте больше с [курсами dbt Learn](https://learn.getdbt.com)
- [CI задания](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Актуальность источников](/docs/deploy/source-freshness)

:::tip Видео для вас
Если вам интересно обучение с помощью видео, вы можете бесплатно пройти курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).
:::

## Создайте новый проект GCP​

1. Перейдите в [Консоль BigQuery](https://console.cloud.google.com/bigquery) после входа в ваш аккаунт Google. Если у вас несколько аккаунтов Google, убедитесь, что вы используете правильный.
2. Создайте новый проект на [странице управления ресурсами](https://console.cloud.google.com/projectcreate?previousPage=%2Fcloud-resource-manager%3Fwalkthrough_id%3Dresource-manager--create-project%26project%3D%26folder%3D%26organizationId%3D%23step_index%3D1&walkthrough_id=resource-manager--create-project). Для получения дополнительной информации обратитесь к [Создание проекта](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project) в документации Google Cloud. GCP автоматически заполняет поле имени проекта для вас. Вы можете изменить его на более описательное для вашего использования. Например, `dbt Learn - BigQuery Setup`.

## Создание наборов данных BigQuery {#create-bigquery-datasets}

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

1. Запустите [мастер создания учетных данных GCP](https://console.cloud.google.com/apis/credentials/wizard). Убедитесь, что в верхней части страницы выбран ваш новый проект. Если вы не видите свою учетную запись или проект, нажмите на изображение профиля справа и убедитесь, что используете учетную запись с нужным адресом электронной почты. В разделе **Credential Type**: 
    - В раскрывающемся списке **Select an API** выберите **BigQuery API**
    - Выберите **Application data** в качестве типа данных, к которым вы будете обращаться
    - Нажмите **Next**, чтобы создать новый сервисный аккаунт.
2. Создайте сервисный аккаунт для нового проекта на [странице сервисных аккаунтов](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts?supportedpurview=project). Дополнительную информацию см. в разделе [Создание сервисного аккаунта](https://developers.google.com/workspace/guides/create-credentials#create_a_service_account) документации Google Cloud. В рамках этого руководства вы можете, например:
    - Ввести `dbt-user` в поле **Service account name**
    - В раскрывающемся списке **Select a role** выбрать роли **BigQuery Job User**, **BigQuery Read Session User** и **BigQuery Data Editor**, затем нажать **Continue**
    - Оставить поля в разделе **Grant users access to this service account** пустыми
    - Нажать **Done**
3. Создайте ключ сервисного аккаунта для нового проекта на [странице сервисных аккаунтов](https://console.cloud.google.com/iam-admin/serviceaccounts?walkthrough_id=iam--create-service-account-keys&start_index=1#step_index=1). Дополнительную информацию см. в разделе [Создание ключа сервисного аккаунта](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating) документации Google Cloud. При скачивании JSON-файла задайте имя, которое будет легко запомнить. Например, `dbt-user-creds.json`. Из соображений безопасности dbt Labs рекомендует защищать этот JSON-файл так же, как ваши учетные данные для подтверждения личности; например, не добавляйте JSON-файл в систему контроля версий.

## Подключение dbt к BigQuery​
1. В [<Constant name="dbt" />](/docs/platform/about-platform/access-regions-ip-addresses) нажмите на название своей учетной записи в меню слева.
2. Перейдите в **Account settings** и нажмите **+ New project**.
3. Введите название проекта и нажмите **Continue**.
4. В качестве хранилища данных выберите **BigQuery**, затем нажмите **Next**, чтобы настроить подключение.
5. В настройках нажмите **Upload a Service Account JSON File**.
6. Выберите JSON-файл, скачанный на этапе создания учетных данных BigQuery, и <Constant name="dbt" /> заполнит все необходимые поля.
7. (Необязательно) В тарифных планах <Constant name="dbt" /> Enterprise можно настроить OAuth для разработчиков при работе с BigQuery, обеспечив дополнительный уровень безопасности. Дополнительную информацию см. в разделе [Настройка OAuth для BigQuery](/docs/platform/manage-access/set-up-bigquery-oauth).
8. Настройте свои личные учетные данные пользователя, перейдя в **Your profile** > **Credentials**.
9. Выберите свой проект, использующий подключение к BigQuery.
10. Нажмите **Edit**.
11. Укажите свои учетные данные пользователя для BigQuery в разделе **User credentials**:
    - **Authentication Method** &mdash; Выберите **Service Account JSON**. При этом будет использоваться сервисный аккаунт, JSON-файл которого вы загрузили при настройке подключения проекта.
    - **Dataset** &mdash; Вы можете заметить, что имя набора данных уже создано автоматически. По принятому соглашению оно имеет вид `dbt_<first-initial><last-name>`. Этот набор данных напрямую связан с вашей средой разработки, и именно в нем будут создаваться ваши модели при запуске dbt в <Constant name="studio_ide" />.
    - **Target name** &mdash; Оставьте значение по умолчанию.
    - **Threads** &mdash; Оставьте значение по умолчанию (6). Это количество одновременных подключений, которые <Constant name="dbt" /> будет устанавливать для параллельного создания моделей.

    <Lightbox src="/img/bigquery/dbt_platform_bigquery_development_credentials.png" title="Учетные данные пользователя BigQuery" />

12. Нажмите **Test Connection**. Эта проверка подтверждает, что <Constant name="dbt" /> может получить доступ к вашей учетной записи BigQuery.
13. Если проверка прошла успешно, нажмите **Next**. Если проверка завершилась ошибкой, возможно, вам потребуется вернуться к предыдущим шагам и повторно создать учетные данные BigQuery.

## Настройка репозитория под управлением dbt {#set-up-a-dbt-managed-repository}
<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки {#initialize-your-dbt-project-and-start-developing}
Теперь, когда у вас настроен репозиторий, вы можете инициализировать ваш проект и начать разработку в dbt Cloud:

## Инициализация проекта dbt и начало разработки
Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="dbt" />:

1. Нажмите **Start developing in the <Constant name="studio_ide" />**. Первый запуск проекта может занять несколько минут: за это время устанавливается соединение с git, клонируется репозиторий и проверяется подключение к хранилищу данных.
2. Над деревом файлов слева нажмите **Initialize dbt project**. Это создаст структуру папок с примерами моделей.
3. Создайте первый коммит, нажав **Commit and sync**. Укажите сообщение коммита `initial commit` и нажмите **Commit**. Это создаст первый коммит в вашем управляемом репозитории и позволит создать ветку, в которой вы сможете добавлять новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из хранилища и выполнять `dbt run`. Попробуйте сделать это прямо сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить новый файл:
        ```sql
        select * from `dbt-tutorial.jaffle_shop.customers`
        ```
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели {#change-the-way-your-model-is-materialized}

Если вы хотите использовать ИИ для создания своей первой модели, ознакомьтесь с разделом <a id="qs-jump-to-build-with-ai" href="#build-it-with-ai-using-dbt-wizard">Создание модели с помощью dbt Wizard</a> ниже.

У вас есть два варианта работы с файлами в <Constant name="studio_ide" />:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку для редактирования файлов и фиксации изменений. Перейдите в раздел **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать файлы в защищённой основной ветке &mdash; Если вы предпочитаете редактировать, форматировать или проверять файлы линтером и выполнять команды dbt непосредственно в основной ветке git. <Constant name="studio_ide" /> не позволяет создавать коммиты в защищённой ветке, поэтому вам будет предложено зафиксировать изменения в новой ветке.

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

Позже вы сможете подключить свои инструменты бизнес-аналитики (BI), например [dbt Charts](https://dbtcharts.com/), к этим представлениям и таблицам, чтобы они считывали только очищенные, а не сырые данные.

#### Часто задаваемые вопросы {#faqs}

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

<Snippet path="quickstarts/build-first-model-with-wizard" />

## Измените способ материализации вашей модели

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


#### Частые вопросы {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="Как я создаю больше моделей, как мне организовать мой проект? Как мне назвать мои модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />


<Snippet path="quickstarts/connect-your-ai" />
