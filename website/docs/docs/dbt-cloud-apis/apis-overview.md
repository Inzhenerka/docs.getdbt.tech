---
title: "Обзор API"
description: "Узнайте, как аккаунты dbt на планах Team и Enterprise могут выполнять запросы к API dbt Cloud."
id: "overview"
pagination_next: "docs/dbt-cloud-apis/user-tokens"
pagination_prev: null
---

# Обзор API <Lifecycle status="team,enterprise"/>

Аккаунты на планах _Team_ и _Enterprise_ могут выполнять запросы к API dbt Cloud.

dbt Cloud предоставляет следующие API:

- [Административный API dbt Cloud](/docs/dbt-cloud-apis/admin-cloud-api) может использоваться для администрирования аккаунта dbt Cloud. Его можно вызывать вручную или с помощью [провайдера dbt Cloud для Terraform](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest).
- [API обнаружения dbt Cloud](/docs/dbt-cloud-apis/discovery-api) может использоваться для получения метаданных, связанных с состоянием и здоровьем вашего проекта dbt.
- [API семантического слоя dbt](/docs/dbt-cloud-apis/sl-api-overview) предоставляет несколько вариантов API, которые позволяют выполнять запросы к вашим метрикам, определенным в семантическом слое dbt.

Если вы хотите узнать больше о вебхуках, обратитесь к разделу [Вебхуки для ваших задач](/docs/deploy/webhooks).

## Как получить доступ к API

dbt Cloud поддерживает два типа токенов API: [токены личного доступа](/docs/dbt-cloud-apis/user-tokens) и [токены сервисных аккаунтов](/docs/dbt-cloud-apis/service-tokens). Запросы к API dbt Cloud могут быть авторизованы с использованием этих токенов.