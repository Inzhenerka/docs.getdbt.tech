---
title: "Быстрый старт для dbt и Starburst Galaxy"
id: "starburst-galaxy"
level: 'Beginner'
icon: 'starburst'
hide_table_of_contents: true
tags: ['dbt platform','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом руководстве по быстрому старту вы узнаете, как использовать <Constant name="cloud" /> вместе с [Starburst Galaxy](https://www.starburst.io/platform/starburst-galaxy/). Руководство покажет вам, как:

- Загрузить данные в бакет Amazon S3. В этом руководстве AWS используется в качестве облачного провайдера исключительно в демонстрационных целях. Starburst Galaxy также [поддерживает другие источники данных](https://docs.starburst.io/starburst-galaxy/catalogs/index.html), такие как Google Cloud, Microsoft Azure и другие.
- Подключить Starburst Galaxy к бакету Amazon S3.
- Создавать таблицы с помощью Starburst Galaxy.
- Подключить <Constant name="cloud" /> к Starburst Galaxy.
- Взять пример запроса и превратить его в модель в вашем dbt‑проекте. Модель в dbt — это оператор `select`.
- Добавить тесты к моделям.
- Документировать модели.
- Запланировать выполнение задания.
- Подключаться к нескольким источникам данных в дополнение к вашему бакету S3.

:::tip Видео для вас
Вы можете бесплатно пройти курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals), если вам интересен формат обучения с видео.

Также вы можете посмотреть видео на YouTube [Build Better Data Pipelines with dbt and Starburst](https://www.youtube.com/watch?v=tfWm4dWgwRg), подготовленное компанией Starburst Data, Inc.
:::

### Предварительные требования {#prerequisites}

- У вас есть [multi-tenant](/docs/cloud/about-cloud/access-regions-ip-addresses)‑развертывание в [<Constant name="cloud" />](https://www.getdbt.com/signup/). Подробнее см. [Tenancy](/docs/cloud/about-cloud/tenancy).
- У вас есть [учетная запись Starburst Galaxy](https://www.starburst.io/platform/starburst-galaxy/). Если нет, вы можете начать с бесплатного пробного периода. Дополнительные сведения по первоначальной настройке см. в [руководстве по началу работы](https://docs.starburst.io/starburst-galaxy/get-started.html) в документации Starburst Galaxy.
- У вас есть учетная запись AWS с правами на загрузку данных в бакет S3.
- Для аутентификации Amazon S3 вам потребуется либо AWS access key и AWS secret key с доступом к бакету, либо кросс‑аккаунтная IAM‑роль с доступом к бакету. Подробнее см. документацию Starburst Galaxy:
    - [Инструкции по AWS access key и secret key](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#aws-access-and-secret-key)
    - [Cross account IAM role](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#role)

### Связанные материалы {#related-content}

- [Курсы dbt Learn](https://learn.getdbt.com)
- [CI‑задание <Constant name="cloud" />](/docs/deploy/continuous-integration)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источников](/docs/deploy/source-freshness)
- [Обзор SQL для Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/sql/index.html)

## Загрузка данных в бакет Amazon S3 {#load-data-to-s3}

Используя Starburst Galaxy, вы можете создавать таблицы и трансформировать их с помощью dbt. Начните с загрузки данных Jaffle Shop (предоставлены dbt Labs) в ваш бакет Amazon S3. Jaffle Shop — это вымышленное кафе, продающее еду и напитки в нескольких городах США.

1. Скачайте следующие CSV‑файлы на локальный компьютер:

    - [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
    - [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
    - [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

2. Загрузите эти файлы в S3. Подробности см. в разделе [Upload objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html) документации Amazon S3.

    При загрузке файлов необходимо создать следующую структуру папок и поместить соответствующий файл в каждую папку:

    ```
    <bucket/blob>
        dbt-quickstart (folder)
            jaffle-shop-customers (folder)
                jaffle_shop_customers.csv (file)
            jaffle-shop-orders (folder)
                jaffle_shop_orders.csv (file)
            stripe-payments (folder)
                stripe-payments.csv (file)
    ```

## Подключение Starburst Galaxy к бакету Amazon S3 {#connect-to-s3-bucket}

Если ваш экземпляр Starburst Galaxy еще не подключен к бакету S3, вам нужно создать кластер, настроить каталог, позволяющий Starburst Galaxy подключаться к S3, добавить каталог в кластер и настроить права доступа.

Помимо Amazon S3, Starburst Galaxy поддерживает множество других источников данных. Подробнее см. в разделе [Catalogs overview](https://docs.starburst.io/starburst-galaxy/catalogs/index.html) документации Starburst Galaxy.

1. Создайте кластер. Нажмите **Clusters** на левой боковой панели интерфейса Starburst Galaxy, затем нажмите **Create cluster** в основной части страницы.
2. В модальном окне **Create a new cluster** укажите только следующие параметры (остальные можно оставить по умолчанию):
    - **Cluster name** — введите имя кластера.
    - **Cloud provider region** — выберите регион AWS.

    Нажмите **Create cluster**.

3. Создайте каталог. Нажмите **Catalogs** на левой боковой панели, затем **Create catalog**.
4. На странице **Create a data source** выберите плитку Amazon S3.
5. В разделе **Name and description** страницы **Amazon S3** заполните поля.
6. В разделе **Authentication to S3** выберите [механизм аутентификации AWS (S3)](#prerequisites), который вы используете.
7. В разделе **Metastore configuration** задайте следующие параметры:
    - **Default S3 bucket name** — имя бакета S3, к которому вы хотите получить доступ.
    - **Default directory name** — имя папки в бакете S3, где находятся данные Jaffle Shop (та же папка, что и в разделе [Load data to an Amazon S3 bucket](#load-data-to-s3)).
    - **Allow creating external tables** — включите.
    - **Allow writing to external tables** — включите.

    Страница **Amazon S3** должна выглядеть примерно так же, за исключением раздела **Authentication to S3**, который зависит от вашей конфигурации:

    <Lightbox src="/img/quickstarts/dbt-cloud/starburst-galaxy-config-s3.png" title="Настройки подключения Amazon S3 в Starburst Galaxy" />

8. Нажмите **Test connection**, чтобы проверить доступ Starburst Galaxy к вашему бакету S3.
9. Если тест прошел успешно, нажмите **Connect catalog**.
    <Lightbox src="/img/quickstarts/dbt-cloud/test-connection-success.png" title="Успешная проверка подключения" />

10. На странице **Set permissions** нажмите **Skip** — при необходимости вы сможете добавить права позже.
11. На странице **Add to cluster** выберите кластер из выпадающего списка и нажмите **Add to cluster**.
12. Добавьте привилегию location для вашего бакета S3 к роли в Starburst Galaxy. В левой боковой панели нажмите **Access control > Roles and privileges**, затем в таблице **Roles** выберите роль **accountadmin**.

    Если вы используете существующий кластер и не имеете доступа к роли accountadmin, выберите роль, к которой у вас есть доступ.

    Подробнее о контроле доступа см. в разделе [Access control](https://docs.starburst.io/starburst-galaxy/security/access-control.html) документации Starburst Galaxy.

13. На странице **Roles** откройте вкладку **Privileges** и нажмите **Add privilege**.
14. На странице **Add privilege** задайте:
    - **What would you like to modify privileges for?** — выберите **Location**.
    - **Enter a storage location provide** — укажите путь к _вашему бакету S3_ и папке с данными Jaffle Shop. Обязательно добавьте `/*` в конце.
    - **Create SQL** — включите.

    Нажмите **Add privileges**.

    <Lightbox src="/img/quickstarts/dbt-cloud/add-privilege.png" title="Добавление привилегии для роли accountadmin" />

## Создание таблиц в Starburst Galaxy {#create-tables-with-starburst-galaxy}

Чтобы выполнять запросы к данным Jaffle Shop через Starburst Galaxy, необходимо создать таблицы на основе данных, которые вы [загрузили в бакет S3](#load-data-to-s3). Это можно сделать (как и выполнить любой SQL‑запрос) из [редактора запросов](https://docs.starburst.io/starburst-galaxy/query/query-editor.html).

1. В левой боковой панели нажмите **Query > Query editor**.
2. Настройте редактор запросов для работы с вашим бакетом S3. В правом верхнем углу выберите кластер в первом сером поле и каталог — во втором:

    <Lightbox src="/img/quickstarts/dbt-cloud/starburst-galaxy-editor.png" title="Выбор кластера и каталога в редакторе запросов" />

3. Скопируйте и вставьте следующие запросы в редактор и выполните каждый по отдельности (**Run**).

    Замените `YOUR_S3_BUCKET_NAME` на имя вашего бакета S3. Эти запросы создают схему `jaffle_shop` и таблицы `jaffle_shop_customers`, `jaffle_shop_orders` и `stripe_payments`:

    ```sql
    CREATE SCHEMA jaffle_shop WITH (location='s3://YOUR_S3_BUCKET_NAME/dbt-quickstart/');

    CREATE TABLE jaffle_shop.jaffle_shop_customers (
        id VARCHAR,
        first_name VARCHAR,
        last_name VARCHAR
    )

    WITH (
        external_location = 's3://YOUR_S3_BUCKET_NAME/dbt-quickstart/jaffle-shop-customers/',
        format = 'csv',
        type = 'hive',
        skip_header_line_count=1

    );

    CREATE TABLE jaffle_shop.jaffle_shop_orders (

        id VARCHAR,
        user_id VARCHAR,
        order_date VARCHAR,
        status VARCHAR

    )

    WITH (
        external_location = 's3://YOUR_S3_BUCKET_NAME/dbt-quickstart/jaffle-shop-orders/',
        format = 'csv',
        type = 'hive',
        skip_header_line_count=1
    );

    CREATE TABLE jaffle_shop.stripe_payments (

        id VARCHAR,
        order_id VARCHAR,
        paymentmethod VARCHAR,
        status VARCHAR,
        amount VARCHAR,
        created VARCHAR
    )

    WITH (

        external_location = 's3://YOUR_S3_BUCKET_NAME/dbt-quickstart/stripe-payments/',
        format = 'csv',
        type = 'hive',
        skip_header_line_count=1

    );
    ```

4. После выполнения запросов в левой боковой панели редактора вы увидите следующую иерархию:

    <Lightbox src="/img/quickstarts/dbt-cloud/starburst-data-hierarchy.png" title="Иерархия данных в редакторе запросов" />

5. Проверьте, что таблицы были успешно созданы, выполнив запросы:

    ```sql
    select * from jaffle_shop.jaffle_shop_customers;
    select * from jaffle_shop.jaffle_shop_orders;
    select * from jaffle_shop.stripe_payments;
    ```

## Подключение dbt к Starburst Galaxy {#connect-dbt-to-starburst-galaxy}

1. Убедитесь, что вы вошли в [Starburst Galaxy](https://galaxy.starburst.io/login).
2. Если вы еще этого не сделали, установите роль учетной записи accountadmin. Нажмите на адрес электронной почты в правом верхнем углу, выберите **Switch role** и укажите **accountadmin**.

    Если эта роль недоступна, выберите роль, которую вы использовали при добавлении привилегии location в разделе [Connect Starburst Galaxy to the Amazon S3 bucket](#connect-to-s3-bucket).
3. В левой боковой панели нажмите **Clusters**.
4. Найдите ваш кластер в таблице **View clusters** и нажмите **Connection info**. В выпадающем списке **Select client** выберите **dbt**. Оставьте модальное окно **Connection information** открытым — эти данные понадобятся в <Constant name="cloud" />.
5. В другой вкладке браузера войдите в [<Constant name="cloud" />](/docs/cloud/about-cloud/access-regions-ip-addresses).
6. Создайте новый проект в <Constant name="cloud" />. Нажмите на имя учетной записи в левом меню, выберите **Account settings** и нажмите **+ New Project**.
7. Введите имя проекта и нажмите **Continue**.
8. Выберите **Starburst** в качестве подключения и нажмите **Next**.
9. Укажите **Settings**:
    - **Host** — значение **Host** из окна **Connection information** в Starburst Galaxy.
    - **Port** — 443 (значение по умолчанию).
10. Укажите **Development Credentials**:
    - **User** — значение **User** из окна **Connection information**. Обязательно используйте всю строку целиком, включая роль учетной записи после `/`.
    - **Password** — пароль для входа в Starburst Galaxy.
    - **Database** — каталог Starburst, в который будут сохраняться данные. Для справки: в <Constant name="cloud" /> и Starburst Galaxy термины database и catalog используются как синонимы.
    - Остальные параметры оставьте без изменений.
11. Нажмите **Test Connection**, чтобы проверить доступ <Constant name="cloud" /> к кластеру Starburst Galaxy.
12. Если тест успешен, нажмите **Next**. Если нет — проверьте настройки и учетные данные.

## Настройка репозитория, управляемого dbt {#set-up-a-dbt-managed-repository}

<Snippet path="tutorial-managed-repo" />

## Инициализация dbt‑проекта и начало разработки {#initialize-your-dbt-project-and-start-developing}

Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="cloud" />:

1. Нажмите **Start developing in the <Constant name="cloud_ide" />**. Первый запуск может занять несколько минут.
2. Над деревом файлов слева нажмите **Initialize dbt project**.
3. Сделайте первый коммит: нажмите **Commit and sync**, используйте сообщение `initial commit` и нажмите **Commit**.
4. Теперь вы можете выполнять запросы и запускать `dbt run`. Попробуйте:
    - Нажмите **+ Create new file**, добавьте запрос и сохраните файл:
        ```sql
            select * from dbt_quickstart.jaffle_shop.jaffle_shop_customers
        ```
    - В командной строке внизу выполните `dbt run`. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание первой модели {#build-your-first-model}

У вас есть два варианта работы с файлами в <Constant name="cloud_ide" />:

- Создать новую ветку (рекомендуется).
- Редактировать в защищенной основной ветке.

Назовите новую ветку `add-customers-model`.

1. Нажмите **...** рядом с каталогом `models` и выберите **Create file**.
2. Назовите файл `customers.sql`.
3. Вставьте следующий запрос и нажмите **Save**.

```sql
with customers as (

    select
        id as customer_id,
        first_name,
        last_name

    from dbt_quickstart.jaffle_shop.jaffle_shop_customers
),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from dbt_quickstart.jaffle_shop.jaffle_shop_orders
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
    left join customer_orders on customers.customer_id = customer_orders.customer_id
)
select * from final

```

4. Выполните `dbt run` — вы должны увидеть успешное выполнение и три модели.

Позже вы сможете подключить BI‑инструменты к этим представлениям и таблицам, чтобы они читали уже очищенные данные.

#### FAQs {#faqs}

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

## Изменение способа материализации модели {#change-the-way-your-model-is-materialized}

<Snippet path="quickstarts/change-way-model-materialized" />

## Удаление примеров моделей {#delete-the-example-models}

<Snippet path="quickstarts/delete-example-models" />

## Построение моделей поверх других моделей {#build-models-on-top-of-other-models}

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте файл `models/stg_customers.sql` с SQL из CTE `customers`.
2. Создайте файл `models/stg_orders.sql` с SQL из CTE `orders`.

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from dbt_quickstart.jaffle_shop.jaffle_shop_customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from dbt_quickstart.jaffle_shop.jaffle_shop_orders
    ```

    </File>

3. Отредактируйте `models/customers.sql` следующим образом:

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

        left join customer_orders on customers.customer_id = customer_orders.customer_id

    )

    select * from final
    
    ```

    </File>

4. Выполните `dbt run`.

    На этот раз dbt создаст отдельные представления/таблицы для `stg_customers`, `stg_orders` и `customers`. Порядок выполнения будет определен автоматически на основе зависимостей.

#### FAQs {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="По мере создания новых моделей, как лучше организовать проект? Как называть модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />

## Подключение к нескольким источникам данных {#connect-to-multiple-data-sources}

Этот быстрый старт посвящен использованию <Constant name="cloud" /> для запуска моделей поверх data lake (S3) с помощью Starburst Galaxy в качестве движка запросов. В реальных сценариях данные обычно распределены по нескольким источникам и хранятся в разных форматах. С помощью Starburst Galaxy, Starburst Enterprise и Trino вы можете запускать модели над любыми данными, независимо от места их хранения.

Если вы хотите попробовать это, обратитесь к [документации Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/catalogs/), добавьте дополнительные источники данных и загрузите данные Jaffle Shop в выбранный источник. Затем расширьте свои модели, чтобы они обращались как к новому источнику данных, так и к источнику, созданному в рамках этого быстрого старта.
