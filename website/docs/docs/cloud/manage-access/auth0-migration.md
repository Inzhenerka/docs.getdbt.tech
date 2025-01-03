---
title: "Миграция на Auth0 для SSO"
id: "auth0-migration"
sidebar: "SSO Auth0 Migration"
description: "Необходимые действия для миграции на Auth0 для SSO-сервисов в dbt Cloud."
---

dbt Labs сотрудничает с Auth0 для улучшения возможностей единого входа (SSO) в dbt Cloud. Auth0 — это платформа управления идентификацией и доступом (IAM) с расширенными функциями безопасности, которая будет использоваться в dbt Cloud. Эти изменения потребуют некоторых действий от клиентов, у которых сегодня настроен SSO в dbt Cloud, и это руководство опишет необходимые изменения для каждой среды.

Если вы еще не настроили SSO в dbt Cloud, обратитесь к нашим руководствам по настройке для [SAML](/docs/cloud/manage-access/set-up-sso-saml-2.0), [Okta](/docs/cloud/manage-access/set-up-sso-okta), [Google Workspace](/docs/cloud/manage-access/set-up-sso-google-workspace) или [Microsoft Entra ID (ранее Azure AD)](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id).

## Начало миграции

Функция миграции на Auth0 постепенно внедряется для клиентов, у которых уже включены функции SSO. Когда опция миграции будет доступна в вашей учетной записи, вы увидите **Доступны обновления SSO** на правой стороне панели меню, рядом с иконкой настроек.

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-migration-available.png" title="Миграция SSO доступна"/>

Кроме того, вы можете начать процесс с **Настроек** в разделе **Единый вход**. Нажмите кнопку **Начать миграцию**, чтобы начать.

<Lightbox src="/img/docs/dbt-cloud/access-control/begin-migration.png" title="Начать миграцию"/>

После того как вы выбрали начало процесса миграции, следующие шаги будут варьироваться в зависимости от настроенного провайдера идентификации. Вы можете просто перейти к разделу, который подходит для вашей среды. Эти шаги применимы только к клиентам, проходящим миграцию; новые настройки будут использовать существующие [инструкции по настройке](/docs/cloud/manage-access/sso-overview).

:::warning Логин \{slug\}

Слоги должны содержать только буквы, цифры и дефисы. Убедитесь, что вы удалили подчеркивания (если они есть) из слогов логина:
* до миграции на странице **Настройки учетной записи**, или
* во время миграции (до включения), как показано на скриншотах миграции аутентификации для вашей настройки.
После изменения слога администраторы должны поделиться новым URL для входа с пользователями dbt Cloud.

:::

## SAML 2.0 и Okta

Пользователи SAML 2.0 должны обновить несколько полей в конфигурации приложения SSO, чтобы они соответствовали новому URL и URI Auth0. Вы можете сделать это, отредактировав существующие настройки приложения SSO или создав новое для учета настроек Auth0. Один подход не является априори лучше другого, поэтому вы можете выбрать тот, который лучше всего подходит для вашей организации.

Поля, которые будут обновлены:
- URL единого входа &mdash; `https://<YOUR_AUTH0_URI>/login/callback?connection={slug}`
- URI аудитории (SP Entity ID) &mdash; `urn:auth0:<YOUR_AUTH0_ENTITYID>:{slug}`

Ниже приведены примерные шаги для обновления. Вы должны выполнить все из них, чтобы обеспечить непрерывный доступ к dbt Cloud, и вам следует координировать эти изменения с администратором вашего провайдера идентификации.

1. Замените `{slug}` на слог логина вашей организации. Он должен быть уникальным для всех экземпляров dbt Cloud и обычно представляет собой что-то вроде названия вашей компании, разделенного дефисами (например, `dbt-labs`).

Вот пример обновленной настройки SAML 2.0 в Okta.

<Lightbox src="/img/docs/dbt-cloud/access-control/new-okta-config.png" title="Конфигурация Okta с новым URL"/>

2. Сохраните конфигурацию, и ваши настройки SAML будут выглядеть примерно так:

<Lightbox src="/img/docs/dbt-cloud/access-control/new-okta-completed.png" title="Новая конфигурация Okta завершена"/>

3. Переключите опцию `Enable new SSO authentication`, чтобы обеспечить правильную маршрутизацию трафика. _Новое действие миграции SSO является окончательным и не может быть отменено_

<Lightbox src="/img/docs/dbt-cloud/access-control/saml-enable.png" title="Включить новый SSO для SAML/Okta"/>

