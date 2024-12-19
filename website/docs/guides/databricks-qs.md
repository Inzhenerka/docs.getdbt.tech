---
title: "Быстрый старт для dbt Cloud и Databricks"
id: "databricks"
level: 'Начинающий'
icon: 'databricks'
hide_table_of_contents: true
recently_updated: true
tags: ['dbt Cloud', 'Быстрый старт', 'Databricks']
---

<div style={{maxWidth: '900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как использовать dbt Cloud с Databricks. Оно покажет вам, как:

- Создать рабочее пространство Databricks.
- Загрузить образцы данных в вашу учетную запись Databricks.
- Подключить dbt Cloud к Databricks.
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.

:::tip Видео для вас
Если вам интересно обучение с видео, вы можете бесплатно ознакомиться с курсом [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).
:::

### Предварительные требования

- У вас есть [учетная запись dbt Cloud](https://www.getdbt.com/signup/).
- У вас есть учетная запись у поставщика облачных услуг (таких как AWS, GCP и Azure) и разрешения на создание S3-бакета с этой учетной записью. В этом руководстве для демонстрационных целей используется AWS в качестве поставщика облачных услуг.

### Связанный контент

- Узнайте больше с помощью курсов [dbt Learn](https://learn.getdbt.com)
- [CI задания](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источников](/docs/deploy/source-freshness)

## Создание рабочего пространства Databricks

1. Используйте свою существующую учетную запись или [зарегистрируйтесь для получения учетной записи Databricks](https://databricks.com/). Заполните форму с вашей информацией и нажмите **Продолжить**.
    
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/signup_form.png" title="Регистрация в Databricks" />
    </div>

2. На следующем экране выберите вашего облачного провайдера. В этом учебном пособии используется AWS в качестве облачного провайдера, но если вы используете Azure или GCP, пожалуйста, выберите вашу платформу. Процесс настройки будет аналогичным. Не выбирайте опцию **Начать с Community Edition**, так как это не обеспечит необходимую вычислительную мощность для этого руководства. 

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/choose_provider.png" title="Выбор облачного провайдера" />
    </div>

3. Проверьте свою электронную почту и завершите процесс проверки.

4. После завершения процесса проверки вы попадете на первый экран настройки. Databricks по умолчанию использует план `Premium`, и вы можете изменить пробный период на `Enterprise` на этой странице.
    
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/choose_plan.png" title="Выбор плана Databricks" />
    </div>

5. Теперь пришло время создать ваше первое рабочее пространство. Рабочее пространство Databricks — это среда для доступа ко всем вашим активам Databricks. Рабочее пространство организует такие объекты, как блокноты, SQL-склады, кластеры и многое другое в одном месте. Укажите имя вашего рабочего пространства, выберите соответствующий регион AWS и нажмите **Начать быстрый старт**. Вы можете увидеть флажок **У меня есть данные в S3, которые я хочу запросить с помощью Databricks**. Вам не нужно отмечать его для этого учебного пособия. 

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/start_quickstart.png" title="Создание ресурсов AWS" />
    </div>

6. Нажав на `Начать быстрый старт`, вы будете перенаправлены на AWS и попросят войти в систему, если вы еще не сделали этого. После входа в систему вы должны увидеть страницу, похожую на эту. 

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/quick_create_stack.png" title="Создание ресурсов AWS" />
    </div>

:::tip
Если вы получили ошибку сессии и не были перенаправлены на эту страницу, вы можете вернуться в интерфейс Databricks и создать рабочее пространство из интерфейса. Все, что вам нужно сделать, это нажать **создать рабочие пространства**, выбрать быстрый старт, заполнить форму и нажать **Начать быстрый старт**.
:::

7. Нет необходимости изменять какие-либо предварительно заполненные поля в параметрах. Просто добавьте свой пароль Databricks в поле **Учетные данные учетной записи Databricks**. Убедитесь, что вы отметили подтверждение и нажмите **Создать стек**.   
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
9. Теперь давайте перейдем в рабочее пространство. Нажмите **Открыть** и войдите в рабочее пространство, используя ту же учетную запись, которую вы использовали для входа.

## Загрузка данных

1. Скачайте эти CSV-файлы (образцы данных Jaffle Shop), которые вам понадобятся для этого руководства:
    - [jaffle_shop_customers.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_customers.csv)
    - [jaffle_shop_orders.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/jaffle_shop_orders.csv)
    - [stripe_payments.csv](https://dbt-tutorial-public.s3-us-west-2.amazonaws.com/stripe_payments.csv)

2. Сначала нам нужен SQL-склад. Найдите выпадающее меню и переключитесь в SQL-пространство.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/go_to_sql.png" title="SQL пространство" />
    </div>
3. Теперь мы настроим SQL-склад. Выберите **SQL Warehouses** в левой консоли. Вы увидите, что существует стандартный SQL-склад.  

4. Нажмите **Начать** на Starter Warehouse. Это займет несколько минут, чтобы запустить необходимые ресурсы.

5. После того как SQL-склад будет запущен, нажмите **Новый** и затем **Загрузка файла** в выпадающем меню. 
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/new_file_upload_using_databricks_SQL.png" title="Новая загрузка файла с использованием Databricks SQL" />
    </div>

6. Давайте сначала загрузим данные клиентов Jaffle Shop. Перетащите файл `jaffle_shop_customers.csv` в интерфейс.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/databricks_table_loader.png" title="Загрузчик таблиц Databricks" />
    </div>

7. Обновите атрибуты таблицы вверху:

    - <b>data_catalog</b> = hive_metastore
    - <b>database</b> = default 
    - <b>table</b> = jaffle_shop_customers
    - Убедитесь, что типы данных столбцов правильные. Вы можете сделать это, наведя курсор на значок типа данных рядом с именем столбца. 
        - <b>ID</b> = bigint
        - <b>FIRST_NAME</b> = string
        - <b>LAST_NAME</b> = string

    <div style={{maxWidth: '600px'}}>
    <Lightbox src="/img/databricks_tutorial/images/jaffle_shop_customers_upload.png" title="Загрузка клиентов jaffle shop" />
    </div>

8. Нажмите **Создать** внизу, когда закончите. 

9. Теперь давайте сделаем то же самое для `Jaffle Shop Orders` и `Stripe Payments`. 

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/jaffle_shop_orders_upload.png" title="Загрузка заказов jaffle shop" />
    </div>

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/stripe_payments_upload.png" title="Загрузка платежей Stripe" />
    </div>
    
10. После завершения убедитесь, что вы можете запросить обучающие данные. Перейдите в `SQL Editor` через левое меню. Это приведет вас к редактору запросов.
11. Убедитесь, что вы можете выполнить `select *` из каждой из таблиц с помощью следующих кодов. 

    ```sql
    select * from default.jaffle_shop_customers
    select * from default.jaffle_shop_orders
    select * from default.stripe_payments
    ```

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/databricks_tutorial/images/query_check.png" title="Проверка запроса" />
    </div>

12. Чтобы убедиться, что любые пользователи, которые могут работать над вашим проектом dbt, имеют доступ к вашему объекту, выполните эту команду.

    ```sql 
    grant all privileges on schema default to users;
    ```

## Подключение dbt Cloud к Databricks

Существует два способа подключения dbt Cloud к Databricks. Первый вариант — Partner Connect, который обеспечивает упрощенную настройку для создания вашей учетной записи dbt Cloud из вашей новой пробной учетной записи Databricks. Второй вариант — создать учетную запись dbt Cloud отдельно и самостоятельно настроить подключение к Databricks (подключение вручную). Если вы хотите быстро начать, dbt Labs рекомендует использовать Partner Connect. Если вы хотите настроить свою конфигурацию с самого начала и ознакомиться с процессом настройки dbt Cloud, dbt Labs рекомендует подключение вручную.

## Настройка интеграции через Partner Connect

:::note
 Partner Connect предназначен для пробных партнерских учетных записей. Если у вашей организации уже есть учетная запись dbt Cloud, подключайтесь вручную. Смотрите [Подключение к dbt Cloud вручную](https://docs.databricks.com/partners/prep/dbt-cloud.html#connect-to-dbt-cloud-manually) в документации Databricks для получения инструкций.
:::

Чтобы подключить dbt Cloud к Databricks с помощью Partner Connect, выполните следующие действия:

1. В боковой панели вашей учетной записи Databricks нажмите **Partner Connect**.

2. Нажмите на **плитку dbt**.

3. Выберите каталог из выпадающего списка, а затем нажмите **Далее**. Выпадающий список отображает каталоги, к которым у вас есть доступ на чтение и запись. Если ваше рабочее пространство не `<UC>-enabled`, используется устаревший метастор Hive (`hive_metastore`).

5. Если в вашем рабочем пространстве есть SQL-склады, выберите SQL-склад из выпадающего списка. Если ваш SQL-склад остановлен, нажмите **Начать**.

6. Если в вашем рабочем пространстве нет SQL-складов:

   1. Нажмите **Создать склад**. В вашем браузере откроется новая вкладка, на которой будет отображаться страница **Новый SQL-склад** в интерфейсе Databricks SQL.
   2. Следуйте шагам в [Создание SQL-склада](https://docs.databricks.com/en/sql/admin/create-sql-warehouse.html#create-a-sql-warehouse) в документации Databricks.
   3. Вернитесь на вкладку Partner Connect в вашем браузере, затем закройте **плитку dbt**.
   4. Снова откройте **плитку dbt**.
   5. Выберите SQL-склад, который вы только что создали, из выпадающего списка.

7. Выберите схему из выпадающего списка, а затем нажмите **Добавить**. Выпадающий список отображает схемы, к которым у вас есть доступ на чтение и запись. Вы можете повторить этот шаг, чтобы добавить несколько схем.

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

8. Нажмите **Далее**.

   В поле **Email** отображается адрес электронной почты для вашей учетной записи Databricks. dbt Labs использует этот адрес электронной почты, чтобы предложить вам создать пробную учетную запись dbt Cloud.

9. Нажмите **Подключиться к dbt Cloud**.

   В вашем веб-браузере откроется новая вкладка, на которой будет отображаться сайт getdbt.com.

10. Завершите инструкции на экране на сайте getdbt.com, чтобы создать свою пробную учетную запись dbt Cloud.

## Настройка управляемого репозитория dbt Cloud

<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки

Теперь, когда у вас настроен репозиторий, вы можете инициализировать свой проект и начать разработку в dbt Cloud:

1. Нажмите **Начать разработку в IDE**. Это может занять несколько минут, чтобы ваш проект запустился в первый раз, так как он устанавливает ваше соединение с git, клонирует ваш репозиторий и тестирует соединение со складом.
2. Над деревом файлов слева нажмите **Инициализировать проект dbt**. Это создаст вашу структуру папок с примерами моделей.
3. Сделайте свой первый коммит, нажав **Коммит и синхронизация**. Используйте сообщение коммита `initial commit` и нажмите **Коммит**. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, в которую вы можете добавить новый код dbt.
4. Теперь вы можете напрямую запрашивать данные из вашего склада и выполнять `dbt run`. Вы можете попробовать это сейчас:
    - Нажмите **+ Создать новый файл**, добавьте этот запрос в новый файл и нажмите **Сохранить как**, чтобы сохранить новый файл: 
        ```sql
        select * from default.jaffle_shop_customers
        ```
    - В строке команд внизу введите `dbt run` и нажмите **Enter**. Вы должны увидеть сообщение `dbt run succeeded`.

## Создание вашей первой модели

У вас есть два варианта работы с файлами в IDE dbt Cloud:

- Создать новую ветку (рекомендуется) — создайте новую ветку, чтобы редактировать и коммитить ваши изменения. Перейдите в **Управление версиями** на левой боковой панели и нажмите **Создать ветку**.
- Редактировать в защищенной основной ветке — если вы предпочитаете редактировать, форматировать или проверять файлы и выполнять команды dbt непосредственно в вашей основной ветке git. IDE dbt Cloud предотвращает коммиты в защищенную ветку, поэтому вам будет предложено коммитить ваши изменения в новую ветку.

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

4. Введите `dbt run` в командной строке внизу экрана. Вы должны получить успешный запуск и увидеть три модели.

Позже вы можете подключить свои инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не сырые данные в вашем инструменте BI.

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

1. Создайте новый SQL-файл `models/stg_customers.sql` с SQL из CTE `customers` в нашем оригинальном запросе.
2. Создайте второй новый SQL-файл `models/stg_orders.sql` с SQL из CTE `orders` в нашем оригинальном запросе.

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

3. Измените SQL в вашем файле `models/customers.sql` следующим образом:

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
<FAQ path="Project/structure-a-project" alt_header="Как мне организовать свой проект, когда я создаю больше моделей? Как мне называть свои модели?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />