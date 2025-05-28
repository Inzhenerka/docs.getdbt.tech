---
title: "Path to GA: How the dbt Fusion engine rolls out from beta to production"
description: "We're moving quickly to enable as many teams as possible to start using the new dbt Fusion engine. Check out our roadmap and learn how to follow our progress."
slug: dbt-fusion-engine-path-to-ga
image: /img/blog/2025-05-28-dbt-fusion-engine-path-to-ga/indicative-timeline.png
authors: [jeremy_cohen, joel_labes]
tags: [data ecosystem]
hide_table_of_contents: false
date: 2025-05-28
is_featured: true
---

The dbt Fusion engine is [available today in beta](https://getdbt.com/blog/get-to-know-the-new-dbt-fusion-engine-and-vs-code-extension). If it works with your project today, great! You should adopt it - you're in for a treat 😄 Likewise, if it's your first day using dbt, welcome! You should start on Fusion - you're in for a treat too.

Today – Launch Day – Day One – The Beginning of a New Era, we expect many teams with existing projects will encounter some issue or another which makes it challenging to adopt the dbt Fusion engine in production environments.

We're moving quickly to unblock more teams and are committing that by the time Fusion reaches general availability:

- We will support Snowflake, Databricks, BigQuery, Redshift, Athena, Postgres, Spark, and Trino with the new [Fusion Adapter pattern](/blog/dbt-fusion-engine-components#dbt-fusion-engine-adapters).
- We will have coverage for (basically) all dbt Core functionality.
  - Some things are impractical to replicate outside of Python, or so seldom-used that we'll be more reactive than proactive.
  - On the other hand, many existing dbt Core behaviours will be improved by the unique capabilities of the dbt Fusion engine (as detailed in their respective issues).
- The developer experience will be even more speedy and intuitive.
- The Source-available dbt-fusion repository will contain more total functionality than what is available in dbt Core today. ([Read more about this here](/blog/dbt-fusion-engine-components#ways-to-access).)

None of these statements are true *yet*, but you can see where things are heading. That's what betas are for, and why we want to have you all involved.

<!-- truncate -->

**We will be addding functionality rapidly over the coming weeks.** In particular, keep an eye out for Databricks, BigQuery and Redshift support (in that order) in the coming weeks.

So when is Fusion going to be GA? We're targeting later this year for the full GA release, but hoping to asymptotically approach that much sooner.

During the beta period you may run into unanticipated (and anticipated) issues when trying to run your project on Fusion. Please share any issues in the [dbt-fusion](https://github.com/dbt-labs/dbt-fusion) repository or on Slack in [#dbt-fusion-engine](https://getdbt.slack.com/archives/C088YCAB6GH), and we'll do our best to to unblock you.

## Can I use Fusion for my dbt project today?

Maybe! The biggest first question is “is your adapter supported yet?”. If so, it depends on the exact matrix of features you currently use in your dbt project.

You may be able to start using Fusion immediately, may need to make (mostly automatic) modifications to your project to resolve deprecations, or your project may not *yet* be parsable at all:

| State | Description | Workaround | Resolvable by |
| --- | --- | --- | --- |
| Unblocked | You can adopt the dbt Fusion engine with no changes to your project |  |  |
| Soft blocked | Your project parses successfully but relies on not-yet-implemented functionality | Don't invoke unsupported functions or build unsupported models | dbt Labs |
| Hard blocked by deprecations | Your project contains [functionality deprecated in dbt Core v1.10](https://www.getdbt.com/blog/how-to-get-ready-for-the-new-dbt-engine) | Resolve deprecations with the [dbt-autofix script](https://github.com/dbt-labs/dbt-autofix) or workflow in dbt Studio | Users |
| Hard blocked by known parse issues | Your project contains Python models or uses a not-yet-supported adapter | Temporarily remove Python models  | dbt Labs |
| Hard blocked by unknown parse issues | Your project is probably doing something surprising with Jinja | Create an issue, consider modifying impacted code | dbt Labs |

At a high level, we're continuously removing blockers to Fusion adoption on a rolling basis during this beta period and in the leadup to a broader release. This post will get into the details across these themes:

- Adapter coverage
- Feature coverage
- Source-available code publishing
- Developer Experience improvements

## Requirement for GA: Adapter Coverage

### Databricks, BigQuery and Redshift

dbt Fusion's adapters are now based on the [ADBC standard](https://arrow.apache.org/adbc/current/driver/status.html), a modern, high-performance Apache project optimised for columnar analytical databases.

dbt Labs has developed new ADBC-compatible drivers (and a [supporting framework, XDBC](/blog/dbt-fusion-engine-components#dbt-fusion-engine-adapters)) to complement the existing, stable Snowflake driver.

**Target release dates:** We expect to add support for [Databricks](https://github.com/dbt-labs/dbt-fusion/issues/4), [BigQuery](https://github.com/dbt-labs/dbt-fusion/issues/5), and [Redshift](https://github.com/dbt-labs/dbt-fusion/issues/6) (in that order) in the coming weeks.

### Athena, Postgres, Spark and Trino

These adapters are scheduled for support later in the year, prior to GA. Check each adapter's tracking issue ([Trino](https://github.com/dbt-labs/dbt-fusion/issues/39), [Athena](https://github.com/dbt-labs/dbt-fusion/issues/39), [Spark](https://github.com/dbt-labs/dbt-fusion/issues/38), and [Postgres](https://github.com/dbt-labs/dbt-fusion/issues/31)) for specific timelines.

### Custom adapters

The short answer: Fusion's new adapter format could be extended to support community development of third-party adapters, but it's not on the near-term roadmap ([tracking issue](https://github.com/dbt-labs/dbt-fusion/issues/46)).

The longer answer: Fusion now downloads necessary drivers (part of the adapter stack) on-demand. This dynamic linking requires the drivers to be signed by dbt Labs, meaning that we need to have a system in place to review contributions of new drivers and ensure their security.

In the meantime, if you want to migrate a supported project to the dbt Fusion engine but have a dependency on another project using a custom adapter, you can use a [Hybrid project](/docs/deploy/hybrid-setup) to have <Constant name="core" /> execute the unsupported part of the pipeline and then publish artifacts for downstream projects to consume.

## Requirement for GA: Feature coverage

Feature coverage includes ensuring documented features work as expected, as well as (where possible) supporting undocumented “accidental” features.

Most of the time, if your project uses an unimplemented feature, you can still start experimenting with Fusion. This is because as long as your project parses, you can just skip unsupported models.

### Known unimplemented features

#### Python models

Python models are the one exception to that “just skip them” advice. The dbt Fusion engine does not currently support parsing Python models, which means it can not extract refs or configs inside the files. Instead of potentially building models out of DAG order, **we've chosen to not support Python models at all for now**. They're coming back though - [check out the issue](https://github.com/dbt-labs/dbt-fusion/issues/3) for details.

#### Breadth of Materialization Support

As of today we support the most common materializations (`table`, `view`, `incremental`, `ephemeral`, `snapshot`). Other native strategies (like [microbatch incremental models](https://github.com/dbt-labs/dbt-fusion/issues/12), [iceberg tables](https://github.com/dbt-labs/dbt-fusion/issues/28), [materialized views/dynamic tables](https://github.com/dbt-labs/dbt-fusion/issues/27), or [stored test failures](https://github.com/dbt-labs/dbt-fusion/issues/15)) as well as [custom materializations](https://github.com/dbt-labs/dbt-fusion/issues/17) will be supported - check their respective issues to see when.

It's worth reiterating here: Even if you have models that rely on not-yet-supported materialization strategies, you can still try the dbt Fusion engine in the rest of your project. The rest of your DAG will build as normal, but unsupported strategies will raise an error if they are included in scope of `dbt build` or `dbt run`.

To exclude those nodes, use a command like

- `dbt build --exclude config.materialized:my_custom_mat`
- `dbt build --exclude config.incremental_strategy:microbatch`

#### Other common features

Did you know that there are over 400 documented features of dbt? [Doug](https://github.com/dbeatty10) does, because he had to put them all into a Notion database.

Fusion already supports two-thirds of them, and we have a plan for the rest. You can follow along at [the dbt-fusion repo](https://github.com/dbt-labs/dbt-fusion/issues), where there are issues to track the outstanding behaviours. There's also a rough set of milestones attached, but those are subject to reordering as more teams start using Fusion and giving feedback.

Some of the most relevant ones include:

- [Exposures](https://github.com/dbt-labs/dbt-fusion/issues/13)
- A new [Events + Logging System](https://github.com/dbt-labs/dbt-fusion/issues/7)
- A new [local documentation experience](https://github.com/dbt-labs/dbt-fusion/issues/9) that replaces dbt-docs (!)
- [Programmatic invocations](https://github.com/dbt-labs/dbt-fusion/issues/10)
- [Model governance](https://github.com/dbt-labs/dbt-fusion/issues/25) (contracts, constraints, access, deprecation_date)
- A grab bag of CLI commands like [`dbt clone`](https://github.com/dbt-labs/dbt-fusion/issues/22), [`state:modified.subselector`](https://github.com/dbt-labs/dbt-fusion/issues/33), [`--empty`](https://github.com/dbt-labs/dbt-fusion/issues/34)...

It's worth noting that *resolution* doesn't necessarily mean identical behaviours. As a couple of examples:

- Many of these behaviours have not been implemented yet because the Fusion engine introduces new capabilities (like SQL comprehension), which we will leverage to provide a superior experience, so a direct port would miss the point
- Others (like the events and logging system) are tightly coupled to dbt Core's Python roots, so will need to be rethought

Here's a point-in-time snapshot of how we expect to tackle the known remaining work. Please refer to the [repository's issues page](https://github.com/dbt-labs/dbt-fusion/issues) as the source of truth:

<Lightbox src="/img/blog/2025-05-28-dbt-fusion-engine-path-to-ga/indicative-timeline.png" title="An indication of the dbt Fusion engine's path to GA" width="100%" />

### Surprise unimplemented features

Did you know that there are also over a bajillion *undocumented* features of dbt? Since March, we've been validating the new engine's project parser against projects orchestrated by the dbt platform, which has flagged hundreds of divergent behaviours and common parse bugs.

But we also know there is a long tail of behaviours that will only arise in the wild, and that the easiest way to get to the bottom of them will be to work with users.

This will be an ongoing workstream; When you start using the Fusion engine, please [open an issue](https://github.com/dbt-labs/dbt-fusion/issues) (ideally with a basic reproduction project) if you hit an unexpected error.

## Requirement for GA: The Source-available `dbt-fusion` codebase is better than `dbt-core` for most use cases

By GA, the [dbt-fusion repository](https://github.com/dbt-labs/dbt-fusion) will contain the capabilities to be a drop in replacement for the vast majority of dbt Core projects, while delivering increased speed. That means that you will always have the ability to compile, use, and modify this code itself, without requiring access to the dbt Labs provided binary (although we think you'll probably just want to use the binary, for reasons detailed in the [Components of the dbt Fusion engine](/blog/dbt-fusion-engine-components) post).

So far, we've released the code necessary to self-compile a dbt binary that can run `dbt parse` and `dbt deps`. Throughout the beta period we will continue to prepare more code for use by those who want to view, contribute to or modify the code for their own purposes, including what's necessary for the rest of the commands to work.

Beyond just the code necessary to produce a complete dbt binary, we've also committed to releasing various infrastructure components to this repository (such as dbt-jinja, dbt-serde-yaml and the grammars necessary to produce a high-performance SQL parser). Again, check out the [Components of the dbt Fusion engine](/blog/dbt-fusion-engine-components) post for the details.

Some behaviours that worked in dbt Core won't have an equivalent in this new codebase. The most obvious examples are those which depended on the vagaries of Python: arbitrary callbacks on the EventManager (there's no longer an EventManager on which to register a callback!), the experimental [plugins system](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/plugins/manager.py) (dynamic loading of binaries works completely differently in Rust and would require signing), or the dbt templater in SQLFluff (which hooked into dbt Core beyond the exposed interfaces - although we plan to build a [fast linter ourselves](https://github.com/dbt-labs/dbt-fusion/issues/11)).

## Requirement for GA: The DX rocks

### More speed

Invocations powered by the dbt Fusion engine are already significantly faster than the same invocation in dbt Core, but there's more to do here! We know that there is still a lot of low-hanging fruit, and by GA we expect to see tasks like full project compilation complete at least twice as fast again.

If you do some benchmarking, we're particularly interested in any situations where Fusion “pauses” on a single file for a couple of seconds. Some other things to keep in mind:

- Writing very large manifests is pretty slow, no matter what. Try including `--no-write-json`. We're wondering whether it makes sense to have a more cut-down manifest by default. What do you think?
- The `dbt compile` command involves more work in Fusion than in dbt Core, because it's doing full SQL validation. To compare *just* the SQL rendering step (the equivalent of dbt Core's `compile` command), pass the `--static-analysis off` flag.

As a sign of what's possible, take note of the incremental recompilation used to provide real-time feedback in the VS Code extension.

### A more info-dense console output

The CLI output displays *everything* that's happening, which means errors and warnings can be pushed out of view by other status updates. We need to [clear this up a bit](https://github.com/dbt-labs/dbt-fusion/issues/52): In general, we're thinking that parsing and compilation will change to a progress bar, so you'll only see log lines about things that need attention.

### Your idea here

What feels *off* when you're using dbt Fusion? Tell us all about it - if you've got a clear idea for what's wrong and what it should be instead, feel free to jump straight to a GitHub issue. Bonus points if you've got a minimal repro project.

If you need to kick an idea around before opening an issue, we'll also be actively checking in on #dbt-fusion-engine (for high-level discussions) and #dbt-fusion-engine-migration (to get into the weeds of a specific bug) on Slack.

From now until Fusion is GA, we will be prioritizing parity with existing framework features, *not adding new ones.* Post-GA, we will transfer existing framework feature requests from the dbt-core repo to dbt-fusion.

## Following along

The path to GA for Fusion is a Community-wide effort. We want to hear from you, work with you, get your ideas and feedback. Whether it is sharing a bug report, an idea for a feature or more high level thoughts and feedback, we're looking to engage with you.

- In Slack, we're on [#dbt-fusion-engine](https://getdbt.slack.com/archives/C088YCAB6GH) and #dbt-fusion-engine-migration
- The GitHub repo is [https://github.com/dbt-labs/dbt-fusion](https://github.com/dbt-labs/dbt-fusion)
- There are a couple of dozen *dbt World Circuit* meetups happening globally during June: [https://www.meetup.com/pro/dbt/](https://www.meetup.com/pro/dbt/)
- We'll be having regular office hours with a revolving cast of characters from the Developer Experience, Engineering, and Product teams. Dates will be circulated in the #dbt-fusion-engine channel.
