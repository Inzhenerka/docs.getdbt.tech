---
title: "Настройка BigQuery OAuth"  
description: "Узнайте, как администраторы dbt могут использовать BigQuery OAuth для управления доступом в аккаунте dbt"
id: "set-up-bigquery-oauth"
pagination_next: null
---

import EntraIdGetToken from '/snippets/_entra-id-get-token.md';

# Настройка OAuth для BigQuery <Lifecycle status="managed, managed_plus" />

:::info Функция уровня Enterprise

В этом руководстве описывается функциональность, доступная на тарифных планах <Constant name="cloud" /> Enterprise и Enterprise+. Если вы хотите узнать больше о наших тарифах уровня Enterprise, свяжитесь с нами по адресу sales@getdbt.com.

:::

<Constant name="cloud" /> поддерживает [OAuth](https://cloud.google.com/bigquery/docs/authentication) для BigQuery, предоставляя дополнительный уровень безопасности для пользователей dbt уровня Enterprise.

## Настройка нативного OAuth BigQuery

Когда OAuth BigQuery включён для проекта <Constant name="cloud" />, все разработчики <Constant name="cloud" /> должны проходить аутентификацию в BigQuery для доступа к инструментам разработки, таким как <Constant name="cloud_ide" />.

Чтобы использовать BigQuery в IDE dbt Cloud, все разработчики должны:
1. [Аутентифицироваться в BigQuery](#authenticating-to-bigquery) в своих учетных данных профиля.

Чтобы настроить BigQuery OAuth в <Constant name="cloud" />, администратор BigQuery должен:

1. [Найти значение redirect URI](#locate-the-redirect-uri-value) в <Constant name="cloud" />.
2. [Создать BigQuery OAuth 2.0 client ID и secret](#creating-a-bigquery-oauth-20-client-id-and-secret) в BigQuery.
3. [Настроить подключение](#configure-the-connection-in-dbt-cloud) в <Constant name="cloud" />.

Чтобы использовать BigQuery в <Constant name="cloud_ide" />, все разработчики должны:

1. [Аутентифицироваться в BigQuery](#authenticating-to-bigquery) в своих учетных данных профиля.

### Locate the redirect URI value

Для начала необходимо найти redirect URI подключения, который потребуется для настройки BigQuery OAuth. Для этого:

1. Перейдите к имени вашей учетной записи над иконкой профиля в левой боковой панели.
2. В меню выберите **Account settings**.
3. В левой боковой панели выберите **Connections**.
4. Нажмите на подключение BigQuery.
5. Найдите поле **Redirect URI** в разделе **Development OAuth**. Скопируйте это значение в буфер обмена — оно понадобится позже.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/dbt-cloud-bq-id-secret-02.png" title="Accessing the BigQuery OAuth configuration in dbt" />

### Creating a BigQuery OAuth 2.0 client ID and secret

Для продолжения необходимо создать client ID и secret для [аутентификации](https://cloud.google.com/bigquery/docs/authentication) в BigQuery. Эти client ID и secret будут сохранены в <Constant name="cloud" /> и использоваться для управления OAuth‑подключением между пользователями <Constant name="cloud" /> и BigQuery.

На странице **Credentials** вы можете увидеть свои существующие ключи, клиентские ID и учетные записи служб.

Настройте [экран согласия OAuth](https://support.google.com/cloud/answer/6158849), если вы еще этого не сделали. Затем нажмите **+ Create Credentials** в верхней части страницы и выберите **OAuth client ID**.

Заполните конфигурацию клиентского ID. **Авторизованные JavaScript Origins** не применимы. Добавьте элемент в **Авторизованные URI перенаправления** и замените `REDIRECT_URI` на значение, которое вы скопировали в буфер обмена ранее из раздела **OAuth 2.0 Settings** в dbt Cloud:

| Конфигурация                | Значение         |
| --------------------------- | ---------------- |
| **Тип приложения**          | Веб-приложение   |
| **Имя**                     | dbt Cloud        |
| **Авторизованные URI перенаправления** | `REDIRECT_URI` |

Заполните конфигурацию client ID. Параметр **Authorized JavaScript Origins** не применяется. Добавьте элемент в **Authorized redirect URIs** и замените `REDIRECT_URI` на значение, которое вы ранее скопировали в буфер обмена из раздела **OAuth 2.0 Settings** подключения в <Constant name="cloud" />:

| Config                       | Value           |
| ---------------------------- | --------------- |
| **Application type**         | Web application |
| **Name**                     | <Constant name="cloud" />       |
| **Authorized redirect URIs** | `REDIRECT_URI`  |

### Настройка подключения в dbt Cloud
Теперь, когда у вас есть OAuth приложение, настроенное в BigQuery, вам нужно добавить клиентский ID и секрет в dbt Cloud. Для этого:
 - Вернитесь на страницу деталей подключения, как описано в [Найти значение перенаправления URI](#locate-the-redirect-uri-value)
 - Добавьте клиентский ID и секрет из приложения BigQuery OAuth в разделе **OAuth 2.0 Settings**

### Аутентификация в BigQuery
После того как приложение BigQuery OAuth настроено для проекта dbt Cloud, каждый пользователь dbt Cloud должен будет аутентифицироваться с BigQuery, чтобы использовать IDE. Для этого:

### Настройка подключения в dbt
Теперь, когда вы настроили OAuth‑приложение в BigQuery, необходимо добавить client ID и secret в <Constant name="cloud" />. Для этого:
 1. Вернитесь на страницу **Connection details**, как описано в разделе [Locate the redirect URI value](#locate-the-redirect-uri-value).
 2. Добавьте client ID и secret из OAuth‑приложения BigQuery в разделе **OAuth 2.0 Settings**.
 3. Укажите token URI для BigQuery. Значение по умолчанию — `https://oauth2.googleapis.com/token`.

### Аутентификация в BigQuery
После того как OAuth‑приложение BigQuery настроено для проекта <Constant name="cloud" />, каждому пользователю <Constant name="cloud" /> необходимо пройти аутентификацию в BigQuery, чтобы использовать <Constant name="cloud_ide" />. Для этого:

Затем вы будете перенаправлены в BigQuery и вас попросят одобрить доступ к диску, облачной платформе и BigQuery, если подключение не имеет меньших привилегий.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-access.png" title="Запрос доступа к BigQuery" />

Выберите **Разрешить**. Это перенаправит вас обратно в dbt Cloud. Теперь вы должны быть аутентифицированным пользователем BigQuery, готовым использовать IDE dbt Cloud.

Затем вы будете перенаправлены в BigQuery, где вам будет предложено подтвердить доступы (scopes) для Drive, Cloud Platform и BigQuery, если только соединение не использует менее привилегированный набор прав.  
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-access.png" width="50%" title="BigQuery access request" />

Нажмите **Allow**. После этого вы будете перенаправлены обратно в <Constant name="cloud" />. Теперь вы являетесь аутентифицированным пользователем BigQuery и можете начинать работу с инструментами разработки dbt.

## Настройка Workload Identity Federation для BigQuery <Lifecycle status= "managed, Preview" />

Workload Identity Federation (WIF) позволяет прикладным рабочим нагрузкам, запущенным вне <Constant name="cloud" />, действовать от имени service account без необходимости управлять service accounts или другими ключами в средах деплоя. Следующие инструкции позволят вам аутентифицировать подключение к BigQuery в <Constant name="cloud" /> с использованием WIF.  
В настоящее время единственным поддерживаемым провайдером идентификации (IdP) является Microsoft Entra ID. Если вам требуется поддержка дополнительных IdP, пожалуйста, свяжитесь с вашей аккаунт‑командой.

### 1. Настройка Entra ID

Создайте приложение в Entra, через которое dbt будет запрашивать access tokens при аутентификации в BigQuery через workload identity pool:

1. На экране **app registrations** нажмите **New registration**.
2. Задайте имя приложения, по которому его будет легко идентифицировать.
3. Убедитесь, что **Supported account types** установлено в значение “Accounts in this organizational directory only (Org name - Single Tenant)”.
4. Нажмите **Register**, чтобы перейти на экран обзора приложения.
5. На странице **app overview** в левом меню выберите **Expose an API**.
6. Нажмите **Add** рядом с Application ID URI. Поле будет заполнено автоматически.
7. Нажмите **Save**.
8. (Необязательно) Чтобы включить claim `sub` в токены, выдаваемые этим приложением, настройте [optional claims в Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims?tabs=appui).  
   Claim `sub` (subject) однозначно идентифицирует пользователя или service principal, для которого был выдан токен.  
   При настройке impersonation service account в GCP маппинг Workload Identity Federation использует это значение `sub` для проверки идентичности вызывающего Entra‑приложения.
9. (Необязательно, но рекомендуется) Проверьте конфигурацию Entra ID, запросив токен:

   <EntraIdGetToken />

Workload Identity Federation использует межмашинный OAuth‑поток (machine‑to‑machine), который не требует участия пользователя; поэтому redirect URI для приложения указывать не нужно. Шаг 3 в этом разделе критически важен, так как он определяет audience для токенов, выдаваемых приложением, и сообщает workpool в GCP, имеет ли вызывающее приложение право доступа к ресурсам, защищённым этим workpool.

- **Связанная документация:** [GCP — Prepare your external identity provider](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-clouds#create)

### 2. Создание Workpool и Workpool Provider в GCP

1. В главном меню вашего аккаунта GCP перейдите в **IAM & Admin** и выберите **Workload Identity Federation** (не путать с пунктом **Work_force_ Identity Federation**, расположенным рядом).
2. Если вы ещё не создавали workpool, нажмите **Get started** или создайте новый workpool (кнопка в верхней части страницы).
3. Задайте имя и описание workpool. Согласно [документации GCP](https://cloud.google.com/iam/docs/workload-identity-federation#pools), для каждой не‑Google Cloud среды, которой требуется доступ к ресурсам Google Cloud (например, development, staging или production), следует создавать отдельный pool. Рекомендуется называть workpool соответствующим образом, чтобы его было легко идентифицировать в будущем.
4. При создании provider:
   - Установите тип provider в **OpenID Connect (OIDC)**.
   - Задайте понятное имя provider, например `Entra ID`.
   - Укажите URL `https://sts.windows.net/YOUR_TENANT_ID/`. Его можно найти в самом токене, если декодировать его через jwt.io. Также ожидаемый issuer URL для Entra указан в [документации GCP по WIF](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-clouds#create_the_workload_identity_pool_and_provider).
     - Tenant (provider) ID можно найти в app registration, созданном в [разделе 1 этих инструкций](#1-set-up-entra-id); он называется **Directory (tenant) ID** и доступен в разделе overview приложения.
   - В разделе **Audiences** выберите **Allowed Audiences** и укажите значение **Application ID URI**, определённое для вашего Entra ID приложения.
5. Нажмите **Continue**.
6. В разделе **Configure provider attributes** настройте маппинг `google.subject` → `assertion.sub`.
7. Нажмите **Save**.

### 3. Service Account Impersonation

Workpool либо использует service account, либо получает прямой доступ к ресурсам, чтобы определить, к каким ресурсам может обращаться вызывающая сторона. В [документации GCP](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-clouds#access) приведена более подробная информация о настройке обоих вариантов. В нашей реализации мы выбрали подход с service account, так как он обеспечивает большую гибкость.

Если вы ещё не сделали этого, создайте новый service account:
1. В главном меню выберите **IAM & Admin**.
2. Нажмите **Service Accounts**.
3. Нажмите **Create service account**. Google рекомендует создавать отдельный service account для каждой рабочей нагрузки.
4. Назначьте роли, которые вы хотите предоставить этому service account. По нашему опыту, роль `BigQuery Admin` является ролью по умолчанию с необходимым уровнем доступа.

После создания service account вернитесь к workpool, созданному на предыдущем шаге:
1. Нажмите **Grant Access** в верхней части страницы.
2. Выберите **Grant access using Service Account Impersonation**.
3. Выберите service account, который вы только что создали.
4. В разделе **Select Principals** укажите `subject` в качестве **Attribute Name**. В поле **Attribute Value** задайте значение claim `sub` (subject) из access token Entra ID.

   <Expandable alt_header="Obtain the sub value">
   Чтобы получить значение `sub`, запросите access token из Entra ID.  
   Claim `sub` является постоянным для всех токенов, выдаваемых этим приложением:
   <EntraIdGetToken />
   </Expandable>

### 4. Настройка dbt

Чтобы настроить подключение BigQuery с использованием аутентификации WIF в <Constant name="cloud" />, необходимо создать кастомную OAuth‑интеграцию, используя данные из Entra‑приложения, которое используется как provider вашего workpool в GCP.

В <Constant name="cloud" />:

1. Перейдите в **Account settings** → **Integrations**.
2. Прокрутите страницу до раздела **Custom OAuth Integrations** и создайте новую интеграцию.
3. Заполните все поля, используя соответствующую информацию из среды вашего IdP.
   - Application ID URI должен быть установлен в значение audience, ожидаемое в токенах, выдаваемых Entra‑приложением. Это будет тот же URI, который ожидает ваш workpool provider.
   - Добавлять Redirect URI в Entra‑приложение не требуется.

### 5. Создание подключений в dbt

Для начала создайте новое подключение в <Constant name="cloud" />:

1. Перейдите в **Account settings** → **Connections**.
2. Нажмите **New connection** и выберите тип подключения **BigQuery**. Затем вы увидите выбор между **BigQuery** и **BigQuery (Legacy)**. Выберите **BigQuery**.
3. В поле **Deployment Environment Authentication Method** выберите **Workload Identity Federation**.
4. Заполните **Google Cloud Project ID** и любые дополнительные настройки, которые вам нужны.
5. В выпадающем списке выберите OAuth Configuration, созданную на предыдущем шаге.
6. Настройте подключение для среды разработки:
   - [BigQuery OAuth](#bigquery-oauth) (рекомендуется)
     - Настраивается в том же подключении, которое вы используете для WIF, в разделе **`OAuth2.0 settings`**
   - Service JSON
     - Необходимо создать отдельное подключение с конфигурацией Service JSON.

### 6. Настройка проекта

Чтобы подключить новый проект к вашей конфигурации WIF:
1. Перейдите в **Account settings** → **Projects**.
2. Нажмите **New project**.
3. Задайте имя проекта и (необязательно) путь к поддиректории, затем нажмите **Continue**.
4. Выберите **Connection** с конфигурацией WIF.
5. Заполните остальные поля проекта соответствующими значениями.

### 7. Настройка deployment environment

Создайте новую или обновите существующую среду, чтобы использовать подключение WIF.

Когда вы укажете для среды подключение с конфигурацией WIF, в разделе Deployment credentials появятся два дополнительных поля:
- **Workload pool provider path:** обязательное поле для всех конфигураций WIF.  
  Пример: `//iam.googleapis.com/projects/<numeric_project_id>/locations/global/workloadIdentityPools/<workpool_name>/providers/<workpool_providername>`
- **Service account impersonation URL:** используется только если вы настроили workpool на использование impersonation service account для доступа к ресурсам BigQuery (а не предоставили workpool прямой доступ к ресурсам BigQuery).  
  Пример: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts<serviceaccountemail>:generateAccessToken`

Если у вас ещё нет job, основанного на deployment environment с подключением, настроенным для WIF, создайте его сейчас. После конфигурации с нужными параметрами запустите job.

## FAQs

<FAQ path="Warehouse/bq-oauth-drive-scope" />

## Узнать больше

<WistiaVideo id="m7twurlmgt" paddingTweak="62.25%" />
