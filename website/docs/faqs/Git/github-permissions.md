---
title: "Я вижу ошибку «GitHub and dbt latest permissions»"
description: "Ошибка прав доступа GitHub и dbt"
sidebar_label: "Ошибка прав доступа GitHub и dbt"
---

Если в <Constant name="dbt" /> вы видите ошибку `This account needs to accept the latest permissions for the dbt GitHub App` &mdash; обычно это означает, что разрешения приложения <Constant name="dbt" /> GitHub App устарели.

Чтобы решить эту проблему, необходимо обновить разрешения приложения <Constant name="dbt" /> GitHub App в вашей учетной записи GitHub. В этом разделе часто задаваемых вопросов описано несколько способов это сделать.

## Обновление разрешений {#update-permissions}

Администратору организации GitHub потребуется обновить разрешения для приложения <Constant name="dbt" /> GitHub App в GitHub. Если вы не являетесь администратором, обратитесь к администратору вашей организации с просьбой сделать это.

1. Перейдите в свой аккаунт GitHub. Нажмите на значок профиля в правом верхнем углу, затем **Settings** (или личные, если используете неорганизационный аккаунт).

2. Затем перейдите в **Integrations**, после чего выберите **Applications**, чтобы определить, требуются ли какие-либо изменения разрешений. Обратите внимание, что администратор репозитория GitHub может видеть другой запрос на разрешения.

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/github-applications.png" width="80%" title="Перейдите в настройки приложения, чтобы определить изменения разрешений." />

3. Нажмите на **Review request**, а затем на следующей странице нажмите кнопку **Accept new permissions**.

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/github-review-request.png" width="80%" title="Предоставьте доступ приложению dbt, приняв новые разрешения." />

Для получения дополнительной информации о разрешениях GitHub обратитесь к [доступу к разрешениям](https://docs.github.com/en/get-started/learning-about-github/access-permissions-on-github).

Также попробуйте [отключить свою учетную запись GitHub](#disconnect-github) в <Constant name="dbt" />, как описано в следующем разделе.

## Отключение GitHub {#disconnect-github}

Отключите интеграцию GitHub с <Constant name="dbt" /> в <Constant name="dbt" />.

1. В <Constant name="dbt" /> перейдите в **Account Settings**.
2. В разделе **Projects** выберите проект, в котором возникла проблема.
3. Нажмите ссылку на репозиторий в разделе **Repository**.
4. На странице **Repository details** нажмите **Edit**.
5. Нажмите **Disconnect**, чтобы отключить интеграцию с GitHub.
        <Lightbox src="/img/docs/dbt-platform/disconnect-repo.png" title="Отключение и повторное подключение Git-репозитория на страницах настроек аккаунта dbt."/>
6. Нажмите **Confirm Disconnect**. 
7. Вернитесь на страницу **Project details** и повторно подключите репозиторий, нажав ссылку **Configure Repository**.
8. Нажмите **GitHub** и выберите свой репозиторий.

## Поддержка {#support}
Если вы попробовали эти обходные пути и все еще сталкиваетесь с этой проблемой &mdash; обратитесь в команду [поддержки dbt](mailto:support@getdbt.com), и мы будем рады помочь!
