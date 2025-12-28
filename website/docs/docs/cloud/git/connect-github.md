---
title: "Подключение к GitHub"
description: "Узнайте, как подключение вашей учетной записи GitHub обеспечивает удобство и дополнительный уровень безопасности для dbt."
id: "connect-github"
sidebar_label: "Подключение к GitHub"
---


Подключение вашей учетной записи GitHub к <Constant name="cloud" /> обеспечивает удобство и дополнительный уровень безопасности для <Constant name="cloud" />:
- Импорт новых репозиториев GitHub всего в пару кликов во время настройки проекта в <Constant name="cloud" />.
- Клонирование репозиториев с использованием HTTPS вместо SSH.
- Запуск сборок [Continuous integration](/docs/deploy/continuous-integration) (CI) при открытии pull request в GitHub.

## Предварительные требования

- Для On-Premises-развертывания GitHub используйте инструкцию [импорт проекта по git URL](/docs/cloud/git/import-a-project-by-git-url) для настройки подключения. Некоторые возможности git в этом случае [ограничены](/docs/cloud/git/import-a-project-by-git-url#limited-integration).
  * **Примечание** &mdash; учетные записи [Single tenant](/docs/cloud/about-cloud/tenancy#single-tenant) предлагают расширенные возможности подключения для интеграции с On-Premises-развертыванием GitHub с использованием нативной интеграции. Такая интеграция позволяет использовать все функции, включая запуск CI-сборок. Инфраструктурная команда dbt Labs будет координировать работу с вами, чтобы убедиться, что все дополнительные требования к сетевой конфигурации выполнены. Для обсуждения деталей свяжитесь со службой поддержки dbt Labs или с вашей командой по работе с учетной записью <Constant name="cloud" />.
- Вы _обязательно_ должны быть **владельцем организации GitHub**, чтобы [установить приложение <Constant name="cloud" />](/docs/cloud/git/connect-github#installing-dbt-in-your-github-account) в вашей организации GitHub. Подробнее о ролях в организациях GitHub см. в [документации GitHub](https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization).
- Владелец организации GitHub должен иметь права [_Owner_](/docs/cloud/manage-access/self-service-permissions) или [_Account Admin_](/docs/cloud/manage-access/enterprise-permissions) при входе в <Constant name="cloud" /> для интеграции с GitHub через организации.
- Возможно, вам потребуется временно предоставить дополнительную учетную запись пользователя <Constant name="cloud" /> с правами _Owner_ или _Account Admin_ [permissions](/docs/cloud/manage-access/enterprise-permissions) владельцу организации GitHub, пока он не завершит установку.

:::important Имена репозиториев чувствительны к регистру
При указании репозитория GitHub в <Constant name="dbt_platform" /> через UI, API или Terraform provider имя репозитория должно **точно** соответствовать регистру символов, используемому в URL GitHub, иначе возможны ошибки клонирования или сбои выполнения задач. Например, если URL вашего репозитория — `github.com/my-org/MyRepo`, необходимо указывать имя `MyRepo`, а не `myrepo`.
:::

## Установка dbt в вашу учетную запись GitHub

Вы можете подключить свою учетную запись <Constant name="cloud" /> к GitHub, установив приложение <Constant name="cloud" /> в вашей организации GitHub и предоставив доступ к нужным репозиториям.  
Чтобы подключить учетную запись <Constant name="cloud" /> к GitHub:

1. В <Constant name="cloud" /> нажмите на имя вашей учетной записи в левом меню и выберите **Account settings**.

2. В разделе **Your profile** выберите **Personal profile**.

3. Прокрутите страницу до раздела **Linked accounts**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-connect-1.png" width= "80%" title="Переход в раздел Linked Accounts в профиле"/>

4. В разделе **Linked accounts** настройте подключение учетной записи GitHub к <Constant name="cloud" />, нажав **Link** справа от GitHub. Вы будете перенаправлены в GitHub, где потребуется установить и настроить приложение <Constant name="cloud" />.

5. Выберите организацию GitHub и репозитории, к которым <Constant name="cloud" /> должен иметь доступ.

   <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-app-install.png" width="50%" title="Установка приложения dbt в организацию GitHub"/>

6. Назначьте GitHub App <Constant name="cloud" /> следующие разрешения:
   - Доступ на чтение к metadata
   - Доступ на чтение и запись к Checks
   - Доступ на чтение и запись к Commit statuses
   - Доступ на чтение и запись к Contents (Code)
   - Доступ на чтение и запись к Pull requests
   - Доступ на чтение и запись к Webhooks
   - Доступ на чтение и запись к Workflows

7. После предоставления доступа вы будете перенаправлены обратно в <Constant name="cloud" />, где увидите успешное подключение учетной записи. Теперь вы аутентифицированы персонально.
8. Попросите членов вашей команды индивидуально пройти аутентификацию, подключив свои [персональные профили GitHub](#authenticate-your-personal-github-account).

## Ограничение доступа к репозиториям в GitHub

Если вы являетесь владельцем организации GitHub, вы также можете настроить приложение GitHub для <Constant name="cloud" /> так, чтобы оно имело доступ только к выбранным репозиториям. Эта настройка выполняется в GitHub, однако в <Constant name="cloud" /> мы предоставляем удобную ссылку для начала процесса.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/configure-github.png" title="Настройка приложения dbt"/>

## Аутентификация вашей персональной учетной записи GitHub

После того как администратор <Constant name="cloud" /> [настроит подключение](/docs/cloud/git/connect-github#installing-dbt-cloud-in-your-github-account) к учетной записи GitHub вашей организации, вам необходимо пройти аутентификацию с использованием персональной учетной записи. Вы должны подключить свой персональный профиль GitHub к <Constant name="cloud" />, чтобы использовать [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) и [CLI](/docs/cloud/cloud-cli-installation), а также для проверки прав на чтение и запись в репозитории.

:::info Подключение профиля GitHub

- Разработчики <Constant name="cloud" /> на тарифах [Enterprise или Enterprise+](https://www.getdbt.com/pricing/) должны **каждый** подключить свой профиль GitHub к <Constant name="cloud" />. Это связано с тем, что <Constant name="cloud_ide" /> проверяет права на чтение и запись в репозиторий dbt для каждого разработчика.

- Разработчикам <Constant name="cloud" /> на тарифе [Starter](https://www.getdbt.com/pricing/) не требуется индивидуально подключать профили GitHub, однако это все равно рекомендуется.

:::

Чтобы подключить персональную учетную запись GitHub:

1. В <Constant name="cloud" /> нажмите на имя вашей учетной записи в левом меню и выберите **Account settings**.

2. В разделе **Your profile** выберите **Personal profile**.

3. Прокрутите страницу до раздела **Linked accounts**. Если ваша учетная запись GitHub не подключена, вы увидите сообщение "No connected account".

4. Нажмите **Link**, чтобы начать процесс настройки. Вы будете перенаправлены в GitHub, где потребуется авторизовать <Constant name="cloud" /> на экране предоставления доступа.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-github/github-auth.png" title="Авторизация приложения dbt для разработчиков"/>

5. После подтверждения авторизации вы будете перенаправлены обратно в <Constant name="cloud" />, и увидите подключенную учетную запись.

Теперь вы можете использовать <Constant name="cloud_ide" /> или CLI <Constant name="cloud" />.

## FAQs
<FAQ path="Git/gitignore"/>
<FAQ path="Git/git-migration"/>
