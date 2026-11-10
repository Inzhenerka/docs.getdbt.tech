---
title: "Использование dbt State"
id: dbt-state-usage
description: "Узнайте, как учитывается использование dbt State и рассчитывается его стоимость."
sidebar_label: "Использование dbt State"
availability: everywhere_usage
---

import DbtStatePricing from '/snippets/_dbt-state-pricing.md';
import DbtStateTrialHowItWorks from '/snippets/_dbt-state-trial-how-it-works.md';
import DbtStateFreePlan from '/snippets/_dbt-state-free-plan.md';

[dbt State](/docs/deploy/dbt-state-about) позволяет dbt повторно использовать узлы, клонируя их из другого расположения или пропуская повторное построение, если логика и данные не изменились. Это отдельный продукт с оплатой по фактическому использованию, доступный пользователям <Constant name="core" />, <Constant name="dbt_platform" /> и <Constant name="fusion_engine" />. Узнайте подробнее о том, как объём использования влияет на стоимость, чтобы эффективно планировать экономию.

## Как работает пробный период

<DbtStateTrialHowItWorks />

## Как рассчитывается оплата

<DbtStatePricing />

## Бесплатный ежемесячный лимит DATT {#free-monthly-datt-allowance}

<DbtStateFreePlan />
