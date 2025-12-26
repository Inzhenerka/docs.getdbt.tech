---
title: "Разрешения в Redshift"
---

В Redshift разрешения используются для управления тем, кто может выполнять определенные действия с различными объектами базы данных. Используйте SQL-запросы для управления разрешениями в базе данных Redshift.

## Пример разрешений в Redshift

Следующий пример предоставляет вам SQL-запросы, которые можно использовать для управления разрешениями.

```
grant create schema on database database_name to user_name;
grant usage on schema database.schema_name to user_name;
grant create table on schema database.schema_name to user_name;
grant create view on schema database.schema_name to user_name;
grant usage for schemas in database database_name to role role_name;
grant select on all tables in database database_name to user_name;
grant select on all views in database database_name to user_name;
```

Чтобы подключиться к базе данных, уточните у администратора, что ваша роль или группа пользователей добавлена в базу данных. Обратите внимание, что система прав доступа в Redshift отличается от Postgres, и такие команды, как [`grant connect`](https://www.postgresql.org/docs/current/sql-grant.html), в Redshift не поддерживаются.

Подробнее см. в [официальной документации](https://docs.aws.amazon.com/redshift/latest/dg/r_GRANT.html).
