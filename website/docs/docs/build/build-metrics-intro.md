---
title: "Создание ваших метрик"
id: build-metrics-intro
description: "Узнайте о MetricFlow и создайте свои метрики с помощью семантических моделей"
sidebar_label: Создание ваших метрик
tags: [Metrics, Semantic Layer, Governance]
hide_table_of_contents: true
pagination_next: "guides/sl-snowflake-qs"
pagination_prev: null
---

Используйте MetricFlow в dbt для централизованного определения ваших метрик. Как ключевой компонент [Семантического слоя dbt](/docs/use-dbt-semantic-layer/dbt-sl), MetricFlow отвечает за построение SQL-запросов и определение спецификаций для семантических моделей и метрик dbt. Он использует знакомые конструкции, такие как семантические модели и метрики, чтобы избежать дублирования кода, оптимизировать ваш процесс разработки, обеспечить управление данными для метрик компании и гарантировать согласованность для потребителей данных.

MetricFlow позволяет вам:
- Интуитивно определять метрики в вашем проекте dbt
- Разрабатывать в предпочитаемой вами среде, будь то [dbt Cloud CLI](/docs/cloud/cloud-cli-installation), [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) или [dbt Core](/docs/core/installation-overview)
- Использовать [команды MetricFlow](/docs/build/metricflow-commands) для запроса и тестирования этих метрик в вашей среде разработки
- Использовать истинную магию универсального Семантического слоя dbt и динамически запрашивать эти метрики в инструментах нижнего уровня (доступно только для аккаунтов dbt Cloud [Team или Enterprise](https://www.getdbt.com/pricing/)).

<div className="grid--3-col">

 <Card
    title="Быстрый старт для Семантического слоя dbt Cloud"
    body="Используйте это руководство для создания и определения метрик, настройки Семантического слоя dbt и их запроса с использованием инструментов нижнего уровня."
    link="/guides/sl-snowflake-qs"
    icon="dbt-bit"/>

<Card
    title="О MetricFlow"
    body="Поймите основные концепции MetricFlow, как использовать соединения, как сохранять часто используемые запросы и какие команды доступны."
    link="/docs/build/about-metricflow"
    icon="dbt-bit"/>

  <Card
    title="Семантическая модель"
    body="Используйте семантические модели как основу для определения данных. Они действуют как узлы в семантическом графе, с сущностями, соединяющими их."
    link="/docs/build/semantic-models"
    icon="dbt-bit"/>

  <Card
    title="Метрики"
    body="Определяйте метрики через мощное сочетание мер, ограничений или функций, легко организованных в YAML-файлах или отдельных файлах."
    link="/docs/build/metrics-overview"
    icon="dbt-bit"/>
  
  <Card
    title="Продвинутые темы"
    body="Узнайте о продвинутых темах для Семантического слоя dbt и MetricFlow, таких как рабочие процессы моделирования данных и многое другое."
    link="/docs/build/advanced-topics"
    icon="dbt-bit"/>

  <Card
    title="О Семантическом слое dbt"
    body="Введение в Семантический слой dbt, универсальный процесс, который позволяет командам данных централизованно определять и запрашивать метрики"
    link="/docs/use-dbt-semantic-layer/dbt-sl"
    icon="dbt-bit"/>

  <Card
    title="Доступные интеграции"
    body="Откройте для себя разнообразный спектр партнеров, которые бесшовно интегрируются с мощным Семантическим слоем dbt, позволяя вам запрашивать и извлекать ценные инсайты из вашей экосистемы данных."
    link="/docs/cloud-integrations/avail-sl-integrations"
    icon="dbt-bit"/>

</div> <br />

## Связанные документы

- [Руководство по быстрому старту с Семантическим слоем dbt](/guides/sl-snowflake-qs)
- [Семантический слой dbt: что дальше](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) блог
- [Курс по Семантическому слою dbt по требованию](https://learn.getdbt.com/courses/semantic-layer)
- [Часто задаваемые вопросы о Семантическом слое dbt](/docs/use-dbt-semantic-layer/sl-faqs)