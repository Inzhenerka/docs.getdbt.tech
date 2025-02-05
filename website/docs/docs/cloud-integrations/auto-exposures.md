---
title: "Auto exposures"
sidebar_label: "Auto exposures"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg
---

# Auto exposures <Lifecycle status="enterprise" />

As a data team, it’s critical that you have context into the downstream use cases and users of your data products. Auto exposures integrates natively with Tableau and Power BI to [auto-generates downstream lineage](#view-auto-exposures) in [dbt Explorer](/docs/collaborate/explore-projects) for a richer experience.

Auto exposures help data teams optimize their efficiency and ensure data quality by:

- Helping users understand how their models are used in downstream analytics tools to inform investments and reduce incidents — ultimately building trust and confidence in data products.
- Importing and auto-generating exposures based on your BI tools' dashboards, with user-defined curation.
- Enabling [active exposures](/docs/cloud-integrations/active-exposures) to refresh the underlying data sources during scheduled dbt jobs, improving timeliness and reducing costs. 
  - Active exposures is essentially a way to ensure that your BI tools are updated regularly by using the [dbt Cloud job scheduler](/docs/deploy/deployments). See the [previous section](/docs/cloud-integrations/active-and-auto-exposures) for more info on the differences between auto-exposures and active exposures.

Select the following card to learn how to set up and view auto exposures in Tableau or Power BI.

<div className="grid--2-col">

<Card
    title="Auto exposures in Tableau"
    link="/docs/cloud-integrations/auto-exposures-tableau"
    body="Import and auto-generate exposures from Tableau dashboards, helping you understand how models are used in downstream tools for a richer downstream lineage."
    icon="tableau-software"/>

<Card
    title="Auto exposures in Power BI (preview)"
    link="/docs/cloud-integrations/auto-exposures-power-bi"
    body="Import and auto-generate exposures from Power BI dashboards. This helps you understand how models are used in downstream tools for a richer downstream lineage."
    icon="pbi"/>

</div>
