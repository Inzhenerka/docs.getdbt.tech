---
title: "Настройка внешнего OAuth для Redshift"
id: redshift-external-oauth
description: "Инструкции по настройке dbt и внешних OAuth-подключений с Redshift"
sidebar_label: "Настройка внешнего OAuth с Redshift"
pagination_next: null
pagination_prev: null
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Настройка внешней аутентификации OAuth для Redshift

import AboutExternal from '/snippets/_about-external-oauth.md';

<AboutExternal/>

## Начало работы {#getting-started}

Процесс настройки внешнего OAuth потребует переключения между вашими учетными записями <Constant name="dbt" />, IdP и хранилища данных. Откройте их в нескольких вкладках браузера, чтобы ускорить настройку:

- **<Constant name="dbt" />:** Вы будете работать преимущественно на странице **Account settings** —> **Integrations**. Для настройки интеграции и создания подключений вам понадобятся [соответствующие разрешения](/docs/platform/manage-access/enterprise-permissions).
- **Поставщики удостоверений:**
   - **Okta:** Вы будете работать в нескольких разделах учетной записи Okta, но начать можно с раздела **Applications**. Вам понадобятся разрешения на [создание приложения](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Application_permissions) и [сервера авторизации](https://help.okta.com/en-us/content/topics/security/custom-admin-role/about-role-permissions.htm#Authorization_server_permissions).
   - **Entra ID** Требуется администратор с разрешениями на создание [приложений Entra ID](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/custom-available-permissions), который также является пользователем хранилища данных. 
- **Хранилище данных:**
   - **Redshift:** Создайте и настройте [интеграцию Identity Center](https://aws.amazon.com/blogs/big-data/integrate-identity-provider-idp-with-amazon-redshift-query-editor-v2-and-sql-client-using-aws-iam-identity-center-for-seamless-single-sign-on/) с вашим поставщиком удостоверений и управляйте ею.

Если администраторы, отвечающие за эти продукты, — разные люди, лучше координировать работу одновременно, чтобы снизить трение в процессе настройки.

Убедитесь, что ваши администраторы Amazon завершили интеграцию [Amazon Identity Center](https://aws.amazon.com/blogs/big-data/integrate-identity-provider-idp-with-amazon-redshift-query-editor-v2-and-sql-client-using-aws-iam-identity-center-for-seamless-single-sign-on/) с Okta или Entra ID.

## Конфигурация провайдера идентификации {#identity-provider-configuration}

Выберите поддерживаемого поставщика удостоверений (IdP), чтобы получить инструкции по настройке внешнего OAuth в его среде и завершению интеграции с <Constant name="dbt" />:

<Tabs>

<TabItem value="Okta">

### 1. Инициализация настроек dbt {#1-initialize-the-dbt-settings}

1. В своей учетной записи <Constant name="dbt" /> перейдите в **Account settings** —> **Integrations**.
2. Прокрутите страницу вниз до раздела **Custom integrations** и нажмите **Add integrations**
3. Оставьте это окно открытым. Вы можете установить для **Integration type** значение Okta и найти **Redirect URI** внизу страницы. Скопируйте этот URI в буфер обмена для использования на следующих шагах.

<Lightbox src="/img/docs/dbt-platform/callback-uri.png" width="60%" title="Скопируйте URI обратного вызова внизу страницы интеграции в dbt." />

### 2. Создание приложения Okta {#2-create-the-okta-app}

1. В панели управления Okta раскройте раздел **Applications** и нажмите **Applications**. Затем нажмите кнопку **Create app integration**.
2. Выберите **OIDC** в качестве метода входа и **Web applications** в качестве типа приложения. Нажмите **Next**.

<Lightbox src="/img/docs/dbt-platform/create-okta-app.png" width="60%" title="Окно создания приложения Okta с выбранными параметрами OIDC и Web Application." />

3. Задайте приложению подходящее имя, например «Приложение внешней OAuth-аутентификации для <Constant name="dbt" />», чтобы его было легко распознать.
4. В разделе **Grant type** включите опцию **Refresh token**.
5. Прокрутите страницу вниз до параметра **Sign-in redirect URIs**. Вставьте URI перенаправления, полученный в <Constant name="dbt" /> на шаге 1.3.

<Lightbox src="/img/docs/dbt-platform/configure-okta-app.png" width="60%" title="Окно настройки приложения Okta, в котором для URI перенаправления при входе указано значение из dbt." />

6. Сохраните конфигурацию приложения. Вы вернетесь к нему позже, а пока переходите к следующим шагам.

### 3. Создание Okta API {#3-create-the-okta-api}

1. Раскройте раздел **Security** и выберите **API** в боковом меню Okta.
2. На экране API нажмите **Add authorization server**. Задайте имя authorization server (подойдет псевдоним вашего аккаунта хранилища данных). В поле **Audience** скопируйте и вставьте URL входа в хранилище данных. Добавьте описание и нажмите **Save**.

<Lightbox src="/img/docs/dbt-platform/create-okta-api.png" width="60%" title="Окно API Okta с заданным значением Audience." />

3. На экране конфигурации authorization server откройте **Metadata URI** в новой вкладке. Информация с этой страницы понадобится на следующих шагах.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-platform/metadata-uri.png" width="60%" title="Страница настроек API Okta с выделенным URI метаданных." />

<Lightbox src="/img/docs/dbt-platform/metadata-example.png" width="60%" title="Пример данных, полученных по URI метаданных." />

</DocCarousel>

4. Перейдите на вкладку **Scopes** и нажмите **Add scope**. В поле **Name** укажите `session:role-any`. (Необязательно) Настройте **Display phrase** и **Description**, затем нажмите **Create**.

<Lightbox src="/img/docs/dbt-platform/add-api-scope.png" width="60%" title="Область действия API, настроенная в окне добавления области действия." />

5. Откройте вкладку **Access policies** и нажмите **Add policy**. Укажите **Name** и **Description**, а в поле **Assign to** выберите **The following clients**. Начните вводить имя приложения, созданного на шаге 2.3 — оно подставится автоматически. Выберите приложение и нажмите **Create Policy**.

<Lightbox src="/img/docs/dbt-platform/add-api-assignment.png" width="60%" title="Автоматическое заполнение значения в поле назначения." />

6. На экране **access policy** нажмите **Add rule**.

<Lightbox src="/img/docs/dbt-platform/add-api-rule.png" width="60%" title="Выделена кнопка добавления правила API." />

7. Задайте правилу понятное имя и прокрутите страницу до раздела **token lifetimes**. Настройте параметры **Access token lifetime is**, **Refresh token lifetime is** и **but will expire if not used every** в соответствии с политиками вашей организации. Мы рекомендуем значения по умолчанию — 1 час и 90 дней. Более строгие правила увеличивают вероятность того, что пользователям придется чаще проходить повторную аутентификацию.

<Lightbox src="/img/docs/dbt-platform/configure-token-lifetime.png" width="60%" title="Настройки срока действия токена в окне правила API." />

8. Вернитесь на вкладку **Settings** и оставьте ее открытой в браузере — часть информации понадобится позже.

### 4. Создание настроек OAuth в хранилище данных {#4-create-the-oauth-settings-in-the-data-warehouse}

Убедитесь, что администраторы Amazon завершили интеграцию Identity Center с Okta.

Настройте приложение Okta и API в соответствии с конфигурацией Amazon.

### 5. Настройка интеграции в dbt {#5-configuring-the-integration-in-dbt}

1. Вернитесь на страницу **Account settings** —> **Integrations** в <Constant name="dbt" />, на которой вы были в начале. Теперь пора заполнить все поля.
   1. `Integration name`: Задайте интеграции понятное имя, включающее сведения, позволяющие определить среду Okta, чтобы будущим пользователям не приходилось гадать, к какой среде она относится.
   2. `Client ID` и `Client secrets`: Скопируйте эти значения со страницы приложения Okta.
   <Lightbox src="/img/docs/dbt-platform/gather-clientid-secret.png" width="60%" title="Идентификатор клиента и секрет, выделенные в приложении Okta." />
   3. Authorize URL и Token URL: Находятся в URI метаданных.
   <Lightbox src="/img/docs/dbt-platform/gather-authorization-token-endpoints.png" width="60%" title="URL-адреса авторизации и получения токена, выделенные в URI метаданных." />

2. Нажмите **Save**, чтобы сохранить конфигурацию.

### 6. Создание нового подключения в dbt {#6-create-a-new-connection-in-dbt}

1. Перейдите в **Account settings** и выберите **Connections** в меню. Нажмите **New connection**.
2. Настройте `Account`, `Database` и `Warehouse` как обычно, а в поле `OAuth method` выберите созданный вами внешний OAuth.

<Lightbox src="/img/docs/dbt-platform/configure-new-connection.png" width="60%" title="Новое окно настройки в dbt, в котором доступен вариант External OAuth." />


3. Прокрутите вниз до блока **External OAuth** и выберите конфигурацию из списка.


<Lightbox src="/img/docs/dbt-platform/select-oauth-config.png" width="60%" title="Новое подключение в блоке External OAuth Configurations." />

4. Сохраните подключение, нажав **Save**. Настройка External OAuth с Okta завершена!

</TabItem>

<TabItem value="Entra ID">

### 1. Инициализация настроек dbt {#1-initialize-the-dbt-settings-1}

1. В своей учетной записи <Constant name="dbt" /> перейдите в **Account settings** (Настройки учетной записи) —> **Integrations** (Интеграции).
2. Прокрутите страницу вниз до раздела **Custom integrations** (Пользовательские интеграции) и нажмите **Add integrations** (Добавить интеграции).
3. Оставьте это окно открытым. В поле **Integration type** (Тип интеграции) можно выбрать Entra ID. Найдите **Redirect URI** (URI перенаправления) в нижней части страницы и скопируйте его в буфер обмена для использования на следующих шагах.

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

<Lightbox src="/img/docs/dbt-platform/create-resource-server.png" width="60%" title="Создание сервера ресурсов Entra ID." />

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

<Lightbox src="/img/docs/dbt-platform/add-permission-entra.png" width="60%" title="Добавление разрешений для приложения Entra ID." />

3. На появившейся панели нажмите **APIs my organization uses**, найдите имя сервера ресурсов из предыдущих шагов и нажмите на него.
4. Убедитесь, что в разделе **Permissions** установлен флажок `dbt-redshift`, и нажмите **Add permissions**.
5. Нажмите **Grant admin consent**, а затем в появившемся модальном окне нажмите **Yes**.
6. В меню слева выберите **Certificates and secrets** и нажмите **New client secret**. Задайте имя секрета, установите срок его действия и нажмите **Add**.
    - **Примечание**: Microsoft не позволяет создавать секреты с бессрочным действием. Максимальный срок — два года. Обязательно зафиксируйте дату истечения срока действия, чтобы обновить секрет до этой даты и избежать сбоев авторизации пользователей.
7. Сразу сохраните `value` для использования на одном из следующих шагов.
   - **Примечание**: Entra ID больше не покажет это значение после того, как вы покинете этот экран.

### 3. Настройка интеграции в dbt

1. Вернитесь на страницу **Account settings** —> **Integrations** в <Constant name="dbt" />, которую вы открывали в начале. Теперь можно приступить к заполнению всех полей. При этом потребуется несколько раз переключаться между учетной записью Entra ID и <Constant name="dbt" />.
2. `Integration name`: задайте интеграции понятное имя, содержащее сведения для идентификации среды Entra ID, чтобы в дальнейшем пользователям не приходилось гадать, к какой среде она относится.
3. `Client secrets`: находится в приложении Client ID на странице **Certificates and secrets**. `Value` — это `Client secret`. Обратите внимание, что это значение отображается только при создании; _если вы вернетесь позже, Microsoft скроет секрет, и вам придется создать его заново._
4. `Client ID`: скопируйте значение поля «Application (client) ID» на странице обзора приложения Client ID.
5. `Authorization URL` и `Token URL`: в приложении Client ID откройте вкладку `Endpoints`. Эти URL соответствуют полям `OAuth 2.0 authorization endpoint (v2)` и `OAuth 2.0 token endpoint (v2)`. *Обязательно используйте версию v2 для `OAuth 2.0 authorization endpoint`. Не используйте V1.* Для `OAuth 2.0 token endpoint` можно использовать любую из версий.
6. `Application ID URI`: скопируйте значение поля `Application ID URI` со страницы Overview сервера ресурсов.

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

<Lightbox src="/img/docs/dbt-platform/redshift-idc.png" width="60%" title="Консоль AWS Redshift." />

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
