---
title: "Единый вход, SCIM и OAuth"
description: "Обзор возможностей SSO, SCIM и OAuth для аутентификации и управления доступом на платформе dbt."
id: "sso-oauth-intro"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Единый вход и OAuth 

В этом разделе описывается, как аутентифицировать пользователей и подключать платформы данных в <Constant name="dbt_platform" /> с помощью:

<!-- no toc -->
- [Единого входа (SSO)](#sso)
- [Системы междоменного управления идентификацией (SCIM)](#scim)
- [OAuth для подключений](#connection-oauth)

Эти функции доступны в тарифных планах Enterprise и Enterprise+ и обычно настраиваются администраторами аккаунта или специалистами по безопасности.

## SSO

Позволяет пользователям входить в <Constant name="dbt" /> через вашего поставщика удостоверений (IdP), а не с помощью пароля. Поддерживает создание учетных записей при первом входе (Just-in-Time) и вход, инициируемый IdP. *Для администраторов, настраивающих Okta, Microsoft Entra ID, Google Workspace или SAML 2.0.*

- [Обзор единого входа (SSO)](/docs/platform/manage-access/sso-overview) &mdash; Принцип работы SSO и предварительные требования
- [Переход на Auth0 для SSO](/docs/platform/manage-access/auth0-migration)
- [Настройка SSO с SAML 2.0](/docs/platform/manage-access/set-up-sso-saml-2.0)
- [Настройка SSO с Okta](/docs/platform/manage-access/set-up-sso-okta)
- [Настройка SSO с Google Workspace](/docs/platform/manage-access/set-up-sso-google-workspace)
- [Настройка SSO с Microsoft Entra ID](/docs/platform/manage-access/set-up-sso-microsoft-entra-id)

## SCIM

Автоматизирует создание и управление пользователями и группами в <Constant name="dbt" /> на основе данных из вашего IdP (а при использовании Okta — также назначение лицензий). *Для администраторов, использующих Okta или Microsoft Entra ID и желающих синхронизировать пользователей и группы.*

- [Настройка SCIM](/docs/platform/manage-access/scim) &mdash; Предварительные требования и включение SCIM в <Constant name="dbt" />
- [Настройка SCIM с Okta](/docs/platform/manage-access/scim-okta) (включает [управление лицензиями](/docs/platform/manage-access/scim-manage-user-licenses))
- [Настройка SCIM с Entra ID](/docs/platform/manage-access/scim-entra-id)

## OAuth для подключений {#connection-oauth}

OAuth для подключений используется для аутентификации на вашей платформе данных (например, Snowflake или BigQuery), в отличие от SSO, который отвечает за вход пользователей в <Constant name="dbt_platform" />. Он позволяет разработчикам авторизовать доступ к платформе данных со своей учетной записью через механизм входа этой платформы, не сохраняя пароли в <Constant name="dbt" />. *Для администраторов и разработчиков, подключающихся к поддерживаемым платформам данных.*

- [Обзор OAuth](/docs/platform/manage-access/oauth-intro) &mdash; Доступные возможности для каждой платформы
- [Настройка Snowflake OAuth](/docs/platform/manage-access/set-up-snowflake-oauth)
- [Настройка Databricks OAuth](/docs/platform/manage-access/set-up-databricks-oauth)
- [Настройка BigQuery OAuth](/docs/platform/manage-access/set-up-bigquery-oauth)
- [Настройка внешнего OAuth со Snowflake](/docs/platform/manage-access/snowflake-external-oauth)
- [Настройка внешнего OAuth с Redshift](/docs/platform/manage-access/redshift-external-oauth)
