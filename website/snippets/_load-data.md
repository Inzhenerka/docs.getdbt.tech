Данные, используемые в этом разделе, хранятся в виде CSV‑файлов в публичном S3‑бакете. Следующие шаги проведут вас через процесс подготовки аккаунта Snowflake для работы с этими данными и их загрузки.

1. Создайте новый виртуальный warehouse, две новые базы данных (одну для сырых данных, вторую — для будущей разработки в dbt) и две новые схемы (одну для данных `jaffle_shop`, другую — для данных `stripe`).

   Для этого выполните следующие SQL‑команды: введите их в Editor нового worksheet в Snowflake и нажмите **Run** в правом верхнем углу интерфейса:
   ```sql
   create warehouse transforming;
   create database raw;
   create database analytics;
   create schema raw.jaffle_shop;
   create schema raw.stripe;
   ```

2. В базе данных `raw` и схемах `jaffle_shop` и `stripe` создайте три таблицы и загрузите в них соответствующие данные:

   - Сначала удалите всё содержимое (очистите Editor) в worksheet Snowflake. Затем выполните следующую SQL‑команду для создания таблицы `customer`:

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

   - Очистите Editor (оставьте его пустым), затем выполните эту команду для создания таблицы `orders`:
     ```sql
     create table raw.jaffle_shop.orders
     ( id integer,
       user_id integer,
       order_date date,
       status varchar,
       _etl_loaded_at timestamp default current_timestamp
     );
     ```

   - Очистите Editor, затем выполните эту команду для загрузки данных в таблицу `orders`:
     ```sql
     copy into raw.jaffle_shop.orders (id, user_id, order_date, status)
     from 's3://dbt-tutorial-public/jaffle_shop_orders.csv'
     file_format = (
         type = 'CSV'
         field_delimiter = ','
         skip_header = 1
         );
     ```

   - Очистите Editor (оставьте его пустым), затем выполните эту команду для создания таблицы `payment`:
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

   - Очистите Editor, затем выполните эту команду для загрузки данных в таблицу `payment`:
     ```sql
     copy into raw.stripe.payment (id, orderid, paymentmethod, status, amount, created)
     from 's3://dbt-tutorial-public/stripe_payments.csv'
     file_format = (
         type = 'CSV'
         field_delimiter = ','
         skip_header = 1
         );
     ```

3. Убедитесь, что данные успешно загружены, выполнив следующие SQL‑запросы. Подтвердите, что для каждого из них отображается результат:
   ```sql
   select * from raw.jaffle_shop.customers;
   select * from raw.jaffle_shop.orders;
   select * from raw.stripe.payment;   
   ```
