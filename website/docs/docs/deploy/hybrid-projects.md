---
title: "About Hybrid projects"
sidebar_label: "About Hybrid projects"
description: "Learn how to upload dbt Core artifacts into dbt Cloud to create and set up hybrid projects."
pagination_next: "docs/deploy/hybrid-setup"
---

# About Hybrid projects <Lifecycle status='beta,enterprise'/>

<IntroText>
With Hybrid projects, your organization can adopt complementary dbt Core and dbt Cloud workflows (where some teams develop and run dbt projects in dbt Core while others use dbt Cloud) and seamlessly integrate these workflows by automatically uploading dbt Core [artifacts](/reference/artifacts/dbt-artifacts) into dbt Cloud.
</IntroText>

:::tip Available in private beta
Hybrid projects is available in private beta to [dbt Cloud Enterprise accounts](https://www.getdbt.com/pricing). To register your interest in the beta, reach out to your account representative.
:::

dbt Core users can seamlessly upload [artifacts](/reference/artifacts/dbt-artifacts) like [run results.json](/reference/artifacts/run-results-json), [manifest.json](/reference/artifacts/manifest-json), [catalog.json](/reference/artifacts/catalog-json), [sources.json](/reference/artifacts/sources-json), and so on into dbt Cloud after executing a `dbt run` in the command line interface (CLI), which helps:

- Connect teams by bringing visibility so everyone can use dbt Core-generated artifacts in dbt Cloud.
- Enhance collaboration by sharing model metadata, dependencies, and run history across teams using dbt Cloud.
- Enable teams that work in dbt Core and dbt Cloud, particularly in [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) hybrid workflows, so that if an organization runs dbt Core locally or with external orchestration tools (like Airflow, Dagster), they can still collaborate with dbt Cloud.

## Prerequisites

To upload artifacts, make sure you meeting the following:

- Your organization is on a [dbt Cloud Enterprise plan](https://www.getdbt.com/pricing)
- You're on [dbt Cloud's release tracks](/docs/dbt-versions/cloud-release-tracks) or dbt Core v1.10 and higher
- Enabled the hybrid projects toggle in dbt Cloud’s **[Account settings](/docs/cloud/account-settings)** page
- [Configured](/docs/deploy/hybrid-setup#connect-project-in-dbt-cloud) a hybrid project in dbt Cloud.
- Updated your existing dbt Core project with latest changes and [configured it with model access](/docs/deploy/hybrid-setup#make-dbt-core-models-public):
    - Ensure models that you want to share with other dbt Cloud projects use `access: public` in their model configuration. This makes the models more discoverable and shareable.
    - Learn more about [access modifier](/docs/collaborate/govern/model-access#access-modifiers) and how to set the [`access` config](/reference/resource-configs/access).
- [dbt Cloud permissions](/docs/cloud/manage-access/enterprise-permissions) to create a new project in dbt Cloud.
- Note, uploading artifacts won't count again dbt Cloud run slots.
