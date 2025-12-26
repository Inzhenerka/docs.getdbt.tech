---
title: "Доступные интеграции"
id: avail-sl-integrations
description: "Откройте для себя разнообразный спектр партнеров, которые бесшовно интегрируются с мощным семантическим слоем dbt, позволяя вам выполнять запросы и извлекать ценные инсайты из вашей экосистемы данных."
tags: [Semantic Layer]
sidebar_label: "Доступные интеграции"
hide_table_of_contents: true
meta:
  api_name: dbt Semantic Layer APIs
---

# Доступные интеграции <Lifecycle status="self_service,managed,managed_plus" />

Существует ряд приложений для работы с данными, которые бесшовно интегрируются с <Constant name="semantic_layer" />, работающим на базе MetricFlow — от инструментов бизнес-аналитики до ноутбуков, электронных таблиц, каталогов данных и других решений. Эти интеграции позволяют выполнять запросы к данным и извлекать ценные инсайты из вашей экосистемы данных.

Используйте [API <Constant name="semantic_layer" />](/docs/dbt-cloud-apis/sl-api-overview), чтобы упростить запросы к метрикам, оптимизировать процесс разработки и сократить объём кода. Такой подход также обеспечивает управление данными и согласованность результатов для потребителей данных.

import AvailIntegrations from '/snippets/_sl-partner-links.md';

<AvailIntegrations/>

### Пользовательская интеграция

- Все BI-инструменты могут использовать [exports](/docs/use-dbt-semantic-layer/exports) с <Constant name="semantic_layer" />, даже если у них нет нативной интеграции.
- [Используйте метрики](/docs/use-dbt-semantic-layer/consume-metrics) и разрабатывайте собственные интеграции на разных языках и с разными инструментами — это поддерживается через API [JDBC](/docs/dbt-cloud-apis/sl-jdbc), ADBC и [GraphQL](/docs/dbt-cloud-apis/sl-graphql), а также через [Python SDK library](/docs/dbt-cloud-apis/sl-python). Подробнее см. [наши примеры на GitHub](https://github.com/dbt-labs/example-semantic-layer-clients/).
- Подключайтесь к любому инструменту, который поддерживает SQL-запросы. Такие инструменты должны соответствовать одному из двух критериев:
    - предоставлять универсальный JDBC-драйвер (например, DataGrip), или
    - быть совместимыми с Arrow Flight SQL JDBC driver версии 12.0.0 или выше.

## Связанные документы

- <span><a href="https://docs.getdbt.tech/docs/dbt-cloud-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span>, чтобы узнать, как интегрировать и выполнять запросы к вашим метрикам в downstream‑инструментах.
- [Синтаксис запросов к API <Constant name="semantic_layer" />](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) 
- [Ячейки Hex для <Constant name="semantic_layer" />](https://learn.hex.tech/docs/explore-data/cells/data-cells/dbt-metrics-cells) для настройки SQL‑ячеек в Hex.
- [Устранение ошибки «Failed APN»](/faqs/Troubleshooting/sl-alpn-error) при подключении к <Constant name="semantic_layer" />.
- [Онлайн‑курс по <Constant name="semantic_layer" />](https://learn.getdbt.com/courses/semantic-layer)
- [Часто задаваемые вопросы по <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs)
