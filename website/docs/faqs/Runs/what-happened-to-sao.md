---
title: Что произошло с оркестрацией с учетом состояния?
description: "Узнайте, почему оркестрация с учетом состояния больше недоступна новым клиентам и как перейти на dbt State."
sidebar_label: 'Что произошло с оркестрацией с учетом состояния?'
id: what-happened-to-sao
---

import DbtStateVsSao from '/snippets/_dbt-state-vs-sao.md';

1 июня 2026 года dbt Labs и Fivetran представили **[dbt State](/docs/deploy/dbt-state-about)** — новую улучшенную версию оркестрации с учетом состояния. Одна из ключевых возможностей — [`lag_tolerance`](/reference/resource-configs/lag-tolerance): этот параметр определяет, сколько времени должно пройти с момента последнего изменения данных в вышестоящих узлах, прежде чем узел можно будет пересобрать.

<DbtStateVsSao />

Чтобы начать работу, обратитесь к руководству [Переход с оркестрации с учетом состояния](/docs/deploy/dbt-state-migration).