4. Сохраните настройки и протестируйте новую конфигурацию, используя URL для входа SSO, предоставленный на странице настроек.

## Google Workspace

Администраторам Google Workspace, обновляющим свои SSO API с URL Auth0, не придется делать много, если это существующая настройка. Это можно сделать как новый проект или отредактировав существующую настройку SSO. Дополнительные области не требуются, так как это миграция из существующей настройки. Все области были определены во время первоначальной конфигурации.

Ниже приведены шаги для обновления. Вы должны выполнить все из них, чтобы обеспечить непрерывный доступ к dbt Cloud, и вам следует координировать эти изменения с администратором вашего провайдера идентификации.

1. Откройте [консоль Google Cloud](https://console.cloud.google.com/) и выберите проект с вашими настройками единого входа dbt Cloud. На странице проекта **Быстрый доступ** выберите **API и сервисы**

<Lightbox src="/img/docs/dbt-cloud/access-control/google-cloud-sso.png" title="Консоль Google Cloud"/>

2. Нажмите **Учетные данные** в левой панели и выберите соответствующее имя из **OAuth 2.0 Client IDs**

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-project.png" title="Выберите OAuth 2.0 Client ID"/>

3. В окне **Client ID for Web application** найдите поле **Authorized Redirect URIs** и нажмите **Add URI**, затем введите `https://<YOUR_AUTH0_URI>/login/callback`.

Нажмите **Сохранить**, когда закончите.

<Lightbox src="/img/docs/dbt-cloud/access-control/google-uri.png" title="Добавить Redirect URI"/>

4. _Вам понадобится человек с правами администратора Google Workspace, чтобы завершить эти шаги в dbt Cloud_. В dbt Cloud перейдите в **Настройки учетной записи**, нажмите на **Единый вход**, затем нажмите **Редактировать** справа от панели SSO. Переключите опцию **Enable New SSO Authentication** и выберите **Сохранить**. Это вызовет окно авторизации от Google, которое потребует учетные данные администратора. _Действие миграции является окончательным и не может быть отменено_. После прохождения аутентификации протестируйте новую конфигурацию, используя URL для входа SSO, предоставленный на странице настроек.

:::warning Авторизация домена

Вы должны завершить авторизацию домена до того, как переключите `Enable New SSO Authentication`, иначе миграция не будет успешно завершена.

:::

<Lightbox src="/img/docs/dbt-cloud/access-control/google-enable.png" title="Включить новый SSO для Google Workspace"/>

## Microsoft Entra ID

Администраторам Microsoft Entra ID потребуется внести небольшие изменения в существующее приложение аутентификации в портале Azure. Эта миграция не требует удаления или воссоздания всего приложения; вы можете отредактировать существующее приложение. Начните с открытия портала Azure и перехода к обзору Microsoft Entra ID.

Ниже приведены шаги для обновления. Вы должны выполнить все из них, чтобы обеспечить непрерывный доступ к dbt Cloud, и вам следует координировать эти изменения с администратором вашего провайдера идентификации.

1. Нажмите **Регистрация приложений** в левом меню.

<Lightbox src="/img/docs/dbt-cloud/access-control/aad-app-registration.png" title="Выберите Регистрация приложений"/>

2. Выберите соответствующее приложение **dbt Cloud** (название может варьироваться) из списка. На странице обзора приложения нажмите на гиперссылку рядом с **Redirect URI**

<Lightbox src="/img/docs/dbt-cloud/access-control/app-overview.png" title="Нажмите на гиперссылку Redirect URI"/>

3. В панели **Web** с **Redirect URIs** нажмите **Add URI** и введите соответствующий `https://<YOUR_AUTH0_URI>/login/callback`. Сохраните настройки и убедитесь, что они учтены в обновленном обзоре приложения.

<Lightbox src="/img/docs/dbt-cloud/access-control/redirect-URI.png" title="Введите новый redirect URI"/>

4. Перейдите в среду dbt Cloud и откройте **Настройки учетной записи**. Нажмите на опцию **Единый вход** в левом меню и нажмите **Редактировать** справа от панели SSO. Поле **домен** — это домен, который ваша организация использует для входа в Microsoft Entra ID. Переключите опцию **Enable New SSO Authentication** и **Сохранить**. _Как только эта опция будет включена, она не может быть отменена._

:::warning Авторизация домена

Вы должны завершить авторизацию домена до того, как переключите `Enable New SSO Authentication`, иначе миграция не будет успешно завершена.

:::

<Lightbox src="/img/docs/dbt-cloud/access-control/azure-enable.png" title="Включить новый SSO"/>