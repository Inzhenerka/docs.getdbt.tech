---
title: "Обзор API"
description: "Узнайте, как аккаунты dbt на тарифных планах уровня Enterprise могут обращаться к API dbt."
id: "overview"
pagination_next: "docs/dbt-apis/rate-limits"
pagination_prev: null
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

import ApiRateLimitsCallout from '/snippets/_api-rate-limits-callout.md';

# Обзор API {#apis-overview}

Пользователи тарифных планов Starter, Enterprise и Enterprise+ могут отправлять запросы к API <Constant name="dbt" />.

<Constant name="dbt" /> предоставляет следующие API:

- [Административный API <Constant name="dbt" />](/docs/dbt-apis/admin-api) можно использовать для администрирования аккаунта <Constant name="dbt" />. Его можно вызывать вручную или с помощью [Terraform‑провайдера <Constant name="dbt" />](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest).
- [Discovery API <Constant name="dbt" />](/docs/dbt-apis/discovery-api) можно использовать для получения метаданных, связанных с состоянием и работоспособностью вашего dbt‑проекта.
- [API <Constant name="semantic_layer" />](/docs/dbt-apis/sl-api-overview) предоставляют несколько вариантов API, которые позволяют выполнять запросы к вашим метрикам, определённым в <Constant name="semantic_layer" />.

Если вы хотите узнать больше о вебхуках, обратитесь к разделу [Вебхуки для ваших задач](/docs/deploy/webhooks).

<ApiRateLimitsCallout />

## Как получить доступ к API {#how-to-access-the-apis}

<Constant name="dbt" /> поддерживает два типа токенов API: [персональные токены доступа](/docs/dbt-apis/user-tokens) и [токены сервисных аккаунтов](/docs/dbt-apis/service-tokens). Ими можно авторизовать запросы к API <Constant name="dbt" />.
