---
title: "Быстрый старт с dbt Semantic Layer"
id: sl-qs
description: "Используйте это руководство, чтобы создавать и определять метрики, настраивать dbt Semantic Layer и выполнять запросы к метрикам с помощью Google Sheets."
sidebar_label: "Быстрый старт с dbt Semantic Layer"
meta:
  api_name: dbt Semantic Layer APIs
icon: 'guides'
hide_table_of_contents: true
tags: ['Semantic Layer', 'dbt platform', 'Quickstart']
keywords: ['dbt Semantic Layer','Metrics','dbt platform', 'Google Sheets']
level: 'Intermediate'
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

<!-- Приведённые ниже фрагменты (или повторно используемые компоненты) находятся в следующих файлах в репозитории исходного кода документации) -->
import TestQuery from '/snippets/_sl-test-and-query-metrics.md';
import ConnectQueryAPI from '/snippets/_sl-connect-and-query-api.md';
import RunProdJob from '/snippets/_sl-run-prod-job.md';
import SlSetUp from '/snippets/_new-sl-setup.md';
import CreateSnowflakeSqlFile from '/snippets/_create-snowflake-sql-file.md';
import LoadData from '/snippets/_load-data.md';

## Введение {#introduction}

[<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), работающий на базе [MetricFlow](/docs/build/about-metricflow), упрощает настройку ключевых бизнес-метрик. Он централизует определения, исключает дублирование кода и обеспечивает удобный доступ к метрикам в инструментах, использующих эти данные. MetricFlow упрощает управление метриками компании, позволяя определять метрики в проекте dbt и запрашивать их в <Constant name="dbt" /> с помощью [команд MetricFlow](/docs/build/metricflow-commands).

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

import SlConnectYourAi from '/snippets/_sl-connect-your-ai.md';

<SlConnectYourAi/>

Это краткое руководство предназначено для пользователей <Constant name="dbt" /> на платформе <Constant name="dbt_platform" />. Вы создадите и определите метрики, настроите <Constant name="semantic_layer" /> в проекте dbt и выполните запросы к этим метрикам в Google Sheets.

