Данные хранятся в CSV-файлах в публичном бакете S3. Подготовьте аккаунт Snowflake и загрузите данные по инструкции ниже.

1. Создайте виртуальное хранилище, две базы данных (для сырых данных и для разработки в dbt) и две схемы (для данных `jaffle_shop` и `stripe`).

    Введите следующие SQL-команды в редакторе нового SQL-файла Snowflake и нажмите **Run**:
    ```sql
    create warehouse transforming;
    create database raw;
    create database analytics;
    create schema raw.jaffle_shop;
    create schema raw.stripe;
    ```

2. В базе данных `raw` и схемах `jaffle_shop` и `stripe` создайте три таблицы и загрузите в них данные:

    - Очистите редактор SQL-файла Snowflake и выполните команду создания таблицы `customers`:

        ```sql
        create table raw.jaffle_shop.customers
        ( id integer,
          first_name varchar,
          last_name varchar
        );
        ```

    - Очистите редактор и выполните команду загрузки данных в таблицу `customers`:

        ```sql
        copy into raw.jaffle_shop.customers (id, first_name, last_name)
        from 's3://dbt-tutorial-public/jaffle_shop_customers.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            );
        ```
    - Очистите редактор и выполните команду создания таблицы `orders`:
        ```sql
        create table raw.jaffle_shop.orders
        ( id integer,
          user_id integer,
          order_date date,
          status varchar,
          _etl_loaded_at timestamp default current_timestamp
        );
        ```

    - Очистите редактор и выполните команду загрузки данных в таблицу `orders`:
        ```sql
        copy into raw.jaffle_shop.orders (id, user_id, order_date, status)
        from 's3://dbt-tutorial-public/jaffle_shop_orders.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            );
        ```
    - Очистите редактор и выполните команду создания таблицы `payment`:
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
    - Очистите редактор и выполните команду загрузки данных в таблицу `payment`:
        ```sql
        copy into raw.stripe.payment (id, orderid, paymentmethod, status, amount, created)
        from 's3://dbt-tutorial-public/stripe_payments.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            );
        ```
3. Убедитесь, что данные загружены. Выполните следующие запросы и проверьте, что каждый возвращает строки:
    ```sql
    select * from raw.jaffle_shop.customers;
    select * from raw.jaffle_shop.orders;
    select * from raw.stripe.payment;
    ```
