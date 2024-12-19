---
title: "Быстрый старт для dbt Cloud и Starburst Galaxy"
id: "starburst-galaxy"
level: 'Начинающий'
icon: 'starburst'
hide_table_of_contents: true
tags: ['dbt Cloud','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве быстрого старта вы узнаете, как использовать dbt Cloud с [Starburst Galaxy](https://www.starburst.io/platform/starburst-galaxy/). Оно покажет вам, как:

- Загрузить данные в корзину Amazon S3. В этом руководстве используется AWS в качестве облачного провайдера для демонстрационных целей. Starburst Galaxy также [поддерживает другие источники данных](https://docs.starburst.io/starburst-galaxy/catalogs/index.html), такие как Google Cloud, Microsoft Azure и другие.
- Подключить Starburst Galaxy к корзине Amazon S3.
- Создать таблицы с помощью Starburst Galaxy.
- Подключить dbt Cloud к Starburst Galaxy.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.
- Подключиться к нескольким источникам данных, помимо вашей корзины S3.

:::tip Видео для вас
Если вам интересно обучение с видео, вы можете бесплатно ознакомиться с курсом [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).

Вы также можете посмотреть видео на YouTube [Build Better Data Pipelines with dbt and Starburst](https://www.youtube.com/watch?v=tfWm4dWgwRg), созданное компанией Starburst Data, Inc.
:::

### Предварительные требования 

- У вас есть [многоарендное](/docs/cloud/about-cloud/access-regions-ip-addresses) развертывание в [dbt Cloud](https://www.getdbt.com/signup/). Для получения дополнительной информации обратитесь к разделу [Многоарендность](/docs/cloud/about-cloud/tenancy).
- У вас есть [учетная запись Starburst Galaxy](https://www.starburst.io/platform/starburst-galaxy/). Если у вас ее нет, вы можете начать бесплатный пробный период. Обратитесь к [руководству по началу работы](https://docs.starburst.io/starburst-galaxy/get-started.html) в документации Starburst Galaxy для получения дополнительных сведений о настройке.
- У вас есть учетная запись AWS с разрешениями на загрузку данных в корзину S3.
- Для аутентификации в Amazon S3 вам потребуется либо ключ доступа AWS и секретный ключ AWS с доступом к корзине, либо вам потребуется роль IAM для кросс-учетных записей с доступом к корзине. Для получения подробной информации обратитесь к следующим документам Starburst Galaxy: 
    - [Инструкции по ключам доступа и секретным ключам AWS](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#aws-access-and-secret-key)
    - [Роль IAM для кросс-учетных записей](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#role)

### Связанный контент

- [Курсы dbt Learn](https://learn.getdbt.com)
- [CI задание dbt Cloud](/docs/deploy/continuous-integration)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источников](/docs/deploy/source-freshness)
- [Обзор SQL для Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/sql/index.html)    

## Загрузка данных в корзину Amazon S3 {#load-data-to-s3}

С помощью Starburst Galaxy вы можете создавать таблицы и также преобразовывать их с помощью dbt. Начните с загрузки данных Jaffle Shop (предоставленных dbt Labs) в вашу корзину Amazon S3. Jaffle Shop — это вымышленное кафе, продающее еду и напитки в нескольких городах США. 

1. Скачайте эти CSV файлы на ваш локальный компьютер:

    - [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
    - [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
    - [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)
2. Загрузите эти файлы в S3. Для получения подробной информации обратитесь к разделу [Загрузка объектов](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html) в документации Amazon S3. 
    
    При загрузке этих файлов вам необходимо создать следующую структуру папок и загрузить соответствующий файл в каждую папку:

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

## Подключение Starburst Galaxy к корзине Amazon S3 {#connect-to-s3-bucket}
Если ваша инстанция Starburst Galaxy еще не подключена к вашей корзине S3, вам необходимо создать кластер, настроить каталог, который позволит Starburst Galaxy подключиться к корзине S3, добавить каталог в ваш новый кластер и настроить параметры привилегий.

Помимо Amazon S3, Starburst Galaxy поддерживает множество других источников данных. Чтобы узнать больше о них, вы можете обратиться к [Обзору каталогов](https://docs.starburst.io/starburst-galaxy/catalogs/index.html) в документации Starburst Galaxy.  

1. Создайте кластер. Нажмите **Clusters** в левой боковой панели интерфейса Starburst Galaxy, затем нажмите **Create cluster** в основной части страницы. 
2. В модальном окне **Создать новый кластер** вам нужно установить только следующие параметры. Вы можете использовать значения по умолчанию для остальных параметров.
    - **Имя кластера** &mdash; Введите имя для вашего кластера.
    - **Регион облачного провайдера** &mdash; Выберите регион AWS.

    Когда закончите, нажмите **Create cluster**.

3. Создайте каталог. Нажмите **Catalogs** в левой боковой панели интерфейса Starburst Galaxy, затем нажмите **Create catalog** в основной части страницы. 
4. На странице **Создать источник данных** выберите плитку Amazon S3. 
5. В разделе **Имя и описание** на странице **Amazon S3** заполните поля. 
6. В разделе **Аутентификация к S3** на странице **Amazon S3** выберите [механизм аутентификации AWS (S3)](#prerequisites), который вы выбрали для подключения.
7. В разделе **Настройка метастора** установите следующие параметры:
    - **Имя основной корзины S3** &mdash; Введите имя вашей корзины S3, к которой вы хотите получить доступ.
    - **Имя основной директории** &mdash; Введите имя папки, в которой находятся данные Jaffle Shop в корзине S3. Это то же имя папки, которое вы использовали в [Загрузке данных в корзину Amazon S3](#load-data-to-s3).
    - **Разрешить создание внешних таблиц** &mdash; Включите эту опцию.
    - **Разрешить запись во внешние таблицы** &mdash; Включите эту опцию.

    Страница **Amazon S3** должна выглядеть примерно так, за исключением раздела **Аутентификация к S3**, который зависит от вашей настройки:

    <Lightbox src="/img/quickstarts/dbt-cloud/starburst-galaxy-config-s3.png" title="Настройки подключения Amazon S3 в Starburst Galaxy" />

8. Нажмите **Проверить подключение**. Это проверяет, может ли Starburst Galaxy получить доступ к вашей корзине S3. 
9. Нажмите **Подключить каталог**, если тест подключения прошел успешно.
    <Lightbox src="/img/quickstarts/dbt-cloud/test-connection-success.png" title="Успешный тест подключения" />

10. На странице **Установить разрешения** нажмите **Пропустить**. Вы можете добавить разрешения позже, если хотите.
11. На странице **Добавить в кластер** выберите кластер, к которому вы хотите добавить каталог, из выпадающего списка и нажмите **Добавить в кластер**.
12. Добавьте привилегию на местоположение для вашей корзины S3 к вашей роли в Starburst Galaxy. Нажмите **Управление доступом > Роли и привилегии** в левой боковой панели интерфейса Starburst Galaxy. Затем в таблице **Роли** нажмите на имя роли **accountadmin**. 

    Если вы используете существующий кластер Starburst Galaxy и не имеете доступа к роли accountadmin, выберите роль, к которой у вас есть доступ.

    Чтобы узнать больше о контроле доступа, обратитесь к разделу [Контроль доступа](https://docs.starburst.io/starburst-galaxy/security/access-control.html) в документации Starburst Galaxy. 
13. На странице **Роли** нажмите на вкладку **Привилегии** и нажмите **Добавить привилегию**.
14. На странице **Добавить привилегию** установите следующие параметры:
    - **Для чего вы хотите изменить привилегии?** &mdash; Выберите **Местоположение**.
    - **Введите предоставленное местоположение хранения** &mdash; Введите местоположение хранения _вашей корзины S3_ и папку, в которой находятся данные Jaffle Shop. Убедитесь, что в конце местоположения есть `/*`. 
    - **Создать SQL** &mdash; Включите эту опцию. 
    
    Когда закончите, нажмите **Добавить привилегии**.

    <Lightbox src="/img/quickstarts/dbt-cloud/add-privilege.png" title="Добавить привилегию к роли accountadmin" />

## Создание таблиц с помощью Starburst Galaxy
Чтобы выполнить запрос к данным Jaffle Shop с помощью Starburst Galaxy, вам необходимо создать таблицы, используя данные Jaffle Shop, которые вы [загрузили в вашу корзину S3](#load-data-to-s3). Вы можете сделать это (и выполнить любой SQL оператор) из [редактора запросов](https://docs.starburst.io/starburst-galaxy/query/query-editor.html). 

1. Нажмите **Query > Query editor** в левой боковой панели интерфейса Starburst Galaxy. Основная часть страницы теперь является редактором запросов. 
2. Настройте редактор запросов так, чтобы он выполнял запросы к вашей корзине S3. В правом верхнем углу редактора запросов выберите ваш кластер в первом сером поле и выберите ваш каталог во втором сером поле:

    <Lightbox src="/img/quickstarts/dbt-cloud/starburst-galaxy-editor.png" title="Установите кластер и каталог в редакторе запросов" />

3. Скопируйте и вставьте эти запросы в редактор запросов. Затем **Выполните** каждый запрос по отдельности. 

    Замените `YOUR_S3_BUCKET_NAME` на имя вашей корзины S3. Эти запросы создают схему с именем `jaffle_shop` и также создают таблицы `jaffle_shop_customers`, `jaffle_shop_orders` и `stripe_payments`: 

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
2. Если вы еще не сделали этого, установите роль вашей учетной записи на accountadmin. Нажмите на свой адрес электронной почты в правом верхнем углу, выберите **Сменить роль** и выберите **accountadmin**. 
    
    Если эта роль не отображается для вас, выберите роль, которую вы выбрали в [Подключении Starburst Galaxy к корзине Amazon S3](#connect-to-s3-bucket), когда добавляли привилегию на местоположение для вашей корзины S3.
3. Нажмите **Clusters** в левой боковой панели.
4. Найдите свой кластер в таблице **Просмотр кластеров** и нажмите **Информация о подключении**. Выберите **dbt** из выпадающего списка **Выбрать клиент**. Оставьте модальное окно **Информация о подключении** открытым. Вам понадобятся детали из этого окна в dbt Cloud.
5. В другой вкладке браузера войдите в [dbt Cloud](/docs/cloud/about-cloud/access-regions-ip-addresses).
6. Создайте новый проект в dbt Cloud. Нажмите на имя вашей учетной записи в левом меню, выберите **Настройки учетной записи** и нажмите **+ Новый проект**.
7. Введите имя проекта и нажмите **Продолжить**.
8. Выберите **Starburst** в качестве вашего подключения и нажмите **Далее**.
9. Введите **Настройки** для вашего нового проекта:
    - **Хост** – Значение **Host** из модального окна **Информация о подключении** на вкладке Starburst Galaxy.
    - **Порт** – 443 (что является значением по умолчанию)
10. Введите **Разработческие учетные данные** для вашего нового проекта:
    - **Пользователь** – Значение **User** из модального окна **Информация о подключении** на вкладке Starburst Galaxy. Убедитесь, что вы используете всю строку, включая роль учетной записи, которая идет после `/` и всех символов, которые следуют. Если вы не включите это, будет использоваться ваша роль по умолчанию, и у нее могут не быть правильных разрешений для разработки проекта.
    - **Пароль** – Пароль, который вы используете для входа в свою учетную запись Starburst Galaxy.
    - **База данных** – Каталог Starburst, в который вы хотите сохранить свои данные (например, при записи новых таблиц). Для будущего справки база данных является синонимом каталога между dbt Cloud и Starburst Galaxy. 
    - Оставьте остальные параметры без изменений. Вы можете использовать их значения по умолчанию.
11. Нажмите **Проверить подключение**. Это проверяет, может ли dbt Cloud получить доступ к вашему кластеру Starburst Galaxy.
12. Нажмите **Далее**, если тест прошел успешно. Если он не удался, вам, возможно, нужно будет проверить настройки и учетные данные Starburst Galaxy.

## Настройка управляемого репозитория dbt Cloud 
<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки
Теперь, когда у вас настроен репозиторий, вы можете инициализировать свой проект и начать разработку в dbt Cloud:

1. Нажмите **Начать разработку в IDE**. Это может занять несколько минут, чтобы ваш проект запустился в первый раз, так как он устанавливает ваше соединение с git, клонирует ваш репозиторий и проверяет соединение с хранилищем.
2. Над деревом файлов слева нажмите **Инициализировать проект dbt**. Это создаст вашу структуру папок с примерами моделей.
3. Сделайте свой первоначальный коммит, нажав **Коммит и синхронизация**. Используйте сообщение коммита `initial commit` и нажмите **Коммит**. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, в которой вы можете добавить новый код dbt.
4. Теперь вы можете напрямую выполнять запросы к данным из вашего хранилища и выполнять `dbt run`. Вы можете попробовать это сейчас:
    - Нажмите **+ Создать новый файл**, добавьте этот запрос в новый файл и нажмите **Сохранить как**, чтобы сохранить новый файл:  
        ```sql
            select * from dbt_quickstart.jaffle_shop.jaffle_shop_customers
        ```
    - В строке команд внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели

У вас есть два варианта работы с файлами в dbt Cloud IDE:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку, чтобы редактировать и коммитить ваши изменения. Перейдите в **Управление версиями** в левой боковой панели и нажмите **Создать ветку**.
- Редактировать в защищенной основной ветке &mdash; Если вы предпочитаете редактировать, форматировать или проверять файлы и выполнять команды dbt непосредственно в вашей основной ветке git. dbt Cloud IDE предотвращает коммиты в защищенной ветке, поэтому вам будет предложено коммитить ваши изменения в новую ветку.

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

4. Введите `dbt run` в командной строке внизу экрана. Вы должны получить успешный запуск и увидеть три модели.

Позже вы можете подключить свои инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не сырые данные в вашем BI инструменте.

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
<FAQ path="Project/structure-a-project" alt_header="Как мне организовать свой проект, когда я создаю больше моделей? Как мне называть свои модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />


## Подключение к нескольким источникам данных
Этот быстрый старт сосредоточен на использовании dbt Cloud для выполнения моделей против озера данных (S3) с использованием Starburst Galaxy в качестве движка запросов. В большинстве реальных сценариев данные, необходимые для выполнения моделей, на самом деле распределены по нескольким источникам данных и хранятся в различных форматах. С помощью Starburst Galaxy, Starburst Enterprise и Trino вы можете выполнять свои модели на любых данных, которые вам нужны, независимо от того, где они хранятся.

Если вы хотите попробовать это, вы можете обратиться к [документации Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/catalogs/), чтобы добавить больше источников данных и загрузить данные Jaffle Shop в выбранный вами источник. Затем расширьте свои модели, чтобы выполнять запросы к новому источнику данных и источнику данных, который вы создали в этом быстром старте.