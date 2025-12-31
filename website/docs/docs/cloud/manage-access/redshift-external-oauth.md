---
title: "Настройка внешнего OAuth для Redshift"
id: redshift-external-oauth
description: "Инструкции по настройке dbt и внешних OAuth-подключений с Redshift"
sidebar_label: "Настройка внешнего OAuth с Redshift"
pagination_next: null
pagination_prev: null
---

# Настройка внешнего OAuth с Redshift <Lifecycle status="managed, managed_plus" /> {#set-up-external-oauth-with-redshift}

import AboutExternal from '/snippets/_about-external-oauth.md';

<AboutExternal/>

## Начало работы {#getting-started}

Процесс настройки внешнего OAuth потребует некоторого взаимодействия между вашими аккаунтами <Constant name="cloud" />, IdP и хранилища данных. Чтобы ускорить процесс конфигурации, рекомендуется держать их открытыми в нескольких вкладках браузера:

- **<Constant name="cloud" />:** Основная работа будет в разделе **Account settings** —> **Integrations**. Для настройки интеграции и создания подключений вам потребуются [соответствующие права доступа](/docs/cloud/manage-access/enterprise-permissions).
- **Провайдеры идентификации (Identity providers):**
   - **Okta:** Вам предстоит работать в нескольких разделах аккаунта Okta, но начать можно с раздела **Applications**. Потребуются права на [создание приложения](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Application_permissions) и [authorization server](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Authorization_server_permissions).
   - **Entra ID:** Требуется администратор с доступом к созданию [приложений Entra ID](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-available-permissions), который также является пользователем в хранилище данных. 
