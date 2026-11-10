---
title: "Доступ к Catalog из функций платформы dbt"
sidebar_label: "Доступ из платформы dbt"
description: "Узнайте, где и как открывать Catalog и взаимодействовать с ним напрямую из функций и продуктов платформы dbt."
availability: platform_login
---

Открывайте <Constant name="catalog" /> из заданий, <Constant name="insights" /> и других разделов <Constant name="dbt" />, чтобы быстро переключаться между контекстом запуска, графом зависимостей и метаданными ресурсов вашего проекта.

На этой странице описано, как открыть <Constant name="catalog" /> в ходе оркестрации и исследования данных в <Constant name="dbt" />. Основной способ открыть <Constant name="catalog" /> — выбрать **Catalog** в меню навигации; также его можно открыть из заданий и <Constant name="insights" />, как описано в разделах ниже.

### Вкладка Lineage в заданиях {#lineage-tab-in-jobs}

**Вкладка Lineage** в заданиях <Constant name="dbt" /> отображает граф зависимостей, связанный с [запуском задания](/docs/deploy/jobs). Вы можете открыть <Constant name="catalog" /> прямо с этой вкладки, чтобы изучить зависимости и связи между ресурсами вашего проекта.

#### Доступ к Catalog с вкладки Lineage

- В задании выберите **вкладку Lineage**.
- Дважды щёлкните узел графа зависимостей, чтобы открыть новую вкладку и просмотреть его метаданные в <Constant name="catalog" />.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-lineage.gif" title="Откройте dbt Catalog с вкладки Lineage, дважды щёлкнув узел графа зависимостей." />

### Вкладка Model timing в заданиях <Lifecycle status="self_service,managed,managed_plus"/> {#model-timing-tab-in-jobs-}

[Вкладка Model timing](/docs/deploy/run-visibility#model-timing) в заданиях <Constant name="dbt" /> отображает состав моделей, порядок их выполнения и время, затраченное на каждую модель при запуске задания.

Вы можете открыть <Constant name="catalog" /> с **вкладки Model timing**, чтобы исследовать ресурсы, выявлять узкие места производительности, изучать зависимости и связи медленно выполняющихся моделей и вносить изменения для повышения их производительности.

#### Доступ к Catalog с вкладки Model timing

- В задании выберите **вкладку Model timing**.
- Наведите указатель на ресурс и выберите **View in <Constant name="catalog" />**, чтобы открыть его метаданные в <Constant name="catalog" />.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-model-timing.png" title="Откройте dbt Catalog с вкладки Model timing, наведя указатель на ресурс и нажав 'View in Explorer'." />

### dbt Insights <Lifecycle status="managed,managed_plus" />

Откройте <Constant name="catalog" /> из [<Constant name="insights" />](/docs/explore/access-dbt-insights), чтобы просмотреть граф зависимостей проекта и такие ресурсы, как таблицы, столбцы, метрики, измерения и многое другое.

Чтобы открыть <Constant name="catalog" /> из <Constant name="insights" />, выберите значок **<Constant name="catalog" />** в боковом меню Query console, а затем найдите нужный ресурс.

<Lightbox src="/img/docs/dbt-insights/insights-explorer.png" width="90%" title="Интеграция dbt Insights с dbt Catalog" />
