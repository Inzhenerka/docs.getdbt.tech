---
title: "Подключение к GitLab"
description: "Узнайте, как подключение вашей учетной записи GitLab обеспечивает удобство и дополнительный уровень безопасности в dbt."
id: "connect-gitlab"
availability:
  surface: platform
  access: login_required
---


Подключение вашей учетной записи GitLab к <Constant name="dbt" /> обеспечивает удобство и дополнительный уровень безопасности в <Constant name="dbt" />:
- Импортируйте новые репозитории GitLab в пару кликов при настройке проекта <Constant name="dbt" />.
- Клонируйте репозитории по HTTPS вместо SSH.
- Применяйте права пользователей GitLab к операциям git в <Constant name="dbt" /> и <Constant name="platform_cli" />.
- Запускайте сборки [непрерывной интеграции](/docs/deploy/continuous-integration) при открытии запросов на слияние в GitLab.

:::info
При настройке репозитория в <Constant name="dbt" /> GitLab автоматически:
- Регистрирует webhook, который запускает задания пайплайна в <Constant name="dbt" />.
- Создаёт [project access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) в вашем репозитории GitLab, который отправляет статус выполнения задания обратно в GitLab с использованием API <Constant name="dbt" /> для CI‑заданий. <Constant name="dbt" /> автоматически обновляет этот токен за вас.

