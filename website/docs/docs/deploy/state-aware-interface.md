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

- **Track effectiveness of state-aware orchestration** &mdash; See how state-aware orchestration reduces unnecessary model rebuilds by only building models when there's fresh upstream data⁠. This chart provides transparency into how the optimization is working across your dbt implementation.
⁠
- **Analyze build patterns** &mdash; Gain insights into your project's build frequency and identify opportunities for further optimization.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/account-home-chart.png" width="90%" title="Models built and reused chart in Account home"/>

## Model consumption view in jobs

State-aware jobs provide charts that show information about your job runs, and how many models were built and reused by your job in the past week, in the last 14 days, or in the last 30 days. In the **Overview** section of your job, the following charts are available: 

Under the **Runs** tab:
- **Recent runs**
- **Total run duration time** 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/sao-runs-chart.png" width="90%" title="Charts for Recent runs and Total run duration time"/>

Under the **Models** tab:
- **Models built** 
- **Models reused**

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/sao-models-chart.png" width="90%" title="Charts for Models built and Models reused"/>

## Logs view of built models

When running a job, a structured logs view shows which models were built, skipped, or reused. 

<!--insert screenshot of logs with numbered callouts-->

1. The **Reused** tab indicates the total number of resued models.
2. Reused models are highlighted in the logs. 
3. You can use the search bar and filter the logs to show **All**, **Success**, **Warning**, **Failed**, **Running**, **Skipped**, **Reused**, **Debugged** messages.
4. Detailed log messages are provided to get more context on why models were reused. 

## Lens for state-aware orchestration

Lineage lenses are interactive visual filters in [dbt <Constant name="explorer" />](/docs/explore/explore-projects#lenses) that show additional context on your lineage graph to understand how resources are defined or performing. When you apply a lens, tags become visible on the nodes in the lineage graph, indicating the layer value along with coloration based on that value. If you're significantly zoomed out, only the tags and their colors are visible in the graph.

The **Latest status** lens shows the status from the latest execution of the resource in the current environment. Nodes can be tagged with any of the following:

- **Skipped** - Model was skipped during the latest run.
- **Success** - Model built successfully during the latest run.
- **Fail** - <!--when are models tagged with this?-->
- **Error** - Model failed to build during the latest run.
- **Warn** - Model built with warnings during the latest run.
- **Reused** - Model execution was reused from state-aware orchestration, avoiding unnecessary rebuilds.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/sao-latest-status-lens.png" width="90%" title="Using the Latest status lens"/>

To view your lineage with the **Latest status** lens:

1. From the main menu, go to **Orchestration** > **Runs**. 
2. Select your run. 
3. Go to the **Lineage** tab.
    The lineage of your project appears.
4. In the **Lenses** field, select **Latest status**.

## Clear cache button

State-aware orchestration uses a cached hash of both code and data state for each model in an environment stored in Redis. When running a job, dbt checks if there are changes in the hash for the model being built between the saved state in Redis and the current state that would be built by the job. If there is a change, dbt builds the model. If there are no changes, dbt reuses the model from the last time it was built.

When you want to wipe this state clean and start again, you can clear the cache by clicking the **Clear cache** button on the **Orchestration** > **Environments** page. The **Clear cache** button is only available if you have enabled state-aware orchestration.

<!--insert screenshot-->

After clearing the cache, the next run rebuilds every model from scratch. Subsequent runs rely on the regenerated cache.