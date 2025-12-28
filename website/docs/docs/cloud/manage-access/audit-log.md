---
title: "Журнал аудита для dbt Enterprise"
id: audit-log
description: "Вы можете устранять возможные проблемы и проводить проверки безопасности, просматривая события активности в вашей организации."
sidebar_label: "Журнал аудита"
pagination_next: null
pagination_prev: "docs/cloud/manage-access/about-user-access"
---

# Журнал аудита dbt <Lifecycle status="managed,managed_plus" />

Чтобы просматривать действия, выполняемые пользователями в вашей организации, dbt предоставляет журналы аудита пользовательских и системных событий в режиме реального времени. Журнал аудита обновляется по мере возникновения событий и включает такие сведения, как кто выполнил действие, какое именно действие было выполнено и когда это произошло. Эти данные можно использовать для устранения проблем с доступом, проведения аудитов безопасности или анализа отдельных событий.

Для доступа к журналу аудита необходимо иметь роль **Account Admin** или **Account Viewer**, и эта функция доступна только в тарифных планах Enterprise.

Журнал аудита <Constant name="cloud" /> хранит все события, произошедшие в вашей организации, в реальном времени, включая:

- Для событий за последние 90 дней журнал аудита <Constant name="cloud" /> предоставляет выбираемый диапазон дат со списком сработавших событий.
- Для событий старше 90 дней **Account Admin** и **Account Viewer** могут [экспортировать все события](#exporting-logs), используя **Export All**.

Обратите внимание, что срок хранения событий в журнале аудита составляет не менее 12 месяцев.

## Доступ к журналу аудита

Чтобы открыть журнал аудита, нажмите на имя вашей учетной записи в левом меню и выберите **Account settings**. Затем нажмите **Audit log** в левой боковой панели.

## Понимание журнала аудита

На странице журнала аудита отображается список различных событий и связанных с ними данных. Для каждого события в dbt показывается следующая информация:

* **Event name**: действие, которое было инициировано
* **Agent**: пользователь, который инициировал это действие/событие
* **Timestamp**: локальное время, когда произошло событие

### Детали события

Нажмите на карточку события, чтобы просмотреть подробную информацию о действии, которое привело к его возникновению. В этом представлении отображаются важные детали, включая время и тип события. Например, если кто-то изменил настройки задания, вы можете использовать детали события, чтобы увидеть, какое именно задание было изменено (тип события: `job_definition.Changed`), кем (инициатор события: `actor`) и когда (время срабатывания: `created_at_utc`). Список типов событий и их описания см. в разделе [События в журнале аудита](#audit-log-events).

Детали события включают ключевые параметры события:

| Name                 | Description                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| account_id           | ID учетной записи, в которой произошло событие                              |
| actor                | Исполнитель события — пользователь или сервис                               |
| actor_id             | Уникальный ID исполнителя                                                   |
| actor_ip             | IP-адрес исполнителя                                                        |
| actor_name           | Идентифицирующее имя исполнителя                                            |
| actor_type           | Было ли действие выполнено пользователем или API-запросом                   |
| created_at           | Временная метка UTC, когда произошло событие                                |
| event_type           | Уникальный ключ, идентифицирующий событие                                   |
| event_context        | Значение этого ключа отличается для каждого события и соответствует event_type. Эти данные содержат все детали об объекте (или объектах), которые были изменены |
| id                   | Уникальный ID события                                                       |
| service              | Сервис, который выполнил действие                                            |
| source               | Источник события — UI <Constant name="cloud" /> или API                     |

## События журнала аудита

Журнал аудита поддерживает различные события для разных объектов в <Constant name="cloud" />. Здесь вы найдете события, связанные с аутентификацией, окружениями, заданиями, сервисными токенами, группами, пользователями, проектами, правами доступа, лицензиями, подключениями, репозиториями и учетными данными.

### Authentication

| Event Name                 | Event Type                     | Description                                            |
| -------------------------- | ------------------------------ | ------------------------------------------------------ |
| Auth Provider Changed      | auth_provider.changed          | Изменены настройки провайдера аутентификации           |
| Credential Login Succeeded | login.password.succeeded       | Пользователь успешно вошел с логином и паролем         |
| SSO Login Failed           | login.sso.failed               | Неудачная попытка входа пользователя через SSO         |
| SSO Login Succeeded        | login.sso.succeeded            | Пользователь успешно вошел через SSO                   |

### Environment

| Event Name          | Event Type          | Description                          |
| ------------------- | ------------------- | ------------------------------------ |
| Environment Added   | environment.added   | Новое окружение успешно создано      |
| Environment Changed | environment.changed | Изменены настройки окружения         |
| Environment Removed | environment.removed | Окружение успешно удалено            |

### Jobs

| Event Name  | Event Type             | Description                  |
| ----------- | ---------------------- | ---------------------------- |
| Job Added   | job_definition.added   | Новое задание успешно создано |
| Job Changed | job_definition.changed | Изменены настройки задания   |
| Job Removed | job_definition.removed | Определение задания удалено  |

### Service Token

| Event Name            | Event Type            | Description                                      |
| --------------------- | --------------------- | ------------------------------------------------ |
| Service Token Created | service_token.created | Новый Service Token успешно создан               |
| Service Token Revoked | service_token.revoked | Service Token был отозван                        |

### Group

| Event Name    | Event Type    | Description                          |
| ------------- | ------------- | ------------------------------------ |
| Group Added   | group.added   | Новая группа успешно создана         |
| Group Changed | group.changed | Изменены настройки группы            |
| Group Removed | group.removed | Группа успешно удалена               |

### User

| Event Name                   | Event Type                | Description                                                  |
| ---------------------------- | ------------------------- | ------------------------------------------------------------ |
| Invite Added                 | user.invite.added         | Приглашение пользователя добавлено и отправлено             |
| Invite Redeemed              | user.invite.redeemed      | Пользователь принял приглашение                              |
| User Added to Account        | user.added                | Новый пользователь добавлен в учетную запись                 |
| User Added to Group          | group.user.added          | Существующий пользователь добавлен в группу                 |
| User Removed from Account    | user.removed              | Пользователь удален из учетной записи                        |
| User Removed from Group      | group.user.removed        | Существующий пользователь удален из группы                  |
| User License Created         | user_license.added        | Использована новая пользовательская лицензия                 |
| User License Removed         | user_license.removed      | Пользовательская лицензия удалена из количества мест         |
| Verification Email Confirmed | user.jit.email.confirmed  | Пользователь подтвердил адрес электронной почты              |
| Verification Email Sent      | user.jit.email.sent       | Письмо для подтверждения email отправлено пользователю, созданному через JIT |

### Project

| Event Name      | Event Type      | Description                    |
| --------------- | --------------- | ------------------------------ |
| Project Added   | project.added   | Добавлен новый проект          |
| Project Changed | project.changed | Изменены настройки проекта     |
| Project Removed | project.removed | Проект удален                  |

### Permissions

| Event Name              | Event Type         | Description                         |
| ----------------------- | ------------------ | ----------------------------------- |
| User Permission Added   | permission.added   | Добавлены новые права пользователя  |
| User Permission Removed | permission.removed | Права пользователя удалены          |

### License

| Event Name              | Event Type           | Description                                         |
| ----------------------- | -------------------- | --------------------------------------------------- |
| License Mapping Added   | license_map.added    | Добавлено новое сопоставление пользовательской лицензии |
| License Mapping Changed | license_map.changed  | Изменены настройки сопоставления лицензии           |
| License Mapping Removed | license_map.removed  | Сопоставление лицензии удалено                      |

### Connection

| Event Name         | Event Type         | Description                                      |
| ------------------ | ------------------ | ------------------------------------------------ |
| Connection Added   | connection.added   | Добавлено новое подключение к хранилищу данных   |
| Connection Changed | connection.changed | Изменены настройки подключения к хранилищу данных |
| Connection Removed | connection.removed | Подключение к хранилищу данных удалено           |

### Repository

| Event Name         | Event Type         | Description                         |
| ------------------ | ------------------ | ----------------------------------- |
| Repository Added   | repository.added   | Добавлен новый репозиторий          |
| Repository Changed | repository.changed | Изменены настройки репозитория      |
| Repository Removed | repository.removed | Репозиторий удален                  |

### Credentials

| Event Name                       | Event Type          | Description                                 |
| -------------------------------- | ------------------- | ------------------------------------------- |
| Credentials Added to Project     | credentials.added   | Учетные данные добавлены в проект           |
| Credentials Changed in Project   | credentials.changed | Учетные данные изменены в проекте           |
| Credentials Removed from Project | credentials.removed | Учетные данные удалены из проекта           |

### Git integration

| Event Name                | Event Type                 | Description                                      |
| ------------------------- | -------------------------- | ------------------------------------------------ |
| GitLab Application Changed| gitlab_application.changed | Изменена конфигурация GitLab в <Constant name="cloud" /> |

### Webhooks

| Event Name                    | Event Type                   | Description                                         |
| ----------------------------- | ---------------------------- | --------------------------------------------------- |
| Webhook Subscriptions Added   | webhook_subscription.added   | Новый webhook настроен в параметрах                 |
| Webhook Subscriptions Changed | webhook_subscription.changed | Изменена существующая конфигурация webhook         |
| Webhook Subscriptions Removed | webhook_subscription.removed | Существующий webhook удален                         |

### Semantic Layer

| Event Name                            | Event Type                          | Description                                                                 |
| ------------------------------------ | ----------------------------------- | --------------------------------------------------------------------------- |
| Semantic Layer Config Added           | semantic_layer_config.added         | Добавлена конфигурация <Constant name="semantic_layer" />                    |
| Semantic Layer Config Changed         | semantic_layer_config.changed       | Изменена конфигурация <Constant name="semantic_layer" /> (не связанная с учетными данными) |
| Semantic Layer Config Removed         | semantic_layer_config.removed       | Конфигурация <Constant name="semantic_layer" /> удалена                     |
| Semantic Layer Credentials Added      | semantic_layer_credentials.added    | Добавлены учетные данные <Constant name="semantic_layer" />                 |
| Semantic Layer Credentials Changed    | semantic_layer_credentials.changed  | Изменены учетные данные <Constant name="semantic_layer" />. Не вызывает semantic_layer_config.changed |
| Semantic Layer Credentials Removed    | semantic_layer_credentials.removed  | Учетные данные <Constant name="semantic_layer" /> удалены                   |

### Extended attributes

| Event Name                 | Event Type                  | Description                                      |
| -------------------------- | --------------------------- | ------------------------------------------------ |
| Extended Attribute Added   | extended_attributes.added   | Расширенный атрибут добавлен в проект            |
| Extended Attribute Changed | extended_attributes.changed | Расширенный атрибут изменен или удален           |

### Account-scoped personal access token

| Event Name                                   | Event Type                 | Description                                     |
| -------------------------------------------- | -------------------------- | ----------------------------------------------- |
| Account Scoped Personal Access Token Created | account_scoped_pat.created | Создан PAT с областью действия на уровне аккаунта |
| Account Scoped Personal Access Token Deleted | account_scoped_pat.deleted | PAT с областью действия на уровне аккаунта удален |

### IP restrictions

| Event Name                   | Event Type                   | Description                                         |
| ---------------------------- | ---------------------------- | --------------------------------------------------- |
| IP Restrictions Toggled      | ip_restrictions.toggled      | Функция IP-ограничений включена или отключена       |
| IP Restrictions Rule Added   | ip_restrictions.rule.added   | Создано правило IP-ограничений                      |
| IP Restrictions Rule Changed | ip_restrictions.rule.changed | Отредактировано правило IP-ограничений              |
| IP Restrictions Rule Removed | ip_restrictions.rule.removed | Правило IP-ограничений удалено                      |

### SCIM

| Event Name       | Event Type                          | Description                                      |
| ---------------- | ----------------------------------- | ------------------------------------------------ |
| User Creation    | v1.events.account.UserAdded         | Новый пользователь создан сервисом SCIM         |
| User Update      | v1.events.account.UserUpdated       | Запись пользователя обновлена сервисом SCIM     |
| User Removal     | v1.events.account.UserRemoved       | Пользователь удален сервисом SCIM                |
| Group Creation   | v1.events.user_group.Added          | Новая группа создана сервисом SCIM               |
| Group Update     | v1.events.user_group_user.Changed   | Состав группы обновлен сервисом SCIM             |
| Group Removal    | v1.events.user_group.Removed        | Группа удалена сервисом SCIM                     |

## Поиск в журнале аудита

Вы можете выполнять поиск в журнале аудита, чтобы найти конкретное событие или исполнителя. Поиск ограничен событиями, перечисленными в разделе [Events in audit log](#events-in-audit-log). Журнал аудита успешно отображает исторические события за последние 90 дней. Вы можете искать по исполнителю или событию с помощью строки поиска, а затем сузить результаты, используя временной диапазон.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/audit-log-search.png" width="95%" title="Использование строки поиска для поиска данных в журнале аудита"/>

## Экспорт журналов

Вы можете использовать журнал аудита для экспорта всех исторических результатов аудита в целях безопасности, соответствия требованиям и анализа. События в журнале аудита хранятся не менее 12 месяцев.

- **Для событий за последние 90 дней** — <Constant name="cloud" /> автоматически отображает выбираемый 90-дневный диапазон дат. Выберите **Export Selection**, чтобы скачать CSV-файл со всеми событиями, произошедшими в вашей организации за этот период.

- **Для событий старше 90 дней** — выберите **Export All**. Account Admin или Account Viewer получит ссылку по электронной почте для загрузки CSV-файла со всеми событиями, произошедшими в вашей организации.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/audit-log-section.png" width="95%" title="Просмотр параметров экспорта журнала аудита"/>
