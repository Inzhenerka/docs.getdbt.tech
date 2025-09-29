---
title: "Navigating the state-aware orchestration interface"
sidebar_label: "Navigating the interface"
description: "Learn how to navigate the state-aware orchestration interface for better visibility into model builds and cost tracking." 
id: "state-aware-interface"
tags: ['scheduler','SAO', 'cost savings', 'models built']
---

<IntroText>

Learn how to navigate the state-aware orchestration interface for better visibility into model builds and cost tracking.

</IntroText>

## Models built and reused chart

When you go to your **Account home**, you'll see a chart showing the number of models built and reused, giving you visibility into how state-aware orchestration is optimizing your data builds. This chart helps you to:

- **Track effectiveness of state-aware orchestration** - See how state-aware orchestration reduces unnecessary model rebuilds by only building models when there's fresh upstream data⁠. This chart provides transparency into how the optimization is working across your dbt implementation.
⁠
- **Analyze build patterns** - Gain insights into your project's build frequency and identify opportunities for further optimization.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/account-home-chart.png" width="90%" title="Models built and reused chart in Account home"/>

## Clear cache button

State-aware orchestration uses a cached hash of both code and data state for each model in an environment stored in Redis. When running a job, dbt checks if there is a change in the hash for the model being built between the saved state in Redis and the current state that would be built by the job. If there is a change, dbt builds the model, and if there isn’t, dbt reuses the model from the last time it was built.

When you want to wipe this state clean and start again, you can clear the cache by clicking the **Clear cache** button on the **Orchestration** > **Environments** page. The **Clear cache** button is only available if you have enabled state-aware orchestration.

<!--insert screenshot-->

After clearing the cache, the next run rebuilds every model from scratch. Subsequent runs rely on the regenerated cache.

## Logs view of built models

When running a job, a structured logs view shows which models were built, skipped, or reused. 

<!--insert screenshot of logs with numbered callouts-->

1. The **Reused** tab indicates the total number of resued models.
2. Reused models are highlighted in the logs. 
3. You can use the search bar and filter the logs to show **All**, **Success**, **Warning**, **Failed**, **Running**, **Skipped**, **Reused**, **Debugged** messages.
4. Detailed log messages are provided to get more context on why models were reused. 

## Model consumption view

State-aware jobs provide charts that show information about your job runs, and how many models were built and reused by your job per week. In the **Overview** section of your job, the following charts are available: 

Under the **Runs** tab:
- **Recent runs**
- **Total run duration time** 

<!--insert screenshot-->

Under the **Models** tab:
- **Models built** 
- **Models reused**

<!--insert screenshot-->

## Lens for state-aware orchestration

Lineage lenses are interactive visual filters in [dbt <Constant name="explorer" />](/docs/explore/explore-projects#lenses) that show additional context on your lineage graph to understand how resources are defined or performing. When you apply a lens, tags become visible on the nodes in the lineage graph, indicating the layer value along with coloration based on that value.

The **Latest status** lens shows the status from the latest execution of the resource in the current environment. Nodes can be tagged with any of the following:
<!--Please check accuracy of the description-->
For sources:

- **PASS** - Source freshness check passed, indicating data is fresh⁠
- **WARN** - Source freshness check returned a warning, indicating data may be getting stale⁠
- **ERROR** - Source freshness check failed, indicating stale data.
- **UNKNOWN** - No freshness check has been configured or run for this source.

For models:

- **SKIPPED** - Model was skipped during the latest run.
- **SUCCESS** - Model built successfully during the latest run.
- **FAIL** - <!--when are models tagged with this?-->
- **ERROR** - Model failed to build during the latest run.
- **WARN** - Model built with warnings during the latest run.
- **REUSED** - Model execution was reused from state-aware orchestration, avoiding unnecessary rebuilds.
- **UNKOWN** - No execution status is available, typically when no job runs have processed the resource.

<!--insert screenshot-->

To view this lens:

1. From the main menu, go to **Catalog**. 
2. Select your project. 
3. Click **View lineage**.
    The lineage for your project appears.
4. In the **Lenses** field, select **Latest status**. 