Руководство подходит для любой поддерживаемой платформы данных. Используйте вкладки в разделе [Настройка хранилища](#set-up-your-warehouse), чтобы создать учетную запись, загрузить демонстрационные данные и подключить dbt. На последующих шагах предусмотрены отдельные вкладки для случаев, когда SQL или YAML отличается для вашей платформы.

### Предварительные требования {#prerequisites}

- Для всех развертываний необходима учетная запись [<Constant name="dbt" />](https://www.getdbt.com/signup/) с тарифным планом Trial, Starter или Enterprise.
- У вас должны быть соответствующие [лицензия <Constant name="dbt" />](/docs/platform/manage-access/seats-and-users) и [разрешения](/docs/platform/manage-access/enterprise-permissions) в зависимости от вашего тарифного плана:
  <DetailsToggle alt_header="Подробнее о лицензии и разрешениях">

  - Enterprise: лицензия Developer с разрешениями Account Admin. Или доступ «Owner» с лицензией Developer и назначенными разрешениями Project Creator, Database Admin или Admin.
  - Starter: доступ «Owner» с лицензией Developer.
  - Trial: автоматический доступ «Owner» в рамках пробного периода тарифного плана Starter.

  </DetailsToggle>

- Учетная запись в хранилище данных и образец данных Jaffle Shop. Следуйте инструкциям на вкладке вашей платформы в разделе [Настройка хранилища данных](#set-up-your-warehouse).
- Базовое понимание SQL и dbt. Например, вы уже использовали dbt или прошли курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).

## Set up your warehouse

Откройте вкладку вашей платформы данных, чтобы создать учетную запись, загрузить образцы данных и подключить dbt. Выполните только шаги, перечисленные на вкладке, а затем вернитесь сюда. Не переходите к настройке проекта или созданию моделей в другом руководстве. Эти шаги описаны далее в этом руководстве.

<Constant name="semantic_layer" /> в настоящее время поддерживает Snowflake, BigQuery, Databricks, Redshift, Postgres и Trino (включая Starburst Galaxy). Microsoft Fabric не поддерживается. Полный список приведен в разделе [Какие платформы данных поддерживаются](/docs/use-dbt-semantic-layer/setup-sl).

<Tabs groupId="warehouse">

<TabItem value="snowflake" label="Snowflake" default>

Create a [trial Snowflake account](https://signup.snowflake.com/):

- Выберите редакцию Enterprise Snowflake с правами доступа ACCOUNTADMIN. При выборе облачного провайдера учитывайте потребности вашей организации и ознакомьтесь с разделом [Введение в облачные платформы](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms) в документации Snowflake.
- Выберите облачного провайдера и регион. Подойдут любые облачные провайдеры и регионы, поэтому выбирайте те, которые вам удобнее.

Вы также можете сначала пройти [руководство по быстрому старту с <Constant name="dbt" /> и Snowflake](/guides/snowflake), если предпочитаете более подробное пошаговое руководство, посвящённое только Snowflake.

### Create a Snowflake SQL file

<CreateSnowflakeSqlFile />

### Настройка и загрузка данных в Snowflake {#set-up-and-load-data-into-snowflake}

<LoadData/>

<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-snowflake-confirm.jpg" width="90%" title="На изображении показано подтверждение Snowflake об успешной загрузке данных в редакторе." />

### Подключение dbt к Snowflake

Есть два способа подключить <Constant name="dbt" /> к Snowflake. Первый — Partner Connect, который упрощает настройку и позволяет создать учетную запись <Constant name="dbt" /> непосредственно из вашей новой пробной учетной записи Snowflake. Второй — создать учетную запись <Constant name="dbt" /> отдельно и самостоятельно настроить подключение к Snowflake (подключиться вручную). Если вы хотите быстро приступить к работе, dbt Labs рекомендует использовать Partner Connect. Если вы хотите с самого начала настроить всё под свои требования и ознакомиться с процессом настройки <Constant name="dbt" />, dbt Labs рекомендует подключиться вручную.

<Tabs>
<TabItem value="partner-connect" label="Использовать Partner Connect" default>

С помощью Partner Connect вы можете создать полноценный аккаунт dbt с [подключением к Snowflake](/docs/platform/connect-data-platform/connect-snowflake), [управляемым репозиторием](/docs/platform/git/managed-repository), [окружениями](/docs/build/custom-schemas#managing-environments) и учетными данными.

1. На левой боковой панели интерфейса Snowflake перейдите в **Admin > Partner Connect**. Найдите плитку dbt в разделе **Data Integration** или воспользуйтесь строкой поиска, чтобы найти dbt. Нажмите на плитку, чтобы подключиться к dbt.

    <Lightbox src="/img/snowflake_tutorial/snowflake_partner_connect_box.png" width="60%" title="Окно Snowflake Partner Connect" />

    Если вы используете классическую версию интерфейса Snowflake, вы можете нажать кнопку **Partner Connect** в верхней панели аккаунта. Затем нажмите плитку dbt, чтобы открыть окно подключения.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_partner_connect.png" title="Классический интерфейс Snowflake — Partner Connect" />

2. Во всплывающем окне **Connect to dbt** найдите опцию **Optional Grant** и выберите базы данных **RAW** и **ANALYTICS**. Это предоставит доступ новой роли пользователя dbt к каждой выбранной базе данных. Затем нажмите **Connect**.

<DocCarousel slidesPerView={1}>

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_connection_box.png" title="Классический интерфейс Snowflake — окно подключения" />

    <Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_connection_box.png" title="Новый интерфейс Snowflake — окно подключения" />

</DocCarousel>

3. Нажмите **Activate**, когда появится всплывающее окно: 

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_activation_window.png" title="Классический интерфейс Snowflake — окно активации" />

<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_activation_window.png" title="Новый интерфейс Snowflake — окно активации" />

</DocCarousel>

4. После загрузки новой вкладки вы увидите форму. Если вы уже создали учетную запись <Constant name="dbt" />, вам будет предложено указать имя учетной записи. Если вы еще не создали учетную запись, вам будет предложено указать имя учетной записи и пароль.

5. После того как вы заполните форму и нажмете **Complete Registration**, вы автоматически войдете в <Constant name="dbt" />.

6. Нажмите на имя аккаунта в левом меню и выберите **Account settings**, выберите проект "Partner Connect Trial" и в таблице overview выберите **snowflake**. Нажмите **Edit** и обновите поле **Database** на `analytics`, а поле **Warehouse** на `transforming`.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_project_overview.png" title="dbt — обзор проекта Snowflake" />

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_update_database_and_warehouse.png" title="dbt — Обновление базы данных и warehouse" />

</DocCarousel>

</TabItem>
<TabItem value="manual-connect" label="Подключить вручную">


1. Создайте новый проект в <Constant name="dbt" />. Перейдите в **Account settings** (нажав на название своего аккаунта в меню слева) и нажмите **+ New Project**.
2. Введите название проекта и нажмите **Continue**.
3. В разделе **Configure your development environment** откройте раскрывающееся меню **Connection** и выберите **Add new connection**. Вы перейдёте к настройкам подключения. 
4. В разделе **Type** выберите **Snowflake**.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_setup_snowflake_connection_start.png" title="dbt — Выбор подключения Snowflake" />

5. Укажите параметры подключения к Snowflake в разделе **Settings**: 
    * **Account:** Определите идентификатор аккаунта по URL пробного аккаунта Snowflake, удалив `snowflakecomputing.com`. Порядок компонентов идентификатора аккаунта зависит от версии Snowflake. Например, URL классической консоли Snowflake может выглядеть так: `oq65696.west-us-2.azure.snowflakecomputing.com`. URL AppUI или Snowsight может выглядеть так: `snowflakecomputing.com/west-us-2.azure/oq65696`. В обоих примерах идентификатор вашего аккаунта будет таким: `oq65696.west-us-2.azure`. Подробнее см. в разделе [Идентификаторы аккаунтов](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html) документации Snowflake.  

        <Snippet path="snowflake-acct-name" />
    
    * **Role:** Пока оставьте поле пустым. Позже вы сможете указать здесь роль Snowflake по умолчанию.
    * **Database:** `analytics`. Этот параметр указывает dbt создавать новые модели в базе данных analytics.
    * **Warehouse:** `transforming`. Этот параметр указывает dbt использовать виртуальный склад transforming, созданный ранее.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_account_settings.png" title="dbt — Настройки аккаунта Snowflake" />

6. Нажмите **Save**.
7. Настройте свои личные учетные данные пользователя, перейдя в **Your profile** > **Credentials**.
8. Выберите проект, использующий подключение к Snowflake. 
9. Нажмите ссылку **configure your development environment and add a connection**. Откроется страница, на которой можно ввести свои личные учетные данные пользователя.
10. Введите свои учетные данные для Snowflake в разделе **User credentials**: 
    * **Username:** Имя пользователя, которое вы создали для Snowflake. Это не ваш адрес электронной почты; обычно оно состоит из вашего имени и фамилии, записанных слитно.
    * **Password:** Пароль, который вы задали при создании учетной записи Snowflake.
    * **Schema:** Обратите внимание, что имя схемы уже создано автоматически. По принятому соглашению оно имеет вид `dbt_<first-initial><last-name>`. Эта схема напрямую связана с вашей средой разработки, и именно в ней будут создаваться ваши модели при запуске dbt в <Constant name="studio_ide" />.
    * **Target name:** Оставьте значение по умолчанию.
    * **Threads:** Оставьте значение 4. Это количество одновременных подключений, которые <Constant name="dbt" /> будет устанавливать для параллельного построения моделей.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt — учетные данные пользователя Snowflake" />

11. Нажмите **Test connection**. Это позволит проверить, что <Constant name="dbt" /> может получить доступ к вашей учетной записи Snowflake.
12. Если проверка прошла успешно, нажмите **Save**, чтобы завершить настройку. Если проверка завершилась ошибкой, вам может потребоваться проверить настройки Snowflake и учетные данные.

</TabItem>
</Tabs>

</TabItem>

<TabItem value="bq" label="BigQuery">

Откройте новую вкладку и выполните следующие шаги, чтобы настроить учетную запись, подготовить примеры данных и подключить dbt:

- [Шаг 2: Создание нового проекта GCP](/guides/bigquery?step=2)
- [Шаг 3: Создание наборов данных BigQuery](/guides/bigquery?step=3)
- [Шаг 4: Создание учетных данных BigQuery](/guides/bigquery?step=4)
- [Шаг 5: Подключение <Constant name="dbt" /> к BigQuery](/guides/bigquery?step=5)

На шаге 3 создайте в своем проекте оба набора данных: `jaffle_shop` и `stripe`. Таблицы с примерами данных, к которым вы будете обращаться в запросах, находятся в общедоступном проекте `dbt-tutorial`.

</TabItem>

<TabItem value="databricks" label="Databricks">

Откройте новую вкладку и выполните следующие шаги, чтобы настроить учетную запись, подготовить примеры данных и подключить dbt:

- [Шаг 2: Создание рабочего пространства Databricks](/guides/databricks?step=2)
- [Шаг 3: Загрузка данных](/guides/databricks?step=3)
- [Шаг 4: Подключение <Constant name="dbt" /> к Databricks](/guides/databricks?step=4)
- [Шаг 5: Настройка интеграции через Partner Connect](/guides/databricks?step=5)

На шаге 4 объясняются различия между подключением через Partner Connect и подключением вручную. Шаг 5 посвящен Partner Connect. Если вы подключаетесь вручную, воспользуйтесь документацией Databricks, ссылка на которую приведена на этом шаге.

</TabItem>

<TabItem value="redshift" label="Redshift">

Откройте новую вкладку и выполните следующие шаги, чтобы настроить учетную запись, подготовить примеры данных и подключить dbt:

- [Шаг 2: Создание кластера Redshift](/guides/redshift?step=2)
- [Шаг 3: Загрузка данных](/guides/redshift?step=3)
- [Шаг 4: Подключение <Constant name="dbt" /> к Redshift](/guides/redshift?step=4)

</TabItem>

<TabItem value="starburst" label="Starburst Galaxy">

Откройте новую вкладку и выполните следующие шаги, чтобы настроить учетную запись, подготовить примеры данных и подключить dbt:

- [Шаг 2: Загрузка данных в бакет Amazon S3](/guides/starburst-galaxy?step=2)
- [Шаг 3: Подключение Starburst Galaxy к бакету Amazon S3](/guides/starburst-galaxy?step=3)
- [Шаг 4: Создание таблиц с помощью Starburst Galaxy](/guides/starburst-galaxy?step=4)
- [Шаг 5: Подключение <Constant name="dbt" /> к Starburst Galaxy](/guides/starburst-galaxy?step=5)

</TabItem>

</Tabs>

## Настройка проекта dbt

В этом разделе вы настроите репозиторий, управляемый <Constant name="dbt" />, и инициализируете свой проект dbt, чтобы приступить к разработке.

### Настройка репозитория, управляемого dbt 
Если вы использовали Partner Connect в Snowflake или Databricks, можете перейти к [инициализации проекта dbt](#build-your-dbt-project). Partner Connect предоставляет [управляемый репозиторий](/docs/platform/git/managed-repository). В противном случае вам потребуется настроить подключение к репозиторию. 

<Snippet path="tutorial-managed-repo" />

### Инициализация проекта dbt
В этом руководстве предполагается, что вы используете [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) для разработки проекта dbt, определения метрик, а также выполнения запросов к метрикам и предварительного просмотра результатов с помощью [команд MetricFlow](/docs/build/metricflow-commands).

Теперь, когда репозиторий настроен, вы можете инициализировать проект и начать разработку в <Constant name="dbt" /> с помощью <Constant name="studio_ide" />:

1. Нажмите **Start developing in the <Constant name="studio_ide" />**. Первый запуск проекта может занять несколько минут: за это время устанавливается подключение к git, клонируется репозиторий и проверяется подключение к хранилищу данных.
2. Над деревом файлов слева нажмите **Initialize your project**. Это создаст структуру папок с примерами моделей.
3. Создайте первый коммит, нажав **Commit and sync**. Используйте сообщение коммита `initial commit`. Это создаст первый коммит в управляемом репозитории и позволит создать ветку, в которой вы сможете добавлять новый код dbt.
4. Теперь вы можете напрямую выполнять запросы к данным в хранилище и запускать `dbt run`. Попробуйте сделать это сейчас:
    - Удалите папку models/examples в **File <Constant name="catalog" />**.
    - Нажмите **+ Create new file**, добавьте в новый файл запрос для своего хранилища данных и нажмите **Save as**, чтобы сохранить новый файл:

<Tabs groupId="warehouse">

<TabItem value="snowflake" label="Snowflake" default>

```sql
select * from raw.jaffle_shop.customers
```

</TabItem>

<TabItem value="bq" label="BigQuery">

```sql
select * from `dbt-tutorial.jaffle_shop.customers`
```

</TabItem>

<TabItem value="databricks" label="Databricks">

```sql
select * from default.jaffle_shop_customers
```

</TabItem>

<TabItem value="redshift" label="Redshift">

```sql
select * from jaffle_shop.customers
```

</TabItem>

<TabItem value="starburst" label="Starburst Galaxy">

```sql
select * from dbt_quickstart.jaffle_shop.jaffle_shop_customers
```

</TabItem>

</Tabs>
    - В строке команд внизу введите dbt run и нажмите Enter. Должно появиться сообщение dbt run succeeded.

## Сборка dbt-проекта {#build-your-dbt-project}
Следующий шаг — собрать ваш проект. Это включает добавление sources, staging-моделей, бизнес-определенных сущностей и пакетов в проект.

### Добавьте источники {#add-sources}

[Sources](/docs/build/sources) в dbt — это таблицы с сырыми данными, которые вы будете преобразовывать. Организуя определения sources, вы документируете происхождение данных. Это также делает проект и трансформации более надежными, структурированными и понятными.

В <Constant name="studio_ide" /> есть два варианта работы с файлами:

- **Создать новую ветку (рекомендуется):** Создайте новую ветку для редактирования файлов и фиксации изменений. Перейдите в раздел **Version Control** на левой боковой панели и нажмите **Create branch**.
- **Редактировать файлы в защищённой основной ветке:** Выберите этот вариант, если предпочитаете редактировать, форматировать файлы, проверять их линтером и выполнять команды dbt непосредственно в основной ветке git. <Constant name="studio_ide" /> не позволяет фиксировать изменения в защищённой ветке, поэтому вам будет предложено зафиксировать изменения в новой ветке.

Назовите новую ветку `build-project`.

1. Наведите курсор на директорию `models` и нажмите меню с тремя точками (**...**), затем выберите **Create file**.
2. Назовите файл `staging/jaffle_shop/src_jaffle_shop.yml`, затем нажмите **Create**.
3. Скопируйте следующий текст в файл и нажмите **Save**.

<Tabs groupId="warehouse">

<TabItem value="snowflake" label="Snowflake" default>

<File name='models/staging/jaffle_shop/src_jaffle_shop.yml'>

```yaml
sources:
  - name: jaffle_shop
    database: raw
    schema: jaffle_shop
    tables:
      - name: customers
      - name: orders
```

</File>

</TabItem>

<TabItem value="bq" label="BigQuery">

<File name='models/staging/jaffle_shop/src_jaffle_shop.yml'>

```yaml
sources:
  - name: jaffle_shop
    database: dbt-tutorial
    schema: jaffle_shop
    tables:
      - name: customers
      - name: orders
```

</File>

</TabItem>

<TabItem value="redshift" label="Redshift">

<File name='models/staging/jaffle_shop/src_jaffle_shop.yml'>

```yaml
sources:
  - name: jaffle_shop
    schema: jaffle_shop
    tables:
      - name: customers
      - name: orders
```

</File>

</TabItem>

<TabItem value="databricks" label="Databricks">

<File name='models/staging/jaffle_shop/src_jaffle_shop.yml'>

```yaml
sources:
  - name: jaffle_shop
    schema: default
    tables:
      - name: customers
        identifier: jaffle_shop_customers
      - name: orders
        identifier: jaffle_shop_orders
```

</File>

</TabItem>

<TabItem value="starburst" label="Starburst Galaxy">

<File name='models/staging/jaffle_shop/src_jaffle_shop.yml'>

```yaml
sources:
  - name: jaffle_shop
    database: dbt_quickstart
    schema: jaffle_shop
    tables:
      - name: customers
        identifier: jaffle_shop_customers
      - name: orders
        identifier: jaffle_shop_orders
```

</File>

</TabItem>

</Tabs>

:::tip
В source-файле вы также можете использовать кнопку **Generate model**, чтобы создать отдельный файл модели для каждого source. Это создаст новый файл в директории `models` с указанным именем source и заполнит его SQL-кодом определения source.
:::

4. Наведите курсор на директорию `models` и нажмите меню с тремя точками (**...**), затем выберите **Create file**.
5. Назовите файл `staging/stripe/src_stripe.yml`, затем нажмите **Create**.
6. Скопируйте следующий текст в файл и нажмите **Save**.

<Tabs groupId="warehouse">

<TabItem value="snowflake" label="Snowflake" default>

<File name='models/staging/stripe/src_stripe.yml'>

```yaml
sources:
  - name: stripe
    database: raw
    schema: stripe
    tables:
      - name: payment
```

</File>

</TabItem>

<TabItem value="bq" label="BigQuery">

<File name='models/staging/stripe/src_stripe.yml'>

```yaml
sources:
  - name: stripe
    database: dbt-tutorial
    schema: stripe
    tables:
      - name: payment
```

</File>

</TabItem>

<TabItem value="redshift" label="Redshift">

<File name='models/staging/stripe/src_stripe.yml'>

```yaml
sources:
  - name: stripe
    schema: stripe
    tables:
      - name: payment
```

</File>

</TabItem>

<TabItem value="databricks" label="Databricks">

<File name='models/staging/stripe/src_stripe.yml'>

```yaml
sources:
  - name: stripe
    schema: default
    tables:
      - name: payment
        identifier: stripe_payments
```

</File>

</TabItem>

<TabItem value="starburst" label="Starburst Galaxy">

<File name='models/staging/stripe/src_stripe.yml'>

```yaml
sources:
  - name: stripe
    database: dbt_quickstart
    schema: jaffle_shop
    tables:
      - name: payment
        identifier: stripe_payments
```

</File>

</TabItem>

</Tabs>

### Добавьте модели слоя staging
[Модели слоя staging](/best-practices/how-we-structure/2-staging) — это первый этап преобразования данных в dbt. Они очищают и подготавливают исходные данные для более сложных преобразований и анализа.

SQL-код моделей слоя staging использует `source()`, поэтому в нём используются имена из только что добавленного YAML-файла. Например, в BigQuery это указывает на `dbt-tutorial.jaffle_shop.customers`. В Snowflake — на `raw.jaffle_shop.customers`. Если на вашей платформе используется другое имя таблицы, оно уже указано в YAML-файле.

Выполните следующие шаги, чтобы добавить модели слоя staging в свой проект.

1. В подкаталоге `jaffle_shop` создайте файл `stg_customers.sql`. Либо вы можете использовать кнопку **Generate model**, чтобы создать отдельный файл модели для каждого source.
2. Скопируйте следующий запрос в файл и нажмите **Save**.

<File name='models/staging/jaffle_shop/stg_customers.sql'>

```sql
  select
   id as customer_id,
   first_name,
   last_name
  from {{ source('jaffle_shop', 'customers') }}
```

</File>

3. В том же подкаталоге `jaffle_shop` создайте файл `stg_orders.sql`.
4. Скопируйте следующий запрос в файл и нажмите **Save**.

<File name='models/staging/jaffle_shop/stg_orders.sql'>

```sql
  select
    id as order_id,
    user_id as customer_id,
    order_date,
    status
  from {{ source('jaffle_shop', 'orders') }}
```

</File>

5. В подкаталоге `stripe` создайте файл `stg_payments.sql`.
6. Скопируйте следующий запрос в файл и нажмите **Save**.

<Tabs groupId="warehouse">

<TabItem value="snowflake" label="Snowflake" default>

<File name='models/staging/stripe/stg_payments.sql'>

```sql
select
   id as payment_id,
   orderid as order_id,
   paymentmethod as payment_method,
   status,
   -- amount is stored in cents, convert it to dollars
   amount / 100 as amount,
   created as created_at
from {{ source('stripe', 'payment') }}
```

</File>

</TabItem>

<TabItem value="bq" label="BigQuery">

<File name='models/staging/stripe/stg_payments.sql'>

```sql
select
   id as payment_id,
   orderid as order_id,
   paymentmethod as payment_method,
   status,
   -- сумма хранится в центах, преобразуем её в доллары
   amount / 100 as amount,
   created as created_at
from {{ source('stripe', 'payment') }}
```

</File>

</TabItem>

<TabItem value="redshift" label="Redshift">

<File name='models/staging/stripe/stg_payments.sql'>

```sql
select
   id as payment_id,
   orderid as order_id,
   paymentmethod as payment_method,
   status,
   -- сумма хранится в центах, преобразуем её в доллары
   amount / 100 as amount,
   created as created_at
from {{ source('stripe', 'payment') }}
```

</File>

</TabItem>

<TabItem value="databricks" label="Databricks">

<File name='models/staging/stripe/stg_payments.sql'>

```sql
select
   id as payment_id,
   orderid as order_id,
   paymentmethod as payment_method,
   status,
   -- сумма хранится в центах, преобразуем её в доллары
   amount / 100 as amount,
   created as created_at
from {{ source('stripe', 'payment') }}
```

</File>

</TabItem>

<TabItem value="starburst" label="Starburst Galaxy">

<File name='models/staging/stripe/stg_payments.sql'>

```sql
select
   id as payment_id,
   order_id,
   paymentmethod as payment_method,
   status,
   -- сумма хранится в центах, преобразуем её в доллары
   amount / 100 as amount,
   created as created_at
from {{ source('stripe', 'payment') }}
```

</File>

</TabItem>

</Tabs>

7. Введите `dbt run` в командной строке в нижней части экрана. Команда должна выполниться успешно, и вы увидите три модели.

### Добавьте бизнес-определенные сущности {#add-business-defined-entities}

Этот этап включает создание [моделей, которые служат entity layer (слоем сущностей) или concept layer (концептуальным слоем) вашего dbt-проекта](/best-practices/how-we-structure/4-marts), подготавливая данные для отчетности и анализа. Также он включает добавление [пакетов](/docs/build/packages) и [time spine MetricFlow](/docs/build/metricflow-time-spine), которые расширяют функциональность dbt.

Этот этап — [слой marts](/best-practices/how-we-structure/1-guide-overview#guide-structure-overview), который объединяет модульные части в широкое, насыщенное представление сущностей, важных для организации.

1. Создайте файл `models/marts/fct_orders.sql`.
2. Скопируйте следующий запрос в файл и нажмите **Save**.

<File name='models/marts/fct_orders.sql'>

```sql
with orders as  (
   select * from {{ ref('stg_orders' )}}
),


payments as (
   select * from {{ ref('stg_payments') }}
),


order_payments as (
   select
       order_id,
       sum(case when status = 'success' then amount end) as amount


   from payments
   group by 1
),


final as (


   select
       orders.order_id,
       orders.customer_id,
       orders.order_date,
       coalesce(order_payments.amount, 0) as amount


   from orders
   left join order_payments using (order_id)
)


select * from final

```

</File>

3. В директории `models/marts` создайте файл `dim_customers.sql`.
4. Скопируйте следующий запрос в файл и нажмите **Save**.

<File name='models/marts/dim_customers.sql'>

```sql
with customers as (
   select * from {{ ref('stg_customers')}}
),
orders as (
   select * from {{ ref('fct_orders')}}
),
customer_orders as (
   select
       customer_id,
       min(order_date) as first_order_date,
       max(order_date) as most_recent_order_date,
       count(order_id) as number_of_orders,
       sum(amount) as lifetime_value
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
       coalesce(customer_orders.number_of_orders, 0) as number_of_orders,
       customer_orders.lifetime_value
   from customers
   left join customer_orders using (customer_id)
)
select * from final
```

</File>

5. Создайте модель time spine для MetricFlow, следуя руководству [MetricFlow time spine guide](/guides/mf-time-spine?step=1). В этом руководстве показано, как создать и SQL-модель, и YAML-конфигурацию, необходимые для вычисления метрик на основе времени.

6. Введите `dbt run` в командной строке внизу экрана. Вы должны увидеть сообщение об успешном выполнении, а в деталях запуска — что dbt успешно собрал ваши модели.

## Создайте семантические модели {#create-semantic-models}

В этом разделе вы узнаете о [семантических моделях](/guides/sl-qs?step=5#about-semantic-models), [их компонентах](/guides/sl-qs?step=5#semantic-model-components) и [о том, как настроить временную шкалу (time spine)](/guides/sl-qs?step=5#configure-a-time-spine).

### О семантических моделях {#about-semantic-models}

<VersionBlock lastVersion="1.11">

[Семантические модели](/docs/build/semantic-models) содержат множество типов объектов (таких как сущности, меры и измерения), которые позволяют MetricFlow формировать запросы для определений метрик.

- Каждая semantic model находится в соотношении 1:1 с dbt-моделью SQL/Python.
- Каждая semantic model содержит (максимум) 1 primary или natural entity.
- Каждая semantic model содержит ноль, одну или несколько foreign или unique entities, используемых для связей с другими сущностями.
- Каждая semantic model также может содержать dimensions, measures и metrics. Именно это затем передается и запрашивается вашим downstream BI-инструментом.

В следующих шагах semantic models помогут вам определить, как интерпретировать данные, связанные с заказами (orders). Это включает entities (например, ID-колонки, которые служат ключами для объединения данных), dimensions (для группировки или фильтрации данных) и measures (для агрегаций данных).

1. В подкаталоге `metrics` создайте новый файл `fct_orders.yml`.

:::tip 
Убедитесь, что вы сохраняете все semantic models и metrics в директории, указанной в [`model-paths`](/reference/project-configs/model-paths) (или в ее поддиректории, например `models/semantic_models/`). Если сохранить их вне этого пути, файл `semantic_manifest.json` окажется пустым, и ваши semantic models или metrics не будут распознаны.
:::

2. Добавьте следующий код в только что созданный файл:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

[Семантические модели](/docs/build/semantic-models) содержат множество типов объектов (таких как сущности, простые метрики и измерения), которые позволяют MetricFlow формировать запросы на основе определений метрик.

- Каждая семантическая модель соответствует одной SQL-модели dbt (связь 1:1).
- Каждая семантическая модель содержит не более одной первичной или естественной сущности.
- Каждая семантическая модель содержит ноль, одну или несколько внешних или уникальных сущностей, используемых для связи с другими сущностями.
- Каждая семантическая модель также может содержать измерения, простые метрики и метрики. Именно эти объекты передаются в ваш BI-инструмент и используются им для выполнения запросов.

В следующих шагах семантические модели позволят вам определить, как интерпретировать данные о заказах. Они включают сущности (например, столбцы идентификаторов, служащие ключами для объединения данных), измерения (для группировки или фильтрации данных) и простые метрики (для агрегации данных).

1. В каталоге `models` создайте новый файл `fct_orders.yml`.

:::tip 
Обязательно сохраняйте все семантические модели и метрики в каталоге, указанном в [`model-paths`](/reference/project-configs/model-paths) (или в его подкаталоге, например `models/semantic_models/`). Если сохранить их за пределами этого пути, файл `semantic_manifest.json` окажется пустым, а ваши семантические модели или метрики не будут распознаны.
:::

2. Добавьте следующий код в только что созданный файл:

<File name='models/fct_orders.yml'>

```yaml
models:
  - name: fct_orders
    description: |
      Таблица фактов заказов. Уровень детализации этой таблицы — одна строка на заказ.
    semantic_model:
      enabled: true
      name: orders
      
    agg_time_dimension: order_date
```

</File>

</VersionBlock>

### Компоненты семантической модели {#semantic-model-components}

<VersionBlock lastVersion="1.11">

В следующих разделах подробнее рассматриваются [измерения](/docs/build/dimensions), [сущности](/docs/build/entities) и [меры](/docs/build/measures), а также показано, какую роль каждый из этих компонентов играет в семантических моделях.

- [Entities](#entities) выступают уникальными идентификаторами (например, ID-колонками), которые связывают данные из разных таблиц.
- [Dimensions](#dimensions) классифицируют и фильтруют данные, упрощая их организацию.
- [Measures](#measures) вычисляют показатели по данным, предоставляя ценные инсайты через агрегации.

</VersionBlock>

<VersionBlock firstVersion="1.12">

The following sections explain [dimensions](/docs/build/dimensions), [entities](/docs/build/entities), and [simple metrics](/docs/build/metrics-overview#simple-metrics) in more detail, showing how they each play a role in semantic models.

- [Entities](#entities) act as unique identifiers (like ID columns) that link data together from different tables.
- [Dimensions](#dimensions) categorize and filter data, making it easier to organize.
- [Simple metrics](#simple-metrics) calculates data using an aggregation function, providing valuable insights through aggregation.

</VersionBlock>

### Сущности {#entities}

[Сущности](/docs/build/semantic-models#entities) — это понятия реального бизнеса, которые служат основой вашей семантической модели. В наших semantic models это будут ID-колонки (например, `order_id`). Они будут выступать ключами для join с другими semantic models.

Добавьте entities в файл семантической модели `fct_orders.yml`:

<VersionBlock lastVersion="1.11">

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
    # Newly added
    entities: 
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name='models/fct_orders.yml'>

```yaml
models:
  - name: fct_orders
    semantic_model:
      enabled: true
      name: orders
      
    agg_time_dimension: order_date
    
    columns:
      # Сущности
      - name: order_id
        entity:
          type: primary
          name: order_id
      - name: customer_id
        entity:
          name: customer
          type: foreign
```

</File>

</VersionBlock>

### Измерения {#dimensions}

[Измерения](/docs/build/semantic-models#dimensions) — это способ группировать или фильтровать информацию по категориям или времени.

Добавьте dimensions в файл семантической модели `fct_orders.yml`:

<VersionBlock lastVersion="1.11">
<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
    entities:
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
    # Newly added
    dimensions:   
      - name: order_date
        type: time
        type_params:
          time_granularity: day
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name='models/fct_orders.yml'>

```yaml
models:
  - name: fct_orders
    semantic_model:
      enabled: true
      name: orders
      
    agg_time_dimension: order_date
    
    columns:
      # Сущности
      - name: order_id
        entity:
          type: primary
          name: order_id
      - name: customer_id
        entity:
          name: customer
          type: foreign
      # Недавно добавлено — измерения      
      - name: order_date
        granularity: day
        dimension:
          type: time
```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.11">

### Меры

[Measures](/docs/build/semantic-models#measures) — это агрегации, выполняемые над колонками в вашей модели. Часто вы будете использовать их как конечные метрики. Measures также могут служить строительными блоками для более сложных метрик.

Добавьте measures в файл семантической модели `fct_orders.yml`:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order.
    model: ref('fct_orders')
    entities:
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
    dimensions:
      - name: order_date
        type: time
        type_params:
          time_granularity: day
    # Newly added      
    measures:   
      - name: order_total
        description: The total amount for each order including taxes.
        agg: sum
        expr: amount
      - name: order_count
        expr: 1
        agg: sum
      - name: customers_with_orders
        description: Distinct count of customers placing orders
        agg: count_distinct
        expr: customer_id
      - name: order_value_p99 ## The 99th percentile order value
        expr: amount
        agg: percentile
        agg_params:
          percentile: 0.99
          use_discrete_percentile: True
          use_approximate_percentile: False
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

### Простые метрики {#simple-metrics}

[Простые метрики](/docs/build/simple) выполняют агрегацию (например, `sum`, `count`, `average` и т. д.) по одному полю вашей модели. Они заменяют понятие «меры» из предыдущих версий. Чтобы определить более сложные метрики, обратитесь к разделу [Определение метрик и добавление второй семантической модели](/guides/sl-qs?step=6).

Добавьте простые метрики в файл модели `fct_orders.yml`:

<File name='models/fct_orders.yml'>

```yaml
models:
  - name: fct_orders
    semantic_model:
      enabled: true
      name: orders
      
    agg_time_dimension: order_date
    
    columns:
      # Сущности
      - name: order_id
        entity:
          type: primary
          name: order_id
      - name: customer_id
        entity:
          name: customer
          type: foreign
      # Измерения      
      - name: order_date
        granularity: day
        dimension:
          type: time
      - name: amount
        dimension:
          type: categorical
          
    # Добавлено — простые метрики
    metrics:
      - name: order_total
        description: Общая сумма каждого заказа с учётом налогов
        type: simple
        label: Общая сумма заказа
        agg: sum
        expr: amount
      - name: order_count
        type: simple
        label: Количество заказов
        agg: sum
        expr: 1
      - name: customers_with_orders
        description: Количество уникальных клиентов, размещающих заказы
        type: simple
        label: Клиенты с заказами
        agg: count_distinct
        expr: customer_id
      - name: order_value_p99
        type: simple
        label: 99-й процентиль стоимости заказа
        agg: percentile
        expr: amount
        percentile: 99.0
        percentile_type: discrete
```

</File>

</VersionBlock>

### Настройка временной оси {#configure-a-time-spine}

Чтобы обеспечить точные агрегации по времени, необходимо настроить [time spine](/docs/build/metricflow-time-spine). Time spine позволяет корректно рассчитывать метрики на разных временных гранулярностях.

Следуйте руководству [MetricFlow time spine guide](/guides/mf-time-spine?step=1) с полными пошаговыми инструкциями по созданию и настройке модели time spine. В этом руководстве приведены актуальные best practices и исключены устаревшие конфигурации.

## Определите метрики и добавьте вторую семантическую модель {#define-metrics-and-add-a-second-semantic-model}

В этом разделе вы [определите метрики](#define-metrics) и [добавите в проект вторую семантическую модель](#add-second-semantic-model-to-your-project).

### Определите метрики {#define-metrics}

[Метрики](/docs/build/metrics-overview) — это язык, на котором говорят бизнес-пользователи, и способ измерять эффективность бизнеса. Метрика — это агрегация над колонкой в вашем warehouse, которую вы обогащаете измерениями (dimensional cuts).

Существует несколько типов метрик, которые можно настроить:

- [Метрики конверсии](/docs/build/conversion) &mdash; Отслеживают, когда для сущности происходят базовое событие и последующее событие конверсии в пределах заданного периода времени.
- [Накопительные метрики](/docs/build/cumulative) &mdash; Агрегируют меру в пределах заданного окна. Если окно не указано, мера накапливается за весь период, за который записаны данные. Обратите внимание: перед добавлением накопительных метрик необходимо создать модель временной оси (time spine).
- [Производные метрики](/docs/build/metrics-overview#derived-metrics) &mdash; Позволяют выполнять вычисления на основе метрик.
- [Простые метрики](/docs/build/metrics-overview#simple-metrics) &mdash; Напрямую ссылаются на выражение для одного столбца в семантической модели, без участия дополнительных столбцов. Они представляют собой агрегации по столбцу в вашей платформе данных и могут фильтроваться по одному или нескольким измерениям.
- [Метрики отношений](/docs/build/metrics-overview#ratio-metrics) &mdash; Используют метрику в числителе и метрику в знаменателе. Строку ограничения можно применить как к числителю и знаменателю одновременно, так и отдельно к числителю или знаменателю.

После создания семантических моделей можно приступить к созданию метрик, ссылаясь на уже созданные <VersionBlock lastVersion="1.11">меры</VersionBlock><VersionBlock firstVersion="1.12">простые метрики</VersionBlock>:

1. Добавьте метрики в файл `fct_orders.yml`:

:::tip 
Убедитесь, что вы сохраняете все semantic models и метрики в директории, указанной в [`model-paths`](/reference/project-configs/model-paths) (или в её поддиректории, например `models/semantic_models/`). Если сохранить их вне этого пути, файл `semantic_manifest.json` окажется пустым, и ваши semantic models или метрики не будут распознаны.
:::

<VersionBlock lastVersion="1.11">

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Order fact table. This table’s grain is one row per order
    model: ref('fct_orders')
    entities:
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
    dimensions:
      - name: order_date
        type: time
        type_params:
          time_granularity: day
    measures:
      - name: order_total
        description: The total amount for each order including taxes.
        agg: sum
        expr: amount
      - name: order_count
        expr: 1
        agg: sum
      - name: customers_with_orders
        description: Distinct count of customers placing orders
        agg: count_distinct
        expr: customer_id
      - name: order_value_p99
        expr: amount
        agg: percentile
        agg_params:
          percentile: 0.99
          use_discrete_percentile: True
          use_approximate_percentile: False
# Newly added          
metrics: 
  # Simple type metrics
  - name: "order_total"
    description: "Sum of orders value"
    type: simple
    label: "order_total"
    type_params:
      measure:
        name: order_total
  - name: "order_count"
    description: "number of orders"
    type: simple
    label: "order_count"
    type_params:
      measure:
        name: order_count
  - name: large_orders
    description: "Count of orders with order total over 20."
    type: simple
    label: "Large Orders"
    type_params:
      measure:
        name: order_count
    filter: |
      {{ Metric('order_total', group_by=['order_id']) }} >=  20
  # Ratio type metric
  - name: "avg_order_value"
    label: "avg_order_value"
    description: "average value of each order"
    type: ratio
    type_params:
      numerator: 
        name: order_total
      denominator: 
        name: order_count
  # Cumulative type metrics
  - name: "cumulative_order_amount_mtd"
    label: "cumulative_order_amount_mtd"
    description: "The month to date value of all orders"
    type: cumulative
    type_params:
      measure:
        name: order_total
      cumulative_type_params:
        grain_to_date: month
  # Derived metric
  - name: "pct_of_orders_that_are_large"
    label: "pct_of_orders_that_are_large"
    description: "percent of orders that are large"
    type: derived
    type_params:
      expr: large_orders/order_count
      metrics:
        - name: large_orders
        - name: order_count
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name='models/fct_orders.yml'>

```yaml
models:
  - name: fct_orders
    semantic_model:
      enabled: true
      name: orders
      
    agg_time_dimension: order_date
    
    columns:
      - name: order_id
        entity:
          type: primary
          name: order_id
      - name: customer_id
        entity:
          name: customer
          type: foreign
      - name: order_date
        granularity: day
        dimension:
          type: time
      - name: amount
        dimension:
          type: categorical
          
    metrics:
      # Метрики типа simple
      - name: order_total
        description: Суммарная стоимость заказов
        type: simple
        label: Общая стоимость заказов
        agg: sum
        expr: amount
      - name: order_count
        description: Количество заказов
        type: simple
        label: Количество заказов
        agg: sum
        expr: 1
      - name: customers_with_orders
        description: Количество уникальных клиентов, разместивших заказы
        type: simple
        label: Клиенты с заказами
        agg: count_distinct
        expr: customer_id
      - name: large_orders
        description: Количество заказов с общей стоимостью более 20
        type: simple
        label: Крупные заказы
        agg: sum
        expr: 1
        filter: |
          {{ Dimension('order_id__amount') }} >= 20
      # Метрика типа ratio
      - name: avg_order_value
        label: Средняя стоимость заказа
        description: Средняя стоимость одного заказа
        type: ratio
        numerator: order_total
        denominator: order_count
      # Метрики типа cumulative
      - name: cumulative_order_amount_mtd
        label: Накопленная сумма заказов с начала месяца
        description: Стоимость всех заказов с начала текущего месяца
        type: cumulative
        grain_to_date: month
        input_metric: order_total
      # Производная метрика
      - name: pct_of_orders_that_are_large
        label: Процент крупных заказов
        description: Процент заказов, относящихся к крупным
        type: derived
        expr: large_orders / order_count
        input_metrics:
          - name: large_orders
          - name: order_count
```

</File>

</VersionBlock>

### Добавьте вторую семантическую модель в свой проект {#add-second-semantic-model-to-your-project}

<VersionBlock lastVersion="1.11">
Отличная работа, вы успешно создали свою первую семантическую модель! В ней есть все необходимые элементы: сущности, измерения, меры и метрики.

</VersionBlock>

<VersionBlock firstVersion="1.12">
Отличная работа, вы успешно создали свою первую семантическую модель! В ней есть все необходимые элементы: сущности, измерения и метрики.
</VersionBlock>

Давайте расширим аналитические возможности вашего проекта, добавив ещё одну семантическую модель в другую модель витрины данных, например в `dim_customers.yml`.

После настройки модели orders:

1. Создайте файл `dim_customers.yml`.
2. Скопируйте следующий код в файл и нажмите **Сохранить**.

<VersionBlock lastVersion="1.11">

<File name='models/metrics/dim_customers.yml'>

```yaml
semantic_models:
  - name: customers
    defaults:
      agg_time_dimension: most_recent_order_date
    description: |
      semantic model for dim_customers
    model: ref('dim_customers')
    entities:
      - name: customer
        expr: customer_id
        type: primary
    dimensions:
      - name: customer_name
        type: categorical
        expr: first_name
      - name: first_order_date
        type: time
        type_params:
          time_granularity: day
      - name: most_recent_order_date
        type: time
        type_params:
          time_granularity: day
    measures:
      - name: count_lifetime_orders
        description: Total count of orders per customer.
        agg: sum
        expr: number_of_orders
      - name: lifetime_spend
        agg: sum
        expr: lifetime_value
        description: Gross customer lifetime spend inclusive of taxes.
      - name: customers
        expr: customer_id
        agg: count_distinct

metrics:
  - name: "customers_with_orders"
    label: "customers_with_orders"
    description: "Unique count of customers placing orders"
    type: simple
    type_params:
      measure:
        name: customers
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.12">

<File name='models/dim_customers.yml'>

```yaml
models:
  - name: dim_customers
    semantic_model:
      enabled: true
      name: customers
      
    agg_time_dimension: most_recent_order_date
    
    columns:
      # Entities
      - name: customer_id
        entity:
          name: customer
          type: primary
      # Dimensions
      - name: first_name
        dimension:
          name: customer_name
          type: categorical
      - name: first_order_date
        granularity: day
        dimension:
          type: time
      - name: most_recent_order_date
        granularity: day
        dimension:
          type: time
      - name: number_of_orders
        dimension:
          type: categorical
      - name: lifetime_value
        dimension:
          type: categorical
          
    # Metrics
    metrics:
      - name: customers_with_orders
        label: Customers with orders
        description: Unique count of customers placing orders
        type: simple
        agg: count_distinct
        expr: customer_id
      - name: count_lifetime_orders
        description: Total count of orders per customer
        type: simple
        label: Lifetime orders
        agg: sum
        expr: number_of_orders
      - name: lifetime_spend
        description: Gross customer lifetime spend inclusive of taxes
        type: simple
        label: Lifetime spend
        agg: sum
        expr: lifetime_value
```

</File>

</VersionBlock>

Эта семантическая модель использует простые метрики для анализа показателей клиентов и делает акцент на таких измерениях клиентов, как имя, тип и даты заказов. Её особенность — анализ поведения клиентов, их пожизненной ценности и закономерностей оформления заказов.

## Тестируйте и запрашивайте метрики {#test-and-query-metrics}

<!-- Приведенные ниже snippets (или reusables) можно найти в репозитории документации по следующим путям:

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-test-and-query-metrics.md
-->

<TestQuery />

## Запустите production job {#run-a-production-job}

<!-- Приведенные ниже snippets (или reusables) можно найти в репозитории документации по следующим путям:

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-run-prod-job.md
-->

<RunProdJob/>


## Администрирование Semantic Layer {#administer-the-semantic-layer}

В этом разделе вы узнаете, как добавить учетные данные и создать service tokens, чтобы начать выполнять запросы к dbt <Constant name="semantic_layer" />. Раздел охватывает следующие темы:

- [Выбор окружения](#1-select-environment)
- [Настройка учетных данных и создание токенов](#2-configure-credentials-and-create-tokens)
- [Просмотр деталей подключения](#3-view-connection-detail)
- [Добавление дополнительных учетных данных](#2-configure-credentials-and-create-tokens)
- [Удаление конфигурации](#delete-configuration)

<!-- Приведенные ниже snippets (или reusables) можно найти в репозитории документации по следующим путям:

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_new-sl-setup.md
-->

<SlSetUp/>

## Запросы к Semantic Layer {#query-the-semantic-layer}

Эта страница подскажет, как подключиться и использовать следующие интеграции для выполнения запросов к вашим метрикам:

- [Подключение и запросы через Google Sheets](#connect-and-query-with-google-sheets)
- [Подключение и запросы через Hex](#connect-and-query-with-hex)
- [Подключение и запросы через Sigma](#connect-and-query-with-sigma)
  
<Constant name="semantic_layer" /> позволяет подключаться к вашим метрикам и запрашивать их с помощью различных доступных инструментов, таких как [PowerBI](/docs/platform-integrations/semantic-layer/power-bi), [Google Sheets](/docs/platform-integrations/semantic-layer/gsheets), [Hex](https://learn.hex.tech/docs/connect-to-data/data-connections/dbt-integration#dbt-semantic-layer-integration), [Microsoft Excel](/docs/platform-integrations/semantic-layer/excel), [Tableau](/docs/platform-integrations/semantic-layer/tableau) и других. 

Запрашивайте метрики с помощью других инструментов, таких как [встроенные интеграции](/docs/platform-integrations/avail-sl-integrations), [API <Constant name="semantic_layer" />](/docs/dbt-apis/sl-api-overview) и [экспорт](/docs/use-dbt-semantic-layer/exports), чтобы предоставлять доступ к таблицам метрик и измерений на вашей платформе данных и создавать собственные интеграции.

### Подключение и запросы через Google Sheets {#connect-and-query-with-google-sheets}

<!-- Приведенный ниже snippet для gsheets (или reusables) можно найти в репозитории документации по следующему пути:

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-connect-and-query-api.md
-->

<ConnectQueryAPI/>

### Подключение и запросы через Hex {#connect-and-query-with-hex}
В этом разделе описано, как использовать интеграцию Hex для запросов к вашим метрикам через Hex. Выберите подходящую вкладку в зависимости от способа подключения:

<Tabs>
<TabItem value="partner-connect" label="Запросы к Semantic Layer через Hex" default>

1. Перейдите на [страницу входа в Hex](https://app.hex.tech/login). 
2. Войдите в аккаунт или создайте его (если у вас его ещё нет). 
  - Вы можете создать аккаунт для бесплатного пробного использования Hex с рабочим адресом электронной почты или адресом в домене .edu.
3. В левом верхнем углу страницы нажмите на значок **HEX**, чтобы перейти на главную страницу.
4. Затем нажмите кнопку **+ New project** в правом верхнем углу.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/hex_new.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>
5. В меню слева выберите **Data browser**. Затем выберите **Add a data connection**. 
6. Выберите платформу данных, соответствующую вашему проекту dbt (Snowflake, BigQuery, Redshift или Databricks). Укажите название и описание подключения. Для этого подключения также нужно включить dbt Semantic Layer. Запросы к метрикам выполняются через dbt, а не с использованием имени пользователя и пароля базы данных. В настоящее время Hex поддерживает Semantic Layer для этих четырёх типов подключений. Подробнее см. в разделе [Интеграция Hex с dbt](https://learn.hex.tech/docs/connect-to-data/data-connections/dbt-integration).
<Lightbox src="/img/docs/dbt-platform/semantic-layer/hex_new_data_connection.png" width="50%" title="Выберите 'Data browser', затем 'Add a data connection'. Выберите тип хранилища, соответствующий вашему проекту dbt."/>
7. В разделе **Integrations** переведите переключатель dbt вправо, чтобы включить интеграцию с dbt.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/hex_dbt_toggle.png" width="50%" title="Нажмите на переключатель dbt, чтобы включить интеграцию. "/>

8. Укажите следующие сведения:
   * Выберите версию dbt 1.6 или выше
   * Введите идентификатор среды (Environment ID) 
   * Введите сервисный или персональный токен 
   * Обязательно включите переключатель **Use <Constant name="semantic_layer" />**. Благодаря этому все запросы будут направляться через dbt.
   * Нажмите **Create connection** в правом нижнем углу.
9. Наведите указатель на **More** в меню, показанном на следующем изображении, и выберите **<Constant name="semantic_layer" />**.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/hex_make_sl_cell.png" width="90%" title="Наведите указатель на 'More' в меню и выберите 'dbt Semantic Layer'."/>

10. Теперь вы можете выполнять запросы к метрикам в Hex! Попробуйте:
    - Создайте новую ячейку и выберите метрику.
    - Отфильтруйте ее по одному или нескольким измерениям.
    - Создайте визуализацию.

</TabItem>
<TabItem value="manual-connect" label="Воркшоп Getting started with the Semantic Layer">

1. Нажмите на ссылку, опубликованную в чате практического занятия. 
   - Если вы не видите её сразу, посмотрите раздел **Закреплённые сообщения** в чате.
2. Введите свой адрес электронной почты в соответствующее текстовое поле. Затем выберите **SQL and Python**, чтобы перейти на главный экран Hex.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/welcome_to_hex.png" width="70%" title="Главная страница «Welcome to Hex»."/>

3. Затем нажмите фиолетовую кнопку Hex в левом верхнем углу.
4. В меню слева нажмите **Collections**.
5. Выберите коллекцию **<Constant name="semantic_layer" /> Workshop**.
6. Откройте коллекцию проектов **Getting started with the <Constant name="semantic_layer" />**.

<Lightbox src="/img/docs/dbt-platform/semantic-layer/hex_collections.png" width="80%" title="Нажмите «Collections», чтобы выбрать коллекцию «Semantic Layer Workshop»."/>

7. Чтобы редактировать этот ноутбук Hex, нажмите **Duplicate** в выпадающем меню проекта (как показано на изображении). Это создаст новую копию ноутбука Hex, которой вы будете владеть.

<Lightbox src="/img/docs/dbt-platform/semantic-layer/hex_duplicate.png" width="80%" title="Нажмите кнопку «Duplicate» в раскрывающемся меню проекта, чтобы создать копию блокнота Hex."/>

8. Чтобы вашу копию проекта Hex было проще найти, переименуйте её, добавив своё имя.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/hex_rename.png" width="60%" title="Переименуйте свой проект Hex, добавив своё имя."/>

9. Теперь вы можете выполнять запросы к метрикам в Hex! Попробуйте на примерах:

   - В первой ячейке показана таблица метрики `order_total` по времени. Добавьте в эту таблицу метрику `order_count`.
   - Во второй ячейке показан линейный график метрики `order_total` по времени. Поэкспериментируйте с графиком — попробуйте изменить time grain с помощью выпадающего меню **Time unit**.
   - Следующая таблица в ноутбуке с названием “Example_query_2” показывает количество клиентов, сделавших свой первый заказ в определенный день. Создайте новую chart-ячейку. Постройте линейный график `first_ordered_at` vs `customers`, чтобы увидеть, как меняется число новых клиентов по дням.
   - Создайте новую ячейку semantic layer и выберите одну или несколько метрик. Отфильтруйте метрику(и) по одному или нескольким измерениям.

<Lightbox src="/img/docs/dbt-platform/semantic-layer/hex_make_sl_cell.png" width="90%" title="Запрос метрик с помощью Hex "/>

</TabItem>
</Tabs>

### Подключение и выполнение запросов с помощью Sigma {#connect-and-query-with-sigma}
В этом разделе описано, как использовать интеграцию с Sigma для выполнения запросов к вашим метрикам. Если у вас уже есть учетная запись Sigma, войдите в нее и перейдите к шагу 6. Шаги с 1 по 5 описывают создание учетной записи Sigma через Snowflake Partner Connect.

Выполняйте шаги с 1 по 5, только если вы используете Snowflake. Для Databricks предусмотрена отдельная процедура [Sigma Partner Connect](https://docs.databricks.com/aws/en/partners/bi/sigma). Если вы используете другую платформу данных, войдите в существующую учетную запись Sigma и продолжите с шага 6 или обратитесь к руководству Sigma [Выполнение запросов через интеграцию с dbt Semantic Layer](https://help.sigmacomputing.com/docs/query-a-dbt-semantic-layer-integration). 

1. Вернитесь в свою учетную запись Snowflake. В интерфейсе Snowflake нажмите значок главной страницы в левом верхнем углу. На левой боковой панели выберите **Data Products**. Затем выберите **Partner Connect**. Найдите плитку Sigma, прокрутив страницу или введя Sigma в строке поиска. Нажмите плитку, чтобы подключиться к Sigma.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-sigma-partner-connect.png" width="25%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

2. Выберите плитку Sigma из списка. Откройте раскрывающееся меню **Optional Grant**. Введите **RAW** и **ANALYTICS** в текстовое поле, затем нажмите **Connect**. 
<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-sigma-optional-grant.png" width="60%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

3. Придумайте название компании и URL для использования. Неважно, какой URL вы укажете, главное, чтобы он был уникальным.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-sigma-company-name.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

4. Введите свое имя и адрес электронной почты. Выберите пароль для своей учетной записи.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-sigma-create-profile.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

5. Отлично! Теперь у вас есть учетная запись Sigma. Прежде чем начать, вернитесь в Snowflake и откройте пустой файл. Выполните следующие команды.
- `grant all privileges on all views in schema analytics.SCHEMA to role pc_sigma_role;`
- `grant all privileges on all tables in schema analytics.SCHEMA to role pc_sigma_role;`

6. Нажмите значок своего профиля в правом верхнем углу. В раскрывающемся меню нажмите кнопку **Administration**.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-sigma-admin.png" width="40%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

7. Прокрутите страницу вниз до раздела интеграций, затем выберите **Add** рядом с интеграцией dbt.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-sigma-add-integration.png" width="70%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

8. В разделе **dbt Integration** заполните обязательные поля, затем сохраните изменения:
- Ваш [токен служебной учетной записи](/docs/dbt-apis/service-tokens) или [персональные токены доступа](/docs/dbt-apis/user-tokens) dbt.
- URL доступа для вашей существующей интеграции Sigma с dbt. Используйте `cloud.getdbt.com` в качестве URL доступа.
- Идентификатор вашей среды dbt.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-sigma-add-info.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

9. Вернитесь на главную страницу Sigma. Создайте новую рабочую книгу.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-sigma-make-workbook.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

10. Нажмите **Table**, затем **SQL**. Выберите подключение к данным, соответствующее вашему проекту dbt (Snowflake, BigQuery, Redshift или Databricks). Если вы создали эту учетную запись Sigma через Snowflake Partner Connect, это подключение называется `PC_SIGMA_WH`.
<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-sigma-make-table.png" width="50%" title="Нажмите кнопку '+ New project' в правом верхнем углу"/>

11. Теперь выполните запрос к рабочей метрике в вашем проекте! Например, допустим, у вас есть метрика, которая измеряет различные значения, связанные с заказами. Вот как вы могли бы выполнить запрос:

```sql
select * from
  {{ semantic_layer.query (
    metrics = ['order_total', 'order_count', 'large_orders', 'customers_with_orders', 'avg_order_value', 'pct_of_orders_that_are_large'],
    group_by = 
    [Dimension('metric_time').grain('day') ]
) }}
```

## Что дальше {#whats-next}

<ConfettiTrigger>

Отличная работа — вы завершили подробное руководство по <Constant name="semantic_layer" />! Надеемся, теперь у вас есть четкое понимание того, что такое <Constant name="semantic_layer" />, зачем он нужен и когда его использовать в ваших проектах.

Вы научились:

- Настройте хранилище данных и <Constant name="dbt" />, включая загрузку примеров данных и подключение вашего проекта.
- Создавайте, тестируйте и поддерживайте проекты dbt, уделяя особое внимание метрикам и семантическим моделям.
- Запускайте задания в производственной среде и запрашивайте метрики с помощью Google Sheets и других доступных интеграций.

В качестве следующих шагов вы можете начать определять собственные метрики и изучить дополнительные опции конфигурации, такие как [exports](/docs/use-dbt-semantic-layer/exports), [заполнение null-значений](/docs/build/advanced-topics), [внедрение <Constant name="mesh" /> с помощью <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) и другие.

Вот несколько дополнительных ресурсов, которые помогут вам продолжить путь:

- [Часто задаваемые вопросы о <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs)
- [Доступные интеграции](/docs/platform-integrations/avail-sl-integrations)
- Демонстрация того, [как определять метрики и выполнять запросы к ним с помощью MetricFlow](https://www.loom.com/share/60a76f6034b0441788d73638808e92ac?sid=861a94ac-25eb-4fd8-a310-58e159950f5a)
- [Присоединяйтесь к нашим демонстрациям в прямом эфире](https://www.getdbt.com/resources/webinars/dbt-cloud-demos-with-experts)

</ConfettiTrigger>
