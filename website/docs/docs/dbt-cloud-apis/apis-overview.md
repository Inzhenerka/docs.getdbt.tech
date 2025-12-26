---
title: "Обзор API"
description: "Узнайте, как аккаунты dbt на тарифных планах уровня Enterprise могут обращаться к API dbt."
id: "overview"
pagination_next: "docs/dbt-cloud-apis/user-tokens"
pagination_prev: null
---

# Обзор API <Lifecycle status="self_service,managed,managed_plus" />

Аккаунты на тарифах Enterprise и Enterprise+ могут выполнять запросы к API <Constant name="cloud" />.

<Constant name="cloud" /> предоставляет следующие API:

- [Административный API <Constant name="cloud" />](/docs/dbt-cloud-apis/admin-cloud-api) можно использовать для администрирования аккаунта <Constant name="cloud" />. Его можно вызывать вручную или с помощью [Terraform‑провайдера <Constant name="cloud" />](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest).
- [Discovery API <Constant name="cloud" />](/docs/dbt-cloud-apis/discovery-api) можно использовать для получения метаданных, связанных с состоянием и работоспособностью вашего dbt‑проекта.
- [API <Constant name="semantic_layer" />](/docs/dbt-cloud-apis/sl-api-overview) предоставляют несколько вариантов API, которые позволяют выполнять запросы к вашим метрикам, определённым в <Constant name="semantic_layer" />.

Если вы хотите узнать больше о вебхуках, обратитесь к разделу [Вебхуки для ваших задач](/docs/deploy/webhooks).

## Как получить доступ к API

<Constant name="cloud" /> поддерживает два типа API‑токенов: [personal access tokens](/docs/dbt-cloud-apis/user-tokens) и [service account tokens](/docs/dbt-cloud-apis/service-tokens). Запросы к API <Constant name="cloud" /> могут быть авторизованы с использованием этих токенов.