У вас должна быть [учетная запись GitLab Premium или Ultimate](https://about.gitlab.com/pricing/).

:::


В зависимости от вашего тарифного плана выполните следующие действия для интеграции GitLab с <Constant name="dbt" />:
- Для тарифных планов Developer или Starter следуйте этим [инструкциям](#for-dbt-developer-and-starter-plans).
- Для тарифных планов Enterprise или Enterprise+ следуйте этим [инструкциям](#for-the-dbt-enterprise-plans).

## Для планов dbt Developer и Starter {#for-dbt-developer-and-starter-plans}

Прежде чем работать с репозиториями GitLab в <Constant name="dbt" />, необходимо подключить учетную запись GitLab к своему профилю пользователя. Это позволяет <Constant name="dbt" /> аутентифицировать ваши действия при взаимодействии с репозиториями Git. Перед подключением учетной записи обязательно ознакомьтесь с [требованиями и ограничениями](#requirements-and-limitations) тарифных планов Starter и Developer.

Чтобы подключить аккаунт GitLab:
1. В <Constant name="dbt" /> нажмите на название своей учетной записи в меню слева и выберите **Настройки учетной записи**.
2. В разделе **Your profile** выберите **Personal profile**.
3. Перейдите в раздел **Связанные учетные записи**.
4. Нажмите **Link** справа от вашего аккаунта GitLab.
5. В GitLab войдите в систему при появлении соответствующего запроса. Когда появится запрос авторизации, выберите вариант авторизации <Constant name="dbt" />.

После подтверждения запроса авторизации вы будете перенаправлены обратно в <Constant name="dbt" /> и увидите, что ваша учетная запись связана с вашим профилем.

### Требования и ограничения {#requirements-and-limitations}

Тарифные планы Starter и Developer в <Constant name="dbt" /> используют единый токен развертывания GitLab, созданный первым пользователем, подключившим репозиторий, что означает:
- Все репозитории, к которым пользователи обращаются из <Constant name="dbt_platform" />, должны принадлежать [группе GitLab](https://docs.gitlab.com/user/group/).
- Все Git-операции (например, коммиты и push’и) из <Constant name="studio_ide" /> отображаются как выполненные от имени одного и того же deploy token.
- Правила push в GitLab могут отклонять push’и, выполненные через <Constant name="dbt" />, особенно когда несколько пользователей делают коммиты с использованием одного deploy token.

Для поддержки более сложных Git‑процессов и корректной работы с коммитами от нескольких пользователей рекомендуется перейти на тариф Enterprise, который предоставляет более гибкие стратегии аутентификации Git.

## Для тарифов dbt Enterprise {#for-the-dbt-enterprise-plans}

Клиенты <Constant name="dbt" /> с тарифными планами Enterprise и Enterprise+ получают дополнительную возможность использовать собственное OAuth-приложение GitLab в <Constant name="dbt" />. Эти тарифные планы обеспечивают дополнительную безопасность, поскольку <Constant name="dbt" /> будет:
- Принудительно применять авторизацию пользователей через OAuth.
- Применять права пользователей GitLab на доступ к репозиториям (доступ на чтение/запись) к операциям git в <Constant name="dbt" /> или <Constant name="platform_cli" />.

Чтобы подключить GitLab в <Constant name="dbt" />, администратор аккаунта GitLab должен:
1. [Настроить OAuth‑приложение GitLab](#setting-up-a-gitlab-oauth-application).
2. [Добавить приложение GitLab в <Constant name="dbt" />](#adding-the-gitlab-oauth-application-to-dbt).

После выполнения этих шагов администратором, разработчикам <Constant name="dbt" /> необходимо:
1. [Лично пройти аутентификацию в GitLab](#personally-authenticating-with-gitlab) из <Constant name="dbt" />.


### Настройка OAuth‑приложения GitLab {#setting-up-a-gitlab-oauth-application}

Мы рекомендуем, чтобы перед настройкой проекта в <Constant name="dbt" /> администратор аккаунта GitLab создал OAuth‑приложение в GitLab для использования в <Constant name="dbt" />.

Более подробные сведения можно найти в [руководстве GitLab по созданию группового приложения](https://docs.gitlab.com/ee/integration/oauth_provider.html#group-owned-applications).

Чтобы создать OAuth-приложение, принадлежащее группе, в GitLab:
1. В GitLab перейдите в настройки своей группы и выберите **Приложения**.

    <Lightbox src="/img/docs/dbt-platform/connecting-gitlab/gitlab nav.gif" title="Навигация по приложениям GitLab"/>

2. При создании группового приложения укажите следующие данные:
    | Поле | Значение |
    | ------ | ----- |
    | **Название** | <Constant name="dbt" /> |
    | **URI перенаправления** | `https://YOUR_ACCESS_URL/complete/gitlab` |
    | **Конфиденциальное** | ✅ |
    | **Области доступа (Scopes)** | ✅ api |

    В поле **URI перенаправления** замените `YOUR_ACCESS_URL` на [соответствующий URL доступа](/docs/platform/about-platform/access-regions-ip-addresses) для вашего региона и тарифного плана.

3. Нажмите **Сохранить приложение**. GitLab создаст **Идентификатор приложения** и **Секрет**. Эти значения остаются доступными даже после закрытия экрана приложения, поэтому вы можете вернуться и сохранить их позже.

Если вы используете тарифный план Business Critical с [ограничениями по IP-адресам](/docs/platform/secure/ip-restrictions), убедитесь, что вы добавили соответствующие диапазоны CIDR GitLab в правила ограничения по IP-адресам, иначе подключение к GitLab не удастся.

### Добавление OAuth‑приложения GitLab в dbt {#adding-the-gitlab-oauth-application-to-dbt}

После создания приложения GitLab добавьте его в <Constant name="dbt" />:

1. В <Constant name="dbt" /> перейдите в **Настройки учетной записи** > **Интеграции**, затем разверните раздел GitLab.
2. Введите следующие значения:
    | Поле | Значение |
    | ------ | ----- |
    | **Экземпляр GitLab** | `https://gitlab.com` |
    | **ID приложения** | *скопируйте значение из приложения GitLab* |
    | **Секрет** | *скопируйте значение из приложения GitLab* |

    Если вы используете самостоятельно размещенный экземпляр GitLab, укажите в поле **Экземпляр GitLab** имя хоста GitLab вашей организации (например, `https://gitlab.yourgreatcompany.com`).

3. Нажмите **Сохранить**.
4. Затем вы будете перенаправлены в GitLab и получите запрос на вход в систему.
5. Когда появится запрос авторизации, выберите вариант авторизации <Constant name="dbt" />.

После подтверждения запроса авторизации вы будете перенаправлены обратно в <Constant name="dbt" />. Теперь интеграция готова, и разработчики вашей команды могут [пройти индивидуальную аутентификацию в GitLab](#personally-authenticating-with-gitlab).

### Персональная аутентификация с GitLab {#personally-authenticating-with-gitlab}

Каждый разработчик <Constant name="dbt" /> на тарифном плане Enterprise или Enterprise+ должен подключить свой профиль GitLab к <Constant name="dbt" />, поскольку права каждого разработчика на чтение/запись в репозитории <Constant name="dbt" /> проверяются в <Constant name="studio_ide" /> или <Constant name="platform_cli" />.

Чтобы подключить личную учетную запись GitLab:

1. В <Constant name="dbt" /> нажмите на название своей учетной записи в меню слева и выберите **Настройки учетной записи**.
2. Выберите **Личный профиль** в разделе **Ваш профиль**.
3. Перейдите в раздел **Связанные учетные записи**.
4. Если ваша учетная запись GitLab не подключена, вы увидите "Нет подключенной учетной записи". Выберите **Связать**, чтобы начать процесс настройки.
5. В GitLab войдите в систему при появлении соответствующего запроса. Когда появится запрос авторизации, выберите вариант авторизации <Constant name="dbt" />.

После подтверждения авторизации вы будете перенаправлены обратно в <Constant name="dbt" />, и там вы должны увидеть подключенную учетную запись. Теперь вы готовы начать разработку в <Constant name="studio_ide" /> или с помощью CLI <Constant name="dbt" />.

## Устранение неполадок {#troubleshooting}

<FAQ path="Troubleshooting/gitlab-webhook"/>
<FAQ path="Troubleshooting/error-importing-repo"/>
<FAQ path="Git/gitignore"/>
<FAQ path="Git/gitlab-authentication"/>
<FAQ path="Git/gitlab-selfhosted"/>
<FAQ path="Git/git-migration"/>
<FAQ path="Git/gitlab-token-refresh" />
