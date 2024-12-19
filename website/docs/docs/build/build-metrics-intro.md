---
title: "Создание ваших метрик"
id: build-metrics-intro
description: "Узнайте о MetricFlow и создайте свои метрики с помощью семантических моделей"
sidebar_label: Создание ваших метрик
tags: [Метрики, Семантический уровень, Управление]
hide_table_of_contents: true
pagination_next: "guides/sl-snowflake-qs"
pagination_prev: null
---

Используйте MetricFlow в dbt для централизованного определения ваших метрик. Являясь ключевым компонентом [Семантического уровня dbt](/docs/use-dbt-semantic-layer/dbt-sl), MetricFlow отвечает за построение SQL-запросов и определение спецификаций для семантических моделей и метрик dbt. Он использует знакомые конструкции, такие как семантические модели и метрики, чтобы избежать дублирования кода, оптимизировать ваш рабочий процесс разработки, обеспечить управление данными для корпоративных метрик и гарантировать согласованность для потребителей данных.

MetricFlow позволяет вам:
- Интуитивно определять метрики в вашем проекте dbt
- Разрабатывать в вашем предпочтительном окружении, будь то [dbt Cloud CLI](/docs/cloud/cloud-cli-installation), [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) или [dbt Core](/docs/core/installation-overview)
- Использовать [команды MetricFlow](/docs/build/metricflow-commands) для запроса и тестирования этих метрик в вашем рабочем окружении
- Использовать истинную магию универсального семантического уровня dbt и динамически запрашивать эти метрики в downstream-инструментах (доступно только для аккаунтов dbt Cloud [Team или Enterprise](https://www.getdbt.com/pricing/)).

<div className="grid--3-col">

 <Card
    title="Быстрый старт для семантического уровня dbt Cloud"
    body="Используйте это руководство для создания и определения метрик, настройки семантического уровня dbt и их запроса с помощью downstream-инструментов."
    link="/guides/sl-snowflake-qs"
    icon="dbt-bit"/>

<Card
    title="О MetricFlow"
    body="Поймите основные концепции MetricFlow, как использовать соединения, как сохранять часто используемые запросы и какие команды доступны."
    link="/docs/build/about-metricflow"
    icon="dbt-bit"/>

  <Card
    title="Семантическая модель"
    body="Используйте семантические модели в качестве основы для определения данных. Они действуют как узлы в семантическом графе, соединяясь с сущностями."
    link="/docs/build/semantic-models"
    icon="dbt-bit"/>

  <Card
    title="Метрики"
    body="Определяйте метрики с помощью мощного сочетания измерений, ограничений или функций, легко организованных в YAML-файлах или отдельных файлах."
    link="/docs/build/metrics-overview"
    icon="dbt-bit"/>
  
  <Card
    title="Расширенные темы"
    body="Узнайте о расширенных темах для семантического уровня dbt и MetricFlow, таких как рабочие процессы моделирования данных и многое другое."
    link="/docs/build/advanced-topics"
    icon="dbt-bit"/>

  <Card
    title="О семантическом уровне dbt"
    body="Представляем семантический уровень dbt, универсальный процесс, который позволяет командам данных централизованно определять и запрашивать метрики."
    link="/docs/use-dbt-semantic-layer/dbt-sl"
    icon="dbt-bit"/>

  <Card
    title="Доступные интеграции"
    body="Откройте для себя разнообразие партнеров, которые бесшовно интегрируются с мощным семантическим уровнем dbt, позволяя вам запрашивать и извлекать ценные инсайты из вашей экосистемы данных."
    link="/docs/cloud-integrations/avail-sl-integrations"
    icon="dbt-bit"/>

</div> <br />

## Связанные документы

- [Руководство по быстрому старту с семантическим уровнем dbt](/guides/sl-snowflake-qs)
- [Семантический уровень dbt: что дальше](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) блог
- [Курс по семантическому уровню dbt по запросу](https://learn.getdbt.com/courses/semantic-layer)
- [Часто задаваемые вопросы о семантическом уровне dbt](/docs/use-dbt-semantic-layer/sl-faqs)