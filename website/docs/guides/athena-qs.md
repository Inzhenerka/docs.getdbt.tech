---
title: "Быстрый старт с dbt и Amazon Athena"
id: "athena"
level: 'Beginner'
icon: 'athena'
hide_table_of_contents: true
tags: ['Amazon','Athena', 'dbt platform','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом руководстве по быстрому старту вы узнаете, как использовать <Constant name="dbt" /> с Amazon Athena. В нём показано, как: 

- Создать бакет S3 для результатов запросов Athena.
- Создать базу данных Athena.
- Получить доступ к демонстрационным данным из общедоступного набора данных.
- Подключить <Constant name="dbt" /> к Amazon Athena.
- Взять пример запроса и преобразовать его в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавить тесты для ваших моделей.
- Документировать ваши модели.
- Настроить запуск задания по расписанию.

:::tip Видео для вас
Вы можете бесплатно ознакомиться с [Основами dbt](https://learn.getdbt.com/courses/dbt-fundamentals), если вас интересует обучение с видео.
:::

### Предварительные требования {#prerequisites}

- У вас есть [учетная запись <Constant name="dbt" />](https://www.getdbt.com/signup/). 
- У вас есть [учетная запись AWS](https://aws.amazon.com/).
- Вы настроили [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/getting-started.html).

### Связанные материалы {#related-content}

- Узнайте больше с [курсами dbt Learn](https://learn.getdbt.com)
- [CI задания](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Актуальность источников](/docs/deploy/source-freshness)

## Начало работы {#getting-started}

Для следующего руководства вы можете использовать существующий S3 bucket или [создать новый](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html).

Скачайте следующие CSV файлы (образцы данных Jaffle Shop) и загрузите их в ваш S3 bucket:
- [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
- [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
- [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

## Настройка Amazon Athena {#configure-amazon-athena}

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

## Настройка доступа к Athena {#set-up-security-access-to-athena}

Чтобы настроить доступ к Athena, определите, какой метод доступа вы хотите использовать:
* Получите `aws_access_key_id` и `aws_secret_access_key` (рекомендуется)
* Получите файл **AWS credentials**.

### AWS access key (рекомендуется) {#aws-access-key-recommended}

Чтобы получить `aws_access_key_id` и `aws_secret_access_key`:

1. Откройте **AWS Console**.
1. Нажмите на свое **имя пользователя** в правом верхнем углу и выберите **Security Credentials**.
1. Нажмите на **Users** в боковой панели.
1. Нажмите на свое **имя пользователя** (или имя пользователя, для которого вы хотите создать ключ).
1. Нажмите на вкладку **Security Credentials**.
1. Нажмите **Create Access Key**.
1. Нажмите **Show User Security Credentials** и

Сохраните `aws_access_key_id` и `aws_secret_access_key` для следующего шага.

### Файл учётных данных AWS {#aws-credentials-file}

Чтобы получить файл учетных данных AWS:
1. Следуйте инструкциям по [настройке файла учетных данных](https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-files.html) с помощью AWS CLI
1. Найдите файл `~/.aws/credentials` на своем компьютере
    1. Windows: `%USERPROFILE%\.aws\credentials`
    2. Mac/Linux: `~/.aws/credentials`

Извлеките `aws_access_key_id` и `aws_secret_access_key` из файла `~/.aws/credentials` для следующего шага.

## Настройка подключения в dbt {#configure-the-connection-in-dbt}

Чтобы настроить подключение к Athena в <Constant name="dbt" />:
1. Нажмите **название своей учетной записи** в меню слева и выберите **Account settings**.
1. Нажмите **Connections**, затем **New connection**.
1. Выберите **Athena** и заполните обязательные поля (и при необходимости необязательные).
    1. **AWS region name** &mdash; Регион AWS вашей среды.
    1. **Database (catalog)** &mdash; Введите имя базы данных, созданной на предыдущих шагах (только в нижнем регистре).
    1. **AWS S3 staging directory** &mdash; Укажите бакет S3, созданный на предыдущих шагах.
1. Нажмите **Save**

### Настройка среды {#configure-your-environment}

Чтобы настроить учетные данные Athena в вашей среде:
1. Нажмите **Deploy** в меню слева, затем выберите **Environments**.
1. Нажмите **Create environment** и заполните раздел **General settings**. 
    - Для подключения к Athena ваша **dbt version** должна относиться к одному из [каналов выпуска](/docs/dbt-versions/dbt-release-tracks). 
1. Выберите подключение Athena в раскрывающемся списке **Connection**. 
1. Укажите `aws_access_key` и `aws_access_id`, сохраненные на предыдущих шагах, а также `Schema`, в которую будут записываться данные. 
1. Нажмите **Test connection** и после успешной проверки нажмите **Save**, чтобы сохранить среду.

Повторите этот процесс, чтобы создать [среду разработки](/docs/dbt-platform-environments#types-of-environments).

## Настройка репозитория под управлением dbt {#set-up-a-dbt-managed-repository}
<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки {#initialize-your-dbt-project-and-start-developing}

Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="dbt" />:

1. Нажмите **Start developing in the <Constant name="studio_ide" />**. Первый запуск проекта может занять несколько минут: за это время устанавливается соединение с Git, клонируется репозиторий и проверяется подключение к хранилищу данных.
2. Над деревом файлов слева нажмите **Initialize dbt project**. Это создаст структуру папок с примерами моделей.
3. Создайте первый коммит, нажав **Commit and sync**. Укажите сообщение коммита `initial commit` и нажмите **Commit**. Это создаст первый коммит в вашем управляемом репозитории и позволит создать ветку, в которой вы сможете добавлять новый код dbt.
4. Теперь вы можете выполнять запросы к данным непосредственно в хранилище и запускать `dbt run`. Попробуйте сделать это прямо сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить новый файл:
        ```sql
        select * from jaffle_shop.customers
        ```
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели {#build-your-first-model}

Если вы хотите использовать ИИ для создания своей первой модели, ознакомьтесь с разделом <a id="qs-jump-to-build-with-ai" href="#build-it-with-ai-using-dbt-wizard">создания модели с помощью dbt Wizard</a> ниже.

У вас есть два варианта работы с файлами в <Constant name="studio_ide" />:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку для редактирования файлов и фиксации изменений. Перейдите в раздел **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать файлы в защищённой основной ветке &mdash; Если вы предпочитаете редактировать, форматировать файлы или проверять их линтером, а также выполнять команды dbt непосредственно в основной ветке git. <Constant name="studio_ide" /> не позволяет создавать коммиты в защищённой ветке, поэтому вам будет предложено зафиксировать изменения в новой ветке.

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

Позже вы сможете подключить свои инструменты бизнес-аналитики (BI), такие как [dbt Charts](https://dbtcharts.com/), к этим представлениям и таблицам, чтобы они считывали только очищенные данные, а не необработанные.

#### Часто задаваемые вопросы {#faqs}

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

<Snippet path="quickstarts/build-first-model-with-wizard" />

## Измените способ материализации вашей модели

<Snippet path="quickstarts/change-way-model-materialized" />

## Удаление примерных моделей {#delete-the-example-models}

<Snippet path="quickstarts/delete-example-models" />

## Построение моделей на основе других моделей {#build-models-on-top-of-other-models}

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

<Snippet path="quickstarts/connect-your-ai" />
