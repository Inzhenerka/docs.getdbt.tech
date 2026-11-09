---
title: "Визуализация downstream exposures"
sidebar_label: "Визуализация downstream exposures"
description: "Автоматически настраивайте downstream exposures на основе дашбордов и понимайте, как модели используются в downstream‑инструментах, чтобы получить более богатую downstream lineage."
pagination_prev: null
pagination_next:  "docs/explore/data-tile"
image: /img/docs/platform-integrations/auto-exposures/explorer-lineage.png
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

# Визуализация нижестоящих exposures

<IntroText>
Нижестоящие exposures напрямую интегрируются с Tableau и автоматически формируют граф происхождения данных для нижестоящих зависимостей в <Constant name="catalog" />, расширяя возможности работы с ним.
</IntroText>

Для команды данных крайне важно иметь контекст о downstream‑сценариях использования и пользователях ваших data‑продуктов. Используя downstream [exposures](/docs/build/exposures) в автоматическом режиме, команды данных могут:

- Лучше понимайте, как модели используются в аналитике на последующих этапах, совершенствуя управление данными и принятие решений.
- Сокращайте число инцидентов и оптимизируйте рабочие процессы, связывая вышестоящие модели с зависимыми от них нижестоящими объектами.
- Автоматизируйте отслеживание exposures для поддерживаемых BI-инструментов, чтобы информация о происхождении и связях данных всегда оставалась актуальной.
- [Оркестрируйте exposures](/docs/platform-integrations/orchestrate-exposures), чтобы обновлять используемые ими источники данных во время выполнения заданий dbt по расписанию, повышая своевременность обновлений и сокращая затраты. По сути, оркестрация exposures — это способ обеспечить регулярное обновление BI-инструментов с помощью [планировщика заданий <Constant name="dbt" />](/docs/deploy/deployments).
  - Подробнее о различиях между визуализацией и оркестрацией exposures см. в разделе [Визуализация и оркестрация нижестоящих exposures](/docs/platform-integrations/downstream-exposures).

Сведения об автоматической настройке нижестоящих exposures на основе дашбордов Tableau, предварительных требованиях и других аспектах см. в разделе [Настройка нижестоящих exposures](/docs/platform-integrations/downstream-exposures-tableau).

### Поддерживаемые планы {#supported-plans}

Нисходящие экспозиции доступны во всех [тарифных планах Enterprise](https://www.getdbt.com/pricing/) <Constant name="dbt" />. В настоящее время можно подключиться только к одному сайту Tableau на одном и том же сервере.

:::info Tableau Server
Если вы используете Tableau Server, необходимо [добавить IP-адреса <Constant name="dbt" /> в список разрешённых](/docs/platform/about-platform/access-regions-ip-addresses) для вашего региона <Constant name="dbt" />.
:::

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>
