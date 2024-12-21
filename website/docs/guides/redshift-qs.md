---
title: "Быстрый старт для dbt Cloud и Redshift"
id: redshift
level: 'Beginner'
icon: 'redshift'
hide_table_of_contents: true
tags: ['Redshift', 'dbt Cloud','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как использовать dbt Cloud с Redshift. Оно покажет вам, как:

- Настроить кластер Redshift.
- Загрузить пример данных в ваш аккаунт Redshift.
- Подключить dbt Cloud к Redshift.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.

:::tips Видео для вас
Если вас интересует обучение с видео, ознакомьтесь с [Основами dbt](https://learn.getdbt.com/courses/dbt-fundamentals) бесплатно.
:::

### Предварительные требования

- У вас есть [аккаунт dbt Cloud](https://www.getdbt.com/signup/).
- У вас есть аккаунт AWS с правами на выполнение шаблона CloudFormation для создания соответствующих ролей и кластера Redshift.

### Связанные материалы

- Узнайте больше с [курсами dbt Learn](https://learn.getdbt.com)
- [CI задания](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Актуальность источников](/docs/deploy/source-freshness)

## Создание кластера Redshift
1. Войдите в свой [аккаунт AWS](https://signin.aws.amazon.com/console) как корневой пользователь или пользователь IAM в зависимости от вашего уровня доступа.
2. Используйте шаблон CloudFormation для быстрого создания кластера Redshift. Шаблон CloudFormation — это файл конфигурации, который автоматически создает необходимые ресурсы в AWS. [Запустите стек CloudFormation](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=dbt-workshop&templateURL=https://tpch-sample-data.s3.amazonaws.com/create-dbtworkshop-infr) и вы можете обратиться к [JSON файлу create-dbtworkshop-infr](https://github.com/aws-samples/aws-modernization-with-dbtlabs/blob/main/resources/cloudformation/create-dbtworkshop-infr) для получения более подробной информации о шаблоне.

:::tip
Чтобы избежать проблем с подключением к dbt Cloud, убедитесь, что вы разрешили входящий трафик на порт 5439 с [IP-адресов dbt Cloud](/docs/cloud/about-cloud/access-regions-ip-addresses) в настройках групп безопасности Redshift и списках контроля доступа к сети (NACLs).
:::

3. Нажимайте **Next** на каждой странице, пока не дойдете до флажка **Select acknowledgement**. Выберите **I acknowledge that AWS CloudFormation might create IAM resources with custom names** и нажмите **Create Stack**. Вы должны попасть на страницу стека со статусом CREATE_IN_PROGRESS.

    <Lightbox src="/img/redshift_tutorial/images/cloud_formation_in_progress.png" title="Cloud Formation в процессе" />

4. Когда статус стека изменится на CREATE_COMPLETE, нажмите вкладку **Outputs** вверху, чтобы просмотреть информацию, которую вы будете использовать в остальной части этого руководства. Сохраните эти учетные данные, оставив эту вкладку открытой.

5. Введите `Redshift` в строке поиска вверху и нажмите **Amazon Redshift**.

    <Lightbox src="/img/redshift_tutorial/images/go_to_redshift.png" title="Нажмите на Redshift" />

6. Убедитесь, что ваш новый кластер Redshift указан в **Cluster overview**. Выберите ваш новый кластер. Имя кластера должно начинаться с `dbtredshiftcluster-`. Затем нажмите **Query Data**. Вы можете выбрать классический редактор запросов или v2. Для целей этого руководства мы будем использовать версию v2.

<Lightbox src="/img/redshift_tutorial/images/cluster_overview.png" title="Доступный кластер Redshift" />

7. Возможно, вам будет предложено настроить аккаунт. Для этой песочницы мы рекомендуем выбрать "Configure account".

8. Выберите ваш кластер из списка. В всплывающем окне **Connect to** заполните учетные данные из вывода стека:
    - **Authentication** — Используйте по умолчанию, что является **Database user name and password** (ПРИМЕЧАНИЕ: аутентификация IAM не поддерживается в dbt Cloud).
    - **Database** — `dbtworkshop`
    - **User name** — `dbtadmin`
    - **Password** — Используйте автоматически сгенерированный `RSadminpassword` из вывода стека и сохраните его для дальнейшего использования.

<Lightbox src="/img/redshift_tutorial/images/redshift_query_editor.png" title="Редактор запросов Redshift v2" />

<Lightbox src="/img/redshift_tutorial/images/connect_to_redshift_cluster.png" title="Подключение к кластеру Redshift" />

9. Нажмите **Create connection**.

## Загрузка данных

Теперь мы загрузим наши примерные данные в S3 bucket, который создал наш шаблон CloudFormation. S3 buckets — это простой и недорогой способ хранения данных вне Redshift.

1. Данные, используемые в этом курсе, хранятся в виде CSV в публичном S3 bucket. Вы можете использовать следующие URL для загрузки этих файлов. Скачайте их на свой компьютер для использования в следующих шагах.
    - [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
    - [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
    - [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

2. Теперь мы будем использовать S3 bucket, который вы создали с помощью CloudFormation, и загрузим файлы. Перейдите в строку поиска вверху, введите `S3` и нажмите на S3. В bucket уже будут примерные данные, вы можете их игнорировать или использовать для других исследований моделирования. Bucket будет иметь префикс `dbt-data-lake`.

<Lightbox src="/img/redshift_tutorial/images/go_to_S3.png" title="Перейти в S3" />

3. Нажмите на `name of the bucket` S3 bucket. Если у вас несколько S3 bucket, это будет bucket, который был указан под "Workshopbucket" на странице Outputs.

<Lightbox src="/img/redshift_tutorial/images/s3_bucket.png" title="Перейти в ваш S3 Bucket" />

4. Нажмите **Upload**. Перетащите три файла в интерфейс и нажмите кнопку **Upload**.

<Lightbox src="/img/redshift_tutorial/images/upload_csv.png" title="Загрузите ваши CSV" />

5. Запомните имя S3 bucket для дальнейшего использования. Оно должно выглядеть так: `s3://dbt-data-lake-xxxx`. Вам понадобится это для следующего раздела.
6. Теперь вернемся к редактору запросов Redshift. Найдите Redshift в строке поиска, выберите ваш кластер и выберите Query data.
7. В вашем редакторе запросов выполните следующий запрос, чтобы создать схемы, в которые мы будем помещать ваши необработанные данные. Вы можете выделить оператор и затем нажать Run, чтобы выполнить их по отдельности. Если вы используете классический редактор запросов, возможно, вам придется вводить их по отдельности в интерфейс. Вы должны увидеть эти схемы, перечисленные под `dbtworkshop`.

    ```sql
    create schema if not exists jaffle_shop;
    create schema if not exists stripe;
    ```

8. Теперь создайте таблицы в вашей схеме с помощью этих запросов, используя приведенные ниже операторы. Они будут заполнены как таблицы в соответствующих схемах.

    ```sql
    create table jaffle_shop.customers(
        id integer,
        first_name varchar(50),
        last_name varchar(50)
    );

    create table jaffle_shop.orders(
        id integer,
        user_id integer,
        order_date date,
        status varchar(50)
    );

    create table stripe.payment(
        id integer,
        orderid integer,
        paymentmethod varchar(50),
        status varchar(50),
        amount integer,
        created date
    );
    ```

9. Теперь нам нужно скопировать данные из S3. Это позволяет вам выполнять запросы в этом руководстве для демонстрационных целей; это не пример того, как вы бы делали это для реального проекта. Убедитесь, что вы обновили местоположение S3, роль iam и регион. Вы можете найти S3 и роль iam в ваших выводах из стека CloudFormation. Найдите стек, введя `CloudFormation` в строке поиска, затем нажмите **Stacks** в плитке CloudFormation.

    ```sql
    copy jaffle_shop.customers( id, first_name, last_name)
    from 's3://dbt-data-lake-xxxx/jaffle_shop_customers.csv'
    iam_role 'arn:aws:iam::XXXXXXXXXX:role/RoleName'
    region 'us-east-1'
    delimiter ','
    ignoreheader 1
    acceptinvchars;
       
    copy jaffle_shop.orders(id, user_id, order_date, status)
    from 's3://dbt-data-lake-xxxx/jaffle_shop_orders.csv'
    iam_role 'arn:aws:iam::XXXXXXXXXX:role/RoleName'
    region 'us-east-1'
    delimiter ','
    ignoreheader 1
    acceptinvchars;

    copy stripe.payment(id, orderid, paymentmethod, status, amount, created)
    from 's3://dbt-data-lake-xxxx/stripe_payments.csv'
    iam_role 'arn:aws:iam::XXXXXXXXXX:role/RoleName'
    region 'us-east-1'
    delimiter ','
    ignoreheader 1
    Acceptinvchars;
    ```

    Убедитесь, что вы можете выполнить `select *` из каждой из таблиц с помощью следующих фрагментов кода.

    ```sql 
    select * from jaffle_shop.customers;
    select * from jaffle_shop.orders;
    select * from stripe.payment;
    ```

## Подключение dbt Cloud к Redshift 
1. Создайте новый проект в [dbt Cloud](/docs/cloud/about-cloud/access-regions-ip-addresses). Перейдите в **Account settings** (нажав на имя вашего аккаунта в левом боковом меню) и нажмите **+ New Project**.
2. Введите имя проекта и нажмите **Continue**.
3. Для хранилища данных нажмите **Redshift**, затем **Next**, чтобы настроить ваше подключение.
4. Введите настройки Redshift. Обратитесь к вашим учетным данным, которые вы сохранили из шаблона CloudFormation.
    - **Hostname** — Ваш полный хостнейм.
    - **Port** — `5439`
    - **Database** — `dbtworkshop`.

    <Lightbox src="/img/redshift_tutorial/images/dbt_cloud_redshift_account_settings.png" width="90%" title="dbt Cloud - Настройки кластера Redshift" />

    :::tip
    Чтобы избежать проблем с подключением к dbt Cloud, убедитесь, что вы разрешили входящий трафик на порт 5439 с [IP-адресов dbt Cloud](/docs/cloud/about-cloud/access-regions-ip-addresses) в настройках групп безопасности Redshift и списках контроля доступа к сети (NACLs).
    :::

5. Установите ваши учетные данные для разработки. Эти учетные данные будут использоваться dbt Cloud для подключения к Redshift. Эти учетные данные (как указано в вашем выводе CloudFormation) будут:
    - **Username** — `dbtadmin`
    - **Password** — Это автоматически сгенерированный пароль, который вы использовали ранее в руководстве
    - **Schema** — dbt Cloud автоматически генерирует имя схемы для вас. По соглашению, это `dbt_<первая буква имени><фамилия>`. Это схема, подключенная непосредственно к вашей среде разработки, и это место, где ваши модели будут строиться при запуске dbt в облачной IDE.

    <Lightbox src="/img/redshift_tutorial/images/dbt_cloud_redshift_development_credentials.png" title="dbt Cloud - Учетные данные для разработки Redshift" />

6. Нажмите **Test Connection**. Это проверяет, что dbt Cloud может получить доступ к вашему кластеру Redshift.
7. Нажмите **Next**, если тест прошел успешно. Если он не прошел, возможно, вам нужно проверить настройки и учетные данные Redshift.

## Настройка управляемого репозитория dbt Cloud 
<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки
Теперь, когда у вас настроен репозиторий, вы можете инициализировать ваш проект и начать разработку в dbt Cloud:

1. Нажмите **Start developing in the IDE**. Это может занять несколько минут, чтобы ваш проект запустился в первый раз, так как он устанавливает ваше git-подключение, клонирует ваш репозиторий и тестирует подключение к хранилищу данных.
2. Над деревом файлов слева нажмите **Initialize dbt project**. Это создаст структуру папок с примерами моделей.
3. Сделайте ваш начальный коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit` и нажмите **Commit**. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, где вы можете добавить новый код dbt.
4. Теперь вы можете напрямую выполнять запросы к данным из вашего хранилища и выполнять `dbt run`. Вы можете попробовать это сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить новый файл: 
        ```sql
        select * from jaffle_shop.customers
        ```
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели

У вас есть два варианта работы с файлами в IDE dbt Cloud:

- Создать новую ветку (рекомендуется) — Создайте новую ветку, чтобы редактировать и фиксировать ваши изменения. Перейдите в **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать в защищенной основной ветке — Если вы предпочитаете редактировать, форматировать или проверять файлы и выполнять команды dbt непосредственно в вашей основной ветке git. IDE dbt Cloud предотвращает коммиты в защищенную ветку, поэтому вам будет предложено зафиксировать ваши изменения в новой ветке.

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

    from jaffle_shop.customers

),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from jaffle_shop.orders

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

Позже вы сможете подключить ваши инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не необработанные данные в вашем инструменте BI.

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

1. Создайте новый SQL файл, `models/stg_customers.sql`, с SQL из CTE `customers` в нашем исходном запросе.
2. Создайте второй новый SQL файл, `models/stg_orders.sql`, с SQL из CTE `orders` в нашем исходном запросе.

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from jaffle_shop.customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from jaffle_shop.orders
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
<FAQ path="Project/structure-a-project" alt_header="Как я создаю больше моделей, как мне организовать мой проект? Как мне назвать мои модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />