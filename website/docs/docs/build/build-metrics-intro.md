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

Используйте MetricFlow в dbt, чтобы централизованно определять ваши метрики. Являясь ключевым компонентом [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), MetricFlow отвечает за построение SQL‑запросов и определение спецификаций для семантических моделей и метрик dbt. Он использует знакомые концепции, такие как семантические модели и метрики, чтобы избежать дублирования кода, оптимизировать процесс разработки, обеспечить управление корпоративными метриками и гарантировать единообразие данных для их потребителей.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-concept.png" width="50%" title="Эта диаграмма показывает, как dbt Semantic Layer работает с вашим стеком данных." />

MetricFlow позволяет вам:
- Интуитивно определять метрики в вашем проекте dbt
- Разрабатывать в привычной для вас среде — будь то [CLI <Constant name="cloud" />](/docs/cloud/cloud-cli-installation), [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) или [<Constant name="core" />](/docs/core/installation-overview)
- Использовать [команды MetricFlow](/docs/build/metricflow-commands) для выполнения запросов и тестирования этих метрик в среде разработки
- Использовать весь потенциал универсального <Constant name="semantic_layer" /> и динамически запрашивать эти метрики в downstream‑инструментах (доступно только для аккаунтов <Constant name="cloud" /> уровней [Starter, Enterprise или Enterprise+](https://www.getdbt.com/pricing/)).

<div className="grid--3-col">

 <Card
    title="Быстрый старт для семантического слоя dbt"
    body="Используйте это руководство, чтобы создать и определить метрики, настроить семантический слой dbt и выполнять запросы к ним с помощью downstream-инструментов."
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

## Связанные документы {#related-docs}

- [Краткое руководство по началу работы с <Constant name="semantic_layer" />](/guides/sl-snowflake-qs)
- [<Constant name="semantic_layer" />: что дальше](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) — блог
- [Онлайн-курс по <Constant name="semantic_layer" />](https://learn.getdbt.com/courses/semantic-layer)
- [Часто задаваемые вопросы по <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs)
