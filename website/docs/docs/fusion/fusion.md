---
title: "The dbt Fusion engine"
id: "fusion"
description: "Fusion is the next-generation engine and development experience for dbt projects."
pagination_next: "docs/fusion/about-fusion"
pagination_prev: "docs/introduction"
---

<Constant name="fusion" /> is the next-generation engine built on Rust, that powers development across the <Constant name="dbt_platform" />,  <Constant name="core" />, and the VS Code extension.

It’s faster, smarter, and more consistent &mdash; bringing static analysis, autocomplete, instant feedback &mdash; to every dbt workflow, and a deeply integrated VS Code experience powered by a [Language Server Protocol (LSP)](https://docs.getdbt.com/blog/dbt-fusion-engine-components#the-dbt-vs-code-extension-and-language-server).

## Getting started
Fusion is integrated in many different ways across the dbt ecosystem &mdash; in the <Constant name="dbt_platform" />, in VS Code, or from <Constant name="core" />. All of these use the same next-generation Fusion engine, but the features and experience differ depending on where you develop.

### Where and how to use Fusion

Fusion powers every way you work with dbt — in dbt Cloud, in VS Code, or from the command line.  
All three use the same next-generation Fusion engine, but the features and experience differ depending on where you develop. If you're not sure where to begin, check out the table to see which option is best for you.

| How you use dbt | What to use | Compatible with | What Fusion powers | Learn more |
| --- | --- | --- | --- | --- |
| <Constant name="dbt_platform" /> | [<Constant name="cloud_ide" />](/docs/cloud-ide) or [<Constant name="visual_editor" />](/docs/cloud/canvas)<br /> Fusion is built in automatically. | <Constant name="dbt_platform" /> <Constant name="core" /> projects | - Fast, reliable compilation, static analysis, validation, and job execution. <br /> - Visual and interactive features like autocomplete, inline errors, model previews, lineage, and instant feedback. | Learn more about [<Constant name="fusion" /> in the dbt platform](/docs/fusion/install-fusion) |
| VS Code or Cursor |  [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt) | <Constant name="dbt_platform" />  projects<br /> <Constant name="dbt_core" /> projects | Fast, reliable compilation, static analysis, validation, and job execution. <br /> Visual and interactive features like autocomplete, inline errors, model previews, lineage, and instant feedback. | Learn more about the [dbt extension for VSCode](/docs/install-dbt-extension) |
| From the command line | [Fusion CLI](/docs/fusion/install-fusion-cli) Completely free to use (except for commercial competitors). | <Constant name="dbt_platform" />  projects<br /> <Constant name="core" />  projects | Performance-focused Fusion engine for `parse`, `compile`, `build`, `run`, and related commands. <br /> No visual features like autocomplete, inline errors, model previews, lineage, and instant feedback. | Learn more about the [Fusion CLI](/docs/fusion/install-fusion-cli) |

---

### Notes

- 💡 **Fusion CLI is free** for all dbt users and organizations (unless competing directly with dbt Cloud).  
- 🧠 **dbt Cloud and the VS Code extension** offer the richest Fusion experience, with visual and interactive features p


## How it works

At a glance, <Constant name="fusion_engine" /> is the engine that powers the modern dbt developer experience across <Constant name="core" />, the dbt platform (including features like <Constant name="studio" />, state-aware orchestration, and more), and the VS Code extension.

It brings static analysis and faster, more consistent compilation to every environment where you build with dbt.

Under the hood, Fusion:

Parses and analyzes your dbt project statically

Renders Jinja into SQL safely and predictably

Builds dependency graphs between models, macros, and sources

Generates and validates dbt artifacts

Communicates efficiently with your data platform for compilation and execution

Those capabilities live inside the Fusion Engine, which is the foundation for all Fusion experiences:

ADD DIAGRAM HERE

## Supported environments


## Paths
