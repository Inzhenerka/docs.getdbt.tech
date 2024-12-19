---
title: "Подключение к Azure DevOps"
id: "connect-azure-devops"
pagination_next: "docs/cloud/git/setup-azure"
---

# Подключение к Azure DevOps <Lifecycle status="enterprise" />

<Snippet path="available-enterprise-tier-only" />

## О Azure DevOps и dbt Cloud

Подключите свою учетную запись Azure DevOps в dbt Cloud, чтобы открыть новые возможности продукта:

- Импортируйте новые репозитории Azure DevOps всего за несколько кликов во время настройки проекта dbt Cloud.
- Клонируйте репозитории с использованием HTTPS вместо SSH.
- Обеспечьте авторизацию пользователей с помощью OAuth 2.0.
- Перенесите разрешения на репозитории пользователей Azure DevOps (доступ на чтение / запись) в git-действия dbt Cloud IDE или dbt Cloud CLI.
- Запускайте сборки непрерывной интеграции (CI), когда в Azure DevOps открываются запросы на слияние.

Чтобы подключить Azure DevOps в dbt Cloud:

1. Администратор роли Entra ID (или роль с соответствующими правами) должен [настроить приложение Active Directory](/docs/cloud/git/setup-azure#register-an-azure-ad-app).
2. Администратор Azure DevOps должен [подключить учетные записи](/docs/cloud/git/setup-azure#connect-azure-devops-to-your-new-app).
3. Администратор учетной записи dbt Cloud должен [добавить приложение в dbt Cloud](/docs/cloud/git/setup-azure#add-your-azure-ad-app-to-dbt-cloud).
4. Разработчики dbt Cloud должны [лично аутентифицироваться в Azure DevOps](/docs/cloud/git/authenticate-azure) из dbt Cloud.

Если вы являетесь клиентом Business Critical, использующим [ограничения IP](/docs/cloud/secure/ip-restrictions), убедитесь, что вы добавили соответствующие CIDR-адреса Azure DevOps в свои правила ограничения IP, иначе подключение к Azure DevOps не будет успешным.