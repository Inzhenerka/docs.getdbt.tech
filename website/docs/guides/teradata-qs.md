---
title: "Быстрый старт для dbt Cloud и Teradata"
id: "teradata"
level: 'Beginner'
icon: 'teradata'
tags: ['dbt Cloud','Quickstart','Teradata']
hide_table_of_contents: true
---

<div style={{maxWidth:'900px'}}>

## Введение

В этом руководстве по быстрому старту вы узнаете, как использовать dbt Cloud с Teradata Vantage. Оно покажет вам, как:

- Создать новый экземпляр Teradata Clearscape
- Загрузить пример данных в вашу базу данных Teradata
- Подключить dbt Cloud к Teradata
- Взять пример запроса и превратить его в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавить тесты к вашим моделям.
- Документировать ваши модели.
- Запланировать выполнение задания.

:::tip Видео для вас
Вы можете бесплатно ознакомиться с [Основами dbt](https://learn.getdbt.com/courses/dbt-fundamentals), если вас интересует обучение с видео.
:::

### Предварительные требования

- У вас есть [аккаунт dbt Cloud](https://www.getdbt.com/signup/).
- У вас есть доступ к экземпляру Teradata Vantage. Вы можете бесплатно создать его на https://clearscape.teradata.com. Подробности смотрите в [руководстве по ClearScape Analytics Experience](https://developers.teradata.com/quickstarts/get-access-to-vantage/clearscape-analytics-experience/getting-started-with-csae/).

### Связанные материалы

- Узнайте больше с [курсами dbt Learn](https://learn.getdbt.com)
- [Как мы создаем экземпляр Teradata Clearscape Vantage](https://developers.teradata.com/quickstarts/get-access-to-vantage/clearscape-analytics-experience/getting-started-with-csae/)
- [CI задания](/docs/deploy/continuous-integration)
- [Развертывание заданий](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Актуальность источников](/docs/deploy/source-freshness)

## Загрузка данных

Следующие шаги помогут вам получить данные, хранящиеся в виде CSV-файлов в общедоступном S3-бакете, и вставить их в таблицы.

:::tip SQL IDE

Если вы создали экземпляр базы данных Teradata Vantage на https://clearscape.teradata.com и у вас нет под рукой SQL IDE, используйте JupyterLab, поставляемый с вашей базой данных, для выполнения SQL:

1. Перейдите на [панель управления ClearScape Analytics Experience](https://clearscape.teradata.com/dashboard) и нажмите кнопку **Run Demos**. Демонстрация запустит JupyterLab.

2. В JupyterLab перейдите в **Launcher**, нажав на синюю иконку **+** в верхнем левом углу. Найдите раздел **Notebooks** и нажмите **Teradata SQL**.

3. В первой ячейке блокнота подключитесь к базе данных, используя `connect` magic. Вам будет предложено ввести пароль от базы данных при выполнении:
   ```ipynb
   %connect local
   ```
4. Используйте дополнительные ячейки для ввода и выполнения SQL-запросов.

:::

1. Используйте предпочитаемый редактор SQL IDE для создания базы данных `jaffle_shop`:

   ```sql
   CREATE DATABASE jaffle_shop AS PERM = 1e9;
   ```

2. В базе данных `jaffle_shop` создайте три внешние таблицы и укажите соответствующие csv-файлы, расположенные в объектном хранилище:

    ```sql
    CREATE FOREIGN TABLE jaffle_shop.customers (
        id integer,
        first_name varchar (100),
        last_name varchar (100),
        email varchar (100)
    )
    USING (
        LOCATION ('/gs/storage.googleapis.com/clearscape_analytics_demo_data/dbt/raw_customers.csv')
    )
    NO PRIMARY INDEX;

    CREATE FOREIGN TABLE jaffle_shop.orders (
        id integer,
        user_id integer,
        order_date date,
        status varchar(100)
    )
    USING (
        LOCATION ('/gs/storage.googleapis.com/clearscape_analytics_demo_data/dbt/raw_orders.csv')
    )
    NO PRIMARY INDEX;

    CREATE FOREIGN TABLE jaffle_shop.payments (
        id integer,
        orderid integer,
        paymentmethod varchar (100),
        amount integer
    )
    USING (
        LOCATION ('/gs/storage.googleapis.com/clearscape_analytics_demo_data/dbt/raw_payments.csv')
    )
    NO PRIMARY INDEX;
    ```

## Подключение dbt Cloud к Teradata

1. Создайте новый проект в dbt Cloud. Нажмите на имя вашего аккаунта в левом меню, выберите **Account settings** и нажмите **+ New Project**. 
2. Введите имя проекта и нажмите **Continue**.
3. В **Configure your development environment** нажмите **Add new connection**.
4. Выберите **Teradata**, заполните все необходимые данные в разделе **Settings** и протестируйте подключение.

  <Lightbox src="/img/teradata/dbt_cloud_teradata_setup_connection_start.png" title="dbt Cloud - Выбор подключения Teradata" />
  
  <Lightbox src="/img/teradata/dbt_cloud_teradata_account_settings.png" title="dbt Cloud - Настройки аккаунта Teradata" />

5. Введите ваши **Development Credentials** для Teradata:
   * **Username** &mdash; Имя пользователя базы данных Teradata.
   * **Password** &mdash; Пароль базы данных Teradata.
   * **Schema** &mdash; База данных по умолчанию для использования.
  
   <Lightbox src="/img/teradata/dbt_cloud_teradata_development_credentials.png" title="dbt Cloud - Учетные данные для разработки Teradata" />

6. Нажмите **Test Connection**, чтобы убедиться, что dbt Cloud может получить доступ к вашему экземпляру Teradata Vantage.
7. Если тест подключения прошел успешно, нажмите **Next**. Если он не удался, проверьте настройки и учетные данные Teradata.

## Настройка управляемого репозитория dbt Cloud

<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки

Теперь, когда у вас настроен репозиторий, вы можете инициализировать ваш проект и начать разработку в dbt Cloud:

1. Нажмите **Start developing in the IDE**. Это может занять несколько минут, так как ваш проект впервые запускается, устанавливает соединение с git, клонирует ваш репозиторий и тестирует подключение к хранилищу.
2. Над деревом файлов слева нажмите **Initialize your project**, чтобы создать структуру папок с примерами моделей.
3. Сделайте ваш первый коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit`, чтобы создать первый коммит в вашем управляемом репозитории. После создания коммита вы можете открыть ветку для добавления нового кода dbt.

## Удаление примерных моделей

Теперь вы можете удалить файлы, которые dbt создал при инициализации проекта:

1. Удалите директорию `models/example/`.
2. Удалите ключ `example:` из вашего файла `dbt_project.yml` и любые конфигурации, которые перечислены под ним.

    <File name='dbt_project.yml'>

    ```yaml
    # до
    models:
      my_new_project:
        +materialized: table
        example:
          +materialized: view
    ```

    </File>

    <File name='dbt_project.yml'>

    ```yaml
    # после
    models:
      my_new_project:
        +materialized: table
    ```

    </File>

3. Сохраните изменения.
4. Зафиксируйте изменения и объедините с основной веткой.

#### Часто задаваемые вопросы

<FAQ path="Models/removing-deleted-models" />
<FAQ path="Troubleshooting/unused-model-configurations" />

## Создание вашей первой модели

У вас есть два варианта работы с файлами в IDE dbt Cloud:

- Создать новую ветку (рекомендуется) &mdash; Создайте новую ветку, чтобы редактировать и фиксировать ваши изменения. Перейдите в **Version Control** на левой боковой панели и нажмите **Create branch**.
- Редактировать в защищенной основной ветке &mdash; Если вы предпочитаете редактировать, форматировать, проверять файлы или выполнять команды dbt непосредственно в вашей основной ветке git. IDE dbt Cloud предотвращает коммиты в защищенную ветку, поэтому вы получите запрос на фиксацию изменений в новую ветку.

Назовите новую ветку `add-customers-model`.

1. Нажмите **...** рядом с директорией `models`, затем выберите **Create file**. 
2. Назовите файл `bi_customers.sql`, затем нажмите **Create**.
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

   left join customer_orders on customers.customer_id = customer_orders.customer_id

)

select * from final

```

4. Введите `dbt run` в командной строке внизу экрана. Вы должны получить успешное выполнение и увидеть три модели.

Вы можете подключить ваши инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не сырые данные в вашем инструменте BI.

## Изменение способа материализации вашей модели

Одна из самых мощных функций dbt заключается в том, что вы можете изменить способ материализации модели в вашем хранилище, просто изменив значение конфигурации. Вы можете менять вещи между таблицами и представлениями, изменяя ключевое слово, а не записывая язык определения данных (DDL) для этого за кулисами.

По умолчанию все создается как представление. Вы можете переопределить это на уровне директории, чтобы все в этой директории материализовалось в другую материализацию.

1. Отредактируйте ваш файл `dbt_project.yml`.
    - Обновите имя вашего проекта на:
      <File name='dbt_project.yml'>

      ```yaml
      name: 'jaffle_shop'
      ```

      </File>
    - Настройте `jaffle_shop`, чтобы все в нем материализовалось как таблица; и настройте `example`, чтобы все в нем материализовалось как представление. Обновите ваш блок конфигурации `models` на:

      <File name='dbt_project.yml'>

      ```yaml
      models:
        jaffle_shop:
          +materialized: table
      ```

      </File>
    - Нажмите **Save**.

2. Введите команду `dbt run`. Ваша модель `bi_customers` теперь должна быть построена как таблица!
    :::info
    Для этого dbt сначала должен был выполнить оператор `drop view` (или API вызов на BigQuery), затем оператор `create table as`.
    :::

3. Отредактируйте `models/bi_customers.sql`, чтобы переопределить `dbt_project.yml` только для модели `customers`, добавив следующий фрагмент в начало, и нажмите **Save**:  

    <File name='models/bi_customers.sql'>

    ```sql
    {{
      config(
        materialized='view'
      )
    }}

    with customers as (

        select
            id as customer_id
            ...

    )

    ```

    </File>

4. Введите команду `dbt run`. Ваша модель `bi_customers` теперь должна быть построена как представление. 

### Часто задаваемые вопросы

<FAQ path="Models/available-materializations" />
<FAQ path="Project/which-materialization" />
<FAQ path="Models/available-configurations" />

## Создание моделей на основе других моделей

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте новый SQL файл, `models/stg_customers.sql`, с SQL из CTE `customers` в вашем оригинальном запросе.
   <File name='models/stg_customers.sql'>

   ```sql
   select
      id as customer_id,
      first_name,
      last_name

   from jaffle_shop.customers
   ```

   </File>

2. Создайте второй новый SQL файл, `models/stg_orders.sql`, с SQL из CTE `orders` в вашем оригинальном запросе.
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

3. Отредактируйте SQL в вашем файле `models/bi_customers.sql` следующим образом:

   <File name='models/bi_customers.sql'>

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

   На этот раз, когда вы выполнили `dbt run`, были созданы отдельные представления/таблицы для `stg_customers`, `stg_orders` и `customers`. dbt определил порядок, в котором эти модели должны выполняться. Поскольку `customers` зависит от `stg_customers` и `stg_orders`, dbt строит `customers` последним. Вам не нужно явно определять эти зависимости.

#### Часто задаваемые вопросы {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="Как я должен организовать свой проект по мере создания большего количества моделей? Как я должен называть свои модели?" />

## Создание моделей на основе источников

Источники позволяют называть и описывать данные, загруженные в ваше хранилище вашими инструментами извлечения и загрузки. Объявляя эти таблицы как источники в dbt, вы можете:
- Выбирать из исходных таблиц в ваших моделях, используя функцию `{{ source() }}`, помогая определить происхождение ваших данных
- Проверять ваши предположения о ваших исходных данных
- Рассчитывать актуальность ваших исходных данных

1. Создайте новый YML файл, `models/sources.yml`.
2. Объявите источники, скопировав следующее в файл и нажав **Save**.

   <File name='models/sources.yml'>

   ```yml
   version: 2

   sources:
      - name: jaffle_shop
        description: Это реплика базы данных Postgres, используемой приложением
        database: raw
        schema: jaffle_shop
        tables:
            - name: customers
              description: Одна запись на клиента.
            - name: orders
              description: Одна запись на заказ. Включает отмененные и удаленные заказы.
   ```

   </File>

3. Отредактируйте файл `models/stg_customers.sql`, чтобы выбрать из таблицы `customers` в источнике `jaffle_shop`.

   <File name='models/stg_customers.sql'>

   ```sql
   select
      id as customer_id,
      first_name,
      last_name

   from {{ source('jaffle_shop', 'customers') }}
   ```

   </File>

4. Отредактируйте файл `models/stg_orders.sql`, чтобы выбрать из таблицы `orders` в источнике `jaffle_shop`.

   <File name='models/stg_orders.sql'>

   ```sql
   select
      id as order_id,
      user_id as customer_id,
      order_date,
      status

   from {{ source('jaffle_shop', 'orders') }}
   ```

   </File>

5. Выполните `dbt run`.

   Результаты вашего `dbt run` будут такими же, как и на предыдущем шаге. Ваши модели `stg_customers` и `stg_orders` все еще будут запрашивать из того же источника сырых данных в Teradata. Используя `source`, вы можете тестировать и документировать ваши сырые данные, а также понимать происхождение ваших источников.

</div>

## Добавление тестов к вашим моделям

Добавление [тестов](/docs/build/data-tests) в проект помогает убедиться, что ваши модели работают правильно.

Чтобы добавить тесты в ваш проект:

1. Создайте новый YAML файл в директории `models`, названный `models/schema.yml`
2. Добавьте следующее содержимое в файл:

    <File name='models/schema.yml'>

    ```yaml
    version: 2

    models:
      - name: bi_customers
        columns:
          - name: customer_id
            tests:
              - unique
              - not_null

      - name: stg_customers
        columns:
          - name: customer_id
            tests:
              - unique
              - not_null

      - name: stg_orders
        columns:
          - name: order_id
            tests:
              - unique
              - not_null
          - name: status
            tests:
              - accepted_values:
                  values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
          - name: customer_id
            tests:
              - not_null
              - relationships:
                  to: ref('stg_customers')
                  field: customer_id

    ```

    </File>

3. Запустите `dbt test` и убедитесь, что все ваши тесты прошли.

Когда вы запускаете `dbt test`, dbt проходит через ваши YAML файлы и создает запрос для каждого теста. Каждый запрос вернет количество записей, которые не прошли тест. Если это число равно 0, то тест успешен.

#### Часто задаваемые вопросы

<FAQ path="Tests/available-tests" alt_header="Какие тесты доступны для использования в dbt? Могу ли я добавить свои собственные тесты?" />
<FAQ path="Tests/test-one-model" />
<FAQ path="Runs/failed-tests" />
<FAQ path="Project/schema-yml-name" alt_header="Должен ли мой файл тестов называться `schema.yml`?" />
<FAQ path="Project/why-version-2" />
<FAQ path="Tests/recommended-tests" />
<FAQ path="Tests/when-to-test" />

## Документирование ваших моделей

Добавление [документации](/docs/build/documentation) в ваш проект позволяет вам описывать ваши модели в подробностях и делиться этой информацией с вашей командой. Здесь мы добавим некоторую базовую документацию в наш проект.

1. Обновите ваш файл `models/schema.yml`, чтобы включить некоторые описания, такие как те, что ниже.

    <File name='models/schema.yml'>

    ```yaml
    version: 2

    models:
      - name: bi_customers
        description: Одна запись на клиента
        columns:
          - name: customer_id
            description: Первичный ключ
            tests:
              - unique
              - not_null
          - name: first_order_date
            description: NULL, когда клиент еще не сделал заказ.

      - name: stg_customers
        description: Эта модель очищает данные клиентов
        columns:
          - name: customer_id
            description: Первичный ключ
            tests:
              - unique
              - not_null

      - name: stg_orders
        description: Эта модель очищает данные заказов
        columns:
          - name: order_id
            description: Первичный ключ
            tests:
              - unique
              - not_null
          - name: status
            tests:
              - accepted_values:
                  values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
          - name: customer_id
            tests:
              - not_null
              - relationships:
                  to: ref('stg_customers')
                  field: customer_id
    ```

    </File>

2. Запустите `dbt docs generate`, чтобы сгенерировать документацию для вашего проекта. dbt анализирует ваш проект и ваше хранилище, чтобы сгенерировать <Term id="json" /> файл с подробной документацией о вашем проекте.

3. Нажмите на иконку книги в интерфейсе Develop, чтобы открыть документацию в новой вкладке.

#### Часто задаваемые вопросы

<FAQ path="Docs/long-descriptions" />
<FAQ path="Docs/sharing-documentation" />

## Зафиксируйте ваши изменения

Теперь, когда вы создали вашу модель клиентов, вам нужно зафиксировать изменения, которые вы внесли в проект, чтобы репозиторий содержал ваш последний код.

**Если вы редактировали непосредственно в защищенной основной ветке:**<br />
1. Нажмите кнопку **Commit and sync git**. Это действие подготавливает ваши изменения для фиксации.
2. Появится модальное окно с заголовком **Commit to a new branch**.
3. В модальном окне назовите вашу новую ветку `add-customers-model`. Это создаст ветку от вашей основной ветки с вашими новыми изменениями.
4. Добавьте сообщение коммита, например, "Add customers model, tests, docs" и зафиксируйте ваши изменения.
5. Нажмите **Merge this branch to main**, чтобы добавить эти изменения в основную ветку вашего репозитория.

**Если вы создали новую ветку перед редактированием:**<br />
1. Поскольку вы уже ответвились от основной защищенной ветки, перейдите в **Version Control** слева.
2. Нажмите **Commit and sync**, чтобы добавить сообщение.
3. Добавьте сообщение коммита, например, "Add customers model, tests, docs."
4. Нажмите **Merge this branch to main**, чтобы добавить эти изменения в основную ветку вашего репозитория.

## Развертывание dbt

Используйте Планировщик dbt Cloud, чтобы уверенно развертывать ваши производственные задания и встраивать наблюдаемость в ваши процессы. Вы узнаете, как создать среду развертывания и запустить задание в следующих шагах.

### Создание среды развертывания

1. В верхнем левом углу выберите **Deploy**, затем нажмите **Environments**.
2. Нажмите **Create Environment**.
3. В поле **Name** напишите имя вашей среды развертывания. Например, "Production."
4. В поле **dbt Version** выберите последнюю версию из выпадающего списка.
5. В разделе **Deployment connection** введите имя набора данных, который вы хотите использовать в качестве цели, например, `jaffle_shop_prod`. Это позволит dbt строить и работать с этим набором данных.
6. Нажмите **Save**.

### Создание и запуск задания

Задания — это набор команд dbt, которые вы хотите выполнять по расписанию. Например, `dbt build`.

По мере того, как бизнес `jaffle_shop` привлекает больше клиентов, и эти клиенты создают больше заказов, вы увидите больше записей, добавленных в ваши исходные данные. Поскольку вы материализовали модель `bi_customers` как таблицу, вам нужно будет периодически перестраивать вашу таблицу, чтобы данные оставались актуальными. Это обновление произойдет, когда вы запустите задание.

1. После создания вашей среды развертывания вы должны быть перенаправлены на страницу для новой среды. Если нет, выберите **Deploy** в верхнем левом углу, затем нажмите **Jobs**.
2. Нажмите **+ Create job**, а затем выберите **Deploy job**. Укажите имя, например, "Production run", и свяжите его с только что созданной средой.
3. Прокрутите вниз до раздела **Execution Settings**.
4. В разделе **Commands** добавьте эту команду как часть вашего задания, если вы ее не видите:
   * `dbt build`
5. Выберите флажок **Generate docs on run**, чтобы автоматически [генерировать обновленную документацию проекта](/docs/collaborate/build-and-view-your-docs) каждый раз, когда выполняется ваше задание. 
6. Для этого упражнения не устанавливайте расписание для выполнения вашего проекта &mdash; хотя проект вашей организации должен выполняться регулярно, нет необходимости запускать этот пример проекта по расписанию. Установка расписания для задания иногда называется _развертыванием проекта_.
7. Выберите **Save**, затем нажмите **Run now**, чтобы запустить ваше задание.
8. Нажмите на выполнение и наблюдайте за его прогрессом в разделе "Run history."
9. После завершения выполнения нажмите **View Documentation**, чтобы увидеть документацию для вашего проекта.

Поздравляем 🎉! Вы только что развернули ваш первый проект dbt!

#### Часто задаваемые вопросы

<FAQ path="Runs/failed-prod-run" />