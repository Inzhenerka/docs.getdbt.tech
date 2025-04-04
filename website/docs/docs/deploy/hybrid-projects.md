---
title: "About Hybrid projects"
sidebar_label: "About Hybrid projects"
description: "Learn how to upload dbt Core artifacts into dbt Cloud to create and set up hybrid projects."
pagination_next: "docs/deploy/hybrid-setup"
---

# About Hybrid projects <Lifecycle status='beta,enterprise'/>

<IntroText>
With Hybrid projects, your organization can adopt complementary dbt Core and dbt Cloud workflows (where some teams develop projects in dbt Core and others in dbt Cloud) and seamlessly integrate these workflows by automatically uploading dbt Core [artifacts](/reference/artifacts/dbt-artifacts) into dbt Cloud.
</IntroText>

:::tip Available in private beta
Hybrid projects is available in private beta to [dbt Cloud Enterprise accounts](https://www.getdbt.com/pricing). To register your interest in the beta, reach out to your account representative.
:::

dbt Core users can seamlessly upload [artifacts](/reference/artifacts/dbt-artifacts) like [run results.json](/reference/artifacts/run-results-json), [manifest.json](/reference/artifacts/manifest-json), [catalog.json](/reference/artifacts/catalog-json), [sources.json](/reference/artifacts/sources-json), and so on &mdash; into dbt Cloud after executing a run in the command line interface (CLI), which helps:

- Collaborate with dbt Cloud users by enabling them to visualize and perform [cross-project references](/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref) to dbt models that live in Core projects.
- (Coming soon) New users interested in the [Visual Editor](/docs/cloud/visual-editor) can build off of dbt models already created by a central data team in dbt Core rather than having to start from scratch.
- dbt Core users can navigate to [dbt Explorer](/docs/collaborate/explore-projects) and view their models and assets. To view dbt Explorer, you must have a [read-only seat](/docs/cloud/manage-access/seats-and-users).

## Prerequisites

To upload artifacts, make sure you meet these prerequisites:

- Your organization is on a [dbt Cloud Enterprise plan](https://www.getdbt.com/pricing)
- You're on [dbt Cloud's release tracks](/docs/dbt-versions/cloud-release-tracks) and your dbt Core project is on dbt v1.10 or higher
- Enabled the hybrid projects toggle in dbt Cloud’s **[Account settings](/docs/cloud/account-settings)** page
- [Configured](/docs/deploy/hybrid-setup#connect-project-in-dbt-cloud) a hybrid project in dbt Cloud.
- Updated your existing dbt Core project with latest changes and [configured it with model access](/docs/deploy/hybrid-setup#make-dbt-core-models-public):
    - Ensure models that you want to share with other dbt Cloud projects use `access: public` in their model configuration. This makes the models more discoverable and shareable
    - Learn more about [access modifier](/docs/collaborate/govern/model-access#access-modifiers) and how to set the [`access` config](/reference/resource-configs/access)
- Update [dbt Cloud permissions](/docs/cloud/manage-access/enterprise-permissions) to create a new project in dbt Cloud

**Note:** Uploading artifacts doesn't count against dbt Cloud run slots.
