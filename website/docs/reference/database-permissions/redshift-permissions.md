---
title: "Разрешения в Redshift"
---

В Redshift разрешения используются для управления тем, кто может выполнять определенные действия с различными объектами базы данных. Используйте SQL-запросы для управления разрешениями в базе данных Redshift.

## Пример разрешений в Redshift

Следующий пример предоставляет вам SQL-запросы, которые можно использовать для управления разрешениями.

**Обратите внимание**, что `database_name`, `database.schema_name` и `user_name` являются заполнителями, и вы можете заменить их в соответствии с принятой в вашей организации системой именования.

```
grant usage on database database_name to user_name;
grant create schema on database database_name to user_name;
grant usage on schema database.schema_name to user_name;
grant create table on schema database.schema_name to user_name;
grant create view on schema database.schema_name to user_name;
grant usage on all schemas in database database_name to user_name;
grant select on all tables in database database_name to user_name;
grant select on all views in database database_name to user_name;
```

Более подробную информацию можно найти в [официальной документации](https://docs.aws.amazon.com/redshift/latest/dg/r_GRANT.html).