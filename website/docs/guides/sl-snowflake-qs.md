---
title: "Быстрый старт с семантическим слоем dbt Cloud и Snowflake"
id: sl-snowflake-qs
description: "Используйте это руководство для создания и определения метрик, настройки семантического слоя dbt Cloud и выполнения запросов с помощью Google Sheets."
sidebar_label: "Быстрый старт с семантическим слоем dbt и Snowflake"
meta:
  api_name: API семантического слоя dbt
icon: 'guides'
hide_table_of_contents: true
tags: ['Semantic layer', 'Snowflake', 'dbt Cloud','Quickstart']
keywords: ['Семантический слой dbt','Метрики','dbt Cloud', 'Snowflake', 'Google Sheets']
level: 'Средний'
recently_updated: true
---

<!-- The below snippets (or reusables) can be found in the following file locations in the docs code repository) -->
import CreateModel from '/snippets/_sl-create-semanticmodel.md';
import DefineMetrics from '/snippets/_sl-define-metrics.md';
import ConfigMetric from '/snippets/_sl-configure-metricflow.md';
import TestQuery from '/snippets/_sl-test-and-query-metrics.md';
import ConnectQueryAPI from '/snippets/_sl-connect-and-query-api.md';
import RunProdJob from '/snippets/_sl-run-prod-job.md';
import SlSetUp from '/snippets/_new-sl-setup.md'; 

## Введение

[Семантический слой dbt](/docs/use-dbt-semantic-layer/dbt-sl), работающий на базе [MetricFlow](/docs/build/about-metricflow), упрощает настройку ключевых бизнес-метрик. Он централизует определения, избегает дублирования кода и обеспечивает легкий доступ к метрикам в инструментах нижнего уровня. MetricFlow помогает проще управлять метриками компании, позволяя вам определять метрики в вашем проекте dbt и запрашивать их в dbt Cloud с помощью [команд MetricFlow](/docs/build/metricflow-commands).

Это руководство быстрого старта предназначено для пользователей dbt Cloud, использующих Snowflake в качестве своей платформы данных. Оно сосредоточено на создании и определении метрик, настройке семантического слоя dbt в проекте dbt Cloud и выполнении запросов к метрикам в Google Sheets.

**Для пользователей на других платформах данных**

Если вы используете платформу данных, отличную от Snowflake, это руководство также применимо к вам. Вы можете адаптировать настройку для вашей конкретной платформы, следуя инструкциям по настройке учетной записи и загрузке данных, подробно описанным в следующих вкладках для каждой соответствующей платформы.

Остальная часть этого руководства применима ко всем поддерживаемым платформам, что гарантирует, что вы сможете в полной мере использовать семантический слой dbt.

<Tabs>

<TabItem value="bq" label="BigQuery">

Откройте новую вкладку и выполните следующие быстрые шаги для настройки учетной записи и инструкций по загрузке данных:

