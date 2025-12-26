---
title: "Подключение к GitHub"
description: "Узнайте, как подключение вашего аккаунта GitHub обеспечивает удобство и дополнительный уровень безопасности для dbt."
id: "connect-github"
sidebar_label: "Подключение к GitHub"
---

Подключение вашей учетной записи GitHub к dbt Cloud обеспечивает удобство и дополнительный уровень безопасности:
- Импортируйте новые репозитории GitHub всего за пару кликов во время настройки проекта dbt Cloud.
- Клонируйте репозитории, используя HTTPS вместо SSH.
- Запускайте сборки [непрерывной интеграции](/docs/deploy/continuous-integration) (CI), когда в GitHub открываются pull-запросы.

Подключение вашей учетной записи GitHub к <Constant name="cloud" /> обеспечивает удобство и дополнительный уровень безопасности для <Constant name="cloud" />:
- Импорт новых репозиториев GitHub в пару кликов во время настройки проекта <Constant name="cloud" />.
- Клонирование репозиториев с использованием HTTPS вместо SSH.
- Запуск сборок [Continuous integration](/docs/deploy/continuous-integration) (CI) при открытии pull request’ов в GitHub.

- Для развертывания GitHub на локальном сервере обратитесь к [импорту проекта по URL git](/docs/cloud/git/import-a-project-by-git-url) для настройки вашего подключения. Некоторые функции git [ограничены](/docs/cloud/git/import-a-project-by-git-url#limited-integration) при этой настройке.
  * **Примечание** &mdash; [Однопользовательские](/docs/cloud/about-cloud/tenancy#single-tenant) учетные записи предлагают расширенные возможности подключения для интеграции с развертыванием GitHub на локальном сервере с использованием нативной интеграции. Эта интеграция позволяет использовать все функции, такие как запуск CI-сборок. Команда инфраструктуры dbt Labs будет координировать с вами, чтобы убедиться, что все дополнительные требования к настройке сети выполнены. Для обсуждения деталей свяжитесь с поддержкой dbt Labs или вашей командой учетной записи dbt Cloud.
- Вы _должны_ быть **владельцем организации GitHub**, чтобы [установить приложение dbt Cloud](/docs/cloud/git/connect-github#installing-dbt-cloud-in-your-github-account) в вашей организации GitHub. Чтобы узнать о ролях в организации GitHub, см. [документацию GitHub](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization).
- Владельцу организации GitHub требуются разрешения [_Owner_](/docs/cloud/manage-access/self-service-permissions) или [_Account Admin_](/docs/cloud/manage-access/enterprise-permissions) при входе в dbt Cloud для интеграции с окружением GitHub, используя организации.
- Возможно, вам потребуется временно предоставить дополнительную учетную запись пользователя dbt Cloud с разрешениями _Owner_ или _Account Admin_ для владельца вашей организации GitHub, пока он не завершит установку.

- Для развертывания GitHub **On-Premises** вместо этого воспользуйтесь инструкцией [importing a project by git URL](/docs/cloud/git/import-a-project-by-git-url) для настройки подключения. Некоторые функции Git при таком способе [ограничены](/docs/cloud/git/import-a-project-by-git-url#limited-integration).
  * **Примечание** &mdash; Аккаунты [Single tenant](/docs/cloud/about-cloud/tenancy#single-tenant) предлагают расширенные варианты подключения для интеграции с развертыванием GitHub On-Premises с использованием нативной интеграции. Эта интеграция позволяет использовать все возможности, такие как запуск CI-сборок. Команда инфраструктуры dbt Labs будет координировать работу с вами, чтобы убедиться, что все дополнительные требования к сетевой конфигурации выполнены. Для обсуждения деталей свяжитесь со службой поддержки dbt Labs или с вашей командой аккаунта <Constant name="cloud" />.
- Вы **обязаны** быть **владельцем организации GitHub**, чтобы [установить приложение <Constant name="cloud" />](/docs/cloud/git/connect-github#installing-dbt-in-your-github-account) в вашей организации GitHub. Подробнее о ролях в организациях GitHub см. [документацию GitHub](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization).
- Владелец организации GitHub должен иметь права [_Owner_](/docs/cloud/manage-access/self-service-permissions) или [_Account Admin_](/docs/cloud/manage-access/enterprise-permissions) при входе в <Constant name="cloud" /> для интеграции с окружением GitHub через организации.
- Возможно, вам потребуется временно предоставить дополнительный пользовательский аккаунт <Constant name="cloud" /> с правами _Owner_ или _Account Admin_ [permissions](/docs/cloud/manage-access/enterprise-permissions) для владельца вашей организации GitHub, пока он не завершит установку.

:::important Case-sensitive repository names
При указании репозитория GitHub в <Constant name="dbt_platform" /> через UI, API или Terraform provider имя репозитория должно **точно** соответствовать регистру, используемому в URL GitHub, чтобы избежать ошибок клонирования или сбоев выполнения заданий.  
Например, если URL вашего репозитория — `github.com/my-org/MyRepo`, необходимо указать имя `MyRepo`, а не `myrepo`.
:::

## Installing dbt in your GitHub account

Вы можете подключить свой аккаунт <Constant name="cloud" /> к GitHub, установив приложение <Constant name="cloud" /> в вашей организации GitHub и предоставив доступ к соответствующим репозиториям.  
Чтобы подключить аккаунт <Constant name="cloud" /> к вашему аккаунту GitHub:

1. В <Constant name="cloud" /> нажмите на имя вашего аккаунта в левом боковом меню и выберите **Account settings**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-connect-1.png" title="Переход к Связанным учетным записям в вашем профиле"/>

4. В разделе **Связанные учетные записи** настройте подключение вашей учетной записи GitHub к dbt Cloud, нажав **Связать** справа от GitHub. Это перенаправит вас на вашу учетную запись в GitHub, где вам будет предложено установить и настроить приложение dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-connect-1.png" width= "80%" title="Navigated to Linked Accounts under your profile"/>

4. В разделе **Linked accounts** настройте подключение вашего аккаунта GitHub к <Constant name="cloud" />, нажав **Link** справа от GitHub. После этого вы будете перенаправлены в ваш аккаунт GitHub, где потребуется установить и настроить приложение <Constant name="cloud" />.

5. Выберите GitHub‑организацию и репозитории, к которым <Constant name="cloud" /> должен иметь доступ.

   <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-app-install.png" width="50%" title="Installing the dbt application into a GitHub organization"/>

6. Назначьте GitHub App <Constant name="cloud" /> следующие разрешения:
   - доступ на чтение к metadata  
   - доступ на чтение и запись к Checks  
   - доступ на чтение и запись к Commit statuses  
   - доступ на чтение и запись к Contents (Code)  
   - доступ на чтение и запись к Pull requests  
   - доступ на чтение и запись к Webhooks  
   - доступ на чтение и запись к Workflows  

7. После предоставления доступа приложению вы будете перенаправлены обратно в <Constant name="cloud" />, где увидите сообщение об успешном подключении связанного аккаунта. На этом этапе вы аутентифицированы как пользователь.

8. Попросите участников вашей команды пройти индивидуальную аутентификацию, подключив свои [личные профили GitHub](#authenticate-your-personal-github-account).

## Limiting repository access in GitHub
Если вы являетесь владельцем GitHub‑организации, вы также можете настроить приложение GitHub для <Constant name="cloud" /> так, чтобы оно имело доступ только к выбранным репозиториям. Эта настройка выполняется в GitHub, однако в <Constant name="cloud" /> мы предоставляем удобную ссылку для запуска этого процесса.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/configure-github.png" title="Configuring the dbt app"/>

После того как администратор dbt Cloud [настроит подключение](/docs/cloud/git/connect-github#installing-dbt-cloud-in-your-github-account) к учетной записи вашей организации в GitHub, вам необходимо аутентифицироваться, используя вашу личную учетную запись. Вы должны подключить свой личный профиль GitHub к dbt Cloud, чтобы использовать [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) и [CLI](/docs/cloud/cloud-cli-installation) и подтвердить ваш доступ на чтение и запись в репозиторий.

После того как администратор <Constant name="cloud" /> [настроит подключение](/docs/cloud/git/connect-github#installing-dbt-cloud-in-your-github-account) к GitHub-аккаунту вашей организации, вам необходимо пройти аутентификацию с использованием вашей личной учетной записи. Вы должны связать свой личный профиль GitHub с <Constant name="cloud" />, чтобы использовать [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) и [CLI](/docs/cloud/cloud-cli-installation), а также подтвердить наличие прав на чтение и запись в репозитории.

- Разработчики dbt Cloud на [Enterprise плане](https://www.getdbt.com/pricing/) должны каждый подключить свои профили GitHub к dbt Cloud. Это необходимо, потому что dbt Cloud IDE проверяет доступ каждого разработчика на чтение/запись для репозитория dbt.

- Разработчики <Constant name="cloud" /> на тарифах [Enterprise или Enterprise+](https://www.getdbt.com/pricing/) должны **каждый** подключить свой профиль GitHub к <Constant name="cloud" />. Это необходимо, потому что <Constant name="cloud_ide" /> проверяет права чтения и записи каждого разработчика в репозиторий dbt.

- Разработчикам <Constant name="cloud" /> на тарифе [Starter](https://www.getdbt.com/pricing/) не обязательно каждому подключать свой профиль GitHub, однако всё равно рекомендуется это сделать.

:::

Чтобы подключить личную учетную запись GitHub:

1. В <Constant name="cloud" /> нажмите на имя своей учётной записи в левом боковом меню и выберите **Account settings**.

2. Выберите **Личный профиль** в разделе **Ваш профиль**.

3. Прокрутите вниз до **Связанные учетные записи**. Если ваша учетная запись GitHub не подключена, вы увидите "Нет подключенной учетной записи".

4. Выберите **Link**, чтобы начать процесс настройки. Вы будете перенаправлены на GitHub, где появится запрос на авторизацию <Constant name="cloud" /> на экране предоставления доступа.
<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-auth.png" title="Authorizing the dbt app for developers"/>

5. После подтверждения авторизации вы будете перенаправлены обратно в <Constant name="cloud" />, и теперь должны увидеть подключённую учётную запись.

Теперь вы можете использовать <Constant name="cloud_ide" /> или CLI <Constant name="cloud" />.

## Часто задаваемые вопросы
<FAQ path="Git/gitignore"/>
<FAQ path="Git/git-migration"/>