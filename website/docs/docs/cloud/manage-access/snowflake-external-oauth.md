---
title: "Настройка внешнего OAuth для Snowflake"  
id: snowflake-external-oauth  
description: "Инструкции по настройке dbt и подключений к Snowflake с использованием внешнего OAuth"  
sidebar_label: "Настройка внешнего OAuth для Snowflake"
pagination_next: null
pagination_prev: null
---

# Настройка внешнего OAuth с Snowflake <Lifecycle status="managed, managed_plus" />

import AboutExternal from '/snippets/_about-external-oauth.md';

```md
<AboutExternal/>
```

Процесс настройки внешнего OAuth потребует некоторого взаимодействия между вашими учетными записями dbt Cloud, IdP и Snowflake, и открытие их в нескольких вкладках браузера поможет ускорить процесс настройки:

Процесс настройки внешнего OAuth потребует некоторого взаимодействия между учетными записями <Constant name="cloud" />, провайдера идентификации (IdP) и хранилища данных. Чтобы ускорить процесс конфигурации, рекомендуется открыть их в нескольких вкладках браузера:

- **<Constant name="cloud" />:** Основная работа будет вестись на странице **Account settings** —> **Integrations**. Для настройки интеграции и создания подключений вам потребуются [соответствующие права доступа](/docs/cloud/manage-access/enterprise-permissions).

**Провайдеры идентификации (Identity providers):**
- **Okta:** Вам предстоит работать в нескольких разделах учетной записи Okta, но начать можно с раздела **Applications**. Потребуются права на [создание приложения](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Application_permissions) и [authorization server](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Authorization_server_permissions).
- **Entra ID:** Требуется администратор с правами на создание [приложений Entra ID](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-available-permissions), который также является пользователем в хранилище данных.

