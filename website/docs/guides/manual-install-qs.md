---
title: "Быстрый старт для dbt Core с ручной установкой"
id: manual-install
description: "Подключение вашего хранилища к dbt Core с использованием CLI."
level: 'Начинающий'
platform: 'dbt-core'
icon: 'fa-light fa-square-terminal'
tags: ['dbt Core','Quickstart']
hide_table_of_contents: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Когда вы используете dbt Core для работы с dbt, вы будете редактировать файлы локально с помощью текстового редактора и запускать проекты с использованием интерфейса командной строки (CLI).

Если вы хотите редактировать файлы и запускать проекты с использованием веб-интерфейса dbt Integrated Development Environment (IDE), обратитесь к [быстрым стартам dbt Cloud](/guides). Вы также можете разрабатывать и запускать команды dbt с помощью [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) — командной строки, поддерживаемой dbt Cloud.

### Предварительные требования

* Для использования dbt Core важно знать некоторые основы работы с терминалом. В частности, вы должны понимать команды `cd`, `ls` и `pwd`, чтобы легко перемещаться по структуре каталогов вашего компьютера.
* Установите dbt Core, следуя [инструкциям по установке](/docs/core/installation-overview) для вашей операционной системы.
* Завершите соответствующие шаги по настройке и загрузке данных в серии Быстрых стартов для dbt Cloud. Например, для BigQuery завершите [Настройка (в BigQuery)](/guides/bigquery?step=2) и [Загрузка данных (BigQuery)](/guides/bigquery?step=3).
* [Создайте учетную запись GitHub](https://github.com/join), если у вас ее еще нет.

### Создание стартового проекта

После настройки BigQuery для работы с dbt вы готовы создать стартовый проект с примерами моделей, прежде чем создавать свои собственные модели.

## Создание репозитория

Следующие шаги используют [GitHub](https://github.com/) в качестве провайдера Git для этого руководства, но вы можете использовать любого провайдера Git. Вы должны уже [создать учетную запись GitHub](https://github.com/join).

1. [Создайте новый репозиторий на GitHub](https://github.com/new) с именем `dbt-tutorial`.
2. Выберите **Public**, чтобы репозиторий можно было делиться с другими. Вы всегда можете сделать его приватным позже.
3. Оставьте значения по умолчанию для всех остальных настроек.
4. Нажмите **Создать репозиторий**.
5. Сохраните команды из "…или создайте новый репозиторий в командной строке" для использования позже в [Зафиксируйте ваши изменения](https://docs.getdbt.com/guides/manual-install?step=6).

## Создание проекта

Узнайте, как использовать серию команд в командной строке терминала для создания вашего проекта. dbt Core включает команду `init`, которая помогает создать каркас проекта dbt.

Чтобы создать ваш проект dbt:

1. Убедитесь, что у вас установлен dbt Core, и проверьте версию с помощью команды `dbt --version`:

```shell
dbt --version
```

2. Инициализируйте проект `jaffle_shop` с помощью команды `init`:

```shell
dbt init jaffle_shop
```

3. Перейдите в каталог вашего проекта:

```shell
cd jaffle_shop
```

4. Используйте `pwd`, чтобы подтвердить, что вы находитесь в правильном месте:

```shell
$ pwd
> Users/BBaggins/dbt-tutorial/jaffle_shop
```

5. Используйте текстовый редактор, такой как Atom или VSCode, чтобы открыть каталог проекта, который вы создали на предыдущих шагах, названный jaffle_shop. Содержимое включает папки и файлы `.sql` и `.yml`, сгенерированные командой `init`.

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

## Подключение к BigQuery

При разработке локально dbt подключается к вашему <Term id="data-warehouse" /> с помощью [профиля](/docs/core/connect-data-platform/connection-profiles), который является YAML-файлом со всеми деталями подключения к вашему хранилищу.

1. Создайте файл в каталоге `~/.dbt/` с именем `profiles.yml`.
2. Переместите ваш ключевой файл BigQuery в этот каталог.
3. Скопируйте следующее и вставьте в новый файл profiles.yml. Убедитесь, что вы обновили значения, где это указано.

<File name='profiles.yml'>

```yaml
jaffle_shop: # это должно соответствовать профилю в вашем файле dbt_project.yml
    target: dev
    outputs:
        dev:
            type: bigquery
            method: service-account
            keyfile: /Users/BBaggins/.dbt/dbt-tutorial-project-331118.json # замените это полным путем к вашему ключевому файлу
            project: grand-highway-265418 # Замените это на ваш идентификатор проекта
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

### Часто задаваемые вопросы

<FAQ path="Warehouse/sample-profiles" alt_header="Моя команда по работе с данными использует другое хранилище данных. Как должен выглядеть мой файл profiles.yml для моего хранилища?"/>
<FAQ path="Project/separate-profile" />
<FAQ path="Environments/profile-name" />
<FAQ path="Environments/target-names" />
<FAQ path="Environments/profile-env-vars" />

## Выполните ваш первый запуск dbt

Наш образец проекта содержит несколько примеров моделей. Мы собираемся проверить, можем ли мы их запустить, чтобы подтвердить, что все в порядке.

1. Введите команду `run`, чтобы построить примеры моделей:

```shell
dbt run
```

Вы должны получить вывод, который выглядит следующим образом:

<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/successful-dbt-run.png" title="Успешная команда dbt run" />
</div>

## Зафиксируйте ваши изменения

Зафиксируйте ваши изменения, чтобы репозиторий содержал последний код.

1. Свяжите репозиторий GitHub, который вы создали, с вашим проектом dbt, выполнив следующие команды в терминале. Убедитесь, что вы используете правильный git URL для вашего репозитория, который вы должны были сохранить на шаге 5 в [Создание репозитория](https://docs.getdbt.com/guides/manual-install?step=2).

```shell
git init
git branch -M main
git add .
git commit -m "Создание проекта dbt"
git remote add origin https://github.com/USERNAME/dbt-tutorial.git
git push -u origin main
```

2. Вернитесь в ваш репозиторий GitHub, чтобы убедиться, что ваши новые файлы были добавлены.

### Создание ваших первых моделей

Теперь, когда вы настроили свой образец проекта, вы можете перейти к интересной части — [созданию моделей](/docs/build/sql-models)! 
В следующих шагах вы возьмете пример запроса и превратите его в модель в вашем проекте dbt.

## Создание новой ветки git

Создайте новую ветку git, чтобы работать над новым кодом:

1. Создайте новую ветку, используя команду `checkout` и передав флаг `-b`:

```shell
$ git checkout -b add-customers-model
>  Переключено на новую ветку `add-customer-model`
```

## Создание вашей первой модели

1. Откройте ваш проект в любимом текстовом редакторе.
2. Создайте новый SQL файл в каталоге `models`, названный `models/customers.sql`.
3. Вставьте следующий запрос в файл `models/customers.sql`.

<Snippet path="tutorial-sql-query" />

4. Введите `dbt run` из командной строки.
<div style={{maxWidth: '400px'}}>
<Lightbox src="/img/first-model-dbt-cli.png" title="Успешный запуск с помощью dbt Core CLI" />
</div>

Когда вы вернетесь в консоль BigQuery, вы сможете выполнить `select` из этой модели.

### Часто задаваемые вопросы

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

### Часто задаваемые вопросы {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="Как мне организовать свой проект, когда я создаю больше моделей? Как мне называть свои модели?" />

### Следующие шаги

<Snippet path="tutorial-next-steps-1st-model" />

Вы также можете исследовать:

* Каталог `target`, чтобы увидеть весь скомпилированный SQL. Каталог `run` показывает команды создания или замены таблиц, которые выполняются, а именно запросы, обернутые в правильный DDL.
* Файл `logs`, чтобы увидеть, как dbt Core ведет журнал всех действий, происходящих в вашем проекте. Он показывает выполняемые запросы и ведет журнал Python, когда выполняется dbt.

## Добавление тестов к вашим моделям

<Snippet path="tutorial-add-tests-to-models" />

## Документирование ваших моделей

<Snippet path="tutorial-document-your-models" />

3. Запустите команду `dbt docs serve`, чтобы запустить документацию на локальном сайте.

#### Часто задаваемые вопросы

<FAQ path="Docs/long-descriptions" />
<FAQ path="Docs/sharing-documentation" />


#### Следующие шаги

<Snippet path="tutorial-next-steps-tests" />

## Зафиксируйте обновленные изменения

Вам нужно зафиксировать изменения, которые вы внесли в проект, чтобы репозиторий содержал ваш последний код.

1. Добавьте все ваши изменения в git: `git add -A`
2. Зафиксируйте ваши изменения: `git commit -m "Добавить модель клиентов, тесты, документацию"`
3. Отправьте ваши изменения в ваш репозиторий: `git push`
4. Перейдите в ваш репозиторий и откройте запрос на слияние, чтобы объединить код в вашу основную ветку.

## Запланируйте задачу

Мы рекомендуем использовать dbt Cloud как самый простой и надежный способ [развертывания задач](/docs/deploy/deployments) и автоматизации вашего проекта dbt в производственной среде.

Для получения дополнительной информации о том, как начать, обратитесь к [созданию и планированию задач](/docs/deploy/deploy-jobs#create-and-schedule-jobs).

<Lightbox src="/img/docs/dbt-cloud/deployment/run-overview.jpg" width="90%" title="Обзор выполнения задачи dbt Cloud, который включает детали выполнения задачи, тип триггера, SHA коммита, имя окружения, подробные шаги выполнения, журналы и многое другое."/>

Для получения дополнительной информации о том, как использовать dbt Core для планирования задачи, обратитесь к [блогу dbt airflow](/blog/dbt-airflow-spiritual-alignment).

</div>