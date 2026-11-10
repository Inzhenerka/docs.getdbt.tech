---
title: "Быстрый старт с dbt при ручной установке"
id: manual-install
description: "Подключение вашего хранилища данных к dbt с помощью CLI."
level: 'Beginner'
platform: 'dbt'
icon: 'square-terminal'
tags: ['Quickstart']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

При использовании <Constant name="dbt" />, установленного вручную, вы будете редактировать файлы локально в редакторе кода и запускать проекты через интерфейс командной строки (CLI). 

Если вы хотите редактировать файлы и запускать проекты в веб-среде интегрированной разработки dbt (<Constant name="studio_ide" />), обратитесь к [руководствам по быстрому началу работы с <Constant name="dbt" />](/guides). Вы также можете разрабатывать проекты и выполнять команды dbt с помощью [<Constant name="dbt" /> CLI](/docs/platform/dbt-cli-installation) &mdash; интерфейса командной строки на базе <Constant name="dbt" />.

### Предварительные требования {#prerequisites}

* Для работы с <Constant name="dbt" /> важно знать основы работы с терминалом. В частности, вы должны понимать, как использовать команды `cd`, `ls` и `pwd`, чтобы легко перемещаться по структуре каталогов вашего компьютера.
* Установите <Constant name="dbt" />, следуя [инструкциям по установке](/docs/local/install-dbt) для вашей операционной системы.
* Выполните соответствующие шаги по настройке и загрузке данных из серии руководств по быстрому началу работы с <Constant name="dbt" />. Например, для BigQuery выполните шаги [Настройка (в BigQuery)](/guides/bigquery?step=2) и [Загрузка данных (BigQuery)](/guides/bigquery?step=3).
* [Создайте учетную запись GitHub](https://github.com/join), если у вас ее еще нет.

### Создание стартового проекта {#create-a-starter-project}

После настройки BigQuery для работы с dbt вы готовы создать стартовый проект с примерами моделей, прежде чем создавать собственные модели.

## Создание репозитория {#create-a-repository}

В следующих шагах в качестве <Constant name="git" />‑провайдера для этого руководства используется [GitHub](https://github.com/), но вы можете использовать любой <Constant name="git" />‑провайдер. Предполагается, что вы уже [создали аккаунт GitHub](https://github.com/join).

1. [Создайте новый репозиторий GitHub](https://github.com/new) с именем `dbt-tutorial`.
2. Выберите один из следующих вариантов (вы всегда сможете изменить эту настройку позже):
    - **Private (рекомендуется):** для защиты вашей среды и предотвращения публикации приватной информации (например, учетных данных).
    - **Public:** если вам нужно легко сотрудничать и делиться проектом с другими, особенно за пределами вашей организации.

3. Оставьте значения по умолчанию для всех остальных настроек.
4. Нажмите **Create repository**.
5. Сохраните команды из раздела «…or create a new repository on the command line», чтобы использовать их позже в шаге [Commit your changes](/guides/manual-install?step=6).

## Создание проекта {#create-a-project}

Узнайте, как создать проект с помощью последовательности команд в командной строке терминала. <Constant name="dbt" /> включает команду `init`, которая помогает создать начальную структуру проекта dbt.

Чтобы создать ваш dbt проект:

1. Убедитесь, что у вас установлен <Constant name="dbt" />, и проверьте версию с помощью команды `dbt --version`:

```shell
dbt --version
```

2. Инициализируйте проект `jaffle_shop` с помощью команды `init`:

```shell
dbt init jaffle_shop
```

3. Перейдите в директорию вашего проекта:

```shell
cd jaffle_shop
```

4. Используйте `pwd`, чтобы убедиться, что вы находитесь в нужном месте:

```shell
$ pwd
> Users/BBaggins/dbt-tutorial/jaffle_shop
```

5. Откройте каталог проекта, созданный на предыдущих шагах и названный jaffle_shop, в редакторе кода, например VS Code. В нём находятся папки, а также файлы `.sql` и `.yml`, созданные командой `init`.

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/starter-project-dbt-cli.png" title="Стартовый проект в текстовом редакторе" />
</div>

6. dbt предоставляет следующие значения в файле `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
name: jaffle_shop # Измените с значения по умолчанию, `my_new_project`

...

profile: jaffle_shop # Измените с имени профиля по умолчанию, `default`

...

models:
    jaffle_shop: # Измените с `my_new_project`, чтобы соответствовать предыдущему значению для `name:`
    ...
```

</File>

## Подключение к BigQuery {#connect-to-bigquery}

При локальной разработке dbt подключается к вашему <Term id="data-warehouse" /> с помощью [профиля](/docs/local/profiles.yml) — YAML-файла, содержащего все параметры подключения к вашему хранилищу данных.

1. Создайте файл в директории `~/.dbt/` с именем `profiles.yml`.
2. Переместите ваш ключевой файл BigQuery в эту директорию.
3. Скопируйте следующее и вставьте в новый файл profiles.yml. Убедитесь, что вы обновили значения, где это указано.

<File name='profiles.yml'>

```yaml
jaffle_shop: # это должно совпадать с профилем в вашем файле dbt_project.yml
    target: dev
    outputs:
        dev:
            type: bigquery
            method: service-account
keyfile: /Users/BBAGGINS/.dbt/KEYFILE_NAME.json # Замените на полный путь к вашему файлу ключа
            database: GCP_PROJECT_ID # Идентификатор вашего проекта Google Cloud
            schema: dbt_YOUR_NAME # Ваш набор данных для разработки, например dbt_bbaggins
            threads: 4
            location: US # Должно совпадать с расположением ваших наборов данных BigQuery
```

</File>

4. Запустите команду `debug` из вашего проекта, чтобы подтвердить, что вы можете успешно подключиться:

```shell
$ dbt debug
> Connection test: OK connection ok
```

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/successful-dbt-debug.png" title="Успешная команда dbt debug" />
</div>

### Часто задаваемые вопросы {#faqs}

<FAQ path="Warehouse/sample-profiles" alt_header="Моя команда данных использует другое хранилище данных. Как должен выглядеть мой файл profiles.yml для моего хранилища?" />
<FAQ path="Project/separate-profile" />
<FAQ path="Environments/profile-name" />
<FAQ path="Environments/target-names" />
<FAQ path="Environments/profile-env-vars" />

## Выполнение вашего первого dbt run {#perform-your-first-dbt-run}

Наш пример проекта содержит некоторые примерные модели. Мы проверим, можем ли мы их запустить, чтобы убедиться, что все в порядке.

1. Введите команду `run`, чтобы построить примерные модели:

```shell
dbt run
```

Вы должны получить вывод, который выглядит следующим образом:

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/successful-dbt-run.png" title="Успешная команда dbt run" />
</div>

## Зафиксируйте ваши изменения {#commit-your-changes}

Зафиксируйте ваши изменения, чтобы репозиторий содержал последний код.

1. Свяжите созданный вами репозиторий GitHub с вашим проектом dbt, выполнив следующие команды в Terminal. Убедитесь, что вы используете корректный git URL вашего репозитория, который вы должны были сохранить на шаге 5 в разделе [Create a repository](/guides/manual-install?step=2).

```shell
git init
git branch -M main
git add .
git commit -m "Create a dbt project"
git remote add origin https://github.com/USERNAME/dbt-tutorial.git
git push -u origin main
```

2. Вернитесь в ваш репозиторий GitHub, чтобы убедиться, что ваши новые файлы были добавлены.

### Создайте ваши первые модели {#build-your-first-models}

Теперь, когда вы настроили ваш примерный проект, вы можете перейти к интересной части — [созданию моделей](/docs/build/sql-models)!
В следующих шагах вы возьмете пример запроса и превратите его в модель в вашем проекте dbt.

## Переключитесь на новую ветку git {#checkout-a-new-git-branch}

Переключитесь на новую ветку git, чтобы работать над новым кодом:

1. Создайте новую ветку, используя команду `checkout` и передав флаг `-b`:

```shell
$ git checkout -b add-customers-model
>  Switched to a new branch `add-customer-model`
```

## Создайте вашу первую модель {#build-your-first-model}

Если вы хотите использовать ИИ для создания своей первой модели, ознакомьтесь с разделом <a id="qs-jump-to-build-with-ai" href="#build-it-with-ai-using-dbt-wizard">Создание модели с помощью dbt Wizard</a> ниже.


1. Откройте свой проект в предпочитаемом редакторе кода.
2. Создайте новый SQL-файл в каталоге `models` с именем `models/customers.sql`.
3. Вставьте следующий запрос в файл `models/customers.sql`.

<Snippet path="tutorial-sql-query" />

4. Из командной строки введите `dbt run`.
<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/first-model-dbt-cli.png" title="Успешное выполнение dbt из командной строки" />
</div>

Когда вы вернетесь в консоль BigQuery, вы можете выполнить `select` из этой модели.

### Часто задаваемые вопросы {#faqs-1}

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

<Snippet path="quickstarts/build-first-model-with-wizard-cli" />

## Измените способ материализации вашей модели

<Snippet path="quickstarts/change-way-model-materialized" />

## Удалите примерные модели {#delete-the-example-models}

<Snippet path="quickstarts/delete-example-models" />

## Постройте модели на основе других моделей {#build-models-on-top-of-other-models}

<Snippet path="quickstarts/intro-build-models-atop-other-models" />

1. Создайте новый SQL файл, `models/stg_customers.sql`, с SQL из CTE `customers` в нашем оригинальном запросе.
2. Создайте второй новый SQL файл, `models/stg_orders.sql`, с SQL из CTE `orders` в нашем оригинальном запросе.

<WHCode>

<div warehouse="BigQuery">

<File name='models/stg_customers.sql'>

```sql
select
    id as customer_id,
    first_name,
    last_name

from `dbt-tutorial`.jaffle_shop.customers
```

</File>

<File name='models/stg_orders.sql'>

```sql
select
    id as order_id,
    user_id as customer_id,
    order_date,
    status

from `dbt-tutorial`.jaffle_shop.orders
```

</File>

</div>

<div warehouse="Databricks">

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

</div>

<div warehouse="Redshift">

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

</div>

<div warehouse="Snowflake">

<File name='models/stg_customers.sql'>

```sql
select
    id as customer_id,
    first_name,
    last_name

from raw.jaffle_shop.customers
```

</File>

<File name='models/stg_orders.sql'>

```sql
select
    id as order_id,
    user_id as customer_id,
    order_date,
    status

from raw.jaffle_shop.orders
```

</File>

</div>

</WHCode>

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

### Часто задаваемые вопросы {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="Как я должен организовать свой проект по мере создания большего количества моделей? Как я должен называть свои модели?" />

### Следующие шаги {#next-steps}

<Snippet path="tutorial-next-steps-1st-model" />

Вы также можете исследовать:

* Каталог `target`, чтобы просмотреть весь скомпилированный SQL. В каталоге `run` находятся выполняемые операторы create or replace table — это операторы select, обёрнутые в соответствующий DDL.
* Файл `logs`, чтобы посмотреть, как <Constant name="dbt" /> записывает в журнал все действия, происходящие в вашем проекте. В нём отображаются выполняемые операторы select и другие сообщения журнала, выводимые при запуске dbt.

## Добавьте тесты к вашим моделям {#add-tests-to-your-models}

<Snippet path="tutorial-add-tests-to-models" />

### Следующие шаги

<Snippet path="tutorial-next-steps-tests" />

## Документируйте свои модели

[Документация](/docs/build/documentation) позволяет подробно описывать модели и делиться этими сведениями с командой. Добавим описания в проект:

Обновите файл `models/schema.yml`, добавив описания, например приведённые ниже.

    <File name='models/schema.yml'>

    ```yaml
    version: 2

    models:
      - name: customers
        description: Одна запись на каждого клиента
        columns:
          - name: customer_id
            description: Первичный ключ
            data_tests:
              - unique
              - not_null
          - name: first_order_date
            description: NULL, если клиент ещё не сделал ни одного заказа.

      - name: stg_customers
        description: Эта модель очищает данные о клиентах
        columns:
          - name: customer_id
            description: Первичный ключ
            data_tests:
              - unique
              - not_null

      - name: stg_orders
        description: Эта модель очищает данные о заказах
        columns:
          - name: order_id
            description: Первичный ключ
            data_tests:
              - unique
              - not_null
          - name: status
            data_tests:
              - accepted_values:
                  arguments: # доступно в версии v1.10.5 и выше. В более ранних версиях <argument_name> можно задать как свойство верхнего уровня.
                    values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
          - name: customer_id
            data_tests:
              - not_null
              - relationships:
                  arguments:
                    to: ref('stg_customers')
                    field: customer_id
    ```

    </File>

1. Выполните `dbt docs generate`, чтобы скомпилировать артефакты, необходимые для статического сайта документации вашего проекта.
2. Выполните `dbt docs serve`, чтобы открыть документацию на локальном веб-сайте.

### Часто задаваемые вопросы

<FAQ path="Docs/long-descriptions" />
<FAQ path="Docs/sharing-documentation" />

## Создайте коммит с обновлёнными изменениями

Вам нужно зафиксировать изменения, которые вы внесли в проект, чтобы репозиторий содержал ваш последний код.

1. Добавьте все изменения в git: `git add -A`
2. Создайте коммит с изменениями: `git commit -m "Add customers model, tests, docs"`
3. Отправьте изменения в свой репозиторий: `git push -u origin add-customers-model`
4. Перейдите в свой репозиторий и откройте пул-реквест, чтобы объединить код с веткой master.

## Запланируйте задание {#schedule-a-job}

Мы рекомендуем использовать <Constant name="dbt_platform" /> как самый простой и надёжный способ [запускать задания](/docs/deploy/deployments) и автоматизировать ваш проект dbt в промышленной среде.

Для получения дополнительной информации о том, как начать, обратитесь к [созданию и планированию заданий](/docs/deploy/deploy-jobs#create-and-schedule-jobs).

<Lightbox src="/img/docs/dbt-platform/deployment/run-overview.png" width="90%" title="Обзор запуска задания dbt, включая сведения о запуске, тип триггера, SHA коммита, имя среды, подробные шаги выполнения, журналы и многое другое."/>

Чтобы самостоятельно настроить расписание заданий с помощью оркестратора, например Airflow, обратитесь к статье в блоге [dbt и Airflow](/blog/dbt-airflow-spiritual-alignment).

<Snippet path="quickstarts/connect-your-ai" />

</div>