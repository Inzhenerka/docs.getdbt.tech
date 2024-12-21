---
title: "Быстрый старт для dbt Cloud и Starburst Galaxy"
id: "starburst-galaxy"
level: 'Beginner'
icon: 'starburst'
hide_table_of_contents: true
tags: ['dbt Cloud','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как использовать dbt Cloud с [Starburst Galaxy](https://www.starburst.io/platform/starburst-galaxy/). Оно покажет вам, как:

- Загрузить данные в Amazon S3 bucket. В этом руководстве используется AWS в качестве облачного провайдера для демонстрационных целей. Starburst Galaxy также [поддерживает другие источники данных](https://docs.starburst.io/starburst-galaxy/catalogs/index.html), такие как Google Cloud, Microsoft Azure и другие.
- Подключить Starburst Galaxy к Amazon S3 bucket.
- Создать таблицы с помощью Starburst Galaxy.
- Подключить dbt Cloud к Starburst Galaxy.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.
- Подключиться к нескольким источникам данных в дополнение к вашему S3 bucket.

:::tip Видео для вас
Вы можете бесплатно ознакомиться с [Основами dbt](https://learn.getdbt.com/courses/dbt-fundamentals), если вас интересует обучение с видео.

Вы также можете посмотреть видео на YouTube [Создайте лучшие конвейеры данных с dbt и Starburst](https://www.youtube.com/watch?v=tfWm4dWgwRg), созданное Starburst Data, Inc.
:::

### Предварительные требования

- У вас есть [мультиарендное](/docs/cloud/about-cloud/access-regions-ip-addresses) развертывание в [dbt Cloud](https://www.getdbt.com/signup/). Для получения дополнительной информации обратитесь к [Аренда](/docs/cloud/about-cloud/tenancy).
- У вас есть [аккаунт Starburst Galaxy](https://www.starburst.io/platform/starburst-galaxy/). Если нет, вы можете начать бесплатную пробную версию. Обратитесь к [руководству по началу работы](https://docs.starburst.io/starburst-galaxy/get-started.html) в документации Starburst Galaxy для получения дополнительных сведений о настройке.
- У вас есть аккаунт AWS с правами на загрузку данных в S3 bucket.
- Для аутентификации Amazon S3 вам потребуется либо ключ доступа AWS и секретный ключ AWS с доступом к bucket, либо роль IAM для кросс-аккаунта с доступом к bucket. Для получения подробной информации обратитесь к этим документам Starburst Galaxy:
    - [Инструкции по ключу доступа и секретному ключу AWS](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#aws-access-and-secret-key)
    - [Роль IAM для кросс-аккаунта](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#role)

### Связанные материалы

- [Курсы dbt Learn](https://learn.getdbt.com)
- [Задание CI в dbt Cloud](/docs/deploy/continuous-integration)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источника](/docs/deploy/source-freshness)
- [Обзор SQL для Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/sql/index.html)

## Загрузка данных в Amazon S3 bucket {#load-data-to-s3}

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

## Подключение dbt Cloud к Starburst Galaxy

1. Убедитесь, что вы все еще вошли в [Starburst Galaxy](https://galaxy.starburst.io/login).
2. Если вы еще не сделали этого, установите роль вашего аккаунта на accountadmin. Нажмите на ваш адрес электронной почты в правом верхнем углу, выберите **Switch role** и выберите **accountadmin**.

    Если эта роль не указана для вас, выберите роль, которую вы выбрали в [Подключение Starburst Galaxy к Amazon S3 bucket](#connect-to-s3-bucket), когда добавляли привилегию местоположения для вашего S3 bucket.
3. Нажмите **Clusters** на левой боковой панели.
4. Найдите ваш кластер в таблице **View clusters** и нажмите **Connection info**. Выберите **dbt** из выпадающего списка **Select client**. Держите модальное окно **Connection information** открытым. Вы будете использовать детали из этого модального окна в dbt Cloud.
5. В другой вкладке браузера войдите в [dbt Cloud](/docs/cloud/about-cloud/access-regions-ip-addresses).
6. Создайте новый проект в dbt Cloud. Нажмите на имя вашего аккаунта в левом меню, выберите **Account settings** и нажмите **+ New Project**.
7. Введите имя проекта и нажмите **Continue**.
8. Выберите **Starburst** в качестве вашего подключения и нажмите **Next**.
9. Введите **Settings** для вашего нового проекта:
    - **Host** – Значение **Host** из модального окна **Connection information** в вашей вкладке Starburst Galaxy.
    - **Port** – 443 (по умолчанию)
10. Введите **Development Credentials** для вашего нового проекта:
    - **User** – Значение **User** из модального окна **Connection information** в вашей вкладке Starburst Galaxy. Убедитесь, что вы используете всю строку, включая роль аккаунта, которая идет после `/`. Если вы не включите ее, будет использована ваша роль по умолчанию, которая может не иметь правильных разрешений для разработки проекта.
    - **Password** – Пароль, который вы используете для входа в ваш аккаунт Starburst Galaxy.
    - **Database** – Каталог Starburst, в который вы хотите сохранить ваши данные (например, при записи новых таблиц). Для справки, database является синонимом catalog между dbt Cloud и Starburst Galaxy.
    - Оставьте остальные параметры как есть. Вы можете использовать их значения по умолчанию.
11. Нажмите **Test Connection**. Это проверяет, может ли dbt Cloud получить доступ к вашему кластеру Starburst Galaxy.
12. Нажмите **Next**, если тест прошел успешно. Если он не прошел, возможно, вам нужно проверить настройки и учетные данные Starburst Galaxy.

## Настройка управляемого репозитория dbt Cloud
<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки
Теперь, когда у вас настроен репозиторий, вы можете инициализировать ваш проект и начать разработку в dbt Cloud:

1. Нажмите **Start developing in the IDE**. Это может занять несколько минут, так как ваш проект запускается в первый раз, устанавливая ваше git-подключение, клонируя ваш репозиторий и тестируя подключение к хранилищу.
2. Над деревом файлов слева нажмите **Initialize dbt project**. Это создаст структуру папок с примерами моделей.
3. Сделайте ваш первый коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit` и нажмите **Commit**. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, в которой вы можете добавить новый код dbt.
4. Теперь вы можете напрямую выполнять запросы к данным из вашего хранилища и выполнять `dbt run`. Вы можете попробовать это сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить новый файл:
        ```sql
            select * from dbt_quickstart.jaffle_shop.jaffle_shop_customers
        ```
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели

У вас есть два варианта работы с файлами в IDE dbt Cloud:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку, чтобы редактировать и фиксировать ваши изменения. Перейдите в **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать в защищенной основной ветке &mdash; Если вы предпочитаете редактировать, форматировать или проверять файлы и выполнять команды dbt напрямую в вашей основной ветке git. IDE dbt Cloud предотвращает коммиты в защищенную ветку, поэтому вам будет предложено зафиксировать ваши изменения в новой ветке.

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

Если вы хотите попробовать это, вы можете обратиться к [документации Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/catalogs/), чтобы добавить больше источников данных и загрузить данные Jaffle Shop в выбранный вами источник. Затем расширьте ваши модели, чтобы выполнять запросы к новому источнику данных и источнику данных, который вы создали в этом быстром старте.