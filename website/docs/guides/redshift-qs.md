---
title: "Быстрый старт для dbt Cloud и Redshift"
id: redshift
level: 'Начинающий'
icon: 'redshift'
hide_table_of_contents: true
tags: ['Redshift', 'dbt Cloud','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как использовать dbt Cloud с Redshift. Оно покажет вам, как: 

- Настроить кластер Redshift.
- Загрузить образцы данных в вашу учетную запись Redshift.
- Подключить dbt Cloud к Redshift.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.

:::tips Видео для вас
Посмотрите [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals) бесплатно, если вас интересует обучение с помощью видео.
:::

### Предварительные требования 

- У вас есть [учетная запись dbt Cloud](https://www.getdbt.com/signup/). 
- У вас есть учетная запись AWS с правами на выполнение шаблона CloudFormation для создания соответствующих ролей и кластера Redshift.

### Связанный контент

- Узнайте больше с помощью [курсов dbt Learn](https://learn.getdbt.com)
- [CI задания](/docs/deploy/continuous-integration)
- [Задания на развертывание](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источников](/docs/deploy/source-freshness)


## Создание кластера Redshift
1. Войдите в свою [учетную запись AWS](https://signin.aws.amazon.com/console) как корневой пользователь или пользователь IAM в зависимости от вашего уровня доступа.
2. Используйте шаблон CloudFormation для быстрой настройки кластера Redshift. Шаблон CloudFormation — это файл конфигурации, который автоматически создает необходимые ресурсы в AWS. [Запустите стек CloudFormation](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=dbt-workshop&templateURL=https://tpch-sample-data.s3.amazonaws.com/create-dbtworkshop-infr) и вы можете обратиться к [файлу JSON create-dbtworkshop-infr](https://github.com/aws-samples/aws-modernization-with-dbtlabs/blob/main/resources/cloudformation/create-dbtworkshop-infr) для получения дополнительных деталей о шаблоне.

:::tip
Чтобы избежать проблем с подключением к dbt Cloud, убедитесь, что разрешен входящий трафик на порту 5439 от [IP-адресов dbt Cloud](/docs/cloud/about-cloud/access-regions-ip-addresses) в ваших группах безопасности Redshift и настройках списков управления доступом к сети (NACL).
:::

3. Нажмите **Далее** на каждой странице, пока не дойдете до флажка **Подтверждение выбора**. Выберите **Я подтверждаю, что AWS CloudFormation может создать IAM-ресурсы с пользовательскими именами** и нажмите **Создать стек**. Вы должны оказаться на странице стека со статусом CREATE_IN_PROGRESS.

    <Lightbox src="/img/redshift_tutorial/images/cloud_formation_in_progress.png" title="Создание Cloud Formation" />

4. Когда статус стека изменится на CREATE_COMPLETE, нажмите на вкладку **Выходные данные** вверху, чтобы просмотреть информацию, которую вы будете использовать в остальной части этого руководства. Сохраните эти учетные данные для дальнейшего использования, оставив эту вкладку открытой.

5. Введите `Redshift` в строке поиска вверху и нажмите **Amazon Redshift**.

    <Lightbox src="/img/redshift_tutorial/images/go_to_redshift.png" title="Нажмите на Redshift" />

6. Убедитесь, что ваш новый кластер Redshift отображается в **Обзор кластера**. Выберите ваш новый кластер. Имя кластера должно начинаться с `dbtredshiftcluster-`. Затем нажмите **Запрос данных**. Вы можете выбрать классический редактор запросов или v2. Мы будем использовать версию v2 для целей этого руководства.

<Lightbox src="/img/redshift_tutorial/images/cluster_overview.png" title="Доступный кластер Redshift" />

7. Возможно, вам будет предложено настроить учетную запись. Для этой песочницы мы рекомендуем выбрать "Настроить учетную запись".

8. Выберите ваш кластер из списка. В всплывающем окне **Подключиться к** заполните учетные данные из выходных данных стека:
    - **Аутентификация** — Используйте значение по умолчанию, которое является **Имя пользователя базы данных и пароль** (ПРИМЕЧАНИЕ: Аутентификация IAM не поддерживается в dbt Cloud).
    - **База данных** — `dbtworkshop`
    - **Имя пользователя** — `dbtadmin`
    - **Пароль** — Используйте сгенерированный `RSadminpassword` из выходных данных стека и сохраните его для дальнейшего использования.

<Lightbox src="/img/redshift_tutorial/images/redshift_query_editor.png" title="Редактор запросов Redshift v2" />

<Lightbox src="/img/redshift_tutorial/images/connect_to_redshift_cluster.png" title="Подключение к кластеру Redshift" />

9. Нажмите **Создать соединение**.

## Загрузка данных 

Теперь мы загрузим наши образцы данных в S3-ведро, которое создал наш шаблон CloudFormation. Ведра S3 — это простой и недорогой способ хранения данных вне Redshift.

1. Данные, используемые в этом курсе, хранятся в виде CSV в публичном ведре S3. Вы можете использовать следующие URL-адреса для загрузки этих файлов. Скачайте их на свой компьютер для использования в следующих шагах.
    - [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
    - [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
    - [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

2. Теперь мы будем использовать ведро S3, которое вы создали с помощью CloudFormation, и загрузим файлы. Перейдите в строку поиска вверху и введите `S3`, затем нажмите на S3. В ведре уже будут образцы данных, не стесняйтесь игнорировать их или использовать для других исследований моделирования. Ведро будет иметь префикс `dbt-data-lake`.

<Lightbox src="/img/redshift_tutorial/images/go_to_S3.png" title="Перейдите в S3" />

3. Нажмите на `имя ведра` S3. Если у вас несколько ведер S3, это будет ведро, которое было указано под "Workshopbucket" на странице выходных данных. 

<Lightbox src="/img/redshift_tutorial/images/s3_bucket.png" title="Перейдите в ваше ведро S3" />

4. Нажмите **Загрузить**. Перетащите три файла в интерфейс и нажмите кнопку **Загрузить**.

<Lightbox src="/img/redshift_tutorial/images/upload_csv.png" title="Загрузите ваши CSV" />

5. Запомните имя ведра S3 для дальнейшего использования. Оно должно выглядеть так: `s3://dbt-data-lake-xxxx`. Вам понадобится это для следующего раздела.
6. Теперь давайте вернемся к редактору запросов Redshift. Найдите Redshift в строке поиска, выберите ваш кластер и выберите Запрос данных.
7. В вашем редакторе запросов выполните следующий запрос, чтобы создать схемы, в которые мы будем помещать ваши необработанные данные. Вы можете выделить оператор и затем нажать на Запустить, чтобы выполнить их по отдельности. Если вы находитесь в классическом редакторе запросов, вам, возможно, придется вводить их по отдельности в интерфейсе. Вы должны увидеть эти схемы в разделе `dbtworkshop`.

    ```sql
    create schema if not exists jaffle_shop;
    create schema if not exists stripe;
    ```

8. Теперь создайте таблицы в вашей схеме с помощью этих запросов, используя приведенные ниже операторы. Эти таблицы будут заполнены в соответствующих схемах.

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

9. Теперь нам нужно скопировать данные из S3. Это позволяет вам выполнять запросы в этом руководстве в демонстрационных целях; это не пример того, как вы бы сделали это для реального проекта. Убедитесь, что вы обновили местоположение S3, роль iam и регион. Вы можете найти S3 и роль iam в ваших выходных данных из стека CloudFormation. Найдите стек, выполнив поиск по `CloudFormation` в строке поиска, затем нажмите **Stacks** в плитке CloudFormation. 

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

    Убедитесь, что вы можете выполнить `select *` из каждой из таблиц с помощью следующих кодов.

    ```sql 
    select * from jaffle_shop.customers;
    select * from jaffle_shop.orders;
    select * from stripe.payment;
    ```

## Подключение dbt Cloud к Redshift 
1. Создайте новый проект в [dbt Cloud](/docs/cloud/about-cloud/access-regions-ip-addresses). Перейдите в **Настройки учетной записи** (нажав на имя вашей учетной записи в левом меню) и нажмите **+ Новый проект**.
2. Введите имя проекта и нажмите **Продолжить**.
3. Для склада нажмите **Redshift**, затем **Далее**, чтобы настроить ваше соединение.
4. Введите настройки Redshift. Ссылайтесь на учетные данные, которые вы сохранили из шаблона CloudFormation.
    - **Имя хоста** — Ваше полное имя хоста.
    - **Порт** — `5439`
    - **База данных** — `dbtworkshop`.

    <Lightbox src="/img/redshift_tutorial/images/dbt_cloud_redshift_account_settings.png" width="90%" title="dbt Cloud - Настройки кластера Redshift" />

    :::tip
    Чтобы избежать проблем с подключением к dbt Cloud, убедитесь, что разрешен входящий трафик на порту 5439 от [IP-адресов dbt Cloud](/docs/cloud/about-cloud/access-regions-ip-addresses) в ваших группах безопасности Redshift и настройках списков управления доступом к сети (NACL).
    :::

5. Установите свои учетные данные для разработки. Эти учетные данные будут использоваться dbt Cloud для подключения к Redshift. Эти учетные данные (как указано в ваших выходных данных CloudFormation) будут:
    - **Имя пользователя** — `dbtadmin`
    - **Пароль** — Это сгенерированный пароль, который вы использовали ранее в руководстве.
    - **Схема** — dbt Cloud автоматически генерирует имя схемы для вас. По умолчанию это `dbt_<первая_буква_имени><фамилия>`. Это схема, которая напрямую связана с вашей средой разработки, и именно здесь будут создаваться ваши модели при выполнении dbt в Cloud IDE.

    <Lightbox src="/img/redshift_tutorial/images/dbt_cloud_redshift_development_credentials.png" title="dbt Cloud - Учетные данные разработки Redshift" />

6. Нажмите **Проверить соединение**. Это проверяет, может ли dbt Cloud получить доступ к вашему кластеру Redshift.
7. Нажмите **Далее**, если тест прошел успешно. Если он не удался, вам, возможно, придется проверить настройки и учетные данные Redshift.

## Настройка управляемого репозитория dbt Cloud 
<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки
Теперь, когда у вас настроен репозиторий, вы можете инициализировать свой проект и начать разработку в dbt Cloud:

1. Нажмите **Начать разработку в IDE**. Это может занять несколько минут, чтобы ваш проект запустился в первый раз, так как он устанавливает ваше соединение с git, клонирует ваш репозиторий и тестирует соединение со складом.
2. Над деревом файлов слева нажмите **Инициализировать проект dbt**. Это создаст вашу структуру папок с примерами моделей.
3. Сделайте свой первый коммит, нажав **Коммит и синхронизация**. Используйте сообщение коммита `initial commit` и нажмите **Коммит**. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, в которой вы можете добавить новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из вашего склада и выполнять `dbt run`. Вы можете попробовать это сейчас:
    - Нажмите **+ Создать новый файл**, добавьте этот запрос в новый файл и нажмите **Сохранить как**, чтобы сохранить новый файл: 
        ```sql
        select * from jaffle_shop.customers
        ```
    - В строке команд внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели

У вас есть два варианта работы с файлами в dbt Cloud IDE:

- Создать новую ветку (рекомендуется) — Создайте новую ветку, чтобы редактировать и коммитить ваши изменения. Перейдите в **Контроль версий** на левой боковой панели и нажмите **Создать ветку**.
- Редактировать в защищенной основной ветке — Если вы предпочитаете редактировать, форматировать или проверять файлы и выполнять команды dbt непосредственно в вашей основной ветке git. dbt Cloud IDE предотвращает коммиты в защищенной ветке, поэтому вам будет предложено коммитить ваши изменения в новую ветку.

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

Позже вы можете подключить свои инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не необработанные данные в вашем инструменте BI.

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

    На этот раз, когда вы выполнили `dbt run`, были созданы отдельные представления/таблицы для `stg_customers`, `stg_orders` и `customers`. dbt определил порядок выполнения этих моделей. Поскольку `customers` зависит от `stg_customers` и `stg_orders`, dbt создает `customers` последним. Вам не нужно явно определять эти зависимости.


#### Часто задаваемые вопросы {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="Как мне организовать свой проект, когда я создаю больше моделей? Как мне называть свои модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />
