---
title: "Active exposures"
id: "active-exposures"
sidebar_label: "Active exposures"
description: "Use dbt to proactively refresh the underlying data sources (like Tableau extracts) during scheduled dbt jobs."
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg
---

# Active exposures <Lifecycle status="enterprise, beta" />

With active exposures, you can now use dbt [Cloud job scheduler](/docs/deploy/job-scheduler) to proactively refresh the underlying data sources (extracts) that power your Tableau Workbooks.

- Active exposures integrate with [auto exposures](/docs/cloud-integrations/auto-exposures) and uses your `dbt build` job to ensure that Tableau extracts are updated regularly.
  - Auto exposures is a way to automatically bring downstream assets (like Tableau workbooks) into your [dbt Explorer lineage](/docs/collaborate/explore-projects).
- You can control the frequency of these refreshes by configuring environment variables in your dbt environment.

<Expandable alt_header="What's the difference between auto exposures and active exposures?">

| Feature | Auto exposures | Active exposures <Lifecycle status="beta"/> |
| ---- | ---- | ---- |
| Purpose | Automatically brings downstream assets (like Tableau workbooks) into your dbt lineage. | Proactively refreshes the underlying data sources (like Tableau extracts) during scheduled dbt jobs. |
| Benefits | Provides visibility into data flow and dependencies. | Ensures BI tools always have up-to-date data without manual intervention. |
| Location  | Exposed in [dbt Explorer](/docs/collaborate/explore-projects) | Exposed in [dbt Cloud scheduler](/docs/deploy/deployments) |
| Use case | Helps users understand how models are used and reduces incidents. | Optimizes timeliness and reduces costs by running models when needed. |

</Expandable>

## Prerequisites

To enable active exposures, you should meet the following:

1. You have [auto exposures](/docs/cloud-integrations/auto-exposures#set-up-auto-exposures) already set up.
2. Your environment and jobs are on a supported [release track](/docs/dbt-versions/cloud-release-tracks) dbt.
3. You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).
4. You have set up a [production](/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
5. You have [admin permissions](/docs/cloud/manage-access/enterprise-permissions) in dbt Cloud to edit project settings or production environment settings.

## Set up active exposures

To set up active exposures:

1. Ensure you have [Auto exposures enabled for Tableau](#set-up-active-exposures) and the desired exposures are included in your lineage.
2. Set the environment level variable `DBT_ACTIVE_EXPOSURES` to `1` within the environment you want the refresh to happen.
3. Set `DBT_ACTIVE_EXPOSURES_BUILD_AFTER` to control the maximum refresh cadence (in minutes) you want between each exposure refresh. 
   - Set to 1440 minutes (24 hours) by default, meaning that even for auto exposures that depend on more frequently running models, active exposures will not refresh the Tableau extracts more often than this period. 
   - Job runs will display the status of `skipped` for the auto-exposure if enough time hasn't yet passed.
4. You will see the update each time a job runs in production 
   - This can be viewed in the logs of the dbt run
      <Lightbox src="/img/docs/cloud-integrations/auto-exposures/active-exposure-log.jpg" title="View the active exposure logs in the dbt run job logs."/ >
   - More details can also be viewed in the debug logs
