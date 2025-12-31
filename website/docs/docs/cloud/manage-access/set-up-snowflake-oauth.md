---
title: "Set up Snowflake OAuth"
description: "Learn how dbt administrators can use Snowflake OAuth to control access in a dbt account."
id: "set-up-snowflake-oauth"
---

# Настройка Snowflake OAuth <Lifecycle status="managed, managed_plus" /> {#set-up-snowflake-oauth}

:::info Миграция на статические поддомены

Мы выполняем миграцию <Constant name="dbt_platform" /> [мультитенантных аккаунтов по всему миру](/docs/cloud/about-cloud/access-regions-ip-addresses) на статические поддомены. После миграции вы будете автоматически перенаправлены с вашего исходного URL (например, `cloud.getdbt.com`) на новый URL со статическим поддоменом (например, `abc123.us1.dbt.com`), который можно найти в настройках вашего аккаунта. Если в вашей организации используется allow list на уровне сети, добавьте домен `us1.dbt.com` в список разрешённых.

Миграция может потребовать дополнительных действий в вашем аккаунте Snowflake. Подробнее см. в разделе [миграция поддоменов](#subdomain-migration).

:::

Тарифы <Constant name="cloud" /> Enterprise и Enterprise+ поддерживают [аутентификацию OAuth](https://docs.snowflake.net/manuals/user-guide/oauth-intro.html) с Snowflake. Когда Snowflake OAuth включён, пользователи могут авторизовывать свои учетные данные для разработки (Development credentials) с помощью Single Sign On (SSO) через Snowflake, вместо того чтобы передавать имя пользователя и пароль в <Constant name="cloud" />. Если Snowflake настроен с SSO через стороннего провайдера удостоверений, разработчики могут использовать этот метод для входа в Snowflake и авторизации учетных данных dbt для разработки без какой-либо дополнительной настройки.

import SnowflakeOauthWithPL from '/snippets/_snowflake-oauth-with-pl.md'; 

<SnowflakeOauthWithPL />

Для настройки Snowflake OAuth в <Constant name="cloud" /> администраторы обеих систем должны выполнить следующие шаги:
1. [Найти значение redirect URI](#locate-the-redirect-uri-value) в <Constant name="cloud" />.
2. [Создать security integration](#create-a-security-integration) в Snowflake.
3. [Настроить подключение](#configure-a-connection-in-dbt-cloud) в <Constant name="cloud" />.

Чтобы использовать Snowflake в <Constant name="cloud_ide" />, все разработчики должны [пройти аутентификацию в Snowflake](#authorize-developer-credentials) в своих профильных учетных данных.

### Найдите значение перенаправления URI {#locate-the-redirect-uri-value}

Чтобы начать, скопируйте redirect URI подключения из <Constant name="cloud" />:

1. Перейдите в **Account settings**.
1. Выберите **Projects** и выберите проект из списка.
1. Нажмите на поле **Development connection**, чтобы просмотреть его детали, и установите **OAuth method** в значение "Snowflake SSO".
1. Скопируйте **Redirect URI**, который понадобится на следующих шагах.

<Lightbox
	src="/img/docs/dbt-cloud/dbt-cloud-enterprise/snowflake-oauth-redirect-uri.png"
	title="Где найти redirect URI для Snowflake OAuth"
	alt="Поля OAuth method и Redirect URI для подключения Snowflake в dbt." />
/>

### Создайте интеграцию безопасности {#create-a-security-integration}

В Snowflake выполните запрос для создания интеграции безопасности. Полную документацию по созданию интеграции безопасности для пользовательских клиентов можно найти [здесь](https://docs.snowflake.net/manuals/sql-reference/sql/create-security-integration.html#syntax).

В следующем примере запроса `CREATE OR REPLACE SECURITY INTEGRATION` замените значение `<REDIRECT_URI>` на Redirect URI (также называемый [access URL](/docs/cloud/about-cloud/access-regions-ip-addresses)), скопированный в <Constant name="cloud" />. Чтобы найти Redirect URI, см. предыдущий раздел [locate the redirect URI value](#locate-the-redirect-uri-value).

Важно: если вы используете secondary roles, необходимо включить `OAUTH_USE_SECONDARY_ROLES = 'IMPLICIT';` в этом выражении.

```
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
| TYPE  | Обязательный |
| ENABLED  | Обязательный |
| OAUTH_CLIENT  | Обязательный |
| OAUTH_CLIENT_TYPE  | Обязательный |
| OAUTH_REDIRECT_URI  | Обязательный. Используйте значение из [настроек аккаунта <Constant name="cloud" />](#locate-the-redirect-uri-value). |
| OAUTH_ISSUE_REFRESH_TOKENS  | Обязательный |
| OAUTH_REFRESH_TOKEN_VALIDITY  | Обязательный. Эта конфигурация определяет количество секунд, в течение которых refresh token считается действительным. Используйте меньшее значение, чтобы заставлять пользователей чаще проходить повторную аутентификацию в Snowflake. |

Дополнительные параметры конфигурации могут быть указаны для интеграции безопасности по мере необходимости.

### Настройка подключения в dbt {#configure-a-connection-in-dbt}

Администратор базы данных отвечает за создание подключения к Snowflake в <Constant name="cloud" />. Это подключение настраивается с использованием Snowflake Client ID и Client Secret. Эти значения можно определить, выполнив следующий запрос в Snowflake:

```
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

Чтобы завершить создание подключения в <Constant name="cloud" />:

1. Перейдите в **Account Settings**, нажмите **Connections** и выберите нужное подключение.
2. Отредактируйте подключение и введите **Client ID** и **Client Secret**.
3. Нажмите **Save**.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/database-connection-snowflake-oauth.png" title="Настройка учетных данных Snowflake OAuth в dbt" />

### Авторизация учетных данных разработчика {#authorize-developer-credentials}

После включения Snowflake SSO пользователи проекта смогут настроить свои учетные данные в своих профилях. Нажав кнопку **"Connect to Snowflake Account"**, пользователи будут перенаправлены в Snowflake для авторизации через настроенного SSO‑провайдера, а затем обратно в <Constant name="cloud" /> для завершения процесса настройки. После этого пользователи смогут использовать <Constant name="cloud_ide" /> со своими учетными данными для разработки.

### Диаграмма потока SSO OAuth {#sso-oauth-flow-diagram}

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/84427818-841b3680-abf3-11ea-8faf-693d4a39cffb.png" title="Диаграмма потока SSO OAuth" />

После того как пользователь авторизовал <Constant name="cloud" /> в Snowflake через своего провайдера идентификации, Snowflake возвращает Refresh Token приложению <Constant name="cloud" />. После этого <Constant name="cloud" /> может обменять этот refresh token на Access Token, который затем используется для открытия соединения с Snowflake и выполнения запросов в <Constant name="cloud_ide" /> от имени пользователя.

**ПРИМЕЧАНИЕ**: Срок действия refresh token определяется параметром `OAUTH_REFRESH_TOKEN_VALIDITY`, указанным в операторе `create security integration`. Когда refresh token пользователя истекает, пользователю необходимо повторно авторизоваться в Snowflake, чтобы продолжить работу в <Constant name="cloud" />.

### Настройка нескольких проектов dbt с Snowflake OAuth {#setting-up-multiple-dbt-projects-with-snowflake-0auth}
Если вы планируете использовать один и тот же аккаунт Snowflake для нескольких проектов <Constant name="cloud" />, вы можете применять одну и ту же security integration для всех проектов.

## Миграция поддомена {#subdomain-migration}

Если вы используете [мультиарендный аккаунт](/docs/cloud/about-cloud/access-regions-ip-addresses) и вас переводят на статический поддомен, возможно, потребуется выполнить дополнительные действия в вашем аккаунте Snowflake, чтобы избежать сбоев в работе сервиса.

Snowflake ограничивает каждую security integration (`CREATE SECURITY INTEGRATION … TYPE = OAUTH`) одним redirect URI. Если вы настроили OAuth‑интеграцию с использованием `cloud.getdbt.com`, вам необходимо выбрать один из двух вариантов:

- **Настроить дополнительную security integration:** В вашем аккаунте Snowflake будет одна integration с исходным URL (например, `cloud.getdbt.com/complete/snowflake`) в качестве redirect URI, и вторая — с новым статическим поддоменом. Полный список исходных доменов для вашего региона (помечены как “multi-tenant” в таблице) см. на странице [Regions & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses).
- **Использовать одну security integration:** Создайте одну integration с новым статическим поддоменом в качестве redirect URI. В этом случае вам потребуется заново создать все ваши [существующие подключения](/docs/cloud/connect-data-platform/about-connections#connection-management).

### Устранение неполадок {#troubleshooting}

<Expandable alt_header="Недопустимый запрос согласия">

Если при нажатии на кнопку `Connect Snowflake Account` происходит успешный редирект на страницу входа Snowflake, но затем вы получаете ошибку `Invalid consent request`, это может означать следующее:
* У вашего пользователя может не быть доступа к роли Snowflake, указанной в учетных данных для разработки в <Constant name="cloud" />. Проверьте, что у вас есть доступ к этой роли и что имя роли введено корректно, так как Snowflake чувствителен к регистру.
* Вы пытаетесь использовать роль, которая входит в [BLOCKED_ROLES_LIST](https://docs.snowflake.com/en/user-guide/oauth-partner.html#blocking-specific-roles-from-using-the-integration), например `ACCOUNTADMIN`.
</Expandable>

<Expandable alt_header="Запрошенный scope недопустим">

При нажатии на кнопку `Connect Snowflake Account` для подключения к аккаунту Snowflake вы можете получить ошибку `The requested scope is invalid`, даже если редирект на страницу входа Snowflake прошёл успешно.

Эта ошибка может быть связана с проблемой конфигурации OAuth-потока Snowflake, при которой параметр `role` в конфигурации профиля является обязательным для каждого пользователя и не наследуется со страницы подключения проекта. Это означает, что каждый пользователь должен указать информацию о своей роли, независимо от того, задана ли она на странице подключения проекта.
* В OAuth-потоке Snowflake параметр `role` в конфигурации профиля не является опциональным, так как он не наследуется из конфигурации подключения проекта. Поэтому каждый пользователь должен указывать свою роль, даже если она задана в настройках подключения проекта.
</Expandable>

<Expandable alt_header="Ошибка сервера 500">

Если при редиректе из Snowflake в <Constant name="cloud" /> вы сталкиваетесь с серверной ошибкой 500, проверьте, что вы добавили в allow-list [IP-адреса <Constant name="cloud" />](/docs/cloud/about-cloud/access-regions-ip-addresses) или [VPC Endpoint ID (для подключений через PrivateLink)](/docs/cloud/secure/snowflake-privatelink#configuring-network-policies) на уровне аккаунта Snowflake.

Корпоративные клиенты, у которых есть развертывания с одним арендатором, будут иметь другой диапазон IP-адресов (диапазоны сетевых CIDR) для добавления в белый список.

В зависимости от того, как у вас настроены сетевые политики Snowflake или allow list IP-адресов, вам может потребоваться явно добавить сетевую политику, которая включает разрешённые (<em>allow listed</em>) IP-адреса <Constant name="cloud" />, в созданную вами интеграцию безопасности.

```
ALTER SECURITY INTEGRATION <security_integration_name>
SET NETWORK_POLICY = <network_policy_name> ;
```
</Expandable>

<Expandable alt_header="Вторичная роль не работает. Ошибка: USE ROLE not allowed">

Если вы хотите использовать вторичные роли, но при настройке Snowflake OAuth сталкиваетесь с ошибкой `Current sessions is restricted. USE ROLE not allowed`, проверьте, что вы добавили следующее выражение в запрос:

```
OAUTH_USE_SECONDARY_ROLES = 'IMPLICIT';
```

Полный пример запроса см. в разделе [Create a security integration](#create-a-security-integration).
</Expandable>

## Узнать больше {#learn-more}

<WistiaVideo id="2ynprkkijp" paddingTweak="62.25%" />
```
