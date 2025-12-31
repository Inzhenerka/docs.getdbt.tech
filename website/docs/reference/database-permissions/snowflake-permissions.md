---
title: "Разрешения в Snowflake"
---

В Snowflake разрешения используются для управления тем, кто может выполнять определенные действия с различными объектами базы данных. Используйте SQL-операторы для управления разрешениями в базе данных Snowflake.

## Настройка учетной записи Snowflake {#set-up-snowflake-account}

В этом разделе объясняется, как настроить разрешения и роли в Snowflake. В Snowflake вы выполняете эти действия с помощью SQL-команд и настраиваете ваш хранилище данных и контроль доступа в экосистеме Snowflake.

1. Настройка баз данных
```
use role sysadmin;
create database raw;
create database analytics;
```
2. Настройка хранилищ
```
create warehouse loading
    warehouse_size = xsmall
    auto_suspend = 3600
    auto_resume = false
    initially_suspended = true;

create warehouse transforming
    warehouse_size = xsmall
    auto_suspend = 60
    auto_resume = true
    initially_suspended = true;

create warehouse reporting
    warehouse_size = xsmall
    auto_suspend = 60
    auto_resume = true
    initially_suspended = true;
```

3. Настройка ролей и разрешений на хранилища
```
use role securityadmin;

create role loader;
grant all on warehouse loading to role loader; 

create role transformer;
grant all on warehouse transforming to role transformer;

create role reporter;
grant all on warehouse reporting to role reporter;
```

4. Создание пользователей и назначение им ролей

Каждому человеку и приложению создается отдельный пользователь и назначается соответствующая роль.

```
create user stitch_user -- или fivetran_user
    password = '_generate_this_'
    default_warehouse = loading
    default_role = loader; 

create user claire -- или amy, jeremy и т.д.
    password = '_generate_this_'
    default_warehouse = transforming
    default_role = transformer
    must_change_password = true;

create user dbt_cloud_user
    password = '_generate_this_'
    default_warehouse = transforming
    default_role = transformer;

create user looker_user -- или mode_user и т.д.
    password = '_generate_this_'
    default_warehouse = reporting
    default_role = reporter;

-- затем назначьте эти роли каждому пользователю
grant role loader to user stitch_user; -- или fivetran_user
grant role transformer to user dbt_cloud_user;
grant role transformer to user claire; -- или amy, jeremy
grant role reporter to user looker_user; -- или mode_user, periscope_user
```

5. Разрешить загрузчику загружать данные

Дайте роли одностороннее разрешение на работу с базой данных raw
```
use role sysadmin;
grant all on database raw to role loader;
```

6. Разрешить трансформатору преобразовывать данные

Роль трансформатора должна иметь возможность читать необработанные данные.

Если вы делаете это до загрузки данных, вы можете выполнить:
```
grant usage on database raw to role transformer;
grant usage on future schemas in database raw to role transformer;
grant select on future tables in database raw to role transformer;
grant select on future views in database raw to role transformer;
```
Если данные уже загружены в базу данных raw, убедитесь, что вы также выполнили следующее для обновления разрешений
```
grant usage on all schemas in database raw to role transformer;
grant select on all tables in database raw to role transformer;
grant select on all views in database raw to role transformer;
```
Трансформатор также должен иметь возможность создавать в базе данных analytics:
```
grant all on database analytics to role transformer;
```
7. Разрешить репортеру читать преобразованные данные

Предыдущая версия этой статьи рекомендовала реализовать это через хуки в dbt, но этот способ позволяет обойтись однократным оператором.
```
grant usage on database analytics to role reporter;
grant usage on future schemas in database analytics to role reporter;
grant select on future tables in database analytics to role reporter;
grant select on future views in database analytics to role reporter;
```
Снова, если у вас уже есть данные в базе данных analytics, убедитесь, что вы выполнили:
```
grant usage on all schemas in database analytics to role reporter;
grant select on all tables in database analytics to role reporter;
grant select on all views in database analytics to role reporter;
```
8. Поддержка

Когда добавляются новые пользователи, убедитесь, что вы добавили их в правильную роль! Все остальное должно наследоваться автоматически благодаря этим `future` разрешениям.

Для более подробного обсуждения и информации о предыдущих версиях, обратитесь к [этой статье на Discourse](https://discourse.getdbt.com/t/setting-up-snowflake-the-exact-grant-statements-we-run/439).

## Пример разрешений в Snowflake {#example-snowflake-permissions}

Следующий пример предоставляет вам SQL-операторы, которые вы можете использовать для управления разрешениями.

**Обратите внимание**, что `warehouse_name`, `database_name` и `role_name` являются заполнителями, и вы можете заменить их в соответствии с принятой в вашей организации конвенцией именования.

```

grant all on warehouse warehouse_name to role role_name;
grant usage on database database_name to role role_name;
grant create schema on database database_name to role role_name; 
grant usage on schema database.an_existing_schema to role role_name;
grant create table on schema database.an_existing_schema to role role_name;
grant create view on schema database.an_existing_schema to role role_name;
grant usage on future schemas in database database_name to role role_name;
grant monitor on future schemas in database database_name to role role_name;
grant select on future tables in database database_name to role role_name;
grant select on future views in database database_name to role role_name;
grant usage on all schemas in database database_name to role role_name;
grant monitor on all schemas in database database_name to role role_name;
grant select on all tables in database database_name to role role_name;
grant select on all views in database database_name to role role_name;
```