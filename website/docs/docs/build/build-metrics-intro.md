---
title: "Создание ваших метрик"
id: build-metrics-intro
description: "Узнайте о MetricFlow и создайте свои метрики с помощью семантических моделей"
sidebar_label: Создание ваших метрик
tags: [Metrics, Semantic Layer, Governance]
hide_table_of_contents: true
pagination_next: "guides/sl-qs"
pagination_prev: null
availability: all_users
---

Используйте MetricFlow в dbt, чтобы централизованно определять ваши метрики. Являясь ключевым компонентом [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), MetricFlow отвечает за построение SQL‑запросов и определение спецификаций для семантических моделей и метрик dbt. Он использует знакомые концепции, такие как семантические модели и метрики, чтобы избежать дублирования кода, оптимизировать процесс разработки, обеспечить управление корпоративными метриками и гарантировать единообразие данных для их потребителей.

Полный список параметров конфигурации и спецификаций свойств см. в [справочнике по семантическому слою](/reference/semantic-layer-reference).

<Lightbox src="/img/docs/dbt-platform/semantic-layer/sl-concept.png" width="50%" title="Эта схема показывает, как семантический слой dbt работает с вашим стеком данных." />

MetricFlow позволяет:
- Интуитивно определять метрики в вашем проекте dbt
- Разрабатывать в удобной для вас среде: [dbt platform CLI](/docs/platform/dbt-cli-installation), [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) или [<Constant name="core" />](/docs/local/install-dbt)
- Использовать [команды MetricFlow](/docs/build/metricflow-commands) для выполнения запросов к этим метрикам и их тестирования в вашей среде разработки 
- Раскрыть весь потенциал универсального слоя <Constant name="semantic_layer" /> и динамически запрашивать эти метрики в инструментах, использующих его данные (доступно только для учетных записей <Constant name="dbt" /> на тарифах [Starter, Enterprise или Enterprise+](https://www.getdbt.com/pricing/)).

<div className="grid--3-col">

  <Card
    title="Справочник по семантическому слою"
    body="Полный справочник по настройке семантических моделей, метрик и измерений."
    link="/reference/semantic-layer-reference"
    icon="dbt-bit"/>

  <Card
    title="Переход на новую спецификацию YAML"
    body="Как перенести определения метрик с прежней спецификации YAML на новую."
    link="/docs/build/latest-metrics-spec"
    icon="dbt-bit"/>

 <Card
title="Быстрый старт с семантическим слоем dbt"
    body="Воспользуйтесь этим руководством, чтобы создать и определить метрики, настроить семантический слой dbt и выполнять запросы к метрикам с помощью инструментов-потребителей."
    link="/guides/sl-qs"
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
    body="Определяйте метрики в своём проекте dbt, используя различные типы метрик в YAML-файлах."
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
    body="Ознакомьтесь с широким кругом партнёров, чьи решения легко интегрируются с мощным семантическим слоем dbt Semantic Layer, позволяя выполнять запросы и извлекать ценные аналитические выводы из вашей экосистемы данных."
    link="/docs/platform-integrations/avail-sl-integrations"
    icon="dbt-bit"/>

</div> <br />

## Связанные документы {#related-docs}

- [Краткое руководство по началу работы с <Constant name="semantic_layer" />](/guides/sl-qs)
- Статья в блоге [<Constant name="semantic_layer" />: что дальше](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/)
- [Курс по <Constant name="semantic_layer" /> для самостоятельного изучения](https://learn.getdbt.com/courses/semantic-layer)
- [Часто задаваемые вопросы о <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/sl-faqs)
