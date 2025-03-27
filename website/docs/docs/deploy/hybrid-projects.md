---
title: "Hybrid projects"
sidebar_label: "Hybrid projects"
description: "Learn how to upload dbt Core artifacts into dbt Cloud to create and set up hybrid projects."
pagination_next: "docs/deploy/hybrid-setup"
---

# Hybrid setup <Lifecycle status='beta,enterprise'/>

<IntroText>
With Hybrid projects, organizations that adopt a complementary dbt Core and dbt Cloud workflow (where some teams develop and run dbt projects in dbt Core while others use dbt Cloud) can now seamlessly integrate their workflows by uploading dbt Core [artifacts](/reference/artifacts/dbt-artifacts) into dbt Cloud.
</IntroText>

:::tip Available in private beta
To join the private beta, you must have an active dbt Cloud Enterprise account. Reach out to your account representative to join the beta.
:::

dbt Core users can seamlessly upload [artifacts](/reference/artifacts/dbt-artifacts) like [run results.json](/reference/artifacts/run-results-json), [manifest.json](/reference/artifacts/manifest-json), [catalog.json](/reference/artifacts/catalog-json), [sources.json](/reference/artifacts/sources-json), and so on into dbt Cloud after executing a dbt run in the command line interface (CLI). This also helps teams:

- Connect teams by bringing visibility so everyone can use dbt Core-generated artifacts in dbt Cloud.
- Enhance collaboration by sharing model metadata, dependencies, and run history across teams using dbt Cloud.
- Enable teams that work in dbt Core and dbt Cloud, particularly in [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) hybrid workflows, so that if an organization runs dbt Core locally or with external orchestration tools (like Airflow, Dagster), they can still collaborate with dbt Cloud.

## Prerequisites

To upload artifacts, make sure you meeting the following:

- Your organization is on a [dbt Cloud Enterprise plan](https://www.getdbt.com/pricing)
- You're on [dbt Cloud's release tracks](/docs/dbt-versions/cloud-release-tracks) or dbt Core v1.10 and higher
- You have a Hybrid projects toggle enabled in dbt Cloud’s **[Account settings](/docs/cloud/account-settings)** page
- Your dbt Core environment is configured to authenticate with dbt Cloud. (how?)
- Your dbt Core project is [configured with model access](/docs/deploy/hybrid-setup#make-dbt-core-models-public):
    - Models that you want to share with other dbt Cloud projects must use `access: public` in their model configuration. This makes the models more discoverable and shareable.
    - Learn more about [access modifier](/docs/collaborate/govern/model-access#access-modifiers) and how to set the [`access` config](/reference/resource-configs/access).
- Note, uploading artifacts won't count again dbt Cloud run slots.
