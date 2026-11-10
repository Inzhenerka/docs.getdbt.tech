---
title: "dbt Semantic Layer"
id: dbt-sl
description: "Узнайте, как dbt Semantic Layer позволяет дата-командам централизованно определять и запрашивать метрики."
sidebar_label: "О dbt Semantic Layer"
tags: [Semantic Layer]
hide_table_of_contents: false
pagination_next: "guides/sl-qs"
pagination_prev: null
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

# Семантический слой dbt

<IntroText>

dbt Semantic Layer устраняет дублирование кода, позволяя дата-командам определять метрики поверх существующих моделей и автоматически обрабатывать соединения данных.

</IntroText>

import SlConnectYourAi from '/snippets/_sl-connect-your-ai.md';

<SlConnectYourAi/>

Семантический слой dbt, работающий на базе [MetricFlow](/docs/build/about-metricflow), упрощает определение и использование ключевых бизнес-метрик, таких как `revenue`, на уровне моделирования (в вашем проекте dbt). Централизуя определения метрик, команды по работе с данными могут обеспечить пользователям согласованный самостоятельный доступ к этим метрикам в инструментах и приложениях, использующих эти данные.

Перенос определений метрик из BI‑слоя в слой моделирования позволяет дата-командам быть уверенными, что разные бизнес‑подразделения используют одни и те же определения метрик, независимо от выбранного инструмента. Если определение метрики изменяется в dbt, оно обновляется везде, где используется, обеспечивая согласованность во всех приложениях. Для обеспечения безопасного контроля доступа <Constant name="semantic_layer" /> реализует надежные механизмы [разграничения прав доступа](/docs/use-dbt-semantic-layer/setup-sl#administer-the-semantic-layer-1).

Чтобы узнать больше, ознакомьтесь с [FAQ по <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs) или прочитайте пост в блоге [Зачем нужен универсальный семантический слой](https://www.getdbt.com/blog/universal-semantic-layer/).

<div style={{ display: 'flex', justifyContent: 'center', }}>
<iframe width="850" height="510" position="relative" src="https://www.youtube.com/embed/DS7Ub_CmBR0?si=m92hLmxw1VuE6KKO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Начало работы с dbt Semantic Layer {#get-started-with-the-dbt-semantic-layer}

<!-- этот partial находится здесь: https://github.com/dbt-labs/docs.getdbt.com/website/snippets/_sl-plan-info. используйте его на разных страницах и для адаптации сообщения в зависимости от того, какой экземпляр может получить доступ к SL и на каком этапе жизненного цикла продукта мы находимся. -->

import Features from '/snippets/_sl-plan-info.md'

<Features
product="dbt Semantic Layer"
plan="dbt Starter or Enterprise-tier"
/>

На этой странице собраны ссылки на различные ресурсы, которые помогут вам разобраться в <Constant name="semantic_layer" />, настроить и развернуть его, а также интегрировать с другими инструментами. В следующих разделах приведены ссылки на отдельные страницы, где подробно рассматривается каждый из этих аспектов. Используйте эти ссылки, чтобы сразу перейти к нужной информации — будь то первоначальная настройка <Constant name="semantic_layer" />, развертывание метрик или интеграция с инструментами, использующими его данные.

Чтобы начать работу с <Constant name="semantic_layer" />, обратитесь к следующим ресурсам:
- [Быстрый старт с <Constant name="semantic_layer" />](/guides/sl-qs): Создавайте и определяйте метрики, настройте <Constant name="semantic_layer" /> и запрашивайте метрики в Google Sheets и других инструментах.
- [Создание метрик](/docs/build/build-metrics-intro) &mdash; Используйте MetricFlow в <Constant name="dbt" /> для централизованного определения метрик.
- [Часто задаваемые вопросы о <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs) &mdash; Найдите ответы на часто задаваемые вопросы о <Constant name="semantic_layer" />, включая доступность, интеграции и другие темы.

## Настройка семантического слоя dbt {#configure-the-dbt-semantic-layer}

Следующие ресурсы содержат информацию о настройке <Constant name="semantic_layer" />:
- [Администрирование <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) &mdash; С лёгкостью настройте учётные данные и токены, чтобы начать выполнять запросы к <Constant name="semantic_layer" />. 
- [Архитектура](/docs/use-dbt-semantic-layer/sl-architecture) &mdash; Изучите мощные компоненты, из которых состоит <Constant name="semantic_layer" />.

## Развёртывание метрик
В этом разделе рассказывается, как развернуть <Constant name="semantic_layer" /> и материализовать метрики:
- [Развёртывание <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/deploy-sl) &mdash; Запустите задание <Constant name="dbt" />, чтобы развернуть <Constant name="semantic_layer" /> и материализовать метрики.
- [Создание запросов с помощью экспортов](/docs/use-dbt-semantic-layer/exports) &mdash; Используйте экспорты для выполнения часто используемых запросов непосредственно на вашей платформе данных по расписанию.
- [Кэширование типовых запросов](/docs/use-dbt-semantic-layer/sl-cache) &mdash; Используйте кэширование результатов и декларативное кэширование для типовых запросов, чтобы повысить производительность и сократить объём вычислений при выполнении запросов.

## Использование метрик и интеграция {#consume-metrics-and-integrate}
Используйте метрики и интегрируйте <Constant name="semantic_layer" /> с downstream‑инструментами и приложениями:
- [Использование метрик](/docs/use-dbt-semantic-layer/consume-metrics) &mdash; Выполнение запросов и использование метрик в downstream‑инструментах и приложениях с помощью <Constant name="semantic_layer" />.
- [Доступные интеграции](/docs/platform-integrations/avail-sl-integrations) &mdash; Обзор широкого спектра партнеров, с которыми можно интегрироваться и выполнять запросы через <Constant name="semantic_layer" />.
- [API <Constant name="semantic_layer" />](/docs/dbt-apis/sl-api-overview) &mdash; Использование API <Constant name="semantic_layer" /> для выполнения запросов к метрикам в downstream‑инструментах и обеспечения согласованных и надежных данных по метрикам.
