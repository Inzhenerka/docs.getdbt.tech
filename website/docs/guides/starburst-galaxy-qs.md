---
title: "Быстрый старт для dbt и Starburst Galaxy"
id: "starburst-galaxy"
level: 'Beginner'
icon: 'starburst'
hide_table_of_contents: true
tags: ['dbt platform','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом кратком руководстве вы узнаете, как использовать <Constant name="cloud" /> вместе с [Starburst Galaxy](https://www.starburst.io/platform/starburst-galaxy/). В нем показано, как:

- Загрузить данные в бакет Amazon S3. В этом руководстве AWS используется в качестве облачного провайдера исключительно в демонстрационных целях. Starburst Galaxy также [поддерживает другие источники данных](https://docs.starburst.io/starburst-galaxy/catalogs/index.html), такие как Google Cloud, Microsoft Azure и другие.
- Подключить Starburst Galaxy к бакету Amazon S3.
- Создавать таблицы с помощью Starburst Galaxy.
- Подключить <Constant name="cloud" /> к Starburst Galaxy.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор `select`.
- Добавить тесты к вашим моделям.
- Задокументировать ваши модели.
- Запланировать выполнение задания.
- Подключиться к нескольким источникам данных в дополнение к вашему бакету S3.

:::tip Видео для вас
Вы можете бесплатно ознакомиться с [Основами dbt](https://learn.getdbt.com/courses/dbt-fundamentals), если вас интересует обучение с видео.

Вы также можете посмотреть видео на YouTube [Создайте лучшие конвейеры данных с dbt и Starburst](https://www.youtube.com/watch?v=tfWm4dWgwRg), созданное Starburst Data, Inc.
:::

### Предварительные требования

- У вас есть развертывание в режиме [multi-tenant](/docs/cloud/about-cloud/access-regions-ip-addresses) в [<Constant name="cloud" />](https://www.getdbt.com/signup/). Подробнее см. раздел [Tenancy](/docs/cloud/about-cloud/tenancy).
- У вас есть [аккаунт Starburst Galaxy](https://www.starburst.io/platform/starburst-galaxy/). Если его нет, вы можете начать бесплатный пробный период. Дополнительные сведения по первоначальной настройке см. в [руководстве по началу работы](https://docs.starburst.io/starburst-galaxy/get-started.html) в документации Starburst Galaxy.
- У вас есть аккаунт AWS с правами на загрузку данных в бакет S3.
- Для аутентификации Amazon S3 вам потребуется либо AWS access key и AWS secret key с доступом к бакету, либо cross account IAM role с доступом к бакету. Подробности см. в документации Starburst Galaxy:
    - [Инструкции по AWS access key и secret key](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#aws-access-and-secret-key)
    - [Cross account IAM role](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#role)

### Связанные материалы

- [Курсы dbt Learn](https://learn.getdbt.com)
- [Задание CI в dbt Cloud](/docs/deploy/continuous-integration)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источника](/docs/deploy/source-freshness)
- [Обзор SQL для Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/sql/index.html)

- [Курсы обучения dbt Learn](https://learn.getdbt.com)
- [CI job в <Constant name="cloud" />](/docs/deploy/continuous-integration)
- [Уведомления о задачах](/docs/deploy/job-notifications)
- [Актуальность источников данных](/docs/deploy/source-freshness)
- [Обзор SQL для Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/sql/index.html)

С помощью Starburst Galaxy вы можете создавать таблицы и также преобразовывать их с помощью dbt. Начните с загрузки данных Jaffle Shop (предоставленных dbt Labs) в ваш Amazon S3 bucket. Jaffle Shop — это вымышленное кафе, продающее еду и напитки в нескольких городах США.

1. Скачайте эти CSV файлы на ваш локальный компьютер:

    - [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
    - [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
    - [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)
2. Загрузите эти файлы в S3. Для получения подробной информации обратитесь к [Загрузка объектов](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html) в документации Amazon S3.

    При загрузке этих файлов вы должны создать следующую структуру папок и загрузить соответствующий файл в каждую папку:

    ```
    <bucket/blob>
        dbt-quickstart (папка)
            jaffle-shop-customers (папка)
                jaffle_shop_customers.csv (файл)
            jaffle-shop-orders (папка)
                jaffle_shop_orders.csv (файл)
            stripe-payments (папка)
                stripe-payments.csv (файл)
    ```

## Подключение Starburst Galaxy к Amazon S3 bucket {#connect-to-s3-bucket}
Если ваш экземпляр Starburst Galaxy еще не подключен к вашему S3 bucket, вам нужно создать кластер, настроить каталог, который позволит Starburst Galaxy подключаться к S3 bucket, добавить каталог в ваш новый кластер и настроить параметры привилегий.

В дополнение к Amazon S3, Starburst Galaxy поддерживает множество других источников данных. Чтобы узнать больше о них, вы можете обратиться к [Обзор каталогов](https://docs.starburst.io/starburst-galaxy/catalogs/index.html) в документации Starburst Galaxy.

1. Создайте кластер. Нажмите **Clusters** на левой боковой панели интерфейса Starburst Galaxy, затем нажмите **Create cluster** в основной части страницы.
2. В модальном окне **Create a new cluster** вам нужно установить только следующие параметры. Вы можете использовать значения по умолчанию для других параметров.
    - **Cluster name** &mdash; Введите имя для вашего кластера.
    - **Cloud provider region** &mdash; Выберите регион AWS.

    Когда закончите, нажмите **Create cluster**.

3. Создайте каталог. Нажмите **Catalogs** на левой боковой панели интерфейса Starburst Galaxy, затем нажмите **Create catalog** в основной части страницы.
4. На странице **Create a data source** выберите плитку Amazon S3.
5. В разделе **Name and description** страницы **Amazon S3** заполните поля.
6. В разделе **Authentication to S3** страницы **Amazon S3** выберите [механизм аутентификации AWS (S3)](#prerequisites), который вы выбрали для подключения.
7. В разделе **Metastore configuration** установите следующие параметры:
    - **Default S3 bucket name** &mdash; Введите имя вашего S3 bucket, к которому вы хотите получить доступ.
    - **Default directory name** &mdash; Введите имя папки, где находятся данные Jaffle Shop в S3 bucket. Это то же самое имя папки, которое вы использовали в [Загрузка данных в Amazon S3 bucket](#load-data-to-s3).
    - **Allow creating external tables** &mdash; Включите эту опцию.
    - **Allow writing to external tables** &mdash; Включите эту опцию.

    Страница **Amazon S3** должна выглядеть примерно так, за исключением раздела **Authentication to S3**, который зависит от вашей настройки:

    <Lightbox src="/img/quickstarts/dbt-cloud/starburst-galaxy-config-s3.png" title="Настройки подключения Amazon S3 в Starburst Galaxy" />

8. Нажмите **Test connection**. Это проверяет, может ли Starburst Galaxy получить доступ к вашему S3 bucket.
9. Нажмите **Connect catalog**, если тест подключения прошел успешно.
    <Lightbox src="/img/quickstarts/dbt-cloud/test-connection-success.png" title="Успешный тест подключения" />

10. На странице **Set permissions** нажмите **Skip**. Вы можете добавить разрешения позже, если хотите.
11. На странице **Add to cluster** выберите кластер, в который вы хотите добавить каталог, из выпадающего списка и нажмите **Add to cluster**.
12. Добавьте привилегию местоположения для вашего S3 bucket к вашей роли в Starburst Galaxy. Нажмите **Access control > Roles and privileges** на левой боковой панели интерфейса Starburst Galaxy. Затем в таблице **Roles** нажмите имя роли **accountadmin**.

    Если вы используете существующий кластер Starburst Galaxy и не имеете доступа к роли accountadmin, выберите роль, к которой у вас есть доступ.

    Чтобы узнать больше о контроле доступа, обратитесь к [Контроль доступа](https://docs.starburst.io/starburst-galaxy/security/access-control.html) в документации Starburst Galaxy.
13. На странице **Roles** нажмите вкладку **Privileges** и нажмите **Add privilege**.
14. На странице **Add privilege** установите следующие параметры:
    - **What would you like to modify privileges for?** &mdash; Выберите **Location**.
    - **Enter a storage location provide** &mdash; Введите местоположение хранения _вашего S3 bucket_ и папки, где находятся данные Jaffle Shop. Убедитесь, что в конце местоположения включен `/*`.
    - **Create SQL** &mdash; Включите эту опцию.

    Когда закончите, нажмите **Add privileges**.

    <Lightbox src="/img/quickstarts/dbt-cloud/add-privilege.png" title="Добавление привилегии к роли accountadmin" />

## Создание таблиц с помощью Starburst Galaxy
Чтобы выполнять запросы к данным Jaffle Shop с помощью Starburst Galaxy, вам нужно создать таблицы, используя данные Jaffle Shop, которые вы [загрузили в ваш S3 bucket](#load-data-to-s3). Вы можете сделать это (и выполнить любой SQL-запрос) из [редактора запросов](https://docs.starburst.io/starburst-galaxy/query/query-editor.html).

1. Нажмите **Query > Query editor** на левой боковой панели интерфейса Starburst Galaxy. Основная часть страницы теперь является редактором запросов.
2. Настройте редактор запросов так, чтобы он выполнял запросы к вашему S3 bucket. В правом верхнем углу редактора запросов выберите ваш кластер в первом сером поле и выберите ваш каталог во втором сером поле:

    <Lightbox src="/img/quickstarts/dbt-cloud/starburst-galaxy-editor.png" title="Установка кластера и каталога в редакторе запросов" />

3. Скопируйте и вставьте эти запросы в редактор запросов. Затем **выполните** каждый запрос по отдельности.

    Замените `YOUR_S3_BUCKET_NAME` на имя вашего S3 bucket. Эти запросы создают схему с именем `jaffle_shop`, а также создают таблицы `jaffle_shop_customers`, `jaffle_shop_orders` и `stripe_payments`:

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
4. Когда запросы будут выполнены, вы сможете увидеть следующую иерархию на левой боковой панели редактора запросов:

    <Lightbox src="/img/quickstarts/dbt-cloud/starburst-data-hierarchy.png" title="Иерархия данных в редакторе запросов" />

5. Убедитесь, что таблицы были успешно созданы. В редакторе запросов выполните следующие запросы:

    ```sql
    select * from jaffle_shop.jaffle_shop_customers;
    select * from jaffle_shop.jaffle_shop_orders;
    select * from jaffle_shop.stripe_payments;
    ```

## Подключение dbt к Starburst Galaxy

1. Убедитесь, что вы по‑прежнему вошли в [Starburst Galaxy](https://galaxy.starburst.io/login).
2. Если вы ещё этого не сделали, установите для своей учётной записи роль **accountadmin**. Нажмите на свой адрес электронной почты в правом верхнем углу, выберите **Switch role** и укажите **accountadmin**.  
   
   Если эта роль вам недоступна, выберите ту роль, которую вы использовали в разделе [Connect Starburst Galaxy to the Amazon S3 bucket](#connect-to-s3-bucket), когда добавляли право доступа к расположению для вашего S3‑бакета.
3. В левой боковой панели нажмите **Clusters**.
4. Найдите ваш кластер в таблице **View clusters** и нажмите **Connection info**. В выпадающем списке **Select client** выберите **dbt**. Оставьте модальное окно **Connection information** открытым — данные из него понадобятся вам далее в <Constant name="cloud" />.
5. В другой вкладке браузера войдите в [<Constant name="cloud" />](/docs/cloud/about-cloud/access-regions-ip-addresses).
6. Создайте новый проект в <Constant name="cloud" />. Нажмите на имя своей учётной записи в левом меню, выберите **Account settings** и нажмите **+ New Project**.
7. Введите имя проекта и нажмите **Continue**.
8. Выберите **Starburst** в качестве подключения и нажмите **Next**.
9. Укажите **Settings** для нового проекта:
    - **Host** — значение **Host** из модального окна **Connection information** в Starburst Galaxy.
    - **Port** — 443 (значение по умолчанию).
10. Укажите **Development Credentials** для нового проекта:
    - **User** — значение **User** из модального окна **Connection information** в Starburst Galaxy. Обязательно используйте всю строку целиком, включая роль учётной записи (часть после `/` и все последующие символы). Если не указать роль, будет использована роль по умолчанию, у которой может не быть необходимых прав для разработки проекта.
    - **Password** — пароль, который вы используете для входа в свою учётную запись Starburst Galaxy.
    - **Database** — каталог Starburst, в который вы хотите сохранять данные (например, при создании новых таблиц). На будущее: в <Constant name="cloud" /> и Starburst Galaxy термины *database* и *catalog* используются как синонимы.
    - Остальные параметры оставьте без изменений — можно использовать значения по умолчанию.
11. Нажмите **Test Connection**. Это проверит, что <Constant name="cloud" /> может подключиться к вашему кластеру Starburst Galaxy.
12. Если проверка прошла успешно, нажмите **Next**. Если нет — возможно, потребуется проверить настройки и учётные данные Starburst Galaxy.

## Настройка управляемого репозитория dbt
<Snippet path="tutorial-managed-repo" />

## Инициализация проекта dbt и начало разработки
Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="cloud" />:

1. Нажмите **Start developing in the <Constant name="cloud_ide" />**. При первом запуске проект может разворачиваться несколько минут — в это время настраивается подключение к git, клонируется репозиторий и проверяется соединение с хранилищем данных.
2. Над деревом файлов слева нажмите **Initialize dbt project**. Это создаст структуру каталогов с примерами моделей.
3. Сделайте первый коммит, нажав **Commit and sync**. Введите сообщение коммита `initial commit` и нажмите **Commit**. Это создаст первый коммит в управляемом репозитории и позволит открыть ветку, в которой вы сможете добавлять новый dbt‑код.
4. Теперь вы можете напрямую выполнять запросы к вашему хранилищу данных и запускать `dbt run`. Можете попробовать это прямо сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить файл:
        ```sql
            select * from dbt_quickstart.jaffle_shop.jaffle_shop_customers
        ```
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели

У вас есть два варианта работы с файлами в <Constant name="cloud_ide" />:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку, чтобы редактировать файлы и коммитить изменения. Перейдите в раздел **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать в защищённой основной ветке &mdash; Если вы предпочитаете редактировать, форматировать или линтить файлы и выполнять команды dbt напрямую в основной git‑ветке. <Constant name="cloud_ide" /> не позволяет делать коммиты в защищённую ветку, поэтому вам будет предложено закоммитить изменения в новую ветку.

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

        left join customer_orders on customers.customer_id = customer_orders.customer_id

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

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />

## Подключение к нескольким источникам данных
Этот быстрый старт сосредоточен на использовании dbt Cloud для выполнения моделей против озера данных (S3) с использованием Starburst Galaxy в качестве движка запросов. В большинстве реальных сценариев данные, необходимые для выполнения моделей, фактически распределены по нескольким источникам данных и хранятся в различных форматах. С помощью Starburst Galaxy, Starburst Enterprise и Trino вы можете выполнять ваши модели на любых данных, которые вам нужны, независимо от того, где они хранятся.

## Подключение к нескольким источникам данных

Этот quickstart посвящён использованию <Constant name="cloud" /> для запуска моделей поверх data lake (S3) с применением Starburst Galaxy в качестве движка запросов. Однако в большинстве реальных сценариев данные, необходимые для выполнения моделей, на самом деле распределены по нескольким источникам данных и хранятся в различных форматах. С помощью Starburst Galaxy, Starburst Enterprise и Trino вы можете запускать свои модели на любых данных, которые вам нужны, независимо от того, где они хранятся.

Если вы хотите попробовать это на практике, обратитесь к [документации Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/catalogs/), чтобы добавить дополнительные источники данных и загрузить данные Jaffle Shop в выбранный вами источник. После этого расширьте свои модели так, чтобы они обращались и к новому источнику данных, и к источнику данных, созданному в рамках этого quickstart.
