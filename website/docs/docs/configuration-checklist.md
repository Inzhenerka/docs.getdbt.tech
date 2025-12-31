---
title: Чеклист конфигурации dbt platform
id: configuration-checklist
description: "Ваш список дел для настройки аккаунта dbt platform"
sidebar_label: "Чеклист конфигурации dbt platform"
pagination_next: null
pagination_prev: null
---

# Чеклист конфигурации dbt platform <Lifecycle status="self_service,managed,managed_plus" /> {#dbt-platform-configuration-checklist}

Итак, вы создали новый облачный аккаунт dbt platform и готовы начать знакомство с его быстрыми и интуитивно понятными возможностями. Добро пожаловать! Прежде чем приступить к работе, давайте убедимся, что ваш аккаунт настроен корректно — это позволит без проблем подключать новых пользователей и использовать все интеграции, которые предлагает dbt.

Для большинства организаций на этом этапе потребуется взаимодействие с IT‑специалистами и/или командой безопасности. В зависимости от используемых возможностей, вам может понадобиться помощь следующих административных ролей:
- Хранилище данных (Snowflake, BigQuery, Databricks и т.д.)
- Управление доступом (Okta, Entra ID, Google, SAML 2.0)
- Git (GitHub, GitLab, Azure DevOps и т.д.)

Этот чек-лист поможет убедиться, что всё настроено правильно, чтобы вы могли быстро начать работу и избежать узких мест.

## Хранилище данных {#data-warehouse}

