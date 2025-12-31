---
title: "Визуализация downstream exposures"
sidebar_label: "Визуализация downstream exposures"
description: "Автоматически настраивайте downstream exposures на основе дашбордов и понимайте, как модели используются в downstream‑инструментах, чтобы получить более богатую downstream lineage."
pagination_prev: null
pagination_next:  "docs/explore/data-tile"
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg
---

# Визуализируйте downstream exposures <Lifecycle status="managed,managed_plus" /> {#visualize-downstream-exposures}

<IntroText>
Downstream exposures нативно интегрируются с Tableau (поддержка Power BI скоро появится) и автоматически генерируют downstream lineage в <Constant name="explorer" />, обеспечивая более насыщенный и наглядный опыт.
</IntroText>

Для команды данных крайне важно иметь контекст о downstream‑сценариях использования и пользователях ваших data‑продуктов. Используя downstream [exposures](/docs/build/exposures) в автоматическом режиме, команды данных могут:

- Лучше понимать, как модели используются в downstream‑аналитике, что улучшает управление (governance) и принятие решений.
- Снижать количество инцидентов и оптимизировать рабочие процессы за счёт связывания upstream‑моделей с downstream‑зависимостями.
- Автоматизировать отслеживание exposures для поддерживаемых BI‑инструментов, гарантируя, что lineage всегда актуален.
- [Оркестрировать exposures](/docs/cloud-integrations/orchestrate-exposures) для обновления базовых источников данных во время запланированных dbt‑джобов, повышая своевременность обновлений и снижая затраты. Оркестрация exposures по сути является способом гарантировать регулярное обновление ваших BI‑инструментов с использованием [планировщика заданий <Constant name="cloud" />](/docs/deploy/deployments).
  - Подробнее о различиях между визуализацией и оркестрацией exposures см. [Visualize and orchestrate downstream exposures](/docs/cloud-integrations/downstream-exposures).

Чтобы настроить автоматическую конфигурацию downstream exposures из дашбордов Tableau, ознакомиться с предварительными требованиями и получить дополнительную информацию, см. [Configure downstream exposures](/docs/cloud-integrations/downstream-exposures-tableau).

### Поддерживаемые планы {#supported-plans}

Downstream exposures доступны во всех планах уровня Enterprise для <Constant name="cloud" /> ([подробнее о тарифах](https://www.getdbt.com/pricing/)). В настоящее время можно подключить только один сайт Tableau на одном и том же сервере.

:::info Tableau Server
Если вы используете Tableau Server, необходимо [добавить IP‑адреса <Constant name="cloud" /> в allowlist](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона <Constant name="cloud" />.
:::

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>
