---
title: "Обзор API"
description: "Узнайте, как аккаунты на тарифах Team и Enterprise могут запрашивать API dbt Cloud."
id: "overview"
pagination_next: "docs/dbt-cloud-apis/user-tokens"
pagination_prev: null
---

# Обзор API <Lifecycle status="team,enterprise"/>

Аккаунты на тарифах _Team_ и _Enterprise_ могут запрашивать API dbt Cloud.

dbt Cloud предоставляет следующие API:

- [Административный API dbt Cloud](/docs/dbt-cloud-apis/admin-cloud-api) может использоваться для администрирования аккаунта dbt Cloud. Его можно вызывать вручную или с помощью [провайдера Terraform для dbt Cloud](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest).
- [API обнаружения dbt Cloud](/docs/dbt-cloud-apis/discovery-api) может использоваться для получения метаданных, связанных с состоянием и здоровьем вашего проекта dbt.
- [API семантического слоя dbt](/docs/dbt-cloud-apis/sl-api-overview) предоставляет несколько вариантов API, которые позволяют запрашивать ваши метрики, определенные в семантическом слое dbt.

Если вы хотите узнать больше о вебхуках, обратитесь к разделу [Вебхуки для ваших задач](/docs/deploy/webhooks).

## Как получить доступ к API

dbt Cloud поддерживает два типа токенов API: [персональные токены доступа](/docs/dbt-cloud-apis/user-tokens) и [токены сервисного аккаунта](/docs/dbt-cloud-apis/service-tokens). Запросы к API dbt Cloud могут быть авторизованы с использованием этих токенов.