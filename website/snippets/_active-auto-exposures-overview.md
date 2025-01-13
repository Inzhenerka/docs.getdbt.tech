Auto and active exposures are two ways to use dbt Cloud to automatically generate exposures from dashboards and proactively refresh the underlying data sources (like Tableau extracts) during scheduled dbt jobs.

The following table summarizes the differences between auto exposures and active exposures.

| Feature | Auto exposures | Active exposures <Lifecycle status="beta"/> |
| ---- | ---- | ---- |
| Location  | Exposed in [dbt Explorer](/docs/collaborate/explore-projects) | Exposed in [dbt Cloud scheduler](/docs/deploy/deployments) |
| Purpose | Automatically brings downstream assets (like Tableau workbooks) into your dbt lineage. | Proactively refreshes the underlying data sources (like Tableau extracts) during scheduled dbt jobs. |
| Benefits | Provides visibility into data flow and dependencies. | Ensures BI tools always have up-to-date data without manual intervention. |
| Use case | Helps users understand how models are used and reduces incidents. | Optimizes timeliness and reduces costs by running models when needed. |

Check out the following sections for more information on auto exposures and active exposures:

<div className="grid--2-col">

<Card
    title="Auto exposures"
    body="Import and auto-generate exposures from dashboards to understand how models are used in downstream tools for a richer downstream lineage."
    link="/docs/cloud-integrations/auto-exposures"
    icon="dbt-bit"/>

<Card
    title="Active exposures"
    link="/docs/cloud-integrations/active-exposures"
    body="Proactively refreshes the underlying data sources (like Tableau extracts) during scheduled dbt jobs."
    icon="dbt-bit"/>

</div>
