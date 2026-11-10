---
title: "Настройка BigQuery OAuth"
description: "Узнайте, как администраторы dbt могут использовать BigQuery OAuth для управления доступом в аккаунте dbt"
id: "set-up-bigquery-oauth"
pagination_next: null
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

import EntraIdGetToken from '/snippets/_entra-id-get-token.md';

# Настройка BigQuery OAuth {#set-up-bigquery-oauth}

:::info Функция уровня Enterprise

В этом руководстве описана функция, доступная в тарифных планах Enterprise и Enterprise+ <Constant name="dbt_platform" />. Если вы хотите узнать больше о наших тарифных планах уровня Enterprise, свяжитесь с нами по адресу sales@getdbt.com. 

:::

<Constant name="dbt_platform" /> поддерживает [OAuth](https://cloud.google.com/bigquery/docs/authentication) для BigQuery, обеспечивая дополнительный уровень безопасности для корпоративных пользователей dbt. 

## Настройка нативного OAuth BigQuery {#set-up-bigquery-native-oauth}

Когда BigQuery OAuth включен для проекта <Constant name="dbt_platform" />, все разработчики <Constant name="dbt_platform" /> должны аутентифицироваться в BigQuery для доступа к инструментам разработки, таким как <Constant name="studio_ide" />.


Чтобы настроить BigQuery OAuth в <Constant name="dbt_platform" />, администратор BigQuery должен:
1. [Найти значение URI перенаправления](#locate-the-redirect-uri-value) в <Constant name="dbt_platform" />.
2. [Создать OAuth 2.0 client ID и secret для BigQuery](#creating-a-bigquery-oauth-20-client-id-and-secret) в BigQuery.
3. [Настроить подключение](/docs/platform/manage-access/set-up-bigquery-oauth#configure-the-connection-in-dbt) в <Constant name="dbt_platform" />.

Чтобы использовать BigQuery в <Constant name="studio_ide" />, всем разработчикам необходимо:
1. [Пройти аутентификацию в BigQuery](#authenticating-to-bigquery) в разделе учетных данных своего профиля.

### Найдите значение redirect URI {#locate-the-redirect-uri-value}
Для начала найдите redirect URI подключения, необходимый для настройки BigQuery OAuth. Для этого:

1. Перейдите к имени вашего аккаунта над иконкой профиля на левой боковой панели.
2. Выберите **Account settings** в меню.
3. В левой боковой панели выберите **Connections**.
4. Нажмите на подключение BigQuery.
5. Найдите поле **Redirect URI** в разделе **Development OAuth**. Скопируйте это значение в буфер обмена — оно понадобится позже.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dbt-platform-enterprise/BQ-auth/dbt-cloud-bq-id-secret-02.png" title="Доступ к настройкам BigQuery OAuth в dbt" />

### Создание client ID и secret для BigQuery OAuth 2.0 {#creating-a-bigquery-oauth-20-client-id-and-secret}

:::note

<Constant name="dbt_platform" /> автоматически запросит необходимые области доступа BigQuery в процессе OAuth. [Настройка областей доступа на экране согласия OAuth для BigQuery](https://developers.google.com/workspace/guides/configure-oauth-consent) необязательна и не требуется для подключения <Constant name="dbt_platform" /> к BigQuery. Необходимые области доступа запрашиваются и одобряются при аутентификации пользователей через OAuth.

:::

Для начала необходимо создать идентификатор и секрет клиента для [аутентификации](https://cloud.google.com/bigquery/docs/authentication) в BigQuery. Эти идентификатор и секрет клиента будут храниться в <Constant name="dbt_platform" /> для управления OAuth-подключением между пользователями <Constant name="dbt_platform" /> и BigQuery.

1. В консоли BigQuery перейдите в **API и сервисы** и выберите **Учетные данные**:

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dbt-platform-enterprise/BQ-auth/BQ-nav.gif" title="Переход к учетным данным в BigQuery" />

На странице **Credentials** вы увидите существующие ключи, client ID и service accounts.

2. Настройте [экран согласия OAuth](https://support.google.com/cloud/answer/6158849), если вы еще этого не сделали. 
3. Нажмите **+ Создать учетные данные** в верхней части страницы и выберите **Идентификатор клиента OAuth**.

4. Заполните настройки идентификатора клиента. **Разрешенные источники JavaScript** не применяются. 
5. Добавьте элемент в **Разрешенные URI перенаправления** и замените `REDIRECT_URI` значением, которое вы ранее скопировали в буфер обмена из раздела **Настройки OAuth 2.0** подключения в <Constant name="dbt_platform" />:

| Параметр                     | Значение        |
| ---------------------------- | --------------- |
| **Тип приложения**         | Веб-приложение |
| **Name**                     | <Constant name="dbt_platform" />       |
| **Разрешенные URI перенаправления** | `REDIRECT_URI`  |
<br />
6. Нажмите **Создать**, чтобы создать приложение BigQuery OAuth и просмотреть значения идентификатора и секрета клиента приложения. Эти значения доступны и после закрытия экрана приложения, поэтому вы сможете сохранить их и позже.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dbt-platform-enterprise/BQ-auth/bq-oauth-app-02.png" title="Создание приложения OAuth в BigQuery" />

### Настройте подключение в dbt {#configure-the-connection-in-dbt}
Теперь, когда приложение OAuth настроено в BigQuery, необходимо добавить идентификатор и секрет клиента в <Constant name="dbt_platform" />. Для этого:
 1. Вернитесь на страницу деталей подключения, как описано в разделе [Найдите значение redirect URI](#locate-the-redirect-uri-value).
 2. Добавьте client ID и secret из OAuth-приложения BigQuery в разделе **OAuth 2.0 Settings**.
 3. Укажите token URI BigQuery. Значение по умолчанию — `https://oauth2.googleapis.com/token`.

### Аутентификация в BigQuery {#authenticating-to-bigquery}
После настройки OAuth-приложения BigQuery для проекта <Constant name="dbt_platform" /> каждому пользователю <Constant name="dbt_platform" /> необходимо аутентифицироваться в BigQuery, чтобы использовать <Constant name="studio_ide" />. Для этого:

1. Перейдите к имени своей учетной записи над значком профиля на левой боковой панели.
2. Выберите **Настройки учетной записи** в меню.
3. На левой боковой панели выберите **Учетные данные**.
4. Выберите проект из списка.
5. Убедитесь, что для параметра **Метод аутентификации** установлено значение **Встроенный OAuth**.
6. Выберите **Подключиться к BigQuery**.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/5-development-schema-name/1-settings-gear-icon.png" width="100%" title="Переход к настройкам учетной записи в платформе dbt."/>

<Lightbox src="/img/docs/dbt-platform/connect-to-bigquery.png" width="90%" title="Подключение учетной записи BigQuery."/>

</DocCarousel>

После этого вы будете перенаправлены в BigQuery, где потребуется одобрить доступы к Google Drive, Cloud Platform и BigQuery, если только подключение не обладает меньшими привилегиями.
<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/dbt-platform-enterprise/BQ-auth/BQ-access.png" width="60%" title="Запрос доступа к BigQuery" />

Выберите **Разрешить**. Вы будете перенаправлены обратно в <Constant name="dbt_platform" />. Теперь вы прошли аутентификацию в BigQuery и можете начать пользоваться инструментами разработки dbt. 

<a id="set-up-bigquery-workload-identity-federation-"></a>

## Настройка Workload Identity Federation для BigQuery <Lifecycle status= "managed" /> {#set-up-bigquery-workload-identity-federation}

Workload Identity Federation (WIF) позволяет рабочим нагрузкам приложений, выполняющимся за пределами <Constant name="dbt_platform" />, действовать от имени сервисного аккаунта без необходимости управлять сервисными аккаунтами или другими ключами для сред развертывания. Следующие инструкции позволят вам настроить аутентификацию подключения BigQuery в <Constant name="dbt_platform" /> с помощью WIF. 
В настоящее время единственным поддерживаемым провайдером идентификации (IdP) является Microsoft Entra ID. Если вам требуется поддержка дополнительных IdP, свяжитесь с вашей аккаунт-командой.

### 1. Настройка Entra ID {#1-set-up-entra-id}

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

### 2. Создайте Workpool и Workpool Provider в GCP {#2-create-a-workpool-and-workpool-provider-in-gcp}

1. В главном меню GCP перейдите в **IAM & Admin** и выберите **Workload Identity Federation** (не путать с **Work_force_ Identity Federation**, расположенным рядом).
2. Если вы еще не создали workpool, нажмите **Get started** или создайте новый workpool (кнопка в верхней части страницы).
3. Задайте имя и описание workpool. Согласно [документации GCP](https://cloud.google.com/iam/docs/workload-identity-federation#pools), для каждого окружения вне Google Cloud (development, staging, production и т.д.) следует создавать отдельный pool. Название workpool должно отражать это, чтобы его было легко идентифицировать в будущем.
4. При создании provider:
    - Установите тип provider в **OpenID Connect (OIDC)**.
    - Задайте понятное имя provider, например `Entra ID`.
    - Укажите URL https://sts.windows.net/YOUR_TENANT_ID/. Его можно найти в самом токене, если декодировать его через jwt.io. Также сведения об ожидаемом URL издателя для Entra можно найти в [документации GCP по WIF](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-clouds#create_the_workload_identity_pool_and_provider).
        - Замените `YOUR_TENANT_ID` идентификатором вашего арендатора.
        - Tenant (provider) ID можно найти в app registration, созданной в [разделе 1](#1-set-up-entra-id); он называется **Directory (tenant) ID** и отображается на странице overview приложения.
    - В разделе **Audiences** выберите **Allowed Audiences** и укажите **Application ID URI**, заданный для вашего Entra ID приложения.
5. Нажмите **Continue**.
6. В разделе **Configure provider attributes** установите сопоставление `google.subject` → `assertion.sub`.
7. Нажмите **Save**.

### 3. Имперсонация сервисного аккаунта {#3-service-account-impersonation}

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

### 4. Настройка dbt {#4-set-up-dbt}

Чтобы настроить подключение BigQuery для использования аутентификации WIF в <Constant name="dbt_platform" />, необходимо создать пользовательскую интеграцию OAuth с данными приложения Entra, используемого в качестве поставщика пула рабочих нагрузок в GCP.
<Constant name="dbt_platform" />: 

1. Перейдите в **Настройки учетной записи** --> **Интеграции**.
2. Прокрутите вниз до раздела **Пользовательские интеграции OAuth** и создайте новую интеграцию.
3. Заполните все поля соответствующей информацией из вашего окружения IdP.
    - Application ID URI должен быть установлен в значение ожидаемого audience claim для токенов, выпускаемых Entra-приложением. Это будет тот же URI, который ожидает ваш workpool provider.
    - Добавлять URI перенаправления в приложение Entra не требуется.

### 5. Создайте подключения в dbt {#5-create-connections-in-dbt}

Для начала создайте новое подключение в <Constant name="dbt_platform" />:

1. Перейдите в **Account settings** --> **Connections**.
2. Нажмите **New connection** и выберите **BigQuery** в качестве типа подключения. Затем выберите **BigQuery** (не **BigQuery (Legacy)**).
3. В поле **Deployment Environment Authentication Method** выберите **Workload Identity Federation**.
4. Заполните **Google Cloud Project ID** и при необходимости другие параметры.
5. Выберите OAuth Configuration, созданную на предыдущем шаге, из выпадающего списка.
6. Настройте подключение для разработки:
    - [BigQuery OAuth](/docs/platform/connect-data-platform/connect-bigquery#bigquery-oauth) (рекомендуется).
        - Настраивается в том же подключении, что и WIF, в разделе **`OAuth2.0 settings`**
    - JSON сервисного аккаунта.
        - Необходимо создать отдельное подключение с конфигурацией Service JSON.

### 6. Настройте проект {#6-set-up-project}

Чтобы подключить новый проект к вашей WIF-конфигурации:
1. Перейдите в **Account settings** --> **Projects**.
2. Нажмите **New project**.
3. Укажите имя проекта и (опционально) путь к поддиректории, затем нажмите **Continue**.
4. Выберите **Connection** с WIF-конфигурацией.
5. Завершите настройку проекта, заполнив остальные необходимые поля.

### 7. Настройте deployment environment {#7-set-up-deployment-environment}

Создайте новое или обновите существующее окружение для использования WIF-подключения.

После установки WIF-подключения для окружения в разделе Deployment credentials появятся два поля:
- **Путь к поставщику пула рабочих нагрузок:** Это поле обязательно для всех конфигураций WIF. Например:
 - `//iam.googleapis.com/projects/<numeric_project_id>/locations/global/workloadIdentityPools/<workpool_name>/providers/<workpool_providername>`
- **URL олицетворения сервисного аккаунта:** Используется только в том случае, если вы настроили пул рабочих нагрузок на использование олицетворения сервисного аккаунта для доступа к ресурсам BigQuery (вместо предоставления пулу прямого доступа к ресурсам BigQuery). Например:
 - `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/<serviceaccountemail>:generateAccessToken`

Чтобы избежать ошибок из-за неверного регистра символов или опечаток, рекомендуем получать эти значения непосредственно из GCP, а не составлять их вручную:

1. В консоли GCP перейдите в **IAM и администрирование > Workload Identity Federation**.
2. Нажмите на свой пул удостоверений рабочих нагрузок, затем на поставщика, созданного для этой конфигурации.
3. Нажмите **Скачать конфигурацию** в верхней части страницы сведений о поставщике.
4. Откройте скачанный JSON-файл и скопируйте следующие значения:
    - Поле `audience` &mdash; вставьте в поле **Путь к поставщику пула рабочих нагрузок** в dbt.
    - Поле `service_account_impersonation_url` &mdash; вставьте в поле **URL олицетворения сервисного аккаунта** в dbt.

Если у вас еще нет задания на основе среды развертывания с подключением, настроенным для WIF, создайте его сейчас. Задав нужные настройки, запустите задание.

## Часто задаваемые вопросы {#faqs}

<FAQ path="Warehouse/bq-oauth-drive-scope" />


## Устранение неполадок {#troubleshooting}

В следующем разделе приведены шаги по устранению распространенных проблем с подключениями BigQuery OAuth.

#### Сбой подключения после предоставления разрешений Google {#connection-fails-after-granting-google-permissions}

При подключении учетной записи BigQuery вы можете успешно войти в Google и одобрить запрошенные разрешения, но затем увидеть страницу ошибки (например, `403 Account restricted`) вместо возврата в <Constant name="dbt_platform" />. Обычно отображается сообщение об ошибке сервера вместо страницы учетных данных, с которой вы начали.

Это может произойти, если ваша организация Google Workspace ограничивает доступ сторонних приложений к сервисам Google. Хотя Google позволил вам войти и просмотреть экран согласия, политика безопасности организации заблокировала заключительный этап выдачи учетных данных для <Constant name="dbt_platform" />.

В этом разделе по устранению неполадок объясняется, почему это происходит, как решить проблему и что делать, если она возникает снова.

<Expandable alt_header="1. Почему это влияет на BigQuery OAuth">

Google делит области доступа OAuth на три уровня: неконфиденциальные, конфиденциальные и ограниченные. Приложения, которые запрашивают только неконфиденциальные области доступа (например, для обычного входа), как правило, работают без дополнительного одобрения администратора. Подключению BigQuery OAuth требуются области доступа, которые Google классифицирует как [ограниченные](https://support.google.com/cloud/answer/9110914), а они всегда требуют явного подтверждения доверия администратором независимо от политики вашей организации по умолчанию в отношении сторонних приложений.

Подключение BigQuery OAuth запрашивает следующие ограниченные области доступа:

- `bigquery` &mdash; Требуется для выполнения запросов и доступа к ресурсам BigQuery
- `cloud-platform` &mdash; Требуется для доступа к BigQuery между проектами и взаимодействия сервисов
- `drive` &mdash; Требуется для поддержки [внешних таблиц BigQuery на основе Google Drive](https://cloud.google.com/bigquery/docs/external-data-drive)

Другие используемые вами приложения могут подключаться без этого этапа одобрения, поскольку они, вероятно, запрашивают только неконфиденциальные или конфиденциальные области доступа, на которые это ограничение не распространяется.

</Expandable>

<Expandable alt_header="2. Как решить проблему">

Администратор Google Workspace должен пометить как доверенный идентификатор клиента OAuth, используемый вашим подключением BigQuery в <Constant name="dbt_platform" />. Найдите этот идентификатор клиента в <Constant name="dbt_platform" /> в разделе **Настройки учетной записи** > **Подключения** > ваше подключение BigQuery > **Настройки OAuth 2.0**.

Получив идентификатор клиента, попросите администратора Google Workspace выполнить следующие действия:

1. Войти в [Консоль администратора Google Workspace](https://admin.google.com).
2. Перейти в **Безопасность** > **Управление доступом и данными** > **Управление API** > **Управление доступом сторонних приложений**.
3. Нажать **Добавить приложение** > **Название приложения OAuth или идентификатор клиента**.
4. Ввести идентификатор клиента из вашего подключения BigQuery в <Constant name="dbt_platform" />.
5. Установить уровень доступа **Доверенное**.
6. Применить настройку к соответствующему организационному подразделению или ко всей организации.

После того как администратор выполнит эти действия, повторите попытку подключения к BigQuery со страницы учетных данных в <Constant name="dbt_platform" />.

Подробнее см. в документации Google об [управлении доступом сторонних приложений к данным Google Workspace](https://support.google.com/a/answer/7281227).

</Expandable>

<Expandable alt_header="3. Если проблема сохраняется">

Если подключение по-прежнему не удается после того, как администратор пометил клиент OAuth как доверенный в Google Workspace, попросите администратора проекта GCP проверить, не ограничивает ли [политика организации](https://cloud.google.com/resource-manager/docs/organization-policy/overview) Google Cloud использование внешних клиентов OAuth. Соответствующее ограничение — `constraints/iam.allowedExternalOAuthClients`.

Если ни один из этих шагов не помог решить проблему, обратитесь в [службу поддержки dbt](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support), указав приблизительное время неудачной попытки подключения и адрес электронной почты, который вы использовали для аутентификации в Google.
</Expandable>
