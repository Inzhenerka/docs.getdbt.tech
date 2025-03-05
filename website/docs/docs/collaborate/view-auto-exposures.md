---
title: "View auto exposures"
sidebar_label: "View auto exposures"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools and proactively refresh the underlying data sources (like Tableau extracts) during scheduled dbt jobs."
pagination_prev: null
pagination_next:  "docs/collaborate/data-tile"
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg
---

# View auto exposures <Lifecycle status="enterprise" />

As a data team, it’s critical that you have context into the downstream use cases and users of your data products. Auto-exposures integrate natively with Tableau (Power BI coming soon) and auto-generate downstream lineage in dbt Explorer for a richer experience.

Auto exposures help data teams optimize their efficiency and ensure data quality by:

- Helping users understand how their models are used in downstream analytics tools to inform investments and reduce incidents — ultimately building trust and confidence in data products.
- Importing and auto-generating exposures based on Tableau dashboards, with user-defined curation.
- Enabling [active exposures](/docs/cloud-integrations/active-exposures) to refresh the underlying data sources (like Tableau extracts) during scheduled dbt Cloud jobs, improving timeliness and reducing costs. 
  - Active exposures is essentially a way to ensure that your Tableau extracts are updated regularly by using the [dbt Cloud job scheduler](/docs/deploy/deployments).
  - For more info on the differences between auto-exposures and active exposures, see [Auto exposures and active exposures](/docs/cloud-integrations/active-and-auto-exposures).

To set up auto exposures in Tableau, prerequisites, and more &mdash; refer to [Auto exposures](/docs/cloud-integrations/auto-exposures-tableau).

### Supported plans
Auto exposures is available on the [dbt Cloud Enterprise](https://www.getdbt.com/pricing/) plan. Currently, you can only connect to a single Tableau site on the same server.

:::info Tableau Server
If you're using Tableau Server, you need to [allowlist dbt Cloud's IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) for your dbt Cloud region.
:::

## View auto exposures in dbt Explorer

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>
