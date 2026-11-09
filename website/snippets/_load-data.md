Данные, используемые в этом разделе, хранятся в виде CSV‑файлов в публичном S3‑бакете. Следующие шаги проведут вас через процесс подготовки аккаунта Snowflake для работы с этими данными и их загрузки.

1. Создайте новый виртуальный warehouse, две новые базы данных (одну для сырых данных, вторую — для будущей разработки в dbt) и две новые схемы (одну для данных `jaffle_shop`, другую — для данных `stripe`).

Для этого введите следующие SQL-команды в редакторе вашего нового SQL-файла Snowflake и нажмите **Run**:
    ```sql
    create warehouse transforming;
    create database raw;
    create database analytics;
    create schema raw.jaffle_shop;
    create schema raw.stripe;
    ```

2. В базе данных `raw` и схемах `jaffle_shop` и `stripe` создайте три таблицы и загрузите в них соответствующие данные:

- Сначала удалите всё содержимое редактора SQL-файла Snowflake, чтобы он стал пустым. Затем выполните эту SQL-команду, чтобы создать таблицу `customer`:

     ```sql 
     create table raw.jaffle_shop.customers 
     ( id integer,
       first_name varchar,
       last_name varchar
     );
     ```

   - Очистите Editor, затем выполните эту команду для загрузки данных в таблицу `customer`:

     ```sql 
     copy into raw.jaffle_shop.customers (id, first_name, last_name)
     from 's3://dbt-tutorial-public/jaffle_shop_customers.csv'
     file_format = (
         type = 'CSV'
         field_delimiter = ','
         skip_header = 1
         ); 
     ```

- Удалите всё содержимое редактора, затем выполните эту команду, чтобы загрузить данные в таблицу `orders`:
        ```sql
        copy into raw.jaffle_shop.orders (id, user_id, order_date, status)
        from 's3://dbt-tutorial-public/jaffle_shop_orders.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            );
        ```
    - Удалите всё содержимое редактора (оставьте его пустым), затем выполните эту команду, чтобы создать таблицу `payment`:
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
    - Удалите всё содержимое редактора, затем выполните эту команду, чтобы загрузить данные в таблицу `payment`:
        ```sql
        copy into raw.stripe.payment (id, orderid, paymentmethod, status, amount, created)
        from 's3://dbt-tutorial-public/stripe_payments.csv'
        file_format = (
            type = 'CSV'
            field_delimiter = ','
            skip_header = 1
            );
        ```
3. Убедитесь, что данные загружены, выполнив эти SQL-запросы. Проверьте, что для каждого из них отображаются результаты. 
    ```sql
    select * from raw.jaffle_shop.customers;
    select * from raw.jaffle_shop.orders;
    select * from raw.stripe.payment;   
    ```