- [Шаг 2: Создайте новый проект GCP](https://docs.getdbt.com/guides/bigquery?step=2)
- [Шаг 3: Создайте набор данных BigQuery](https://docs.getdbt.com/guides/bigquery?step=3)
- [Шаг 4: Сгенерируйте учетные данные BigQuery](https://docs.getdbt.com/guides/bigquery?step=4)
- [Шаг 5: Подключите dbt Cloud к BigQuery](https://docs.getdbt.com/guides/bigquery?step=5)

</TabItem>

<TabItem value="databricks" label="Databricks">

Откройте новую вкладку и выполните следующие быстрые шаги для настройки учетной записи и инструкций по загрузке данных:

- [Шаг 2: Создайте рабочую область Databricks](https://docs.getdbt.com/guides/databricks?step=2)
- [Шаг 3: Загрузите данные](https://docs.getdbt.com/guides/databricks?step=3)
- [Шаг 4: Подключите dbt Cloud к Databricks](https://docs.getdbt.com/guides/databricks?step=4)

</TabItem>

<TabItem value="msfabric" label="Microsoft Fabric">

Откройте новую вкладку и выполните следующие быстрые шаги для настройки учетной записи и инструкций по загрузке данных:

- [Шаг 2: Загрузите данные в ваш склад Microsoft Fabric](https://docs.getdbt.com/guides/microsoft-fabric?step=2)
- [Шаг 3: Подключите dbt Cloud к Microsoft Fabric](https://docs.getdbt.com/guides/microsoft-fabric?step=3)

</TabItem>

<TabItem value="redshift" label="Redshift">

Откройте новую вкладку и выполните следующие быстрые шаги для настройки учетной записи и инструкций по загрузке данных:

- [Шаг 2: Создайте кластер Redshift](https://docs.getdbt.com/guides/redshift?step=2)
- [Шаг 3: Загрузите данные](https://docs.getdbt.com/guides/redshift?step=3)
- [Шаг 4: Подключите dbt Cloud к Redshift](https://docs.getdbt.com/guides/redshift?step=3)

</TabItem>

<TabItem value="starburst" label="Starburst Galaxy">

Откройте новую вкладку и выполните следующие быстрые шаги для настройки учетной записи и инструкций по загрузке данных:

- [Шаг 2: Загрузите данные в корзину Amazon S3](https://docs.getdbt.com/guides/starburst-galaxy?step=2)
- [Шаг 3: Подключите Starburst Galaxy к данным из корзины Amazon S3](https://docs.getdbt.com/guides/starburst-galaxy?step=3)
- [Шаг 4: Создайте таблицы с помощью Starburst Galaxy](https://docs.getdbt.com/guides/starburst-galaxy?step=4)
- [Шаг 5: Подключите dbt Cloud к Starburst Galaxy](https://docs.getdbt.com/guides/starburst-galaxy?step=5)

</TabItem>

</Tabs>

## Предварительные требования

- Вам нужна учетная запись [dbt Cloud](https://www.getdbt.com/signup/) Trial, Team или Enterprise для всех развертываний. Свяжитесь с вашим представителем для настройки на одном арендаторе; в противном случае создайте учетную запись, используя это руководство.
- Убедитесь, что у вас есть правильная [лицензия dbt Cloud](/docs/cloud/manage-access/seats-and-users) и [разрешения](/docs/cloud/manage-access/enterprise-permissions) в зависимости от вашего плана:
  <DetailsToggle alt_header="Дополнительная информация о лицензии и разрешениях">  
  
  - Enterprise &mdash; Лицензия разработчика с правами администратора учетной записи. Или "Владелец" с лицензией разработчика, назначенный создателем проекта, администратором базы данных или администратором.
  - Team &mdash; Доступ "Владелец" с лицензией разработчика.
  - Trial &mdash; Автоматический доступ "Владелец" в рамках пробного плана Team.
  
  </DetailsToggle>

- Создайте [пробную учетную запись Snowflake](https://signup.snowflake.com/):
  - Выберите издание Snowflake Enterprise с доступом ACCOUNTADMIN. Учитывайте организационные вопросы при выборе облачного провайдера, обратитесь к [Введению в облачные платформы](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms).
  - Выберите облачного провайдера и регион. Все облачные провайдеры и регионы будут работать, поэтому выберите тот, который вам больше нравится.
- Базовое понимание SQL и dbt. Например, вы уже использовали dbt или завершили курс [dbt Fundamentals](https://learn.getdbt.com/courses/dbt-fundamentals).

### Чему вы научитесь

Это руководство охватывает следующие темы:

- [Создание нового рабочего листа Snowflake и настройка вашей среды](/guides/sl-snowflake-qs?step=3)
- [Загрузка образца данных в вашу учетную запись Snowflake](/guides/sl-snowflake-qs?step=4)
- [Подключение dbt Cloud к Snowflake](/guides/sl-snowflake-qs?step=5)
- [Настройка управляемого репозитория dbt Cloud](/guides/sl-snowflake-qs?step=6)
- [Инициализация проекта dbt Cloud и начало разработки](/guides/sl-snowflake-qs?step=7)
- [Создание проекта dbt Cloud](/guides/sl-snowflake-qs?step=8)
- [Создание семантической модели в dbt Cloud](/guides/sl-snowflake-qs?step=9)
- [Определение метрик в dbt Cloud](/guides/sl-snowflake-qs?step=10)
- [Добавление второй семантической модели](/guides/sl-snowflake-qs?step=11)
- [Тестирование и запрос метрик в dbt Cloud](/guides/sl-snowflake-qs?step=12)
- [Запуск производственной задачи в dbt Cloud](/guides/sl-snowflake-qs?step=13)
- [Настройка семантического слоя dbt в dbt Cloud](/guides/sl-snowflake-qs?step=14)
- [Подключение и запрос метрик с помощью Google Sheets](/guides/sl-snowflake-qs?step=15)

## Создание нового рабочего листа Snowflake и настройка среды

1. Войдите в свою [пробную учетную запись Snowflake](https://signup.snowflake.com).
2. В пользовательском интерфейсе Snowflake (UI) нажмите **+ Worksheet** в правом верхнем углу.
3. Выберите **SQL Worksheet**, чтобы создать новый рабочий лист.

### Настройка среды Snowflake

Данные, используемые здесь, хранятся в виде файлов CSV в публичной корзине S3, и следующие шаги помогут вам подготовить вашу учетную запись Snowflake для этих данных и загрузить их.

Создайте новый виртуальный склад, две новые базы данных (одну для необработанных данных, другую для будущей разработки dbt) и две новые схемы (одну для данных `jaffle_shop`, другую для данных `stripe`).

1. Выполните следующие SQL-команды одну за другой, вводя их в редакторе вашего нового SQL-рабочего листа Snowflake для настройки вашей среды.

2. Нажмите **Run** в правом верхнем углу UI для каждой из них:

```sql
-- Создание виртуального склада с именем 'transforming'
create warehouse transforming;

-- Создание двух баз данных: одна для необработанных данных и другая для аналитики
create database raw;
create database analytics;

-- Внутри базы данных 'raw' создайте две схемы: 'jaffle_shop' и 'stripe'
create schema raw.jaffle_shop;
create schema raw.stripe;
```

## Загрузка данных в Snowflake
Теперь, когда ваша среда настроена, вы можете начать загружать данные в нее. Вы будете работать в необработанной базе данных, используя схемы `jaffle_shop` и `stripe` для организации ваших таблиц.

1. Создайте таблицу клиентов. Сначала удалите все содержимое (очистите) в редакторе рабочего листа Snowflake. Затем выполните эту SQL-команду для создания таблицы клиентов в схеме `jaffle_shop`:

  ```sql
  create table raw.jaffle_shop.customers
  ( id integer,
    first_name varchar,
    last_name varchar
  );
  ```

  Вы должны увидеть сообщение «Таблица `CUSTOMERS` успешно создана».

2. Загрузите данные. После создания таблицы удалите все содержимое в редакторе. Выполните эту команду для загрузки данных из корзины S3 в таблицу клиентов:

  ```sql
  copy into raw.jaffle_shop.customers (id, first_name, last_name)
  from 's3://dbt-tutorial-public/jaffle_shop_customers.csv'
  file_format = (
      type = 'CSV'
      field_delimiter = ','
      skip_header = 1
      );
  ```

  Вы должны увидеть сообщение подтверждения после выполнения команды.

3. Создайте таблицу `orders`. Удалите все содержимое в редакторе. Выполните следующую команду для создания…

  ```sql
  create table raw.jaffle_shop.orders
  ( id integer,
    user_id integer,
    order_date date,
    status varchar,
    _etl_loaded_at timestamp default current_timestamp
  );
  ```

  Вы должны увидеть сообщение подтверждения после выполнения команды.

4. Загрузите данные. Удалите все содержимое в редакторе, затем выполните эту команду для загрузки данных в таблицу заказов:

  ```sql
  copy into raw.jaffle_shop.orders (id, user_id, order_date, status)
  from 's3://dbt-tutorial-public/jaffle_shop_orders.csv'
  file_format = (
      type = 'CSV'
      field_delimiter = ','
      skip_header = 1
      );
  ```

  Вы должны увидеть сообщение подтверждения после выполнения команды.

5. Создайте таблицу `payment`. Удалите все содержимое в редакторе. Выполните следующую команду для создания таблицы платежей:

  ```sql
  create table raw.stripe.payment
  ( id integer,
    orderid integer,
    paymentmethod varchar,
    status varchar,
    amount integer,
    created date,
    _batched_at timestamp default current_timestamp
  );
  ```

  Вы должны увидеть сообщение подтверждения после выполнения команды.

6. Загрузите данные. Удалите все содержимое в редакторе. Выполните следующую команду для загрузки данных в таблицу платежей:

  ```sql
  copy into raw.stripe.payment (id, orderid, paymentmethod, status, amount, created)
  from 's3://dbt-tutorial-public/stripe_payments.csv'
  file_format = (
      type = 'CSV'
      field_delimiter = ','
      skip_header = 1
      );
  ```

  Вы должны увидеть сообщение подтверждения после выполнения команды.

7. Проверьте данные. Убедитесь, что данные загружены, выполнив эти SQL-запросы. Подтвердите, что вы можете увидеть вывод для каждого из них, как на следующем подтверждающем изображении.

  ```sql
  select * from raw.jaffle_shop.customers;
  select * from raw.jaffle_shop.orders;
  select * from raw.stripe.payment;
  ```

  <Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-snowflake-confirm.jpg" width="90%" title="Изображение отображает подтверждающий вывод Snowflake, когда данные загружены правильно в редактор." />

## Подключение dbt Cloud к Snowflake

Существует два способа подключения dbt Cloud к Snowflake. Первый вариант — Partner Connect, который предоставляет упрощенную настройку для создания вашей учетной записи dbt Cloud из вашей новой пробной учетной записи Snowflake. Второй вариант — создать учетную запись dbt Cloud отдельно и самостоятельно настроить подключение к Snowflake (подключение вручную). Если вы хотите быстро начать, dbt Labs рекомендует использовать Partner Connect. Если вы хотите настроить свою конфигурацию с самого начала и ознакомиться с процессом настройки dbt Cloud, dbt Labs рекомендует подключение вручную.

<Tabs>
<TabItem value="partner-connect" label="Использовать Partner Connect" default>

Использование Partner Connect позволяет вам создать полную учетную запись dbt с вашим [подключением Snowflake](/docs/cloud/connect-data-platform/connect-snowflake), [управляемым репозиторием](/docs/collaborate/git/managed-repository), [окружениями](/docs/build/custom-schemas#managing-environments) и учетными данными.

1. В интерфейсе Snowflake нажмите на значок дома в верхнем левом углу. В левой боковой панели выберите **Data Products**. Затем выберите **Partner Connect**. Найдите плитку dbt, прокручивая или используя строку поиска. Нажмите на плитку, чтобы подключиться к dbt.

    <Lightbox src="/img/snowflake_tutorial/snowflake_partner_connect_box.png" title="Плитка Partner Connect Snowflake" />

    Если вы используете классическую версию интерфейса Snowflake, вы можете нажать кнопку **Partner Connect** в верхней панели вашей учетной записи. Оттуда нажмите на плитку dbt, чтобы открыть окно подключения. 

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_partner_connect.png" title="Классический интерфейс Snowflake - Partner Connect" />

2. В всплывающем окне **Подключиться к dbt** найдите опцию **Дополнительное предоставление** и выберите базы данных **RAW** и **ANALYTICS**. Это предоставит доступ для вашей новой роли пользователя dbt к каждой выбранной базе данных. Затем нажмите **Подключить**.

    <Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_connection_box.png" title="Классический интерфейс Snowflake - Окно подключения" />

    <Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_connection_box.png" title="Новый интерфейс Snowflake - Окно подключения" />

3. Нажмите **Активировать**, когда появится всплывающее окно: 

<Lightbox src="/img/snowflake_tutorial/snowflake_classic_ui_activation_window.png" title="Классический интерфейс Snowflake - Окно активации" />

<Lightbox src="/img/snowflake_tutorial/snowflake_new_ui_activation_window.png" title="Новый интерфейс Snowflake - Окно активации" />

4. После загрузки новой вкладки вы увидите форму. Если вы уже создали учетную запись dbt Cloud, вам будет предложено указать имя учетной записи. Если вы еще не создали учетную запись, вам будет предложено указать имя учетной записи и пароль.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_account_info.png" title="dbt Cloud - Информация об учетной записи" />

5. После заполнения формы и нажатия **Завершить регистрацию** вы автоматически войдете в dbt Cloud.

6. Нажмите на имя вашей учетной записи в левом боковом меню и выберите **Настройки учетной записи**, выберите проект "Partner Connect Trial" и выберите **snowflake** в таблице обзора. Выберите **Изменить** и обновите поле **База данных** на `analytics` и поле **Склад** на `transforming`.

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_project_overview.png" title="dbt Cloud - Обзор проекта Snowflake" />

<Lightbox src="/img/snowflake_tutorial/dbt_cloud_update_database_and_warehouse.png" title="dbt Cloud - Обновление базы данных и склада" />

</TabItem>
<TabItem value="manual-connect" label="Подключить вручную">


1. Создайте новый проект в dbt Cloud. Перейдите в **Настройки учетной записи** (нажав на имя вашей учетной записи в левом боковом меню) и нажмите **+ Новый проект**.
2. Введите имя проекта и нажмите **Продолжить**.
3. Для склада нажмите **Snowflake**, затем **Далее**, чтобы настроить ваше подключение.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_setup_snowflake_connection_start.png" title="dbt Cloud - Выбор подключения Snowflake" />

4. Введите ваши **Настройки** для Snowflake с: 
    * **Учетная запись** &mdash; Найдите свою учетную запись, используя URL пробной учетной записи Snowflake и удалив `snowflakecomputing.com`. Порядок вашей учетной информации будет варьироваться в зависимости от версии Snowflake. Например, URL классической консоли Snowflake может выглядеть так: `oq65696.west-us-2.azure.snowflakecomputing.com`. URL AppUI или Snowsight может выглядеть более так: `snowflakecomputing.com/west-us-2.azure/oq65696`. В обоих примерах ваша учетная запись будет: `oq65696.west-us-2.azure`. Для получения дополнительной информации смотрите [Идентификаторы учетной записи](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html) в документации Snowflake.  

        <Snippet path="snowflake-acct-name" />
    
    * **Роль** &mdash; Оставьте пустым на данный момент. Вы можете обновить это до стандартной роли Snowflake позже.
    * **База данных** &mdash; `analytics`. Это указывает dbt создавать новые модели в базе данных аналитики.
    * **Склад** &mdash; `transforming`. Это указывает dbt использовать создаваемый ранее склад.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_account_settings.png" title="dbt Cloud - Настройки учетной записи Snowflake" />

5. Введите ваши **Учетные данные для разработки** для Snowflake с: 
    * **Имя пользователя** &mdash; Имя пользователя, которое вы создали для Snowflake. Имя пользователя не является вашим адресом электронной почты и обычно представляет собой ваше имя и фамилию, объединенные в одно слово. 
    * **Пароль** &mdash; Пароль, который вы установили при создании учетной записи Snowflake.
    * **Схема** &mdash; Вы заметите, что имя схемы было автоматически создано для вас. По соглашению это `dbt_<первая_инициал><фамилия>`. Это схема, подключенная непосредственно к вашей среде разработки, и именно здесь будут создаваться ваши модели при выполнении dbt в Cloud IDE.
    * **Имя цели** &mdash; Оставьте по умолчанию.
    * **Потоки** &mdash; Оставьте 4. Это количество одновременных подключений, которые dbt Cloud будет делать для одновременного создания моделей.

    <Lightbox src="/img/snowflake_tutorial/dbt_cloud_snowflake_development_credentials.png" title="dbt Cloud - Учетные данные разработки Snowflake" />

6. Нажмите **Проверить подключение**. Это проверяет, что dbt Cloud может получить доступ к вашей учетной записи Snowflake.
7. Если тест подключения прошел успешно, нажмите **Далее**. Если он не удался, вам может потребоваться проверить настройки и учетные данные Snowflake.

</TabItem>
</Tabs>

## Настройка управляемого репозитория dbt Cloud 
Если вы использовали Partner Connect, вы можете перейти к [инициализации вашего проекта dbt](#initialize-your-dbt-project-and-start-developing), так как Partner Connect предоставляет вам [управляемый репозиторий](/docs/collaborate/git/managed-repository). В противном случае вам нужно будет создать подключение к вашему репозиторию. 

<Snippet path="tutorial-managed-repo" />

## Инициализация вашего проекта dbt и начало разработки
Это руководство предполагает, что вы используете [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) для разработки вашего проекта dbt, определения метрик и выполнения запросов и предварительного просмотра метрик с помощью [команд MetricFlow](/docs/build/metricflow-commands).

Теперь, когда у вас настроен репозиторий, вы можете инициализировать ваш проект и начать разработку в dbt Cloud, используя IDE:

1. Нажмите **Начать разработку в dbt Cloud IDE**. Это может занять несколько минут, чтобы ваш проект запустился в первый раз, так как он устанавливает ваше соединение с git, клонирует ваш репозиторий и тестирует соединение со складом.
2. Над деревом файлов слева нажмите **Инициализировать ваш проект**. Это создаст вашу структуру папок с примерами моделей.
3. Сделайте ваш первый коммит, нажав **Коммит и синхронизация**. Используйте сообщение коммита `initial commit`. Это создаст первый коммит в вашем управляемом репозитории и позволит вам открыть ветку, где вы можете добавить новый код dbt.
4. Теперь вы можете напрямую выполнять запросы к данным из вашего склада и выполнять `dbt run`. Вы можете попробовать это сейчас:
    - Удалите папку models/examples в **Обозревателе файлов**.
    - Нажмите **+ Создать новый файл**, добавьте этот запрос в новый файл и нажмите **Сохранить как**, чтобы сохранить новый файл:
      ```sql
      select * from raw.jaffle_shop.customers
      ```
    - В строке команд внизу введите dbt run и нажмите Enter. Вы должны увидеть сообщение о успешном выполнении dbt.

## Построение вашего проекта dbt
Следующий шаг — построить ваш проект. Это включает в себя добавление источников, моделей стадии, бизнес-определенных сущностей и пакетов в ваш проект.

### Добавление источников

[Источники](/docs/build/sources) в dbt — это необработанные таблицы данных, которые вы будете преобразовывать. Организуя ваши определения источников, вы документируете происхождение ваших данных. Это также делает ваш проект и преобразование более надежными, структурированными и понятными.

У вас есть два варианта работы с файлами в dbt Cloud IDE:

- **Создать новую ветку (рекомендуется)** &mdash; Создайте новую ветку, чтобы редактировать и коммитить ваши изменения. Перейдите в **Управление версиями** в левой боковой панели и нажмите **Создать ветку**.
- **Редактировать в защищенной основной ветке** &mdash; Если вы предпочитаете редактировать, форматировать или проверять файлы и выполнять команды dbt непосредственно в вашей основной ветке git, используйте этот вариант. dbt Cloud IDE предотвращает коммиты в защищенной ветке, поэтому вам будет предложено коммитить ваши изменения в новую ветку.

Назовите новую ветку `build-project`.

1. Наведите курсор на директорию `models` и нажмите на меню с тремя точками (**...**), затем выберите **Создать файл**.
2. Назовите файл `staging/jaffle_shop/src_jaffle_shop.yml`, затем нажмите **Создать**.
3. Скопируйте следующий текст в файл и нажмите **Сохранить**.

<File name='models/staging/jaffle_shop/src_jaffle_shop.yml'>

```yaml
version: 2

sources:
 - name: jaffle_shop
   database: raw
   schema: jaffle_shop
   tables:
     - name: customers
     - name: orders
```

</File>

:::tip
В вашем файле источника вы также можете использовать кнопку **Сгенерировать модель**, чтобы создать новый файл модели для каждого источника. Это создаст новый файл в директории `models` с заданным именем источника и заполнит SQL-код определения источника.
:::

4. Наведите курсор на директорию `models` и нажмите на меню с тремя точками (**...**), затем выберите **Создать файл**.
5. Назовите файл `staging/stripe/src_stripe.yml`, затем нажмите **Создать**.
6. Скопируйте следующий текст в файл и нажмите **Сохранить**.

<File name='models/staging/stripe/src_stripe.yml'>

```yaml
version: 2

sources:
 - name: stripe
   database: raw
   schema: stripe
   tables:
     - name: payment
```
</File>

### Добавление моделей стадии
[Модели стадии](/best-practices/how-we-structure/2-staging) являются первым этапом преобразования в dbt. Они очищают и подготавливают ваши необработанные данные, делая их готовыми для более сложных преобразований и анализов. Следуйте этим шагам, чтобы добавить ваши модели стадии в ваш проект.

1. В подкаталоге `jaffle_shop` создайте файл `stg_customers.sql`. Или вы можете использовать кнопку **Сгенерировать модель**, чтобы создать новый файл модели для каждого источника.
2. Скопируйте следующий запрос в файл и нажмите **Сохранить**.

<File name='models/staging/jaffle_shop/stg_customers.sql'>

```sql
  select
   id as customer_id,
   first_name,
   last_name
from {{ source('jaffle_shop', 'customers') }}
```

</File>

3. В том же подкаталоге `jaffle_shop` создайте файл `stg_orders.sql`
4. Скопируйте следующий запрос в файл и нажмите **Сохранить**.

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
6. Скопируйте следующий запрос в файл и нажмите **Сохранить**.

<File name='models/staging/stripe/stg_payments.sql'>

```sql
select
   id as payment_id,
   orderid as order_id,
   paymentmethod as payment_method,
   status,
   -- сумма хранится в центах, преобразуйте ее в доллары
   amount / 100 as amount,
   created as created_at
from {{ source('stripe', 'payment') }}
```

</File>

7. Введите `dbt run` в командной строке внизу экрана. Вы должны получить сообщение о успешном выполнении и увидеть в деталях выполнения, что dbt успешно создал три модели.

### Добавление бизнес-определенных сущностей

Этот этап включает в себя создание [моделей, которые служат слоем сущностей или концептуальным слоем вашего проекта dbt](/best-practices/how-we-structure/4-marts), подготавливая данные для отчетности и анализа. Он также включает в себя добавление [пакетов](/docs/build/packages) и [временной спины MetricFlow](/docs/build/metricflow-time-spine), которые расширяют функциональность dbt.

Этот этап представляет собой [слой маркетов](/best-practices/how-we-structure/1-guide-overview#guide-structure-overview), который объединяет модульные части в широкое, богатое представление о сущностях, которые интересуют организацию.

1. Создайте файл `models/marts/fct_orders.sql`.
2. Скопируйте следующий запрос в файл и нажмите **Сохранить**.

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
4. Скопируйте следующий запрос в файл и нажмите **Сохранить**.

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

5. В вашей основной директории создайте файл `packages.yml`.
6. Скопируйте следующий текст в файл и нажмите **Сохранить**.

<File name='packages.yml'>

```sql
packages:
 - package: dbt-labs/dbt_utils
   version: 1.1.1
```

</File>

7. В директории `models` создайте файл `metrics/metricflow_time_spine.sql` в вашей основной директории.
8. Скопируйте следующий запрос в файл и нажмите **Сохранить**.

<File name='models/metrics/metricflow_time_spine.sql'>

```sql
{{
   config(
       materialized = 'table',
   )
}}
with days as (
   {{
       dbt_utils.date_spine(
           'day',
           "to_date('01/01/2000','mm/dd/yyyy')",
           "to_date('01/01/2027','mm/dd/yyyy')"
       )
   }}
),
final as (
   select cast(date_day as date) as date_day
   from days
)
select * from final
```

</File>

9. Введите `dbt run` в командной строке внизу экрана. Вы должны получить сообщение о успешном выполнении и также увидеть в деталях выполнения, что dbt успешно создал пять моделей.

## Создание семантических моделей

[Семантические модели](/docs/build/semantic-models) содержат множество типов объектов (таких как сущности, меры и размеры), которые позволяют MetricFlow строить запросы для определения метрик.

- Каждая семантическая модель будет 1:1 с моделью SQL/Python dbt.
- Каждая семантическая модель будет содержать (в максимальном количестве) 1 основную или естественную сущность.
- Каждая семантическая модель может содержать ноль, одну или множество внешних или уникальных сущностей, используемых для соединения с другими сущностями.
- Каждая семантическая модель также может содержать размеры, меры и метрики. Это то, что фактически передается и запрашивается вашим инструментом BI нижнего уровня.

В следующих шагах семантические модели позволяют вам определить, как интерпретировать данные, связанные с заказами. Это включает в себя сущности (такие как столбцы ID, служащие ключами для соединения данных), размеры (для группировки или фильтрации данных) и меры (для агрегирования данных).

1. В подкаталоге `metrics` создайте новый файл `fct_orders.yml`.

:::tip 
Убедитесь, что вы сохраняете все семантические модели и метрики в директории, определенной в [`model-paths`](/reference/project-configs/model-paths) (или в подкаталоге, таком как `models/semantic_models/`). Если вы сохраните их вне этого пути, это приведет к пустому файлу `semantic_manifest.json`, и ваши семантические модели или метрики не будут распознаны.
:::

2. Добавьте следующий код в только что созданный файл:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Фактическая таблица заказов. Зерно этой таблицы — одна строка на заказ.
    model: ref('fct_orders')
```

</File>

Следующие разделы объясняют [сущности](/docs/build/semantic-models#entities), [размеры](/docs/build/semantic-models#entities) и [меры](/docs/build/semantic-models#measures) более подробно, показывая, как каждая из них играет роль в семантических моделях.

- [Сущности](#entities) действуют как уникальные идентификаторы (например, столбцы ID), которые связывают данные из разных таблиц.
- [Размеры](#dimensions) классифицируют и фильтруют данные, упрощая их организацию.
- [Меры](#measures) вычисляют данные, предоставляя ценные инсайты через агрегирование.

### Сущности

[Сущности](/docs/build/semantic-models#entities) — это реальная концепция в бизнесе, служащая основой вашей семантической модели. Это будут столбцы ID (например, `order_id`) в наших семантических моделях. Они будут служить ключами для соединения с другими семантическими моделями.

Добавьте сущности в файл вашей семантической модели `fct_orders.yml`:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Фактическая таблица заказов. Зерно этой таблицы — одна строка на заказ.
    model: ref('fct_orders')
    # Новая добавленная
    entities: 
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
```

</File>

### Размеры

[Размеры](/docs/build/semantic-models#entities) — это способ группировки или фильтрации информации на основе категорий или времени. 

Добавьте размеры в файл вашей семантической модели `fct_orders.yml`:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Фактическая таблица заказов. Зерно этой таблицы — одна строка на заказ.
    model: ref('fct_orders')
    entities:
      - name: order_id
        type: primary
      - name: customer
        expr: customer_id
        type: foreign
    # Новая добавленная
    dimensions:   
      - name: order_date
        type: time
        type_params:
          time_granularity: day
```

</File>

### Меры

[Меры](/docs/build/semantic-models#measures) — это агрегирования, выполняемые над столбцами в вашей модели. Часто вы будете использовать их в качестве окончательных метрик. Меры также могут служить строительными блоками для более сложных метрик.

Добавьте меры в файл вашей семантической модели `fct_orders.yml`:

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Фактическая таблица заказов. Зерно этой таблицы — одна строка на заказ.
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
    # Новая добавленная      
    measures:   
      - name: order_total
        description: Общая сумма для каждого заказа, включая налоги.
        agg: sum
        expr: amount
      - name: order_count
        expr: 1
        agg: sum
      - name: customers_with_orders
        description: Уникальное количество клиентов, размещающих заказы
        agg: count_distinct
        expr: customer_id
      - name: order_value_p99 ## 99-й процентиль значения заказа
        expr: amount
        agg: percentile
        agg_params:
          percentile: 0.99
          use_discrete_percentile: True
          use_approximate_percentile: False
```

</File>

## Определение метрик

[Метрики](/docs/build/metrics-overview) — это язык, на котором говорят ваши бизнес-пользователи и измеряют бизнес-производительность. Это агрегирование по столбцу в вашем хранилище данных, которое вы обогащаете размерными разрезами.

Существует несколько типов метрик, которые вы можете настроить:

- [Метрики конверсии](/docs/build/conversion) &mdash; Отслеживают, когда базовое событие и последующее событие конверсии происходят для сущности в заданный период времени.
- [Кумулятивные метрики](/docs/build/metrics-overview#cumulative-metrics) &mdash; Агрегируют меру за заданный период. Если период не указан, он будет накапливать меру за весь зарегистрированный период времени. Обратите внимание, что вы должны создать модель временной спины перед добавлением кумулятивных метрик.
- [Производные метрики](/docs/build/metrics-overview#derived-metrics) &mdash; Позволяют вам выполнять вычисления на основе метрик.
- [Простые метрики](/docs/build/metrics-overview#simple-metrics) &mdash; Непосредственно ссылаются на одну меру без участия дополнительных мер.
- [Метрики отношения](/docs/build/metrics-overview#ratio-metrics) &mdash; Включают метрику числителя и метрику знаменателя. Строка ограничения может быть применена как к числителю, так и к знаменателю или отдельно к числителю или знаменателю.

После того как вы создали свои семантические модели, пришло время начать ссылаться на эти меры, чтобы создать некоторые метрики:

1. Добавьте метрики в файл вашей семантической модели `fct_orders.yml`:

:::tip 
Убедитесь, что вы сохраняете все семантические модели и метрики в директории, определенной в [`model-paths`](/reference/project-configs/model-paths) (или в подкаталоге, таком как `models/semantic_models/`). Если вы сохраните их вне этого пути, это приведет к пустому файлу `semantic_manifest.json`, и ваши семантические модели или метрики не будут распознаны.
:::

<File name='models/metrics/fct_orders.yml'>

```yaml
semantic_models:
  - name: orders
    defaults:
      agg_time_dimension: order_date
    description: |
      Фактическая таблица заказов. Зерно этой таблицы — одна строка на заказ
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
        description: Общая сумма для каждого заказа, включая налоги.
        agg: sum
        expr: amount
      - name: order_count
        expr: 1
        agg: sum
      - name: customers_with_orders
        description: Уникальное количество клиентов, размещающих заказы
        agg: count_distinct
        expr: customer_id
      - name: order_value_p99
        expr: amount
        agg: percentile
        agg_params:
          percentile: 0.99
          use_discrete_percentile: True
          use_approximate_percentile: False
# Новая добавленная          
metrics: 
  # Метрики простого типа
  - name: "order_total"
    description: "Сумма значений заказов"
    type: simple
    label: "order_total"
    type_params:
      measure:
        name: order_total
  - name: "order_count"
    description: "количество заказов"
    type: simple
    label: "order_count"
    type_params:
      measure:
        name: order_count
  - name: large_orders
    description: "Количество заказов с общей суммой заказа более 20."
    type: simple
    label: "Большие заказы"
    type_params:
      measure:
        name: order_count
    filter: |
      {{ Metric('order_total', group_by=['order_id']) }} >=  20
  # Метрика отношения
  - name: "avg_order_value"
    label: "avg_order_value"
    description: "средняя стоимость каждого заказа"
    type: ratio
    type_params:
      numerator: order_total
      denominator: order_count
  # Кумулятивные метрики
  - name: "cumulative_order_amount_mtd"
    label: "cumulative_order_amount_mtd"
    description: "Сумма всех заказов с начала месяца"
    type: cumulative
    type_params:
      measure:
        name: order_total
      grain_to_date: month
  # Производная метрика
  - name: "pct_of_orders_that_are_large"
    label: "pct_of_orders_that_are_large"
    description: "процент заказов, которые являются большими"
    type: derived
    type_params:
      expr: large_orders/order_count
      metrics:
        - name: large_orders
        - name: order_count
```

</File>

## Добавление второй семантической модели в ваш проект

Отличная работа, вы успешно создали свою первую семантическую модель! Она содержит все необходимые элементы: сущности, размеры, меры и метрики.

Давайте расширим аналитические возможности вашего проекта, добавив еще одну семантическую модель в вашу другую модель маркетов, такую как: `dim_customers.yml`.

После настройки модели заказов:

1. В подкаталоге `metrics` создайте файл `dim_customers.yml`.
2. Скопируйте следующий запрос в файл и нажмите **Сохранить**.

<File name='models/metrics/dim_customers.yml'>

```yaml
semantic_models:
  - name: customers
    defaults:
      agg_time_dimension: most_recent_order_date
    description: |
      семантическая модель для dim_customers
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
        description: Общее количество заказов на клиента.
        agg: sum
        expr: number_of_orders
      - name: lifetime_spend
        agg: sum
        expr: lifetime_value
        description: Общие расходы клиента на протяжении жизни, включая налоги.
      - name: customers
        expr: customer_id
        agg: count_distinct

metrics:
  - name: "customers_with_orders"
    label: "customers_with_orders"
    description: "Уникальное количество клиентов, размещающих заказы"
    type: simple
    type_params:
      measure:
        name: customers
```

</File>

Эта семантическая модель использует простые метрики, чтобы сосредоточиться на метриках клиентов и подчеркивает размеры клиентов, такие как имя, тип и даты заказов. Она уникально анализирует поведение клиентов, их жизненную ценность и паттерны заказов.

## Тестирование и запрос метрик

<TestQuery />

## Запуск производственной задачи

<RunProdJob/>

## Настройка семантического слоя dbt

<SlSetUp/>

## Запрос семантического слоя

Эта страница проведет вас через то, как подключиться и использовать следующие интеграции для запроса ваших метрик:

- [Подключение и запрос с помощью Google Sheets](#connect-and-query-with-google-sheets)
- [Подключение и запрос с помощью Hex](#connect-and-query-with-hex)

Семантический слой dbt позволяет вам подключаться и запрашивать ваши метрики с помощью различных доступных инструментов, таких как Google Sheets, Hex, Tableau и других. 

Запрашивайте метрики, используя другие инструменты, такие как [интеграции первого класса](/docs/cloud-integrations/avail-sl-integrations), [API семантического слоя](/docs/dbt-cloud-apis/sl-api-overview) и [экспорты](/docs/use-dbt-semantic-layer/exports), чтобы раскрыть таблицы метрик и размеров в вашей платформе данных и создать пользовательскую интеграцию с такими инструментами, как PowerBI.

 ### Подключение и запрос с помощью Google Sheets

<ConnectQueryAPI/>

### Подключение и запрос с помощью Hex
Этот раздел проведет вас через то, как использовать интеграцию Hex для запроса ваших метрик с помощью Hex. Выберите соответствующую вкладку в зависимости от вашего метода подключения:

<Tabs>
<TabItem value="partner-connect" label="Запрос семантического слоя с помощью Hex" default>

1. Перейдите на [страницу входа Hex](https://app.hex.tech/login). 
2. Войдите или создайте учетную запись (если у вас ее еще нет). 
  - Вы можете создать бесплатные пробные учетные записи Hex с вашим рабочим адресом электронной почты или адресом .edu.
3. В верхнем левом углу вашей страницы нажмите на значок **HEX**, чтобы перейти на главную страницу.
4. Затем нажмите кнопку **+ Новый проект** в правом верхнем углу.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_new.png" width="50%" title="Нажмите кнопку '+ Новый проект' в правом верхнем углу"/>
5. Перейдите в меню слева и выберите **Обозреватель данных**. Затем выберите **Добавить подключение к данным**. 
6. Нажмите **Snowflake**. Дайте вашему подключению данных имя и описание. Вам не нужно вводить учетные данные вашего хранилища данных, чтобы использовать семантический слой.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_new_data_connection.png" width="50%" title="Выберите 'Обозреватель данных', а затем 'Добавить подключение к данным', чтобы подключиться к Snowflake."/>
7. В разделе **Интеграции** переключите переключатель dbt вправо, чтобы включить интеграцию dbt.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_dbt_toggle.png" width="50%" title="Нажмите на переключатель dbt, чтобы включить интеграцию. "/>

8. Введите следующую информацию:
   * Выберите вашу версию dbt как 1.6 или выше
   * Введите ваш идентификатор окружения 
   * Введите ваш токен службы 
   * Убедитесь, что вы нажали на переключатель **Использовать семантический слой**. Таким образом, все запросы будут направлены через dbt.
   * Нажмите **Создать подключение** в правом нижнем углу.
9. Наведите курсор на **Дополнительно** в меню, показанном на следующем изображении, и выберите **Семантический слой dbt**.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_make_sl_cell.png" width="90%" title="Наведите курсор на 'Дополнительно' в меню и выберите 'Семантический слой dbt'."/>

10. Теперь вы должны иметь возможность запрашивать метрики с помощью Hex! Попробуйте сами: 
    - Создайте новую ячейку и выберите метрику. 
    - Отфильтруйте ее по одному или нескольким размерам.
    - Создайте визуализацию.

</TabItem>
<TabItem value="manual-connect" label="Начало работы с семантическим слоем в мастерской">

1. Нажмите на ссылку, предоставленную вам в чате мастерской. 
   - Посмотрите в разделе **Закрепленное сообщение** чата, если вы не видите ее сразу.
2. Введите свой адрес электронной почты в предоставленное текстовое поле. Затем выберите **SQL и Python**, чтобы перейти на главную страницу Hex.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/welcome_to_hex.png" width="70%" title="Главная страница 'Добро пожаловать в Hex'."/>

3. Затем нажмите на фиолетовую кнопку Hex в верхнем левом углу.
4. Нажмите кнопку **Коллекции** в меню слева.
5. Выберите коллекцию **Мастерская семантического слоя**. 
6. Нажмите на коллекцию проекта **Начало работы с семантическим слоем dbt**.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_collections.png" width="80%" title="Нажмите 'Коллекции', чтобы выбрать коллекцию 'Мастерская семантического слоя'."/>

7. Чтобы отредактировать этот блокнот Hex, нажмите кнопку **Дублировать** в выпадающем меню проекта (как показано на следующем изображении). Это создаст новую копию блокнота Hex, которая будет принадлежать вам.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_duplicate.png" width="80%" title="Нажмите кнопку 'Дублировать' в выпадающем меню проекта, чтобы создать копию блокнота Hex."/>

8. Чтобы упростить поиск, переименуйте вашу копию проекта Hex, чтобы включить ваше имя.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_rename.png" width="60%" title="Переименуйте ваш проект Hex, чтобы включить ваше имя."/>

9. Теперь вы должны иметь возможность запрашивать метрики с помощью Hex! Попробуйте сами с помощью следующих примерных запросов:

   - В первой ячейке вы можете увидеть таблицу метрики `order_total` с течением времени. Добавьте метрику `order_count` в эту таблицу.
   - Вторая ячейка показывает линейный график метрики `order_total` с течением времени. Поиграйте с графиком! Попробуйте изменить временной интервал, используя выпадающее меню **Единица времени**.
   - Следующая таблица в блокноте, помеченная "Example_query_2", показывает количество клиентов, сделавших свой первый заказ в определенный день. Создайте новую ячейку графика. Создайте линейный график `first_ordered_at` против `customers`, чтобы увидеть, как количество новых клиентов каждый день меняется с течением времени.
   - Создайте новую ячейку семантического слоя и выберите одну или несколько метрик. Отфильтруйте ваши метрики по одному или нескольким размерам.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/hex_make_sl_cell.png" width="90%" title="Запрашивайте метрики с помощью Hex "/>

</TabItem>
</Tabs>

## Что дальше

<ConfettiTrigger>

Отличная работа по завершению комплексного руководства по семантическому слою dbt 🎉! Вы, надеюсь, получили четкое представление о том, что такое семантический слой dbt, его назначение и когда его использовать в ваших проектах.

Вы узнали, как:

- Настроить вашу среду Snowflake и dbt Cloud, включая создание рабочих листов и загрузку данных.
- Подключить и настроить dbt Cloud с Snowflake.
- Создавать, тестировать и управлять проектами dbt Cloud, сосредоточив внимание на метриках и семантических слоях.
- Запускать производственные задачи и запрашивать метрики с помощью доступных интеграций.

В качестве следующих шагов вы можете начать определять свои собственные метрики и изучить дополнительные параметры конфигурации, такие как [экспорты](/docs/use-dbt-semantic-layer/exports), [заполнение пустых значений](/docs/build/advanced-topics), [реализация dbt Mesh с семантическим слоем](/docs/use-dbt-semantic-layer/sl-faqs#how-can-i-implement-dbt-mesh-with-the-dbt-semantic-layer) и многое другое.

Вот некоторые дополнительные ресурсы, которые помогут вам продолжить ваше путешествие:

- [Часто задаваемые вопросы о семантическом слое dbt](/docs/use-dbt-semantic-layer/sl-faqs)
- [Доступные интеграции](/docs/cloud-integrations/avail-sl-integrations)
- Демонстрация о [том, как определить и запросить метрики с помощью MetricFlow](https://www.loom.com/share/60a76f6034b0441788d73638808e92ac?sid=861a94ac-25eb-4fd8-a310-58e159950f5a)
- [Присоединяйтесь к нашим живым демонстрациям](https://www.getdbt.com/resources/webinars/dbt-cloud-demos-with-experts)

</ConfettiTrigger>