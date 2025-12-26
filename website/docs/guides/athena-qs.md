---
title: "Быстрый старт с dbt и Amazon Athena"
id: "athena"
level: 'Beginner'
icon: 'athena'
hide_table_of_contents: true
tags: ['Amazon','Athena', 'dbt platform','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом кратком руководстве вы узнаете, как использовать <Constant name="cloud" /> с Amazon Athena. В нём показано, как:

- Создать S3‑бакет для результатов запросов Athena.
- Создать базу данных Athena.
- Получить доступ к примерным данным из публичного датасета.
- Подключить <Constant name="cloud" /> к Amazon Athena.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор `select`.
- Добавить тесты к вашим моделям.
- Задокументировать ваши модели.
- Запланировать выполнение задания.

:::tip Видео для вас
Вы можете бесплатно ознакомиться с [Основами dbt](https://learn.getdbt.com/courses/dbt-fundamentals), если вас интересует обучение с видео.
:::

### Предварительные требования

- У вас есть [<Constant name="cloud" /> аккаунт](https://www.getdbt.com/signup/).  
- У вас есть [аккаунт AWS](https://aws.amazon.com/).  
- У вас настроен [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/getting-started.html).

### Связанные материалы

- Узнайте больше с [курсами dbt Learn](https://learn.getdbt.com)
- [CI задания](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Актуальность источников](/docs/deploy/source-freshness)

## Начало работы

Для следующего руководства вы можете использовать существующий S3 bucket или [создать новый](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html).

Скачайте следующие CSV файлы (образцы данных Jaffle Shop) и загрузите их в ваш S3 bucket:
- [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
- [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
- [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

## Настройка Amazon Athena

1. Войдите в свой аккаунт AWS и перейдите в **консоль Athena**.
    - Если вы впервые в консоли Athena (в вашем текущем регионе AWS), нажмите **Explore the query editor**, чтобы открыть редактор запросов. В противном случае Athena автоматически откроется в редакторе запросов.
1. Откройте **Settings** и найдите поле **Location of query result box**.
    1. Введите путь к S3 bucket (добавьте префикс `s3://`).
    2. Перейдите в **Browse S3**, выберите созданный вами S3 bucket и нажмите **Choose**.
1. **Сохраните** эти настройки.
1. В **редакторе запросов** создайте базу данных, выполнив `create database YOUR_DATABASE_NAME`.
1. Чтобы сделать созданную вами базу данных той, в которую вы будете `записывать`, выберите ее из списка **Database** в левом меню.
1. Получите доступ к данным Jaffle Shop в S3 bucket, используя один из следующих вариантов:
    1. Создайте таблицы вручную.
    2. Создайте glue crawler для воссоздания данных как внешних таблиц (рекомендуется).
1. После создания таблиц вы сможете выполнять `SELECT` из них.

## Настройка доступа к Athena

Чтобы настроить доступ к Athena, определите, какой метод доступа вы хотите использовать:
* Получите `aws_access_key_id` и `aws_secret_access_key` (рекомендуется)
* Получите файл **AWS credentials**.

### AWS access key (рекомендуется)

Чтобы получить `aws_access_key_id` и `aws_secret_access_key`:

1. Откройте **AWS Console**.
1. Нажмите на свое **имя пользователя** в правом верхнем углу и выберите **Security Credentials**.
1. Нажмите на **Users** в боковой панели.
1. Нажмите на свое **имя пользователя** (или имя пользователя, для которого вы хотите создать ключ).
1. Нажмите на вкладку **Security Credentials**.
1. Нажмите **Create Access Key**.
1. Нажмите **Show User Security Credentials** и

Сохраните `aws_access_key_id` и `aws_secret_access_key` для следующего шага.

### Файл AWS credentials

Чтобы получить файл AWS credentials:
1. Следуйте инструкциям по [настройке файла credentials](https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-files.html) с использованием AWS CLI
1. Найдите файл `~/.aws/credentials` на вашем компьютере
    1. Windows: `%USERPROFILE%\.aws\credentials`
    2. Mac/Linux: `~/.aws/credentials`

Извлеките `aws_access_key_id` и `aws_secret_access_key` из файла `~/.aws/credentials` для следующего шага.

## Настройка подключения в dbt

Чтобы настроить подключение к Athena в <Constant name="cloud" />:

1. Нажмите на **имя вашей учетной записи** в левом боковом меню и выберите **Account settings**.
1. Перейдите в раздел **Connections** и нажмите **New connection**.
1. Выберите **Athena** и заполните обязательные поля (а также при необходимости необязательные):
    1. **AWS region name** &mdash; AWS‑регион, в котором развернута ваша среда.
    1. **Database (catalog)** &mdash; Укажите имя базы данных, созданной на предыдущих шагах (только в нижнем регистре).
    1. **AWS S3 staging directory** &mdash; Укажите S3‑бакет, созданный на предыдущих шагах.
1. Нажмите **Save**

### Настройка вашей среды

Чтобы настроить учетные данные Athena в вашей среде:
1. Нажмите **Deploy** в левом меню и выберите **Environments**.
1. Нажмите **Create environment** и заполните **General settings**.
    - Ваша **версия dbt** должна быть установлена на `Versionless`, чтобы использовать подключение Athena.
1. Выберите подключение Athena из выпадающего списка **Connection**.
1. Заполните `aws_access_key` и `aws_access_id`, записанные на предыдущих шагах, а также `Schema`, в который будет производиться запись.
1. Нажмите **Test connection** и после успешного теста **Save** среду.

Повторите этот процесс, чтобы создать [среду разработки](/docs/dbt-cloud-environments#types-of-environments).

## Настройка репозитория под управлением dbt
<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки

Теперь, когда у вас настроен репозиторий, вы можете инициализировать проект и начать разработку в <Constant name="cloud" />:

1. Нажмите **Start developing in the <Constant name="cloud_ide" />**. При первом запуске проекта это может занять несколько минут: в это время устанавливается подключение к git, клонируется репозиторий и проверяется соединение с хранилищем данных.
2. Над деревом файлов слева нажмите **Initialize dbt project**. Это создаст структуру папок и добавит примеры моделей.
3. Сделайте первый коммит, нажав **Commit and sync**. Введите сообщение коммита `initial commit` и нажмите **Commit**. Это создаст первый коммит в управляемом репозитории и позволит вам открыть ветку, в которой можно добавлять новый dbt-код.
4. Теперь вы можете напрямую выполнять запросы к вашему хранилищу данных и запускать `dbt run`. Вы можете попробовать это прямо сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить файл:
        ```sql
        select * from jaffle_shop.customers
        ```
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели

У вас есть два варианта работы с файлами в <Constant name="cloud_ide" />:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку для редактирования файлов и фиксации изменений. Перейдите в раздел **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать в защищённой основной ветке &mdash; Если вы предпочитаете редактировать, форматировать или линтить файлы, а также выполнять команды dbt непосредственно в вашей основной git-ветке. <Constant name="cloud_ide" /> не позволяет выполнять коммиты в защищённую ветку, поэтому вам будет предложено зафиксировать изменения в новой ветке.

Назовите новую ветку `add-customers-model`.

1. Нажмите на **...** рядом с директорией `models`, затем выберите **Create file**.
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