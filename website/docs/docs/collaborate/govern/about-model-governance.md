---
title: "About model governance"
id: about-model-governance
description: "Information about new features related to model governance"
pagination_next: "docs/collaborate/govern/model-access"
pagination_prev: null
---

[**Model access**](model-access): Some models are mature, reusable data productions. Others are your team's implementation details on the way there. Mark models as "public" or "private," to make the distinction clear and to control who else can `ref` them.

[**Model contracts**](model-contracts): Guarantee the shape of a model while it is building to avoid surprises or breaking changes for downstream queries. Explicitly define column names, data types, and constraints (as supported by your data platform).

[**Model versions**](model-versions): When a breaking change is unavoidable, provide a smoother upgrade pathway by creating a new version of the model. These model versions share a common reference name and can reuse properties & configurations.

[**Project dependencies**](/docs/collaborate/govern/project-dependencies): <Lifecycle status='enterprise'/> Use cross project dependencies to reference public models across dbt projects using the [two-argument ref](/reference/dbt-jinja-functions/ref#ref-project-specific-models), which includes the project name. 

:::info Considerations

Features like data contracts and model versions strengthen trust and stability in your project. These features increase the strictness of your project, which can make it harder to roll changes back later (like removing data contracts or deprecating or removing model versions) and can add maintenance overhead if adopted too early. 

Before adding governance features, ask yourself whether your dbt project is ready to benefit from model governance features. Introducing them too early can create challenges in the future if requirements shift or models need to evolve quickly.
:::
