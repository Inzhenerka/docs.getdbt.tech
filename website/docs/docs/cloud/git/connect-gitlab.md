---
title: "Подключение к GitLab"
description: "Узнайте, как подключение вашей учетной записи GitLab обеспечивает удобство и дополнительный уровень безопасности в dbt."
id: "connect-gitlab"
---

Подключение вашей учетной записи GitLab к dbt Cloud обеспечивает удобство и дополнительный уровень безопасности для dbt Cloud:
- Импортируйте новые репозитории GitLab несколькими щелчками мыши во время настройки проекта dbt Cloud.
- Клонируйте репозитории, используя HTTPS вместо SSH.
- Переносите разрешения пользователей GitLab в dbt Cloud или в git-действия dbt Cloud CLI.
- Запускайте сборки [непрерывной интеграции](/docs/deploy/continuous-integration) при открытии запросов на слияние в GitLab.
  - GitLab автоматически регистрирует вебхук в вашем репозитории GitLab для обеспечения бесшовной интеграции с dbt Cloud.

Подключение вашего аккаунта GitLab к <Constant name="cloud" /> обеспечивает удобство и дополнительный уровень безопасности для <Constant name="cloud" />:

- Импортируйте новые репозитории GitLab в пару кликов во время настройки проекта в <Constant name="cloud" />.
- Клонируйте репозитории по HTTPS вместо SSH.
- Передавайте пользовательские права GitLab в <Constant name="cloud" /> или в git‑действия CLI <Constant name="cloud" />.
- Запускайте сборки [Continuous integration](/docs/deploy/continuous-integration) при открытии merge request’ов в GitLab.

:::info
При настройке репозитория в <Constant name="cloud" /> GitLab автоматически:

- Регистрирует webhook, который запускает задания пайплайна в <Constant name="cloud" />.
- Создаёт [project access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) в вашем репозитории GitLab, который отправляет статус выполнения задания обратно в GitLab с использованием API <Constant name="cloud" /> для CI‑заданий. <Constant name="cloud" /> автоматически обновляет этот токен за вас.

