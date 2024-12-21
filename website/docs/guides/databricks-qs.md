---
title: "Быстрый старт для dbt Cloud и Databricks"
id: "databricks"
level: 'Beginner'
icon: 'databricks'
hide_table_of_contents: true
recently_updated: true
tags: ['dbt Cloud', 'Quickstart','Databricks']
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как использовать dbt Cloud с Databricks. Оно покажет вам, как:

- Создать рабочее пространство Databricks.
- Загрузить пример данных в ваш аккаунт Databricks.
- Подключить dbt Cloud к Databricks.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.

:::tip Видео для вас
Вы можете бесплатно ознакомиться с [Основами dbt](https://learn.getdbt.com/courses/dbt-fundamentals), если вас интересует обучение с видео.
:::

### Предварительные требования

- У вас есть [аккаунт dbt Cloud](https://www.getdbt.com/signup/).
- У вас есть аккаунт у облачного провайдера (например, AWS, GCP или Azure) и есть разрешения на создание S3-бакета с этим аккаунтом. В демонстрационных целях в этом руководстве используется AWS в качестве облачного провайдера.

### Связанные материалы

- Узнайте больше с [курсами dbt Learn](https://learn.getdbt.com)
- [CI задания](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Актуальность источников](/docs/deploy/source-freshness)

## Создание рабочего пространства Databricks

1. Используйте ваш существующий аккаунт или [зарегистрируйтесь для получения аккаунта Databricks](https://databricks.com/). Заполните форму с вашей пользовательской информацией и нажмите **Continue**.

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/signup_form.png" title="Регистрация в Databricks" />
    </div>

2. На следующем экране выберите вашего облачного провайдера. В этом руководстве используется AWS в качестве облачного провайдера, но если вы используете Azure или GCP, выберите вашу платформу. Процесс настройки будет аналогичным. Не выбирайте опцию **Get started with Community Edition**, так как она не предоставит необходимую вычислительную мощность для этого руководства.

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/choose_provider.png" title="Выбор облачного провайдера" />
    </div>

3. Проверьте вашу электронную почту и завершите процесс верификации.

4. После завершения процесса верификации вы попадете на первый экран настройки. Databricks по умолчанию выбирает план `Premium`, и вы можете изменить пробный период на `Enterprise` на этой странице.

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/choose_plan.png" title="Выбор плана Databricks" />
    </div>

5. Теперь пришло время создать ваше первое рабочее пространство. Рабочее пространство Databricks — это среда для доступа ко всем вашим ресурсам Databricks. Рабочее пространство организует такие объекты, как блокноты, SQL-склады, кластеры и многое другое, в одном месте. Укажите имя вашего рабочего пространства, выберите соответствующий регион AWS и нажмите **Start Quickstart**. Возможно, вы увидите флажок **I have data in S3 that I want to query with Databricks**. Вам не нужно отмечать его для этого руководства.

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/start_quickstart.png" title="Создание ресурсов AWS" />
    </div>

6. Нажав на `Start Quickstart`, вы будете перенаправлены на AWS и вам будет предложено войти в систему, если вы еще этого не сделали. После входа в систему вы должны увидеть страницу, похожую на эту.

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/quick_create_stack.png" title="Создание ресурсов AWS" />
    </div>

:::tip
Если вы получаете ошибку сессии и не перенаправляетесь на эту страницу, вы можете вернуться в интерфейс Databricks и создать рабочее пространство из интерфейса. Все, что вам нужно сделать, это нажать **create workspaces**, выбрать quickstart, заполнить форму и нажать **Start Quickstart**.
:::

7. Нет необходимости изменять какие-либо из предварительно заполненных полей в Параметрах. Просто добавьте ваш пароль Databricks в разделе **Databricks Account Credentials**. Отметьте Подтверждение и нажмите **Create stack**.

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/parameters.png" title="Параметры" />
    </div>    

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/create_stack.png" title="Возможности" />
    </div>    

8. Вернитесь на вкладку Databricks. Вы должны увидеть, что ваше рабочее пространство готово к использованию.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/workspaces.png" title="Рабочее пространство Databricks" />
    </div>
9. Теперь давайте перейдем в рабочее пространство. Нажмите **Open** и войдите в рабочее пространство, используя те же данные для входа, что и для входа в аккаунт.

## Загрузка данных

1. Скачайте эти CSV-файлы (пример данных Jaffle Shop), которые вам понадобятся для этого руководства:
    - [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
    - [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
    - [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

2. Сначала нам нужен SQL-склад. Найдите выпадающее меню и переключитесь в пространство SQL.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/go_to_sql.png" title="Пространство SQL" />
    </div>
3. Сейчас мы будем настраивать SQL-склад. Выберите **SQL Warehouses** в консоли слева. Вы увидите, что существует склад SQL по умолчанию.

4. Нажмите **Start** на Starter Warehouse. Это займет несколько минут, чтобы запустить необходимые ресурсы.

5. Как только SQL-склад будет запущен, нажмите **New**, а затем **File upload** в выпадающем меню.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/new_file_upload_using_databricks_SQL.png" title="Новая загрузка файла с использованием Databricks SQL" />
    </div>

6. Давайте сначала загрузим данные Jaffle Shop Customers. Перетащите файл `jaffle_shop_customers.csv` в интерфейс.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/databricks_table_loader.png" title="Загрузчик таблиц Databricks" />
    </div>

7. Обновите атрибуты таблицы вверху:

    - <b>data_catalog</b> = hive_metastore
    - <b>database</b> = default 
    - <b>table</b> = jaffle_shop_customers
    - Убедитесь, что типы данных столбцов корректны. Вы можете сделать это, наведя курсор на значок типа данных рядом с именем столбца.
        - <b>ID</b> = bigint
        - <b>FIRST_NAME</b> = string
        - <b>LAST_NAME</b> = string

    <div style={{maxWidth: '600px'}}>
    <Lightbox src="/img/databricks_tutorial/images/jaffle_shop_customers_upload.png" title="Загрузка клиентов jaffle shop" />
    </div>

8. Нажмите **Create** внизу, когда закончите.

9. Теперь давайте сделаем то же самое для `Jaffle Shop Orders` и `Stripe Payments`.

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/jaffle_shop_orders_upload.png" title="Загрузка заказов jaffle shop" />
    </div>

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/stripe_payments_upload.png" title="Загрузка платежей stripe" />
    </div>
    
10. После этого убедитесь, что вы можете выполнять запросы к учебным данным. Перейдите в `SQL Editor` через меню слева. Это приведет вас к редактору запросов.
11. Убедитесь, что вы можете выполнить `select *` из каждой из таблиц с помощью следующих фрагментов кода.

    ```sql
    select * from default.jaffle_shop_customers
    select * from default.jaffle_shop_orders
    select * from default.stripe_payments
    ```

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/query_check.png" title="Проверка запроса" />
    </div>

12. Чтобы гарантировать, что любые пользователи, которые могут работать над вашим проектом dbt, имеют доступ к вашему объекту, выполните эту команду.

    ```sql 
    grant all privileges on schema default to users;
    ```

## Подключение dbt Cloud к Databricks

Существует два способа подключения dbt Cloud к Databricks. Первый вариант — Partner Connect, который предоставляет упрощенную настройку для создания вашего аккаунта dbt Cloud из вашего нового пробного аккаунта Databricks. Второй вариант — создать ваш аккаунт dbt Cloud отдельно и самостоятельно настроить подключение к Databricks (подключение вручную). Если вы хотите быстро начать, dbt Labs рекомендует использовать Partner Connect. Если вы хотите настроить вашу установку с самого начала и ознакомиться с процессом настройки dbt Cloud, dbt Labs рекомендует подключение вручную.

## Настройка интеграции через Partner Connect

:::note
 Partner Connect предназначен для пробных партнерских аккаунтов. Если у вашей организации уже есть аккаунт dbt Cloud, подключитесь вручную. Обратитесь к [Подключение к dbt Cloud вручную](https://docs.databricks.com/partners/prep/dbt-cloud.html#connect-to-dbt-cloud-manually) в документации Databricks для получения инструкций.
:::

Чтобы подключить dbt Cloud к Databricks с использованием Partner Connect, выполните следующие действия:

1. В боковой панели вашего аккаунта Databricks нажмите **Partner Connect**.

2. Нажмите на **плитку dbt**.

3. Выберите каталог из выпадающего списка, а затем нажмите **Next**. Выпадающий список отображает каталоги, к которым у вас есть доступ на чтение и запись. Если ваше рабочее пространство не `<UC>-enabled`, используется устаревший Hive metastore (`hive_metastore`).

5. Если в вашем рабочем пространстве есть SQL-склады, выберите SQL-склад из выпадающего списка. Если ваш SQL-склад остановлен, нажмите **Start**.

6. Если в вашем рабочем пространстве нет SQL-складов:

   1. Нажмите **Create warehouse**. В вашем браузере откроется новая вкладка, на которой отображается страница **New SQL Warehouse** в интерфейсе Databricks SQL.
   2. Следуйте шагам в [Создание SQL-склада](https://docs.databricks.com/en/sql/admin/create-sql-warehouse.html#create-a-sql-warehouse) в документации Databricks.
   3. Вернитесь на вкладку Partner Connect в вашем браузере и закройте **плитку dbt**.
   4. Снова откройте **плитку dbt**.
   5. Выберите SQL-склад, который вы только что создали, из выпадающего списка.

7. Выберите схему из выпадающего списка, а затем нажмите **Add**. Выпадающий список отображает схемы, к которым у вас есть доступ на чтение и запись. Вы можете повторить этот шаг, чтобы добавить несколько схем.

   Partner Connect создает следующие ресурсы в вашем рабочем пространстве:

   - Сервисный принципал Databricks с именем **DBT_CLOUD_USER**.
   - Личный токен доступа Databricks, связанный с сервисным принципалом **DBT_CLOUD_USER**.
  
   Partner Connect также предоставляет следующие привилегии сервисному принципалу **DBT_CLOUD_USER**:

   - (Unity Catalog) **USE CATALOG**: Необходим для взаимодействия с объектами в выбранном каталоге.
   - (Unity Catalog) **USE SCHEMA**: Необходим для взаимодействия с объектами в выбранной схеме.
   - (Unity Catalog) **CREATE SCHEMA**: Предоставляет возможность создавать схемы в выбранном каталоге.
   - (Hive metastore) **USAGE**: Необходим для предоставления привилегий **SELECT** и **READ_METADATA** для выбранных вами схем.
   - **SELECT**: Предоставляет возможность читать выбранные вами схемы.
   - (Hive metastore) **READ_METADATA**: Предоставляет возможность читать метаданные для выбранных вами схем.
   - **CAN_USE**: Предоставляет разрешения на использование выбранного вами SQL-склада.

8. Нажмите **Next**.

   В поле **Email** отображается адрес электронной почты вашего аккаунта Databricks. dbt Labs использует этот адрес электронной почты, чтобы предложить вам создать пробный аккаунт dbt Cloud.

9. Нажмите **Connect to dbt Cloud**.

   В вашем веб-браузере откроется новая вкладка, на которой отображается веб-сайт getdbt.com.

10. Выполните инструкции на экране на веб-сайте getdbt.com, чтобы создать ваш пробный аккаунт dbt Cloud.

## Настройка управляемого репозитория dbt Cloud

<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки

Теперь, когда у вас настроен репозиторий, вы можете инициализировать ваш проект и начать разработку в dbt Cloud:

1. Нажмите **Start developing in the IDE**. Это может занять несколько минут, чтобы ваш проект запустился в первый раз, так как устанавливается ваше git-подключение, клонируется ваш репозиторий и тестируется подключение к складу.
2. Над деревом файлов слева нажмите **Initialize dbt project**. Это создаст структуру папок с примерами моделей.
3. Сделайте ваш первый коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit` и нажмите **Commit**. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, в которой вы можете добавлять новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из вашего склада и выполнять `dbt run`. Вы можете попробовать это сейчас:
    - Нажмите **+ Create new file**, добавьте этот запрос в новый файл и нажмите **Save as**, чтобы сохранить новый файл:
        ```sql
        select * from default.jaffle_shop_customers
        ```
    - В командной строке внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели

У вас есть два варианта работы с файлами в IDE dbt Cloud:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку, чтобы редактировать и фиксировать ваши изменения. Перейдите в **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать в защищенной основной ветке &mdash; Если вы предпочитаете редактировать, форматировать или проверять файлы и выполнять команды dbt непосредственно в вашей основной ветке git. IDE dbt Cloud предотвращает коммиты в защищенную ветку, поэтому вам будет предложено зафиксировать ваши изменения в новой ветке.

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

    from jaffle_shop_customers

),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from jaffle_shop_orders

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

## Создание моделей на основе других моделей

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте новый SQL-файл, `models/stg_customers.sql`, с SQL из CTE `customers` в нашем исходном запросе.
2. Создайте второй новый SQL-файл, `models/stg_orders.sql`, с SQL из CTE `orders` в нашем исходном запросе.

    <File name='models/stg_customers.sql'>

    ```sql
    select
        id as customer_id,
        first_name,
        last_name

    from jaffle_shop_customers
    ```

    </File>

    <File name='models/stg_orders.sql'>

    ```sql
    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from jaffle_shop_orders
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