---
title: "О dbt Insights"
description: "Узнайте, как выполнять запросы к данным и проводить разведочный анализ данных с помощью dbt Insights"
sidebar_label: "О dbt Insights"
tags: [Semantic Layer]
image: /img/docs/dbt-insights/insights-chart.jpg
pagination_prev: "docs/explore/model-query-history"
pagination_next: "docs/explore/navigate-dbt-insights"
---

# О dbt Insights <Lifecycle status="managed,managed_plus" />

<IntroText>
Узнайте, как выполнять запросы к данным с помощью <Constant name="query_page" /> и просматривать документацию в <Constant name="explorer" />.
</IntroText>

<Constant name="query_page" /> в <Constant name="cloud" /> предоставляет пользователям возможность удобно исследовать данные и выполнять запросы с помощью интуитивно понятного интерфейса, насыщенного контекстом. Он объединяет технических и бизнес‑пользователей, сочетая метаданные, документацию, инструменты с поддержкой ИИ и мощные возможности для работы с запросами в одном едином пространстве.

<Constant name="query_page" /> в <Constant name="cloud" /> интегрируется с [<Constant name="explorer" />](/docs/explore/explore-projects), [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), [<Constant name="visual_editor" />](/docs/cloud/canvas), [<Constant name="copilot" />](/docs/cloud/dbt-copilot) и [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), упрощая выполнение исследовательского анализа данных, использование инструментов с поддержкой ИИ, принятие более быстрых решений и совместную работу между командами.

<Lightbox src="/img/docs/dbt-insights/insights-main.gif" title="Обзор dbt Insights и его возможностей" />

## Ключевые преимущества

Ключевые преимущества:
- Быстрое написание, выполнение и итерация SQL‑запросов с помощью таких инструментов, как подсветка синтаксиса, редакторы с вкладками и история запросов.
- Использование метаданных dbt, сигналов доверия и lineage из <Constant name="explorer" /> для более обоснованного построения запросов.
- Доступ к данным для пользователей с разным уровнем технической подготовки с помощью SQL, запросов к <Constant name="semantic_layer" /> и визуальных инструментов.
- Использование ИИ‑помощника <Constant name="copilot" /> для генерации или редактирования SQL‑запросов, описаний и другого контента.

Примеры сценариев использования:
- Аналитики могут быстро составлять запросы для анализа показателей продаж по регионам и просматривать результаты.
- Все пользователи получают насыщенный опыт работы, основанный на сквозных возможностях исследования данных в <Constant name="explorer" />.

## Предварительные требования

- Использование тарифного плана <Constant name="cloud" /> уровня [Enterprise](https://www.getdbt.com/pricing) &mdash; [запишитесь на демо](https://www.getdbt.com/contact), чтобы узнать больше о <Constant name="query_page" />.
- Доступно для всех конфигураций [tenant](/docs/cloud/about-cloud/tenancy).
- Наличие [developer license](/docs/cloud/manage-access/seats-and-users) в <Constant name="cloud" /> с доступом к <Constant name="query_page" />.
- Настроенные [developer credentials](/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-cloud-ide).
- Ваши production‑ и development‑[environments](/docs/dbt-cloud-environments) находятся на треке релизов <Constant name="cloud" /> **Latest** или используют поддерживаемую версию dbt.
- Использование поддерживаемой платформы данных: Snowflake, BigQuery, Databricks, Redshift или Postgres.
	- Поддерживается единый вход (SSO) для учетных записей пользователей в среде разработки. Запросы к средам деплоя выполняются с использованием учетных данных разработчика.
- (Опционально) &mdash; чтобы выполнять запросы к метрикам [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) из <Constant name="query_page" />, необходимо:
  - [Настроить](/docs/use-dbt-semantic-layer/setup-sl) <Constant name="semantic_layer" /> для вашего dbt‑проекта.
  - Иметь успешно выполненный job в окружении, где настроен <Constant name="semantic_layer" />.
- (Опционально) Для включения возможностей [Language Server Protocol (LSP)](/docs/explore/navigate-dbt-insights#lsp-features-in-dbt-insights) в <Constant name="query_page" /> и выполнения компиляций на <Constant name="fusion_engine" /> установите для среды разработки версию dbt **Latest Fusion**.
