---
title: "Подключение к Azure DevOps"
id: "connect-azure-devops"
pagination_next: "docs/cloud/git/setup-azure"
---

# Подключение к Azure DevOps <Lifecycle status="enterprise" />

<Snippet path="available-enterprise-tier-only" />

## О Azure DevOps и dbt Cloud

Подключите вашу учетную запись Azure DevOps в dbt Cloud, чтобы получить доступ к новым возможностям продукта:

- Импортируйте новые репозитории Azure DevOps в несколько кликов во время настройки проекта в dbt Cloud.
- Клонируйте репозитории с использованием HTTPS вместо SSH.
- Обеспечьте авторизацию пользователей с помощью OAuth 2.0.
- Переносите разрешения пользователей репозитория Azure DevOps (доступ на чтение/запись) в dbt Cloud IDE или dbt Cloud CLI для действий с git.
- Запускайте сборки непрерывной интеграции (CI) при открытии pull-запросов в Azure DevOps.

Чтобы подключить Azure DevOps в dbt Cloud:

1. Администратор с ролью Entra ID (или ролью с соответствующими разрешениями) должен [настроить приложение Active Directory](/docs/cloud/git/setup-azure#register-an-azure-ad-app).
2. Администратор Azure DevOps должен [подключить учетные записи](/docs/cloud/git/setup-azure#connect-azure-devops-to-your-new-app).
3. Администратор учетной записи dbt Cloud должен [добавить приложение в dbt Cloud](/docs/cloud/git/setup-azure#add-your-azure-ad-app-to-dbt-cloud).
4. Разработчики dbt Cloud должны [лично аутентифицироваться с Azure DevOps](/docs/cloud/git/authenticate-azure) из dbt Cloud.

Если вы являетесь клиентом с критически важным бизнесом, использующим [ограничения по IP](/docs/cloud/secure/ip-restrictions), убедитесь, что вы добавили соответствующие CIDR-диапазоны Azure DevOps в ваши правила ограничения по IP, иначе подключение к Azure DevOps не удастся.