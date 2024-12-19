---
title: "Быстрый старт с dbt Mesh"
id: "mesh-qs"
level: 'Intermediate'
icon: 'guides'
tags: ['dbt Cloud','Quickstart']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Введение

dbt Mesh — это фреймворк, который помогает организациям эффективно масштабировать свои команды и данные. Он способствует соблюдению лучших практик управления и разбивает крупные проекты на управляемые секции, что позволяет ускорить разработку данных. dbt Mesh доступен для аккаунтов [dbt Cloud Enterprise](https://www.getdbt.com/).

В этом руководстве вы научитесь настраивать многопроектный дизайн, используя основные концепции [dbt Mesh](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh), и как реализовать data mesh в dbt Cloud:

- Настроить базовый проект под названием “Jaffle | Data Analytics”
- Настроить дочерний проект под названием “Jaffle | Finance”
- Добавить доступ к моделям, версии и контракты
- Настроить задание dbt Cloud, которое запускается по завершении задания вышестоящего проекта

Для получения дополнительной информации о том, почему data mesh важен, прочитайте эту статью: [Что такое data mesh? Определение и важность data mesh](https://www.getdbt.com/blog/what-is-data-mesh-the-definition-and-importance-of-data-mesh).

:::tip Видео для вас
Если вам интересно обучение с помощью видео, вы можете бесплатно ознакомиться с курсом [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).

Вы также можете посмотреть [видео на YouTube о dbt и Snowflake](https://www.youtube.com/watch?v=kbCkwhySV_I&list=PL0QYlrC86xQm7CoOH6RS7hcgLnd3OQioG).
:::

### Связанный контент:
- [Концепции data mesh: что это такое и как начать](https://www.getdbt.com/blog/data-mesh-concepts-what-it-is-and-how-to-get-started)
- [Решение о том, как структурировать ваш dbt Mesh](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-3-structures)
- [Руководство по лучшим практикам dbt Mesh](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-4-implementation)
- [Часто задаваемые вопросы по dbt Mesh](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-5-faqs)

## Предварительные условия

Чтобы использовать dbt Mesh, вам необходимо:

- У вас должен быть [аккаунт dbt Cloud Enterprise](https://www.getdbt.com/get-started/enterprise-contact-pricing) <Lifecycle status="enterprise"/>
- У вас есть доступ к облачной платформе данных, разрешения на загрузку образцов таблиц данных и разрешения dbt Cloud на создание новых проектов.
- В этом руководстве используются образцы данных Jaffle Shop, включая таблицы `customers`, `orders` и `payments`. Следуйте предоставленным инструкциям, чтобы загрузить эти данные в вашу платформу данных:
  - [Snowflake](https://docs.getdbt.com/guides/snowflake?step=3)
  - [Databricks](https://docs.getdbt.com/guides/databricks?step=3)
  - [Redshift](https://docs.getdbt.com/guides/redshift?step=3)
  - [BigQuery](https://docs.getdbt.com/guides/bigquery?step=3)
  - [Fabric](https://docs.getdbt.com/guides/microsoft-fabric?step=2)
  - [Starburst Galaxy](https://docs.getdbt.com/guides/starburst-galaxy?step=2)

Это руководство предполагает, что у вас есть опыт работы с dbt или базовые знания о нем. Если вы новичок в dbt, сначала пройдите курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).

## Создание и настройка двух проектов

В этом разделе вы создадите два новых пустых проекта в dbt Cloud, которые будут служить вашим базовым и дочерним проектами:

- **Базовые проекты** (или вышестоящие проекты) обычно содержат основные модели и наборы данных, которые служат основой для дальнейшего анализа и отчетности.
- **Дочерние проекты** строятся на этих основах, часто добавляя более специфические преобразования или бизнес-логику для специализированных команд или целей.

Например, всегда предприимчивый и вымышленный аккаунт "Jaffle Labs" создаст два проекта для своей команды по аналитике данных и финансам: Jaffle | Data Analytics и Jaffle | Finance.

<Lightbox src="/img/guides/dbt-mesh/project_names.png" width="50%" title="Создайте два новых проекта dbt Cloud под названием 'Jaffle | Data Analytics' и 'Jaffle Finance'" />

Чтобы [создать](/docs/cloud/about-cloud-setup) новый проект в dbt Cloud:

1. В разделе **Настройки аккаунта** нажмите **+ Новый проект**.
2. Введите имя проекта и нажмите **Продолжить**.
   - Используйте "Jaffle | Data Analytics" для одного проекта
   - Используйте "Jaffle | Finance" для другого проекта
3. Выберите вашу платформу данных, затем нажмите **Далее**, чтобы настроить подключение.
4. В разделе **Настройка вашей среды** введите **Настройки** для вашего нового проекта.
5. Нажмите **Проверить подключение**. Это проверяет, что dbt Cloud может получить доступ к вашему аккаунту платформы данных.
6. Нажмите **Далее**, если тест прошел успешно. Если он не удался, вам, возможно, нужно будет вернуться и дважды проверить ваши настройки.
   - Для этого руководства убедитесь, что вы создаете одну [разработку](/docs/dbt-cloud-environments#create-a-development-environment) и [развертывание](/docs/deploy/deploy-environments) на проект.
     - Для "Jaffle | Data Analytics" установите базу данных по умолчанию на `jaffle_da`.
     - Для "Jaffle | Finance" установите базу данных по умолчанию на `jaffle_finance`.

<Lightbox src="/img/guides/dbt-mesh/create-new-project.gif" width="80%" title="Перейдите в 'Настройки аккаунта', затем нажмите + 'Новый проект', чтобы создать новые проекты в dbt Cloud" /> 

7. Продолжайте следовать подсказкам, чтобы завершить настройку проекта. После настройки каждый проект должен иметь:
    - Подключение к платформе данных
    - Новый git репозиторий
    - Одну или несколько [сред](/docs/deploy/deploy-environments) (таких как разработка, развертывание)

### Создание производственной среды
В dbt Cloud каждый проект может иметь одну среду развертывания, обозначенную как "Производственная". Вы должны настроить ["Производственную" или "Стадию" среду развертывания](/docs/deploy/deploy-environments) для каждого проекта, который вы хотите "смешать" вместе. Это позволяет вам использовать dbt Explorer на [последующих этапах](https://docs.getdbt.com/guides/mesh-qs?step=5#create-and-run-a-dbt-cloud-job) этого руководства.

Чтобы установить производственную среду:
1. Перейдите в **Развертывание** -> **Среды**, затем нажмите **Создать новую среду**.
2. Выберите **Развертывание** в качестве типа среды.
3. В разделе **Установить тип развертывания** выберите кнопку **Производственная**.
4. Выберите версию dbt.
5. Продолжайте заполнять поля по мере необходимости в разделах **Подключение развертывания** и **Учетные данные развертывания**.
6. Нажмите **Проверить подключение**, чтобы подтвердить подключение развертывания.
7. Нажмите **Сохранить**, чтобы создать производственную среду.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/prod-settings-1.png" width="100%" title="Установите вашу производственную среду в качестве среды по умолчанию в настройках среды"/>

## Настройка базового проекта

Этот вышестоящий проект — это место, где вы создаете свои основные активы данных. Этот проект будет содержать исходные данные, модели промежуточного уровня и основную бизнес-логику.

dbt Cloud позволяет специалистам по данным разрабатывать в своем инструменте по выбору и поставляется с локальным [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) или встроенной [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).

В этом разделе руководства вы установите проект "Jaffle | Data Analytics" в качестве вашего базового проекта, используя dbt Cloud IDE.

1. Сначала перейдите на страницу **Разработка**, чтобы проверить вашу настройку.
2. Нажмите **Инициализировать проект dbt**, если вы начали с пустого репозитория:

<Lightbox src="/img/guides/dbt-mesh/initialize_repo.png" width="40%" title="Инициализировать репозиторий" />

3. Удалите папку `models/example`.  
4. Перейдите к файлу `dbt_project.yml` и переименуйте проект (строка 5) с `my_new_project` на `analytics`.
5. В вашем файле `dbt_project.yml` удалите строки 39-42 (ссылку на модель `my_new_project`).
6. В **Проводнике файлов** наведите курсор на директорию проекта и нажмите **...**, затем выберите **Создать файл**.
7. Создайте две новые папки: `models/staging` и `models/core`.

### Промежуточный уровень
Теперь, когда вы настроили базовый проект, давайте начнем создавать активы данных. Настройте промежуточный уровень следующим образом:

1. Создайте новый YAML файл `models/staging/sources.yml`.
2. Объявите источники, скопировав следующее в файл и нажав **Сохранить**.

  <File name='models/staging/sources.yml'>

  ```yaml
  version: 2

  sources:
    - name: jaffle_shop
      description: Это реплика базы данных Postgres, используемой нашим приложением
      database: raw
      schema: jaffle_shop
      tables:
        - name: customers
          description: Один запись на клиента.
        - name: orders
          description: Один запись на заказ. Включает отмененные и удаленные заказы.
  ```
  </File>

3. Создайте файл `models/staging/stg_customers.sql`, чтобы выбрать данные из таблицы `customers` в источнике `jaffle_shop`.

  <File name='models/staging/stg_customers.sql'>

  ```sql
  select
      id as customer_id,
      first_name,
      last_name

  from {{ source('jaffle_shop', 'customers') }}
  ```
  </File>

4. Создайте файл `models/staging/stg_orders.sql`, чтобы выбрать данные из таблицы `orders` в источнике `jaffle_shop`.

  <File name='models/staging/stg_orders.sql'>

  ```sql
  select
      id as order_id,
      user_id as customer_id,
      order_date,
      status

  from {{ source('jaffle_shop', 'orders') }}
  ```
  </File>

5. Создайте файл `models/core/fct_orders.sql`, чтобы создать таблицу фактов с деталями клиентов и заказов.

  <File name='models/core/fct_orders.sql'>

  ```sql
  with customers as (
      select * 
      from {{ ref('stg_customers') }}
  ),

  orders as (
      select * 
      from {{ ref('stg_orders') }}
  ),

  customer_orders as (
      select
          customer_id,
          min(order_date) as first_order_date
      from orders
      group by customer_id
  ),

  final as (
      select
          o.order_id,
          o.order_date,
          o.status,
          c.customer_id,
          c.first_name,
          c.last_name,
          co.first_order_date,
          -- Обратите внимание, что мы использовали макрос для этого, чтобы соответствующий синтаксис DATEDIFF использовался для каждой соответствующей платформы данных
          {{ datediff('first_order_date', 'order_date', 'day') }} as days_as_customer_at_purchase
      from orders o
      left join customers c using (customer_id)
      left join customer_orders co using (customer_id)
  )

  select * from final
  ```
  </File>

6. Перейдите к **Командной строке** и выполните `dbt build`.

Прежде чем дочерняя команда сможет использовать активы из этого базового проекта, вам сначала нужно:
- [Создать и определить](/docs/collaborate/govern/model-access) как минимум одну модель как "публичную"
- Успешно выполнить [задание развертывания](/docs/deploy/deploy-jobs)
  - Обратите внимание, включите переключатель **Генерировать документацию при выполнении** для этого задания, чтобы обновить dbt Explorer. После выполнения вы можете нажать "Изучить" в верхнем меню и увидеть вашу иерархию, тесты и документацию, которые успешно прошли.

## Определите публичную модель и выполните первое задание

В предыдущем разделе вы организовали свои основные строительные блоки, теперь давайте интегрируем dbt Mesh.

Хотя команде финансов требуется модель `fct_orders` для анализа тенденций платежей, другие модели, особенно те, которые находятся на промежуточном уровне, используемые для очистки данных и объединения, не нужны дочерним командам.

Чтобы сделать `fct_orders` общедоступной:

1. В файле `models/core/core.yml` добавьте клаузу `access: public` в соответствующий YAML файл, добавив и сохранив следующее:

  <File name='models/core/core.yml'>

  ```yaml
  version: 2

  models:
    - name: fct_orders
      access: public
      description: "Детали клиентов и заказов"
      columns:
        - name: order_id
          data_type: number
          description: ""

        - name: order_date
          data_type: date
          description: ""

        - name: status
          data_type: varchar
          description: "Указывает статус заказа"

        - name: customer_id
          data_type: number
          description: ""

        - name: first_name
          data_type: varchar
          description: ""

        - name: last_name
          data_type: varchar
          description: ""

        - name: first_order_date
          data_type: date
          description: ""

        - name: days_as_customer_at_purchase
          data_type: number
          description: "Дни между этой покупкой и первой покупкой клиента"
  ```
  </File>

Обратите внимание: по умолчанию доступ к модели установлен на "защищенный", что означает, что к ней можно ссылаться только в рамках одного проекта. Узнайте больше о типах доступа и группах моделей [здесь](/docs/collaborate/govern/model-access#access-modifiers).

2. Перейдите на вкладку **Иерархия** в dbt Cloud IDE, чтобы увидеть модель, отмеченную как **Публичная**, под именем модели.

<Lightbox src="/img/guides/dbt-mesh/da_lineage.png" title="Иерархия Jaffle | Data Analytics" />

3. Перейдите в **Контроль версий** и нажмите кнопку **Коммит и синхронизация**, чтобы зафиксировать ваши изменения.
4. Объедините ваши изменения с основной или производственной веткой.

### Создайте и выполните задание dbt Cloud

Прежде чем дочерняя команда сможет использовать активы из этого базового проекта, вам нужно [создать производственную среду](https://docs.getdbt.com/guides/mesh-qs?step=3#create-a-production-environment) и успешно выполнить [задание развертывания](/docs/deploy/deploy-jobs).

Чтобы запустить ваше первое задание dbt Cloud по развертыванию, вам нужно создать новое задание dbt Cloud.  
1. Нажмите **Развертывание**, затем **Задания**. 
2. Нажмите **Создать задание**, затем **Задание развертывания**.
3. Выберите опцию **Генерировать документацию при выполнении**. Это отразит состояние этого проекта в разделе **Изучить**.

<Lightbox src="/img/guides/dbt-mesh/generate_docs_on_run.png" width="75%" title="Выберите опцию 'Генерировать документацию при выполнении' при настройке вашего задания dbt Cloud." />

4. Затем нажмите **Запустить сейчас**, чтобы запустить задание.
<Lightbox src="/img/guides/dbt-mesh/job_run_now.png" width="80%" title="Запустите задание, нажав кнопку 'Запустить сейчас'." />

5. После завершения выполнения нажмите **Изучить** в верхнем меню. Теперь вы должны увидеть вашу иерархию, тесты и документацию, которые успешно прошли.

Для получения подробной информации о том, как dbt Cloud использует метаданные из среды промежуточного уровня для разрешения ссылок в дочерних проектах, ознакомьтесь с разделом о [Промежуточном уровне с зависимостями вниз по потоку](/docs/collaborate/govern/project-dependencies#staging-with-downstream-dependencies).

## Ссылка на публичную модель в вашем дочернем проекте

В этом разделе вы настроите дочерний проект "Jaffle | Finance" и [перекрестную ссылку на проект](/docs/collaborate/govern/project-dependencies) на модель `fct_orders` из базового проекта. Перейдите на страницу **Разработка**, чтобы настроить наш проект:

1. Если вы также начали с нового git репозитория, нажмите **Инициализировать проект dbt** в разделе **Контроль версий**.
2. Удалите папку `models/example`.
3. Перейдите к файлу `dbt_project.yml` и переименуйте проект (строка 5) с `my_new_project` на `finance`.
4. Перейдите к файлу `dbt_project.yml` и удалите строки 39-42 (ссылку на модель `my_new_project`).
5. В **Проводнике файлов** наведите курсор на директорию проекта, нажмите **...** и выберите **Создать файл**.
6. Назовите файл `dependencies.yml`.

<Lightbox src="/img/guides/dbt-mesh/finance_create_file.png" width="70%" title="Создайте файл в dbt Cloud IDE." />

6. Добавьте вышестоящий проект `analytics` и пакет `dbt_utils`. Нажмите **Сохранить**.

  <File name='dependencies.yml'>

  ```yaml

  packages:
    - package: dbt-labs/dbt_utils
      version: 1.1.1

  projects:
    - name: analytics

  ```
  </File>

### Промежуточный уровень

Теперь, когда вы настроили базовый проект, давайте начнем создавать активы данных. Настройте промежуточный уровень следующим образом:

1. Создайте новый YAML файл `models/staging/sources.yml` и объявите источники, скопировав следующее в файл и нажав **Сохранить**.

    <File name='models/staging/sources.yml'>

    ```yml
    version: 2

    sources:
      - name: stripe
        database: raw
        schema: stripe 
        tables:
          - name: payment
    ```

    </File>

2. Создайте `models/staging/stg_payments.sql`, чтобы выбрать данные из таблицы `payment` в источнике `stripe`.

    <File name='models/staging/stg_payments.sql'>

    ```sql

    with payments as (
        select * from {{ source('stripe', 'payment') }}
    ),

    final as (
        select 
            id as payment_id,
            orderID as order_id,
            paymentMethod as payment_method,
            amount,
            created as payment_date 
        from payments
    )

    select * from final

    ```

    </File>

### Ссылка на публичную модель

Теперь вы готовы добавить модель, которая исследует, как типы платежей варьируются на протяжении пути клиента. Это поможет определить, уменьшаются ли подарочные карты с купонами при повторных покупках, как ожидает наша команда маркетинга, или остаются стабильными.

1. Чтобы сослаться на модель, используйте следующую логику для определения этого:

    <File name='models/core/agg_customer_payment_journey.sql'>

    ```sql

    with stg_payments as (
        select * from {{ ref('stg_payments') }}
    ),

    fct_orders as (
        select * from {{ ref('analytics', 'fct_orders') }}
    ),

    final as (
        select 
            days_as_customer_at_purchase,
            -- мы используем макрос pivot в пакете dbt_utils для создания столбцов, которые суммируют платежи для каждого метода
            {{ dbt_utils.pivot(
                'payment_method',
                dbt_utils.get_column_values(ref('stg_payments'), 'payment_method'),
                agg='sum',
                then_value='amount',
                prefix='total_',
                suffix='_amount'
            ) }}, 
            sum(amount) as total_amount
        from fct_orders
        left join stg_payments using (order_id)
        group by 1
    )

    select * from final

    ```

    </File> 

2. Обратите внимание на работу перекрестной ссылки на проект! Когда вы добавляете `ref`, функция автозаполнения в dbt Cloud IDE распознает публичную модель как доступную.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_autocomplete.png" title="Автозаполнение перекрестной ссылки на проект в dbt Cloud IDE" />

3. Это автоматически разрешает (или связывает) с правильной базой данных, схемой и набором таблиц/представлений, установленными вышестоящим проектом.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_compile.png" title="Компиляция перекрестной ссылки на проект" />

4. Вы также можете увидеть это соединение, отображенное на вкладке **Иерархия** в реальном времени.
<Lightbox src="/img/guides/dbt-mesh/cross_proj_ref_lineage.png" title="Иерархия перекрестной ссылки на проект" />

## Добавление версий моделей и контрактов

Как вы можете повысить устойчивость и добавить защитные механизмы к такому типу многопроектных отношений? Вы можете принять лучшие практики из программной инженерии, следуя этим шагам:

1. Определение контрактов моделей — настройте [контракты моделей](/docs/collaborate/govern/model-contracts) в dbt, чтобы определить набор предварительных "гарантий", которые определяют структуру вашей модели. При создании вашей модели dbt будет проверять, что преобразование вашей модели создаст набор данных, соответствующий ее контракту; если нет, сборка завершится неудачей.
2. Определение версий моделей — используйте [версии моделей](/docs/collaborate/govern/model-versions), чтобы управлять обновлениями и систематически обрабатывать изменения, которые могут привести к сбоям.

### Настройка контрактов моделей
Как часть команды аналитики данных, вы можете захотеть убедиться, что модель `fct_orders` надежна для пользователей вниз по потоку, таких как команда финансов.

1. Перейдите к `models/core/core.yml` и под моделью `fct_orders` перед разделом `columns:` добавьте контракт данных, чтобы обеспечить надежность:

```yaml
models:
  - name: fct_orders
    access: public
    description: “Детали клиентов и заказов”
    config:
      contract:
        enforced: true
    columns:
      - name: order_id
        .....
```

2. Проверьте, что произойдет, если этот контракт будет нарушен. В `models/core/fct_orders.sql` закомментируйте столбец `orders.status` и нажмите **Собрать**, чтобы попытаться собрать модель.
   - Если контракт будет нарушен, сборка завершится неудачей, как видно в истории командной строки.
    <Lightbox src="/img/guides/dbt-mesh/break_contract.png" title="Контракт данных был нарушен, и выполнение сборки dbt завершилось неудачей." />

### Настройка версий моделей
В этом разделе вы настроите версии моделей командой аналитики данных, когда они обновляют модель `fct_orders`, обеспечивая при этом обратную совместимость и уведомление о миграции для команды финансов.

1. Переименуйте существующий файл модели с `models/core/fct_orders.sql` на `models/core/fct_orders_v1.sql`.
2. Создайте новый файл `models/core/fct_orders_v2.sql` и измените схему:
   - Закомментируйте `o.status` в CTE `final`.
   - Добавьте новое поле `case when o.status = 'returned' then true else false end as is_return`, чтобы указать, был ли заказ возвращен.
3. Затем добавьте следующее в ваш файл `models/core/core.yml`:
   - Столбец `is_return`
   - Две версии модели
   - `latest_version`, чтобы указать, какая модель является последней (и должна использоваться по умолчанию, если не указано иное)
   - Дата устаревания для версии 1, чтобы указать, когда модель будет устаревшей.

4. Теперь он должен выглядеть следующим образом:

<File name='models/core/core.yml'>

```yaml

version: 2

models:
  - name: fct_orders
    access: public
    description: "Детали клиентов и заказов"
    latest_version: 2
    config:
      contract:
        enforced: true
    columns:
      - name: order_id
        data_type: number
        description: ""

      - name: order_date
        data_type: date
        description: ""

      - name: status
        data_type: varchar
        description: "Указывает статус заказа"

      - name: is_return
        data_type: boolean
        description: "Указывает, был ли заказ возвращен"

      - name: customer_id
        data_type: number
        description: ""

      - name: first_name
        data_type: varchar
        description: ""

      - name: last_name
        data_type: varchar
        description: ""

      - name: first_order_date
        data_type: date
        description: ""

      - name: days_as_customer_at_purchase
        data_type: number
        description: "Дни между этой покупкой и первой покупкой клиента"

    # Объявите версии и выделите различия
    versions:
    
      - v: 1
        deprecation_date: 2024-06-30 00:00:00.00+00:00
        columns:
          # Это означает: используйте список 'columns' выше, но исключите is_return
          - include: all
            exclude: [is_return]
        
      - v: 2
        columns:
          # Это означает: используйте список 'columns' выше, но исключите status
          - include: all
            exclude: [status]
```

</File>

5. Проверьте, как dbt компилирует оператор `ref` на основе обновлений. Откройте новый файл, добавьте следующие операторы select и нажмите **Скомпилировать**. Обратите внимание, как каждая ссылка компилируется в указанную версию (или последнюю версию, если не указано).

```sql
select * from {{ ref('fct_orders', v=1) }}
select * from {{ ref('fct_orders', v=2) }}
select * from {{ ref('fct_orders') }}
```

## Добавление задания dbt Cloud в дочерний проект
Перед тем как продолжить, убедитесь, что вы зафиксировали и объединили ваши изменения в проектах "Jaffle | Data Analytics" и "Jaffle | Finance".

Член команды финансов хотел бы запланировать задание dbt Cloud для анализа пути платежей клиентов сразу после обновления пайплайнов команды аналитики данных.

1. В проекте "Jaffle | Finance" перейдите на страницу **Задания**, выбрав **Развертывание**, а затем **Задания**. 
2. Затем нажмите **Создать задание**, а затем **Задание развертывания**.
3. Добавьте имя для задания, затем прокрутите вниз до раздела **Завершение задания**.  
4. В разделе **Завершение задания** настройте задание на **Запуск при завершении другого задания** и выберите вышестоящее задание из проекта "Jaffle | Data Analytics".
<Lightbox src="/img/guides/dbt-mesh/trigger_on_completion.png" title="Запуск задания по завершении" />

5. Нажмите **Сохранить** и убедитесь, что задание настроено правильно.
6. Перейдите на страницу заданий "Jaffle | Data Analytics". Выберите **Ежедневное задание** и нажмите **Запустить сейчас**. 
7. После успешного завершения этого задания вернитесь на страницу заданий "Jaffle | Finance". Вы должны увидеть, что задание команды финансов было запущено автоматически.

Это упрощает процесс синхронизации с вышестоящими таблицами и устраняет необходимость в более сложных навыках оркестрации, таких как координация заданий между проектами с помощью внешнего оркестратора.

## Просмотр предупреждения об устаревании

Чтобы узнать, сколько времени у команды финансов есть для миграции с `fct_orders_v1` на `fct_orders_v2`, выполните следующие шаги:

1. В проекте "Jaffle | Finance" перейдите на страницу **Разработка**.
2. Отредактируйте перекрестную ссылку на проект, чтобы использовать v=1 в `models/marts/agg_customer_payment_journey.sql`:

<File name='models/core/agg_customer_payment_journey.sql'>

```sql

with stg_payments as (
    select * from {{ ref('stg_payments') }}
),

fct_orders as (
    select * from {{ ref('analytics', 'fct_orders', v=1) }}
),

final as (
    select 
        days_as_customer_at_purchase,
        -- мы используем макрос pivot в пакете dbt_utils для создания столбцов, которые суммируют платежи для каждого метода
        {{ dbt_utils.pivot(
            'payment_method',
            dbt_utils.get_column_values(ref('stg_payments'), 'payment_method'),
            agg='sum',
            then_value='amount',
            prefix='total_',
            suffix='_amount'
        ) }}, 
        sum(amount) as total_amount
    from fct_orders
    left join stg_payments using (order_id)
    group by 1
)

select * from final
```

</File>

3. В dbt Cloud IDE перейдите в **Контроль версий**, чтобы зафиксировать и объединить изменения.
4. Перейдите на страницу **Развертывание**, а затем **Задания**.
5. Нажмите **Запустить сейчас**, чтобы запустить задание финансов. Модель `agg_customer_payment_journey` будет собрана и отобразит предупреждение о дате устаревания.

<Lightbox src="/img/guides/dbt-mesh/deprecation_date_warning.png" title="Модель отобразит предупреждение о дате устаревания." />

## Просмотр иерархии с помощью dbt Explorer

Используйте [dbt Explorer](/docs/collaborate/explore-projects), чтобы просмотреть иерархию между проектами в dbt Cloud. Перейдите на страницу **Изучить** для каждого из ваших проектов — теперь вы должны видеть [иерархию без швов между проектами](/docs/collaborate/explore-multiple-projects).

<Lightbox src="/img/guides/dbt-mesh/jaffle_da_final_lineage.png" width="85%" title="Просмотр иерархии 'Jaffle | Data Analytics' с помощью dbt Explorer " />

## Что дальше

<ConfettiTrigger>

Поздравляем 🎉! Вы готовы принести преимущества dbt Mesh в вашу организацию. Вы узнали:

- Как создать базовый проект "Jaffle | Data Analytics."
- Создать дочерний проект "Jaffle | Finance."
- Реализовать доступ к моделям, версии и контракты.
- Настроить задания dbt Cloud, которые запускаются по завершению заданий вышестоящих проектов.

Вот некоторые дополнительные ресурсы, которые помогут вам продолжить ваше путешествие:

- [Как мы строим наши проекты dbt mesh](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-1-intro)
- [Часто задаваемые вопросы по dbt Mesh](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-5-faqs)
- [Реализация dbt Mesh с помощью семантического слоя](/docs/use-dbt-semantic-layer/sl-faqs#how-can-i-implement-dbt-mesh-with-the-dbt-semantic-layer)
- [Перекрестные ссылки между проектами](/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref)
- [dbt Explorer](/docs/collaborate/explore-projects)

</ConfettiTrigger>

</div>