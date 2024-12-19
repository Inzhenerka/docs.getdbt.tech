---
title: Получение ошибки `Не удалось подключиться к БД` при подключении к Snowflake
description: "Измените вашу интеграцию OAuth Security, когда вы видите ошибку"
sidebar_label: 'Получение ошибки `Не удалось подключиться к базе данных`'
---

1. Если вы видите следующую ошибку:

   ```text
   Failed to connect to DB: xxxxxxx.snowflakecomputing.com:443. The role requested in the connection, or the default role if none was requested in the connection ('xxxxx'), is not listed in the Access Token or was filtered. 
   Please specify another role, or contact your OAuth Authorization server administrator.
   ```

2. Измените вашу интеграцию OAuth Security и явно укажите этот атрибут сопоставления области:

   ```sql
   ALTER INTEGRATION <my_int_name> SET EXTERNAL_OAUTH_SCOPE_MAPPING_ATTRIBUTE = 'scp';
   ```

Вы можете узнать больше об этой ошибке в [документации Snowflake](https://community.snowflake.com/s/article/external-custom-oauth-error-the-role-requested-in-the-connection-is-not-listed-in-the-access-token).

----

1. Если вы видите следующую ошибку:

   ```text
   Failed to connect to DB: xxxxxxx.snowflakecomputing.com:443. Incorrect username or password was specified.
   ```

   * **Уникальные адреса электронной почты** &mdash; Каждый пользователь в Snowflake должен иметь уникальный адрес электронной почты. Нельзя иметь несколько пользователей (например, человека и сервисный аккаунт), использующих один и тот же адрес электронной почты, такой как `alice@acme.com`, для аутентификации в Snowflake.
   * **Сопоставление адресов электронной почты с поставщиком удостоверений** &mdash; Адрес электронной почты вашего пользователя Snowflake должен точно совпадать с адресом электронной почты, который вы используете для аутентификации у вашего поставщика удостоверений (IdP). Например, если адрес электронной почты вашего пользователя Snowflake — `alice@acme.com`, но вы входите в систему через Entra или Okta с `alice_adm@acme.com`, это несоответствие может вызвать ошибку.