- **Хранилище данных:**
   - **Redshift:** Создайте и управляйте интеграцией с [Identity Center](https://aws.amazon.com/blogs/big-data/integrate-identity-provider-idp-with-amazon-redshift-query-editor-v2-and-sql-client-using-aws-iam-identity-center-for-seamless-single-sign-on/) совместно с вашим провайдером идентификации.

Если администраторы, отвечающие за эти продукты, — разные люди, лучше координировать работу одновременно, чтобы снизить трение в процессе настройки.

Убедитесь, что ваши администраторы Amazon завершили интеграцию [Amazon Identity Center](https://aws.amazon.com/blogs/big-data/integrate-identity-provider-idp-with-amazon-redshift-query-editor-v2-and-sql-client-using-aws-iam-identity-center-for-seamless-single-sign-on/) с Okta или Entra ID.

## Конфигурация провайдера идентификации {#identity-provider-configuration}

Выберите поддерживаемого провайдера идентификации (IdP), чтобы получить инструкции по настройке внешнего OAuth в его среде и завершению интеграции в <Constant name="cloud" />:

<Tabs>

<TabItem value="Okta">

### 1. Инициализация настроек dbt {#1-initialize-the-dbt-settings}

1. В вашем аккаунте <Constant name="cloud" /> перейдите в **Account settings** —> **Integrations**.
2. Прокрутите страницу до раздела **Custom integrations** и нажмите **Add integrations**.
3. Оставьте это окно открытым. Установите **Integration type** в значение Okta и обратите внимание на **Redirect URI** в нижней части страницы. Скопируйте его в буфер обмена — он понадобится на следующих шагах.

<Lightbox src="/img/docs/dbt-cloud/callback-uri.png" width="60%" title="Скопируйте callback URI в нижней части страницы интеграции в dbt." />

### 2. Создание приложения Okta {#2-create-the-okta-app}

1. В панели управления Okta раскройте раздел **Applications** и нажмите **Applications**. Затем нажмите кнопку **Create app integration**.
2. Выберите **OIDC** в качестве метода входа и **Web applications** в качестве типа приложения. Нажмите **Next**.

<Lightbox src="/img/docs/dbt-cloud/create-okta-app.png" width="60%" title="Окно создания приложения Okta с выбранными OIDC и Web Application." />

3. Задайте приложению понятное имя, например “External OAuth app for <Constant name="cloud" />”, чтобы его было легко идентифицировать.
4. В разделе **Grant type** включите опцию **Refresh token**.
5. Прокрутите страницу до параметра **Sign-in redirect URIs**. Вставьте redirect URI, полученный из <Constant name="cloud" /> на шаге 1.3.

<Lightbox src="/img/docs/dbt-cloud/configure-okta-app.png" width="60%" title="Окно конфигурации приложения Okta с настроенным sign-in redirect URI." />

6. Сохраните конфигурацию приложения. Вы вернетесь к нему позже, а пока переходите к следующим шагам.

### 3. Создание Okta API {#3-create-the-okta-api}

1. Раскройте раздел **Security** и выберите **API** в боковом меню Okta.
2. На экране API нажмите **Add authorization server**. Задайте имя authorization server (подойдет псевдоним вашего аккаунта хранилища данных). В поле **Audience** скопируйте и вставьте URL входа в хранилище данных. Добавьте описание и нажмите **Save**.

<Lightbox src="/img/docs/dbt-cloud/create-okta-api.png" width="60%" title="Окно Okta API с заданным значением Audience." />

3. На экране конфигурации authorization server откройте **Metadata URI** в новой вкладке. Информация с этой страницы понадобится на следующих шагах.

<Lightbox src="/img/docs/dbt-cloud/metadata-uri.png" width="60%" title="Страница настроек Okta API с выделенным metadata URI." />

<Lightbox src="/img/docs/dbt-cloud/metadata-example.png" width="60%" title="Пример вывода metadata URI." />

4. Перейдите на вкладку **Scopes** и нажмите **Add scope**. В поле **Name** укажите `session:role-any`. (Необязательно) Настройте **Display phrase** и **Description**, затем нажмите **Create**.

<Lightbox src="/img/docs/dbt-cloud/add-api-scope.png" width="60%" title="Настройка API scope в окне Add Scope." />

5. Откройте вкладку **Access policies** и нажмите **Add policy**. Укажите **Name** и **Description**, а в поле **Assign to** выберите **The following clients**. Начните вводить имя приложения, созданного на шаге 2.3 — оно подставится автоматически. Выберите приложение и нажмите **Create Policy**.

<Lightbox src="/img/docs/dbt-cloud/add-api-assignment.png" width="60%" title="Поле Assignment с автоматически подставленным значением." />

6. На экране **access policy** нажмите **Add rule**.

<Lightbox src="/img/docs/dbt-cloud/add-api-rule.png" width="60%" title="Выделенная кнопка Add rule в API." />

7. Задайте правилу понятное имя и прокрутите страницу до раздела **token lifetimes**. Настройте параметры **Access token lifetime is**, **Refresh token lifetime is** и **but will expire if not used every** в соответствии с политиками вашей организации. Мы рекомендуем значения по умолчанию — 1 час и 90 дней. Более строгие правила увеличивают вероятность того, что пользователям придется чаще проходить повторную аутентификацию.

<Lightbox src="/img/docs/dbt-cloud/configure-token-lifetime.png" width="60%" title="Настройки времени жизни токенов в окне API rule." />

8. Вернитесь на вкладку **Settings** и оставьте ее открытой в браузере — часть информации понадобится позже.

### 4. Создание настроек OAuth в хранилище данных {#4-create-the-oauth-settings-in-the-data-warehouse}

Убедитесь, что администраторы Amazon завершили интеграцию Identity Center с Okta.

Настройте приложение Okta и API в соответствии с конфигурацией Amazon.

### 5. Настройка интеграции в dbt {#5-configuring-the-integration-in-dbt}

1. Вернитесь на страницу <Constant name="cloud" /> **Account settings** —> **Integrations**, открытую в начале. Теперь заполните все поля.
   1. `Integration name`: Укажите описательное имя интеграции, включающее информацию об окружении Okta, чтобы будущим пользователям не приходилось догадываться о ее назначении.
   2. `Client ID` и `Client secrets`: Получите эти значения на странице приложения Okta.
   <Lightbox src="/img/docs/dbt-cloud/gather-clientid-secret.png" width="60%" title="Client ID и secret, выделенные на странице приложения Okta." />
   3. `Authorize URL` и `Token URL`: Эти значения можно найти в metadata URI.
   <Lightbox src="/img/docs/dbt-cloud/gather-authorization-token-endpoints.png" width="60%" title="Authorize и token URLs, выделенные в metadata URI." />

2. Нажмите **Save**, чтобы сохранить конфигурацию.

### 6. Создание нового подключения в dbt {#6-create-a-new-connection-in-dbt}

1. Перейдите в **Account settings** и выберите **Connections** в меню. Нажмите **New connection**.
2. Настройте `Account`, `Database` и `Warehouse` как обычно, а в поле `OAuth method` выберите созданный вами внешний OAuth.

<Lightbox src="/img/docs/dbt-cloud/configure-new-connection.png" width="60%" title="Окно новой конфигурации в dbt с опцией External OAuth." />

3. Прокрутите страницу до блока **External OAuth** и выберите нужную конфигурацию из списка.

<Lightbox src="/img/docs/dbt-cloud/select-oauth-config.png" width="60%" title="Новое подключение, отображаемое в блоке External OAuth Configurations." />

4. Нажмите **Save** — внешняя OAuth-аутентификация с Okta настроена!

</TabItem>

<TabItem value="Entra ID">

### 1. Инициализация настроек dbt {#1-initialize-the-dbt-settings-1}

1. В вашем аккаунте <Constant name="cloud" /> перейдите в **Account settings** —> **Integrations**.
2. Прокрутите страницу до **Custom integrations** и нажмите **Add integrations**.
3. Оставьте это окно открытым. Установите **Integration type** в значение Entra ID и обратите внимание на **Redirect URI** внизу страницы. Скопируйте его для использования на следующих шагах.

### 2. Создание приложений Entra ID {#2-create-the-entra-id-apps}

В портале Azure необходимо создать два приложения: resource server и client app.

#### Создание resource server {#create-a-resource-server}

В вашем аккаунте Entra ID: 

1. На странице регистрации приложений нажмите **New registration**.
    1. Задайте имя приложения.
    2. Убедитесь, что **Supported account types** установлено в значение “Accounts in this organizational directory only (`Org name` - Single Tenant).”
    3. Нажмите **Register**, чтобы перейти к обзору приложения.
2. В левом меню страницы обзора приложения выберите **Expose an API**.
3. Нажмите **Add** рядом с **Application ID URI** — поле будет заполнено автоматически. 
4. Нажмите **Save**.

   <Lightbox src="/img/docs/dbt-cloud/create-resource-server.png" width="60%" title="Создание resource server в Entra ID." />

5. Запишите значение поля `value` — оно понадобится позже.
6. На той же странице нажмите **Add scope**:
    1. Назовите scope `dbt-redshift`.
    2. В поле **Who can consent?** выберите **Admins and users**.
    3. В **Admin consent display name** укажите `dbt-redshift` и добавьте описание.
    4. Убедитесь, что **State** установлено в **Enabled**.
    5. Нажмите **Add scope**.

#### Создание client app {#create-a-client-app}

1. На странице **App registration** нажмите **New registration**.
    1. Задайте имя, однозначно идентифицирующее приложение как client app.
    2. Убедитесь, что **Supported account types** установлено в “Accounts in this organizational directory only (`Org name` - Single Tenant).”
    3. В поле **Redirect URI** выберите **Web** и вставьте **Redirect URI** из dbt.
    4. Нажмите **Register**.
2. На странице обзора приложения выберите **API permissions** в левом меню и нажмите **Add permission**.

   <Lightbox src="/img/docs/dbt-cloud/add-permission-entra.png" width="60%" title="Добавление разрешений для приложения Entra ID." />

3. В появившемся окне выберите **APIs my organization uses**, найдите resource server, созданный ранее, и выберите его.
4. Убедитесь, что разрешение `dbt-redshift` отмечено, и нажмите **Add permissions**.
5. Нажмите **Grant admin consent** и в модальном окне подтвердите выбор, нажав **Yes**.
6. В левом меню выберите **Certificates and secrets** и нажмите **New client secret**. Укажите имя секрета, срок действия и нажмите **Add**.
    - **Примечание:** Microsoft не разрешает использовать “forever” в качестве срока действия. Максимальный срок — два года. Крайне важно зафиксировать дату истечения срока действия, чтобы обновить секрет до того, как истечет срок или авторизация пользователя перестанет работать.
7. Сразу запишите значение `value` для дальнейшего использования.
   - **Примечание:** Entra ID больше не покажет это значение после ухода с данной страницы.

### 3. Настройка интеграции в dbt {#3-configuring-the-integration-in-dbt}

1. Вернитесь на страницу <Constant name="cloud" /> **Account settings** —> **Integrations**, открытую в начале. Здесь потребуется некоторое переключение между аккаунтом Entra ID и <Constant name="cloud" />.
2. `Integration name`: Укажите описательное имя интеграции с информацией об окружении Entra ID.
3. `Client secrets`: Находится в Client ID на странице **Certificates and secrets**. Поле `Value` — это `Client secret`. Учтите, что оно отображается только при создании; _Microsoft скрывает секрет при повторном посещении страницы, и его необходимо создавать заново_.
4. `Client ID`: Скопируйте значение **Application (client) ID** на странице обзора client app.
5. `Authorization URL` и `Token URL`: В client app откройте вкладку `Endpoints`. Эти URL соответствуют полям `OAuth 2.0 authorization endpoint (v2)` и `OAuth 2.0 token endpoint (v2)`. *Обязательно используйте версию v2 для `OAuth 2.0 authorization endpoint`. Не используйте v1.* Для `OAuth 2.0 token endpoint` можно использовать любую версию.
6. `Application ID URI`: Скопируйте значение поля `Application ID URI` со страницы Overview resource server.

</TabItem>

</Tabs>

## Настройка Trusted Token Issuer в IAM IdC {#configure-the-trusted-token-issuer-in-iam-idc}

*Trusted token issuer* генерирует access token, который используется для идентификации пользователя, а затем аутентифицирует его. Это позволяет сервисам за пределами экосистемы AWS, таким как платформа dbt, подключаться к IAM IdC (и Redshift), используя access tokens, полученные или сгенерированные внешним IdP (Entra ID или Okta).

Следующие шаги описаны в [этой статье блога](https://aws.amazon.com/blogs/big-data/integrate-tableau-and-microsoft-entra-id-with-amazon-redshift-using-aws-iam-identity-center/):

1. Откройте AWS Management Console и перейдите в [IAM Identity Center](https://console.aws.amazon.com/singlesignon), затем в раздел **Settings**.
2. Выберите вкладку **Authentication** и в разделе **Trusted token issuers** нажмите **Create trusted token issuer**.
3. На странице **Set up an external IdP to issue trusted tokens** в разделе **Trusted token issuer details** выполните следующее:
    1. В поле **Issuer URL** укажите OIDC discovery URL внешнего IdP, который будет выпускать токены для trusted identity propagation. _Обязательно включите завершающий слеш в конце URL_.
    2. В поле **Trusted token issuer name** укажите имя для идентификации TTI в IAM Identity Center и консоли приложений.
    3. В разделе Map attributes выполните следующее:
        1. В поле **Identity provider attribute** выберите атрибут для сопоставления с атрибутом в identity store Identity Center. Можно выбрать:
         - Email 
         - Object Identifier
         - Subject
         - Other — по нашему опыту, при использовании этого варианта с UPN значение `upn` совпадало с `Email`.

## Настройка приложения Redshift IdC для использования TTI {#configure-redshift-idc-application-to-utilize-tti}

Для начала в консоли Amazon Redshift выберите **IAM Identity Center connection**.

<Lightbox src="/img/docs/dbt-cloud/redshift-idc.png" width="60%" title="Консоль AWS Redshift." />

1. Выберите приложение Amazon Redshift, созданное в рамках первоначальной настройки.
2. Перейдите на вкладку **Client connections tab** и нажмите **Edit**.
3. В разделе **Configure client connections that use third-party IdPs** выберите **Yes**.
4. Отметьте checkbox для **Trusted token issuer**, созданного на предыдущем шаге.
5. Введите значение aud claim в разделе **Configure selected trusted token issuers**. **Это должно быть значение Application ID URI, которое вы указали для интеграции в платформе dbt.**

## Завершение настройки dbt {#finalizing-the-dbt-configuration}

Если у вас уже есть подключение, убедитесь, что в нем выбран метод аутентификации **External OAuth**, и выберите интеграцию, созданную ранее. В противном случае создайте новое подключение Redshift, обязательно указав значения для:
- **Server Hostname**
- **OAuth Method**
- **Database name** (это поле находится в разделе **Optional Settings**)

Это подключение должно быть назначено среде разработки в существующем или новом проекте.

После того как подключение назначено среде разработки, вы можете настроить учетные данные пользователя для этой среды в разделе `Account Settings > Your Profile > Credentials > <Your Project Name>`. Установите метод аутентификации `External OAuth`, при необходимости задайте `schema` и другие поля и сохраните учетные данные. После этого вы сможете нажать кнопку `Connect to Redshift`.

### Проверка подключения в Studio {#verify-connection-in-studio}

После инициализации сессии разработки вы можете проверить подключение к Redshift с использованием внешнего OAuth, выполнив команду `dbt debug`.
