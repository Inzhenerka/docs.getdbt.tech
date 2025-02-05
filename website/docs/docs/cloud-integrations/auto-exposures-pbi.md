---
title: "Auto exposures in Power BI"
sidebar_label: "Auto exposures in Power BI"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg
---

# Auto exposures <Lifecycle status="enterprise" />

As a data team, it’s critical that you have context into the downstream use cases and users of your data products. Auto exposures integrates natively with Tableau and [auto-generates downstream lineage](#view-auto-exposures) in [dbt Explorer](/docs/collaborate/explore-projects) for a richer experience.

Auto exposures help data teams optimize their efficiency and ensure data quality by:

- Helping users understand how their models are used in downstream analytics tools to inform investments and reduce incidents — ultimately building trust and confidence in data products.
- Importing and auto-generating exposures based on Tableau dashboards, with user-defined curation.
- Enabling [active exposures](/docs/cloud-integrations/active-exposures) to refresh the underlying data sources (like Tableau extracts) during scheduled dbt jobs, improving timeliness and reducing costs. 
  - Active exposures is essentially a way to ensure that your Tableau extracts are updated regularly by using the [dbt Cloud job scheduler](/docs/deploy/deployments)
  - For more info on the differences between auto-exposures and active exposures, see the next section, [What's the difference between auto exposures and active exposures?](#whats-the-difference-between-auto-exposures-and-active-exposures).

<Expandable alt_header="What's the difference between auto exposures and active exposures?">

| Feature | Auto exposures | Active exposures <Lifecycle status="beta"/> |
| ---- | ---- | ---- |
| Purpose | Automatically brings downstream assets (like Tableau workbooks) into your dbt lineage. | Proactively refreshes the underlying data sources (like Tableau extracts) during scheduled dbt jobs. |
| Benefits | Provides visibility into data flow and dependencies. | Ensures BI tools always have up-to-date data without manual intervention. |
| Location  | Exposed in [dbt Explorer](/docs/collaborate/explore-projects) | Exposed in [dbt Cloud scheduler](/docs/deploy/deployments) |
| Use case | Helps users understand how models are used and reduces incidents. | Optimizes timeliness and reduces costs by running models when needed. |
</Expandable>

:::info Tableau Server
If you're using Tableau Server, you need to [allowlist dbt Cloud's IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) for your dbt Cloud region.
:::

## Set up auto exposures

Set up auto exposures in [Tableau](#set-up-in-tableau) and [dbt Cloud](#set-up-in-dbt-cloud) to ensure that your BI tools (like Tableau) extracts are updated regularly.

### Prerequisites

To enable auto exposures, you should meet the following:

1. Your environment and jobs are on a supported [release track](/docs/dbt-versions/cloud-release-tracks) dbt.
2. You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).
3. You have set up a [production](/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
4. You have [admin permissions](/docs/cloud/manage-access/enterprise-permissions) in dbt Cloud to edit project settings or production environment settings.
5. Use Tableau as your BI tool and enable metadata permissions or work with an admin to do so. Compatible with Tableau Cloud or Tableau Server with the Metadata API enabled. 
   - If you're using Tableau Server, you need to [allowlist dbt Cloud's IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) for your dbt Cloud region.
   - Currently, you can only connect to a single Tableau site on the same server. 

### Set up in Tableau

This section of the document explains the steps you need to set up the auto-exposures integration with Tableau. Once you've set this up in Tableau and [dbt Cloud](#set-up-in-dbt-cloud), you can view the [auto-exposures](#view-auto-exposures) in dbt Explorer.

To set up [personal access tokens (PATs)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm) needed for auto exposures, ask a site admin to configure it for the account.

1. Ensure you or a site admin enables PATs for the account in Tableau.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-enable-pat.jpg" title="Enable PATs for the account in Tableau"/>

2. Create a PAT that you can add to dbt Cloud to pull in Tableau metadata for auto exposures. Ensure the user creating the PAT has access to collections/folders, as the PAT only grants access matching the creator's existing privileges.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-create-pat.jpg" title="Create PATs for the account in Tableau"/>

3. Copy the **Secret** and the **Token name** and enter them in dbt Cloud. The secret is only displayed once, so store it in a safe location (like a password manager).
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-copy-token.jpg" title="Copy the secret and token name to enter them in dbt Cloud"/>

4. Copy the **Server URL** and **Sitename**. You can find these in the URL while logged into Tableau.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tablueau-serverurl.jpg" title="Locate the Server URL and Sitename in Tableau"/>

   For example, if the full URL is: `10az.online.tableau.com/#/site/dbtlabspartner/explore`:
   - The **Server URL** is the first part of the URL, in this case: `10az.online.tableau.com`
   - The **Sitename** is right after the `site` in the URL, in this case: `dbtlabspartner` 

5. You should now be ready to set up auto-exposures in dbt Cloud after copying the following items, which you'll need during the dbt Cloud setup: ServerURL, Sitename, Token name, and Secret.

### Set up in dbt Cloud <Lifecycle status="enterprise"/>

1. In dbt Cloud, navigate to the project you want to add the auto-exposures to and then select **Settings**.
2. Under the **Exposures** section, select **Add integration** to add the Tableau connection.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-add-integration.jpg" title="Select Add Integration to add the Tableau connection."/>
3. Enter the details for the exposure connection you collected from Tableau in the [previous step](#set-up-in-tableau) and click **Continue**. Note that all fields are case-sensitive.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-integration-details.jpg" title="Enter the details for the exposure connection."/>
4. Select the collections you want to include for auto exposures and click **Save**.
   
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-select-collections.jpg" title="Select the collections you want to include for auto exposures."/>

      :::info
      dbt Cloud automatically imports and syncs any workbook within the selected collections. New additions to the collections will be added to the lineage in dbt Cloud during the next sync (automatically once per day).
   
      dbt Cloud immediately starts a sync when you update the selected collections list, capturing new workbooks and removing irrelevant ones.
      :::

dbt Cloud imports everything in the collection(s) and you can continue to [view them](#view-auto-exposures) in Explorer. 

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="100%" title="View from the dbt Explorer in your Project lineage view, displayed with the Tableau icon."/>

## View auto-exposures

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>

## Active exposures <Lifecycle status="beta"/>

With [active exposures](/docs/cloud-integrations/active-exposures), you can now use dbt [Cloud job scheduler](/docs/deploy/job-scheduler) to proactively refresh the underlying data sources (extracts) that power your Tableau Workbooks.

- Active exposures integrate with auto exposures and uses your `dbt build` job to ensure that Tableau extracts are updated regularly.
- You can control the frequency of these refreshes by configuring environment variables in your dbt environment.

To set up active exposures in dbt Cloud, refer to [Active exposures](/docs/cloud-integrations/active-exposures).
