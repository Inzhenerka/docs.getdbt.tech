---
title: "Подключение к Azure DevOps"
id: "connect-azure-devops"
pagination_next: "docs/cloud/git/setup-service-principal"
---

# Подключение к Azure DevOps <Lifecycle status="managed,managed_plus" />

<Snippet path="available-enterprise-tier-only" />


## Об Azure DevOps и dbt

Подключите ваш облачный аккаунт Azure DevOps в <Constant name="cloud" />, чтобы получить доступ к новым возможностям продукта:

- Импортируйте новые репозитории Azure DevOps в пару кликов во время настройки проекта <Constant name="cloud" />.
- Клонируйте репозитории по HTTPS вместо SSH.
- Обеспечьте авторизацию пользователей через OAuth 2.0.
- Пробрасывайте права пользователя Azure DevOps на репозиторий (read / write) в git-действия <Constant name="cloud_ide" /> или <Constant name="cloud" /> CLI.
- Запускайте сборки Continuous integration (CI) при открытии pull requests в Azure DevOps.


Сейчас существует несколько способов интегрировать Azure DevOps с <Constant name="cloud" />. Следующие варианты доступны для всех аккаунтов:

- [**Service principal (рекомендуется)**](/docs/cloud/git/setup-service-principal)
- [**Service user (legacy)**](/docs/cloud/git/setup-service-user)
- [**Миграция с service user на service principal**](/docs/cloud/git/setup-service-principal#migrate-to-service-principal)

Независимо от выбранного подхода, чтобы завершить интеграцию, вам понадобятся администраторы для <Constant name="cloud" />, Azure Entra ID и Azure DevOps. Подробнее следуйте руководству по настройке, которое подходит именно вам.
