---
title: "Семантический слой dbt"
id: dbt-sl
description: "Узнайте, как семантический слой dbt позволяет командам по работе с данными централизованно определять и запрашивать метрики."
sidebar_label: "О семантическом слое dbt"
tags: [Semantic Layer]
hide_table_of_contents: false
pagination_next: "guides/sl-snowflake-qs"
pagination_prev: null
---

# dbt Semantic Layer <Lifecycle status="self_service,managed,managed_plus" />

<IntroText>

Семантический слой dbt устраняет дублирование кода, позволяя командам по работе с данными определять метрики поверх существующих моделей и автоматически обрабатывать объединения данных.

</IntroText>

Семантический слой dbt, основанный на [MetricFlow](/docs/build/about-metricflow), упрощает процесс определения и использования ключевых бизнес-метрик, таких как `revenue`, на уровне моделирования (в вашем проекте dbt). За счёт централизации определений метрик команды по работе с данными могут обеспечить согласованный self-service доступ к этим метрикам в downstream-инструментах и приложениях.

Перенос определений метрик из BI-слоя в слой моделирования позволяет командам быть уверенными, что разные бизнес‑подразделения работают с одними и теми же определениями метрик, независимо от выбранного инструмента. Если определение метрики изменяется в dbt, оно обновляется везде, где используется, обеспечивая согласованность во всех приложениях. Для обеспечения безопасного контроля доступа <Constant name="semantic_layer" /> реализует надёжные механизмы [управления правами доступа](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer).

