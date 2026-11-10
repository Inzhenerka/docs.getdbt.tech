---
title: "Обзор OAuth"
description: "Подключайте учетные данные для разработки к платформам данных с помощью OAuth в платформе dbt."
id: "oauth-intro"
sidebar_label: "Обзор OAuth"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Обзор OAuth

OAuth в <Constant name="dbt_platform" /> позволяет разработчикам авторизовать свои учетные данные на платформе данных, используя вход на эту платформу или ее систему единого входа (SSO), вместо того чтобы хранить имена пользователей и пароли в <Constant name="dbt_platform" />. Это повышает безопасность и соответствует привычному для вашей команды способу входа в хранилище данных.

**Для кого:** Для администраторов аккаунтов и разработчиков на тарифах Enterprise или Enterprise+, которые подключаются к поддерживаемым платформам данных. Администраторы настраивают интеграцию OAuth, а разработчики выполняют однократную авторизацию в своем профиле.

## Доступные интеграции

Выберите подходящую документацию для вашей платформы, чтобы настроить OAuth и предоставить разработчикам возможность авторизовать свои учетные данные.

| Платформа | Документация | Описание |
|----------|-----|----------------|
| **Snowflake** | [Настройка OAuth для Snowflake](/docs/platform/manage-access/set-up-snowflake-oauth) | Авторизация учетных данных пользователей через Snowflake (или SSO Snowflake). |
| **Databricks** | [Настройка OAuth для Databricks](/docs/platform/manage-access/set-up-databricks-oauth) | Авторизация учетных данных пользователей через Databricks. |
| **BigQuery** | [Настройка OAuth для BigQuery](/docs/platform/manage-access/set-up-bigquery-oauth) | Авторизация учетных данных пользователей через Google. |
| **Snowflake (внешний OAuth)** | [Настройка внешнего OAuth для Snowflake](/docs/platform/manage-access/snowflake-external-oauth) | Использование внешнего поставщика удостоверений (IdP) для OAuth в Snowflake. |
| **Redshift (внешний OAuth)** | [Настройка внешнего OAuth для Redshift](/docs/platform/manage-access/redshift-external-oauth) | Использование внешнего поставщика удостоверений (IdP) для OAuth в Redshift. |
