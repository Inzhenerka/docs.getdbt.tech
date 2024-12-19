---
title: "Авто-экспозиции"
sidebar_label: "Авто-экспозиции"
description: "Импортируйте и автоматически генерируйте экспозиции из панелей инструментов и понимайте, как модели используются в downstream-инструментах для более богатой линии."
pagination_prev: null
pagination_next:  "docs/collaborate/data-tile"
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg
---

# Авто-экспозиции <Lifecycle status="preview,enterprise" />

Для команды данных критически важно иметь контекст по downstream-применениям и пользователям ваших продуктов данных. Авто-экспозиции интегрируются нативно с Tableau (Power BI скоро) и автоматически генерируют downstream-линию в dbt Explorer для более богатого опыта.

Авто-экспозиции помогают пользователям понять, как их модели используются в инструментах аналитики downstream, чтобы информировать инвестиции и уменьшать инциденты — в конечном итоге создавая доверие и уверенность в продуктах данных. Они импортируют и автоматически генерируют экспозиции на основе панелей инструментов Tableau с определенной пользователем кураторской обработкой.

## Поддерживаемые планы
Авто-экспозиции доступны на плане [dbt Cloud Enterprise](https://www.getdbt.com/pricing/). В настоящее время вы можете подключиться только к одному сайту Tableau на одном сервере.

:::info Tableau Server
Если вы используете Tableau Server, вам необходимо [добавить IP-адреса dbt Cloud в белый список](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона dbt Cloud.
:::

Для получения дополнительной информации о том, как настроить авто-экспозиции, предварительных требованиях и многом другом — обратитесь к [настройке авто-экспозиций в Tableau и dbt Cloud](/docs/cloud-integrations/configure-auto-exposures).

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>