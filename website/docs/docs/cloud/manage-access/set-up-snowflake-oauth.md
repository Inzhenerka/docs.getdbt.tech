---
title: "Настройка Snowflake OAuth"
description: "Узнайте, как администраторы dbt Cloud могут использовать Snowflake OAuth для управления доступом в аккаунте dbt Cloud."
id: "set-up-snowflake-oauth"
---

:::info Функция для корпоративных клиентов

Это руководство описывает функцию плана dbt Cloud Enterprise. Если вы хотите узнать больше о плане Enterprise, свяжитесь с нами по адресу sales@getdbt.com.

:::

dbt Cloud Enterprise поддерживает [аутентификацию OAuth](https://docs.snowflake.net/manuals/user-guide/oauth-intro.html) с Snowflake. Когда Snowflake OAuth включен, пользователи могут авторизовать свои учетные данные для разработки с помощью единого входа (SSO) через Snowflake, а не вводить имя пользователя и пароль в dbt Cloud. Если Snowflake настроен с SSO через стороннего поставщика удостоверений, разработчики могут использовать этот метод для входа в Snowflake и авторизации учетных данных для разработки dbt без дополнительной настройки.

Для настройки Snowflake OAuth в dbt Cloud требуется участие администраторов обеих систем для выполнения следующих шагов:
1. [Найдите значение перенаправления URI](#locate-the-redirect-uri-value) в dbt Cloud.
2. [Создайте интеграцию безопасности](#create-a-security-integration) в Snowflake.
3. [Настройте подключение](#configure-a-connection-in-dbt-cloud) в dbt Cloud.

Чтобы использовать Snowflake в IDE dbt Cloud, все разработчики должны [аутентифицироваться с помощью Snowflake](#authorize-developer-credentials) в своих учетных данных профиля.

### Найдите значение перенаправления URI

Для начала скопируйте URI перенаправления подключения из dbt Cloud:
1. Перейдите в **Настройки аккаунта**.
2. Выберите **Проекты** и выберите проект из списка.
3. Выберите подключение, чтобы просмотреть его детали, и установите метод **OAuth** на "Snowflake SSO".
4. Скопируйте **Redirect URI** для использования на следующих шагах.

<Lightbox
	src="/img/docs/dbt-cloud/dbt-cloud-enterprise/snowflake-oauth-redirect-uri.png"
	title="Найдите URI перенаправления Snowflake OAuth"
	alt="Поля метода OAuth и Redirect URI для подключения Snowflake в dbt Cloud."
/>

### Создайте интеграцию безопасности

В Snowflake выполните запрос для создания интеграции безопасности. Полную документацию по созданию интеграции безопасности для пользовательских клиентов можно найти [здесь](https://docs.snowflake.net/manuals/sql-reference/sql/create-security-integration.html#syntax).

В следующем примере запроса `CREATE OR REPLACE SECURITY INTEGRATION` замените значение `<REDIRECT_URI>` на URI перенаправления (также называемый [URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses)), скопированный в dbt Cloud. Чтобы найти URI перенаправления, обратитесь к предыдущему разделу [найдите значение перенаправления URI](#locate-the-redirect-uri-value).

```
CREATE OR REPLACE SECURITY INTEGRATION DBT_CLOUD
  TYPE = OAUTH
  ENABLED = TRUE
  OAUTH_CLIENT = CUSTOM
  OAUTH_CLIENT_TYPE = 'CONFIDENTIAL'
  OAUTH_REDIRECT_URI = '<REDIRECT_URI>'
  OAUTH_ISSUE_REFRESH_TOKENS = TRUE
  OAUTH_REFRESH_TOKEN_VALIDITY = 7776000;
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
| OAUTH_REDIRECT_URI  | Обязательно. Используйте значение из [настроек аккаунта dbt Cloud](#locate-the-redirect-uri-value). |
| OAUTH_ISSUE_REFRESH_TOKENS  | Обязательно |
| OAUTH_REFRESH_TOKEN_VALIDITY  | Обязательно. Эта конфигурация определяет количество секунд, в течение которых токен обновления действителен. Используйте меньшее значение, чтобы заставить пользователей чаще повторно аутентифицироваться в Snowflake. |

Дополнительные параметры конфигурации могут быть указаны для интеграции безопасности по мере необходимости.

### Настройка подключения в dbt Cloud

Администратор базы данных отвечает за создание подключения Snowflake в dbt Cloud. Это подключение настраивается с использованием идентификатора клиента Snowflake и секрета клиента. При настройке подключения в dbt Cloud выберите флажок "Разрешить вход через SSO". После выбора этого флажка вам будет предложено ввести идентификатор клиента OAuth и секрет клиента OAuth. Эти значения можно определить, выполнив следующий запрос в Snowflake:

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

Введите идентификатор клиента и секрет клиента в dbt Cloud, чтобы завершить создание вашего подключения.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/database-connection-snowflake-oauth.png" title="Настройка учетных данных Snowflake OAuth в dbt Cloud" />

### Авторизация учетных данных разработчика

После включения Snowflake SSO пользователи проекта смогут настроить свои учетные данные в своих профилях. Нажав кнопку "Подключиться к аккаунту Snowflake", пользователи будут перенаправлены в Snowflake для авторизации с настроенным поставщиком SSO, а затем обратно в dbt Cloud для завершения процесса настройки. На этом этапе пользователи должны иметь возможность использовать IDE dbt с их учетными данными для разработки.

### Диаграмма потока SSO OAuth

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/84427818-841b3680-abf3-11ea-8faf-693d4a39cffb.png" title="Диаграмма потока SSO OAuth" />

После того как пользователь авторизовал dbt Cloud с помощью Snowflake через своего поставщика удостоверений, Snowflake вернет токен обновления в приложение dbt Cloud. Затем dbt Cloud может обменять этот токен обновления на токен доступа, который затем можно использовать для открытия подключения Snowflake и выполнения запросов в IDE dbt Cloud от имени пользователей.

**ПРИМЕЧАНИЕ**: Срок действия токена обновления определяется параметром OAUTH_REFRESH_TOKEN_VALIDITY, указанным в операторе "create security integration". Когда срок действия токена обновления пользователя истекает, пользователю необходимо повторно авторизоваться в Snowflake, чтобы продолжить разработку в dbt Cloud.

### Настройка нескольких проектов dbt Cloud с Snowflake OAuth
Если вы планируете настроить один и тот же аккаунт Snowflake для разных проектов dbt Cloud, вы можете использовать одну и ту же интеграцию безопасности для всех проектов.

### Часто задаваемые вопросы
#### Как использовать список заблокированных ролей с dbt Cloud?
<LoomVideo id="1ad791f87c024f82b5bcf93eb2047676" />

### Устранение неполадок

#### Неверный запрос на согласие
Когда нажатие на `Connect Snowflake Account` успешно перенаправляет вас на страницу входа Snowflake, но вы получаете ошибку `Invalid consent request`. Это может означать:
* Ваш пользователь может не иметь доступа к роли Snowflake, определенной в учетных данных разработки в dbt Cloud. Убедитесь, что у вас есть доступ к этой роли и что имя роли введено правильно, так как Snowflake чувствителен к регистру.
* Вы пытаетесь использовать роль, которая находится в [BLOCKED_ROLES_LIST](https://docs.snowflake.com/en/user-guide/oauth-partner.html#blocking-specific-roles-from-using-the-integration), например `ACCOUNTADMIN`.

#### Запрашиваемая область недействительна
Когда вы выбираете кнопку `Connect Snowflake Account`, чтобы попытаться подключиться к вашему аккаунту Snowflake, вы можете получить ошибку, которая говорит `The requested scope is invalid`, даже если вы были успешно перенаправлены на страницу входа Snowflake.

Эта ошибка может быть вызвана проблемой конфигурации в потоке Snowflake OAuth, где `role` в конфигурации профиля является обязательным для каждого пользователя и не наследуется с страницы подключения проекта. Это означает, что каждый пользователь должен предоставить информацию о своей роли, независимо от того, предоставлена ли она на странице подключения проекта.
* В потоке Snowflake OAuth `role` в конфигурации профиля не является необязательным, так как он не наследуется из конфигурации подключения проекта. Поэтому каждый пользователь должен предоставить свою роль, независимо от того, предоставлена ли она в подключении проекта.

#### Ошибка сервера 500
Если вы сталкиваетесь с ошибкой сервера 500 при перенаправлении из Snowflake в dbt Cloud, дважды проверьте, что вы добавили в белый список [IP-адреса dbt Cloud](/docs/cloud/about-cloud/access-regions-ip-addresses) или [идентификатор конечной точки VPC (для подключений PrivateLink)](/docs/cloud/secure/snowflake-privatelink#configuring-network-policies) на уровне аккаунта Snowflake.

Корпоративные клиенты, у которых есть развертывания с одним арендатором, будут иметь другой диапазон IP-адресов (диапазоны сетевых CIDR) для добавления в белый список.

В зависимости от того, как вы настроили свои сетевые политики Snowflake или добавление IP-адресов в белый список, вам может потребоваться явно добавить сетевую политику, которая включает в себя добавленные в белый список IP-адреса dbt Cloud, в только что созданную интеграцию безопасности.

```
ALTER SECURITY INTEGRATION <security_integration_name>
SET NETWORK_POLICY = <network_policy_name> ;
```