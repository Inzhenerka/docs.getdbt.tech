---
title: "Быстрый старт для dbt и Starburst Galaxy"
id: "starburst-galaxy"
level: 'Beginner'
icon: 'starburst'
hide_table_of_contents: true
tags: ['dbt platform','Quickstart']
agent_guidance:
  pacing: In the first reply, confirm the reader’s prerequisites and connection path before listing steps. Then default to one guide section per reply (combine two or three short sections), with all its steps, labeled Step 1, Step 2, and so on, and confirm the success check before continuing. If the reader asks for a different pace, follow it.
  stay_on_path: This guide uses dbt platform. Don’t switch the reader to a local setup. If the reader wants to set up dbt locally, use the https://docs.getdbt.com/guides/dbt guide instead
  safety: Never ask for passwords or keys in chat.
  signup_link: When the reader needs a dbt account, share https://www.getdbt.com/signup?utm_source=ai_assistant&utm_medium=docs_md&utm_campaign=starburst-galaxy-qs
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом кратком руководстве вы узнаете, как использовать <Constant name="dbt" /> со [Starburst Galaxy](https://www.starburst.io/platform/starburst-galaxy/). В нём показано, как:

- Загрузить данные в бакет Amazon S3. В этом руководстве для демонстрации используется облачный провайдер AWS. Starburst Galaxy также [поддерживает другие источники данных](https://docs.starburst.io/starburst-galaxy/catalogs/index.html), в том числе Google Cloud, Microsoft Azure и другие.
- Подключить Starburst Galaxy к бакету Amazon S3.
- Создать таблицы с помощью Starburst Galaxy.
- Подключить <Constant name="dbt" /> к Starburst Galaxy.
- Преобразовать пример запроса в модель в вашем проекте dbt. Модель в dbt — это SQL-запрос select.
- Добавить тесты для ваших моделей.
- Документировать ваши модели.
- Настроить запуск задания по расписанию.
- Подключиться к нескольким источникам данных в дополнение к вашему бакету S3. 

<AgentPrompt />

### Предварительные требования {#prerequisites}

- У вас есть [мультитенантное](/docs/platform/about-platform/access-regions-ip-addresses) развертывание в [<Constant name="dbt" />](https://www.getdbt.com/signup/). Подробнее см. в разделе [Тенантность](/docs/platform/about-platform/tenancy).
- У вас есть [учетная запись Starburst Galaxy](https://www.starburst.io/platform/starburst-galaxy/). Если ее нет, вы можете начать бесплатный пробный период. Дополнительные сведения о настройке см. в [руководстве по началу работы](https://docs.starburst.io/starburst-galaxy/get-started.html) в документации Starburst Galaxy.
- У вас есть учетная запись AWS с разрешениями на загрузку данных в бакет S3.
- Для аутентификации в Amazon S3 вам потребуются либо ключ доступа AWS и секретный ключ AWS с доступом к бакету, либо межаккаунтная роль IAM с доступом к бакету. Подробнее см. в документации Starburst Galaxy: 
    - [Инструкции по использованию ключа доступа и секретного ключа AWS](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#aws-access-and-secret-key)
    - [Cross account IAM role](https://docs.starburst.io/starburst-galaxy/security/external-aws.html#role)

### Связанные материалы {#related-content}

- [Курсы dbt Learn](https://learn.getdbt.com)
- [Задание CI в <Constant name="dbt" />](/docs/deploy/continuous-integration)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Актуальность источников](/docs/deploy/source-freshness)
- [Обзор SQL для Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/sql/index.html)    

:::tip Видео для вас
Если вам интересно обучение по видеокурсам, вы можете бесплатно пройти курс [Основы dbt](https://learn.getdbt.com/courses/dbt-fundamentals).

Вы также можете посмотреть на YouTube видео [Создание более эффективных конвейеров данных с помощью dbt и Starburst](https://www.youtube.com/watch?v=tfWm4dWgwRg), подготовленное компанией Starburst Data, Inc.
:::

## Загрузка данных в бакет Amazon S3 {#load-data-to-s3}

С помощью Starburst Galaxy можно создавать таблицы и преобразовывать их в dbt. Сначала загрузите данные Jaffle Shop от dbt Labs в бакет S3.

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

    Страница **Amazon S3** должна выглядеть примерно так. Содержимое раздела **Authentication to S3** зависит от способа аутентификации.

    <Lightbox src="/img/quickstarts/dbt-platform/starburst-galaxy-config-s3.png" title="Настройки подключения к Amazon S3 в Starburst Galaxy" />

8. Нажмите **Test connection**. Это позволит проверить, есть ли у Starburst Galaxy доступ к вашему бакету S3. 
9. Нажмите **Connect catalog**, если проверка подключения прошла успешно.
    <Lightbox src="/img/quickstarts/dbt-platform/test-connection-success.png" title="Успешная проверка подключения" />

10. На странице **Set permissions** нажмите **Skip** — при необходимости вы сможете добавить права позже.
11. На странице **Add to cluster** выберите кластер из выпадающего списка и нажмите **Add to cluster**.
12. Добавьте привилегию location для вашего бакета S3 к роли в Starburst Galaxy. В левой боковой панели нажмите **Access control > Roles and privileges**, затем в таблице **Roles** выберите роль **accountadmin**.

    Если вы используете существующий кластер и не имеете доступа к роли accountadmin, выберите роль, к которой у вас есть доступ.

    Подробнее см. в разделе [Access control](https://docs.starburst.io/starburst-galaxy/security/access-control.html) документации Starburst Galaxy.

    <Lightbox src="/img/quickstarts/dbt-platform/add-privilege.png" title="Добавление привилегии роли accountadmin" />

13. На странице **Roles** откройте вкладку **Privileges** и нажмите **Add privilege**.
14. На странице **Add privilege** задайте:
    - **What would you like to modify privileges for?** — выберите **Location**.
    - **Enter a storage location provide** — укажите путь к _вашему бакету S3_ и папке с данными Jaffle Shop. Обязательно добавьте `/*` в конце.
    - **Create SQL** — включите.

    Нажмите **Add privileges**.

<Lightbox src="/img/quickstarts/dbt-platform/starburst-galaxy-editor.png" title="Настройте кластер и каталог в редакторе запросов" />

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

4. После выполнения запросов в левой панели редактора появится следующая иерархия:

    <Lightbox src="/img/quickstarts/dbt-platform/starburst-data-hierarchy.png" title="Иерархия данных в редакторе запросов" />

5. Проверьте, что таблицы были успешно созданы, выполнив запросы:

    ```sql
    select * from jaffle_shop.jaffle_shop_customers;
    select * from jaffle_shop.jaffle_shop_orders;
    select * from jaffle_shop.stripe_payments;
    ```

## Подключение dbt к Starburst Galaxy {#connect-dbt-to-starburst-galaxy}

1. Убедитесь, что вы по-прежнему вошли в [Starburst Galaxy](https://galaxy.starburst.io/login).
2. Если вы ещё этого не сделали, установите для своей учётной записи роль accountadmin. Нажмите на свой адрес электронной почты в правом верхнем углу, выберите **Switch role**, а затем — **accountadmin**. 
    
    Если этой роли нет в списке, выберите роль, которую вы указали в разделе [Подключение Starburst Galaxy к бакету Amazon S3](#connect-to-s3-bucket), когда добавляли привилегию доступа к расположению для своего бакета S3.
3. Нажмите **Clusters** на левой боковой панели.
4. Найдите свой кластер в таблице **View clusters** и нажмите **Connection info**. Выберите **dbt** в раскрывающемся списке **Select client**. Оставьте модальное окно **Connection information** открытым. Сведения из этого окна понадобятся вам в <Constant name="dbt" />.
5. В другой вкладке браузера войдите в [<Constant name="dbt" />](/docs/platform/about-platform/access-regions-ip-addresses).
6. Создайте новый проект в <Constant name="dbt" />. Нажмите на название своей учётной записи в меню слева, выберите **Account settings** и нажмите **+ New Project**.
7. Введите название проекта и нажмите **Continue**.
8. Выберите **Starburst** в качестве подключения и нажмите **Next**.
9. Укажите настройки (**Settings**) нового проекта:
    - **Host** — значение **Host** из модального окна **Connection information** на вкладке Starburst Galaxy.
    - **Port** — 443 (значение по умолчанию)
10. Укажите учётные данные пользователя (**User credentials**) для нового проекта:
    - **User** — значение **User** из модального окна **Connection information** на вкладке Starburst Galaxy. Обязательно используйте всю строку, включая роль учётной записи: символ `/` и все следующие за ним символы. Если не указать эту часть, будет использована ваша роль по умолчанию, у которой может не быть необходимых разрешений для разработки проекта.
    - **Password** — пароль, который вы используете для входа в свою учётную запись Starburst Galaxy.
    - **Database** — каталог Starburst, в котором вы хотите сохранять данные (например, при записи новых таблиц). Обратите внимание: база данных в <Constant name="dbt" /> соответствует каталогу в Starburst Galaxy. 
    - Оставьте остальные параметры без изменений. Можно использовать их значения по умолчанию.
11. Нажмите **Test Connection**. Эта проверка позволяет убедиться, что <Constant name="dbt" /> может получить доступ к вашему кластеру Starburst Galaxy.
12. Если проверка прошла успешно, нажмите **Next**. Если она завершилась ошибкой, возможно, потребуется проверить настройки и учётные данные Starburst Galaxy.

## Настройка репозитория под управлением dbt {#set-up-a-dbt-managed-repository}

<Snippet path="tutorial-managed-repo" />

## Инициализируйте проект dbt и начните разработку
Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="dbt" />:

1. Нажмите **Start developing in the <Constant name="studio_ide" />**. Первый запуск проекта может занять несколько минут: за это время устанавливается подключение к git, клонируется репозиторий и проверяется подключение к хранилищу данных.
2. Над деревом файлов слева нажмите **Initialize dbt project**. Это создаст структуру папок с примерами моделей.
3. Создайте первый коммит, нажав **Commit and sync**. Укажите сообщение коммита `initial commit` и нажмите **Commit**. Это создаст первый коммит в вашем управляемом репозитории и позволит открыть ветку, в которой вы сможете добавлять новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из хранилища и выполнять `dbt run`. Попробуйте сделать это прямо сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить новый файл:
        ```sql
            select * from dbt_quickstart.jaffle_shop.jaffle_shop_customers
        ```
    - В командной строке внизу выполните `dbt run`. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание первой модели {#build-your-first-model}

Если вы хотите использовать ИИ для создания своей первой модели, ознакомьтесь с инструкцией <a id="qs-jump-to-build-with-ai" href="#build-it-with-ai-using-dbt-wizard">по созданию модели с помощью dbt Wizard</a> в следующем разделе.

У вас есть два варианта работы с файлами в <Constant name="studio_ide" />:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку для редактирования и коммита изменений. Перейдите в раздел **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать в защищённой основной ветке &mdash; Если вы предпочитаете редактировать, форматировать файлы или проверять их линтером и выполнять команды dbt непосредственно в основной ветке Git. <Constant name="studio_ide" /> не позволяет создавать коммиты в защищённой ветке, поэтому вам будет предложено закоммитить изменения в новую ветку.

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

Позже вы сможете подключить свои инструменты бизнес-аналитики (BI) (например, [dbt Charts](https://dbtcharts.com/)) к этим представлениям и таблицам, чтобы они считывали только очищенные, а не необработанные данные.

#### Часто задаваемые вопросы {#faqs}

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

<Snippet path="quickstarts/build-first-model-with-wizard" />

## Измените способ материализации вашей модели

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

#### Часто задаваемые вопросы {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="По мере создания новых моделей, как лучше организовать проект? Как называть модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />

## Подключение к нескольким источникам данных {#connect-to-multiple-data-sources}

В этом кратком руководстве рассматривается использование <Constant name="dbt" /> для выполнения моделей с данными из озера данных (S3) с помощью Starburst Galaxy в качестве движка запросов. В большинстве реальных сценариев данные, необходимые для выполнения моделей, распределены между несколькими источниками и хранятся в различных форматах. С помощью Starburst Galaxy, Starburst Enterprise и Trino вы можете выполнять модели с любыми необходимыми данными независимо от того, где они хранятся.

Если вы хотите попробовать это на практике, обратитесь к [документации Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/catalogs/), чтобы добавить другие источники данных и загрузить данные Jaffle Shop в выбранный источник. Затем доработайте модели, чтобы они запрашивали данные как из нового источника, так и из источника, созданного в этом кратком руководстве.

<Snippet path="quickstarts/connect-your-ai" />
