---
title: "Подключение к GitHub"
description: "Узнайте, как подключение учетной записи GitHub упрощает работу с dbt и обеспечивает дополнительный уровень безопасности."
id: "connect-github"
sidebar_label: "Подключение к GitHub"
availability:
  surface: platform
  access: login_required
---


Подключение учетной записи GitHub к <Constant name="dbt" /> упрощает работу с <Constant name="dbt" /> и обеспечивает дополнительный уровень безопасности:
- Импортируйте новые репозитории GitHub за несколько нажатий при настройке проекта <Constant name="dbt" />.
- Клонируйте репозитории по HTTPS вместо SSH.
- Запускайте сборки [непрерывной интеграции](/docs/deploy/continuous-integration) (CI) при открытии пул-реквестов в GitHub.

:::note Домены GitHub Enterprise Cloud (`ghe.com`)
Если ваша организация использует GitHub Enterprise Cloud, размещенный в домене `ghe.com`, общее приложение GitHub для <Constant name="dbt" /> не сможет получить к нему доступ. Обратите внимание: учетные записи `ghe.com` управляются в облаке (а не в локальной инфраструктуре), но это ограничение все равно действует.

Учетные записи Enterprise и Enterprise+ могут подключиться, зарегистрировав [собственное приложение GitHub](#custom-github-application). На других тарифных планах используйте [импорт проекта по URL Git](/docs/platform/git/import-a-project-by-git-url) с SSH-ключами или ключами развертывания. Настройка SSH URL вашей организации может потребовать дополнительных действий, а некоторые возможности встроенной интеграции недоступны при подключении по URL Git.

За дополнительной помощью с вашей конфигурацией обратитесь в [службу поддержки dbt](mailto:support@getdbt.com) или к команде <Constant name="dbt" />, сопровождающей вашу учетную запись.
:::

## Предварительные требования

- **Права доступа GitHub**: Для [установки приложения](/docs/platform/git/connect-github#installing-dbt-in-your-github-account) необходимо быть владельцем организации GitHub. Подробнее о ролях в [организации GitHub](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization).
- **Права доступа dbt**: Владельцу вашей организации GitHub также требуются права [_Owner_](/docs/platform/manage-access/self-service-permissions) или [_Account Admin_](/docs/platform/manage-access/enterprise-permissions) в <Constant name="dbt_platform"/>. При необходимости создайте для установки временную учетную запись с этими [правами](/docs/platform/manage-access/enterprise-permissions).
- **GitHub в локальной инфраструктуре или с размещением в ЕС**: На тарифных планах Enterprise и Enterprise+ можно использовать встроенную интеграцию, зарегистрировав [собственное приложение GitHub](#custom-github-application). На других тарифных планах [подключайтесь по URL Git](/docs/platform/git/import-a-project-by-git-url): этот способ поддерживает [меньше](/docs/platform/git/import-a-project-by-git-url#limited-integration) возможностей Git.

:::important Учет регистра в именах репозиториев
При указании репозитория GitHub в <Constant name="dbt_platform" /> через пользовательский интерфейс, API или провайдер Terraform имя репозитория должно в точности соответствовать регистру в URL GitHub, чтобы избежать ошибок клонирования или сбоев заданий. Например, если URL вашего репозитория — `github.com/my-org/MyRepo`, введите имя `MyRepo`, а не `myrepo`.
:::

## Выбор приложения GitHub

<Constant name="dbt" /> подключается к GitHub через приложение GitHub App. Есть два варианта:

- [Общее приложение <Constant name="dbt" /> (по умолчанию)](#installing-dbt-in-your-github-account), доступное любой организации, подключающейся к `github.com`. 
- Ваше [собственное приложение GitHub](#custom-github-application), доступное в рамках закрытого бета-тестирования для учетных записей Enterprise и Enterprise+ в средах MT или ST, использующих GitHub Enterprise Server или GitHub с хранением данных в ЕС. Чтобы присоединиться к бета-тестированию, обратитесь к менеджеру вашей учетной записи.  <Lifecycle status="private_beta"/>

Для одной учетной записи <Constant name="dbt" /> можно использовать одно приложение GitHub, а не отдельное приложение для каждого проекта.

## Установка dbt в учетной записи GitHub {#installing-dbt-in-your-github-account}

Вы можете подключить учетную запись <Constant name="dbt" /> к GitHub, установив приложение <Constant name="dbt" /> в своей организации GitHub и предоставив доступ к нужным репозиториям:

1. В <Constant name="dbt" /> нажмите на имя своей учетной записи в левом меню и выберите **Account settings**. 
2. Выберите **Personal profile** в разделе **Your profile**.
3. Прокрутите страницу вниз до **Linked accounts**.
<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connecting-github/github-connect-1.png" width= "80%" title="Переход к разделу Linked accounts в вашем профиле"/>
4. В разделе **Linked accounts** настройте подключение своей учетной записи GitHub к <Constant name="dbt" />, нажав **Link** справа от GitHub. Вы будете перенаправлены в свою учетную запись GitHub, где вам предложат установить и настроить приложение <Constant name="dbt" />. 
5. Выберите организацию GitHub и репозитории, к которым <Constant name="dbt" /> должен иметь доступ.

   <Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connecting-github/github-app-install.png" width="50%" title="Установка приложения dbt в организации GitHub"/>

6. Предоставьте приложению GitHub App для <Constant name="dbt" /> следующие права:
   - Чтение метаданных (Metadata)
   - Чтение и запись проверок (Checks)
   - Чтение и запись статусов коммитов (Commit statuses)
   - Чтение и запись содержимого (Contents / Code)
   - Чтение и запись пул-реквестов (Pull requests)
   - Чтение и запись вебхуков (Webhooks)
   - Чтение и запись рабочих процессов (Workflows)

7. После предоставления доступа приложению вы будете перенаправлены обратно в <Constant name="dbt" /> и увидите подтверждение успешной привязки учетной записи. Теперь вы прошли персональную аутентификацию. 
8. Попросите участников команды пройти аутентификацию по отдельности, подключив свои [личные профили GitHub](#authenticate-your-personal-github-account).

## Ограничение доступа к репозиториям в GitHub

Если вы владелец организации GitHub, вы также можете настроить приложение GitHub для <Constant name="dbt" /> так, чтобы оно имело доступ только к выбранным репозиториям. Эта настройка выполняется в GitHub, но в <Constant name="dbt" /> есть удобная ссылка для перехода к ней.
<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connecting-github/configure-github.png" title="Настройка приложения dbt"/>

## Собственное приложение GitHub <Lifecycle status="managed,managed_plus,private_beta" /> {#custom-github-application}

:::info Доступно в рамках закрытого бета-тестирования
Настройка собственного приложения GitHub доступна в рамках закрытого бета-тестирования. Чтобы присоединиться, обратитесь к менеджеру вашей учетной записи.
:::

Общее приложение GitHub App для <Constant name="dbt" /> размещается отдельно в каждом [регионе](/docs/platform/about-platform/access-regions-ip-addresses), поэтому оно может обращаться только к репозиториям на `github.com`. Если ваша организация использует [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server@3.14/admin/overview/about-github-enterprise-server) или [GitHub с хранением данных в ЕС](https://github.com/enterprise/data-residency), зарегистрируйте собственное приложение GitHub и настройте <Constant name="dbt" /> на его использование. 

Администратор учетной записи (или администратор безопасности) может выполнить эту настройку один раз:

1. [Зарегистрируйте приложение GitHub](#register-a-github-application) в своей организации GitHub
2. [Добавьте свое приложение GitHub в <Constant name="dbt" />](#add-your-github-application-to-dbt)

Затем каждому разработчику в учетной записи необходимо [повторно привязать свой профиль GitHub](#relink-your-github-profile).

### Регистрация приложения GitHub {#register-a-github-application}

:::note Доступность репозиториев

Платформа dbt не поддерживает одновременную интеграцию с публичными и приватными репозиториями GitHub. Для регистрации приложения GitHub App необходим приватный репозиторий. Отключите настроенный публичный репозиторий, прежде чем выполнять действия из этого раздела.

:::

Рекомендуем создавать приложение в организации GitHub, а не в личной учетной записи, чтобы подключение не прервалось при уходе сотрудника. Полное описание действий на стороне GitHub приведено в руководстве GitHub по [регистрации приложения GitHub App](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app).

1. В <Constant name="dbt" /> перейдите в **Account settings** > **Integrations** > **Git** и разверните раздел **GitHub**. Нажмите **Copy** рядом с **Redirect URL** &mdash; этот адрес понадобится на следующем шаге.
2. В своей организации GitHub перейдите в **Settings** > **Developer settings** > **GitHub Apps** и выберите **New GitHub App**.
3. Введите следующие данные:
    <SimpleTable>
    | Поле | Значение |
    | ----- | ----- |
    | **GitHub App name** | Узнаваемое имя, например `dbt platform` |
    | **Homepage URL** | [URL доступа](/docs/platform/about-platform/access-regions-ip-addresses) к вашему <Constant name="dbt" /> |
    | **Redirect URL** | Значение **Redirect URL**, скопированное из <Constant name="dbt" /> |
    | **Webhook** | Оставьте флажок **Active** установленным и введите любой URL-заполнитель (например, https://example.com) в поле **Webhook URL**.  dbt его не использует, но GitHub требует его указать |
    </SimpleTable>
4. Предоставьте приложению следующие права доступа к репозиториям:

    - Чтение метаданных (Metadata)
    - Чтение и запись проверок (Checks)
    - Чтение и запись статусов коммитов (Commit statuses)
    - Чтение и запись содержимого (Contents / Code)
    - Чтение и запись пул-реквестов (Pull requests)
    - Чтение и запись вебхуков (Webhooks)
    - Чтение и запись рабочих процессов (Workflows)

5. Выберите **Create GitHub App**. GitHub создаст **App ID** и **Client ID**.
6. Сгенерируйте **Client secret** и сохраните его в безопасном месте, поскольку GitHub показывает его только один раз.
7. В разделе **Private keys** выберите **Generate a private key**. GitHub скачает файл `.pem`. Затем вам нужно будет вставить его содержимое в <Constant name="dbt" />.
8. Установите приложение в своей организации и сохраните его **URL установки**. См. документацию GitHub о [предоставлении доступа к приложению по ссылке установки](https://docs.github.com/en/apps/sharing-github-apps/sharing-your-github-app#sharing-your-github-app-via-an-install-link).

Если вы используете тарифный план Business Critical с [ограничениями по IP-адресам](/docs/platform/secure/ip-restrictions), убедитесь, что диапазоны CIDR вашего экземпляра GitHub разрешены, иначе подключение не будет работать.

### Добавление своего приложения GitHub в dbt {#add-your-github-application-to-dbt}

:::caution Существующие подключения к GitHub перестанут работать

Если ваша учетная запись уже использует общее приложение GitHub App для <Constant name="dbt" />, переключение на собственное приложение сделает недействительными все существующие привязки профилей GitHub. Каждому пользователю учетной записи потребуется [повторно привязать свой профиль GitHub](#relink-your-github-profile), прежде чем он сможет продолжить разработку или запускать CI. Согласуйте переход с командой.

:::

1. В <Constant name="dbt" /> вернитесь в **Account settings** > **Integrations** > **Git** и разверните раздел **GitHub**.
2. Введите следующие данные:
    <SimpleTable>
    | Поле | Значение |
    | ----- | ----- |
    | **GitHub base URL** | Имя хоста вашего GitHub. Используйте `https://github.com` для GitHub.com или собственное имя хоста для GitHub Enterprise Server, например `https://github.yourgreatcompany.com` |
    | **App ID** | Значение **App ID** вашего приложения GitHub |
    | **Client ID** | Значение **Client ID** вашего приложения GitHub |
    | **Client secret** | Сгенерированный вами секрет клиента |
    | **Private key** | Полное содержимое скачанного файла `.pem`, включая строки `BEGIN` и `END` |
    | **Install URL** | Необязательно. Ссылка для установки вашего приложения |
    </SimpleTable>
    <Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connecting-github/github-application-platform.png" width="85%" title="Добавление собственного приложения GitHub в разделе Account settings, Integrations, Git"/>

3. Выберите **Save**. <Constant name="dbt" /> проверит учетные данные в GitHub. Если что-то не так, <Constant name="dbt" /> покажет ошибку и не сохранит конфигурацию.

Теперь <Constant name="dbt" /> выполняет всю авторизацию GitHub для этой учетной записи через ваше приложение.

### Повторная привязка профиля GitHub {#relink-your-github-profile}

Каждый разработчик проходит аутентификацию через приложение GitHub учетной записи, поэтому доступ к репозиториям соответствует правам, фактически предоставленным ему администратором GitHub. После того как администратор добавит или изменит приложение, повторно привяжите свой профиль:

1. В <Constant name="dbt" /> нажмите на имя своей учетной записи в левом меню и выберите **Account settings**.
2. Выберите **Personal profile** в разделе **Your profile**.
3. Прокрутите страницу до **Linked accounts** и нажмите **Unlink** рядом с GitHub, если старое подключение все еще отображается.
4. Нажмите **Link** и авторизуйте приложение GitHub вашей организации.

Подробные инструкции приведены в разделе [Аутентификация личной учетной записи GitHub](#authenticate-your-personal-github-account).

### Удаление интеграции с GitHub

Администраторы учетной записи и администраторы безопасности могут удалить интеграцию с GitHub в разделе **Account settings** > **Integrations** > **Git**.

:::caution Удаление интеграции отключает всех пользователей

Удаление интеграции нарушает доступ к репозиториям и работу CI для _всей_ учетной записи, пока вы не настроите новую интеграцию. Заранее подготовить замену нельзя, поскольку учетная запись поддерживает только одну интеграцию с GitHub одновременно.

:::

### Ограничения

Обратите внимание на следующие ограничения:

- Одно приложение GitHub на учетную запись <Constant name="dbt" />. Нельзя задать отдельное приложение для каждого проекта.
- Нельзя настроить несколько интеграций с GitHub в одной учетной записи.
- Только администраторы учетной записи и администраторы безопасности могут создавать, обновлять или удалять интеграцию с GitHub.

## Аутентификация личной учетной записи GitHub {#authenticate-your-personal-github-account}

После того как администратор <Constant name="dbt" /> [настроит подключение](/docs/platform/git/connect-github#installing-dbt-in-your-github-account) к учетной записи GitHub вашей организации, вам необходимо пройти аутентификацию с помощью личной учетной записи. Вы должны подключить свой личный профиль GitHub к <Constant name="dbt" />, чтобы использовать [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) и [CLI](/docs/platform/dbt-cli-installation) и подтвердить свои права на чтение и запись в репозиторий.

:::info Подключение профиля GitHub

- Каждый разработчик <Constant name="dbt" /> на [тарифном плане Enterprise или Enterprise+](https://www.getdbt.com/pricing/) должен подключить свой профиль GitHub к <Constant name="dbt" />. Это необходимо, поскольку <Constant name="studio_ide" /> проверяет права каждого разработчика на чтение и запись в репозиторий dbt. 

- Разработчикам <Constant name="dbt" /> на [тарифном плане Starter](https://www.getdbt.com/pricing/) не обязательно подключать свои профили GitHub, однако это все же рекомендуется.

:::

Если ваша учетная запись использует [собственное приложение GitHub](#custom-github-application), вы авторизуете это приложение вместо общего приложения <Constant name="dbt" />, а ваш доступ к репозиториям соответствует настройкам установленного приложения GitHub App.

Чтобы подключить личную учетную запись GitHub:

1. В <Constant name="dbt" /> нажмите на имя своей учетной записи в левом меню и выберите **Account settings**.

2. Выберите **Personal profile** в разделе **Your profile**.

3. Прокрутите страницу вниз до **Linked accounts**. Если ваша учетная запись GitHub не подключена, вы увидите сообщение «No connected account». 

4. Нажмите **Link**, чтобы начать настройку. Вы будете перенаправлены в GitHub, где на экране предоставления разрешений вам предложат авторизовать <Constant name="dbt" />.
<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connecting-github/github-auth.png" title="Авторизация приложения dbt для разработчиков"/>

5. После подтверждения авторизации вы будете перенаправлены в <Constant name="dbt" />, где теперь должна отображаться подключенная учетная запись. 

Теперь вы можете использовать <Constant name="studio_ide" /> или CLI <Constant name="dbt" />.


## Часто задаваемые вопросы
<FAQ path="Git/gitignore"/>
<FAQ path="Git/git-migration"/>
<FAQ path="Git/github-custom-app-errors"/>