Чтобы узнать больше, см. [часто задаваемые вопросы по <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs) или запись в блоге [Why we need a universal semantic layer](https://www.getdbt.com/blog/universal-semantic-layer/).

<div style={{ display: 'flex', justifyContent: 'center', }}>
<iframe width="850" height="510" position="relative" src="https://www.youtube.com/embed/DS7Ub_CmBR0?si=m92hLmxw1VuE6KKO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Начало работы с семантическим слоем dbt

<!-- этот фрагмент находится здесь: https://github.com/dbt-labs/docs.getdbt.com/website/snippets/_sl-plan-info. Используйте его на разных страницах и адаптируйте сообщение в зависимости от того, какой экземпляр может получить доступ к SL и на каком этапе жизненного цикла продукта мы находимся. -->

import Features from '/snippets/_sl-plan-info.md'

<Features
product="dbt Semantic Layer"
plan="dbt Starter or Enterprise-tier"
/>

:::info Пока не поддерживается в движке dbt Fusion
<Constant name="semantic_layer" /> в настоящее время поддерживается в <Constant name="dbt_platform" /> для окружений, использующих версии <Constant name="core" />. Поддержка для окружений на движке dbt Fusion появится в ближайшее время.
:::

Эта страница указывает на различные ресурсы, которые помогут вам понять, настроить, развернуть и интегрировать <Constant name="semantic_layer" />. В следующих разделах приведены ссылки на отдельные страницы, подробно объясняющие каждый аспект. Используйте эти ссылки, чтобы перейти напрямую к нужной информации — независимо от того, настраиваете ли вы <Constant name="semantic_layer" /> впервые, разворачиваете метрики или интегрируетесь с downstream-инструментами.

Обратитесь к следующим ресурсам, чтобы начать работу с семантическим слоем dbt:
- [Быстрый старт с семантическим слоем dbt Cloud](/guides/sl-snowflake-qs) &mdash; Создайте и определите метрики, настройте семантический слой dbt и запрашивайте их, используя наши первоклассные интеграции.
- [Часто задаваемые вопросы о семантическом слое dbt](/docs/use-dbt-semantic-layer/sl-faqs) &mdash; Узнайте ответы на часто задаваемые вопросы о семантическом слое dbt, такие как доступность, интеграции и многое другое.

Обратитесь к следующим ресурсам, чтобы начать работу с <Constant name="semantic_layer" />:
- [Quickstart с <Constant name="semantic_layer" />](/guides/sl-snowflake-qs) &mdash; Создайте и определите метрики, настройте <Constant name="semantic_layer" /> и выполняйте запросы к ним с помощью наших первоклассных интеграций.
- [Создание метрик](/docs/build/build-metrics-intro) &mdash; Используйте MetricFlow в <Constant name="cloud" /> для централизованного определения метрик.
- [Часто задаваемые вопросы по <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs) &mdash; Найдите ответы на часто задаваемые вопросы о <Constant name="semantic_layer" />, включая доступность, интеграции и многое другое.

Следующие ресурсы предоставляют информацию о том, как настроить семантический слой dbt:
- [Настройка семантического слоя dbt](/docs/use-dbt-semantic-layer/setup-sl) &mdash; Узнайте, как настроить семантический слой dbt в dbt Cloud, используя интуитивную навигацию.
- [Архитектура](/docs/use-dbt-semantic-layer/sl-architecture) &mdash; Изучите мощные компоненты, составляющие семантический слой dbt.

Следующие ресурсы содержат информацию о том, как настроить <Constant name="semantic_layer" />:
- [Администрирование <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) &mdash; Удобно настройте учетные данные и токены, чтобы начать выполнять запросы к <Constant name="semantic_layer" />.  
- [Архитектура](/docs/use-dbt-semantic-layer/sl-architecture) &mdash; Изучите ключевые компоненты, из которых состоит <Constant name="semantic_layer" />.

## Развертывание метрик
В этом разделе приведена информация о том, как развернуть <Constant name="semantic_layer" /> и материализовать ваши метрики:
- [Развертывание <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/deploy-sl) &mdash; Запустите задание <Constant name="cloud" />, чтобы развернуть <Constant name="semantic_layer" /> и материализовать метрики.
- [Написание запросов с использованием exports](/docs/use-dbt-semantic-layer/exports) &mdash; Используйте exports для создания часто используемых запросов непосредственно в вашей платформе данных по расписанию.
- [Кэширование часто используемых запросов](/docs/use-dbt-semantic-layer/sl-cache) &mdash; Используйте кэширование результатов и декларативное кэширование для типовых запросов, чтобы повысить производительность и снизить вычислительную нагрузку.

## Использование метрик и интеграция
Используйте метрики и интегрируйте <Constant name="semantic_layer" /> с нижележащими инструментами и приложениями:
- [Использование метрик](/docs/use-dbt-semantic-layer/consume-metrics) &mdash; Выполняйте запросы и используйте метрики в нижележащих инструментах и приложениях с помощью <Constant name="semantic_layer" />.
- [Доступные интеграции](/docs/cloud-integrations/avail-sl-integrations) &mdash; Ознакомьтесь с широким спектром партнерских решений, которые можно интегрировать и использовать для выполнения запросов к <Constant name="semantic_layer" />.
- [API <Constant name="semantic_layer" />](/docs/dbt-cloud-apis/sl-api-overview) &mdash; Используйте API <Constant name="semantic_layer" /> для выполнения запросов к метрикам в нижележащих инструментах, обеспечивая согласованность и надежность данных.

Потребляйте метрики и интегрируйте семантический слой dbt с последующими инструментами и приложениями:
- [Потребление метрик](/docs/use-dbt-semantic-layer/consume-metrics) &mdash; Запрашивайте и потребляйте метрики в последующих инструментах и приложениях, используя семантический слой dbt.
- [Доступные интеграции](/docs/cloud-integrations/avail-sl-integrations) &mdash; Ознакомьтесь с широким спектром партнеров, с которыми вы можете интегрироваться и запрашивать с помощью семантического слоя dbt.
- [API семантического слоя dbt](/docs/dbt-cloud-apis/sl-api-overview) &mdash; Используйте API семантического слоя dbt для запроса метрик в последующих инструментах для получения согласованных и надежных данных.