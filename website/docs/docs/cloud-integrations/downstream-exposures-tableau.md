---
title: "Configure exposures automatically"
sidebar_label: "Configure exposures automatically"
description: "Configure and visualize exposures automatically by auto-generating them from Tableau dashboards, helping you understand how models are used in downstream tools for a richer lineage."
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg
---

# Configure exposures automatically <Lifecycle status="enterprise" />

<IntroText>
Configure and automatically populate downstream exposures for supported BI tool integrations. Visualize and orchestrate them through <a href="https://docs.getdbt.com/docs/collaborate/explore-projects">dbt Explorer</a> and the [dbt Cloud job scheduler](/docs/deploy/job-scheduler) for a richer experience.

</IntroText>

As a data team, it’s critical that you have context into the downstream use cases and users of your data products. In dbt Cloud, you can configure downstream exposures in two ways:
- Manual &mdash; Defined [manually](/docs/build/exposures#declaring-an-exposure) and explicitly in your project’s YAML files.
- Automatic &mdash; Pulled automatically for supported dbt Cloud integrations. dbt Cloud automatically creates and visualizes downstream exposures, removing the need for manual YAML definitions. These downstream exposures are stored in dbt’s metadata system, appear in [dbt Explorer](/docs/collaborate/explore-projects), and behave like manual exposures, however they don’t exist in YAML files.

By leveraging downstream [exposures](/docs/build/exposures) automatically, you can:

- Gain a better understanding of how models are used in downstream analytics, improving governance and decision-making.
- Reduce incidents and optimize workflows by linking upstream models to downstream dependencies.
- Automate exposure tracking for supported BI tools, ensuring lineage is always up to date.
- [Orchestrate exposures](/docs/cloud-integrations/orchestrate-exposures) to refresh the underlying data sources during scheduled dbt jobs, improving timeliness and reducing costs. Orchestrating exposures is a way to ensure that your BI tools are updated regularly using the [dbt Cloud job scheduler](/docs/deploy/job-scheduler). See the [previous page](/docs/cloud-integrations/downstream-exposures) for more info.

:::info Tableau Server
If you're using Tableau Server, you need to add the [dbt Cloud IP addresses for your region](/docs/cloud/about-cloud/access-regions-ip-addresses) to your allowlist.
:::

## Prerequisites

To configure downstream exposures automatically, you should meet the following:

1. Your environment and jobs are on a supported [dbt Cloud release track](/docs/dbt-versions/cloud-release-tracks).
2. You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).
3. You have set up a [production](/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
4. You have [admin permissions](/docs/cloud/manage-access/enterprise-permissions) in dbt Cloud to edit project settings or production environment settings.
5. Use Tableau as your BI tool and enable metadata permissions or work with an admin to do so. Compatible with Tableau Cloud or Tableau Server with the Metadata API enabled.

### Considerations
import ConsiderationsTableau from '/snippets/_auto-exposures-considerations-tb.md';

<ConsiderationsTableau/>

## Set up downstream exposures

Set up downstream exposures in [Tableau](#set-up-in-tableau) and [dbt Cloud](#set-up-in-dbt-cloud) to ensure that your BI tool's extracts are updated automatically.

### Set up in Tableau

This section of the document explains the steps you need to set up downstream exposures integration with Tableau. Once you've set this up in Tableau and [dbt Cloud](#set-up-in-dbt-cloud), you can [view the downstream exposures](#view-downstream-exposures) in dbt Explorer.

1. Enable [personal access tokens (PATs)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm) for your Tableau account.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-enable-pat.jpg" title="Enable PATs for the account in Tableau"/>

2. Create a PAT to add to dbt Cloud to pull in Tableau metadata for the downstream exposures. When creating the token, you must have permission to access collections/folders, as the PAT only grants access matching the creator's existing privileges.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-create-pat.jpg" title="Create PATs for the account in Tableau"/>

3. Copy the **Secret** and the **Token name** and enter them in dbt Cloud. The secret is only displayed once, so store it in a safe location (like a password manager).
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-copy-token.jpg" title="Copy the secret and token name to enter them in dbt Cloud"/>

4. Copy the **Server URL** and **Sitename**. You can find these in the URL while logged into Tableau.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tablueau-serverurl.jpg" title="Locate the Server URL and Sitename in Tableau"/>

   For example, if the full URL is: `10az.online.tableau.com/#/site/dbtlabspartner/explore`:
   - The **Server URL** is the first part of the URL, in this case: `10az.online.tableau.com`
   - The **Sitename** is right after the `site` in the URL, in this case: `dbtlabspartner` 

5. You should now be ready to set up downstream exposures in dbt Cloud after copying the following items, which you'll need during the dbt Cloud setup: 
      - ServerURL
      - Sitename
      - Token name
      - Secret

### Set up in dbt Cloud

1. In dbt Cloud, navigate to the project you want to add the downstream exposure to and then select **Settings**.
2. Under the **Exposures** section, select **Add integration** to add the Tableau connection.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-add-integration.jpg" title="Select Add Integration to add the Tableau connection."/>
3. Enter the details for the exposure connection you collected from Tableau in the [previous step](#set-up-in-tableau) and click **Continue**. Note that all fields are case-sensitive.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-integration-details.jpg" title="Enter the details for the exposure connection."/>
4. Select the collections you want to include for the downstream exposures and click **Save**.
   
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-select-collections.jpg" title="Select the collections you want to include for the downstream exposures."/>

      :::info
      dbt Cloud automatically imports and syncs any workbook within the selected collections. New additions to the collections will be added to the lineage in dbt Cloud during the next sync (automatically once per day).
   
      dbt Cloud immediately starts a sync when you update the selected collections list, capturing new workbooks and removing irrelevant ones.
      :::

5. dbt Cloud imports everything in the collection(s) and you can continue to [view them](#view-auto-exposures) in Explorer. 

   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="100%" title="View from the dbt Explorer in your Project lineage view, displayed with the Tableau icon."/>

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>

## Orchestrate exposures <Lifecycle status="beta"/>

[Orchestrate exposures](/docs/cloud-integrations/orchestrate-exposures) using the dbt [Cloud job scheduler](/docs/deploy/job-scheduler) to proactively refresh the underlying data sources (extracts) that power your Tableau Workbooks.

- Running exposures with a job run integrates with downstream exposures and uses your `dbt build` job to ensure that Tableau extracts are updated regularly and automatically.
- You can control the frequency of these refreshes by configuring environment variables in your dbt environment.

To set up and proactively run exposures with the dbt Cloud job scheduler, refer to [Orchestrate exposures](/docs/cloud-integrations/orchestrate-exposures).
