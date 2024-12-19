---
title: "Разрешения Databricks"
---

В Databricks разрешения используются для контроля того, кто может выполнять определенные действия с различными объектами базы данных. Используйте SQL-запросы для управления разрешениями в базе данных Databricks.

## Пример разрешений Databricks

Следующий пример предоставляет вам SQL-запросы, которые вы можете использовать для управления разрешениями.

**Примечание**: вы можете предоставить разрешения на `securable_objects` для `principals` (это может быть пользователь, сервисный принципал или группа). Например, `grant privilege_type` на `securable_object` для `principal`.

```
grant all privileges on schema schema_name to principal;
grant create table on schema schema_name to principal;
grant create view on schema schema_name to principal;
```

Посмотрите [официальную документацию](https://docs.databricks.com/en/data-governance/unity-catalog/manage-privileges/privileges.html#privilege-types-by-securable-object-in-unity-catalog) для получения дополнительной информации.