dbt platform поддерживает [глобальные подключения](/docs/cloud/connect-data-platform/about-connections#connection-management) к хранилищам данных. Это означает, что одно настроенное подключение может использоваться в нескольких проектах и окружениях. dbt platform поддерживает несколько подключений к хранилищам данных, включая (но не ограничиваясь) BigQuery, Databricks, Redshift и Snowflake. Один из самых ранних шагов настройки аккаунта — убедиться, что подключение к хранилищу данных работает корректно:

- [ ] Используйте [документацию по настройке подключений](/docs/cloud/connect-data-platform/about-connections), чтобы сконфигурировать выбранное хранилище данных.  
- [ ] Убедитесь, что dbt‑разработчики имеют необходимые роли и доступы в вашем хранилище данных.  
- [ ] Проверьте, что в хранилище есть реальные данные, к которым можно обращаться. Это могут быть как продакшн‑, так и девелопмент‑данные. При желании вы можете использовать наш песочничный e‑commerce‑проект [The Jaffle Shop](https://github.com/dbt-labs/jaffle-shop), который включает тестовые данные и готовые к запуску модели.  
- [ ] Независимо от того, начинаете ли вы новый проект или импортируете существующий dbt Core проект, убедитесь, что у вас настроена [корректная структура проекта](/docs/build/projects).
    - [ ] Если вы мигрируете с Core, есть несколько важных моментов, о которых стоит знать — ознакомьтесь с нашим [руководством по миграции](/guides/core-cloud-2?step=1).  
- [ ] Пользователям необходимо [настроить свои учетные данные](/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-cloud-ide) для подключения к dev‑окружению в dbt Studio IDE.
    - [ ] Убедитесь, что всем пользователям, которым нужен доступ к работе в IDE, в аккаунте назначена [лицензия разработчика](/docs/cloud/manage-access/seats-and-users).  
- [ ] Модели dbt в основном пишутся в виде [SELECT‑запросов](/docs/build/sql-models), поэтому одним из первых критериев успеха является выполнение простого select‑запроса в IDE и проверка результатов.
    - [ ] Также можно проверить подключение, выполнив базовые SQL‑запросы с помощью [dbt Insights](/docs/explore/access-dbt-insights).  
- [ ] Создайте одну модель и убедитесь, что вы можете успешно [запустить её](/reference/dbt-commands).
    - [ ] Для простого интерфейса с drag‑and‑drop попробуйте создать модель с помощью [dbt Canvas](/docs/cloud/canvas).  
- [ ] Создайте сервисный аккаунт с корректными правами доступа для ваших [production jobs](/docs/deploy/jobs).

## Настройка Git {#git-configuration}

Git является основой большинства dbt‑окружений. Именно в Git‑репозиториях хранятся файлы dbt‑проекта, и именно там разработчики совместно работают над кодом и управляют версиями.

- [ ] Настройте [Git‑репозиторий](/docs/cloud/git/git-configuration-in-dbt-cloud) для вашего аккаунта. dbt поддерживает интеграции с:
    - [GitHub](/docs/cloud/git/connect-github)
    - [GitLab](/docs/cloud/git/connect-gitlab)
    - [Azure DevOps](/docs/cloud/git/connect-azure-devops)
    - Другими провайдерами через [Git clone](/docs/cloud/git/import-a-project-by-git-url)
    - Если вы пока не готовы интегрироваться с существующим Git‑решением, dbt может предоставить [управляемый Git‑репозиторий](/docs/cloud/git/managed-repository).  
- [ ] Убедитесь, что разработчики могут [checkout](/docs/cloud/git/version-control-basics#git-overview) новую ветку в репозитории.  
- [ ] Убедитесь, что разработчики в IDE могут [commit‑ить изменения](/docs/cloud/studio-ide/ide-user-interface#basic-layout).

## Окружения и job-ы {#environments-and-jobs}

[Environments](/docs/environments-in-dbt) позволяют разделять данные разработки и продакшена. dbt поддерживает два типа окружений: Development и Deployment. Существует три типа Deployment‑окружений:
- Production — одно на проект  
- Staging — одно на проект  
- General — несколько на проект  

Кроме того, в каждом проекте может быть только одно `Development`‑окружение, но у каждого разработчика будет собственный изолированный доступ к IDE, независимый от работы других разработчиков.

[Jobs](/docs/deploy/jobs) определяют, какие команды выполняются в окружениях. Они могут запускаться вручную, по расписанию, другими job‑ами, через API или при создании либо слиянии pull request.

После подключения хранилища данных и завершения интеграции с Git можно переходить к настройке окружений и job‑ов:

- [ ] Начните с создания нового [Development environment](/docs/dbt-cloud-environments#create-a-development-environment) для проекта.  
- [ ] Создайте [Production Deployment environment](/docs/deploy/deploy-environments).
    - [ ] (Опционально) Создайте дополнительное Staging или General окружение.  
- [ ] [Создайте и запланируйте](/docs/deploy/deploy-jobs#create-and-schedule-jobs) deployment job.
    - [ ] Для проверки сначала запустите job вручную.  
- [ ] При необходимости настройте разные базы данных для разных окружений.

## Пользовательский доступ {#user-access}

dbt platform предоставляет широкий набор инструментов управления доступом, которые позволяют предоставлять и отзывать доступ пользователей, настраивать RBAC, а также назначать лицензии и разрешения.

- [ ] Вручную [пригласите пользователей](/docs/cloud/manage-access/invite-users) в dbt platform — они смогут аутентифицироваться с использованием [MFA (SMS или приложение‑аутентификатор)](/docs/cloud/manage-access/mfa).  
- [ ] Настройте [single sign‑on или OAuth](/docs/cloud/manage-access/sso-overview) для расширенного управления доступом. Только для аккаунтов <Lifecycle status="managed,managed_plus" />.  
    - [ ] Создайте [SSO mappings](/docs/cloud/manage-access/about-user-access#sso-mappings-) для групп.  
- [ ] Настройте [System for Cross-Domain Identity Management (SCIM)](/docs/cloud/manage-access/scim), если он поддерживается вашим IdP.  
- [ ] Убедитесь, что приглашенные пользователи могут подключаться к хранилищу данных из своего персонального профиля.  
- [ ] [Создайте группы](/docs/cloud/manage-access/about-user-access#create-new-groups-) с детально настроенными наборами разрешений.  
- [ ] Создайте [RBAC rules](https://docs.getdbt.com/docs/cloud/manage-access/about-user-access#role-based-access-control-), чтобы автоматически назначать пользователей в группы и permission sets при входе в систему. Только для аккаунтов <Lifecycle status="managed,managed_plus" />.  
- [ ] Включите обязательное использование SSO для всех не‑администраторов и MFA для всех входов по паролю.

## Продолжайте {#continue-the-journey}

После завершения этого чек-листа вы будете готовы начать работу с dbt platform, но на этом путь только начинается. Ознакомьтесь с дополнительными ресурсами, которые помогут вам дальше:

- [ ] Изучите [guides](/guides) — это быстрые руководства по началу работы с проектами и возможностями.  
- [ ] Пройдите практический курс [dbt Learn](https://learn.getdbt.com/catalog).  
- [ ] Ознакомьтесь с нашими [best practices](/best-practices), где собраны практические рекомендации по структуре и деплою dbt‑проектов.  
- [ ] Разберитесь с [references](/reference/references-overview) — это своего рода словарь продукта с подробными примерами реализации.
