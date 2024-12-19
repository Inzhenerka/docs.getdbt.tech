---
title: "Быстрый старт для dbt Cloud и Teradata"
id: "teradata"
level: 'Начинающий'
icon: 'teradata'
tags: ['dbt Cloud','Quickstart','Teradata']
hide_table_of_contents: true
---

<div style={{maxWidth:'900px'}}>

## Введение

В этом руководстве быстрого старта вы узнаете, как использовать dbt Cloud с Teradata Vantage. Вы научитесь:

- Создавать новый экземпляр Teradata Clearscape
- Загружать образцы данных в вашу базу данных Teradata
- Подключать dbt Cloud к Teradata
- Превращать пример запроса в модель в вашем проекте dbt. Модель в dbt — это оператор select.
- Добавлять тесты к вашим моделям
- Документировать ваши модели
- Запланировать выполнение задания

:::tip Видео для вас
Если вам интересно обучение с видео, вы можете бесплатно ознакомиться с курсом [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).
:::

### Предварительные требования

- У вас есть [аккаунт dbt Cloud](https://www.getdbt.com/signup/).
- У вас есть доступ к экземпляру Teradata Vantage. Вы можете получить его бесплатно на https://clearscape.teradata.com. Смотрите [руководство по ClearScape Analytics Experience](https://developers.teradata.com/quickstarts/get-access-to-vantage/clearscape-analytics-experience/getting-started-with-csae/) для получения подробной информации.

### Связанный контент

- Узнайте больше с помощью [курсов dbt Learn](https://learn.getdbt.com)
- [Как мы предоставляем экземпляр Teradata Clearscape Vantage](https://developers.teradata.com/quickstarts/get-access-to-vantage/clearscape-analytics-experience/getting-started-with-csae/)
- [CI задания](/docs/deploy/continuous-integration)
- [Задания на развертывание](/docs/deploy/deploy-jobs)
- [Уведомления о заданиях](/docs/deploy/job-notifications)
- [Свежесть источников](/docs/deploy/source-freshness)

## Загрузка данных

Следующие шаги помогут вам получить данные, хранящиеся в виде CSV файлов в публичном S3 бакете, и вставить их в таблицы.

:::tip SQL IDE

Если вы создали экземпляр вашей базы данных Teradata Vantage на https://clearscape.teradata.com и у вас нет под рукой SQL IDE, используйте JupyterLab, который поставляется с вашей базой данных, для выполнения SQL:

1. Перейдите на [панель управления ClearScape Analytics Experience](https://clearscape.teradata.com/dashboard) и нажмите кнопку **Запустить демонстрации**. Демонстрация запустит JupyterLab.

2. В JupyterLab перейдите в **Launcher**, нажав на синюю иконку **+** в верхнем левом углу. Найдите раздел **Notebooks** и нажмите **Teradata SQL**.

3. В первой ячейке блокнота подключитесь к базе данных, используя магию `connect`. Вам будет предложено ввести пароль от вашей базы данных при выполнении:
   ```ipynb
   %connect local
   ```
4. Используйте дополнительные ячейки для ввода и выполнения SQL операторов.

:::

1. Используйте ваш предпочитаемый SQL IDE редактор для создания базы данных `jaffle_shop`:

   ```sql
   CREATE DATABASE jaffle_shop AS PERM = 1e9;
   ```

2. В базе данных `jaffle_shop` создайте три внешние таблицы и укажите соответствующие CSV файлы, расположенные в объектном хранилище:

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

1. Создайте новый проект в dbt Cloud. Нажмите на имя вашего аккаунта в левом меню, выберите **Настройки аккаунта** и нажмите **+ Новый проект**. 
2. Введите имя проекта и нажмите **Продолжить**.
3. В разделе **Настройка вашей среды разработки** нажмите **Добавить новое соединение**.
4. Выберите **Teradata**, заполните все необходимые данные в разделе **Настройки** и протестируйте соединение.

  <Lightbox src="/img/teradata/dbt_cloud_teradata_setup_connection_start.png" title="dbt Cloud - Выбор соединения Teradata" />
  
  <Lightbox src="/img/teradata/dbt_cloud_teradata_account_settings.png" title="dbt Cloud - Настройки аккаунта Teradata" />

5. Введите ваши **Учётные данные для разработки** для Teradata:
   * **Имя пользователя** — Имя пользователя базы данных Teradata.
   * **Пароль** — Пароль базы данных Teradata.
   * **Схема** — База данных по умолчанию для использования.
  
   <Lightbox src="/img/teradata/dbt_cloud_teradata_development_credentials.png" title="dbt Cloud - Учётные данные для разработки Teradata" />

6. Нажмите **Проверить соединение**, чтобы убедиться, что dbt Cloud может получить доступ к вашему экземпляру Teradata Vantage.
7. Если тест соединения прошёл успешно, нажмите **Далее**. Если он не удался, проверьте настройки и учётные данные Teradata.

## Настройка управляемого репозитория dbt Cloud

<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки

Теперь, когда у вас настроен репозиторий, вы можете инициализировать ваш проект и начать разработку в dbt Cloud:

1. Нажмите **Начать разработку в IDE**. Это может занять несколько минут, чтобы ваш проект запустился в первый раз, так как устанавливается соединение с git, клонируется ваш репозиторий и тестируется соединение с хранилищем.
2. Над деревом файлов слева нажмите **Инициализировать ваш проект**, чтобы создать структуру папок с примерами моделей.
3. Сделайте ваш первый коммит, нажав **Коммит и синхронизация**. Используйте сообщение коммита `initial commit`, чтобы создать первый коммит в вашем управляемом репозитории. После создания коммита вы можете открыть ветку для добавления нового кода dbt.

## Удаление примерных моделей

Теперь вы можете удалить файлы, которые dbt создал при инициализации проекта:

1. Удалите директорию `models/example/`.
2. Удалите ключ `example:` из вашего файла `dbt_project.yml` и любые конфигурации, которые указаны под ним.

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

3. Сохраните ваши изменения.
4. Зафиксируйте ваши изменения и объедините с основной веткой.

#### Часто задаваемые вопросы

<FAQ path="Models/removing-deleted-models" />
<FAQ path="Troubleshooting/unused-model-configurations" />


## Создание вашей первой модели

У вас есть два варианта работы с файлами в IDE dbt Cloud:

- Создать новую ветку (рекомендуется) — Создайте новую ветку для редактирования и фиксации ваших изменений. Перейдите в **Управление версиями** на левой боковой панели и нажмите **Создать ветку**.
- Редактировать в защищённой основной ветке — Если вы предпочитаете редактировать, форматировать, проверять файлы или выполнять команды dbt непосредственно в вашей основной git ветке. IDE dbt Cloud предотвращает коммиты в защищённую ветку, поэтому вы получите запрос на фиксацию ваших изменений в новой ветке.

Назовите новую ветку `add-customers-model`.

1. Нажмите **...** рядом с директорией `models`, затем выберите **Создать файл**. 
2. Назовите файл `bi_customers.sql`, затем нажмите **Создать**.
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

   left join customer_orders on customers.customer_id = customer_orders.customer_id

)

select * from final

```

4. Введите `dbt run` в командной строке внизу экрана. Вы должны получить успешный результат и увидеть три модели.

Вы можете подключить ваши инструменты бизнес-аналитики (BI) к этим представлениям и таблицам, чтобы они читали только очищенные данные, а не сырые данные в вашем инструменте BI.

## Изменение способа материализации вашей модели

Одной из самых мощных функций dbt является возможность изменять способ материализации модели в вашем хранилище, просто изменяя значение конфигурации. Вы можете изменять вещи между таблицами и представлениями, изменяя ключевое слово, а не написав язык определения данных (DDL) для этого за кулисами.

По умолчанию всё создаётся как представление. Вы можете переопределить это на уровне директории, чтобы всё в этой директории материализовалось в другую материализацию.

1. Отредактируйте ваш файл `dbt_project.yml`.
    - Обновите имя вашего проекта на:
      <File name='dbt_project.yml'>

      ```yaml
      name: 'jaffle_shop'
      ```

      </File>
    - Настройте `jaffle_shop`, чтобы всё в нём материализовалось как таблица; и настройте `example`, чтобы всё в нём материализовалось как представление. Обновите ваш блок конфигурации `models` на:

      <File name='dbt_project.yml'>

      ```yaml
      models:
        jaffle_shop:
          +materialized: table
      ```

      </File>
    - Нажмите **Сохранить**.

2. Введите команду `dbt run`. Ваша модель `bi_customers` теперь должна быть построена как таблица!
    :::info
    Для этого dbt сначала должен был выполнить оператор `drop view` (или API вызов в BigQuery), затем оператор `create table as`.
    :::

3. Отредактируйте `models/bi_customers.sql`, чтобы переопределить `dbt_project.yml` только для модели `customers`, добавив следующий фрагмент в начало, и нажмите **Сохранить**:  

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

4. Введите команду `dbt run`. Ваша модель `bi_customers` теперь должна строиться как представление. 

### Часто задаваемые вопросы

<FAQ path="Models/available-materializations" />
<FAQ path="Project/which-materialization" />
<FAQ path="Models/available-configurations" />

## Создание моделей на основе других моделей

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте новый SQL файл `models/stg_customers.sql` с SQL из CTE `customers` в вашем оригинальном запросе.
   <File name='models/stg_customers.sql'>

   ```sql
   select
      id as customer_id,
      first_name,
      last_name

   from jaffle_shop.customers
   ```

   </File>

2. Создайте второй новый SQL файл `models/stg_orders.sql` с SQL из CTE `orders` в вашем оригинальном запросе.
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

   На этот раз, когда вы выполнили `dbt run`, он создал отдельные представления/таблицы для `stg_customers`, `stg_orders` и `customers`. dbt определил порядок, в котором эти модели должны выполняться. Поскольку `customers` зависит от `stg_customers` и `stg_orders`, dbt строит `customers` последним. Вам не нужно явно определять эти зависимости.

#### Часто задаваемые вопросы {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="Как мне организовать свой проект, когда я создаю больше моделей? Как мне называть свои модели?" />

## Создание моделей на основе источников

Источники позволяют называть и описывать данные, загруженные в ваше хранилище вашими инструментами извлечения и загрузки. Объявив эти таблицы как источники в dbt, вы можете:
- Выбирать из таблиц источников в ваших моделях, используя функцию `{{ source() }}`, что помогает определить происхождение ваших данных
- Проверять ваши предположения о данных источников
- Рассчитывать свежесть ваших данных источников

1. Создайте новый YML файл `models/sources.yml`.
2. Объявите источники, скопировав следующее в файл и нажав **Сохранить**.

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
              description: Одна запись на каждого клиента.
            - name: orders
              description: Одна запись на каждый заказ. Включает отменённые и удалённые заказы.
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

   Результаты вашего `dbt run` будут такими же, как и в предыдущем шаге. Ваши модели `stg_customers` и `stg_orders` по-прежнему будут запрашивать одни и те же сырые данные в Teradata. Используя `source`, вы можете тестировать и документировать ваши сырые данные, а также понимать происхождение ваших источников.

</div>

## Добавление тестов к вашим моделям

Добавление [тестов](/docs/build/data-tests) в проект помогает подтвердить, что ваши модели работают правильно.

Чтобы добавить тесты в ваш проект:

1. Создайте новый YAML файл в директории `models`, назвав его `models/schema.yml`.
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

3. Выполните `dbt test` и подтвердите, что все ваши тесты прошли.

Когда вы выполняете `dbt test`, dbt проходит через ваши YAML файлы и строит запрос для каждого теста. Каждый запрос вернёт количество записей, которые не прошли тест. Если это число равно 0, то тест успешен.

#### Часто задаваемые вопросы

<FAQ path="Tests/available-tests" alt_header="Какие тесты доступны для использования в dbt? Могу ли я добавить свои собственные пользовательские тесты?" />
<FAQ path="Tests/test-one-model" />
<FAQ path="Runs/failed-tests" />
<FAQ path="Project/schema-yml-name" alt_header="Должен ли мой тестовый файл называться `schema.yml`?" />
<FAQ path="Project/why-version-2" />
<FAQ path="Tests/recommended-tests" />
<FAQ path="Tests/when-to-test" />


## Документирование ваших моделей

Добавление [документации](/docs/build/documentation) в ваш проект позволяет вам подробно описать ваши модели и поделиться этой информацией с вашей командой. Здесь мы добавим некоторую базовую документацию в наш проект.

1. Обновите ваш файл `models/schema.yml`, чтобы включить некоторые описания, такие как приведённые ниже.

    <File name='models/schema.yml'>

    ```yaml
    version: 2

    models:
      - name: bi_customers
        description: Одна запись на каждого клиента
        columns:
          - name: customer_id
            description: Первичный ключ
            tests:
              - unique
              - not_null
          - name: first_order_date
            description: NULL, когда клиент ещё не сделал заказ.

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

2. Выполните `dbt docs generate`, чтобы сгенерировать документацию для вашего проекта. dbt анализирует ваш проект и ваше хранилище, чтобы создать файл <Term id="json" /> с подробной документацией о вашем проекте.

3. Нажмите на иконку книги в интерфейсе разработки, чтобы открыть документацию в новой вкладке.

#### Часто задаваемые вопросы

<FAQ path="Docs/long-descriptions" />
<FAQ path="Docs/sharing-documentation" />



## Зафиксируйте ваши изменения

Теперь, когда вы создали свою модель клиентов, вам нужно зафиксировать изменения, которые вы внесли в проект, чтобы репозиторий имел ваш последний код.

**Если вы редактировали непосредственно в защищённой основной ветке:**<br />
1. Нажмите кнопку **Коммит и синхронизация git**. Это действие подготавливает ваши изменения к фиксации.
2. Появится модальное окно с заголовком **Коммит в новую ветку**.
3. В модальном окне назовите вашу новую ветку `add-customers-model`. Эта ветка будет ответвлением от вашей основной ветки с вашими новыми изменениями.
4. Добавьте сообщение коммита, например "Добавить модель клиентов, тесты, документацию" и зафиксируйте ваши изменения.
5. Нажмите **Объединить эту ветку с основной** для добавления этих изменений в основную ветку вашего репозитория.


**Если вы создали новую ветку перед редактированием:**<br />
1. Поскольку вы уже ответвились от защищённой основной ветки, перейдите в **Управление версиями** слева.
2. Нажмите **Коммит и синхронизация**, чтобы добавить сообщение.
3. Добавьте сообщение коммита, например "Добавить модель клиентов, тесты, документацию."
4. Нажмите **Объединить эту ветку с основной**, чтобы добавить эти изменения в основную ветку вашего репозитория.

## Развертывание dbt

Используйте планировщик dbt Cloud для уверенного развертывания ваших производственных заданий и создания наблюдаемости в ваших процессах. Вы научитесь создавать среду развертывания и запускать задание в следующих шагах.

### Создание среды развертывания

1. В верхнем левом углу выберите **Развертывание**, затем нажмите **Среды**.
2. Нажмите **Создать среду**.
3. В поле **Имя** введите имя вашей среды развертывания. Например, "Производственная".
4. В поле **Версия dbt** выберите последнюю версию из выпадающего списка.
5. В разделе **Соединение для развертывания** введите имя набора данных, который вы хотите использовать в качестве цели, например `jaffle_shop_prod`. Это позволит dbt строить и работать с этим набором данных.
6. Нажмите **Сохранить**.

### Создание и запуск задания

Задания — это набор команд dbt, которые вы хотите выполнять по расписанию. Например, `dbt build`.

Поскольку бизнес `jaffle_shop` получает всё больше клиентов, и эти клиенты создают больше заказов, вы увидите, что в ваши исходные данные добавляются новые записи. Поскольку вы материализовали модель `bi_customers` как таблицу, вам нужно периодически перестраивать вашу таблицу, чтобы гарантировать, что данные остаются актуальными. Это обновление произойдёт, когда вы запустите задание.

1. После создания вашей среды развертывания вы должны быть перенаправлены на страницу новой среды. Если нет, выберите **Развертывание** в верхнем левом углу, затем нажмите **Задания**.
2. Нажмите **+ Создать задание**, затем выберите **Задание развертывания**. Укажите имя, например, "Производственный запуск", и свяжите его с созданной вами средой.
3. Прокрутите вниз до раздела **Настройки выполнения**.
4. В разделе **Команды** добавьте эту команду как часть вашего задания, если вы её не видите:
   * `dbt build`
5. Выберите флажок **Генерировать документацию при запуске**, чтобы автоматически [генерировать обновлённую документацию проекта](/docs/collaborate/build-and-view-your-docs) каждый раз, когда ваше задание выполняется. 
6. Для этого упражнения _не_ устанавливайте расписание для выполнения вашего проекта — хотя проект вашей организации должен выполняться регулярно, нет необходимости запускать этот пример проекта по расписанию. Запланированное задание иногда называют _развёртыванием проекта_.
7. Выберите **Сохранить**, затем нажмите **Запустить сейчас**, чтобы запустить ваше задание.
8. Нажмите на запуск и следите за его прогрессом в разделе "История запусков".
9. После завершения запуска нажмите **Просмотреть документацию**, чтобы увидеть документацию для вашего проекта.


Поздравляем 🎉! Вы только что развернули свой первый проект dbt!


#### Часто задаваемые вопросы

<FAQ path="Runs/failed-prod-run" />

