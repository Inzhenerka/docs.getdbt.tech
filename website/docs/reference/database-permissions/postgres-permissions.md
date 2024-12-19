---
title: "Разрешения Postgres"
---

В Postgres разрешения используются для контроля того, кто может выполнять определенные действия с различными объектами базы данных. Используйте SQL-запросы для управления разрешениями в базе данных Postgres.

## Примеры разрешений Postgres

Следующий пример предоставляет вам SQL-запросы, которые вы можете использовать для управления разрешениями. Эти примеры позволяют вам без проблем запускать dbt, не сталкиваясь с проблемами разрешений, такими как создание схем, чтение существующих данных и доступ к информационной схеме.

**Примечание**: `database_name`, `source_schema`, `destination_schema` и `user_name` являются заполнительными значениями, и вы можете заменить их в соответствии с соглашениями о наименовании вашей организации.

```sql
grant connect on database database_name to user_name;

-- Предоставить права на чтение в исходной схеме
grant usage on schema source_schema to user_name;
grant select on all tables in schema source_schema to user_name;
alter default privileges in schema source_schema grant select on tables to user_name;

-- Создать целевую схему и сделать user_name владельцем
create schema if not exists destination_schema;
alter schema destination_schema owner to user_name;

-- Предоставить права на запись в целевой схеме
grant usage on schema destination_schema to user_name;
grant create on schema destination_schema to user_name;
grant insert, update, delete, truncate on all tables in schema destination_schema to user_name;
alter default privileges in schema destination_schema grant insert, update, delete, truncate on tables to user_name;
```

Посмотрите [официальную документацию](https://www.postgresql.org/docs/current/sql-grant.html) для получения дополнительной информации.