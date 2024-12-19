---
title: "Быстрый старт для dbt Cloud и Amazon Athena"
id: "athena"
level: 'Начинающий'
icon: 'athena'
hide_table_of_contents: true
tags: ['Amazon','Athena', 'dbt Cloud','Quickstart']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве быстрого старта вы узнаете, как использовать dbt Cloud с Amazon Athena. Оно покажет вам, как: 

- Создать S3-ведро для результатов запросов Athena.
- Создать базу данных Athena.
- Получить доступ к образцам данных в публичном наборе данных.
- Подключить dbt Cloud к Amazon Athena.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.

:::tip Видео для вас
Если вам интересно обучение с видео, вы можете бесплатно ознакомиться с курсом [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).
:::

### Предварительные требования

- У вас есть [учетная запись dbt Cloud](https://www.getdbt.com/signup/). 
- У вас есть [учетная запись AWS](https://aws.amazon.com/).
- Вы настроили [Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/getting-started.html).

### Связанный контент

- Узнайте больше с помощью курсов [dbt Learn](https://learn.getdbt.com)
- [CI задания](/docs/deploy/continuous-integration)
- [Задания на развертывание](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источников](/docs/deploy/source-freshness)

## Начало работы

Для следующего руководства вы можете использовать существующее S3-ведро или [создать новое](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html).

Скачайте следующие CSV-файлы (образцы данных Jaffle Shop) и загрузите их в ваше S3-ведро:
- [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
- [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
- [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

## Настройка Amazon Athena

1. Войдите в свою учетную запись AWS и перейдите в **консоль Athena**.
    - Если вы впервые находитесь в консоли Athena (в вашем текущем регионе AWS), нажмите **Изучить редактор запросов**, чтобы открыть редактор запросов. В противном случае Athena автоматически откроется в редакторе запросов.
2. Откройте **Настройки** и найдите поле **Местоположение результатов запросов**.
    1. Введите путь к S3-ведру (предварительно добавив `s3://`).
    2. Перейдите в **Обзор S3**, выберите созданное вами S3-ведро и нажмите **Выбрать**.
3. **Сохраните** эти настройки.
4. В **редакторе запросов** создайте базу данных, выполнив `create database YOUR_DATABASE_NAME`.
5. Чтобы сделать созданную вами базу данных той, в которую вы будете `записывать`, выберите ее из списка **База данных** в левом меню. 
6. Получите доступ к данным Jaffle Shop в S3-ведре, используя один из следующих вариантов:
    1. Создайте таблицы вручную.
    2. Создайте crawler Glue, чтобы воссоздать данные в виде внешних таблиц (рекомендуется).
7. После создания таблиц вы сможете выполнять `SELECT` из них. 

## Настройка доступа к Athena

Чтобы настроить доступ к Athena, определите, какой метод доступа вы хотите использовать: 
* Получите `aws_access_key_id` и `aws_secret_access_key` (рекомендуется)
* Получите файл **учетных данных AWS**.

### Ключ доступа AWS (рекомендуется)

Чтобы получить ваш `aws_access_key_id` и `aws_secret_access_key`:

1. Откройте **Консоль AWS**.
2. Нажмите на ваше **имя пользователя** в правом верхнем углу и выберите **Учетные данные безопасности**.
3. Нажмите на **Пользователи** в боковом меню.
4. Нажмите на ваше **имя пользователя** (или имя пользователя, для которого нужно создать ключ).
5. Перейдите на вкладку **Учетные данные безопасности**.
6. Нажмите **Создать ключ доступа**.
7. Нажмите **Показать учетные данные безопасности пользователя** и 

Сохраните `aws_access_key_id` и `aws_secret_access_key` для последующего шага.

### Файл учетных данных AWS

Чтобы получить файл учетных данных AWS:
1. Следуйте инструкциям по [настройке файла учетных данных](https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-files.html) с помощью AWS CLI.
2. Найдите файл `~/.aws/credentials` на вашем компьютере:
    1. Windows: `%USERPROFILE%\.aws\credentials`
    2. Mac/Linux: `~/.aws/credentials`

Извлеките `aws_access_key_id` и `aws_secret_access_key` из файла `~/.aws/credentials` для последующего шага.

## Настройка подключения в dbt Cloud

Чтобы настроить подключение Athena в dbt Cloud:
1. Нажмите на **имя вашей учетной записи** в левом меню и выберите **Настройки учетной записи**.
2. Нажмите **Подключения** и выберите **Новое подключение**.
3. Выберите **Athena** и заполните обязательные поля (и любые дополнительные поля).
    1. **Имя региона AWS** — Регион AWS вашей среды.
    2. **База данных (каталог)** — Введите имя базы данных, созданной на предыдущих шагах (только строчные буквы).
    3. **Директория временного хранилища AWS S3** — Введите S3-ведро, созданное на предыдущих шагах.
4. Нажмите **Сохранить**.

### Настройка вашей среды

Чтобы настроить учетные данные Athena в вашей среде:
1. Нажмите **Развертывание** в левом меню и выберите **Среды**.
2. Нажмите **Создать среду** и заполните **Общие настройки**. 
    - Ваша **версия dbt** должна быть установлена на `Без версии`, чтобы использовать подключение Athena. 
3. Выберите подключение Athena из выпадающего списка **Подключение**. 
4. Заполните `aws_access_key` и `aws_access_id`, записанные на предыдущих шагах, а также `Schema`, в который нужно записывать. 
5. Нажмите **Проверить подключение**, и после успешной проверки нажмите **Сохранить**.

Повторите процесс, чтобы создать [разработческую среду](https://docs.getdbt.com/docs/dbt-cloud-environments#types-of-environments). 

## Настройка управляемого репозитория dbt Cloud 
<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки

Теперь, когда у вас настроен репозиторий, вы можете инициализировать свой проект и начать разработку в dbt Cloud:

1. Нажмите **Начать разработку в IDE**. Это может занять несколько минут, чтобы ваш проект запустился в первый раз, так как устанавливается соединение с git, клонируется ваш репозиторий и проверяется соединение с хранилищем.
2. Над деревом файлов слева нажмите **Инициализировать проект dbt**. Это создаст структуру папок с примерами моделей.
3. Сделайте свой первый коммит, нажав **Коммит и синхронизация**. Используйте сообщение коммита `initial commit` и нажмите **Коммит**. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, в которую вы можете добавить новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из вашего хранилища и выполнять `dbt run`. Вы можете попробовать это сейчас:
    - Нажмите **+ Создать новый файл**, добавьте этот запрос в новый файл и нажмите **Сохранить как**, чтобы сохранить новый файл: 
        ```sql
        select * from jaffle_shop.customers
        ```
    - В строке команд внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели

У вас есть два варианта работы с файлами в dbt Cloud IDE:

- Создать новую ветку (рекомендуется) — Создайте новую ветку, чтобы редактировать и коммитить ваши изменения. Перейдите в **Управление версиями** на левой боковой панели и нажмите **Создать ветку**.
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

4. Введите `dbt run` в командной строке внизу экрана. Вы должны получить успешный результат и увидеть три модели.

Позже вы можете подключить свои инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не сырые данные в вашем инструменте BI.

#### Часто задаваемые вопросы

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

## Измените способ материализации вашей модели

<Snippet path="quickstarts/change-way-model-materialized" />

## Удалите примерные модели

<Snippet path="quickstarts/delete-example-models" />

## Создание моделей на основе других моделей

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте новый SQL-файл, `models/stg_customers.sql`, с SQL из CTE `customers` в нашем оригинальном запросе.
2. Создайте второй новый SQL-файл, `models/stg_orders.sql`, с SQL из CTE `orders` в нашем оригинальном запросе.

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
<FAQ path="Project/structure-a-project" alt_header="Как мне организовать свой проект по мере создания большего количества моделей? Как мне называть свои модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />