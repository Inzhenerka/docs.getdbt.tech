---
title: "Разрешения Redshift"
---

В Redshift разрешения используются для контроля того, кто может выполнять определенные действия с различными объектами базы данных. Используйте SQL-запросы для управления разрешениями в базе данных Redshift.

## Пример разрешений Redshift

Следующий пример предоставляет вам SQL-запросы, которые вы можете использовать для управления разрешениями.

**Примечание**: `database_name`, `database.schema_name` и `user_name` являются заполнительными значениями, и вы можете заменить их в соответствии с соглашениями о наименовании вашей организации.

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

Посмотрите [официальную документацию](https://docs.aws.amazon.com/redshift/latest/dg/r_GRANT.html) для получения дополнительной информации.