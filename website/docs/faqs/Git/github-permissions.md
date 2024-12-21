---
title: "Я вижу ошибку 'GitHub and dbt Cloud latest permissions'"
description: "Ошибка разрешений GitHub и dbt Cloud"
sidebar_label: "Ошибка разрешений GitHub и dbt Cloud"
---

Если вы видите ошибку `This account needs to accept the latest permissions for the dbt Cloud GitHub App` в dbt Cloud &mdash; это обычно происходит, когда разрешения для приложения dbt Cloud GitHub устарели.

Чтобы решить эту проблему, вам нужно обновить разрешения для приложения dbt Cloud GitHub в вашем аккаунте GitHub. В этом FAQ описаны несколько способов, как это сделать.

## Обновление разрешений

Администратору организации GitHub потребуется обновить разрешения в GitHub для приложения dbt Cloud GitHub. Если вы не администратор, обратитесь к администратору вашей организации с просьбой об этом.

1. Перейдите в свой аккаунт GitHub. Нажмите на значок профиля в правом верхнем углу, затем **Settings** (или личные, если используете неорганизационный аккаунт).

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/github-settings.jpg" width="50%" title="Перейдите в свой аккаунт GitHub, чтобы настроить параметры." />

2. Затем перейдите в **Integrations**, а затем выберите **Applications**, чтобы определить любые необходимые изменения разрешений. Обратите внимание, что администратор репозитория GitHub может не видеть тот же запрос на разрешение.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/github-applications.jpg" width="80%" title="Перейдите в настройки приложений, чтобы определить изменения разрешений." />

3. Нажмите на **Review request**, а затем на следующей странице нажмите кнопку **Accept new permissions**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/github-review-request.jpg" width="80%" title="Предоставьте доступ к приложению dbt Cloud, приняв новые разрешения." />

Для получения дополнительной информации о разрешениях GitHub обратитесь к [доступу к разрешениям](https://docs.github.com/en/get-started/learning-about-github/access-permissions-on-github).

В качестве альтернативы попробуйте [отключить ваш аккаунт GitHub](#disconect-github) в dbt Cloud, как описано в следующем разделе.

## Отключение GitHub

Отключите интеграцию GitHub и dbt Cloud в dbt Cloud.

1. В dbt Cloud перейдите в **Account Settings**.
2. В **Projects** выберите проект, в котором возникла проблема.
3. Нажмите на ссылку репозитория под **Repository**.
4. На странице **Repository details** нажмите **Edit**.
5. Нажмите **Disconnect**, чтобы удалить интеграцию GitHub.
6. Вернитесь на страницу **Project details** и снова подключите ваш репозиторий, нажав на ссылку **Configure Repository**.
7. Настройте ваш репозиторий и нажмите **Save**.

<Lightbox src="/img/docs/dbt-cloud/disconnect-repo.png" title="Отключите и снова подключите ваш git-репозиторий на страницах настроек аккаунта dbt Cloud."/>

## Поддержка
Если вы попробовали эти обходные пути и все еще сталкиваетесь с этой проблемой &mdash; обратитесь в команду [поддержки dbt](mailto:support@getdbt.com), и мы будем рады помочь!