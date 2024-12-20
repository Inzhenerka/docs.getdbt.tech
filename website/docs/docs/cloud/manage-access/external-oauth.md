---
title: "Настройка внешнего OAuth"
id: external-oauth
description: "Инструкции по настройке соединений dbt Cloud и внешнего OAuth"
sidebar_label: "Настройка внешнего OAuth"
pagination_next: null
pagination_prev: null
---

# Настройка внешнего OAuth <Lifecycle status="enteprise" />

:::note 

Эта функция в настоящее время доступна только для провайдеров идентификации Okta и Entra ID и [соединений Snowflake](/docs/cloud/connect-data-platform/connect-snowflake).

:::

dbt Cloud Enterprise поддерживает [внешнюю аутентификацию OAuth](https://docs.snowflake.com/en/user-guide/oauth-ext-overview) с внешними провайдерами. Когда внешний OAuth включен, пользователи могут авторизовать свои учетные данные для разработки с помощью единого входа (SSO) через провайдера идентификации (IdP). Это предоставляет пользователям авторизацию для доступа к нескольким приложениям, включая dbt Cloud, без передачи их учетных данных сервису. Это не только упрощает процесс аутентификации для сред разработки, но и обеспечивает дополнительный уровень безопасности для вашей учетной записи dbt Cloud.

## Начало работы

Процесс настройки внешнего OAuth потребует некоторого взаимодействия между вашими учетными записями dbt Cloud, IdP и Snowflake, и открытие их в нескольких вкладках браузера поможет ускорить процесс настройки:

- **dbt Cloud:** Основная работа будет вестись на странице **Account Settings** —> **Integrations**. Вам понадобятся [соответствующие разрешения](/docs/cloud/manage-access/enterprise-permissions) для настройки интеграции и создания соединений.
- **Snowflake:** Откройте рабочий лист в учетной записи, имеющей разрешения на [создание интеграции безопасности](https://docs.snowflake.com/en/sql-reference/sql/create-security-integration).
- **Okta:** Вам придется работать в нескольких областях учетной записи Okta, но можно начать с раздела **Applications**. Вам понадобятся разрешения на [создание приложения](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Application_permissions) и [сервера авторизации](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Authorization_server_permissions).
- **Entra ID** Требуется администратор с доступом для создания [приложений Entra ID](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-available-permissions), который также является пользователем в Snowflake.

Если администраторы, отвечающие за эти продукты, — это разные люди, лучше, чтобы они координировали свои действия одновременно, чтобы уменьшить трения.

### Команды Snowflake

Ниже приведен шаблон для создания конфигураций OAuth в среде Snowflake:

```sql

create security integration your_integration_name
type = external_oauth
enabled = true
external_oauth_type = okta
external_oauth_issuer = ''
external_oauth_jws_keys_url = ''
external_oauth_audience_list = ('')
external_oauth_token_user_mapping_claim = 'sub'
external_oauth_snowflake_user_mapping_attribute = 'email_address'
external_oauth_any_role_mode = 'ENABLE'

```

`external_oauth_token_user_mapping_claim` и `external_oauth_snowflake_user_mapping_attribute` могут быть изменены в зависимости от потребностей вашей организации. Эти значения указывают на утверждение в токене пользователей. В примере Snowflake будет искать пользователя Snowflake, чей `email` совпадает со значением в утверждении `sub`.

**Примечание:** Роли по умолчанию в Snowflake, такие как ACCOUNTADMIN, ORGADMIN или SECURITYADMIN, по умолчанию заблокированы для внешнего OAuth, и они, вероятно, не смогут пройти аутентификацию. См. [документацию Snowflake](https://docs.snowflake.com/en/sql-reference/sql/create-security-integration-oauth-external) для получения дополнительной информации.

## Конфигурация провайдера идентификации

Выберите поддерживаемого провайдера идентификации (IdP) для получения инструкций по настройке внешнего OAuth в их среде и завершению интеграции в dbt Cloud.

<Expandable alt_header="Okta">

### 1. Инициализация настроек dbt Cloud

1. В вашей учетной записи dbt Cloud перейдите в **Account settings** —> **Integrations**.
2. Прокрутите вниз до **Custom integrations** и нажмите **Add integrations**.
3. Оставьте это окно открытым. Вы можете установить **Integration type** на Okta и отметить **Redirect URI** внизу страницы. Скопируйте это в буфер обмена для использования в следующих шагах.

<Lightbox src="/img/docs/dbt-cloud/callback-uri.png" width="60%" title="Скопируйте URI обратного вызова внизу страницы интеграции в dbt Cloud" />

### 2. Создание приложения Okta

1. Разверните раздел **Applications** на панели управления Okta и нажмите **Applications**. Нажмите кнопку **Create app integration**.
2. Выберите **OIDC** в качестве метода входа и **Web applications** в качестве типа приложения. Нажмите **Next**.

<Lightbox src="/img/docs/dbt-cloud/create-okta-app.png" width="60%" title="Окно создания приложения Okta с выбранными OIDC и Web Application" />

3. Дайте приложению подходящее имя, например, «External OAuth app for dbt Cloud», чтобы его было легко идентифицировать.
4. В разделе **Grant type** включите опцию **Refresh token**.
5. Прокрутите вниз до опции **Sign-in redirect URIs**. Вам нужно будет вставить URI перенаправления, который вы собрали из dbt Cloud на шаге 1.3.

<Lightbox src="/img/docs/dbt-cloud/configure-okta-app.png" width="60%" title="Окно конфигурации приложения Okta с URI перенаправления входа, настроенным на значение dbt Cloud" />

6. Сохраните конфигурацию приложения. Вы вернетесь к нему позже, но пока переходите к следующим шагам.

### 3. Создание API Okta

1. Разверните раздел **Security** и нажмите **API** в боковом меню Okta.
2. На экране API нажмите **Add authorization server**. Дайте серверу авторизации имя (подходящим будет псевдоним для вашей учетной записи Snowflake). Для поля **Audience** скопируйте и вставьте URL-адрес входа в Snowflake (например, https://abdc-ef1234.snowflakecomputing.com). Дайте серверу подходящее описание и нажмите **Save**.

<Lightbox src="/img/docs/dbt-cloud/create-okta-api.png" width="60%" title="Окно API Okta со значением Audience, установленным на URL Snowflake" />

3. На экране конфигурации сервера авторизации откройте **Metadata URI** в новой вкладке. Вам понадобится информация с этого экрана на следующих шагах.

<Lightbox src="/img/docs/dbt-cloud/metadata-uri.png" width="60%" title="Страница настроек API Okta с выделенным URI метаданных" />

<Lightbox src="/img/docs/dbt-cloud/metadata-example.png" width="60%" title="Пример вывода URI метаданных" />

4. Нажмите на вкладку **Scopes** и **Add scope**. В поле **Name** добавьте `session:role-any`. (Опционально) Настройте **Display phrase** и **Description** и нажмите **Create**.

<Lightbox src="/img/docs/dbt-cloud/add-api-scope.png" width="60%" title="Конфигурация области API в окне Add Scope" />

5. Откройте вкладку **Access policies** и нажмите **Add policy**. Дайте политике **Name** и **Description** и установите **Assign to** как **The following clients**. Начните вводить имя приложения, созданного на шаге 2.3, и вы увидите его автозаполнение. Выберите приложение и нажмите **Create Policy**.

<Lightbox src="/img/docs/dbt-cloud/add-api-assignment.png" width="60%" title="Поле назначения с автозаполнением значения" />

6. На экране **access policy** нажмите **Add rule**.

<Lightbox src="/img/docs/dbt-cloud/add-api-rule.png" width="60%" title="Кнопка Add rule в API выделена" />

7. Дайте правилу описательное имя и прокрутите вниз до **token lifetimes**. Настройте **Access token lifetime is**, **Refresh token lifetime is**, и **but will expire if not used every** в соответствии с политиками вашей организации. Мы рекомендуем значения по умолчанию: 1 час и 90 дней. Более строгие правила увеличивают вероятность того, что вашим пользователям придется повторно проходить аутентификацию.

<Lightbox src="/img/docs/dbt-cloud/configure-token-lifetime.png" width="60%" title="Настройки времени жизни токена в окне правила API" />

8. Вернитесь на вкладку **Settings** и оставьте ее открытой в вашем браузере. Вам понадобится некоторая информация на следующих шагах.

### 4. Создание настроек OAuth в Snowflake

1. Откройте рабочий лист Snowflake и скопируйте/вставьте следующее:

```sql

create security integration your_integration_name
type = external_oauth
enabled = true
external_oauth_type = okta
external_oauth_issuer = ''
external_oauth_jws_keys_url = ''
external_oauth_audience_list = ('')
external_oauth_token_user_mapping_claim = 'sub'
external_oauth_snowflake_user_mapping_attribute = 'email_address'
external_oauth_any_role_mode = 'ENABLE'

```

2. Измените `your_integration_name` на что-то подходящее и описательное. Например, `dev_OktaAccountNumber_okta`. Скопируйте `external_oauth_issuer` и `external_oauth_jws_keys_url` из URI метаданных на шаге 3.3. Используйте тот же URL Snowflake, который вы ввели на шаге 3.2, в качестве `external_oauth_audience_list`.

Настройте остальные параметры в соответствии с конфигурациями вашей организации в Okta и Snowflake.

<Lightbox src="/img/docs/dbt-cloud/gather-uris.png" width="60%" title="URI издателя и jws ключей в URL метаданных" />

3. Выполните шаги для создания интеграции в Snowflake.

### 5. Настройка интеграции в dbt Cloud

1. Вернитесь на страницу **Account settings** —> **Integrations** в dbt Cloud, на которой вы были в начале. Пора начать заполнять все поля.
   1. `Integration name`: Дайте интеграции описательное имя, включающее идентификационную информацию о среде Okta, чтобы будущие пользователи не гадали, к чему она относится.
   2. `Client ID` и `Client secrets`: Получите их на странице приложения Okta.
   <Lightbox src="/img/docs/dbt-cloud/gather-clientid-secret.png" width="60%" title="ID клиента и секрет выделены в приложении Okta" />
   3. URL авторизации и URL токена: Найдены в URI метаданных.
   <Lightbox src="/img/docs/dbt-cloud/gather-authorization-token-endpoints.png" width="60%" title="URL авторизации и токена выделены в URI метаданных" />

2. **Сохраните** конфигурацию

### 6. Создание нового соединения в dbt Cloud

1. Перейдите в **Account settings** и нажмите **Connections** в меню. Нажмите **Add connection**.
2. Настройте `Account`, `Database` и `Warehouse` как обычно, а для `OAuth method` выберите внешний OAuth, который вы только что создали.

<Lightbox src="/img/docs/dbt-cloud/configure-new-connection.png" width="60%" title="Новое окно конфигурации в dbt Cloud с отображением внешнего OAuth в качестве опции" />

3. Прокрутите вниз до блока конфигураций **External OAuth** и выберите конфигурацию из списка.

<Lightbox src="/img/docs/dbt-cloud/select-oauth-config.png" width="60%" title="Новое соединение отображается в блоке конфигураций External OAuth" />

4. **Сохраните** соединение, и теперь вы настроили внешний OAuth с Okta и Snowflake!

</Expandable>

<Expandable alt_header="Entra ID">

### 1. Инициализация настроек dbt Cloud

1. В вашей учетной записи dbt Cloud перейдите в **Account settings** —> **Integrations**.
2. Прокрутите вниз до **Custom integrations** и нажмите **Add integrations**.
3. Оставьте это окно открытым. Вы можете установить **Integration type** на Entra ID и отметить **Redirect URI** внизу страницы. Скопируйте это в буфер обмена для использования в следующих шагах.

### Entra ID

Вы создадите два приложения в портале Azure: сервер ресурсов и клиентское приложение.

:::important

Администратор, который создает приложения в учетной записи Microsoft Entra ID, также должен быть пользователем в Snowflake.

Поле `value`, полученное на этих шагах, отображается только один раз. Запишите его сразу после создания.

:::

В вашем портале Azure откройте **Entra ID** и нажмите **App registrations** в левом меню.

### 1. Создание сервера ресурсов

1. На экране регистрации приложений нажмите **New registration**.
   1. Дайте приложению имя.
   2. Убедитесь, что **Supported account types** установлены на «Accounts in this organizational directory only (`Org name` - Single Tenant).»
   3. Нажмите **Register**, чтобы увидеть обзор приложения.
2. На странице обзора приложения нажмите **Expose an API** в левом меню.
3. Нажмите **Add** рядом с **Application ID URI**. Поле заполнится автоматически. Нажмите **Save**.
4. Запишите поле `value` для использования в будущем шаге. _Оно отображается только один раз. Обязательно запишите его сразу. Microsoft скрывает поле, когда вы покидаете страницу и возвращаетесь._
5. На том же экране нажмите **Add scope**.
   1. Дайте области имя.
   2. Установите «Who can consent?» на **Admins and users**.
   3. Установите **Admin consent display name** на session:role-any и дайте ему описание.
   4. Убедитесь, что **State** установлен на **Enabled**.
   5. Нажмите **Add scope**.

### 2. Создание клиентского приложения

1. На странице **App registration** нажмите **New registration**.
   1. Дайте приложению имя, которое уникально идентифицирует его как клиентское приложение.
   2. Убедитесь, что **Supported account types** установлены на «Accounts in this organizational directory only (`Org name` - Single Tenant).»
   3. Установите **Redirect URI** на **Web** и скопируйте/вставьте **Redirect URI** из dbt Cloud в поле.
   4. Нажмите **Register**.
2. На странице обзора приложения нажмите **API permissions** в левом меню и нажмите **Add permission**.
3. На всплывающем экране нажмите **APIs my organization uses**, найдите имя сервера ресурсов из предыдущих шагов и нажмите на него.
4. Убедитесь, что флажок для **Permissions** `session:role-any` включен, и нажмите **Add permissions**.
5. Нажмите **Grant admin consent** и в появившемся модальном окне нажмите **Yes**.
6. В левом меню нажмите **Certificates and secrets** и нажмите **New client secret**. Назовите секрет, установите срок действия и нажмите **Add**.
**Примечание**: Microsoft не позволяет установить «навсегда» в качестве срока действия. Максимальное время — два года. Важно задокументировать дату истечения срока действия, чтобы вы могли обновить секрет до истечения срока действия или пользовательская авторизация не удалась.
7. Запишите `value` для использования в будущем шаге и запишите его сразу.
**Примечание**: Entra ID не будет отображать это значение снова, как только вы покинете этот экран.

### 3. Конфигурация Snowflake

Вы будете переключаться между сайтом Entra ID и Snowflake. Держите свою учетную запись Entra ID открытой для этого процесса.

Скопируйте и вставьте следующее в качестве шаблона в рабочий лист Snowflake:

```sql

create or replace security integration <whatever you want to name it>
   type = external_oauth
   enabled = true
   external_oauth_type = azure
   external_oauth_issuer = '<AZURE_AD_ISSUER>'
   external_oauth_jws_keys_url = '<AZURE_AD_JWS_KEY_ENDPOINT>'
   external_oauth_audience_list = ('<SNOWFLAKE_APPLICATION_ID_URI>')
   external_oauth_token_user_mapping_claim = 'upn'
   external_oauth_any_role_mode = 'ENABLE'
   external_oauth_snowflake_user_mapping_attribute = 'login_name';

```

На сайте Entra ID:

1. Из клиентского приложения в Entra ID нажмите **Endpoints** и откройте **Federation metadata document** в новой вкладке.
   - **entity ID** на этой странице соответствует полю `external_oauth_issuer` в конфигурации Snowflake.
2. Вернувшись к списку конечных точек, откройте **OpenID Connect metadata document** в новой вкладке.
   - Поле **jwks_uri** соответствует полю `external_oauth_jws_keys_url` в Snowflake.
3. Перейдите к серверу ресурсов на предыдущих шагах.
   - **Application ID URI** соответствует полю `external_oauth_audience_list` в Snowflake.
4. Выполните конфигурации. Убедитесь, что администратор, создавший приложения Microsoft, также является пользователем в Snowflake, иначе конфигурация не удастся.

### 4. Настройка интеграции в dbt Cloud

1. Вернитесь на страницу **Account settings** —> **Integrations** в dbt Cloud, на которой вы были в начале. Пора начать заполнять все поля. Будет некоторое переключение между учетной записью Entra ID и dbt Cloud.
2. `Integration name`: Дайте интеграции описательное имя, включающее идентификационную информацию о среде Entra ID, чтобы будущие пользователи не гадали, к чему она относится.
3. `Client secrets`: Найдены в клиентском ID на странице **Certificates and secrets**. `Value` — это `Client secret`. Обратите внимание, что он появляется только при создании; _Microsoft скрывает секрет, если вы вернетесь позже, и вам придется его воссоздать._
4. `Client ID`: Скопируйте `Application (client) ID` на странице обзора для клиентского ID приложения.
5. `Authorization URL` и `Token URL`: Из клиентского ID приложения откройте вкладку `Endpoints`. Эти URL соответствуют полям `OAuth 2.0 authorization endpoint (v2)` и `OAuth 2.0 token endpoint (v2)`. *Вы должны использовать v2 `OAuth 2.0 authorization endpoint`. Не используйте V1.* Вы можете использовать любую версию `OAuth 2.0 token endpoint`.
6. `Application ID URI`: Скопируйте поле `Application ID URI` с экрана обзора сервера ресурсов.

</Expandable>

## Часто задаваемые вопросы

<FAQ path="Troubleshooting/failed-snowflake-oauth-connection" />