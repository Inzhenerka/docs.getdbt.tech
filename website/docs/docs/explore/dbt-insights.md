---
title: "О dbt Insights"
description: "Узнайте, как выполнять запросы к данным и проводить разведочный анализ данных с помощью dbt Insights"
sidebar_label: "О dbt Insights"
tags: [Semantic Layer]
image: /img/docs/dbt-insights/insights-chart.jpg
pagination_prev: "docs/explore/model-query-history"
pagination_next: "docs/explore/navigate-dbt-insights"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# О dbt Insights <Lifecycle status="beta" />

<IntroText>
Узнайте, как выполнять запросы к данным с помощью <Constant name="insights" /> и просматривать документацию в <Constant name="catalog" />.
</IntroText>

<Constant name="insights" /> в <Constant name="dbt" /> позволяет пользователям легко исследовать данные и выполнять запросы с помощью интуитивно понятного интерфейса с богатым контекстом. Этот инструмент объединяет технических и бизнес-пользователей, предоставляя метаданные, документацию, инструменты на базе ИИ и мощные возможности выполнения запросов в единой среде. 

<Constant name="insights" /> в <Constant name="dbt" /> интегрируется с [<Constant name="catalog" />](/docs/explore/explore-projects), [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), [dbt Copilot в Insights](/docs/explore/access-dbt-insights) и [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), чтобы вам было проще проводить разведочный анализ данных, использовать инструменты на базе ИИ, быстрее принимать решения и сотрудничать с другими командами.

<Lightbox src="/img/docs/dbt-insights/insights-main.gif" title="Обзор dbt Insights и его возможностей" />

## Предварительные требования {#prerequisites}

- Используйте тарифный план <Constant name="dbt" /> [Enterprise или Enterprise+](https://www.getdbt.com/pricing) &mdash; [запишитесь на демонстрацию](https://www.getdbt.com/contact), чтобы узнать больше о <Constant name="insights" />.
- Доступно для всех [конфигураций размещения](/docs/platform/about-platform/tenancy). 
- У вас должна быть [лицензия разработчика](/docs/platform/manage-access/seats-and-users) <Constant name="dbt" /> с доступом к <Constant name="insights" />.
- Должны быть настроены [учётные данные пользователя](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide).
- Ваши [среды](/docs/dbt-platform-environments) разработки и production должны использовать [канал обновлений](/docs/dbt-versions/dbt-release-tracks) **v1 Latest** в <Constant name="dbt" /> или поддерживаемую версию dbt.
- Используйте поддерживаемую платформу данных: Snowflake, BigQuery, Databricks, Redshift или Postgres.
	- Для учётных записей пользователей в среде разработки поддерживается единый вход (SSO). Запросы к средам развёртывания будут выполняться с использованием учётных данных пользователя, настроенных в разделе **Account settings**.
- (Необязательно) &mdash; Чтобы запрашивать метрики [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) из <Constant name="insights" />, также необходимо:
  - [Настроить](/docs/use-dbt-semantic-layer/setup-sl) <Constant name="semantic_layer" /> для вашего проекта dbt.
  - Иметь успешно завершённый запуск задания в среде, где настроен <Constant name="semantic_layer" />. 
- (Необязательно) Чтобы включить [возможности Language Server Protocol (LSP)](/docs/explore/navigate-dbt-insights#lsp-features) в <Constant name="insights" /> и выполнять компиляцию с помощью <Constant name="fusion_engine" />, настройте среду разработки на использование версии dbt **v2 Stable**.

## Основные преимущества

Основные преимущества:
- Быстро пишите, выполняйте и дорабатывайте SQL-запросы с помощью таких инструментов, как подсветка синтаксиса, редакторы с вкладками и история запросов.
- Используйте метаданные dbt, индикаторы доверия к данным и информацию о происхождении данных из <Constant name="catalog" /> для обоснованного построения запросов.
- Сделайте данные доступными для пользователей с разным уровнем технических навыков с помощью SQL, запросов к <Constant name="semantic_layer" /> и визуальных инструментов.
- Используйте dbt Copilot в Insights для создания и редактирования SQL-запросов, описаний и другого содержимого.

Примеры сценариев использования:
- Аналитики могут быстро создавать запросы для анализа показателей продаж по регионам и просматривать результаты.
- Все пользователи получают широкие возможности для разработки благодаря сквозному исследованию данных в <Constant name="catalog" />.

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';

<CopilotWizardDifferences/>
