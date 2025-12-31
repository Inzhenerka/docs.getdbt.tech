---
title: "Быстрый старт для dbt Core с ручной установкой"
id: manual-install
description: "Подключение вашего хранилища к dbt Core с использованием CLI."
level: 'Beginner'
platform: 'dbt-core'
icon: 'square-terminal'
tags: ['dbt Core','Quickstart']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

Когда вы используете <Constant name="core" /> для работы с dbt, вы будете редактировать файлы локально с помощью редактора кода и запускать проекты через интерфейс командной строки (CLI).

Если вы хотите редактировать файлы и запускать проекты с использованием веб‑ориентированной интегрированной среды разработки dbt (<Constant name="cloud_ide" />), обратитесь к [кратким руководствам <Constant name="cloud" />](/guides). Вы также можете разрабатывать и выполнять команды dbt с помощью [CLI <Constant name="cloud" />](/docs/cloud/cloud-cli-installation) &mdash; командной строки, работающей на базе <Constant name="cloud" />.

### Предварительные требования {#prerequisites}

* Чтобы использовать dbt Core, важно знать основы работы с Терминалом. В частности, вы должны понимать, как работают команды `cd`, `ls` и `pwd`, чтобы легко перемещаться по структуре каталогов на вашем компьютере.
* Установите <Constant name="core" /> с помощью [инструкций по установке](/docs/core/installation-overview) для вашей операционной системы.
* Выполните соответствующие шаги по настройке и загрузке данных в разделе Quickstart для серии <Constant name="cloud" />. Например, для BigQuery выполните шаги [Setting up (in BigQuery)](/guides/bigquery?step=2) и [Loading data (BigQuery)](/guides/bigquery?step=3).
* [Создайте аккаунт GitHub](https://github.com/join), если у вас его ещё нет.

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

Узнайте, как использовать серию команд в командной строке Терминала для создания вашего проекта. dbt Core включает команду `init`, которая помогает создать каркас проекта dbt.

Чтобы создать ваш dbt проект:

1. Убедитесь, что dbt Core установлен, и проверьте версию с помощью команды `dbt --version`:

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

5. Используйте текстовый редактор, такой как Atom или VSCode, чтобы открыть директорию проекта, которую вы создали на предыдущих шагах, и которую мы назвали jaffle_shop. Содержимое включает папки и файлы `.sql` и `.yml`, сгенерированные командой `init`.

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

При локальной разработке dbt подключается к вашему <Term id="data-warehouse" /> с использованием [профиля](/docs/core/connect-data-platform/connection-profiles), который является YAML файлом со всеми деталями подключения к вашему хранилищу.

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
            keyfile: /Users/BBaggins/.dbt/dbt-tutorial-project-331118.json # замените это на полный путь к вашему ключевому файлу
            project: grand-highway-265418 # Замените это на ваш project id
            dataset: dbt_bbagins # Замените это на dbt_ваше_имя, например, dbt_bilbo
            threads: 1
            timeout_seconds: 300
            location: US
            priority: interactive
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

1. Откройте ваш проект в вашем любимом текстовом редакторе.
2. Создайте новый SQL файл в директории `models`, названный `models/customers.sql`.
3. Вставьте следующий запрос в файл `models/customers.sql`.

<Snippet path="tutorial-sql-query" />

4. Из командной строки введите `dbt run`.
<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/first-model-dbt-cli.png" title="Успешный запуск с dbt Core CLI" />
</div>

Когда вы вернетесь в консоль BigQuery, вы можете выполнить `select` из этой модели.

### Часто задаваемые вопросы {#faqs-1}

<FAQ path="Runs/checking-logs" />
<FAQ path="Project/which-schema" />
<FAQ path="Models/create-a-schema" />
<FAQ path="Models/run-downtime" />
<FAQ path="Troubleshooting/sql-errors" />

## Измените способ материализации вашей модели {#change-the-way-your-model-is-materialized}

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

* Директорию `target`, чтобы увидеть весь скомпилированный SQL. Директория `run` показывает операторы create или replace table, которые выполняются, это операторы select, обернутые в правильный DDL.
* Файл `logs`, чтобы увидеть, как dbt Core регистрирует все действия, происходящие в вашем проекте. Он показывает операторы select, которые выполняются, и python логирование, происходящее при выполнении dbt.

## Добавьте тесты к вашим моделям {#add-tests-to-your-models}

<Snippet path="tutorial-add-tests-to-models" />

## Документируйте ваши модели {#document-your-models}

<Snippet path="tutorial-document-your-models" />

3. Выполните команду `dbt docs serve`, чтобы запустить документацию на локальном веб-сайте.

#### Часто задаваемые вопросы {#faqs-2}

<FAQ path="Docs/long-descriptions" />
<FAQ path="Docs/sharing-documentation" />

#### Следующие шаги {#next-steps-1}

<Snippet path="tutorial-next-steps-tests" />

## Зафиксируйте обновленные изменения {#commit-updated-changes}

Вам нужно зафиксировать изменения, которые вы внесли в проект, чтобы репозиторий содержал ваш последний код.

1. Добавьте все ваши изменения в git: `git add -A`
2. Зафиксируйте ваши изменения: `git commit -m "Add customers model, tests, docs"`
3. Отправьте ваши изменения в ваш репозиторий: `git push`
4. Перейдите в ваш репозиторий и откройте pull request, чтобы объединить код в вашу основную ветку.

## Запланируйте задание {#schedule-a-job}

Мы рекомендуем использовать <Constant name="cloud" /> как самый простой и надёжный способ [развёртывания заданий](/docs/deploy/deployments) и автоматизации вашего dbt‑проекта в продакшене.

Для получения дополнительной информации о том, как начать, обратитесь к [созданию и планированию заданий](/docs/deploy/deploy-jobs#create-and-schedule-jobs).

<Lightbox src="/img/docs/dbt-cloud/deployment/run-overview.png" width="90%" title="Обзор выполнения задания dbt, который включает сведения о запуске задания, тип триггера, commit SHA, имя окружения, подробные шаги выполнения, логи и многое другое."/>

Для получения дополнительной информации об использовании <Constant name="core" /> для планирования задания см. запись в блоге [dbt airflow](/blog/dbt-airflow-spiritual-alignment).

</div>