---
title: Ошибка `Failed to connect to DB` при подключении к Snowflake
description: "Измените интеграцию безопасности OAuth при возникновении ошибки"
sidebar_label: 'Ошибка `Failed to connect to database`'
---

1. Если вы видите следующую ошибку:

   ```text
   Failed to connect to DB: xxxxxxx.snowflakecomputing.com:443. The role requested in the connection, or the default role if none was requested in the connection ('xxxxx'), is not listed in the Access Token or was filtered. 
   Please specify another role, or contact your OAuth Authorization server administrator.
   ```

2. Измените вашу интеграцию безопасности OAuth и явно укажите этот атрибут сопоставления области:

   ```sql
   ALTER INTEGRATION <my_int_name> SET EXTERNAL_OAUTH_SCOPE_MAPPING_ATTRIBUTE = 'scp';
   ```

Вы можете прочитать больше об этой ошибке в [документации Snowflake](https://community.snowflake.com/s/article/external-custom-oauth-error-the-role-requested-in-the-connection-is-not-listed-in-the-access-token).

----

1. Если вы видите следующую ошибку:

   ```text
   Failed to connect to DB: xxxxxxx.snowflakecomputing.com:443. Incorrect username or password was specified.
   ```

   * **Уникальные адреса электронной почты** &mdash; Каждый пользователь в Snowflake должен иметь уникальный адрес электронной почты. Нельзя, чтобы несколько пользователей (например, человек и служебная учетная запись) использовали один и тот же адрес электронной почты, например `alice@acme.com`, для аутентификации в Snowflake.
   * **Соответствие адресов электронной почты с провайдером идентификации** &mdash; Адрес электронной почты вашего пользователя Snowflake должен точно совпадать с адресом электронной почты, который вы используете для аутентификации с вашим провайдером идентификации (IdP). Например, если адрес электронной почты вашего пользователя Snowflake `alice@acme.com`, но вы входите в Entra или Okta с `alice_adm@acme.com`, это несоответствие может вызвать ошибку.