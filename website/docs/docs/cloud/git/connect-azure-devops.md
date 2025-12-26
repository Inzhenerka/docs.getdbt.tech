---
title: "Подключение к Azure DevOps"
id: "connect-azure-devops"
pagination_next: "docs/cloud/git/setup-service-principal"
---

# Подключение к Azure DevOps <Lifecycle status="managed,managed_plus" />

<Snippet path="available-enterprise-tier-only" />

## О Azure DevOps и dbt Cloud

## Об Azure DevOps и dbt

Подключите свой облачный аккаунт Azure DevOps в <Constant name="cloud" />, чтобы получить доступ к новым возможностям продукта:

- Импортируйте новые репозитории Azure DevOps всего за пару кликов во время настройки проекта <Constant name="cloud" />.
- Клонируйте репозитории с использованием HTTPS вместо SSH.
- Обеспечьте авторизацию пользователей с помощью OAuth 2.0.
- Передавайте пользовательские права доступа к репозиториям Azure DevOps (чтение / запись) в git‑действия <Constant name="cloud_ide" /> или CLI <Constant name="cloud" />.
- Запускайте сборки непрерывной интеграции (CI) при открытии pull request’ов в Azure DevOps.

1. Администратор с ролью Entra ID (или ролью с соответствующими разрешениями) должен [настроить приложение Active Directory](/docs/cloud/git/setup-azure#register-an-azure-ad-app).
2. Администратор Azure DevOps должен [подключить учетные записи](/docs/cloud/git/setup-azure#connect-azure-devops-to-your-new-app).
3. Администратор учетной записи dbt Cloud должен [добавить приложение в dbt Cloud](/docs/cloud/git/setup-azure#add-your-azure-ad-app-to-dbt-cloud).
4. Разработчики dbt Cloud должны [лично аутентифицироваться с Azure DevOps](/docs/cloud/git/authenticate-azure) из dbt Cloud.

В настоящее время существует несколько способов интеграции Azure DevOps с <Constant name="cloud" />. Следующие методы доступны для всех аккаунтов:

- [**Service principal (рекомендуется)**](/docs/cloud/git/setup-service-principal)
- [**Service user (устаревший вариант)**](/docs/cloud/git/setup-service-user)
- [**Миграция с service user на service principal**](/docs/cloud/git/setup-service-principal#migrate-to-service-principal)

Независимо от выбранного подхода, для завершения интеграции вам потребуются администраторы в <Constant name="cloud" />, Azure Entra ID и Azure DevOps. Для получения дополнительной информации следуйте руководству по настройке, которое соответствует вашему сценарию.
