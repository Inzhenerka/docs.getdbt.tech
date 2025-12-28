---
title: "Настройка BigQuery OAuth"
description: "Узнайте, как администраторы dbt могут использовать BigQuery OAuth для управления доступом в аккаунте dbt"
id: "set-up-bigquery-oauth"
pagination_next: null
---

import EntraIdGetToken from '/snippets/_entra-id-get-token.md';

# Настройка BigQuery OAuth <Lifecycle status="managed, managed_plus" />

:::info Функция уровня Enterprise

В этом руководстве описывается функциональность, доступная на тарифах <Constant name="cloud" /> Enterprise и Enterprise+. Если вы хотите узнать больше о наших тарифах уровня Enterprise, свяжитесь с нами по адресу sales@getdbt.com.

:::

<Constant name="cloud" /> поддерживает [OAuth](https://cloud.google.com/bigquery/docs/authentication) для BigQuery, предоставляя дополнительный уровень безопасности для корпоративных пользователей dbt.

## Настройка нативного OAuth BigQuery

Когда BigQuery OAuth включен для проекта <Constant name="cloud" />, все разработчики <Constant name="cloud" /> должны аутентифицироваться в BigQuery для доступа к инструментам разработки, таким как <Constant name="cloud_ide" />.

Чтобы настроить BigQuery OAuth в <Constant name="cloud" />, администратор BigQuery должен:
1. [Найти значение redirect URI](#locate-the-redirect-uri-value) в <Constant name="cloud" />.
2. [Создать OAuth 2.0 client ID и secret для BigQuery](#creating-a-bigquery-oauth-20-client-id-and-secret) в BigQuery.
3. [Сконфигурировать подключение](#configure-the-connection-in-dbt-cloud) в <Constant name="cloud" />.

Чтобы использовать BigQuery в <Constant name="cloud_ide" />, всем разработчикам необходимо:
1. [Аутентифицироваться в BigQuery](#authenticating-to-bigquery) в своих учетных данных профиля.

### Locate the redirect URI value
Для начала найдите redirect URI подключения, необходимый для настройки BigQuery OAuth. Для этого:

1. Перейдите к имени вашего аккаунта над иконкой профиля на левой боковой панели.
2. Выберите **Account settings** в меню.
3. В левой боковой панели выберите **Connections**.
4. Нажмите на подключение BigQuery.
5. Найдите поле **Redirect URI** в разделе **Development OAuth**. Скопируйте это значение в буфер обмена — оно понадобится позже.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/dbt-cloud-bq-id-secret-02.png" title="Доступ к настройкам BigQuery OAuth в dbt" />

### Creating a BigQuery OAuth 2.0 client ID and secret
Для продолжения необходимо создать client ID и secret для [аутентификации](https://cloud.google.com/bigquery/docs/authentication) в BigQuery. Эти client ID и secret будут сохранены в <Constant name="cloud" /> для управления OAuth-подключением между пользователями <Constant name="cloud" /> и BigQuery.

В консоли BigQuery перейдите в **APIs & Services** и выберите **Credentials**:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-nav.gif" title="Навигация в BigQuery к разделу credentials" />

На странице **Credentials** вы увидите существующие ключи, client ID и service accounts.

Настройте [OAuth consent screen](https://support.google.com/cloud/answer/6158849), если вы еще этого не сделали. Затем нажмите **+ Create Credentials** в верхней части страницы и выберите **OAuth client ID**.

Заполните конфигурацию client ID. Параметр **Authorized JavaScript Origins** не применяется. Добавьте элемент в **Authorized redirect URIs** и замените `REDIRECT_URI` значением, которое вы ранее скопировали из раздела **OAuth 2.0 Settings** подключения в <Constant name="cloud" />:

| Config                       | Value           |
| ---------------------------- | --------------- |
| **Application type**         | Web application |
| **Name**                     | <Constant name="cloud" />       |
| **Authorized redirect URIs** | `REDIRECT_URI`  |

Затем нажмите **Create**, чтобы создать OAuth-приложение BigQuery и увидеть значения client ID и secret. Эти значения доступны и после закрытия экрана приложения, поэтому это не единственный момент, когда вы можете их сохранить.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/bq-oauth-app-02.png" title="Создание OAuth-приложения в BigQuery" />

### Configure the Connection in dbt
Теперь, когда OAuth-приложение настроено в BigQuery, необходимо добавить client ID и secret в <Constant name="cloud" />. Для этого:
1. Вернитесь на страницу деталей подключения, как описано в разделе [Locate the redirect URI value](#locate-the-redirect-uri-value).
2. Добавьте client ID и secret из OAuth-приложения BigQuery в разделе **OAuth 2.0 Settings**.
3. Укажите token URI BigQuery. Значение по умолчанию — `https://oauth2.googleapis.com/token`.

### Authenticating to BigQuery
После настройки OAuth-приложения BigQuery для проекта <Constant name="cloud" /> каждому пользователю <Constant name="cloud" /> необходимо аутентифицироваться в BigQuery, чтобы использовать <Constant name="cloud_ide" />. Для этого:

- Перейдите к имени вашего аккаунта над иконкой профиля на левой боковой панели
- Выберите **Account settings** в меню
- В левой боковой панели выберите **Credentials**
- Выберите проект из списка
- Нажмите **Authenticate BigQuery Account**

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/developer-bq-auth.gif" title="Аутентификация в BigQuery" />

После этого вы будете перенаправлены в BigQuery, где потребуется одобрить доступы к Google Drive, Cloud Platform и BigQuery, если только подключение не обладает меньшими привилегиями.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-access.png" width="50%" title="Запрос доступа BigQuery" />

Нажмите **Allow**. После этого вы будете перенаправлены обратно в <Constant name="cloud" />. Теперь вы аутентифицированы как пользователь BigQuery и можете начинать использовать инструменты разработки dbt.

## Настройка BigQuery Workload Identity Federation <Lifecycle status= "managed, Preview" />

Workload Identity Federation (WIF) позволяет прикладным нагрузкам, выполняющимся вне <Constant name="cloud" />, действовать от имени service account без необходимости управлять service accounts или другими ключами для окружений развертывания. Следующие инструкции позволят вам аутентифицировать подключение BigQuery в <Constant name="cloud" /> с использованием WIF.  
В настоящее время единственным поддерживаемым провайдером идентификации (IdP) является Microsoft Entra ID. Если вам требуется поддержка дополнительных IdP, свяжитесь с вашей аккаунт-командой.

### 1. Set up Entra ID

Создайте приложение в Entra, через которое dbt будет запрашивать access tokens при аутентификации в BigQuery через workload identity pool:

1. На экране **app registrations** нажмите **New registration**.
2. Задайте приложению понятное имя.
3. Убедитесь, что **Supported account types** установлено в “Accounts in this organizational directory only (Org name - Single Tenant).”
4. Нажмите **Register**, чтобы открыть экран обзора приложения.
5. На странице обзора приложения выберите **Expose an API** в левом меню.
6. Нажмите **Add** рядом с Application ID URI. Поле заполнится автоматически.
7. Нажмите **Save**.
8. (Опционально) Чтобы включить claim `sub` в токены, выпускаемые этим приложением, настройте [optional claims в Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims?tabs=appui).  
   Claim `sub` (subject) однозначно идентифицирует пользователя или service principal, для которого был выпущен токен.  
   При настройке service account impersonation в GCP сопоставление Workload Identity Federation использует это значение `sub` для проверки идентичности вызывающего Entra-приложения.
9. (Опционально, но рекомендуется) Проверьте конфигурацию Entra ID, запросив токен:

   <EntraIdGetToken />

Workload Identity Federation использует машинный OAuth-поток (machine-to-machine), не требующий участия пользователя; поэтому redirect URI для приложения настраивать не нужно. Шаг 3 в этом разделе критически важен, так как он определяет audience для токенов, выпускаемых приложением, и сообщает workpool в GCP, имеет ли вызывающее приложение право доступа к ресурсам, защищенным этим workpool.

- **Связанная документация:** [GCP — Prepare your external identity provider](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-clouds#create)

### 2. Create a Workpool and Workpool Provider in GCP

1. В главном меню GCP перейдите в **IAM & Admin** и выберите **Workload Identity Federation** (не путать с **Work_force_ Identity Federation**, расположенным рядом).
2. Если вы еще не создали workpool, нажмите **Get started** или создайте новый workpool (кнопка в верхней части страницы).
3. Задайте имя и описание workpool. Согласно [документации GCP](https://cloud.google.com/iam/docs/workload-identity-federation#pools), для каждого окружения вне Google Cloud (development, staging, production и т.д.) следует создавать отдельный pool. Название workpool должно отражать это, чтобы его было легко идентифицировать в будущем.
4. При создании provider:
   - Установите тип provider в **OpenID Connect (OIDC)**.
   - Задайте понятное имя provider, например `Entra ID`.
   - Укажите URL `https://sts.windows.net/YOUR_TENANT_ID/`. Его можно найти в самом токене, если декодировать его через jwt.io. Также ожидаемый issuer URL для Entra указан в [документации GCP по WIF](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-clouds#create_the_workload_identity_pool_and_provider).
     - Tenant (provider) ID можно найти в app registration, созданной в [разделе 1](#1-set-up-entra-id); он называется **Directory (tenant) ID** и отображается на странице overview приложения.
   - В разделе **Audiences** выберите **Allowed Audiences** и укажите **Application ID URI**, заданный для вашего Entra ID приложения.
5. Нажмите **Continue**.
6. В разделе **Configure provider attributes** установите сопоставление `google.subject` → `assertion.sub`.
7. Нажмите **Save**.

### 3. Service Account Impersonation

Workpool либо использует service account, либо получает прямой доступ к ресурсам для определения того, к каким ресурсам может обращаться вызывающая сторона. Более подробную информацию см. в [документации GCP](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-clouds#access). В нашей реализации мы выбрали подход с service account, так как он обеспечивает большую гибкость.

Если вы еще не сделали этого, создайте новый service account:
1. В главном меню выберите **IAM & Admin**.
2. Нажмите **Service Accounts**.
3. Нажмите **Create service account**. Google рекомендует создавать отдельный service account для каждой нагрузки.
4. Назначьте необходимые роли. По нашему опыту, роль `BigQuery Admin` является ролью по умолчанию с необходимым уровнем доступа.

После создания service account вернитесь к workpool, созданному на предыдущем шаге:
1. Нажмите **Grant Access** в верхней части страницы.
2. Выберите **Grant access using Service Account Impersonation**.
3. Выберите созданный service account.
4. В разделе **Select Principals** укажите `subject` в качестве **Attribute Name**, а в поле **Attribute Value** задайте значение claim `sub` из access token Entra ID.

   <Expandable alt_header="Получение значения sub">
   Чтобы получить значение `sub`, запросите access token из Entra ID. Claim `sub` является
   постоянным для всех токенов, выпускаемых этим приложением:
   <EntraIdGetToken />

   </Expandable>

### 4. Set up dbt

Чтобы настроить подключение BigQuery с использованием WIF-аутентификации в <Constant name="cloud" />, необходимо создать пользовательскую OAuth-интеграцию, настроенную с использованием данных Entra-приложения, используемого в качестве workpool provider в GCP.

В <Constant name="cloud" />:

1. Перейдите в **Account settings** --> **Integrations**
2. Прокрутите вниз до раздела **Custom OAuth Integrations** и создайте новую интеграцию
3. Заполните все поля соответствующей информацией из вашего окружения IdP.
   - Application ID URI должен быть установлен в значение ожидаемого audience claim для токенов, выпускаемых Entra-приложением. Это будет тот же URI, который ожидает ваш workpool provider.
   - Добавлять Redirect URI в Entra-приложение не требуется

### 5. Create connections in dbt

Для начала создайте новое подключение в <Constant name="cloud" />:

1. Перейдите в **Account settings** --> **Connections**.
2. Нажмите **New connection** и выберите **BigQuery** в качестве типа подключения. Затем выберите **BigQuery** (не **BigQuery (Legacy)**).
3. В поле **Deployment Environment Authentication Method** выберите **Workload Identity Federation**.
4. Заполните **Google Cloud Project ID** и при необходимости другие параметры.
5. Выберите OAuth Configuration, созданную на предыдущем шаге, из выпадающего списка.
6. Настройте подключение для разработки:
   - [BigQuery OAuth](#bigquery-oauth) (рекомендуется)
     - Настраивается в том же подключении, что и WIF, в разделе **`OAuth2.0 settings`**
   - Service JSON
     - Необходимо создать отдельное подключение с конфигурацией Service JSON.

### 6. Set up project

Чтобы подключить новый проект к вашей WIF-конфигурации:
1. Перейдите в **Account settings** --> **Projects**.
2. Нажмите **New project**.
3. Укажите имя проекта и (опционально) путь к поддиректории, затем нажмите **Continue**.
4. Выберите **Connection** с WIF-конфигурацией.
5. Завершите настройку проекта, заполнив остальные необходимые поля.

### 7. Set up deployment environment

Создайте новое или обновите существующее окружение для использования WIF-подключения.

После установки WIF-подключения для окружения в разделе Deployment credentials появятся два поля:
- **Workload pool provider path:** Обязательное поле для всех WIF-конфигураций.  
  Пример: `//iam.googleapis.com/projects/<numeric_project_id>/locations/global/workloadIdentityPools/<workpool_name>/providers/<workpool_providername>`
- **Service account impersonation URL:** Используется только если workpool настроен на использование service account impersonation для доступа к ресурсам BigQuery (а не на прямой доступ workpool к ресурсам BigQuery).  
  Пример: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts<serviceaccountemail>:generateAccessToken`

Если у вас еще нет job, использующего deployment environment с WIF-подключением, создайте его сейчас. После настройки с нужными параметрами запустите job.

## FAQs

<FAQ path="Warehouse/bq-oauth-drive-scope" />

## Learn More

<WistiaVideo id="m7twurlmgt" paddingTweak="62.25%" />
