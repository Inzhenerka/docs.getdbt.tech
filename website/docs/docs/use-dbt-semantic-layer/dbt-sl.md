---
title: "dbt Semantic Layer"
id: dbt-sl
description: "Узнайте, как dbt Semantic Layer позволяет дата-командам централизованно определять и запрашивать метрики."
sidebar_label: "О dbt Semantic Layer"
tags: [Semantic Layer]
hide_table_of_contents: false
pagination_next: "guides/sl-snowflake-qs"
pagination_prev: null
---

# dbt Semantic Layer <Lifecycle status="self_service,managed,managed_plus" />

<IntroText>

dbt Semantic Layer устраняет дублирование кода, позволяя дата-командам определять метрики поверх существующих моделей и автоматически обрабатывать соединения данных.

</IntroText>

dbt Semantic Layer, работающий на базе [MetricFlow](/docs/build/about-metricflow), упрощает процесс определения и использования критически важных бизнес-метрик, таких как `revenue`, на уровне моделирования (ваш dbt‑проект). Централизация определений метрик позволяет дата-командам обеспечивать согласованный self‑service‑доступ к этим метрикам в downstream‑инструментах и приложениях.

Перенос определений метрик из BI‑слоя в слой моделирования позволяет дата-командам быть уверенными, что разные бизнес‑подразделения используют одни и те же определения метрик, независимо от выбранного инструмента. Если определение метрики изменяется в dbt, оно обновляется везде, где используется, обеспечивая согласованность во всех приложениях. Для обеспечения безопасного контроля доступа <Constant name="semantic_layer" /> реализует надежные механизмы [разграничения прав доступа](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer).

Чтобы узнать больше, ознакомьтесь с [FAQ по <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs) или прочитайте пост в блоге [Why we need a universal semantic layer](https://www.getdbt.com/blog/universal-semantic-layer/).

<div style={{ display: 'flex', justifyContent: 'center', }}>
<iframe width="850" height="510" position="relative" src="https://www.youtube.com/embed/DS7Ub_CmBR0?si=m92hLmxw1VuE6KKO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Начало работы с dbt Semantic Layer

<!-- этот partial находится здесь: https://github.com/dbt-labs/docs.getdbt.com/website/snippets/_sl-plan-info. используйте его на разных страницах и для адаптации сообщения в зависимости от того, какой экземпляр может получить доступ к SL и на каком этапе жизненного цикла продукта мы находимся. -->

import Features from '/snippets/_sl-plan-info.md'

<Features
product="dbt Semantic Layer"
plan="dbt Starter or Enterprise-tier"
/>

:::info Пока не поддерживается в движке dbt Fusion
<Constant name="semantic_layer" /> в настоящее время поддерживается в <Constant name="dbt_platform" /> для окружений, использующих версии <Constant name="core" />. Поддержка окружений на движке dbt Fusion появится в ближайшее время.
:::

Эта страница содержит ссылки на различные ресурсы, которые помогут вам понять, настроить, развернуть и интегрировать <Constant name="semantic_layer" />. В следующих разделах собраны ссылки на отдельные страницы с подробным описанием каждого аспекта. Используйте их для быстрого перехода к нужной информации — будь то первоначальная настройка <Constant name="semantic_layer" />, деплой метрик или интеграция с downstream‑инструментами.

Для начала работы с <Constant name="semantic_layer" /> ознакомьтесь со следующими ресурсами:
- [Быстрый старт с <Constant name="semantic_layer" />](/guides/sl-snowflake-qs) &mdash; Создание и определение метрик, настройка <Constant name="semantic_layer" /> и выполнение запросов с использованием наших первоклассных интеграций.
- [Создание метрик](/docs/build/build-metrics-intro) &mdash; Используйте MetricFlow в <Constant name="cloud" /> для централизованного определения метрик.
- [FAQ по <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs) &mdash; Ответы на часто задаваемые вопросы о <Constant name="semantic_layer" />, включая доступность, интеграции и многое другое.

## Настройка dbt Semantic Layer

Следующие ресурсы содержат информацию о том, как настроить <Constant name="semantic_layer" />:
- [Администрирование <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) &mdash; Удобная настройка учетных данных и токенов для начала выполнения запросов к <Constant name="semantic_layer" />. 
- [Архитектура](/docs/use-dbt-semantic-layer/sl-architecture) &mdash; Обзор ключевых компонентов, из которых состоит <Constant name="semantic_layer" />.

## Развертывание метрик
В этом разделе представлена информация о том, как развернуть <Constant name="semantic_layer" /> и материализовать метрики:
- [Развертывание <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/deploy-sl) &mdash; Запуск задания в <Constant name="cloud" /> для развертывания <Constant name="semantic_layer" /> и материализации метрик.
- [Написание запросов с помощью exports](/docs/use-dbt-semantic-layer/exports) &mdash; Использование exports для написания часто используемых запросов непосредственно в вашей платформе данных по расписанию.
- [Кэширование распространенных запросов](/docs/use-dbt-semantic-layer/sl-cache) &mdash; Использование кэширования результатов и декларативного кэширования для ускорения выполнения распространенных запросов и снижения вычислительной нагрузки.

## Использование метрик и интеграция
Используйте метрики и интегрируйте <Constant name="semantic_layer" /> с downstream‑инструментами и приложениями:
- [Использование метрик](/docs/use-dbt-semantic-layer/consume-metrics) &mdash; Выполнение запросов и использование метрик в downstream‑инструментах и приложениях с помощью <Constant name="semantic_layer" />.
- [Доступные интеграции](/docs/cloud-integrations/avail-sl-integrations) &mdash; Обзор широкого спектра партнеров, с которыми можно интегрироваться и выполнять запросы через <Constant name="semantic_layer" />.
- [API <Constant name="semantic_layer" />](/docs/dbt-cloud-apis/sl-api-overview) &mdash; Использование API <Constant name="semantic_layer" /> для выполнения запросов к метрикам в downstream‑инструментах и обеспечения согласованных и надежных данных по метрикам.
