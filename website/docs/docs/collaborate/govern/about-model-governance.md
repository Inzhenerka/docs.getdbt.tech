---
title: "About model governance"
id: about-model-governance
description: "Information about new features related to model governance"
pagination_next: "docs/collaborate/govern/model-access"
pagination_prev: null
hide_table_of_contents: true
---

dbt supports model governance to help you control who can access models, what data they contain, how they change over time, and reference them across projects. dbt supports model governance in dbt Core and dbt Cloud, with some differences in the features available across environments/plans.

- Use model governance to define model structure and visibility in dbt Core and dbt Cloud.
- dbt Cloud builds on this with features like [cross-project ref](/docs/collaborate/govern/project-dependencies) that enable collaboration at scale across multiple projects, powered by its metadata service and [dbt Explorer](/docs/collaborate/explore-projects). Available in dbt Cloud Enterprise plans.

The following table shows which features are available:

| Feature | About the feature | dbt Core | dbt Cloud (Team/Developer) | dbt Cloud (Enterprise) |
|--------|-------------------|----------|-----------------------------|-------------------------|
| [**Model access**](model-access) | Some models are mature, reusable data productions. Others are your team's implementation details on the way there. Mark models as "public" or "private" to make the distinction clear and control who can `ref` them. | ✅ | ✅ | ✅ |
| [**Model contracts**](model-contracts) | Guarantee the shape of a model while it is building to avoid surprises or breaking changes for downstream queries. Explicitly define column names, data types, and constraints (as supported by your data platform). | ✅ | ✅ | ✅ |
| [**Model versions**](model-versions) | When a breaking change is unavoidable, provide a smoother upgrade pathway by creating a new version of the model. These versions share a common reference name and can reuse properties and configurations. | ✅ | ✅ | ✅ |
| [**Project dependencies**](/docs/collaborate/govern/project-dependencies) | Reference public models across dbt projects using the [two-argument ref](/reference/dbt-jinja-functions/ref#ref-project-specific-models), which includes the project name. | ⚠️ <br/> Works with [packages](/docs/build/packages) that imports _all_ models from upstream projects. | ⚠️ <br/> Same as dbt Core | ✅ <br/> Enables you to reference only public models without importing the full project. Enhanced with [dbt Explorer](/docs/collaborate/explore-projects) and metadata service. |


import ModelGovernanceRollback from '/snippets/_model-governance-rollback.md';

<ModelGovernanceRollback />