Требуется аккаунт [GitLab Premium или Ultimate](https://about.gitlab.com/pricing/).

:::

В зависимости от вашего плана используйте следующие инструкции для интеграции GitLab с <Constant name="cloud" />:

- Для планов Developer или Starter ознакомьтесь с этими [инструкциями](#for-dbt-developer-and-starter-plans).
- Для планов Enterprise или Enterprise+ перейдите к этим [инструкциям](#for-the-dbt-enterprise-plans).

## For dbt Developer and Starter plans

Прежде чем вы сможете работать с репозиториями GitLab в <Constant name="cloud" />, необходимо подключить ваш аккаунт GitLab к пользовательскому профилю. Это позволяет <Constant name="cloud" /> аутентифицировать ваши действия при взаимодействии с Git‑репозиториями. Перед подключением аккаунта обязательно ознакомьтесь с [ограничениями](#limitations) планов Team и Developer.

Чтобы подключить аккаунт GitLab:

1. В <Constant name="cloud" /> нажмите на имя вашего аккаунта в левом боковом меню и выберите **Account settings**.
2. В разделе **Your profile** выберите **Personal profile**.
3. Прокрутите страницу вниз до раздела **Linked accounts**.
4. Нажмите **Link** справа от вашего аккаунта GitLab.

Когда вы нажмете **Связать**, вы будете перенаправлены в GitLab и вам будет предложено войти в свою учетную запись. Затем GitLab запросит ваше явное разрешение:

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="Экран авторизации GitLab" />

После того как вы примете, вы должны быть перенаправлены обратно в dbt Cloud, и вы увидите, что ваша учетная запись была связана с вашим профилем.

После подтверждения вы будете перенаправлены обратно в <Constant name="cloud" />, где увидите, что ваш аккаунт был связан с вашим профилем.

### Требования и ограничения

Тарифы <Constant name="cloud" /> Team и Developer используют один GitLab deploy token, который создаётся первым пользователем, подключившим репозиторий. Это означает, что:
- Все репозитории, к которым пользователи получают доступ из <Constant name="dbt_platform" />, должны принадлежать [группе GitLab](https://docs.gitlab.com/user/group/).
- Все Git-операции (например, коммиты и push’и) из <Constant name="cloud_ide" /> отображаются как выполненные от имени одного и того же deploy token.
- Правила push в GitLab могут отклонять push’и, выполненные через <Constant name="cloud" />, особенно когда несколько пользователей делают коммиты с использованием одного deploy token.

Для поддержки более сложных Git‑процессов и корректной работы с коммитами от нескольких пользователей рекомендуется перейти на тариф Enterprise, который предоставляет более гибкие стратегии аутентификации Git.

## Для тарифов dbt Enterprise

Клиенты <Constant name="cloud" /> Enterprise и Enterprise+ получают дополнительное преимущество — возможность использовать собственное OAuth‑приложение GitLab в <Constant name="cloud" />. Этот уровень обеспечивает повышенную безопасность, поскольку <Constant name="cloud" /> будет:
- Принудительно применять авторизацию пользователей через OAuth.
- Передавать пользовательские права доступа к репозиториям GitLab (чтение / запись) в <Constant name="cloud" /> или в Git‑действия CLI <Constant name="cloud" />.

Чтобы подключить GitLab в <Constant name="cloud" />, администратор аккаунта GitLab должен:
1. [Настроить OAuth‑приложение GitLab](#setting-up-a-gitlab-oauth-application).
2. [Добавить приложение GitLab в <Constant name="cloud" />](#adding-the-gitlab-oauth-application-to-dbt-cloud).

После выполнения этих шагов администратором, разработчикам <Constant name="cloud" /> необходимо:
1. [Лично пройти аутентификацию в GitLab](#personally-authenticating-with-gitlab) из <Constant name="cloud" />.

В GitLab перейдите в настройки вашей группы и выберите **Приложения**. Здесь вы увидите форму для создания нового приложения.

### Настройка OAuth‑приложения GitLab

Мы рекомендуем, чтобы перед настройкой проекта в <Constant name="cloud" /> администратор аккаунта GitLab создал OAuth‑приложение в GitLab для использования в <Constant name="cloud" />.

В GitLab при создании вашего группового приложения введите следующее:

| Поле | Значение |
| ------ | ----- |
| **Название** | <Constant name="cloud" /> |
| **Redirect URI** | `https://YOUR_ACCESS_URL/complete/gitlab` |
| **Конфиденциальное** | ✅ |
| **Области доступа (Scopes)** | ✅ api |

Замените `YOUR_ACCESS_URL` на [соответствующий URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.

Форма приложения в GitLab должна выглядеть следующим образом после заполнения:

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/gitlab app.png" title="Форма группового приложения GitLab"/>

Нажмите **Сохранить приложение** в GitLab, и GitLab сгенерирует **ID приложения** и **Секрет**. Эти значения будут доступны даже если вы закроете экран приложения, так что это не единственный шанс их сохранить.

Если вы являетесь клиентом Business Critical, использующим [ограничения по IP](/docs/cloud/secure/ip-restrictions), убедитесь, что вы добавили соответствующие CIDR GitLab в ваши правила ограничения IP, иначе подключение к GitLab не удастся.

### Добавление OAuth‑приложения GitLab в dbt
После того как вы создали приложение GitLab, необходимо указать информацию о нём в <Constant name="cloud" />. В <Constant name="cloud" /> администраторы аккаунта должны перейти в **Account Settings**, нажать на вкладку **Integrations** и раскрыть раздел GitLab.

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Navigation.gif" title="Navigating to the GitLab Integration in dbt"/>

В <Constant name="cloud" /> введите следующие значения:

| Поле | Значение |
| ------ | ----- |
| **Экземпляр GitLab** | https://gitlab.com |
| **ID приложения** | *скопируйте значение из приложения GitLab* |
| **Секрет** | *скопируйте значение из приложения GitLab* |

Обратите внимание, если у вас есть специальная хостинговая версия GitLab, измените **Экземпляр GitLab**, чтобы использовать предоставленное для вашей организации имя хоста, например `https://gitlab.yourgreatcompany.com/`.

После заполнения формы в <Constant name="cloud" /> нажмите **Save**.

Затем вы будете перенаправлены в GitLab и вам будет предложено войти в свою учетную запись. GitLab запросит ваше явное разрешение:

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="Экран авторизации GitLab" />

После того как вы примете запрос, вы будете перенаправлены обратно в <Constant name="cloud" />, и ваша интеграция будет готова к тому, чтобы разработчики вашей команды могли [выполнить персональную аутентификацию](#personally-authenticating-with-gitlab).

### Персональная аутентификация с GitLab
Разработчики <Constant name="cloud" /> на тарифных планах Enterprise или Enterprise+ должны каждый отдельно подключить свои профили GitLab к <Constant name="cloud" />, поскольку права чтения и записи в репозиторий dbt для каждого разработчика проверяются в <Constant name="cloud_ide" /> или CLI <Constant name="cloud" />.

Чтобы подключить личную учетную запись GitLab:

1. В <Constant name="cloud" /> нажмите на название вашей учетной записи в меню слева и выберите **Account settings**.

2. Выберите **Личный профиль** в разделе **Ваш профиль**.

3. Прокрутите вниз до **Связанные учетные записи**.

Если ваша учетная запись GitLab не подключена, вы увидите сообщение «No connected account». Выберите **Link**, чтобы начать процесс настройки. Вы будете перенаправлены в GitLab, где потребуется авторизовать <Constant name="cloud" /> на экране предоставления доступа.

<Lightbox src="/img/docs/dbt-cloud/connecting-gitlab/GitLab-Auth.png" title="Authorizing the dbt app for developers" />

После подтверждения авторизации вы будете перенаправлены обратно в <Constant name="cloud" />, и там вы должны увидеть подключенную учетную запись. Теперь вы готовы начать разработку в <Constant name="cloud_ide" /> или с помощью CLI <Constant name="cloud" />.

## Устранение неполадок

<FAQ path="Troubleshooting/gitlab-webhook"/>
<FAQ path="Troubleshooting/error-importing-repo"/>
<FAQ path="Git/gitignore"/>
<FAQ path="Git/gitlab-authentication"/>
<FAQ path="Git/gitlab-selfhosted"/>
<FAQ path="Git/git-migration"/>
<FAQ path="Git/gitlab-token-refresh" />
