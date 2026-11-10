---
title: "Настройка Snowflake OAuth"
description: "Как администраторы dbt могут управлять доступом к аккаунту через Snowflake OAuth."
id: "set-up-snowflake-oauth"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Настройка OAuth для Snowflake

:::info Миграция на статические поддомены

Мы переводим [мультитенантные аккаунты по всему миру](/docs/platform/about-platform/access-regions-ip-addresses) в <Constant name="dbt_platform" /> на статические поддомены. После миграции вы будете автоматически перенаправлены с исходного URL (например, `cloud.getdbt.com`) на новый URL со статическим поддоменом (например, `abc123.us1.dbt.com`), который можно найти в настройках аккаунта. Если ваша организация использует список разрешённых сетевых адресов, добавьте в него домен `us1.dbt.com`.

Миграция может потребовать дополнительных действий в вашем аккаунте Snowflake. Подробнее см. в разделе [миграция поддоменов](#subdomain-migration).

:::

<Constant name="dbt" /> Enterprise и Enterprise+ поддерживают [аутентификацию OAuth](https://docs.snowflake.net/manuals/user-guide/oauth-intro.html) в Snowflake. Когда Snowflake OAuth включён, пользователи могут авторизовать свои учётные данные с помощью единого входа (SSO) через Snowflake вместо того, чтобы передавать имя пользователя и пароль в <Constant name="dbt" />. Если в Snowflake настроен SSO через стороннего поставщика удостоверений, разработчики могут использовать этот способ для входа в Snowflake и авторизации учётных данных пользователя dbt без дополнительной настройки.

import SnowflakeOauthWithPL from '/snippets/_snowflake-oauth-with-pl.md'; 

<SnowflakeOauthWithPL />

Для настройки Snowflake OAuth в <Constant name="dbt" /> необходимо участие администраторов обеих систем, которые должны выполнить следующие шаги:
1. [Найти значение URI перенаправления](#locate-the-redirect-uri-value) в <Constant name="dbt" />.
2. [Создать интеграцию безопасности](#create-a-security-integration) в Snowflake.
3. [Настроить подключение](#configure-a-connection-in-dbt) в <Constant name="dbt" />.

Чтобы использовать Snowflake в <Constant name="studio_ide" />, каждый разработчик должен [пройти аутентификацию в Snowflake](#configure-a-connection-in-dbt) в разделе учетных данных своего профиля.

### Найдите значение перенаправления URI {#locate-the-redirect-uri-value}

Для начала скопируйте URI перенаправления подключения из <Constant name="dbt" />:
1. Перейдите в **Account settings**.
1. Выберите **Projects** и укажите проект из списка. 
1. Нажмите на поле **Development connection**, чтобы просмотреть сведения о подключении, и установите для **OAuth method** значение "Snowflake SSO".
1. Скопируйте **Redirect URI** для использования на последующих шагах.

<Lightbox
	src="/img/docs/dbt-platform/dbt-platform-enterprise/snowflake-oauth-redirect-uri.png"
	title="Где найти URI перенаправления Snowflake OAuth"
	alt="Поля OAuth method и Redirect URI для подключения Snowflake в dbt."
/>

### Создайте интеграцию безопасности {#create-a-security-integration}

В Snowflake выполните запрос для создания интеграции безопасности. Полную документацию по созданию интеграции безопасности для пользовательских клиентов можно найти [здесь](https://docs.snowflake.net/manuals/sql-reference/sql/create-security-integration.html#syntax).

В следующем примере запроса `CREATE OR REPLACE SECURITY INTEGRATION` замените значение `<REDIRECT_URI>` на Redirect URI (также называемый [URL-адресом доступа](/docs/platform/about-platform/access-regions-ip-addresses)), скопированный в <Constant name="dbt" />. Чтобы найти Redirect URI, обратитесь к предыдущему разделу [Поиск значения Redirect URI](#locate-the-redirect-uri-value).

Важно: если вы используете secondary roles, необходимо включить `OAUTH_USE_SECONDARY_ROLES = 'IMPLICIT';` в этом выражении.

```sql
CREATE OR REPLACE SECURITY INTEGRATION DBT_CLOUD
  TYPE = OAUTH
  ENABLED = TRUE
  OAUTH_CLIENT = CUSTOM
  OAUTH_CLIENT_TYPE = 'CONFIDENTIAL'
  OAUTH_REDIRECT_URI = '<REDIRECT_URI>'
  OAUTH_ISSUE_REFRESH_TOKENS = TRUE
  OAUTH_REFRESH_TOKEN_VALIDITY = 7776000
  OAUTH_USE_SECONDARY_ROLES = 'IMPLICIT';  -- Required for secondary roles
```

:::caution Разрешения

  Примечание: Только администраторы аккаунта Snowflake (пользователи с ролью `ACCOUNTADMIN`) или роль с глобальной привилегией `CREATE INTEGRATION` могут выполнять эту SQL-команду.

:::

| Поле | Описание |
| ----- | ----------- |
| TYPE  | Обязательно |
| ENABLED  | Обязательно |
| OAUTH_CLIENT  | Обязательно |
| OAUTH_CLIENT_TYPE  | Обязательно |
| OAUTH_REDIRECT_URI  | Обязательно. Используйте значение из [настроек учетной записи <Constant name="dbt" />](#locate-the-redirect-uri-value). |
| OAUTH_ISSUE_REFRESH_TOKENS  | Обязательно |
| OAUTH_REFRESH_TOKEN_VALIDITY  | Обязательно. Этот параметр задает срок действия токена обновления в секундах. Используйте меньшее значение, чтобы пользователям приходилось чаще проходить повторную аутентификацию в Snowflake. |

Дополнительные параметры конфигурации могут быть указаны для интеграции безопасности по мере необходимости.

### Настройка подключения в dbt {#configure-a-connection-in-dbt}

Администратор базы данных отвечает за создание подключения к Snowflake в <Constant name="dbt" />. Это подключение настраивается с использованием идентификатора клиента (Client ID) и секрета клиента (Client Secret) Snowflake. Эти значения можно получить, выполнив следующий запрос в Snowflake:

```sql
with

integration_secrets as (
  select parse_json(system$show_oauth_client_secrets('DBT_CLOUD')) as secrets
)

select
  secrets:"OAUTH_CLIENT_ID"::string     as client_id,
  secrets:"OAUTH_CLIENT_SECRET"::string as client_secret
from
  integration_secrets;
```

Чтобы завершить создание подключения в <Constant name="dbt" />:
1. Перейдите в **Account Settings**, нажмите **Connections** и выберите подключение.
2. Отредактируйте подключение и введите Client ID и Client Secret.
3. Нажмите **Save**.

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/database-connection-snowflake-oauth.png" title="Настройка учетных данных Snowflake OAuth в dbt" />

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/database-connection-snowflake-oauth.png" title="Настройка учетных данных Snowflake OAuth в dbt" />

После включения SSO для Snowflake пользователи проекта смогут настроить свои учетные данные в своих профилях. При нажатии кнопки «Connect to Snowflake Account» пользователи будут перенаправлены в Snowflake для авторизации через настроенного провайдера SSO, а затем обратно в <Constant name="dbt" /> для завершения настройки. После этого пользователи смогут получить доступ к <Constant name="studio_ide" /> со своими учетными данными.

После включения Snowflake SSO пользователи проекта смогут настроить свои учетные данные в своих профилях. Нажав кнопку **"Connect to Snowflake Account"**, пользователи будут перенаправлены в Snowflake для авторизации через настроенного SSO‑провайдера, а затем обратно в <Constant name="cloud" /> для завершения процесса настройки. После этого пользователи смогут использовать <Constant name="cloud_ide" /> со своими учетными данными для разработки.

<Lightbox src="/img/docs/dbt-platform/dbt-platform-enterprise/84427818-841b3680-abf3-11ea-8faf-693d4a39cffb.png" title="Схема процесса SSO OAuth" />

После того как пользователь авторизует <Constant name="dbt" /> для доступа к Snowflake через своего поставщика удостоверений, Snowflake вернёт приложению <Constant name="dbt" /> токен обновления (Refresh Token). Затем <Constant name="dbt" /> сможет обменять этот токен обновления на токен доступа (Access Token), который можно использовать для открытия соединения со Snowflake и выполнения запросов в <Constant name="studio_ide" /> от имени пользователя.

**ПРИМЕЧАНИЕ**: Срок действия токена обновления определяется параметром OAUTH_REFRESH_TOKEN_VALIDITY, указанным в SQL-инструкции «create security integration». Когда срок действия токена обновления пользователя истечёт, пользователю потребуется повторно пройти авторизацию в Snowflake, чтобы продолжить разработку в <Constant name="dbt" />.

### Настройка нескольких проектов dbt с использованием Snowflake 0Auth
Если вы планируете подключить одну и ту же учётную запись Snowflake к разным проектам <Constant name="dbt" />, вы можете использовать одну и ту же интеграцию безопасности для всех проектов.

### Настройка нескольких проектов dbt с Snowflake OAuth {#setting-up-multiple-dbt-projects-with-snowflake-0auth}
Если вы планируете использовать один и тот же аккаунт Snowflake для нескольких проектов <Constant name="cloud" />, вы можете применять одну и ту же security integration для всех проектов.

### Миграция на статический поддомен {#subdomain-migration}

Если ваша учетная запись использует статический поддомен для [миграции URL доступа](/docs/platform/about-platform/account-url-migration), вам может потребоваться обновить интеграции безопасности Snowflake, совместно используемые несколькими проектами или подключениями, чтобы предотвратить перебои в работе. 

Для подключений, созданных после миграции, требуется дополнительный URI перенаправления OAuth. Найдите этот URI перенаправления в разделе [сведений об OAuth для подключения](#locate-the-redirect-uri-value) или в разделе [URL доступа к API](/docs/dbt-apis/overview), а затем добавьте его в существующую интеграцию безопасности Snowflake. 

```sql
ALTER SECURITY INTEGRATION IF EXISTS <INTEGRATION_NAME>
SET OAUTH_ALTERNATE_REDIRECT_URIS = ('<ACCESS_URL>/complete/snowflake')
```

Значения `OAUTH_REDIRECT_URI` и `OAUTH_ALTERNATE_REDIRECT_URIS` взаимозаменяемы.

После добавления нового URI перенаправления обязательно обновите существующее подключение в <Constant name="dbt_platform" />, чтобы оно использовало этот URI. Дополнительные сведения см. в разделе [Обновление URI перенаправления в dbt platform](/docs/platform/about-platform/account-url-migration#update-redirect-uris-in-dbt-platform).

- **Настроить дополнительную security integration:** В вашем аккаунте Snowflake будет одна integration с исходным URL (например, `cloud.getdbt.com/complete/snowflake`) в качестве redirect URI, и вторая — с новым статическим поддоменом. Полный список исходных доменов для вашего региона (помечены как “multi-tenant” в таблице) см. на странице [Regions & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses).
- **Использовать одну security integration:** Создайте одну integration с новым статическим поддоменом в качестве redirect URI. В этом случае вам потребуется заново создать все ваши [существующие подключения](/docs/platform/connect-data-platform/about-connections#connection-management).

### Устранение неполадок {#troubleshooting}

<Expandable alt_header="Ошибка Invalid consent request">

При нажатии на `Connect Snowflake Account` вы успешно перенаправляетесь на страницу входа в Snowflake, но получаете ошибку `Invalid consent request`. Это может означать следующее:
* У вашего пользователя может не быть доступа к роли Snowflake, указанной в учетных данных пользователя в разделе **Настройки аккаунта** <Constant name="dbt" />. Убедитесь, что у вас есть доступ к этой роли и что ее имя указано правильно, поскольку Snowflake учитывает регистр символов.
* Вы пытаетесь использовать роль, включенную в [BLOCKED_ROLES_LIST](https://docs.snowflake.com/en/user-guide/oauth-partner.html#blocking-specific-roles-from-using-the-integration), например `ACCOUNTADMIN`.
</Expandable>

<Expandable alt_header="Запрошенный scope недопустим">

При нажатии на кнопку `Connect Snowflake Account` для подключения к аккаунту Snowflake вы можете получить ошибку `The requested scope is invalid`, даже если редирект на страницу входа Snowflake прошёл успешно.

Эта ошибка может быть связана с проблемой конфигурации OAuth-потока Snowflake, при которой параметр `role` в конфигурации профиля является обязательным для каждого пользователя и не наследуется со страницы подключения проекта. Это означает, что каждый пользователь должен указать информацию о своей роли, независимо от того, задана ли она на странице подключения проекта.
* В OAuth-потоке Snowflake параметр `role` в конфигурации профиля не является опциональным, так как он не наследуется из конфигурации подключения проекта. Поэтому каждый пользователь должен указывать свою роль, даже если она задана в настройках подключения проекта.
</Expandable>

<Expandable alt_header="Ошибка сервера 500">

Если при перенаправлении из Snowflake в <Constant name="dbt" /> возникает ошибка сервера 500, убедитесь, что на уровне аккаунта Snowflake в список разрешённых добавлены [IP-адреса <Constant name="dbt" />](/docs/platform/about-platform/access-regions-ip-addresses) или [VPC Endpoint ID (для подключений через PrivateLink)](/docs/platform/secure/private-connectivity/aws/aws-snowflake#configuring-network-policies).

Корпоративные клиенты, у которых есть развертывания с одним арендатором, будут иметь другой диапазон IP-адресов (диапазоны сетевых CIDR) для добавления в белый список.

В зависимости от настроек сетевых политик Snowflake или списка разрешённых IP-адресов вам может потребоваться явно добавить сетевую политику, включающую разрешённые IP-адреса <Constant name="dbt" />, в только что созданную интеграцию безопасности.

```sql
ALTER SECURITY INTEGRATION <security_integration_name>
SET NETWORK_POLICY = <network_policy_name> ;
```
</Expandable>

<Expandable alt_header="Вторичная роль не работает. Ошибка: USE ROLE not allowed">

Если вы хотите использовать вторичные роли, но при настройке Snowflake OAuth сталкиваетесь с ошибкой `Current sessions is restricted. USE ROLE not allowed`, проверьте, что вы добавили следующее выражение в запрос:

```sql
OAUTH_USE_SECONDARY_ROLES = 'IMPLICIT';
```

Полный пример запроса см. в разделе [Create a security integration](#create-a-security-integration).
</Expandable>

## Узнать больше {#learn-more}

<WistiaVideo id="2ynprkkijp" paddingTweak="62.25%" />
