---
title: "Я вижу ошибку «GitHub and dbt latest permissions»"
description: "Ошибка прав доступа GitHub и dbt"
sidebar_label: "Ошибка прав доступа GitHub и dbt"
---

Если вы видите ошибку `This account needs to accept the latest permissions for the dbt GitHub App` в <Constant name="cloud" /> — как правило, это означает, что права доступа для GitHub App <Constant name="cloud" /> устарели.

Чтобы решить эту проблему, вам нужно обновить права доступа для GitHub App <Constant name="cloud" /> в вашей учетной записи GitHub. В этом FAQ описаны несколько способов, как это можно сделать.

## Обновление разрешений {#update-permissions}

Администратору организации GitHub потребуется обновить разрешения в GitHub для GitHub App <Constant name="cloud" />. Если вы не являетесь администратором, обратитесь к администратору вашей организации с просьбой сделать это.

1. Перейдите в свой аккаунт GitHub. Нажмите на значок профиля в правом верхнем углу, затем **Settings** (или личные, если используете неорганизационный аккаунт).

2. Затем перейдите в **Integrations**, после чего выберите **Applications**, чтобы определить, требуются ли какие-либо изменения разрешений. Обратите внимание, что администратор репозитория GitHub может видеть другой запрос на разрешения.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/github-applications.png" width="80%" title="Перейдите в настройки приложения, чтобы определить изменения разрешений." />

3. Нажмите на **Review request**, а затем на следующей странице нажмите кнопку **Accept new permissions**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/github-review-request.png" width="80%" title="Предоставьте доступ приложению dbt, приняв новые разрешения." />

Для получения дополнительной информации о разрешениях GitHub обратитесь к [доступу к разрешениям](https://docs.github.com/en/get-started/learning-about-github/access-permissions-on-github).

В качестве альтернативы попробуйте [отключить ваш аккаунт GitHub](#disconnect-github) в <Constant name="cloud" />, как описано в следующем разделе.

## Отключение GitHub {#disconnect-github}

Отключите интеграцию GitHub и <Constant name="cloud" /> в <Constant name="cloud" />.

1. В <Constant name="cloud" /> перейдите в **Account Settings**.
2. В разделе **Projects** выберите проект, в котором возникла проблема.
3. Нажмите на ссылку репозитория в разделе **Repository**.
4. На странице **Repository details** нажмите **Edit**.
5. Нажмите **Disconnect**, чтобы удалить интеграцию с GitHub.
        <Lightbox src="/img/docs/dbt-cloud/disconnect-repo.png" title="Отключите и повторно подключите ваш git-репозиторий на страницах настроек учетной записи dbt."/>
6. Нажмите **Confirm Disconnect**.
7. Вернитесь на страницу **Project details** и подключите репозиторий заново, нажав ссылку **Configure Repository**.
8. Нажмите **GitHub** и выберите нужный репозиторий.

## Поддержка {#support}
Если вы попробовали эти обходные пути и все еще сталкиваетесь с этой проблемой &mdash; обратитесь в команду [поддержки dbt](mailto:support@getdbt.com), и мы будем рады помочь!
