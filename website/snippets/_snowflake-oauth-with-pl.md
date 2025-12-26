:::note Snowflake OAuth с использованием PrivateLink
Пользователям, которые подключаются к Snowflake с помощью [Snowflake OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth) через соединение AWS PrivateLink из <Constant name="cloud" />, также потребуется доступ к PrivateLink endpoint с их локальной рабочей станции. По возможности используйте [Snowflake External OAuth](/docs/cloud/manage-access/snowflake-external-oauth), чтобы обойти это ограничение.

Из документации [Snowflake](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-overview#label-sso-private-connectivity):
>В настоящее время для каждой учетной записи Snowflake SSO может работать только с одним URL учетной записи одновременно: либо с публичным URL учетной записи, либо с URL, связанным с сервисом приватной сетевой связности.

:::