**Хранилище данных:**
- **Snowflake:** Откройте worksheet в учетной записи, у которой есть права на [создание security integration](https://docs.snowflake.com/en/sql-reference/sql/create-security-integration).

### Команды Snowflake

:::info Требуется совпадение имени пользователя Snowflake и IdP
Убедитесь, что имя пользователя / адрес электронной почты, указанные администратором IdP, совпадают с именем пользователя в учетных данных Snowflake. Если адрес электронной почты, используемый при настройке <Constant name="cloud" />, отличается от адреса электронной почты в Snowflake, соединение не будет установлено или могут возникнуть проблемы.
:::

## Конфигурации хранилища данных

Ниже приведён шаблон для создания OAuth‑конфигураций в среде Snowflake:

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

**Примечания:**  
- Стандартные роли Snowflake `ACCOUNTADMIN`, `ORGADMIN` и `SECURITYADMIN` по умолчанию заблокированы для внешнего OAuth, поэтому аутентификация с ними, скорее всего, завершится неудачей. Подробнее см. в [документации Snowflake](https://docs.snowflake.com/en/sql-reference/sql/create-security-integration-oauth-external).  
- Значение параметра `external_oauth_snowflake_user_mapping_attribute` должно корректно сопоставляться с именем пользователя Snowflake. Например, если используется `email_address`, то email в токене от IdP должен в точности совпадать с именем пользователя Snowflake.

## Конфигурация провайдера идентификации

Выберите поддерживаемого провайдера идентификации (IdP), чтобы получить инструкции по настройке внешнего OAuth в соответствующей среде и завершению интеграции в <Constant name="cloud" />:

<Tabs>

<TabItem value="Okta">

### 1. Инициализируйте настройки dbt

1. В вашем аккаунте <Constant name="cloud" /> перейдите в **Account settings** —> **Integrations**.
2. Прокрутите страницу до раздела **Custom integrations** и нажмите **Add integrations**.
3. Оставьте это окно открытым. Вы можете установить **Integration type** в значение Okta и обратить внимание на **Redirect URI** в нижней части страницы. Скопируйте его в буфер обмена — он понадобится на следующих шагах.

<Lightbox src="/img/docs/dbt-cloud/callback-uri.png" width="60%" title="Скопируйте callback URI в нижней части страницы интеграции в dbt." />

### 2. Создание приложения Okta

1. Разверните раздел **Applications** на панели управления Okta и нажмите **Applications**. Нажмите кнопку **Create app integration**.
2. Выберите **OIDC** в качестве метода входа и **Web applications** в качестве типа приложения. Нажмите **Next**.

<Lightbox src="/img/docs/dbt-cloud/create-okta-app.png" width="60%" title="The Okta app creation window with OIDC and Web Application selected." />

3. Задайте приложению подходящее имя, например «External OAuth app for <Constant name="cloud" />», чтобы его было легко идентифицировать.
4. В разделе **Grant type** включите опцию **Refresh token**.
5. Прокрутите вниз до параметра **Sign-in redirect URIs**. Вам нужно вставить redirect URI, который вы получили из <Constant name="cloud" /> на шаге 1.3.

<Lightbox src="/img/docs/dbt-cloud/configure-okta-app.png" width="60%" title="The Okta app configuration window with the sign-in redirect URI configured to the dbt value." />

6. Сохраните конфигурацию приложения. Вы вернетесь к нему позже, но пока переходите к следующим шагам.

### 3. Создание API Okta

1. Разверните раздел **Security** и в боковом меню Okta выберите **API**.
2. На экране **API** нажмите **Add authorization server**. Задайте имя сервера авторизации (в качестве имени подойдёт псевдоним вашего аккаунта в хранилище данных). В поле **Audience** скопируйте и вставьте URL для входа в ваше хранилище данных (например, `https://abdc-ef1234.snowflakecomputing.com`). Добавьте подходящее описание сервера и нажмите **Save**.

<Lightbox src="/img/docs/dbt-cloud/create-okta-api.png" width="60%" title="Окно Okta API с заданным значением Audience." />

3. На экране конфигурации сервера авторизации откройте **Metadata URI** в новой вкладке. Вам понадобится информация с этого экрана на следующих шагах.

<Lightbox src="/img/docs/dbt-cloud/metadata-uri.png" width="60%" title="Страница настроек Okta API с выделенным URI метаданных." />

<Lightbox src="/img/docs/dbt-cloud/metadata-example.png" width="60%" title="Пример вывода по URI метаданных." />

4. Нажмите на вкладку **Scopes** и **Add scope**. В поле **Name** добавьте `session:role-any`. (Опционально) Настройте **Display phrase** и **Description** и нажмите **Create**.

<Lightbox src="/img/docs/dbt-cloud/add-api-scope.png" width="60%" title="Область API, настроенная в окне Add Scope." />

5. Откройте вкладку **Access policies** и нажмите **Add policy**. Дайте политике **Name** и **Description** и установите **Assign to** как **The following clients**. Начните вводить имя приложения, созданного на шаге 2.3, и вы увидите его автозаполнение. Выберите приложение и нажмите **Create Policy**.

```md
<Lightbox src="/img/docs/dbt-cloud/add-api-assignment.png" width="60%" title="Поле Assignment с автоматически подставленным значением." />
```

6. На экране **access policy** нажмите **Add rule**.

```md
<Lightbox src="/img/docs/dbt-cloud/add-api-rule.png" width="60%" title="Подсвечена кнопка Add rule для API." />
```

7. Дайте правилу описательное имя и прокрутите вниз до **token lifetimes**. Настройте **Access token lifetime is**, **Refresh token lifetime is**, и **but will expire if not used every** в соответствии с политиками вашей организации. Мы рекомендуем значения по умолчанию: 1 час и 90 дней. Более строгие правила увеличивают вероятность того, что вашим пользователям придется повторно проходить аутентификацию.

```md
<Lightbox src="/img/docs/dbt-cloud/configure-token-lifetime.png" width="60%" title="Настройки срока действия токена в окне правила API." />
```

8. Вернитесь на вкладку **Settings** и оставьте ее открытой в вашем браузере. Вам понадобится некоторая информация на следующих шагах.

### 4. Создайте настройки OAuth в хранилище данных

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

:::info Согласованность имени пользователя
Убедитесь, что имя пользователя (например, адрес электронной почты), указанное в IdP, совпадает с учетными данными Snowflake для всех пользователей. Несоответствие имен пользователей приведет к ошибкам аутентификации.
:::

### 5. Настройка интеграции в dbt

1. Вернитесь на страницу <Constant name="cloud" /> **Account settings** —> **Integrations**, на которой вы были в начале. Теперь можно приступать к заполнению всех полей.
   1. `Integration name`: Задайте для интеграции понятное и описательное имя, содержащее идентифицирующую информацию об окружении Okta, чтобы будущим пользователям не приходилось догадываться, к чему она относится.
   2. `Client ID` и `Client secrets`: Получите эти значения на странице приложения Okta.
   <Lightbox src="/img/docs/dbt-cloud/gather-clientid-secret.png" width="60%" title="Client ID и secret, выделенные в приложении Okta." />
   3. Authorize URL и Token URL: Эти значения можно найти в metadata URI.
   <Lightbox src="/img/docs/dbt-cloud/gather-authorization-token-endpoints.png" width="60%" title="Authorize URL и Token URL, выделенные в metadata URI." />

2. **Сохраните** конфигурацию

### 6. Создание нового соединения в dbt Cloud

### 6. Создайте новое подключение в dbt

<Lightbox src="/img/docs/dbt-cloud/configure-new-connection.png" width="60%" title="Новое окно конфигурации в dbt Cloud с отображением внешнего OAuth в качестве опции" />

1. Перейдите в **Account settings** и выберите **Connections** в меню. Нажмите **New connection**.
2. Настройте `Account`, `Database` и `Warehouse` так же, как вы делаете это обычно, а в поле `OAuth method` выберите внешний OAuth, который вы только что создали.

<Lightbox src="/img/docs/dbt-cloud/select-oauth-config.png" width="60%" title="Новое соединение отображается в блоке конфигураций External OAuth" />

<Lightbox src="/img/docs/dbt-cloud/configure-new-connection.png" width="60%" title="Новое окно конфигурации в dbt, где External OAuth доступен как вариант." />


3. Прокрутите вниз до блока конфигураций **External OAuth** и выберите нужную конфигурацию из списка.


<Lightbox src="/img/docs/dbt-cloud/select-oauth-config.png" width="60%" title="Новое подключение, отображаемое в блоке External OAuth Configurations." />

4. Нажмите **Save**, и на этом настройка External OAuth с Okta завершена!

</TabItem>

<TabItem value="Entra ID">

### 1. Initialize the dbt settings

1. В вашем аккаунте <Constant name="cloud" /> перейдите в **Account settings** —> **Integrations**.
2. Прокрутите страницу вниз до раздела **Custom integrations** и нажмите **Add integrations**.
3. Оставьте это окно открытым. Вы можете установить **Integration type** в значение Entra ID и обратить внимание на **Redirect URI** внизу страницы. Скопируйте его в буфер обмена — он понадобится на следующих шагах.

### 2. Create the Entra ID apps

- Вам потребуется создать два приложения в портале Azure: **resource server** и **client app**.
- В портале Azure откройте **Entra ID** и в левом меню выберите **App registrations**.

:::important

- Для завершения настройки вам понадобятся права **Entra ID admin** и **data warehouse admin**. Эти роли не обязательно должны быть у одного и того же человека — при совместной работе все будет функционировать корректно.
  - Как правило, администратор Entra ID отвечает за регистрацию приложений и разрешения, а администратор хранилища данных — за роли, grants и интеграции на стороне хранилища.
- Значение поля `value`, получаемое на этих шагах, отображается только один раз. Сразу после создания обязательно сохраните его.
- Убедитесь, что имя пользователя (например, адрес электронной почты), указанное в IdP, совпадает с учетными данными пользователей в хранилище данных. Несовпадение имен пользователей приведет к ошибкам аутентификации.
:::

### 3. Создание resource server

1. На экране **App registrations** нажмите **New registration**.
   1. Задайте имя приложения.
   2. Убедитесь, что параметр **Supported account types** установлен в значение “Accounts in this organizational directory only (`Org name` - Single Tenant)”.
   3. Нажмите **Register**, чтобы перейти к странице обзора приложения.
2. На странице обзора приложения в левом меню выберите **Expose an API**.
3. Нажмите **Add** рядом с **Application ID URI**. Поле заполнится автоматически. Нажмите **Save**.
4. Сохраните значение поля `value` для использования на следующем шаге. _Оно отображается только один раз. Обязательно запишите его сразу. Microsoft скрывает это поле после ухода со страницы и повторного возврата._
5. На том же экране нажмите **Add scope**.
   1. Укажите имя scope: `session:role-any`.
   2. В поле “Who can consent?” выберите **Admins and users**.
   3. В поле **Admin consent display name** укажите `session:role-any` и добавьте описание.
   4. Убедитесь, что параметр **State** установлен в **Enabled**.
   5. Нажмите **Add scope**.

### 4. Создание client app

1. На странице **App registrations** нажмите **New registration**.
   1. Задайте имя приложения, которое однозначно указывает, что это client app.
   2. Убедитесь, что параметр **Supported account types** установлен в значение “Accounts in this organizational directory only (`Org name` - Single Tenant)”.
   3. В поле **Redirect URI** выберите **Web** и скопируйте/вставьте **Redirect URI** из <Constant name="cloud" />.
   4. Нажмите **Register**.
2. На странице обзора приложения в левом меню выберите **API permissions** и нажмите **Add permission**.
3. В открывшейся панели выберите **APIs my organization uses**, найдите resource server, созданный на предыдущих шагах, и выберите его.
4. Убедитесь, что разрешение **Permissions** `session:role-any` отмечено, и нажмите **Add permissions**.
5. Нажмите **Grant admin consent**, а затем в модальном окне подтвердите действие, нажав **Yes**.
6. В левом меню выберите **Certificates and secrets** и нажмите **New client secret**. Укажите имя секрета, задайте срок действия и нажмите **Add**.  
   **Примечание**: Microsoft не допускает срок действия “forever”. Максимальный срок — два года. Крайне важно зафиксировать дату истечения срока действия, чтобы обновить секрет заранее, иначе аутентификация пользователей перестанет работать.
7. Сохраните значение `value` для использования на следующем шаге и обязательно сделайте это сразу.  
   **Примечание**: Entra ID больше не покажет это значение после того, как вы покинете данный экран.

### 5. Конфигурация хранилища данных

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

1. В приложении **Client ID** в Entra ID нажмите **Endpoints** и откройте **Federation metadata document** в новой вкладке.
   - Значение **entity ID** на этой странице соответствует полю `external_oauth_issuer` в конфигурации Snowflake.
2. Вернувшись к списку endpoints, откройте **OpenID Connect metadata document** в новой вкладке.
   - Поле **jwks_uri** соответствует полю `external_oauth_jws_keys_url` в Snowflake.
3. Перейдите к resource server, который настраивался на предыдущих шагах.
   - Значение **Application ID URI** соответствует полю `external_oauth_audience_list` в Snowflake.
4. Примените конфигурации. Для завершения настройки вам понадобятся права администратора Entra ID и администратора хранилища данных. Если это разные люди, им необходимо работать совместно, чтобы завершить конфигурацию.


### 6. Настройка интеграции в dbt

1. Перейдите обратно на страницу <Constant name="cloud" /> **Account settings** —> **Integrations**, на которой вы были в начале. Теперь можно приступать к заполнению всех полей. В процессе потребуется несколько раз переключаться между аккаунтом Entra ID и <Constant name="cloud" />.
2. `Integration name`: Задайте интеграции понятное и описательное имя, которое содержит информацию об окружении Entra ID, чтобы будущим пользователям не приходилось гадать, к чему относится эта интеграция.
3. `Client secrets`: Значение берётся из Client ID на странице **Certificates and secrets**. Поле `Value` — это `Client secret`. Обратите внимание, что оно отображается только в момент создания; _Microsoft скрывает secret при повторном открытии страницы, и в этом случае его необходимо создать заново._
4. `Client ID`: Скопируйте значение `Application (client) ID` со страницы Overview приложения Client ID.
5. `Authorization URL` и `Token URL`: В приложении Client ID откройте вкладку `Endpoints`. Эти URL соответствуют полям `OAuth 2.0 authorization endpoint (v2)` и `OAuth 2.0 token endpoint (v2)`. *Необходимо использовать v2 для `OAuth 2.0 authorization endpoint`. Не используйте v1.* Для `OAuth 2.0 token endpoint` можно использовать любую версию.
6. `Application ID URI`: Скопируйте значение поля `Application ID URI` со страницы Overview resource server.

</TabItem>

</Tabs>

## Часто задаваемые вопросы

<FAQ path="Troubleshooting/failed-snowflake-oauth-connection" />